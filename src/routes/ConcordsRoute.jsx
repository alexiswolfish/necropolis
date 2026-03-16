import React, { useState } from "react";
import { STAT_LABELS } from "./PlayersRoute";

function toFirstWordCapital(text) {
  const lower = text.toLowerCase();
  return lower.replace(/^([a-z])/, (m) => m.toUpperCase());
}

export function renderConcordWord(text) {
  const parts = text.split(/\b(concord|fire|water|air|earth)\b/gi);
  return parts.map((part, index) => {
    if (/^(concord|fire|water|air|earth)$/i.test(part)) {
      return <span key={`concord-word-${index}`} className="concord-logo-word">{part.toUpperCase()}</span>;
    }
    return <React.Fragment key={`concord-text-${index}`}>{part}</React.Fragment>;
  });
}

function ConcordPlayerCard({ entry, getPathFromRoute, onNavigate }) {
  const stats = entry.stats ?? {};
  const statEntries = Object.entries(STAT_LABELS).map(([key, label]) => ({
    key,
    label,
    value: Number(stats[key] ?? 0)
  }));
  const deaths = entry.deaths ?? 0;
  const isHollow = deaths >= 7;

  return (
    <article className="concord-player-card">
      <a
        href={getPathFromRoute({ page: "player-detail", characterId: entry.id })}
        onClick={onNavigate({ page: "player-detail", characterId: entry.id })}
        className="concord-player-card-link-overlay"
        aria-label={`Open ${entry.characterName ?? entry.realName}`}
      />
      <div className="concord-player-card-header">
        <div className="concord-player-card-names">
          {entry.characterName && entry.characterName !== entry.realName
            ? <span className="concord-player-card-realname">{entry.realName}</span>
            : null}
          <p className="concord-player-card-name">{entry.characterName ?? entry.realName}</p>
        </div>
        {entry.className
          ? <span className="concord-player-card-class">{entry.className}</span>
          : null}
      </div>
      <div className="concord-player-card-stats">
        {statEntries.map((stat) => (
          <div key={stat.key} className="concord-player-card-stat-row">
            <span className="concord-player-card-stat-label">{stat.label}:</span>
            <span className="concord-player-card-stat-value">{"+".repeat(Math.max(0, stat.value)) || "\u00a0"}</span>
          </div>
        ))}
      </div>
      <div className="concord-player-card-deaths">
        <span className="type-caps concord-player-card-stat-label concord-player-card-deaths-label">True Deaths:</span>
        <span className="concord-player-card-deaths-count">{deaths}</span>
        {isHollow && <span className="type-caps concord-player-card-hollow-badge">Hollow</span>}
      </div>
    </article>
  );
}

