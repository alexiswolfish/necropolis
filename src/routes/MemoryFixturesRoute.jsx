import React from "react";

const CONCORDS = [
  { id: "desire-conspire",  label: "Desire & Conspire",  author: "Ashveil Thorne" },
  { id: "pleasure-treasure", label: "Pleasure & Treasure", author: "Seraphel Voss" },
  { id: "brood-feud",       label: "Brood & Feud",       author: "Gorvain Kretch" },
  { id: "zeal-steel",       label: "Zeal & Steel",       author: "Irindeth Caul" },
  { id: "tears-spears",     label: "Tears & Spears",     author: "Maevan Dolr" },
  { id: "veils-sails",      label: "Veils & Sails",      author: "Silenne Farath" },
  { id: "laurels-quarrels", label: "Laurels & Quarrels", author: "Brycen Halvard" },
  { id: "wit-spit",         label: "Wit & Spit",         author: "Danka Frell" },
  { id: "death",            label: "Death",              author: "Death Herself" },
  { id: null,               label: null,                 author: "Anonymous" },
];

const SAMPLE_TEXT = "The Hollows remembers everything. That is its burden, and ours. I lit a candle at the gate where I died the first time. It was still burning when I came back.";

export function MemoryFixturesRoute() {
  return (
    <main style={{ padding: "2rem", display: "flex", flexDirection: "column", gap: "1rem", maxWidth: "640px" }}>
      <h1 className="type-caps" style={{ marginBottom: "1rem" }}>Memory card fixtures</h1>
      {CONCORDS.map(({ id, label, author }) => (
        <article
          key={id ?? "none"}
          className="memory-card"
          data-concord={id ?? undefined}
        >
          <p className="memory-card-author">{author}</p>
          <div className="memory-card-meta">
            {label && <span className="memory-concord-tag">{label}</span>}
            <span className="memory-card-date">just now</span>
          </div>
          <div className="memory-content">
            <div className="ProseMirror">
              <p>{SAMPLE_TEXT}</p>
            </div>
          </div>
        </article>
      ))}
    </main>
  );
}
