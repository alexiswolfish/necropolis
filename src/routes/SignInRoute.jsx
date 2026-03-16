import React, { useMemo, useState } from "react";

// ─── Name helpers ──────────────────────────────────────────────────────────────

function normalizeName(name) {
  return String(name ?? "")
    .trim()
    .toLowerCase()
    .replace(/[^\w\s]/g, " ")
    .replace(/\s+/g, " ");
}

function tokenizeName(name) {
  return normalizeName(name).split(" ").filter(Boolean);
}

function tokensLikelyMatch(a, b, minPrefix = 3) {
  if (!a || !b) return false;
  if (a === b) return true;
  if (a.length >= minPrefix && b.startsWith(a)) return true;
  if (b.length >= minPrefix && a.startsWith(b)) return true;
  return false;
}

function namesLikelyMatch(inputName, candidateName) {
  const inputTokens = tokenizeName(inputName);
  const candidateTokens = tokenizeName(candidateName);
  if (inputTokens.length === 0 || candidateTokens.length === 0) return false;

  if (inputTokens.join(" ") === candidateTokens.join(" ")) return true;
  if (!tokensLikelyMatch(inputTokens[0], candidateTokens[0])) return false;

  const inputLast = inputTokens[inputTokens.length - 1];
  const candidateLast = candidateTokens[candidateTokens.length - 1];
  if (!inputLast || !candidateLast) return false;
  if (tokensLikelyMatch(inputLast, candidateLast, 2)) return true;
  if (inputLast.length === 1 && candidateLast.startsWith(inputLast)) return true;
  if (candidateLast.length === 1 && inputLast.startsWith(candidateLast)) return true;
  return false;
}

function scoreNameMatch(input, candidate) {
  if (!input || !candidate) return 0;
  const inputTokens = tokenizeName(input);
  const candidateTokens = tokenizeName(candidate);
  if (inputTokens.length === 0 || candidateTokens.length === 0) return 0;

  let score = 0;
  const inputFirst = inputTokens[0];
  const candidateFirst = candidateTokens[0];

  if (candidateFirst === inputFirst) score += 6;
  else if (candidateFirst?.startsWith(inputFirst) || inputFirst?.startsWith(candidateFirst)) score += 4;

  const inputLast = inputTokens[inputTokens.length - 1] ?? "";
  const candidateLast = candidateTokens[candidateTokens.length - 1] ?? "";
  if (inputLast && candidateLast) {
    if (candidateLast === inputLast) score += 5;
    else if (candidateLast.startsWith(inputLast) || inputLast.startsWith(candidateLast)) score += 3;
  }

  if (candidate.toLowerCase().includes(input.toLowerCase())) score += 2;
  if (namesLikelyMatch(input, candidate)) score += 8;
  return score;
}

function getCharacterSuggestions(input, allCharacters, limit = 5) {
  const trimmed = String(input ?? "").trim();
  if (trimmed.length < 2) return [];

  const scored = [];
  for (const character of allCharacters) {
    const realScore = scoreNameMatch(trimmed, character.realName);
    const charScore = character.characterName ? scoreNameMatch(trimmed, character.characterName) : 0;
    const best = Math.max(realScore, charScore);
    if (best > 0) scored.push({ character, score: best, preferCharName: charScore > realScore });
  }

  return scored
    .sort((a, b) => b.score - a.score || a.character.realName.localeCompare(b.character.realName))
    .slice(0, limit);
}

// ─── Birthday helpers ──────────────────────────────────────────────────────────

function parseMonthDayInput(input) {
  const trimmed = String(input ?? "").trim();
  if (!trimmed) return null;
  const monthDayMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (monthDayMatch) {
    const month = Number(monthDayMatch[1]);
    const day = Number(monthDayMatch[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return { month, day };
    return null;
  }
  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) return { month, day };
  }
  return null;
}

function monthDaySignature(value) {
  const parsed = parseMonthDayInput(value);
  if (!parsed) return null;
  return `${String(parsed.month).padStart(2, "0")}-${String(parsed.day).padStart(2, "0")}`;
}

function sameBirthdayMonthDay(left, right) {
  const l = monthDaySignature(left);
  const r = monthDaySignature(right);
  return Boolean(l && r && l === r);
}