export function ConcordsPage({ onOpenConcord, onHoverConcord, cards }) {
  return (
    <main className="concords-layout">
      <section className="concord-grid concord-grid-exact" aria-label="Concord squares">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="concord-card"
            onClick={onOpenConcord(card.routeId)}
            onMouseEnter={() => onHoverConcord(card.routeId)}
            style={{
              "--card-bg": card.colorBg,
              "--card-secondary": card.colorTop,
              "--card-title": card.colorTitle
            }}
          >
            <p className="concord-card-symbol">{card.symbol}</p>
            <p className="concord-card-element">{card.element.toLowerCase()}</p>
            <h3 className="concord-card-title">
              {card.title.split("\n").map((line, index, allLines) => (
                <span key={`${card.id}-${line}-${index}`}>
                  {toFirstWordCapital(line)}
                  {index < allLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h3>
            <p className="concord-card-desire">{card.desire.toLowerCase()}</p>
          </button>
        ))}
      </section>
    </main>
  );
}

export function ConcordDetailPage({
  concord,
  detailTab,
  onOpenTab,
  onStartDetailHum,
  onStopDetailHum,
  getPathFromRoute,
  onNavigate,
  costumeImagesByConcord,
  teamBlueprint,
  characters,
  currentCharacter,
  onUpdateDeaths
}) {
  const [leftLabel, rightLabel] = concord.label.split(" & ");
  const [loadedCostumeImages, setLoadedCostumeImages] = useState({});
  const displayLabel = rightLabel
    ? (
      <>
        {leftLabel}
        <br />
        &
        <br />
        {rightLabel}
      </>
    )
    : concord.label;
  const costumeImages = costumeImagesByConcord[concord.id] ?? [];
  function classOrder(entry) {
    const cls = (entry.className ?? "").toLowerCase();
    if (cls === "npc") return 2;
    if (cls === "peasant") return 1;
    return 0;
  }
  const teamMembers = (characters ?? [])
    .filter((entry) => entry?.concordId === concord.id)
    .sort((a, b) => {
      const orderDiff = classOrder(a) - classOrder(b);
      if (orderDiff !== 0) return orderDiff;
      const classA = (a.className ?? "").toLowerCase();
      const classB = (b.className ?? "").toLowerCase();
      const classDiff = classA.localeCompare(classB);
      if (classDiff !== 0) return classDiff;
      return (a.characterName ?? a.realName ?? "").localeCompare(b.characterName ?? b.realName ?? "");
    });
  const teamData = teamBlueprint[concord.id] ?? null;

  return (
    <main className="concord-detail-layout">
      <aside className="concord-detail-left">
        <h1
          className="concord-detail-name"
          onMouseEnter={() => onStartDetailHum(concord.id)}
          onMouseLeave={onStopDetailHum}
        >
          {displayLabel}
        </h1>

        <dl className="concord-meta">
          <div className="concord-meta-row">
            <dt className="type-caps">Element:</dt>
            <dd className="type-caps concord-meta-value">{concord.element}</dd>
          </div>
          <div className="concord-meta-row">
            <dt className="type-caps">Ruling Planet:</dt>
            <dd className="type-caps concord-meta-value">{teamData?.planet ?? "unknown"}</dd>
          </div>
          <div className="concord-meta-row">
            <dt className="type-caps">Earthly Desire:</dt>
            <dd className="type-caps concord-meta-value">{teamData?.earthlyDesire ?? concord.earthlyDesire}</dd>
          </div>
        </dl>
      </aside>

      <article className="concord-detail-right">
        <nav className="concord-subnav" aria-label={`${concord.label} detail sections`}>
          <a
            href={getPathFromRoute({ page: "concord-detail", concordId: concord.id, detailTab: "backstory" })}
            onClick={onOpenTab("backstory")}
            className="type-caps concord-subnav-link"
            aria-current={detailTab === "backstory" ? "page" : undefined}
          >
            Backstory
          </a>
          <a
            href={getPathFromRoute({ page: "concord-detail", concordId: concord.id, detailTab: "costumes" })}
            onClick={onOpenTab("costumes")}
            className="type-caps concord-subnav-link"
            aria-current={detailTab === "costumes" ? "page" : undefined}
          >
            Costumes
          </a>
          <a
            href={getPathFromRoute({ page: "concord-detail", concordId: concord.id, detailTab: "players" })}
            onClick={onOpenTab("players")}
            className="type-caps concord-subnav-link"
            aria-current={detailTab === "players" ? "page" : undefined}
          >
            Players
          </a>
        </nav>

        {detailTab === "costumes" ? (
          <section className="costume-grid" aria-label={`${concord.label} costumes`}>
            {costumeImages.map((src, index) => (
              <img
                key={`${concord.id}-costume-${index + 1}`}
                src={src}
                alt={`${concord.label} costume ${index + 1}`}
                className={`costume-image${loadedCostumeImages[src] ? " is-loaded" : ""}`}
                loading="lazy"
                decoding="async"
                onLoad={() => {
                  setLoadedCostumeImages((prev) => {
                    if (prev[src]) return prev;
                    return { ...prev, [src]: true };
                  });
                }}
              />
            ))}
          </section>
        ) : detailTab === "players" ? (
          <section className="concord-player-cards" aria-label={`${concord.label} players`}>
            {teamMembers.map((entry) => (
              <ConcordPlayerCard
                key={`${concord.id}-${entry.realName}`}
                entry={entry}
                getPathFromRoute={getPathFromRoute}
                onNavigate={onNavigate}
              />
            ))}
          </section>
        ) : (
          <>
            <p className="concord-lede">{typeof concord.lede === "string" ? renderConcordWord(concord.lede) : concord.lede}</p>
            {(concord.bodyParagraphs ?? [concord.body]).map((paragraph, index) => (
              <p key={`${concord.id}-body-${index}`} className="concord-body">{typeof paragraph === "string" ? renderConcordWord(paragraph) : paragraph}</p>
            ))}
          </>
        )}
      </article>
    </main>
  );
}
