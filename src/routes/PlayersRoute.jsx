import React, { useEffect, useMemo, useState } from "react";

const STAT_LABELS = {
  pulchritude: "Pulchritude",
  grit: "Grit",
  brawn: "Brawn",
  shenanigans: "Shenanigans",
  vigilance: "Vigilance",
  mystery: "Mystery",
  dumbLuck: "Dumb Luck"
};

const PLAYERS_CONCORD_HEADING_COLORS = {
  "desire-conspire": "#b32200",
  "pleasure-treasure": "#0d2b0f",
  "brood-feud": "#9e001f",
  "zeal-steel": "#e596c9",
  "tears-spears": "#3b1138",
  "veils-sails": "#1d4255",
  "laurels-quarrels": "#cc5918",
  "wit-spit": "#4169e1"
};

const PLAYERS_CONCORD_MEMBER_COLORS = {
  "desire-conspire": "#f58e84",
  "pleasure-treasure": "#fdbf68",
  "brood-feud": "#a62c37",
  "zeal-steel": "#b6bfc1",
  "tears-spears": "#f27291",
  "veils-sails": "#f8b6ba",
  "laurels-quarrels": "#d8a37b",
  "wit-spit": "#c0a9b3"
};

export function PlayersPage({ characters, teamBlueprint }) {
  const groupedByConcord = Object.keys(teamBlueprint).map((concordId) => {
    const members = characters
      .filter((player) => player.concordId === concordId)
      .sort((a, b) => (a.characterName ?? a.realName ?? "").localeCompare(b.characterName ?? b.realName ?? ""));
    return {
      concordId,
      concordName: teamBlueprint[concordId]?.concordName ?? concordId,
      backgroundColor: PLAYERS_CONCORD_HEADING_COLORS[concordId] ?? "#000000",
      memberColor: PLAYERS_CONCORD_MEMBER_COLORS[concordId] ?? "#000000",
      members
    };
  }).filter((group) => group.members.length > 0);

  return (
    <main className="players-layout">
      <section className="players-concord-groups" aria-label="Players by concord">
        {groupedByConcord.map((group) => (
          <article key={group.concordId} className="players-concord-group">
            <h2 className="type-caps players-concord-name" style={{ color: group.backgroundColor }}>{group.concordName}</h2>
            <div className="concord-players-list">
              {group.members.map((member) => (
                <p key={`${group.concordId}-${member.realName}`} className="concord-player-name" style={{ color: group.memberColor }}>
                  {member.characterName ?? member.realName}
                  {member.characterName && member.characterName !== member.realName ? <span className="players-real-name type-caps"> ({member.realName})</span> : null}
                </p>
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function CharacterPage({ character, teamBlueprint, concord, costumeImagesByConcord, detailTab, onOpenTab, onOpenConcord, getPathFromRoute, onSaveCharacterName }) {
  const [loadedCostumeImages, setLoadedCostumeImages] = useState({});
  const [nameDraft, setNameDraft] = useState(character?.characterName ?? "");
  const [isSavingName, setIsSavingName] = useState(false);
  const [nameSaveMessage, setNameSaveMessage] = useState("");

  useEffect(() => {
    setNameDraft(character?.characterName ?? "");
    setNameSaveMessage("");
  }, [character?.id, character?.realName, character?.characterName]);

  if (!character) {
    return (
      <main className="character-layout">
        <section className="character-summary">
          <h1 className="type-before character-title">Character</h1>
          <p className="type-caps">No character completed yet.</p>
        </section>
      </main>
    );
  }

  const teamData = teamBlueprint[character.concordId] ?? null;
  const concordName = teamData?.concordName ?? character.concordId;
  const costumeImages = (costumeImagesByConcord ?? {})[character.concordId] ?? [];
  const stats = character.stats ?? {};
  const concordBody = useMemo(() => {
    if (!concord) return [];
    return concord.bodyParagraphs ?? (concord.body ? [concord.body] : []);
  }, [concord]);
  const statEntries = Object.entries(STAT_LABELS).map(([key, label]) => ({
    key,
    label,
    value: Number(stats[key] ?? 0)
  }));
  const [leftWord, rightWord] = concordName.split(" & ");
  const concordDisplay = rightWord
    ? (
      <>
        {leftWord}
        <br />
        &
        <br />
        {rightWord}
      </>
    )
    : concordName;

  const canSaveName = nameDraft.trim().length > 0 && (nameDraft.trim() !== (character.characterName ?? character.realName));
  const commitCharacterName = async () => {
    if (!canSaveName || isSavingName) return;
    setIsSavingName(true);
    setNameSaveMessage("");
    const ok = await onSaveCharacterName(nameDraft.trim());
    setIsSavingName(false);
    setNameSaveMessage(ok ? "Saved" : "Could not save");
  };

  return (
      <main className="concord-detail-layout character-detail-layout">
      <aside className="concord-detail-left">
        <a
          href={getPathFromRoute({ page: "concord-detail", concordId: character.concordId, detailTab: "backstory" })}
          onClick={onOpenConcord(character.concordId)}
          className="character-concord-link"
        >
          <h1 className="concord-detail-name">{concordDisplay}</h1>
        </a>

        <dl className="concord-meta">
          <div className="concord-meta-row">
            <dt className="type-caps">Element:</dt>
            <dd className="type-caps concord-meta-value">{teamData?.element ?? "unknown"}</dd>
          </div>
          <div className="concord-meta-row">
            <dt className="type-caps">Sign:</dt>
            <dd className="type-caps concord-meta-value">{character.zodiacSign}</dd>
          </div>
          <div className="concord-meta-row">
            <dt className="type-caps">Earthly Desire:</dt>
            <dd className="type-caps concord-meta-value">{teamData?.earthlyDesire ?? "unknown"}</dd>
          </div>
        </dl>
      </aside>

      <article className="concord-detail-right character-detail-right">
        <p className="character-player-label type-caps">Player Name: {character.realName}</p>
        <input
          id="character-name-editor-input"
          className="character-name-hero-input"
          value={nameDraft}
          onChange={(event) => {
            setNameDraft(event.target.value);
            setNameSaveMessage("");
          }}
          onBlur={() => {
            void commitCharacterName();
          }}
          onKeyDown={(event) => {
            if (event.key === "Enter") {
              event.preventDefault();
              void commitCharacterName();
            }
          }}
          maxLength={64}
          autoComplete="off"
          placeholder="Character Name"
        />
        {nameSaveMessage ? <p className="type-caps character-name-save-msg">{nameSaveMessage}</p> : null}
        <nav className="concord-subnav character-subnav" aria-label="Character details">
          <a
            href={getPathFromRoute({ page: "character", detailTab: "stats" })}
            onClick={onOpenTab("stats")}
            className="type-caps concord-subnav-link character-subnav-btn"
            aria-current={detailTab === "stats" ? "page" : undefined}
          >
            Stats
          </a>
          <a
            href={getPathFromRoute({ page: "character", detailTab: "about" })}
            onClick={onOpenTab("about")}
            className="type-caps concord-subnav-link character-subnav-btn"
            aria-current={detailTab === "about" ? "page" : undefined}
          >
            About Your Concord
          </a>
          <a
            href={getPathFromRoute({ page: "character", detailTab: "costumes" })}
            onClick={onOpenTab("costumes")}
            className="type-caps concord-subnav-link character-subnav-btn"
            aria-current={detailTab === "costumes" ? "page" : undefined}
          >
            Costume Notes
          </a>
        </nav>
        {detailTab === "stats" ? (
          <section className="character-stats" aria-label="Character stats">
            {statEntries.map((entry) => (
              <div key={entry.key} className="character-stat-row">
                <span className="type-caps character-stat-label">{entry.label}:</span>
                <span className="type-logo character-stat-value">{"+".repeat(Math.max(0, entry.value)) || "\u00a0"}</span>
              </div>
            ))}
          </section>
        ) : detailTab === "costumes" ? (
          <section className="character-costume-notes" aria-label="Costume notes">
            <p className="character-concord-paragraph">Below is the mood and vibe for your concord. Please remember to wear flat shoes, and appear however you feel best</p>
            <section className="costume-grid" aria-label={`${concordName} costumes`}>
              {costumeImages.map((src, index) => (
                <img
                  key={`${character.concordId}-character-costume-${index + 1}`}
                  src={src}
                  alt={`${concordName} costume ${index + 1}`}
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
          </section>
        ) : (
          <section className="character-concord-copy" aria-label="Concord backstory">
            {concord?.lede ? <p className="character-concord-lede">{concord.lede}</p> : null}
            {concordBody.map((paragraph, index) => (
              <p key={`${character.concordId}-about-${index}`} className="character-concord-paragraph">{paragraph}</p>
            ))}
          </section>
        )}
      </article>
    </main>
  );
}
