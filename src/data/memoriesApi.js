import { supabaseRequest } from "./supabaseRest";

export function fromDbMemory(row) {
  if (!row) return null;
  return {
    id: row.id,
    content: row.content,
    concordId: row.concord_id ?? null,
    characterId: row.character_id ?? null,
    authorDisplayName: row.author_display_name ?? null,
    approved: row.approved ?? false,
    createdAt: row.created_at
  };
}

export async function fetchAllMemories() {
  const rows = await supabaseRequest("memories", {
    query: {
      select: "id,content,concord_id,character_id,author_display_name,approved,created_at",
      order: "created_at.desc"
    }
  });
  return rows.map(fromDbMemory);
}

export async function createMemory({ content, concordId, characterId, authorDisplayName }) {
  const rows = await supabaseRequest("rpc/create_memory", {
    method: "POST",
    body: {
      p_content: content,
      p_concord_id: concordId ?? null,
      p_character_id: characterId ?? null,
      p_author_display_name: authorDisplayName ?? null
    }
  });
  return rows?.length ? fromDbMemory(rows[0]) : null;
}

export async function approveMemory(id, approved) {
  const rows = await supabaseRequest("rpc/approve_memory", {
    method: "POST",
    body: { p_id: id, p_approved: approved }
  });
  return rows?.length ? fromDbMemory(rows[0]) : null;
}
