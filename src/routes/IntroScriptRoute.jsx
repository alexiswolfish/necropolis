import React from "react";

export function IntroScriptRoute({ getPathFromRoute, onNavigate }) {
  const rosPath = getPathFromRoute({ page: "run-of-show" });

  return (
    <main className="script-layout">
      <a
        href={rosPath}
        onClick={onNavigate({ page: "run-of-show" })}
        className="type-caps page-back-link"
      >
        <span className="type-logo page-back-arrow">‹</span>Run of Show
      </a>

      <div className="script-page-header">
        <p className="ros-act-darksame">introduction — the grand tournament</p>
        <h1 className="ros-act-heading">ACT ONE</h1>
        <p className="script-page-subtitle type-caps">Intro Script</p>
      </div>

      <div className="script-sections">

        {/* 1 — NARRATOR: Opening */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>Hail from the Hollows.</p>
            <p>Thank you for journeying from across our hallowed lands for the grand tournament of IMMORTALS, those who have conquered Death, may their names be both lauded and defamed.</p>
            <p>We gather here to celebrate that conquest, and the eightfold CONCORDS dedicated to human striving each which makes LIFE worth LIVING.</p>
            <p>We have present:</p>
            <ul className="script-concord-list type-body">
              <li>Pleasure &amp; Treasure — Hedonism</li>
              <li>Desire &amp; Conspire — Ambition</li>
              <li>Brood &amp; Feud — Conquest</li>
              <li>Zeal &amp; Steel — Legacy</li>
              <li>Tears &amp; Spears — Fealty / Devotion</li>
              <li>Wit &amp; Spit — Knowledge / Cunning</li>
              <li>Laurels &amp; Quarrels — Glory</li>
              <li>Veils &amp; Sails — Rapture</li>
            </ul>
            <p>And we compete to see whose CREED will reign supreme.</p>
          </div>
        </section>

        {/* 2 — NARRATOR: Win Conditions */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>To WIN the Grand Tournament, you are competing to see who first can gather the FIVE relics hidden in these lands. And who can slay the most combatants in the meantime.</p>
            <p>Each is guarded by a pair of SHRINE KEEPERS who will have puzzles + challenges for you before you can win their favor.</p>
            <p>You must have at least one Soul Shard to play their games.</p>
          </div>
        </section>

        {/* 3 — JORDAN: Introduce Combat */}
        <section className="script-section">
          <p className="script-speaker type-caps">Jordan — Introduce Combat</p>
          <div className="script-body type-body">
            <p>The easiest way to prevent other teams from beating you is constantly keeping them on the ropes.</p>
            <ul className="script-bullet-list type-body">
              <li>Explain combat rules</li>
              <li>Demonstrate fighting with Alex</li>
            </ul>
            <p>When you lose, you must surrender to the victor a SHARD of your soul.</p>
          </div>
        </section>

        {/* 4 — Explain Curses + Blessings */}
        <section className="script-section">
          <p className="script-speaker type-caps">Explain Curses + Blessings</p>
          <div className="script-body type-body">
            <p>CURSES — a penalty for failing a challenge, or attempting a shrine without at least one shard of Soul. They are active until you dispel them, or for fifteen minutes of your doomed life.</p>
            <p>You can wear them on your person by fastening with a clip.</p>
            <p>BLESSINGS — a powerful spell that wards off evil. You'll see what they do.</p>
          </div>
        </section>

        {/* 5 — NARRATOR / Alex: Closing */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator / Alex</p>
          <div className="script-body type-body">
            <p>Don't worry, if you lose all 3 you can always return here to the GREAT HALL to see me, gather some refreshments and I'd be happy to create you more.</p>
            <p>After all, you are conquerors all, and shall not yield to DEATH.</p>
            <p>And on that note, SHRINE KEEPERS, you may convene to your SHRINES.</p>
            <p>And CONCORDS, after conferring on strategy here, may you all venture forth into Necropolis, and be both cursed + blessed.</p>
          </div>
        </section>

      </div>

      <a href={`${rosPath}#act-two`} className="script-continue-link type-caps">
        Continue to Act Two <span className="type-logo script-continue-arrow">›</span>
      </a>
    </main>
  );
}
