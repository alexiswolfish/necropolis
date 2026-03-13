/**
 * Assigns character classes to all players and writes to the database.
 *
 * Usage:
 *   node scripts/assign-classes-v2.js                        # prompt per team, write on confirm
 *   node scripts/assign-classes-v2.js --dry-run              # preview all teams, write nothing
 *   node scripts/assign-classes-v2.js --concord <id>         # one team only, prompt to write
 *   node scripts/assign-classes-v2.js --concord <id> --dry-run  # preview one team only
 *
 * Algorithm (one concord at a time):
 *   0. NPCs (excluded_from_count) get "npc" and are skipped.
 *      Hardcoded wizard IDs get "wizard" and are skipped.
 *      Statless players get "peasant" and are skipped.
 *   1. Score every (player, class) pair. Pick the highest-scoring pair first;
 *      each player and each class slot can only be taken once. This ensures
 *      every player ends up in their globally best class. Tiebreak order:
 *        a. Highest primary stat
 *        b. Highest secondary stat total  (if a ties)
 *        c. Highest dumbLuck              (if b ties)
 *        d. Earliest completed_at         (if c ties — first-played wins)
 *   2. Unassigned competitive players become peasant.
 *   3. RSVP-matched peasants with any stat >= 4 are promoted into a second copy of their
 *      best class (by primary stat), subject to a 2-player-per-class cap.
 *      If their target class is full, they fall back to the class that lists
 *      their primary stat as one of its secondary stats (rule 9).
 *      If that is also full, they stay peasant.
 */

import { readFileSync } from "fs";
import { createInterface } from "readline";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// ---------------------------------------------------------------------------
// Config
// ---------------------------------------------------------------------------

