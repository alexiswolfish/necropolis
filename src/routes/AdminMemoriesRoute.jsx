import React from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const ADMIN_IDS = new Set([
  "29450a65-8925-4b85-b4ef-c1b0870653cf",
  "0bb97f08-c5bd-43d1-9934-99bbfcae3a21"
]);

function isAdmin(character) {
  return Boolean(character?.id && ADMIN_IDS.has(character.id));
}

const CONCORD_LABELS = {
  "desire-conspire": "Desire & Conspire",
  "pleasure-treasure": "Pleasure & Treasure",
  "brood-feud": "Brood & Feud",
  "zeal-steel": "Zeal & Steel",
  "tears-spears": "Tears & Spears",
  "veils-sails": "Veils & Sails",
  "laurels-quarrels": "Laurels & Quarrels",
  "wit-spit": "Wit & Spit"
};

function formatDate(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
}

function AdminMemoryCard({ memory, onApprove, onReject }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: memory.content,
    editable: false
  });

  return (
    <div className="admin-memory-card" data-concord={memory.concordId ?? undefined}>
      <div className="admin-memory-meta">
        {memory.concordId && (
          <span className="memory-concord-tag">{CONCORD_LABELS[memory.concordId] ?? memory.concordId}</span>
        )}
        <span className="admin-memory-author">{memory.authorDisplayName ?? "Anonymous"}</span>
        <span className="admin-memory-date">{formatDate(memory.createdAt)}</span>
      </div>
      <div className="memory-content">
        <EditorContent editor={editor} />
      </div>
      <div className="admin-memory-actions">
        <button className="admin-memory-btn admin-memory-approve" onClick={() => onApprove(memory.id)}>
          Approve
        </button>
        <button className="admin-memory-btn admin-memory-reject" onClick={() => onReject(memory.id)}>
          Reject
        </button>
      </div>
    </div>
  );
}

export function AdminMemoriesRoute({ memories, currentCharacter, onApproveMemory }) {
  if (!isAdmin(currentCharacter)) {
    return (
      <main className="admin-memories-layout">
        <p className="type-body">Access denied.</p>
      </main>
    );
  }

  const queued = memories.filter((m) => !m.approved);
  const approved = memories.filter((m) => m.approved);

  return (
    <main className="admin-memories-layout">
      <h1 className="type-display admin-memories-title">Memory Moderation</h1>

      <section className="admin-memories-section">
        <h2 className="type-caps admin-memories-section-title">Pending ({queued.length})</h2>
        {queued.length === 0 && <p className="type-body admin-memories-empty">No memories awaiting review.</p>}
        <div className="admin-memories-list">
          {queued.map((memory) => (
            <AdminMemoryCard
              key={memory.id}
              memory={memory}
              onApprove={(id) => onApproveMemory(id, true)}
              onReject={(id) => onApproveMemory(id, false)}
            />
          ))}
        </div>
      </section>

      <section className="admin-memories-section">
        <h2 className="type-caps admin-memories-section-title">Approved ({approved.length})</h2>
        {approved.length === 0 && <p className="type-body admin-memories-empty">No approved memories yet.</p>}
        <div className="admin-memories-list">
          {approved.map((memory) => (
            <AdminMemoryCard
              key={memory.id}
              memory={memory}
              onApprove={(id) => onApproveMemory(id, true)}
              onReject={(id) => onApproveMemory(id, false)}
            />
          ))}
        </div>
      </section>
    </main>
  );
}
