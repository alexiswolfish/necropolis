import React from "react";

export function CrowningScriptRoute({ getPathFromRoute, onNavigate }) {
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
        <p className="ros-act-darksame">Death must claim us all</p>
        <h1 className="ros-act-heading">ACT FOUR</h1>
        <p className="script-page-subtitle type-caps">Crowning Script</p>
      </div>

      <div className="script-sections">

        {/* Stage direction */}
        <section className="script-section">
          <p className="script-direction type-body">Alex + Emily will be on the stage. Emily is holding the crown for the VICTOR's ceremony.</p>
        </section>

        {/* NARRATOR: Crowning */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>Concords! Gather round. The hour of crowning is upon us. Can we call our VICTOR up onto the stage.</p>
            <p>Congratulations [CONCORD] on your victory. You are both cursed and blessed, and may your names, no further ink inscribe. Let [CREED] rule Necropolis from this day forward.</p>
          </div>
        </section>

        {/* DEATH: Kneel */}
        <section className="script-section">
          <p className="script-speaker type-caps">Death</p>
          <div className="script-body type-body">
            <p>[NAME], KNEEL.</p>
          </div>
          <p className="script-direction type-body">Steps forward through the crowd, and places her arm on the champion's shoulder.</p>
        </section>

        {/* DEATH: Rise */}
        <section className="script-section">
          <p className="script-speaker type-caps">Death</p>
          <div className="script-body type-body">
            <p>RISE. YOU ARE MY CHAMPION NOW.</p>
          </div>
          <p className="script-direction type-body">DEATH puts the crown on her own head.</p>
        </section>

        {/* JORDAN: Manhunt */}
        <section className="script-section">
          <p className="script-speaker type-caps">Jordan</p>
          <div className="script-body type-body">
            <p>Well. That's unfortunate.</p>
            <p>Death has claimed your champion. And she intends to claim the rest of you. What follows is a manhunt.</p>
            <p>Here's what you need to know.</p>
            <p>Death and her army — including your newly fallen champion — will hunt you through the grounds. They must walk. They cannot run. But they do not tire, and they do not stop.</p>
            <p>If a minion touches you on the shoulder, you are turned. You join the dead, and walk with them.</p>
          </div>
        </section>

        {/* NARRATOR: HOLLOW */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>If you have a card like this — HOLLOW — during the tournament you paid too steep a price, and you are now part of Death's army.</p>
          </div>
        </section>

        {/* JOHN: BLESSED */}
        <section className="script-section">
          <p className="script-speaker type-caps">John</p>
          <div className="script-body type-body">
            <p>And if you have a card like this — BLESSED — you are living, and you have fifteen minutes to find each other, compare information, and complete the ritual and cling to the rest of your humanity.</p>
          </div>
        </section>

        {/* NARRATOR: Light + Ferryman + how Death wins */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>But you are not defenseless.</p>
            <p>If you carry a light — a candle, a wizard's staff — you cannot be turned. The dead cannot touch you while your light holds.</p>
            <p>If you solved the clues earlier, it's possible the Ferryman gave you a ritual to subdue Death once more.</p>
            <p>But here is how Death wins.</p>
            <p>When this runs out and the bell tolls three times — it is over. Death wins. And we toast to her reign, may it be both eternal and merciful.</p>
          </div>
        </section>

        {/* [OPTIONAL] NARRATOR: Candle ritual — how players win */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator <span className="script-speaker-note">(optional)</span></p>
          <div className="script-body type-body">
            <p>There are five candles, one hidden at each of the five shrines. Find them. Five players, each holding a lit candle, must surround Death.</p>
            <p>And then — a sixth player, one without a candle, must step forward and kiss Death's outstretched hand.</p>
            <p>The curse is broken. And you may all find rest.</p>
          </div>
        </section>

        {/* [OPTIONAL] NARRATOR: 10 seconds */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator <span className="script-speaker-note">(optional)</span></p>
          <div className="script-body type-body">
            <p>Death is feeling generous. She will grant you ten seconds to run.</p>
          </div>
        </section>

        {/* DEATH: Flips timer */}
        <section className="script-section">
          <p className="script-speaker type-caps">Death</p>
          <p className="script-direction type-body">*Flips timer*</p>
        </section>

        {/* DEATH: Countdown */}
        <section className="script-section">
          <p className="script-speaker type-caps">Death</p>
          <div className="script-body type-body">
            <p>BLESSED. YOU HAVE TEN SECONDS TO RUN BEFORE WE HUNT YOU THROUGH THE GROUNDS.</p>
            <p>TEN.</p>
            <p>NINE.</p>
          </div>
        </section>

        {/* Stage direction: after countdown */}
        <section className="script-section">
          <p className="script-direction type-body">After the count finishes, Minions of DEATH start to turn everyone in the room.</p>
          <p className="script-direction type-body">After the countdown, anyone too slow to leave the Great Hall gets converted on the spot by the minions. The hunt plays out across the venue until either the players complete the candle ritual or the timer runs out and the bell tolls three times. Everyone reconvenes for champagne and a toast regardless of outcome.</p>
        </section>

      </div>

      <a
        href={`${rosPath}#act-five`}
        onClick={onNavigate({ page: "run-of-show", scrollTo: "act-five" })}
        className="script-continue-link type-caps"
      >
        Continue to Act Five <span className="type-logo script-continue-arrow">›</span>
      </a>
    </main>
  );
}
