/**
 * Assigns character classes to all players and writes to the database.
 *
 * Usage:
 *   node scripts/assign-classes.js             # assign and write
 *   node scripts/assign-classes.js --dry-run   # preview only
 *
 * This file is the class assignment script:
 *   /Users/wolfe/code/necropolis/scripts/assign-classes.js
 *
 * Read this top-to-bottom as:
 *   1. Load env / class config.
 *   2. Fetch every character row from Supabase.
 *   3. Compute one set of class assignments per concord/team.
 *   4. Diff the computed classes against the DB.
 *   5. Print the diff, and optionally PATCH the changed rows.
 */

import { readFileSync } from "fs";
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
// The algorithm runs one concord at a time.
//
// Current model:
//   - NPCs are excluded.
//   - Forced wizards are assigned first and reserve the wizard slot.
//   - Everyone else competes for the remaining unique class slots.
//   - If someone doesn't win a slot, they temporarily become peasant.
//   - Second pass: some peasants can be promoted into duplicate non-wizard classes.
//
// This is a greedy algorithm, not a globally optimized one. That means it can
// produce surprising outcomes when ties happen or when the second pass ignores
// which classes are already present on the team.

function assignNecroClasses(members) {
  // Final output for this concord: player id -> class tag.
  const result = new Map(); // id → tag string

  // Players who survive the early special-case checks and are allowed into the
  // main scored assignment pass.
  const competitive = [];

  // Track which unique class slots are already taken in the first pass.
  // `assignedClasses` is keyed by class id (e.g. "sepulchral-mage"), not tag.
  //
  // If we have a forced wizard, we reserve the wizard slot here before scoring
  // anyone else so the greedy pass cannot hand wizard to another player.
  const assignedClasses = new Set();
  const assignedPlayers = new Set();

  for (const member of members) {
    // NPCs do not participate in assignment at all.
    if (member.excludedFromCount) {
      result.set(member.id, NPC_TAG);
      continue;
    }

    // Forced wizards skip scoring entirely.
    if (WIZARD_IDS.has(member.id)) {
      result.set(member.id, WIZARD_TAG);
      assignedClasses.add(WIZARD_CLASS_ID);
      assignedPlayers.add(member.id);
      continue;
    }

    const stats = member.stats ?? {};
    const vals = Object.entries(stats).map(([, v]) => Number(v ?? 0));
    const maxVal = Math.max(0, ...vals);
    // Completely statless characters cannot win a real class.
    if (maxVal === 0) {
      result.set(member.id, PEASANT_TAG);
      continue;
    }

    // Everyone else enters the main competitive pool.
    competitive.push(member);
  }

  // Score every (player, class) pair.
  //
  // Formula:
  //   primary * 10 + sum(secondaries) + dumbLuck * 0.5
  //
  // Primary stat dominates. Secondary stats matter, but much less.
  // dumbLuck is a small bonus that can break close contests.
  const completedAtById = new Map(competitive.map((m) => [m.id, m.completedAt ?? ""]));
  const pairs = [];
  for (const member of competitive) {
    const stats = member.stats ?? {};
    const dumbLuck = Number(stats.dumbLuck ?? 0);
    for (const cls of COMPETITIVE_CLASSES) {
      const primary = Number(stats[cls.primaryStat] ?? 0);
      const secondary = cls.secondaryStats.reduce((sum, s) => sum + Number(stats[s] ?? 0), 0);
      const score = primary * 10 + secondary + dumbLuck * 0.5;
      pairs.push({ memberId: member.id, cls, score });
    }
  }

  // Greedy assignment:
  //   - highest score pair wins first
  //   - each player can win only one class in this pass
  //   - each class slot can be used only once in this pass
  //
  // Wizard is already reserved if a forced wizard exists.
  //
  // Tiebreaks:
  //   1. Higher score
  //   2. Earlier completed_at timestamp
  //   3. Lexical class id
  pairs.sort((a, b) => {
    const scoreDiff = b.score - a.score;
    if (scoreDiff !== 0) return scoreDiff;
    const timeDiff = (completedAtById.get(a.memberId) ?? "").localeCompare(completedAtById.get(b.memberId) ?? "");
    if (timeDiff !== 0) return timeDiff;
    return a.cls.id.localeCompare(b.cls.id);
  });

  for (const { memberId, cls } of pairs) {
    if (assignedPlayers.has(memberId) || assignedClasses.has(cls.id)) continue;
    result.set(memberId, cls.tag);
    assignedPlayers.add(memberId);
    assignedClasses.add(cls.id);
  }

  // Anyone who was eligible for scoring but lost every unique slot falls back
  // to peasant for now.
  for (const member of competitive) {
    if (!result.has(member.id)) result.set(member.id, PEASANT_TAG);
  }

  // Second pass:
  //   promote some peasants into duplicate non-wizard classes.
  //
  // Important caveats:
  //   - This pass does NOT care whether the class is already present on the team.
  //   - It simply picks the player's best non-wizard score in isolation.
  //   - That is why this pass can produce "why did this person become another bard
  //     when the team already had one?" style results.
  //
  // Rule:
  //   - player must currently be peasant
  //   - player must be RSVP matched
  //   - player must have at least one stat at 4 or above
  //
  // Wizard is excluded here because there should only be one wizard per team.
  const nonWizardClasses = COMPETITIVE_CLASSES.filter((c) => c.id !== WIZARD_CLASS_ID);
  for (const member of members) {
    if (result.get(member.id) !== PEASANT_TAG) continue;
    if (!member.rsvpMatched) continue;
    const stats = member.stats ?? {};
    const vals = Object.entries(stats).map(([, v]) => Number(v ?? 0));
    if (Math.max(0, ...vals) < 4) continue;
    const dumbLuck = Number(stats.dumbLuck ?? 0);
    let bestCls = null;
    let bestScore = -Infinity;
    for (const cls of nonWizardClasses) {
      const primary = Number(stats[cls.primaryStat] ?? 0);
      const secondary = cls.secondaryStats.reduce((sum, s) => sum + Number(stats[s] ?? 0), 0);
      const score = primary * 10 + secondary + dumbLuck * 0.5;
      // Strictly greater only.
      // If two classes tie, the earlier class in `nonWizardClasses` wins because
      // we do not replace the current winner on equality.
      if (score > bestScore) { bestScore = score; bestCls = cls; }
    }
    if (bestCls) result.set(member.id, bestCls.tag);
  }

  return result;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------
// This section does no scoring itself.
// It simply computes assignments, diffs them against the DB, prints the diff,
// and optionally writes the changed class_name values back to Supabase.

const dryRun = process.argv.includes("--dry-run");

console.log(`Fetching characters…`);
const characters = await fetchAllCharacters();
console.log(`${characters.length} characters found.\n`);

// Each concord is assigned independently.
const byConcord = {};
for (const c of characters) {
  if (!byConcord[c.concordId]) byConcord[c.concordId] = [];
  byConcord[c.concordId].push(c);
}

const assignments = new Map(); // id → computed tag
for (const members of Object.values(byConcord)) {
  for (const [id, tag] of assignNecroClasses(members)) {
    assignments.set(id, tag);
  }
}

// Only rows whose computed class differs from the DB are considered changes.
const changes = characters.filter((c) => assignments.get(c.id) !== c.className);

if (changes.length === 0) {
  console.log("All classes are already up to date.");
  process.exit(0);
}

console.log(`${changes.length} change${changes.length === 1 ? "" : "s"}:`);
for (const c of changes) {
  const oldTag = c.className ?? "(none)";
  const newTag = assignments.get(c.id);
  console.log(`  ${c.realName.padEnd(30)} ${oldTag.padEnd(12)} → ${newTag}`);
}

if (dryRun) {
  console.log("\nDry run — nothing written.");
  process.exit(0);
}

console.log("\nWriting…");
for (const c of changes) {
  await supabaseRequest("characters", {
    method: "PATCH",
    query: { id: `eq.${c.id}` },
    headers: { Prefer: "return=minimal" },
    body: { class_name: assignments.get(c.id) }
  });
}
console.log("Done.");
