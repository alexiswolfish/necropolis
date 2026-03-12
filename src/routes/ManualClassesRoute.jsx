import React from "react";

const CLASSES_DATA = [
  {
    id: "mortuary-medium",
    label: "Bard",
    primaryStat: "Pulchritude",
    lore: "Bards are the ones who already know your name. They arrived an hour ago, have met everyone present, and are somehow already at the center of whatever interesting thing is happening. Charming by profession and by temperament, they use this the way other classes use weapons: constantly, and with considerable effect.",
  },
  {
    id: "lantern-warden",
    label: "Fighter",
    primaryStat: "Brawn",
    lore: "Fighters enjoy efficiency. Hitting your problems over the head with the nearest blunt object until they are no longer problems is a perfectly sound strategy, and one Fighters have refined to an art. Jacks of all trades, with the gleaming cut figures to match.",
  },
  {
    id: "reliquarian",
    label: "Cleric",
    primaryStat: "Vigilance",
    lore: "Clerics are devoted to a higher power. Which one is largely beside the point. What matters is the quality of the faith — a god with one true believer is still a god, and the Cleric believes absolutely. They can, and occasionally do, summon something from the ether to prove it. This tends to end the argument.",
  },
  {
    id: "ossuary-monk",
    label: "Druid",
    primaryStat: "Grit",
    lore: "Druids are the ones still going after everyone else has stopped. Endurance is their primary skill and their dominant personality trait. They have been cold, lost, and considerably worse, and they are fine. Always fine. Slightly baffled by people who aren't.",
  },
  {
    id: "tomb-runner",
    label: "Rogue",
    primaryStat: "Shenanigans",
    lore: "Rogues know where everything is: the exits, the valuables, who owes whom a favor, and which guard is having a bad night. Light on their feet and lighter on explanations, they are genuinely excellent company if you can keep track of them. Which you probably cannot.",
  },
  {
    id: "sepulchral-mage",
    label: "Wizard",
    primaryStat: "Mystery",
    lore: "Wizards have done the reading. All of it. They arrive with three specific questions they need answered and the social patience of someone who came for the information, not the wine. Extremely useful in a crisis. Slightly exhausting at dinner.",
  },
  {
    id: "peasant",
    label: "Peasant",
    primaryStat: null,
    lore: "No particular gifts. No ancient training. No destiny to speak of. The Peasant is here anyway, which, depending on how the night goes, may turn out to be the most remarkable thing about them.",
  },
];

export function ManualClassesRoute({ getPathFromRoute, onNavigate }) {
  return (
    <main id="classes-page" className="classes-layout">
      <a
        href={getPathFromRoute({ page: "manual" })}
        onClick={onNavigate({ page: "manual" })}
        className="type-caps page-back-link"
      >
        <span className="type-logo page-back-arrow">‹</span>Handbook
      </a>
      <p className="type-logo header-accent">Player Classes</p>
      <div className="classes-entries">
        {CLASSES_DATA.map((cls) => (
          <section key={cls.id} className="classes-entry">
            {cls.primaryStat && (
              <p className="type-caps classes-entry-stat">{cls.primaryStat}</p>
            )}
            <h2 className="classes-entry-title">{cls.label}</h2>
            <p className="type-body classes-entry-body">{cls.lore}</p>
          </section>
        ))}
      </div>
    </main>
  );
}
