import React from "react";

const ARTIFACTS = [
  { page: "curses", label: "Curses", byline: "Afflictions to bestow upon the living" },
  { page: "blessings", label: "Blessings", byline: "Dispensed by Simi at her shrine" },
  { page: "kill-contract", label: "Kill Contracts", byline: "Bounties on the heads of the deserving" },
  { page: "minions", label: "Death's Minions", byline: "For the crew walking amongst the dead" },
  { page: "hint-cards", label: "Hint Cards", byline: "For players who are well and truly lost" },
  { page: "run-of-show", label: "Run of Show", byline: "The full order of events for crew" },
];

export function ArtifactsRoute({ getPathFromRoute, onNavigate }) {
  return (
    <main className="manual-layout">
      <a
        href={getPathFromRoute({ page: "manual" })}
        onClick={onNavigate({ page: "manual" })}
        className="type-caps page-back-link"
      >
        <span className="type-logo page-back-arrow">‹</span>Handbook
      </a>
      <p className="type-caps manual-label">Artifacts</p>
      <nav className="manual-entries" aria-label="Artifact pages">
        {ARTIFACTS.map(({ page, label, byline }) => (
          <div key={page} className="manual-entry">
            <a
              href={getPathFromRoute({ page })}
              onClick={onNavigate({ page })}
              className="manual-entry-title"
            >
              {label}
            </a>
            <p className="manual-entry-byline type-body">{byline}</p>
          </div>
        ))}
      </nav>
    </main>
  );
}
