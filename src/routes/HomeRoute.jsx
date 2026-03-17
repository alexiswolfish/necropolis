import React, { useState } from "react";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

const CONCORD_OPTIONS = [
  { id: "death", label: "Death" },
  { id: "desire-conspire", label: "Desire & Conspire" },
  { id: "pleasure-treasure", label: "Pleasure & Treasure" },
  { id: "brood-feud", label: "Brood & Feud" },
  { id: "zeal-steel", label: "Zeal & Steel" },
  { id: "tears-spears", label: "Tears & Spears" },
  { id: "veils-sails", label: "Veils & Sails" },
  { id: "laurels-quarrels", label: "Laurels & Quarrels" },
  { id: "wit-spit", label: "Wit & Spit" }
];

const CONCORD_LABELS = Object.fromEntries(CONCORD_OPTIONS.map((o) => [o.id, o.label]));

function formatRelativeDate(iso) {
  if (!iso) return "";
  const diff = Date.now() - new Date(iso).getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);
  if (minutes < 2) return "just now";
  if (minutes < 60) return `${minutes} minutes ago`;
  if (hours < 24) return `${hours} hour${hours !== 1 ? "s" : ""} ago`;
  if (days < 30) return `${days} day${days !== 1 ? "s" : ""} ago`;
  return new Date(iso).toLocaleDateString("en-US", { month: "short", day: "numeric" });
}

function MemoryCard({ memory, characterById, getPathFromRoute, onNavigate }) {
  const editor = useEditor({
    extensions: [StarterKit],
    content: memory.content,
    editable: false
  });

  const authorLabel = memory.authorDisplayName ?? "Anonymous";
  const character = memory.characterId ? (characterById?.[memory.characterId] ?? null) : null;
  const realName = character?.realName ?? null;
  const className = character?.className ?? null;

  return (
    <article className="memory-card" data-concord={memory.concordId ?? undefined}>
      <div className="memory-card-header">
        <div className="memory-card-byline">
          {realName && <span className="memory-card-realname type-caps">{realName}</span>}
          <p className="memory-card-author">
            {memory.characterId && getPathFromRoute ? (
              <a
                href={getPathFromRoute({ page: "player-detail", characterId: memory.characterId })}
                onClick={onNavigate && onNavigate({ page: "player-detail", characterId: memory.characterId })}
                className="memory-card-author-link"
              >
                {authorLabel}
              </a>
            ) : (
              authorLabel
            )}
          </p>
        </div>
        {className && <span className="memory-card-class">{className}</span>}
      </div>
      <div className="memory-card-meta">
        {memory.concordId && getPathFromRoute && (
          <a
            href={getPathFromRoute({ page: "concord-detail", concordId: memory.concordId })}
            onClick={onNavigate && onNavigate({ page: "concord-detail", concordId: memory.concordId })}
            className="memory-concord-tag"
          >
            {CONCORD_LABELS[memory.concordId] ?? memory.concordId}
          </a>
        )}
        <span className="memory-card-date">{formatRelativeDate(memory.createdAt)}</span>
      </div>
      <div className="memory-content">
        <EditorContent editor={editor} />
      </div>
    </article>
  );
}

function extractText(node) {
  if (!node) return "";
  if (node.type === "text") return node.text ?? "";
  if (node.content) return node.content.map(extractText).join(" ");
  return "";
}

const URL_RE = /https?:\/\/|www\./i;
const REPEAT_RE = /(.)\1{9,}/;