function loadEnv() {
  const envPath = path.join(__dirname, "../.env.local");
  const env = {};
  for (const line of readFileSync(envPath, "utf8").split("\n")) {
    const match = line.match(/^([^#=][^=]*)=(.*)$/);
    if (match) env[match[1].trim()] = match[2].trim();
  }
  return env;
}

const env = loadEnv();
const SUPABASE_URL = env.VITE_SUPABASE_URL;
const SUPABASE_KEY = env.VITE_SUPABASE_PUBLISHABLE_KEY;
// Service role key bypasses RLS — required for writes. Read-only operations
// (fetching characters/concords) still use the publishable key.
const SUPABASE_SERVICE_KEY = env.VITE_SUPABASE_SERVICE_KEY;

const NECROPOLIS_CLASSES = JSON.parse(
  readFileSync(path.join(__dirname, "../src/data/necropolisClasses.json"), "utf8")
);

// "Competitive" classes are the ones that participate in scoring.
// "peasant" and "npc" are fallback/special-case tags and are not scored.
const COMPETITIVE_CLASSES = NECROPOLIS_CLASSES.filter((c) => c.primaryStat !== null);
const PEASANT_TAG = "peasant";
const NPC_TAG = "npc";
const WIZARD_TAG = "wizard";
const WIZARD_CLASS_ID = "sepulchral-mage";

// Manually pre-assigned wizards — one per concord, by player ID.
// These players skip the normal algorithm and always get wizard.
//
// Important: this is id-based, not name-based. If a player's row is deleted
// and recreated with a new id, this override will stop applying until this list
// is updated.
const WIZARD_IDS = new Set([
  "7f6ff7d4-b37e-4ab5-a59c-1bf714ce1cfd", // Gianni          — desire-conspire
  "9c8ddcf2-b817-4444-a8a3-8200389032da", // Marco Dyer      — pleasure-treasure
  "e4eb9a96-c793-4eb0-9942-bd5f51267981", // Jonas           — brood-feud
  "af757a0f-66a2-46a1-8695-f32a9ba4c6b7", // Aaron Hubbard   — zeal-steel
  "36bea25c-9732-45c9-abe1-fbac7dab74b1", // Ruby            — tears-spears
  "c24d2804-69b0-4214-adc8-ba0a1f734dd9", // Jared           — veils-sails
  "8b79ffc4-7ea4-40ce-9175-dc75def04ae2", // Diana           — laurels-quarrels
  "98ced73b-7477-4c02-a53d-680f2aad1fbe", // Kelly Wong      — wit-spit
]);

// ---------------------------------------------------------------------------
// Supabase REST helper
// ---------------------------------------------------------------------------

async function supabaseRequest(table, { method = "GET", query, body, headers } = {}) {
  const url = new URL(`${SUPABASE_URL}/rest/v1/${table}`);
  if (query) {
    for (const [key, value] of Object.entries(query)) {
      if (value !== undefined && value !== null) url.searchParams.set(key, value);
    }
  }
  const response = await fetch(url.toString(), {
    method,
    headers: {
      apikey: SUPABASE_KEY,
      Authorization: `Bearer ${SUPABASE_KEY}`,
      "Content-Type": "application/json",
      ...(headers ?? {})
    },
    body: body === undefined ? undefined : JSON.stringify(body)
  });
  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(`Supabase error (${response.status}): ${payload?.message ?? response.statusText}`);
  }
  if (response.status === 204) return null;
  return response.json();
}

async function fetchAllCharacters() {
  const rows = await supabaseRequest("characters", {
    query: {
      select: "id,real_name,concord_id,class_name,stats,excluded_from_count,rsvp_matched,completed_at",
      order: "completed_at.asc"
    }
  });
  return rows.map((row) => ({
    id: row.id,
    realName: row.real_name,
    concordId: row.concord_id,
    className: row.class_name,
    stats: row.stats,
    excludedFromCount: row.excluded_from_count ?? false,
    rsvpMatched: row.rsvp_matched ?? true,
    completedAt: row.completed_at ?? null
  }));
}

// ---------------------------------------------------------------------------
// Assignment logic
// ---------------------------------------------------------------------------

function assignNecroClasses(members) {
  // Final output for this concord: player id -> class tag.
  const result = new Map(); // id → tag string

  // Track how many players hold each class tag across both passes.
  // Used in pass 2 to enforce the 2-player-per-class cap.
  const classCounts = new Map(); // tag → count

  // -------------------------------------------------------------------------
  // Pass 0: NPCs and hardcoded wizards.
  // These skip the main algorithm entirely.
  // -------------------------------------------------------------------------
  const competitive = []; // players who enter the scored assignment pass

  for (const member of members) {
    // NPCs do not participate in assignment at all.
    if (member.excludedFromCount) {
      result.set(member.id, NPC_TAG);
      continue;
    }

    // Forced wizards skip scoring entirely.
    if (WIZARD_IDS.has(member.id)) {
      result.set(member.id, WIZARD_TAG);
      classCounts.set(WIZARD_TAG, (classCounts.get(WIZARD_TAG) ?? 0) + 1);
      continue;
    }

    const stats = member.stats ?? {};
    const vals = Object.values(stats).map((v) => Number(v ?? 0));
    // Completely statless characters cannot win a real class.
    if (Math.max(0, ...vals) === 0) {
      result.set(member.id, PEASANT_TAG);
      continue;
    }

    competitive.push(member);
  }

  // -------------------------------------------------------------------------
  // Pass 1: Global greedy assignment.
  //
  // Score every (player, class) pair, then pick the highest-scoring pair first.
  // Each player can win at most one class; each class slot can be filled once.
  //
  // This ensures a player always lands in their globally best class — e.g. a
  // player whose druid stats beat their fighter stats will always go to druid,
  // regardless of which class happens to be processed first.
  //
  // Pairs are sorted by a strict lexicographic key — no blended score:
  //   1. Highest primary stat value
  //   2. Highest secondary stat total  (if primary tied)
  //   3. Highest dumbLuck              (if secondary also tied)
  //   4. Earliest completed_at         (if dumbLuck also tied — first-played wins)
  //   5. Lexical class id              (deterministic final tiebreak)
  // -------------------------------------------------------------------------
  const nonWizardClasses = COMPETITIVE_CLASSES.filter((c) => c.id !== WIZARD_CLASS_ID);
  const assignedPlayers = new Set([...result.keys()]);

  // Build all (player, class) pairs with their tiebreak values.
  const pairs = [];
  for (const member of competitive) {
    const stats = member.stats ?? {};
    const dumbLuck = Number(stats.dumbLuck ?? 0);
    const completedAt = member.completedAt ?? "\uffff";
    for (const cls of nonWizardClasses) {
      const primary = Number(stats[cls.primaryStat] ?? 0);
      const secondary = cls.secondaryStats.reduce((sum, s) => sum + Number(stats[s] ?? 0), 0);
      pairs.push({ memberId: member.id, cls, primary, secondary, dumbLuck, completedAt });
    }
  }

  // Sort highest-first by the lexicographic key.
  pairs.sort((a, b) => {
    if (b.primary !== a.primary) return b.primary - a.primary;
    if (b.secondary !== a.secondary) return b.secondary - a.secondary;
    if (b.dumbLuck !== a.dumbLuck) return b.dumbLuck - a.dumbLuck;
    const timeDiff = a.completedAt.localeCompare(b.completedAt);
    if (timeDiff !== 0) return timeDiff;
    return a.cls.id.localeCompare(b.cls.id);
  });

  const assignedClasses = new Set(
    [...result.entries()].filter(([, tag]) => tag === WIZARD_TAG).map(() => WIZARD_CLASS_ID)
  );

  for (const { memberId, cls, cls: { id: clsId, tag } } of pairs) {
    if (assignedPlayers.has(memberId) || assignedClasses.has(clsId)) continue;
    result.set(memberId, tag);
    assignedPlayers.add(memberId);
    assignedClasses.add(clsId);
    classCounts.set(tag, (classCounts.get(tag) ?? 0) + 1);
  }

  // Anyone who was eligible for scoring but lost every unique slot falls back
  // to peasant for now.
  for (const member of competitive) {
    if (!result.has(member.id)) result.set(member.id, PEASANT_TAG);
  }

  // -------------------------------------------------------------------------
  // Pass 2: Promote qualified peasants into duplicate classes.
  //
  // Eligibility:
  //   - currently peasant
  //   - at least one stat >= 4
  //
  // Promotion target: non-wizard class whose primary stat value is highest for
  // this player. Tiebreak: highest secondary stat total.
  //
  // Cap: each class holds at most 2 players.
  //   - If the target class is full (count >= 2), fall back to the class whose
  //     secondaryStats list includes the target's primary stat (rule 9).
  //   - If that class is also full, the player stays peasant.
  // -------------------------------------------------------------------------
  for (const member of members) {
    if (result.get(member.id) !== PEASANT_TAG) continue;

    const stats = member.stats ?? {};
    const vals = Object.values(stats).map((v) => Number(v ?? 0));
    if (Math.max(0, ...vals) < 4) continue; // not qualified

    // Find the non-wizard class that best fits this peasant (by primary stat).
    let bestCls = null;
    let bestPrimary = -Infinity;
    let bestSecondary = -Infinity;

    for (const cls of nonWizardClasses) {
      const primary = Number(stats[cls.primaryStat] ?? 0);
      const secondary = cls.secondaryStats.reduce((sum, s) => sum + Number(stats[s] ?? 0), 0);

      const isBetter =
        primary > bestPrimary ||
        (primary === bestPrimary && secondary > bestSecondary);

      if (isBetter) {
        bestCls = cls;
        bestPrimary = primary;
        bestSecondary = secondary;
      }
    }

    if (!bestCls) continue;

    if ((classCounts.get(bestCls.tag) ?? 0) < 2) {
      // Slot available — promote directly.
      result.set(member.id, bestCls.tag);
      classCounts.set(bestCls.tag, (classCounts.get(bestCls.tag) ?? 0) + 1);
    } else {
      // Rule 9: class is full — find a class where bestCls's primary stat
      // appears as a secondary stat, and that class still has a slot open.
      const fallbackCls = nonWizardClasses.find(
        (cls) =>
          cls.id !== bestCls.id &&
          cls.secondaryStats.includes(bestCls.primaryStat) &&
          (classCounts.get(cls.tag) ?? 0) < 2
      );
      if (fallbackCls) {
        result.set(member.id, fallbackCls.tag);
        classCounts.set(fallbackCls.tag, (classCounts.get(fallbackCls.tag) ?? 0) + 1);
      }
      // No fallback available — stays peasant.
    }
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

// Parse flags.
const dryRun = process.argv.includes("--dry-run");
const concordFlagIdx = process.argv.indexOf("--concord");
const concordFilter = concordFlagIdx !== -1 ? process.argv[concordFlagIdx + 1] : null;

// Fetch concord names for display. Fails gracefully — not all deployments
// may have a concords table or name column available.
async function fetchConcordNames() {
  try {
    const rows = await supabaseRequest("concords", { query: { select: "id,name" } });
    return new Map(rows.map((r) => [r.id, r.name ?? r.id]));
  } catch {
    return new Map();
  }
}

// Prompt helper — creates and closes a readline interface per call so it
// works cleanly at the top level without holding stdin open between prompts.
function prompt(question) {
  const rl = createInterface({ input: process.stdin, output: process.stdout });
  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer.trim().toLowerCase());
    });
  });
}

