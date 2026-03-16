import React, { useEffect, useMemo, useState } from "react";
import { renderConcordWord } from "./ConcordsRoute";
import { CLASSES_DATA } from "./ManualClassesRoute";

const CLASS_LORE_BY_ID = Object.fromEntries(CLASSES_DATA.map((c) => [c.id, c.shortLore ?? c.lore]));
const CLASS_DATA_BY_ID = Object.fromEntries(CLASSES_DATA.map((c) => [c.id, c]));
const PEASANT_CLASS_ID = "peasant";
const NPC_CLASS_LORE = "A key denizen of the city of Necropolis. Do they mean you ill or well?";
const NPC_CLASS = {
  id: "npc",
  label: "NPC",
  tag: "NPC",
  shortLore: NPC_CLASS_LORE
};
const COMBAT_RULES_URL = "https://alexiswolfish.github.io/necropolis/manual/combat";
const COMBAT_LINK_CLASS_IDS = new Set(["reliquarian", "ossuary-monk"]);
const CLASS_BIO_PLACEHOLDERS = {
  "sepulchral-mage": "Tell us more about yourself.\nYour magical education began in circumstances that most respectable academies prefer not to discuss, namely…",
  "tomb-runner": "Tell us more about yourself.\nYour reputation for light fingers dates back to an incident involving…",
  "mortuary-medium": "Tell us more about yourself.\nYou once wrote a song about a certain incident, though the authorities insist it was really about…",
  reliquarian: "Tell us more about yourself.\nYou have been more comfortable in the wilderness ever since the unfortunate business with…",
  "lantern-warden": "Tell us more about yourself.\nYou earned your reputation during an altercation that historians now politely describe as…",
  "ossuary-monk": "Tell us more about yourself.\nThe forest first took an interest in you when…",
  peasant: "Tell us more about yourself.\nWow it is a lovely day."
};

