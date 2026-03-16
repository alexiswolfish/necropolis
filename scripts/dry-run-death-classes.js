/**
 * Dry-run class assignment for the Death concord (excluded_from_count members).
 * Treats them as competitive players to see what classes they'd earn.
 * Read-only — nothing is written.
 *
 * Scoring: blended (primary + secondary sum), with primary used as tiebreak
 * so that a player with low primary never wins a class purely by attrition.
 *
 * Usage: node scripts/dry-run-death-classes.js
 */

import { readFileSync } from "fs";
import { fileURLToPath } from "url";
import path from "path";

const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
const COMPETITIVE_CLASSES = NECROPOLIS_CLASSES.filter((c) => c.primaryStat !== null);
const PEASANT_TAG = "peasant";
const WIZARD_TAG = "wizard";
const WIZARD_CLASS_ID = "sepulchral-mage";

const WIZARD_IDS = new Set([
  "5bd37ecd-5853-42d6-b8b9-bb96518d9269", // em king
  "4c31f8e3-5c1c-4406-9ba7-91f88ab2848f", // Shane
]);

async function fetchNpcs() {
  const url = new URL(`${SUPABASE_URL}/rest/v1/characters`);
  url.searchParams.set("select", "id,real_name,class_name,stats,completed_at");
  url.searchParams.set("excluded_from_count", "eq.true");
  url.searchParams.set("order", "completed_at.asc");
  const res = await fetch(url.toString(), {
    headers: { apikey: SUPABASE_KEY, Authorization: `Bearer ${SUPABASE_KEY}` }
  });
  if (!res.ok) throw new Error(`Supabase error: ${res.status}`);
  return res.json();
}

function scoreFor(stats, cls) {
  const primary = Number(stats[cls.primaryStat] ?? 0);
  const secondary = cls.secondaryStats.reduce((sum, s) => sum + Number(stats[s] ?? 0), 0);
  return { primary, secondary, blended: primary + secondary };
}

