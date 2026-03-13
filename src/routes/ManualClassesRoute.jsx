import React, { useEffect } from "react";

const COMBAT_RULES_URL = "https://alexiswolfish.github.io/necropolis/manual/combat";
const COMBAT_LINK_CLASS_IDS = new Set(["reliquarian", "ossuary-monk"]);

export const CLASSES_DATA = [
  {
    id: "mortuary-medium",
    label: "Bard",
    primaryStat: "Pulchritude",
    perkLabel: "Silver Tongue",
    perk: "Start the game with 3 cards of CHARM. By sacrificing one of your charms, you may avoid a trial of COMBAT or receiving a CURSE. When you use a charm, give it to the relevant party (your would-be opponent or the person giving the curse) to rip in half.",
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
    perkLabel: "Headshot",
    perk: "You will receive 2 of these HEADSHOTS at the start of the event. It cannot be defended against. Use it in battle: show it to your opponent, then give them the card to rip in half — they lose instantly.",
    shortLore: "Who needs brains when you have BRAWN. Fighters love fixing problems in the most efficient way possible. Hit it until it stops. Works every time.",
    lore: [
      "In the great sagas, the heroes of brute BRAWN are rarely remembered for their speeches. They are remembered for what happened after the speeches, when things needed hitting.",
      "Fighters are the load-bearing walls of any adventuring party: uncomplicated, reliable, and capable of absorbing a truly unreasonable amount of punishment before anyone needs to worry. They fix problems efficiently — locate problem, hack and slash, repeat until problem stops.",
    ],
  },
  {
    id: "reliquarian",
    label: "Ranger",
    primaryStat: "Vigilance",
    perkLabel: "Combat Advantage",
    perk: "You can pick a card from the other player and flip it. You will receive VIGILANCE with unlimited uses at the start of the game. Once per battle before you draw show your opponent your VIGILANCE card then flip one of your own cards first, then randomly flip an opponent's.",
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
    perkLabel: "Endurance",
    perk: "You may survive a hit. You will receive a DODGE card that can be used 5 times at the start of the event. Use in battle when defending to dodge a loss. When you use one, give the card to your opponent and have them mark off one of the uses. After your 5th use the opponent destroys the card.",
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
    perk: "Start the game with 3 Curse cards. They are yours to give away to whomever you like.",
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
    perk: "Start the game with a single BLESSING. This blessing can be used unlimited times. Use it to avoid engaging in a battle — if someone challenges you to a duel, show this blessing and don't battle.",
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
  useEffect(() => {
    const hash = window.location.hash.slice(1);
    if (hash) {
      document.getElementById(hash)?.scrollIntoView();
    }
  }, []);

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
          <section key={cls.id} id={cls.label.toLowerCase()} className="classes-entry">
            {cls.primaryStat && (
              <p className="type-caps classes-entry-stat"><span className="classes-entry-stat-label">Primary Stat:</span> <span className="classes-entry-stat-value">{cls.primaryStat}</span></p>
            )}
            <h2 className="classes-entry-title">{cls.label}</h2>
            {cls.lore.map((paragraph, i) => (
              <p key={i} className="type-body classes-entry-body">{paragraph}</p>
            ))}
            {cls.perk && (
              <p className="type-body classes-entry-perk">
                <span className="type-caps classes-entry-perk-label">Perk{cls.perkLabel ? `: ${cls.perkLabel}` : ""} </span>
                {cls.perk}
                {COMBAT_LINK_CLASS_IDS.has(cls.id) ? (
                  <>
                    {" "}
                    <a href={COMBAT_RULES_URL} className="classes-entry-perk-link">Freshen up on Combat</a>
                  </>
                ) : null}
              </p>
            )}
          </section>
        ))}
      </div>
    </main>
  );
}