function renderClassLore(text) {
  const parts = text.split(/([A-Z]{2,}(?:'[A-Z]+)?)/g);
  return parts.map((part, i) =>
    /^[A-Z]{2,}/.test(part)
      ? <span key={i} className="concord-logo-word">{part}</span>
      : part
  );
}

function CharacterClassSection({ character, characterClass, getPathFromRoute, onNavigate }) {
  if (!characterClass) return null;

  const displayClassName = characterClass.tag ?? characterClass.label;
  const classAnchor = characterClass.tag ?? characterClass.label.toLowerCase();
  const classLore = CLASS_LORE_BY_ID[characterClass.id];

  const classHeadingContent = (
    <>
      <span className="type-caps character-class-label">Class:</span>{" "}
      <span className="character-class-value">{displayClassName}</span>
    </>
  );

  const classHeading = getPathFromRoute && onNavigate
    ? (
      <a
        href={getPathFromRoute({ page: "manual-classes", anchor: classAnchor })}
        onClick={onNavigate({ page: "manual-classes", anchor: classAnchor })}
        className="public-character-class-link character-class-heading-link"
      >
        {classHeadingContent}
      </a>
    )
    : classHeadingContent;

  return (
    <section className="character-class-section" aria-label="Class">
      <p className="character-class-heading">{classHeading}</p>
      {classLore
        ? <p className="type-body character-class-lore">{characterClass ? renderClassLore(classLore) : classLore}</p>
        : null}
    </section>
  );
}

function PerkCombatLink() {
  return (
    <>
      {" "}
      <a href={COMBAT_RULES_URL} className="public-character-perk-link">Freshen up on Combat</a>
    </>
  );
}

function shouldAppendCombatLink(classId) {
  return COMBAT_LINK_CLASS_IDS.has(classId);
}

function CharacterPerksSection({ character, characterClass, className = "public-character-perks" }) {
  const classData = characterClass ? CLASS_DATA_BY_ID[characterClass.id] : null;
  const dumbLuck = Number(character.stats?.dumbLuck ?? 0);
  const isPeasant = characterClass?.id === PEASANT_CLASS_ID;
  const showClassPerk = classData?.perk && (!isPeasant || dumbLuck >= 4);
  const hasFeelingLucky = !isPeasant && dumbLuck >= 5;
  const peasantData = CLASS_DATA_BY_ID[PEASANT_CLASS_ID];

  if (!showClassPerk && !hasFeelingLucky) return null;

  return (
    <section className={className} aria-label="Perks">
      <p className="type-caps public-character-perks-heading">Perks</p>
      {showClassPerk && (
        <p className="type-body public-character-perk">
          <span className="type-caps public-character-perk-label">{classData.perkLabel ?? "Perk"}: </span>
          {classData.perk}
          {shouldAppendCombatLink(characterClass?.id) ? <PerkCombatLink /> : null}
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
}

function DeathsDisplay({ character }) {
  const deaths = character?.deaths ?? 0;
  const isHollow = deaths >= 7;
  return (
    <div className="public-character-deaths">
      <span className="type-caps public-character-deaths-label">True Deaths:</span>
      <span className="public-character-deaths-count">{deaths}</span>
      {isHollow && <span className="type-caps public-character-hollow-badge">Hollow</span>}
    </div>
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
  "death": "#FFA6D9",
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
  "death": "#111314",
  "desire-conspire": "#f58e84",
  "pleasure-treasure": "#fdbf68",
  "brood-feud": "#a62c37",
  "zeal-steel": "#b6bfc1",
  "tears-spears": "#f27291",
  "veils-sails": "#f8b6ba",
  "laurels-quarrels": "#d8a37b",
  "wit-spit": "#c0a9b3"
};

const NPC_LOCATIONS_BY_ID = {
  "c8d102ac-2ce5-453b-884f-a545e4163b2e": "Resurrection Shrine",       // Kate Laux
  "e11f3182-9032-408f-b0ec-087862993a29": "Minion of Death",           // Conor Doyle
  "7489374e-cc5f-4087-8284-6eb42a1e5f27": "Minion of Death",           // Ross Fischer
  "0bb97f08-c5bd-43d1-9934-99bbfcae3a21": "Game Master",                // Jordan F Morris
  "29450a65-8925-4b85-b4ef-c1b0870653cf": "Game Master",                // Alexandra K Wolfe
  "447ef375-c082-45ae-a05c-180e0b1b83f2": "The Hall of Final Passage",  // Geri W
  "4c31f8e3-5c1c-4406-9ba7-91f88ab2848f": "The Hall of Final Passage",  // Shane
  "5bd37ecd-5853-42d6-b8b9-bb96518d9269": "DEATH HERSELF",              // Em King
  "66833433-6685-4472-8e5e-fad404ad3df6": "The Potion Witch",           // Simi
  "1f87e602-cdea-4bc8-b4b3-6a1ce8592e53": "The Garden of Conditional Rites", // Kavya
  "d33631a4-e194-412e-b0b2-ec842765f394": "The Garden of Conditional Rites", // Jess
  "ccfa1543-2912-4282-a15f-4702fa82708a": "The Tribunal of Shattered Oaths", // Nancy
  "399891b4-52d8-4183-8213-c18c9af7c7c2": "The Gate of Names That Should Not Be", // Vina
  "bb7faac4-bc1b-4205-9632-f20a922d95a5": "The Ossuary of Unspoken Grief", // John Shen
  "5ab07127-7235-40b8-951c-9b80caf556b4": "The Ossuary of Unspoken Grief", // Ken Bongort
  "a7c35178-4a4a-4bf1-8407-9c93d44ba9fb": "Ingress & Potion Station"      // Theresa Cheng
};

export function getNpcLocation(id) {
  if (!id) return null;
  return NPC_LOCATIONS_BY_ID[id] ?? null;
}

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
    ? (
      <>
        {leftWord}
        <br />
        <span className="concord-detail-name-ampersand">&</span>
        <br />
        {rightWord}
      </>
    )
    : concordName;

  return (
    <aside className="concord-detail-left">
      <a
        href={getPathFromRoute({ page: "concord-detail", concordId: character.concordId, detailTab: "players" })}
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

function PlayerMemberRow({ member, adminMode, concordId, memberColor, realNameColor, classLabel, getPathFromRoute, onNavigate }) {
  return (
    <div className="players-member">
      <p className="concord-player-name" style={{ color: memberColor }}>
        <a href={getPathFromRoute({ page: "player-detail", characterId: member.id })} onClick={onNavigate({ page: "player-detail", characterId: member.id })} className="concord-player-link">
          {member.characterName ?? member.realName}
        </a>
        {member.characterName && member.characterName !== member.realName ? <span className="players-real-name type-caps" style={realNameColor ? { color: realNameColor } : undefined}> ({member.realName})</span> : null}
{classLabel ? <span className="players-class-label type-caps"> {classLabel}</span> : null}
      </p>
    </div>
  );
}

export function PlayersPage({ characters, teamBlueprint, currentCharacter, characterClassMap, getPathFromRoute, onNavigate, onUpdateDeaths }) {
  const adminMode = isAdmin(currentCharacter);

  const npcMembers = characters
    .filter((c) => c.excludedFromCount)
    .sort((a, b) => (a.characterName ?? a.realName ?? "").localeCompare(b.characterName ?? b.realName ?? ""));

  const npcIds = new Set(npcMembers.map((c) => c.id));

  const deathGroup = npcMembers.length > 0 ? {
    concordId: "death",
    concordName: "Death",
    backgroundColor: PLAYERS_CONCORD_HEADING_COLORS["death"],
    memberColor: PLAYERS_CONCORD_MEMBER_COLORS["death"],
    realNameColor: "#FFA6D9",
    members: npcMembers,
    officialCount: 0,
    showClass: true
  } : null;

  const groupedByConcord = Object.keys(teamBlueprint).map((concordId) => {
    const members = characters
      .filter((player) => player.concordId === concordId && !npcIds.has(player.id))
      .sort((a, b) => (a.characterName ?? a.realName ?? "").localeCompare(b.characterName ?? b.realName ?? ""));
    const officialCount = members.length;
    return {
      concordId,
      concordName: teamBlueprint[concordId]?.concordName ?? concordId,
      backgroundColor: PLAYERS_CONCORD_HEADING_COLORS[concordId] ?? "#000000",
      memberColor: PLAYERS_CONCORD_MEMBER_COLORS[concordId] ?? "#000000",
      members,
      officialCount,
      showClass: false
    };
  }).filter((group) => group.members.length > 0);

  const allGroups = [...(deathGroup ? [deathGroup] : []), ...groupedByConcord];

  return (
    <main className="players-layout">
      <section className="players-concord-groups" aria-label="Players by concord">
        {allGroups.map((group) => (
          <article key={group.concordId} className="players-concord-group">
            <h2 className="type-caps players-concord-name" style={{ color: group.backgroundColor }}>
              {group.concordName}
              {adminMode && group.concordId !== "death" ? <span className="type-caps players-admin-count"> ({group.officialCount}/7)</span> : null}
            </h2>
            <div className="concord-players-list">
              {group.members.map((member) => (
                <PlayerMemberRow
                  key={`${group.concordId}-${member.realName}`}
                  member={member}
                  adminMode={adminMode}
                  concordId={group.concordId}
                  memberColor={group.memberColor}
                  realNameColor={group.realNameColor ?? null}
                  classLabel={group.showClass ? (characterClassMap?.get(member.id)?.label ?? null) : null}
                  getPathFromRoute={getPathFromRoute}
                  onNavigate={onNavigate}
                  onUpdateDeaths={onUpdateDeaths}
                />
              ))}
            </div>
          </article>
        ))}
      </section>
    </main>
  );
}

export function CharacterPage({ character, characterClass, teamBlueprint, concord, shortConcordLore, costumeImagesByConcord, detailTab, onOpenTab, onOpenConcord, getPathFromRoute, onSaveCharacterName, onSaveCharacterBio }) {
  const [loadedCostumeImages, setLoadedCostumeImages] = useState({});
  const [nameDraft, setNameDraft] = useState(character?.characterName ?? "");
  const [bioDraft, setBioDraft] = useState(character?.characterBio ?? "");
  const [isSavingProfile, setIsSavingProfile] = useState(false);
  const [profileSaveMessage, setProfileSaveMessage] = useState("");

  useEffect(() => {
    setNameDraft(character?.characterName ?? "");
    setBioDraft(character?.characterBio ?? "");
    setProfileSaveMessage("");
  }, [character?.id, character?.realName, character?.characterName, character?.characterBio]);

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
  const bioPlaceholder = characterClass ? (CLASS_BIO_PLACEHOLDERS[characterClass.id] ?? "Tell us more about yourself.") : "Tell us more about yourself.";
  const concordBody = useMemo(() => {
    if (!concord) return [];
    return concord.bodyParagraphs ?? (concord.body ? [concord.body] : []);
  }, [concord]);

  const canSaveName = nameDraft.trim().length > 0 && (nameDraft.trim() !== (character.characterName ?? character.realName));
  const commitCharacterName = async () => {
    if (!canSaveName || isSavingProfile) return;
    setIsSavingProfile(true);
    setProfileSaveMessage("");
    const ok = await onSaveCharacterName(nameDraft.trim());
    setIsSavingProfile(false);
    setProfileSaveMessage(ok ? "Saved" : "Could not save");
  };
  const canSaveBio = bioDraft.trim() !== (character.characterBio ?? "");
  const commitCharacterBio = async () => {
    if (!canSaveBio || isSavingProfile) return;
    setIsSavingProfile(true);
    setProfileSaveMessage("");
    const ok = await onSaveCharacterBio(bioDraft.trim());
    setIsSavingProfile(false);
    setProfileSaveMessage(ok ? "Saved" : "Could not save");
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
          className="character-name-hero-input character-name-hero-input-private"
          value={nameDraft}
          onChange={(event) => {
            setNameDraft(event.target.value);
            setProfileSaveMessage("");
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
        <textarea
          id="character-bio-editor-input"
          className="character-bio-input"
          value={bioDraft}
          onChange={(event) => {
            setBioDraft(event.target.value);
            setProfileSaveMessage("");
          }}
          onBlur={() => { void commitCharacterBio(); }}
          maxLength={280}
          rows={3}
          placeholder={bioPlaceholder}
        />
        {profileSaveMessage ? <p className="type-caps character-name-save-msg">{profileSaveMessage}</p> : null}
        <CharacterClassSection character={character} characterClass={characterClass} />
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
          <>
            <StatsList character={character} />
            <CharacterPerksSection character={character} characterClass={characterClass} className="character-private-perks public-character-perks" />
          </>
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
              href={getPathFromRoute({ page: "concord-detail", concordId: character.concordId, detailTab: "players" })}
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

export function PublicCharacterPage({ character, charactersLoaded, characterClass, teamBlueprint, concord, getPathFromRoute, onNavigate, currentCharacter, onUpdateDeaths }) {
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

  const effectiveConcordId = character.excludedFromCount ? "death" : character.concordId;
  const teamData = teamBlueprint[effectiveConcordId] ?? null;
  const sidebarCharacter = character.excludedFromCount ? { ...character, concordId: "death" } : character;
  return (
    <main className="concord-detail-layout character-detail-layout public-character-layout">
      <p className="character-player-label type-caps">Player Name: {character.realName}</p>
      <p className="character-name-hero-display public-character-name">
        {character.characterName ?? character.realName}
      </p>
      {character.characterBio ? <p className="type-body-large public-character-bio">{character.characterBio}</p> : null}
      <p className="type-caps mobile-concord-heading">Concord</p>
      <ConcordSidebar
        character={sidebarCharacter}
        concord={concord}
        teamData={teamData}
        getPathFromRoute={getPathFromRoute}
        onOpenConcord={(concordId) => onNavigate({ page: "concord-detail", concordId, detailTab: "players" })}
      />
      <CharacterClassSection character={character} characterClass={characterClass} getPathFromRoute={getPathFromRoute} onNavigate={onNavigate} />
      {character.excludedFromCount ? (
        <div className="public-character-deaths">
          <span className="type-caps public-character-deaths-label">Location:</span>
          <span className="public-character-deaths-count public-character-location">{getNpcLocation(character.id) ?? "The Hollows"}</span>
        </div>
      ) : (
        <DeathsDisplay character={character} />
      )}
      <StatsList character={character} />
      <CharacterPerksSection character={character} characterClass={characterClass} />
    </main>
  );
}
