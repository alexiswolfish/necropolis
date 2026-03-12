import React from "react";

export function ManualPlayerGuideRoute({ getPathFromRoute, onNavigate }) {
  return (
    <main id="player-guide-page" className="player-guide-layout">
      <a
        href={getPathFromRoute({ page: "manual" })}
        onClick={onNavigate({ page: "manual" })}
        className="type-caps page-back-link"
      >
        <span className="type-logo page-back-arrow">‹</span>Handbook
      </a>
      <p className="type-logo header-accent">Game Guide</p>

      <section className="player-guide-content">
        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Welcome to Necropolis</h2>
          <p className="type-body">
            Welcome to Necropolis. You stand within a grand tournament held by Death. Eight Concords have been summoned to prove their worth before the Eternal Crown.
          </p>
          <p className="type-body">
            Move through the city with your Concord, face the shrines, gather clues, and claim relics. Your team's goal is to visit all five shrines:
          </p>
          <ul className="type-body player-guide-list">
            <li>The Gate of Names That Should Not Be</li>
            <li>The Tribunal of Shattered Oaths</li>
            <li>The Garden of Conditional Rites</li>
            <li>The Ossuary of Unspoken Grief</li>
            <li>The Hall of Final Passage</li>
          </ul>
          <p className="type-body">
            Collect all 4 certificates of completion. Collect all 4 relics. Follow the clues. Solve the mystery.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">How to Play</h2>
          <p className="type-body">
            Move through the venue with your Concord and visit the shrines to see what must be done. You do not need to stay with your Concord at all times, but most shrine challenges require group participation, so wandering off alone is usually a bad idea.
          </p>
          <p className="type-body">
            Progress in Necropolis comes from:
          </p>
          <ul className="type-body player-guide-list">
            <li>completing shrine challenges</li>
            <li>collecting clues</li>
            <li>earning relics</li>
            <li>dueling other players</li>
            <li>managing soul shards</li>
            <li>using your class abilities well</li>
            <li>paying attention to what shrine keepers, Minions of Death, and game materials tell you</li>
          </ul>
          <p className="type-body">
            Read what you receive. Listen carefully. Keep the game moving.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Shrines, Certificates, and Relics</h2>
          <p className="type-body">
            When your team completes a shrine, you will receive a certificate of completion. Certificates matter. Keep them safe.
          </p>
          <p className="type-body">
            Your Concord will also be collecting relics. Concords will have their own table indoors where teams can keep relics and other important game items. Play fair. Do not steal relics, certificates, or game materials from other teams.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">The Minions of Death</h2>
          <p className="type-body">
            The Minions of Death are Jordan, Ross, and Conor. They are referees, enforcers, and story guides. If a Minion of Death gives you an instruction, card, punishment, or task, follow it. Even if it is inconvenient, play along and keep the game moving.
          </p>
          <p className="type-body">
            If you are confused, stuck, or unsure how something works, ask a Minion of Death or Alex. These people will all be introduced before the event starts.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Soul Shards</h2>
          <p className="type-body">
            Soul shards are a core game resource. You may gain them, lose them, trade them (bad idea), or be forced to spend them. If you lose a duel, you must give 1 soul shard to your opponent.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">The Death Bar</h2>
          <p className="type-body">
            If you have fewer than 3 soul shards and a Minion of Death approaches you, they may send you to the Death Bar. At the Death Bar, Alex may offer you a grim bargain in exchange for 1 recovery soul shard.
          </p>
          <p className="type-body">
            If a Minion sends you to the Death Bar, go immediately. You may not refuse the bargain unless a Minion of Death tells you otherwise.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Dueling</h2>
          <p className="type-body">
            Dueling is a major part of Necropolis. Use it often. Duels are always 1 on 1.
          </p>
          <p className="type-body">
            To initiate a duel, face the person you want to challenge and say: <span className="player-guide-quote">"I challenge you!"</span> If you place a duel card in their face, they must duel you unless they are a Wizard.
          </p>
          <h3 className="type-caps player-guide-subsection-label">Where dueling is not allowed</h3>
          <p className="type-body">
            You may not duel:
          </p>
          <ul className="type-body player-guide-list">
            <li>inside the Hall (the real actual hall that has food)</li>
            <li>next to the bar</li>
            <li>while a Concord is actively engaged in a shrine</li>
          </ul>
          <p className="type-body">
            At all other times, dueling is fair game.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Combat Rules</h2>
          <p className="type-body">
            Each player has duel cards, and combat is resolved using the official combat rules. Read them here:{" "}
            <a
              href={getPathFromRoute({ page: "manual-combat" })}
              onClick={onNavigate({ page: "manual-combat" })}
              className="player-guide-link"
            >
              Combat Guidelines
            </a>
            .
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Class Rules</h2>
          <p className="type-body">
            Each class comes with its own talents, advantages, and bad habits. Know what your class can do before the game begins.{" "}
            <a
              href={getPathFromRoute({ page: "manual-classes" })}
              onClick={onNavigate({ page: "manual-classes" })}
              className="player-guide-link"
            >
              Player Classes
            </a>
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Curses</h2>
          <p className="type-body">
            If you are given a curse card:
          </p>
          <ul className="type-body player-guide-list">
            <li>wear it around your neck</li>
            <li>follow the curse</li>
            <li>do not hide it</li>
            <li>do not ignore it</li>
          </ul>
          <p className="type-body">
            Curses last for 15 minutes or until you do what the curse card says — whichever comes first. When given a curse take out your phone and set a 15 minute timer. You are expected to actually do your curse. It is more fun for everyone that way.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Important Rules</h2>
          <p className="type-body">
            Nothing is hidden. Do not dig through props, containers, shrine dressing, papers, or set pieces unless a shrine keeper or game instruction explicitly tells you to. Do not take props. They may be important for other Concords. Do not steal relics, certificates, soul shards, or official game materials from other teams unless a rule specifically allows it.
          </p>
          <p className="type-body">
            If a card contradicts this guide, the card wins. If a Minion of Death gives a ruling, the Minion wins.
          </p>
        </div>

        <div className="player-guide-block">
          <h2 className="type-caps player-guide-section-label">Final Notes</h2>
          <p className="type-body">
            Play boldly. Play dramatically. Play fair. Read the clues. Watch the shrines. Listen to what people say. Necropolis works best when everyone commits to the game and helps keep it moving.
          </p>
        </div>
      </section>
    </main>
  );
}
