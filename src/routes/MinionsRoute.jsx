import React from "react";

export function MinionsRoute() {
  return (
    <main className="minions-layout">
      <h1 className="minions-page-title type-caps">Minions of Death</h1>
      <p className="type-body minions-intro">
        You are a Minion of Death. Your job is to keep the game moving, answer questions, and help the event run smoothly. Think of yourself as a roaming referee.
      </p>

      <section className="minions-content">
        <div className="minions-block">
          <h2 className="type-caps minions-section-label">Your main responsibilities</h2>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Escort players to the Death Bar</h3>
          <p className="type-body">
            As you move around the event, ask to see players' soul shards.
          </p>
          <ul className="type-body minions-list">
            <li>If they have 3 or more, they stay where they are.</li>
            <li>If they have 2, they roll 1 die and must roll 3 or higher to avoid being taken.</li>
            <li>If they have 1, they roll 1 die and must roll 5 or higher to avoid being taken.</li>
            <li>If they have 0, they are automatically taken to the Death Bar.</li>
          </ul>
          <p className="type-body">
            Carry a die with you at all times.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Keep the space clean</h3>
          <p className="type-body">
            As you loop through the event, pick up food and drink remnants and throw them away. We do not have support staff for cleanup, so staying on top of trash throughout the night will help a lot.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Support duels</h3>
          <p className="type-body">
            Be familiar with the battle rules and class interactions so you can step in if players need clarification during a duel.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Monitor shrine progress</h3>
          <p className="type-body">
            Check in with shrines on how many clues and relics they have given out. Let Jordan know if anything seems off.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Help unstuck players</h3>
          <p className="type-body">
            If players seem confused about the game, rules, or mechanics, help explain what they should be doing and move them forward without giving too much away.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Watch overall game flow</h3>
          <p className="type-body">
            Keep an eye on how teams are doing. We want most teams to finish the mystery. If a team seems badly stuck, let Jordan know.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Support the Ossuary schedule</h3>
          <p className="type-body">
            About every 20 minutes, teams will need to rotate through the Ossuary of Unspoken Grief. Help keep that moving, check in on the shrine, and see whether the shrine runners need drinks or anything else.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Prepare for Act 4</h3>
          <p className="type-body">
            During the second phase of the game, while Jordan and Alex are inside explaining Act 4 mechanics (around 7:00), go outside and make sure each shrine has at least 2 candles on it.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Watch for non-event guests</h3>
          <p className="type-body">
            This is a popular venue, especially on nice days, so pay attention for anyone who seems to have wandered in by mistake. If someone is not part of the event, let them know it is a private event and politely ask them to leave.
          </p>
        </div>

        <div className="minions-block">
          <h3 className="type-caps minions-subsection-label">Be available</h3>
          <p className="type-body">
            Answer questions, redirect players when needed, check in on people, and keep taking the pulse of the event. Stay in communication with Jordan throughout the night.
          </p>
        </div>
      </section>
    </main>
  );
}