async function writeChanges(changes, assignments) {
  if (!SUPABASE_SERVICE_KEY) {
    throw new Error("VITE_SUPABASE_SERVICE_KEY is not set in .env.local — required for writes.");
  }
  for (const c of changes) {
    await supabaseRequest("characters", {
      method: "PATCH",
      query: { id: `eq.${c.id}` },
      headers: {
        Prefer: "return=minimal",
        apikey: SUPABASE_SERVICE_KEY,
        Authorization: `Bearer ${SUPABASE_SERVICE_KEY}`
      },
      body: { class_name: assignments.get(c.id) }
    });
  }
}

console.log("Fetching characters…");
const [characters, concordNames] = await Promise.all([fetchAllCharacters(), fetchConcordNames()]);
console.log(`${characters.length} characters found.\n`);

// Group into concords, applying the --concord filter if present.
const byConcord = {};
for (const c of characters) {
  const name = concordNames.get(c.concordId) ?? c.concordId;
  if (concordFilter && c.concordId !== concordFilter && name !== concordFilter) continue;
  if (!byConcord[c.concordId]) byConcord[c.concordId] = [];
  byConcord[c.concordId].push(c);
}

if (concordFilter && Object.keys(byConcord).length === 0) {
  console.error(`No concord found matching "${concordFilter}".`);
  process.exit(1);
}

