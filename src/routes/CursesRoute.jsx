import React, { useRef } from "react";
import html2canvas from "html2canvas";

const EYEBALL_SRC = `${import.meta.env.BASE_URL}eyeball.png`;

const BORDER_H = ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,";
const BORDER_V = ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,";

export const CURSE_CARDS = [
  {
    id: "curse-bard",
    header: "PHANTOM THORNS",
    body: [
      { text: "You are beset with painful thorns. Walk with an exaggerated limp until you can find a " },
      { spinosa: "BARD" },
      { text: " willing to tap you thrice upon both shoulders with fauna of their choice." },
    ],
  },
  {
    id: "curse-silence-die",
    header: "TO DIE",
    body: [
      { text: "Give all your soul shards to whomever handed you this curse." },
      { br: true },
      { br: true },
      { text: "Return to the AFTERLIFE and see ALEX for more." },
    ],
  },
  {
    id: "curse-silence",
    header: "Silence",
    body: [
      { text: "You may not speak above a whisper until you manage to kill someone with at least 3 points in " },
      { spinosa: "PULCHRITUDE" },
      { text: "." },
    ],
  },
  {
    id: "curse-touch-grass",
    header: "TO TOUCH GRASS",
    body: [
      { text: "Go get a drink, sit on the grass. Feel yourself be pulled into the EARTH. Will you ever want to get up again?" },
    ],
  },
  {
    id: "curse-hunger-grapes",
    header: "To HUNGER for grapes",
    body: [
      { text: "You are possessed with an irrational craving for grapes. Cease all activities until you find someone at the event to feed you one." },
    ],
  },
  {
    id: "curse-perform",
    header: "To perform",
    body: [
      { text: "Find a " },
      { spinosa: "BARD" },
      { text: " to hum or sling a beat for you while you do a short 20 second jig for whomever handed you this card." },
    ],
  },
  {
    id: "curse-service",
    header: "TO SERVICE",
    body: [
      { text: "Kneel to the first player you lay eyes on after receiving this card. You owe them one BOON of service of their choice. (e.g. one command)" },
    ],
  },
  {
    id: "curse-tithe-thirst",
    header: "TO TITHE",
    body: [
      { text: "Fetch a DRINK for the next person you find who THIRSTS." },
    ],
  },
  {
    id: "curse-tithe-hunger",
    header: "TO TITHE",
    body: [
      { text: "Fetch a plate of cheese and crackers for the next person you encounter who HUNGERS." },
    ],
  },
  {
    id: "curse-conquest",
    header: "TO CONQUEST",
    body: [
      { text: "Find someone with at least five points in " },
      { spinosa: "BRAWN" },
      { text: " and challenge them to a FEAT OF STRENGTH (arm wrestling, pushups, your choice.)" },
    ],
  },
  {
    id: "curse-air",
    header: "IMMUNE TO AIR",
    body: [
      { text: "Next time you are killed by any denizen aligned to " },
      { spinosa: "AIR" },
      { text: " you may hand them one of your cleansed Curse Cards instead of a Soul Shard. You must hand this card over as well." },
    ],
  },
  {
    id: "curse-earth",
    header: "IMMUNE TO EARTH",
    body: [
      { text: "Next time you are killed by any denizen aligned to " },
      { spinosa: "EARTH" },
      { text: " you may hand them one of your cleansed Curse Cards instead of a Soul Shard." },
    ],
  },
  {
    id: "curse-fire",
    header: "IMMUNE TO FIRE",
    body: [
      { text: "Next time you are killed by any denizen aligned to " },
      { spinosa: "FIRE" },
      { text: " you may hand them one of your cleansed Curse Cards instead of a Soul Shard." },
    ],
  },
  {
    id: "curse-rogue",
    header: "BORROWED GRIT",
    body: [
      { text: "Your courage has been temporarily loaned to a stranger. Speak only in questions until a " },
      { spinosa: "ROGUE" },
      { text: " gives you something heavy to carry to the next srhine." },
    ],
  },
  {
    id: "curse-fighter",
    header: "IRON VANITY",
    body: [
      { text: "Your pride has turned to stone. Compliment every person before you may address them, until a " },
      { spinosa: "FIGHTER" },
      { text: " delivers you a genuine insult." },
    ],
  },
  {
    id: "curse-wizard",
    header: "MOON'S FOLLY",
    body: [
      { text: "Announce every scheme aloud before you attempt it, until a " },
      { spinosa: "WIZARD" },
      { text: " joins in without being asked." },
    ],
  },
  {
    id: "curse-druid",
    header: "SENTINEL SLEEP",
    body: [
      { text: "Your vigilance has turned inward. You are the last to notice everything. Find a " },
      { spinosa: "DRUID" },
      { text: " to confirm you are still present, and help you touch the grass." },
    ],
  },
  {
    id: "curse-monk",
    header: "HOLLOW VOW",
    body: [
      { text: "Every promise you make echoes back twice as loud. Speak only when spoken to, until a " },
      { spinosa: "MONK" },
      { text: " grants you permission to begin again." },
    ],
  },
];

function CurseCard({ card }) {
  const cardRef = useRef(null);

  const downloadPng = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#111314",
      });
      const link = document.createElement("a");
      link.download = `curse-card-${card.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to export card:", err);
    }
  };

  return (
    <div className="curse-card-wrap">
      <div className="curse-card" ref={cardRef}>
        <div className="curse-card-border-top">{BORDER_H}</div>
        <div className="curse-card-border-bottom">{BORDER_H}</div>
        <div className="curse-card-border-left"><span>{BORDER_V}</span></div>
        <div className="curse-card-border-right"><span>{BORDER_V}</span></div>
        <div className="curse-card-inner">
          <p className="curse-card-you-are type-caps">YOU ARE</p>
          <h1 className="curse-card-cursed">CURSED</h1>
          <div className="curse-card-eye-wrap">
            <img src={EYEBALL_SRC} alt="" className="curse-card-eye" />
          </div>
          <h2 className="curse-card-header">{card.header}</h2>
          <p className="curse-card-body type-body">
            {card.body.map((seg, i) =>
              "spinosa" in seg
                ? <span key={i} className="curse-card-spinosa-word">{seg.spinosa}</span>
                : "br" in seg
                ? <br key={i} />
                : seg.text
            )}
          </p>
          <p className="curse-card-xx">xx</p>
        </div>
      </div>
      <button className="curse-card-dl-btn" onClick={downloadPng}>
        Download PNG
      </button>
    </div>
  );
}

export function CursesRoute() {
  return (
    <main className="curses-layout">
      <h1 className="curses-page-title type-caps">Curse Cards</h1>
      <div className="curses-grid">
        {CURSE_CARDS.map((card) => (
          <CurseCard key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
}
