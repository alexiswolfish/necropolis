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
    character_name: character.characterName?.trim() || null,
    character_bio: character.characterBio?.trim() || null,
    rsvp_matched: character.rsvpMatched ?? true,
    real_name_normalized: normalizeName(character.realName),
    birth_date: character.birthDate ?? null,
    zodiac_sign: character.zodiacSign ?? null,
    concord_id: character.concordId ?? null,
    class_name: character.className ?? null,
    stats: character.stats ?? null,
    completed_at: character.completedAt ?? new Date().toISOString()
  };
}

function identityKey(character) {
  return `${normalizeName(character.realName)}|${character.birthDate ?? ""}`;
}

function fromDbCharacter(row) {
  if (!row) return null;
  return {
    id: row.id,
    realName: row.real_name,
    characterName: row.character_name ?? null,
    characterBio: row.character_bio ?? null,
    rsvpMatched: row.rsvp_matched ?? true,
    excludedFromCount: row.excluded_from_count ?? false,
    birthDate: row.birth_date,
    zodiacSign: row.zodiac_sign,
    concordId: row.concord_id,
    className: row.class_name,
    stats: row.stats,
    completedAt: row.completed_at,
    deaths: row.deaths ?? 0
  };
}

const CHARACTER_SELECT = "id,real_name,character_name,character_bio,rsvp_matched,excluded_from_count,birth_date,zodiac_sign,concord_id,class_name,stats,completed_at,deaths";

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

export async function findCharacterByIdentity(normalizedName, birthDate) {
  const rows = await supabaseRequest("characters", {
    query: {
      select: CHARACTER_SELECT,
      real_name_normalized: `eq.${normalizedName}`,
      birth_date: `eq.${birthDate}`,
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

export async function updateCharacterProfileById(id, patch) {
  const rows = await supabaseRequest("rpc/update_character_profile", {
    method: "POST",
    body: {
      p_id: id,
      p_character_name: Object.prototype.hasOwnProperty.call(patch, "characterName") ? (patch.characterName?.trim() || null) : null,
      p_character_bio: Object.prototype.hasOwnProperty.call(patch, "characterBio") ? (patch.characterBio?.trim() || null) : null
    }
  });

  return rows.length ? fromDbCharacter(rows[0]) : null;
}

export async function updateCharacterDeaths(id, deaths) {
  const rows = await supabaseRequest("rpc/update_character_deaths", {
    method: "POST",
    body: {
      p_id: id,
      p_deaths: Math.max(0, Math.floor(deaths ?? 0))
    }
  });
  return rows?.length ? fromDbCharacter(rows[0]) : null;
}

export async function updateCharacterById(id, patch) {
  const payload = {};
  if (Object.prototype.hasOwnProperty.call(patch, "characterName")) {
    payload.character_name = patch.characterName?.trim() || null;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "characterBio")) {
    payload.character_bio = patch.characterBio?.trim() || null;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "className")) {
    payload.class_name = patch.className ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "concordId")) {
    payload.concord_id = patch.concordId ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "stats")) {
    payload.stats = patch.stats ?? null;
  }
  if (Object.prototype.hasOwnProperty.call(patch, "excludedFromCount")) {
    payload.excluded_from_count = patch.excludedFromCount ?? false;
  }

  const rows = await supabaseRequest("characters", {
    method: "PATCH",
    query: {
      id: `eq.${id}`,
      select: CHARACTER_SELECT,
      limit: "1"
    },
    headers: { Prefer: "return=representation" },
    body: payload
  });

  return rows.length ? fromDbCharacter(rows[0]) : null;
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
    nextByName.set(identityKey(character), {
      ...character,
      realName: character.realName?.trim() ?? "",
      completedAt: character.completedAt ?? new Date().toISOString()
    });
  }

  const existing = await fetchAllCharacters();
  const existingNames = new Set(existing.map((entry) => identityKey(entry)));
  const nextNames = new Set(nextByName.keys());

  const payload = Array.from(nextByName.values()).map(toDbCharacter);
  if (payload.length > 0) {
    await supabaseRequest("characters", {
      method: "POST",
      query: {
        on_conflict: "real_name_normalized,birth_date",
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
