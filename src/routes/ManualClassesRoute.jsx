import React from "react";

export const CLASSES_DATA = [
  {
    id: "mortuary-medium",
    label: "Bard",
    primaryStat: "Pulchritude",
    perkLabel: "Silver Tongue",
    perk: "Start the game with 3 instances of NATURAL CHARM. Sacrifice one to avoid combat or a curse.",
    shortLore: "Their beauty, their grace, BARDS might as well be Miss United States. Oozing with the kind of natural charisma that tends to lend a real shine to even the most incompetent, BARDS are jacks of all trades and top notch entertainers. A sparkling cocktail of interesting facts and impressive but not particularly high utility skills.",
    lore: [
      "The Bards of the ancient world were not merely entertainers — they were keepers of legend, speakers of truth, and profoundly excellent at parties. Their beauty, their grace: they might as well be Miss United States.",
      "Oozing with the kind of natural PULCHRITUDE that tends to lend a real shine to even the most incompetent of endeavours, BARDS are jacks of all trades and top notch entertainers. A sparkling cocktail of interesting facts and impressive but not particularly high utility skills, deployed constantly and with considerable effect.",
    ],
  },
  {
    id: "lantern-warden",
    label: "Fighter",
    primaryStat: "Brawn",
    perkLabel: "One Hit KO",
    perk: "Your intimidating muscles really make opponents want to back down. Twice during the game, choose to use your impressive BRAWN to instantly win a combat encounter.",
    shortLore: "Who needs brains when you have BRAWN. Fighters love fixing problems in the most efficient way possible. Bashing it over the head until it is no longer a problem.",
    lore: [
      "In the great sagas, the heroes of brute BRAWN are rarely remembered for their speeches. They are remembered for what happened after the speeches, when things needed hitting.",
      "Fighters are the load-bearing walls of any adventuring party: uncomplicated, reliable, and capable of absorbing a truly unreasonable amount of punishment before anyone needs to worry. They fix problems efficiently — locate problem, apply large blunt object, repeat until problem stops.",
    ],
  },
  {
    id: "reliquarian",
    label: "Ranger",
    primaryStat: "Vigilance",
    perkLabel: "Ambush",
    perk: "Gain initiative in every battle. For the first round of combat, after choosing your card and showing your opponent, you may flip one of their cards and take it out of play.",
    shortLore: "Rugged, hot, RANGERS can taste dirt on the rain and lead you safely through dark forests. Their VIGILANCE lets them get the jump on opponents in any battle.",
    lore: [
      "The RANGERS of legend were the guardians of wild places, moving through dark forests and bitter mountains with the quiet certainty of those who have slept in significantly worse conditions and are fine about it.",
      "They can taste weather on the wind, track a boot through frozen mud, and will notice the thing that is wrong before you have finished explaining that nothing is wrong. Their VIGILANCE is the product of a great many near-misses, all of which they will downplay considerably.",
    ],
  },
  {
    id: "ossuary-monk",
    label: "Druid",
    primaryStat: "Grit",
    perkLabel: "Diehard",
    perk: "Your immeasurable GRIT allows you to shrug off 3 lost combat encounters during the party. Retain your soul until these are worn away.",
    shortLore: "Deeply attuned to physical planes, flowers bloom where a druid steps. Their extreme GRIT allows them to endure far past what those more feeble in mind and body could stand.",
    lore: [
      "Deeply attuned to the living world in ways that make for excellent company and occasionally alarming conversation, the Druids of old were known for outlasting everything: winters, sieges, philosophical arguments, and several civilizations that seemed quite confident at the time.",
      "Flowers bloom where they step. So do, occasionally, rather aggressive fungi. Their GRIT is the kind that does not require announcing — they are fine, they are always fine, and they would appreciate it if you stopped asking.",
    ],
  },
  {
    id: "tomb-runner",
    label: "Rogue",
    primaryStat: "Shenanigans",
    perkLabel: "Sneak Attack",
    perk: "Start the game with 3 curse cards to give to any player of your choice. All completely above board, naturally.",
    shortLore: "Quick on their feet, and constantly skulking in shadow at the periphery of your vision, the party's ROGUE is the perfect player to sow some chaos covertly amongst enemy ranks.",
    lore: [
      "The great thieves, spies, and professional skulkers of every age shared one common trait: they were never quite where you were looking.",
      "The ROGUE moves through the world with the quiet efficiency of someone who mapped every exit before they sat down, knows three things about you that you have not said aloud, and considers chaos a legitimate tactical option. Their SHENANIGANS are not random — they are precisely targeted, beautifully timed, and extremely difficult to explain to the authorities afterward.",
    ],
  },
  {
    id: "sepulchral-mage",
    label: "Wizard",
    primaryStat: "Mystery",
    perkLabel: "Sanctuary",
    perk: "Wizards cannot be challenged to combat, and thus cannot be compelled to give you a shard of their soul. It's very convenient for them. There are, however, rumours. And this is a party.",
    shortLore: "Wizards are masters of MYSTERY, and wield it quite effectively to avoid DEATH's nastier consequences. Extremely useful in a crisis. Slightly exhausting at dinner.",
    lore: [
      "In the oldest traditions, the great sorcerers did not choose MYSTERY — MYSTERY chose them, usually at considerable inconvenience to their social calendar. Wizards arrive with three specific questions that need answering and the patience of someone who came for the information, not the wine.",
      "They wield arcane forces with clinical precision, primarily to sidestep DEATH's more inconvenient appointments, which works more often than it should. Extremely useful in a crisis. Slightly exhausting at dinner.",
    ],
  },
  {
    id: "peasant",
    label: "Peasant",
    primaryStat: null,
    perkLabel: "Feeling Lucky",
    perk: "Upon failing a shrine challenge, if available, roll a lucky dice. On a 3, whatever terrible outcome was about to befall you is avoided, and maybe, you even just succeed.",
    shortLore: "No particular gifts. No ancient training. No destiny to speak of. The Peasant is here anyway, which, depending on how the night goes, may turn out to be the most remarkable thing about them.",
    lore: [
      "No particular gifts. No ancient training. No destiny to speak of.",
      "The Peasant is here anyway, which, depending on how the night goes, may turn out to be the most remarkable thing about them.",
    ],
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
      <h1 className="classes-page-heading">Player Classes</h1>
      <p className="type-body classes-page-subtitle">Heroes of the grand tournament are often specialized in particular skills. The most notable of which are listed below.</p>
      <div className="classes-entries">
        {CLASSES_DATA.map((cls) => (
          <section key={cls.id} className="classes-entry">
            {cls.primaryStat && (
              <p className="type-caps classes-entry-stat"><span className="classes-entry-stat-label">Primary Stat:</span> <span className="classes-entry-stat-value">{cls.primaryStat}</span></p>
            )}
            <h2 className="classes-entry-title">{cls.label}</h2>
            {cls.lore.map((paragraph, i) => (
              <p key={i} className="type-body classes-entry-body">{paragraph}</p>
            ))}
            {cls.perk && (
              <p className="type-body classes-entry-perk">
                <span className="type-caps classes-entry-perk-label">Perk{cls.perkLabel ? `: ${cls.perkLabel}` : ""}: </span>
                {cls.perk}
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