function MemoryEditor({ character, onCreateMemory }) {
  const [concordId, setConcordId] = useState(character?.concordId ?? "");
  const [authorName, setAuthorName] = useState("");
  const [botTrap, setBotTrap] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [spamError, setSpamError] = useState("");

  const editor = useEditor({
    extensions: [StarterKit],
    content: ""
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (botTrap.trim()) return;
    if (!editor || editor.isEmpty) return;

    const text = extractText(editor.getJSON()).trim();
    if (text.length < 8) return;
    if (text.length > 2000) {
      setSpamError("Please keep memories under 2,000 characters.");
      return;
    }
    if (URL_RE.test(text)) {
      setSpamError("Links aren't allowed in memories.");
      return;
    }
    if (REPEAT_RE.test(text)) {
      setSpamError("Looks like that might be spam — please write something real.");
      return;
    }
    setSpamError("");

    setSubmitting(true);
    try {
      await onCreateMemory({
        content: editor.getJSON(),
        concordId: character ? (character.excludedFromCount ? "death" : character.concordId) : concordId || null,
        characterId: character?.id ?? null,
        authorDisplayName: character ? (character.characterName ?? character.realName) : (authorName.trim() || null)
      });
      setSubmitted(true);
    } catch (err) {
      console.error("Failed to submit memory.", err);
      setSubmitting(false);
    }
  };

  if (submitted) {
    return (
      <div className="memory-editor-wrap memory-editor-thanks">
        <p className="type-body memory-thanks-text">Your memory has been submitted and will appear once reviewed.</p>
      </div>
    );
  }

  return (
    <div className="memory-editor-wrap">
      <form className="memory-editor-form" onSubmit={handleSubmit}>
        {character ? (
          <div className="memory-author-locked">
            <span className="memory-concord-tag" data-concord={character.excludedFromCount ? "death" : (character.concordId ?? undefined)}>
              {character.excludedFromCount ? "Death" : (CONCORD_LABELS[character.concordId] ?? character.concordId)}
            </span>
            <span className="type-body memory-author-name">{character.characterName ?? character.realName}</span>
          </div>
        ) : (
          <div className="memory-author-fields">
            <label className="memory-field-label" htmlFor="memory-author-name">
              <span className="type-caps memory-field-label-text">Your Name</span>
              <input
                id="memory-author-name"
                className="memory-field-input"
                type="text"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Optional"
              />
            </label>
            <label className="memory-field-label" htmlFor="memory-concord-select">
              <span className="type-caps memory-field-label-text">Concord</span>
              <select
                id="memory-concord-select"
                className="memory-field-input memory-field-select"
                value={concordId}
                onChange={(e) => setConcordId(e.target.value)}
              >
                <option value="">— Select —</option>
                {CONCORD_OPTIONS.map((opt) => (
                  <option key={opt.id} value={opt.id}>{opt.label}</option>
                ))}
              </select>
            </label>
          </div>
        )}

        {/* Honeypot */}
        <input
          type="text"
          name="url"
          value={botTrap}
          onChange={(e) => setBotTrap(e.target.value)}
          tabIndex={-1}
          aria-hidden="true"
          style={{ position: "absolute", opacity: 0, pointerEvents: "none", width: 0, height: 0 }}
        />

        <div className="memory-editor-toolbar">
          <button
            type="button"
            className={`memory-toolbar-btn${editor?.isActive("bold") ? " is-active" : ""}`}
            onClick={() => editor?.chain().focus().toggleBold().run()}
            title="Bold"
          >
            <strong>B</strong>
          </button>
          <button
            type="button"
            className={`memory-toolbar-btn${editor?.isActive("italic") ? " is-active" : ""}`}
            onClick={() => editor?.chain().focus().toggleItalic().run()}
            title="Italic"
          >
            <em>I</em>
          </button>
          <button
            type="button"
            className={`memory-toolbar-btn${editor?.isActive("bulletList") ? " is-active" : ""}`}
            onClick={() => editor?.chain().focus().toggleBulletList().run()}
            title="Bullet list"
          >
            &#8226;&#8212;
          </button>
        </div>

        <div className="memory-editor-content">
          <EditorContent editor={editor} />
        </div>

        {spamError && <p className="memory-spam-error">{spamError}</p>}
        <button
          type="submit"
          className="memory-submit-btn type-caps"
          disabled={submitting || !editor || editor.isEmpty}
        >
          {submitting ? "Inscribing…" : "Inscribe"}
        </button>
      </form>
    </div>
  );
}

export function HomeRoute({
  memories,
  character,
  allCharacters,
  onCreateMemory,
  getPathFromRoute,
  onNavigate
}) {
  const approvedMemories = memories ?? [];
  const characterById = React.useMemo(
    () => Object.fromEntries((allCharacters ?? []).map((c) => [c.id, c])),
    [allCharacters]
  );

  return (
    <main className="memories-layout">
      <div className="memories-editor-top">
        <div className="memories-intro">
          <h2 className="memories-intro-heading">May you be both Cursed and Blessed.</h2>
          <p className="type-body memories-intro-body">Thank you for coming! We're so hyped &amp; grateful you brought this game to life. We'd love to hear any recollections, hot takes, or mementos below.</p>
        </div>
        <MemoryEditor character={character} onCreateMemory={onCreateMemory} />
      </div>
      <div className="memories-feed">
        <img src={`${import.meta.env.BASE_URL}blessed.svg`} alt="" aria-hidden="true" className="memories-feed-deco memories-feed-deco-left" />
        <img src={`${import.meta.env.BASE_URL}hollow.png`} alt="" aria-hidden="true" className="memories-feed-deco memories-feed-deco-right" />
        <h2 className="type-caps memories-feed-heading">Memories from the Hollows</h2>
        {approvedMemories.length === 0 ? (
          <p className="type-body memories-feed-empty">No memories yet. Be the first to share one.</p>
        ) : (
          approvedMemories.map((memory) => (
            <MemoryCard
              key={memory.id}
              memory={memory}
              characterById={characterById}
              getPathFromRoute={getPathFromRoute}
              onNavigate={onNavigate}
            />
          ))
        )}
      </div>
    </main>
  );
}
