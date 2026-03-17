/**
 * Compares blended scoring against current DB class assignments for all player concords.
 * Read-only — nothing is written.
 *
 * Usage: node scripts/dry-run-blended-all.js
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

// From assign-classes-v2.js
const WIZARD_IDS = new Set([
  "7f6ff7d4-b37e-4ab5-a59c-1bf714ce1cfd",
  "9c8ddcf2-b817-4444-a8a3-8200389032da",
  "e4eb9a96-c793-4eb0-9942-bd5f51267981",
  "af757a0f-66a2-46a1-8695-f32a9ba4c6b7",
  "36bea25c-9732-45c9-abe1-fbac7dab74b1",
  "c24d2804-69b0-4214-adc8-ba0a1f734dd9",
  "8b79ffc4-7ea4-40ce-9175-dc75def04ae2",
  "98ced73b-7477-4c02-a53d-680f2aad1fbe",
]);

async function fetchAllPlayers() {
  const url = new URL(`${SUPABASE_URL}/rest/v1/characters`);
  url.searchParams.set("select", "id,real_name,concord_id,class_name,stats,excluded_from_count,rsvp_matched,completed_at");
  url.searchParams.set("excluded_from_count", "eq.false");
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

function assignBlended(members) {
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

  for (const { memberId, cls } of pairs) {
    if (assignedPlayers.has(memberId) || assignedClasses.has(cls.id)) continue;
    result.set(memberId, cls.tag);
    assignedPlayers.add(memberId);
    assignedClasses.add(cls.id);
    classCounts.set(cls.tag, (classCounts.get(cls.tag) ?? 0) + 1);
    if (assignedPlayers.size - [...result.values()].filter(v => v === WIZARD_TAG || v === PEASANT_TAG).length >= nonWizardClasses.length) break;
  }

  for (const m of competitive) {
    if (!result.has(m.id)) result.set(m.id, PEASANT_TAG);
  }

  // Pass 2: cap 2
  for (const m of members) {
    if (result.get(m.id) !== PEASANT_TAG) continue;
    const stats = m.stats ?? {};
    const vals = Object.values(stats).map((v) => Number(v ?? 0));
    if (Math.max(0, ...vals) < 4) continue;

    let bestCls = null, bestBlended = -Infinity, bestPrimary = -Infinity;
    for (const cls of nonWizardClasses) {
      if ((classCounts.get(cls.tag) ?? 0) >= 2) continue;
      const { primary, blended } = scoreFor(stats, cls);
      if (blended > bestBlended || (blended === bestBlended && primary > bestPrimary)) {
        bestCls = cls; bestBlended = blended; bestPrimary = primary;
      }
    }
    if (!bestCls) continue;
    result.set(m.id, bestCls.tag);
    classCounts.set(bestCls.tag, (classCounts.get(bestCls.tag) ?? 0) + 1);
  }

  return result;
}

const rows = await fetchAllPlayers();
const byCondord = {};
for (const r of rows) {
  if (!r.concord_id) continue;
  if (!byCondord[r.concord_id]) byCondord[r.concord_id] = [];
  byCondord[r.concord_id].push({
    id: r.id,
    realName: r.real_name,
    currentClass: r.class_name,
    stats: r.stats ?? {},
    completedAt: r.completed_at ?? null
  });
}

let totalChanges = 0;
for (const [concordId, members] of Object.entries(byCondord).sort()) {
  const assignments = assignBlended(members);
  const changes = members.filter((m) => assignments.get(m.id) !== m.currentClass);
  if (changes.length === 0) continue;

  totalChanges += changes.length;
  console.log(`\n── ${concordId} (${changes.length} change${changes.length === 1 ? "" : "s"}) ──`);
  const nameWidth = Math.max(...changes.map((m) => m.realName.length));
  for (const m of changes) {
    const oldTag = (m.currentClass ?? "(none)").padEnd(12);
    const newTag = assignments.get(m.id);
    console.log(`  ${m.realName.padEnd(nameWidth + 2)} ${oldTag} → ${newTag}`);
  }
}

if (totalChanges === 0) {
  console.log("\nNo changes — blended scoring produces identical results to current DB assignments.");
} else {
  console.log(`\n${totalChanges} total change${totalChanges === 1 ? "" : "s"} across all concords.`);
}
console.log("\nDry run complete — nothing written.");