// Compute assignments for every included concord.
const assignments = new Map(); // id → computed tag
for (const members of Object.values(byConcord)) {
  for (const [id, tag] of assignNecroClasses(members)) {
    assignments.set(id, tag);
  }
}

// Build per-concord change lists.
const changesByConcord = [];
for (const [concordId, members] of Object.entries(byConcord)) {
  const changes = members.filter((c) => assignments.get(c.id) !== c.className);
  if (changes.length > 0) changesByConcord.push({ concordId, changes });
}

if (changesByConcord.length === 0) {
  console.log("All classes are already up to date.");
  process.exit(0);
}

// Display and optionally commit one concord at a time.
for (const { concordId, changes } of changesByConcord) {
  const label = concordNames.get(concordId) ?? concordId;
  console.log(`── ${label} (${changes.length} change${changes.length === 1 ? "" : "s"}) ──`);
  for (const c of changes) {
    const oldTag = c.className ?? "(none)";
    const newTag = assignments.get(c.id);
    console.log(`  ${c.realName.padEnd(30)} ${oldTag.padEnd(12)} → ${newTag}`);
  }

  if (dryRun) {
    console.log();
    continue;
  }

  const answer = await prompt(`Write these changes? [y/N/q]: `);
  if (answer === "q") {
    console.log("Quit.");
    process.exit(0);
  }
  if (answer === "y") {
    await writeChanges(changes, assignments);
    console.log("Written.\n");
  } else {
    console.log("Skipped.\n");
  }
}

if (dryRun) console.log("Dry run — nothing written.");
