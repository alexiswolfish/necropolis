import React, { useMemo } from "react";

const CHARACTER_NAME_PLACEHOLDERS = [
  "Angraharad of the Fell Flame",
  "Mordred the Truly Dreaded",
  "Lord Vetinari",
  "Ysoria, Ashen Regent",
  "Grimwald of Blackmere",
  "Mora Vex, Candle-Eater"
];

export function BeginGate({ onBegin, onHoverOmenStart, onHoverOmenEnd }) {
  return (
    <main className="onboarding-gate">
      <button
        type="button"
        className="begin-button type-before"
        onClick={onBegin}
        onMouseEnter={onHoverOmenStart}
        onMouseLeave={onHoverOmenEnd}
      >
        Begin
      </button>
    </main>
  );
}

export function OnboardingWizard({
  step,
  form,
  remainingPoints,
  zodiacSign,
  assignedConcordCard,
  assignedConcordDescription,
  welcomeName,
  nameSuggestions,
  error,
  statKeys,
  statLabels,
  onNameChange,
  onSelectNameSuggestion,
  onCharacterNameChange,
  onBotTrapChange,
  onBirthDateChange,
  onAdjustStat,
  onResetStats,
  onBack,
  onNext,
  onHoverOmenStart,
  onHoverOmenEnd
}) {
  const isStepThreeLocked = step === 3 && remainingPoints > 0;
  const characterNamePlaceholder = useMemo(
    () => CHARACTER_NAME_PLACEHOLDERS[Math.floor(Math.random() * CHARACTER_NAME_PLACEHOLDERS.length)],
    []
  );

  return (
    <main className="onboarding-layout">
      <section className={`onboarding-panel${step > 1 ? " onboarding-panel-has-back" : ""}${step === 1 ? " onboarding-panel-name" : ""}${step === 2 ? " onboarding-panel-birth" : ""}${step === 3 ? " onboarding-panel-traits" : ""}${step === 4 ? " onboarding-panel-concord" : ""}`}>
        {step > 1 ? <button type="button" className="onboarding-btn onboarding-btn-back onboarding-btn-back-arrow onboarding-back-anchor" onClick={onBack} aria-label="Go back">←</button> : null}
        {step === 1 ? (
          <>
            <p className="type-logo onboarding-header" onMouseEnter={onHoverOmenStart} onMouseLeave={onHoverOmenEnd}>what is your real name</p>
            <p className="onboarding-name-subnote">(the one you rsvped to partiful with)</p>
            <input
              id="real-name"
              className="onboarding-input"
              value={form.realName}
              onChange={(event) => onNameChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onNext();
                }
              }}
              autoComplete="name"
            />
            {nameSuggestions?.length ? (
              <div className="onboarding-name-suggestions" aria-label="Name suggestions">
                <p className="type-caps onboarding-name-suggestions-label">Could you be this guy?</p>
                <div className="onboarding-name-suggestions-list">
                  {nameSuggestions.map((suggestion) => (
                    <button
                      key={suggestion}
                      type="button"
                      className="onboarding-name-suggestion-btn"
                      onClick={() => onSelectNameSuggestion(suggestion)}
                    >
                      {suggestion}
                    </button>
                  ))}
                </div>
              </div>
            ) : null}
            <input className="bot-trap-input" tabIndex="-1" autoComplete="off" value={form.botTrap} onChange={(event) => onBotTrapChange(event.target.value)} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <p className="type-logo onboarding-header">Welcome, {welcomeName}</p>
            <p className="type-body-large onboarding-lede onboarding-birth-prompt">What stars were you born under?</p>
            <input
              id="birth-date"
              type="text"
              inputMode="numeric"
              placeholder="MM/DD"
              className="onboarding-input onboarding-input-birth"
              value={form.birthDate}
              onChange={(event) => onBirthDateChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onNext();
                }
              }}
            />
          </>
        ) : null}

        {step === 3 ? (
          <>
            <p className="type-logo onboarding-header">Ah, a {zodiacSign}.</p>
            <p className="type-body-large onboarding-lede">Let's see your mettle. Allocate {remainingPoints} shards below</p>
            {statKeys.map((statKey) => (
              <div key={statKey} className="stat-row">
                <span className="type-caps stat-label">{statLabels[statKey] ?? statKey}:</span>
                <button type="button" className="stat-btn" onClick={() => onAdjustStat(statKey, -1)}>-</button>
                <span className="type-logo stat-value">{"+".repeat(form.stats[statKey]) || "\u00a0"}</span>
                <button type="button" className="stat-btn stat-btn-plus type-caps" onClick={() => onAdjustStat(statKey, 1)} aria-label={`Increase ${statLabels[statKey] ?? statKey}`}>+</button>
              </div>
            ))}
          </>
        ) : null}

        {step === 4 ? (
          <>
            <p className="type-body-large onboarding-concord-intro">
              You are joining the <span className="concord-logo-word">CONCORD</span> of
            </p>
            {assignedConcordCard ? (
              <div
                className="concord-card onboarding-concord-card"
                style={{
                  "--card-bg": assignedConcordCard.colorBg,
                  "--card-secondary": assignedConcordCard.colorTop,
                  "--card-title": assignedConcordCard.colorTitle
                }}
              >
                <p className="concord-card-symbol">{assignedConcordCard.symbol}</p>
                <p className="concord-card-element">{assignedConcordCard.element.toLowerCase()}</p>
                <h3 className="concord-card-title">
                  {assignedConcordCard.title.split("\n").map((line, index, allLines) => (
                    <span key={`${assignedConcordCard.id}-${line}-${index}`}>
                      {line}
                      {index < allLines.length - 1 ? <br /> : null}
                    </span>
                  ))}
                </h3>
                <p className="concord-card-desire">{assignedConcordCard.desire.toLowerCase()}</p>
              </div>
            ) : null}
            <label className="onboarding-character-name-label type-body-large" htmlFor="character-name">Name your character (you can change this later)</label>
            <input
              id="character-name"
              className="onboarding-input onboarding-input-character"
              value={form.characterName ?? ""}
              onChange={(event) => onCharacterNameChange(event.target.value)}
              onKeyDown={(event) => {
                if (event.key === "Enter") {
                  event.preventDefault();
                  onNext();
                }
              }}
              placeholder={characterNamePlaceholder}
              autoComplete="off"
            />
          </>
        ) : null}

        {error ? <p className="onboarding-error">GRAVE ERROR. PLEASE LET ALEX KNOW THIS HAS FAILED, or TRY AGAIN</p> : null}

        <div className="onboarding-actions">
          {step === 3 ? <button type="button" className="onboarding-btn type-caps onboarding-btn-restart" onClick={onResetStats}>Restart</button> : null}
          <button type="button" className="onboarding-btn type-caps onboarding-btn-primary" onClick={onNext} disabled={isStepThreeLocked}>{step === 4 ? "ENTER" : "SWEAR"}</button>
        </div>
      </section>
    </main>
  );
}
