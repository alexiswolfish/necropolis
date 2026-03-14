import React from "react";

export function PlayersWinScriptRoute({ getPathFromRoute, onNavigate }) {
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
        <p className="ros-act-darksame">Finale</p>
        <h1 className="ros-act-heading">ACT FIVE</h1>
        <p className="script-page-subtitle type-caps">Players Win</p>
      </div>

      <div className="script-sections">

        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>With this ritual, you have pacified DEATH. She relents her hunt, and you may descend to the afterlife to live in peace with what humanity you have left.</p>
            <p>To the living, may your steps always be blessed.</p>
          </div>
          <p className="script-direction type-body">Call for a toast.</p>
        </section>

        <section className="script-section">
          <p className="script-speaker type-caps">Death</p>
          <div className="script-body type-body">
            <p>You have earned your rest. May it be both peaceful and brief.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