function assignClasses(members, nameById) {
  const result = new Map();
  const classCounts = new Map();
  const competitive = [];

  for (const m of members) {
    if (WIZARD_IDS.has(m.id)) {
      result.set(m.id, WIZARD_TAG);
      continue;
    }
    const vals = Object.values(m.stats ?? {}).map((v) => Number(v ?? 0));
    if (Math.max(0, ...vals) === 0) {
      result.set(m.id, PEASANT_TAG);
    } else {
      competitive.push(m);
    }
  }

  const nonWizardClasses = COMPETITIVE_CLASSES.filter((c) => c.id !== WIZARD_CLASS_ID);
  const assignedPlayers = new Set(result.keys());
  const assignedClasses = new Set();

  // Build all (player, class) pairs scored by blended value.
  // Sort: blended desc → primary desc (so low-primary can't sneak in) → dumbLuck desc → completedAt asc → cls.id asc
  const pairs = [];
  for (const m of competitive) {
    const stats = m.stats ?? {};
    const dumbLuck = Number(stats.dumbLuck ?? 0);
    const completedAt = m.completedAt ?? "\uffff";
    for (const cls of nonWizardClasses) {
      const { primary, secondary, blended } = scoreFor(stats, cls);
      pairs.push({ memberId: m.id, cls, primary, secondary, blended, dumbLuck, completedAt });
    }
  }

  pairs.sort((a, b) => {
    if (b.blended !== a.blended) return b.blended - a.blended;
    if (b.primary !== a.primary) return b.primary - a.primary;
    if (b.dumbLuck !== a.dumbLuck) return b.dumbLuck - a.dumbLuck;
    const t = a.completedAt.localeCompare(b.completedAt);
    if (t !== 0) return t;
    return a.cls.id.localeCompare(b.cls.id);
  });

  // --- Pass 1 ---
  console.log("── Pass 1: greedy best-fit by blended score (one winner per class slot) ──\n");
  let pass1Count = 0;
  for (const { memberId, cls, primary, secondary, blended } of pairs) {
    const name = nameById.get(memberId);
    if (assignedPlayers.has(memberId) && assignedClasses.has(cls.id)) continue;
    if (assignedPlayers.has(memberId)) {
      console.log(`  skip  ${name.padEnd(22)} → ${cls.tag.padEnd(10)} (player already assigned)`);
      continue;
    }
    if (assignedClasses.has(cls.id)) {
      console.log(`  skip  ${name.padEnd(22)} → ${cls.tag.padEnd(10)} (class slot taken)`);
      continue;
    }
    result.set(memberId, cls.tag);
    assignedPlayers.add(memberId);
    assignedClasses.add(cls.id);
    classCounts.set(cls.tag, (classCounts.get(cls.tag) ?? 0) + 1);
    console.log(`  ✓     ${name.padEnd(22)} → ${cls.tag.padEnd(10)} (blended=${blended}: ${cls.primaryStat}=${primary}, sec=${secondary})`);
    pass1Count++;
    if (pass1Count === nonWizardClasses.length) break;
  }

  for (const m of competitive) {
    if (!result.has(m.id)) {
      result.set(m.id, PEASANT_TAG);
      console.log(`  –     ${nameById.get(m.id).padEnd(22)} → peasant   (no slot won)`);
    }
  }

  // --- Pass 2 ---
  console.log("\n── Pass 2: promote qualified peasants into best available slot (cap 2/class) ──\n");
  for (const m of members) {
    if (result.get(m.id) !== PEASANT_TAG) continue;
    const name = nameById.get(m.id);
    const stats = m.stats ?? {};
    const vals = Object.values(stats).map((v) => Number(v ?? 0));
    if (Math.max(0, ...vals) < 4) {
      console.log(`  skip  ${name.padEnd(22)}  (max stat ${Math.max(0, ...vals)} < 4, not qualified)`);
      continue;
    }

    // Pick the best available (not full) class by blended score, with primary as tiebreak.
    let bestCls = null, bestBlended = -Infinity, bestPrimary = -Infinity;
    for (const cls of nonWizardClasses) {
      if ((classCounts.get(cls.tag) ?? 0) >= 3) continue;
      const { primary, blended } = scoreFor(stats, cls);
      if (
        blended > bestBlended ||
        (blended === bestBlended && primary > bestPrimary)
      ) {
        bestCls = cls; bestBlended = blended; bestPrimary = primary;
      }
    }

    if (!bestCls) {
      console.log(`  –     ${name.padEnd(22)} → peasant   (all classes full)`);
      continue;
    }

    const slot = (classCounts.get(bestCls.tag) ?? 0) + 1;
    const { primary, secondary } = scoreFor(stats, bestCls);
    result.set(m.id, bestCls.tag);
    classCounts.set(bestCls.tag, slot);
    console.log(`  ✓     ${name.padEnd(22)} → ${bestCls.tag.padEnd(10)} (blended=${bestBlended}: ${bestCls.primaryStat}=${primary}, sec=${secondary}, slot ${slot}/3)`);
  }

  return result;
}

const rows = await fetchNpcs();
const members = rows.map((r) => ({
  id: r.id,
  realName: r.real_name,
  className: r.class_name,
  stats: r.stats ?? {},
  completedAt: r.completed_at ?? null
}));

const nameById = new Map(members.map((m) => [m.id, m.realName]));

console.log(`\nDeath concord — ${members.length} members (dry run, nothing written)\n`);

const assignments = assignClasses(members, nameById);

const nameWidth = Math.max(...members.map((m) => m.realName.length), 20);
console.log("\n── Final assignments ──\n");
console.log("Name".padEnd(nameWidth + 2) + "Assigned");
console.log("─".repeat(nameWidth + 16));
for (const m of members) {
  console.log(m.realName.padEnd(nameWidth + 2) + assignments.get(m.id));
}
console.log("\nDry run complete — nothing written.");