function normalizeMonthDayInput(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

// ─── Component ─────────────────────────────────────────────────────────────────

export function SignInRoute({ allCharacters, onSignIn }) {
  const [nameInput, setNameInput] = useState("");
  const [birthday, setBirthday] = useState("");
  const [lockedCharacter, setLockedCharacter] = useState(null); // picked from suggestions
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

  const suggestions = useMemo(
    () => (lockedCharacter ? [] : getCharacterSuggestions(nameInput, allCharacters)),
    [nameInput, allCharacters, lockedCharacter]
  );

  const handleSelectSuggestion = (entry) => {
    setLockedCharacter(entry.character);
    setNameInput(entry.character.realName);
    setError("");
  };

  const handleClearLock = () => {
    setLockedCharacter(null);
    setError("");
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError("");
    setSubmitting(true);

    let found = null;

    if (lockedCharacter) {
      // Already narrowed to one person — just verify birthday
      found = sameBirthdayMonthDay(lockedCharacter.birthDate, birthday) ? lockedCharacter : null;
    } else {
      // Fuzzy search across real name and character name
      const trimmed = nameInput.trim();
      found = allCharacters.find((c) => {
        const birthdayMatch = sameBirthdayMonthDay(c.birthDate, birthday);
        if (!birthdayMatch) return false;
        const realMatch = normalizeName(c.realName) === normalizeName(trimmed) || namesLikelyMatch(trimmed, c.realName);
        const charMatch = c.characterName && (normalizeName(c.characterName) === normalizeName(trimmed) || namesLikelyMatch(trimmed, c.characterName));
        return realMatch || charMatch;
      }) ?? null;
    }

    if (!found) {
      setError("No character found for that name and birthday.");
      setSubmitting(false);
      return;
    }

    onSignIn(found);
  };

  const nameIsEmpty = !nameInput.trim();
  const birthdayIsEmpty = !birthday;

  return (
    <main className="sign-in-layout">
      <h1 className="type-display sign-in-title">Sign In</h1>
      <p className="type-body sign-in-lede">Enter the name and stars you used when you created your character. Character name also works.</p>
      <form className="sign-in-form" onSubmit={handleSubmit} noValidate>

        <div className="sign-in-label">
          <span className="type-caps sign-in-label-text">Name <span className="sign-in-hint">(real or character)</span></span>
          {lockedCharacter ? (
            <div className="sign-in-locked-name">
              <span className="sign-in-locked-realname">{lockedCharacter.realName}</span>
              {lockedCharacter.characterName && lockedCharacter.characterName !== lockedCharacter.realName && (
                <span className="sign-in-locked-charname">"{lockedCharacter.characterName}"</span>
              )}
              <button type="button" className="sign-in-clear-btn" onClick={handleClearLock} aria-label="Clear selection">×</button>
            </div>
          ) : (
            <input
              id="sign-in-name"
              className="sign-in-input"
              type="text"
              autoComplete="name"
              value={nameInput}
              onChange={(e) => { setNameInput(e.target.value); setError(""); }}
              required
            />
          )}
        </div>

        {suggestions.length > 0 && (
          <div className="sign-in-suggestions">
            <p className="type-caps sign-in-suggestions-label">Could you be this guy?</p>
            <div className="sign-in-suggestions-list">
              {suggestions.map(({ character, preferCharName }) => (
                <button
                  key={character.id}
                  type="button"
                  className="sign-in-suggestion-btn"
                  onClick={() => handleSelectSuggestion({ character, preferCharName })}
                >
                  {preferCharName && character.characterName
                    ? <><em>{character.characterName}</em> <span className="sign-in-suggestion-real">({character.realName})</span></>
                    : character.realName}
                </button>
              ))}
            </div>
          </div>
        )}

        <label className="sign-in-label" htmlFor="sign-in-birthday">
          <span className="type-caps sign-in-label-text">Birthday <span className="sign-in-hint">(MM/DD)</span></span>
          <input
            id="sign-in-birthday"
            className="sign-in-input"
            type="text"
            inputMode="numeric"
            placeholder="MM/DD"
            value={birthday}
            onChange={(e) => setBirthday(normalizeMonthDayInput(e.target.value))}
            required
          />
        </label>

        {error && <p className="sign-in-error" role="alert">{error}</p>}

        <button
          className="sign-in-btn type-caps"
          type="submit"
          disabled={submitting || nameIsEmpty || birthdayIsEmpty}
        >
          Enter the Hollows
        </button>
      </form>
    </main>
  );
}
