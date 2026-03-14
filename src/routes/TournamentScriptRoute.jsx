import React from "react";

export function TournamentScriptRoute({ getPathFromRoute, onNavigate }) {
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
        <p className="ros-act-darksame">Tournament</p>
        <h1 className="ros-act-heading">ACT THREE</h1>
        <p className="script-page-subtitle type-caps">Tournament Script</p>
      </div>

      <div className="script-sections">

        {/* 1 — NARRATOR: Welcome back + declare victor */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>Welcome back everyone! I'm glad to see you covered in gore, and engaged in murderous bloodshed. I see also that many of you have been CURSED and a few have been BLESSED. Well done!</p>
            <p>We are here to declare a final VICTOR of the grand tournament.</p>
            <p>Will it be: <em>(list off the 3 concords with the highest kills)</em></p>
            <p>Let's consult our Assassins guild from the Garden to see who spilled the most blood.</p>
          </div>
        </section>

        {/* 2 — JESS: Team kills */}
        <section className="script-section">
          <p className="script-speaker type-caps">Jess</p>
          <div className="script-body type-body">
            <p>List off the most murderous teams, and anything else you feel like saying.</p>
          </div>
        </section>

        {/* 3 — JORDAN: Individual kills */}
        <section className="script-section">
          <p className="script-speaker type-caps">Jordan</p>
          <div className="script-body type-body">
            <p>Find the individuals with the highest kills.</p>
          </div>
        </section>

        {/* 4 — NARRATOR: Select champions */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>SELECT YOUR CHAMPIONS.</p>
          </div>
        </section>

        {/* 5 — NARRATOR: Send Valkyries ahead */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>Valkyries, please go prepare the GREAT HALL for our guests.</p>
          </div>
        </section>

        {/* 6 — JESS/KAVYA + GERI/KATE: Transition callout */}
        <section className="script-section">
          <p className="script-speaker type-caps">Jess / Kavya &nbsp;·&nbsp; Geri / Kate</p>
          <div className="script-body type-body">
            <p>Before the transition to Act Four — Geri, Jess, and Kavya slip out before everyone else and position themselves at the entrance to the Great Hall.</p>
            <ul className="script-bullet-list type-body">
              <li>Player has a <strong>BLESSED</strong> card — send them to the <strong>left</strong></li>
              <li>Player has a <strong>HOLLOW</strong> card — send them to the <strong>right</strong></li>
            </ul>
          </div>
        </section>

        {/* 7 — NARRATOR: Closing send-off */}
        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>Thank you to our COMPETING CHAMPIONS. We'll now head back to the GREAT HALL for the crowning ceremony — you might want to put on flat shoes, freshen up, use the restroom, get a bite to eat, lick your wounds.</p>
            <p>In 10 minutes, we'll call our VICTOR up on stage to receive their prize.</p>
          </div>
        </section>

      </div>

      <a
        href={`${rosPath}#act-four`}
        onClick={onNavigate({ page: "run-of-show", scrollTo: "act-four" })}
        className="script-continue-link type-caps"
      >
        Continue to Act Four <span className="type-logo script-continue-arrow">›</span>
      </a>
    </main>
  );
}
