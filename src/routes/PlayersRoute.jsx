import React, { useEffect, useState } from "react";

export function PlayersPage({ characters, teamBlueprint }) {
  return (
    <main className="players-layout">
      <h1 className="type-before players-title">Players</h1>
      <p className="type-caps players-subtitle">{characters.length} registered</p>
      <section className="players-list" aria-label="Registered players">
        {characters.map((player) => {
          const team = teamBlueprint[player.concordId];
          return (
            <article key={`${player.realName}-${player.completedAt}`} className="player-card">
              <p className="player-name">{player.realName}</p>
              <p className="player-meta type-caps">{player.zodiacSign} • {team?.concordName ?? player.concordId}</p>
              <p className="player-meta type-caps">{player.className}</p>
            </article>
          );
        })}
      </section>
    </main>
  );
}

export function CharacterPage({ character, allCharacters, onSaveRoster, concordTeams, teamBlueprint }) {
  const [draft, setDraft] = useState(() => allCharacters);

  useEffect(() => {
    setDraft(allCharacters);
  }, [allCharacters]);

  const updateEntry = (index, key, value) => {
    setDraft((current) => {
      const next = [...current];
      next[index] = { ...next[index], [key]: value };
      return next;
    });
  };

  const removeEntry = (index) => {
    setDraft((current) => current.filter((_, i) => i !== index));
  };

  return (
    <main className="character-layout">
      <section className="character-summary">
        <h1 className="type-before character-title">Character</h1>
        {character ? (
          <>
            <p className="type-body">{character.realName}</p>
            <p className="type-caps">{character.zodiacSign} • {teamBlueprint[character.concordId]?.concordName ?? character.concordId}</p>
            <p className="type-caps">{character.className}</p>
          </>
        ) : (
          <p className="type-caps">No character completed yet.</p>
        )}
      </section>

      <section className="roster-editor" aria-label="Roster editor">
        <h2 className="type-caps">Roster Editor</h2>
        {draft.map((entry, index) => (
          <div key={`${entry.realName}-${index}`} className="roster-row">
            <input className="onboarding-input" value={entry.realName ?? ""} onChange={(event) => updateEntry(index, "realName", event.target.value)} />
            <input className="onboarding-input" value={entry.zodiacSign ?? ""} onChange={(event) => updateEntry(index, "zodiacSign", event.target.value)} />
            <select className="onboarding-input" value={entry.concordId ?? ""} onChange={(event) => updateEntry(index, "concordId", event.target.value)}>
              {concordTeams.map((teamId) => (
                <option key={teamId} value={teamId}>{teamBlueprint[teamId].concordName}</option>
              ))}
            </select>
            <input className="onboarding-input" value={entry.className ?? ""} onChange={(event) => updateEntry(index, "className", event.target.value)} />
            <button type="button" className="onboarding-btn" onClick={() => removeEntry(index)}>Remove</button>
          </div>
        ))}
        <div className="onboarding-actions">
          <button type="button" className="onboarding-btn" onClick={() => onSaveRoster(draft)}>Save Roster</button>
        </div>
      </section>
    </main>
  );
}
