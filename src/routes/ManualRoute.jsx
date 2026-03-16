import React from "react";

export function ManualRoute({ getPathFromRoute, onNavigate }) {
  return (
    <main className="manual-layout">
      <p className="type-caps manual-label">Handbook</p>
      <nav className="manual-entries" aria-label="Handbook sections">
        <div className="manual-entry">
          <a
            href={getPathFromRoute({ page: "manual-player-guide" })}
            onClick={onNavigate({ page: "manual-player-guide" })}
            className="manual-entry-title"
          >
            Player Guide
          </a>
          <p className="manual-entry-byline type-body">How to play Necropolis</p>
        </div>
        <div className="manual-entry">
          <a
            href={getPathFromRoute({ page: "manual-combat" })}
            onClick={onNavigate({ page: "manual-combat" })}
            className="manual-entry-title"
          >
            Combat Guidelines
          </a>
          <p className="manual-entry-byline type-body">Rules for ritual combat</p>
        </div>
        <div className="manual-entry">
          <a
            href={getPathFromRoute({ page: "manual-classes" })}
            onClick={onNavigate({ page: "manual-classes" })}
            className="manual-entry-title"
          >
            Player Classes
          </a>
          <p className="manual-entry-byline type-body">Perks and Persuasions</p>
        </div>
        <div className="manual-entry">
          <a
            href={getPathFromRoute({ page: "manual-ossuary" })}
            onClick={onNavigate({ page: "manual-ossuary" })}
            className="manual-entry-title"
          >
            Ossuary of Unspoken Grief
          </a>
          <p className="manual-entry-byline type-body">Entry times at The Japanese Tea House</p>
        </div>
        <div className="manual-entry">
          <a
            href={getPathFromRoute({ page: "artifacts" })}
            onClick={onNavigate({ page: "artifacts" })}
            className="manual-entry-title"
          >
            Artifacts
          </a>
          <p className="manual-entry-byline type-body">Cards, contracts, and crew resources</p>
        </div>
      </nav>
    </main>
  );
}
