import React from "react";

const BASE = import.meta.env.BASE_URL;

const CARDS = [
  { src: `${BASE}cards/business-1.png`, label: "Ace" },
  { src: `${BASE}cards/business-2.png`, label: "2" },
  { src: `${BASE}cards/business-3.png`, label: "3" },
  { src: `${BASE}cards/business-4.png`, label: "4" },
  { src: `${BASE}cards/business-5.png`, label: "5" },
];

function Kw({ children }) {
  return <span className="combat-keyword">{children}</span>;
}

export function CombatRoute({ getPathFromRoute, onNavigate }) {
  return (
    <main id="combat-page" className="combat-layout">
      <a href={getPathFromRoute({ page: "manual" })} onClick={onNavigate({ page: "manual" })} className="type-caps page-back-link">
        <span className="type-logo page-back-arrow">‹</span>Handbook
      </a>
      <p className="type-logo header-accent">Rules of Combat</p>

      <section className="combat-rules">
        <div className="combat-rule-block">
          <h2 className="type-caps combat-section-label">Setup</h2>

          <p className="type-body">
            In Necropolis, ritual combat is waged between an <Kw>Attacker</Kw> and a <Kw>Defender</Kw>. Each holds 5 weapons — cards numbered 1 through 5 — rife with deadly potential. The duel unfolds across three beats: <Kw>Ready</Kw>, <Kw>Set</Kw>, <Kw>Draw</Kw>, on which you will each choose weapons simultaneously to determine the victor. 
          </p>

          <section className="combat-cards-row" aria-label="Playing cards">
            {CARDS.map((card) => (
              <img key={card.label} src={card.src} alt={card.label} className="combat-card-img" />
            ))}
          </section>

          <h3 className="type-caps combat-subsection-label">Prepare</h3>
          <p className="type-body">
          Face your opponent. Keep your cards close together to shield your movements, and your weapons close.
          </p>

          <h3 className="type-caps combat-subsection-label">Choose Your Weapon</h3>
          <p className="type-body">Make solemn eye contact.</p>
          <ol className="combat-weapon-steps">
            <li className="type-body"><Kw>Ready</Kw> — When the timing feels right, say <Kw>Ready</Kw> together.</li>
            <li className="type-body"><Kw>Set</Kw> — Place your hand upon your weapon of choice.</li>
            <li className="type-body"><Kw>Draw</Kw> — Flip your chosen card outward and hold it in place — it becomes a <Kw>Played Card</Kw>, visible to your opponent for the rest of the duel.</li>
          </ol>

          <h3 className="type-caps combat-subsection-label">Scoring</h3>
          <p className="type-body">Each round, add both weapons together into a running total.</p>
          <p className="type-body">If the number of <Kw>Death Points</Kw> played matches a multiple of 5 — (5, 10, 15, 20, or 25) — the <Kw>Attacker</Kw> wins.</p>
          <p className="type-body">If no multiple of 5 is ever achieved after each combatant plays all their weapons (and the total hits 30) the <Kw>Defender</Kw> wins.</p>
          <p className="type-body">Remember — a weapon once played cannot be played again.</p>

        </div>

        <div className="combat-rule-block">
          <h2 className="type-caps combat-section-label">How to Play</h2>

          {/* Round 1 */}
          <div className="combat-round">
            <p className="type-logo combat-round-header">Round 1</p>

            <div className="combat-step-pair">
              <div className="combat-step-col">
                <img src={`${BASE}combat/combat-1.png`} alt="Step 1" className="combat-diagram" />
                <p className="type-body">Both combatants face each other, weapons held outward. Say <Kw>Ready</Kw>.</p>
              </div>
              <div className="combat-step-col">
                <img src={`${BASE}combat/combat-2.png`} alt="Step 2" className="combat-diagram" />
                <p className="type-body">Place your hand upon your chosen weapon and say <Kw>Set</Kw>.</p>
              </div>
            </div>

            <div className="combat-step-solo combat-step-solo-centered">
              <img src={`${BASE}combat/combat-3.png`} alt="Step 3" className="combat-diagram" />
              <p className="type-body">Say <Kw>Draw</Kw> — flip your chosen card outward so your opponent may witness it.</p>
              <p className="type-body">The weapons total 8. No multiple of 5 — the duel continues. <Kw>Played Cards</Kw> remain visible.</p>
            </div>
          </div>

          {/* Round 2 */}
          <div className="combat-round">
            <p className="type-logo combat-round-header">Round 2</p>

            <div className="combat-step-pair">
              <div className="combat-step-col">
                <img src={`${BASE}combat/combat-4.png`} alt="Ready" className="combat-diagram" />
                <p className="type-body">Say <Kw>Ready</Kw>.</p>
              </div>
              <div className="combat-step-col">
                <img src={`${BASE}combat/combat-5.png`} alt="Set" className="combat-diagram" />
                <p className="type-body">Place your hand and say <Kw>Set</Kw>.</p>
              </div>
              <div className="combat-step-col">
                <img src={`${BASE}combat/combat-6.png`} alt="Draw" className="combat-diagram" />
                <p className="type-body">Say <Kw>Draw</Kw> and reveal your weapon.</p>
              </div>
              <div className="combat-step-col">
                <img src={`${BASE}combat/combat-7.png`} alt="Attacker wins" className="combat-diagram" />
                <p className="type-body">The running total strikes 15. The <Kw>Attacker</Kw> wins!</p>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
