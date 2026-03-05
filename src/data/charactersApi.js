import { supabaseRequest } from "./supabaseRest";

function normalizeName(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");
}

function toDbCharacter(character) {
  return {
    real_name: character.realName?.trim() ?? "",
    real_name_normalized: normalizeName(character.realName),
    birth_date: character.birthDate ?? null,
    zodiac_sign: character.zodiacSign ?? null,
    concord_id: character.concordId ?? null,
    class_name: character.className ?? null,
    stats: character.stats ?? null,
    completed_at: character.completedAt ?? new Date().toISOString()
  };
}

function fromDbCharacter(row) {
  if (!row) return null;
  return {
    id: row.id,
    realName: row.real_name,
    birthDate: row.birth_date,
    zodiacSign: row.zodiac_sign,
    concordId: row.concord_id,
    className: row.class_name,
    stats: row.stats,
    completedAt: row.completed_at
  };
}

const CHARACTER_SELECT = "id,real_name,birth_date,zodiac_sign,concord_id,class_name,stats,completed_at";

export async function fetchAllCharacters() {
  const rows = await supabaseRequest("characters", {
    query: {
      select: CHARACTER_SELECT,
      order: "completed_at.asc"
    }
  });
  return rows.map(fromDbCharacter);
}

export async function findCharacterByNormalizedName(normalizedName) {
  const rows = await supabaseRequest("characters", {
    query: {
      select: CHARACTER_SELECT,
      real_name_normalized: `eq.${normalizedName}`,
      limit: "1"
    }
  });
  return rows.length ? fromDbCharacter(rows[0]) : null;
}

export async function createCharacter(character) {
  const rows = await supabaseRequest("characters", {
    method: "POST",
    query: { select: CHARACTER_SELECT },
    headers: { Prefer: "return=representation" },
    body: [toDbCharacter(character)]
  });

  return fromDbCharacter(rows[0]);
}

function inListFilter(values) {
  const encoded = values
    .map((value) => `"${String(value).replace(/"/g, '""')}"`)
    .join(",");
  return `in.(${encoded})`;
}

export async function replaceAllCharacters(characters) {
  const nextByName = new Map();
  for (const character of characters) {
    const normalized = normalizeName(character.realName);
    if (!normalized) continue;
    nextByName.set(normalized, {
      ...character,
      realName: character.realName?.trim() ?? "",
      completedAt: character.completedAt ?? new Date().toISOString()
    });
  }

  const existing = await fetchAllCharacters();
  const existingNames = new Set(existing.map((entry) => normalizeName(entry.realName)));
  const nextNames = new Set(nextByName.keys());

  const payload = Array.from(nextByName.values()).map(toDbCharacter);
  if (payload.length > 0) {
    await supabaseRequest("characters", {
      method: "POST",
      query: {
        on_conflict: "real_name_normalized",
        select: CHARACTER_SELECT
      },
      headers: {
        Prefer: "resolution=merge-duplicates,return=minimal"
      },
      body: payload
    });
  }

  const staleNames = [...existingNames].filter((name) => !nextNames.has(name));
  if (staleNames.length > 0) {
    await supabaseRequest("characters", {
      method: "DELETE",
      query: {
        real_name_normalized: inListFilter(staleNames)
      }
    });
  }

  return fetchAllCharacters();
}
