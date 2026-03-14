import React from "react";

export function DeathWinsScriptRoute({ getPathFromRoute, onNavigate }) {
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
        <p className="script-page-subtitle type-caps">Death Wins</p>
      </div>

      <div className="script-sections">

        <section className="script-section">
          <p className="script-speaker type-caps">Narrator</p>
          <div className="script-body type-body">
            <p>The bell has tolled. The candles remain dark. And Death was not pacified.</p>
            <p>You came here as rivals — eight Concords, eight creeds.</p>
            <p>But none of that matters now. As the undead, let us make merry, united at last.</p>
          </div>
        </section>

        <section className="script-section">
          <p className="script-speaker type-caps">Death</p>
          <div className="script-body type-body">
            <p>May you find in death what you sought in life. Drink.</p>
          </div>
        </section>

      </div>
    </main>
  );
}
