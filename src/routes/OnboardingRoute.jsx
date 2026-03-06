import React from "react";

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
  assignedClass,
  zodiacSign,
  assignedConcordCard,
  welcomeName,
  error,
  statKeys,
  statLabels,
  onNameChange,
  onBotTrapChange,
  onBirthDateChange,
  onAdjustStat,
  onResetStats,
  onBack,
  onNext,
  onHoverOmenStart,
  onHoverOmenEnd
}) {
  return (
    <main className="onboarding-layout">
      <section className={`onboarding-panel${step === 1 ? " onboarding-panel-name" : ""}${step === 2 ? " onboarding-panel-birth" : ""}${step === 3 ? " onboarding-panel-traits" : ""}${step === 4 ? " onboarding-panel-concord" : ""}`}>
        {step === 1 ? (
          <>
            <p className="onboarding-name-prompt type-logo" onMouseEnter={onHoverOmenStart} onMouseLeave={onHoverOmenEnd}>what is your real name</p>
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
            <input className="bot-trap-input" tabIndex="-1" autoComplete="off" value={form.botTrap} onChange={(event) => onBotTrapChange(event.target.value)} />
          </>
        ) : null}

        {step === 2 ? (
          <>
            <button type="button" className="onboarding-back-link" onClick={onBack}>(not you? go back)</button>
            <p className="onboarding-name-prompt type-logo">Welcome, {welcomeName}</p>
            <p className="type-body onboarding-lede onboarding-birth-prompt">What stars were you born under?</p>
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
            <p className="onboarding-name-prompt type-logo">Ah a, {zodiacSign}</p>
            <p className="type-body onboarding-lede">Let's see your mettle. Allocate 16 shards below</p>
            <p className="onboarding-meta type-caps">Points Remaining: {remainingPoints}</p>
            {statKeys.map((statKey) => (
              <div key={statKey} className="stat-row">
                <span className="type-caps stat-label">{statLabels[statKey] ?? statKey}:</span>
                <button type="button" className="stat-btn" onClick={() => onAdjustStat(statKey, -1)}>-</button>
                <span className="type-caps stat-value">{"+".repeat(form.stats[statKey]) || "\u00a0"}</span>
                <button type="button" className="stat-btn stat-btn-plus type-logo" onClick={() => onAdjustStat(statKey, 1)} aria-label={`Increase ${statLabels[statKey] ?? statKey}`}>+</button>
              </div>
            ))}
            <p className="onboarding-meta type-caps">Class: {assignedClass}</p>
          </>
        ) : null}

        {step === 4 ? (
          <>
            <p className="onboarding-name-prompt type-logo">You are an esteemed member of</p>
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
          </>
        ) : null}

        {error ? <p className="onboarding-error">{error}</p> : null}

        <div className="onboarding-actions">
          {step > 1 && step !== 2 ? <button type="button" className="onboarding-btn type-caps" onClick={onBack}>Back</button> : null}
          {step === 3 ? <button type="button" className="onboarding-btn type-caps" onClick={onResetStats}>Restart</button> : null}
          <button type="button" className="onboarding-btn type-caps" onClick={onNext}>{step === 4 ? "FINISH" : "SWEAR"}</button>
        </div>
      </section>
    </main>
  );
}
