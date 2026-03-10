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
