import React from "react";

export function LoreRoute({ onHoverOmenStart, onHoverOmenEnd, deathImageSrc }) {
  return (
    <main className="hero-layout">
      <aside className="event-meta" />
      <article className="story-block">
        <p className="type-body-large story-paragraph"><span className="type-before before-mark">Before</span> the dead were put to rest, and before the end of Wonders or the withering of Mystery, there loomed in the dusk of all things, the city of Necropolis.</p>
        <p className="type-body-large story-paragraph">There, eight <span className="story-concord-word">Concords</span>, may they be both cursed and blessed, return to the sparring fields to compete in another cycle of the eternal tournament.</p>
        <p className="type-body-large story-paragraph">Victory promises eternal renewal, dominion, or release, each Concord tells the tale it prefers, but all agree on this: <strong>the Tournament must be held, and you must attend.</strong></p>
        <p className="type-body-large story-paragraph">Death has no hold on those bound by grim accord. Yet even here, beneath rite and rivalry, its shadow gathers and its patience thins.</p>
        <p className="type-body-large story-paragraph story-omen-paragraph">
          <span
            className="story-concord-word story-omen-word"
            onMouseEnter={onHoverOmenStart}
            onMouseLeave={onHoverOmenEnd}
          >
            but death must claim us all
          </span>
          .
        </p>
      </article>
      <div className="home-death-wrap" aria-hidden="true">
        <img src={deathImageSrc} alt="" className="home-death-bg" />
        <span className="home-death-overlay" />
      </div>
    </main>
  );
}
