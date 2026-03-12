import React, { useEffect, useMemo, useState } from "react";
import { renderConcordWord } from "./ConcordsRoute";
import { CLASSES_DATA } from "./ManualClassesRoute";

const CLASS_LORE_BY_ID = Object.fromEntries(CLASSES_DATA.map((c) => [c.id, c.shortLore ?? c.lore]));
const CLASS_DATA_BY_ID = Object.fromEntries(CLASSES_DATA.map((c) => [c.id, c]));
const PEASANT_CLASS_ID = "peasant";

function renderClassLore(text) {
  const parts = text.split(/([A-Z]{2,}(?:'[A-Z]+)?)/g);
  return parts.map((part, i) =>
    /^[A-Z]{2,}/.test(part)
      ? <span key={i} className="concord-logo-word">{part}</span>
      : part
  );
}

export const STAT_LABELS = {
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

const ADMIN_IDS = new Set([
  "29450a65-8925-4b85-b4ef-c1b0870653cf",
  "0bb97f08-c5bd-43d1-9934-99bbfcae3a21"
]);

function isAdmin(character) {
  return Boolean(character?.id && ADMIN_IDS.has(character.id));
}

function getPlayerStatSummary(character) {
  const stats = character?.stats ?? {};
  const statEntries = Object.entries(STAT_LABELS).map(([key, label]) => ({
    key,
    label,
    value: Number(stats[key] ?? 0)
  }));
  const highestValue = statEntries.reduce((max, entry) => Math.max(max, entry.value), 0);
  const highestStat = statEntries.find((entry) => entry.value === highestValue) ?? statEntries[0];
  return { statEntries, highestValue, highestStat };
}

// Shared: left sidebar showing concord name + meta
function ConcordSidebar({ character, concord, teamData, getPathFromRoute, onOpenConcord }) {
  const concordName = teamData?.concordName ?? character.concordId;
  const [leftWord, rightWord] = concordName.split(" & ");
  const concordDisplay = rightWord
    ? (<>{leftWord}<br />&<br />{rightWord}</>)
    : concordName;

  return (
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
          <dd className="type-caps concord-meta-value">{concord?.element ?? teamData?.element ?? "unknown"}</dd>
        </div>
        <div className="concord-meta-row">
          <dt className="type-caps">Ruling Planet:</dt>
          <dd className="type-caps concord-meta-value">{teamData?.planet ?? "unknown"}</dd>
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
  );
}

// Shared: stat rows
function StatsList({ character }) {
  const stats = character.stats ?? {};
  const statEntries = Object.entries(STAT_LABELS).map(([key, label]) => ({
    key,
    label,
    value: Number(stats[key] ?? 0)
  }));
  return (
    <section className="character-stats" aria-label="Character stats">
      {statEntries.map((entry) => (
        <div key={entry.key} className="character-stat-row">
          <span className="type-caps character-stat-label">{entry.label}:</span>
          <span className="type-logo character-stat-value">{"+".repeat(Math.max(0, entry.value)) || "\u00a0"}</span>
        </div>
      ))}
    </section>
  );
}

export function PlayersPage({ characters, teamBlueprint, currentCharacter, characterClassMap, onToggleExcluded, getPathFromRoute, onNavigate }) {
  const adminMode = isAdmin(currentCharacter);

  const groupedByConcord = Object.keys(teamBlueprint).map((concordId) => {
    const members = characters
      .filter((player) => player.concordId === concordId)
      .sort((a, b) => (a.characterName ?? a.realName ?? "").localeCompare(b.characterName ?? b.realName ?? ""));
    const officialCount = members.filter((m) => !m.excludedFromCount).length;
    return {
      concordId,
      concordName: teamBlueprint[concordId]?.concordName ?? concordId,
      backgroundColor: PLAYERS_CONCORD_HEADING_COLORS[concordId] ?? "#000000",
      memberColor: PLAYERS_CONCORD_MEMBER_COLORS[concordId] ?? "#000000",
      members,
      officialCount,
      teamHighestMystery: members.reduce((max, member) => {
        const mystery = Number(member?.stats?.mystery ?? 0);
        return Math.max(max, mystery);
      }, 0)
    };
  }).filter((group) => group.members.length > 0);

  return (
    <main className="players-layout">
      <section className="players-concord-groups" aria-label="Players by concord">
        {groupedByConcord.map((group) => (
          <article key={group.concordId} className="players-concord-group">
            <h2 className="type-caps players-concord-name" style={{ color: group.backgroundColor }}>
              {group.concordName}
              {adminMode ? <span className="type-caps players-admin-count"> ({group.officialCount}/7)</span> : null}
            </h2>
            <div className="concord-players-list">
              {group.members.map((member) => {
                return (
                  <div key={`${group.concordId}-${member.realName}`} className="players-member">
                    <p className="concord-player-name" style={{ color: member.excludedFromCount ? "#000000" : group.memberColor }}>
                      <a href={getPathFromRoute({ page: "player-detail", characterId: member.id })} onClick={onNavigate({ page: "player-detail", characterId: member.id })} className="concord-player-link">
                        {member.characterName ?? member.realName}
                      </a>
                      {member.characterName && member.characterName !== member.realName ? <span className="players-real-name type-caps" style={{fontSize: '6px !important'}}> ({member.realName})</span> : null}
                      {adminMode && !member.rsvpMatched ? <span className="players-unmatched" aria-label="unmatched">~</span> : null}
                      {/* characterClass display hidden until classes are ready to ship */}
                      {adminMode ? (
                        <button
                          className="type-caps players-admin-toggle"
                          onClick={() => onToggleExcluded(member.id, !member.excludedFromCount)}
                        >
                          {member.excludedFromCount ? "include" : "exclude"}
                        </button>
                      ) : null}
                    </p>
                  </div>
                );
              })}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function CharacterPage({ character, characterClass, teamBlueprint, concord, shortConcordLore, costumeImagesByConcord, detailTab, onOpenTab, onOpenConcord, getPathFromRoute, onSaveCharacterName }) {
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
  const concordBody = useMemo(() => {
    if (!concord) return [];
    return concord.bodyParagraphs ?? (concord.body ? [concord.body] : []);
  }, [concord]);

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
      <ConcordSidebar
        character={character}
        concord={concord}
        teamData={teamData}
        getPathFromRoute={getPathFromRoute}
        onOpenConcord={onOpenConcord}
      />

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
          onBlur={() => { void commitCharacterName(); }}
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
          <StatsList character={character} />
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
            {(shortConcordLore ?? []).map((paragraph, index) => (
              <p key={`${character.concordId}-short-${index}`} className="character-concord-paragraph">{renderConcordWord(paragraph)}</p>
            ))}
            <a
              href={getPathFromRoute({ page: "concord-detail", concordId: character.concordId, detailTab: "backstory" })}
              onClick={onOpenConcord(character.concordId)}
              className="type-caps character-more-lore-btn"
            >
              More
            </a>
          </section>
        )}
      </article>
    </main>
  );
}

export function PublicCharacterPage({ character, charactersLoaded, characterClass, teamBlueprint, concord, getPathFromRoute, onNavigate }) {
  if (!character) {
    return (
      <main className="concord-detail-layout character-detail-layout">
        <aside className="concord-detail-left" />
        <article className="concord-detail-right character-detail-right">
          {charactersLoaded ? <p className="type-caps">Character not found.</p> : null}
        </article>
      </main>
    );
  }

  const teamData = teamBlueprint[character.concordId] ?? null;

  return (
    <main className="concord-detail-layout character-detail-layout">
      <ConcordSidebar
        character={character}
        concord={concord}
        teamData={teamData}
        getPathFromRoute={getPathFromRoute}
        onOpenConcord={(concordId) => onNavigate({ page: "concord-detail", concordId, detailTab: "backstory" })}
      />

      <article className="concord-detail-right character-detail-right">
        <a
          href={getPathFromRoute({ page: "players" })}
          onClick={onNavigate({ page: "players" })}
          className="type-caps public-character-back"
        >
          ← Players
        </a>
        <p className="character-name-hero-display">
          {character.characterName ?? character.realName}
          {character.characterName && character.characterName !== character.realName
            ? <span className="type-caps public-character-realname"> ({character.realName})</span>
            : null}
        </p>
        {characterClass && (
          <p className="public-character-class">
            <a
              href={getPathFromRoute({ page: "manual-classes", anchor: characterClass.id })}
              onClick={onNavigate({ page: "manual-classes", anchor: characterClass.id })}
              className="public-character-class-link"
            >
              {characterClass.tag}
            </a>
            {CLASS_LORE_BY_ID[characterClass.id]
              ? <span className="public-character-class-lore">{renderClassLore(CLASS_LORE_BY_ID[characterClass.id])}</span>
              : null}
          </p>
        )}
        <StatsList character={character} />
        {(() => {
          const classData = characterClass ? CLASS_DATA_BY_ID[characterClass.id] : null;
          const dumbLuck = Number(character.stats?.dumbLuck ?? 0);
          const isPeasant = characterClass?.id === PEASANT_CLASS_ID;
          const showClassPerk = classData?.perk && (!isPeasant || dumbLuck >= 4);
          const hasFeelingLucky = !isPeasant && dumbLuck >= 5;
          const peasantData = CLASS_DATA_BY_ID[PEASANT_CLASS_ID];
          if (!showClassPerk && !hasFeelingLucky) return null;
          return (
            <section className="public-character-perks" aria-label="Perks">
              <p className="type-caps public-character-perks-heading">Perks</p>
              {showClassPerk && (
                <p className="type-body public-character-perk">
                  <span className="type-caps public-character-perk-label">{classData.perkLabel ?? "Perk"}: </span>
                  {classData.perk}
                </p>
              )}
              {hasFeelingLucky && peasantData?.perk && (
                <p className="type-body public-character-perk">
                  <span className="type-caps public-character-perk-label">{peasantData.perkLabel ?? "Feeling Lucky"}: </span>
                  {peasantData.perk}
                </p>
              )}
            </section>
          );
        })()}
      </article>
    </main>
  );
}
