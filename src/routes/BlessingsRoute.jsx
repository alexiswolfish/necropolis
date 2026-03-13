import React, { useRef } from "react";
import html2canvas from "html2canvas";

const BORDER_H = ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,";
const BORDER_V = ".,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,.,";

/* Inline SVG sun icon — golden rays, blessing theme. Public domain style. */
function BlessingSunIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <circle cx="50" cy="50" r="18" fill="#d4af37" stroke="#f5e6b3" strokeWidth="2" />
      {[...Array(12)].map((_, i) => {
        const a = (i * 30 * Math.PI) / 180;
        const x1 = 50 + 22 * Math.cos(a);
        const y1 = 50 + 22 * Math.sin(a);
        const x2 = 50 + 38 * Math.cos(a);
        const y2 = 50 + 38 * Math.sin(a);
        return (
          <line
            key={i}
            x1={x1}
            y1={y1}
            x2={x2}
            y2={y2}
            stroke="#d4af37"
            strokeWidth="2"
            strokeLinecap="round"
          />
        );
      })}
    </svg>
  );
}

export const BLESSING_CARDS = [
  {
    id: "blessing-grace",
    header: "GRACE",
    difficulty: "x",
    body: [
      { text: "Once per event, when you would receive a " },
      { spinosa: "CURSE" },
      { text: ", you may instead refuse it. The curse returns to the giver." },
    ],
  },
  {
    id: "blessing-favor",
    header: "FAVOR",
    difficulty: "x",
    body: [
      { text: "A member of your " },
      { spinosa: "CONCORD" },
      { text: " may perform one BOON of service for you in your stead." },
    ],
  },
  {
    id: "blessing-radiance",
    header: "RADIANCE",
    difficulty: "xx",
    body: [
      { text: "Your presence draws attention. Add " },
      { spinosa: "+1 " },
      { text: "to the outcome of your next Duel if an audience of at least three witnesses watches." },
    ],
  },
  {
    id: "blessing-sanctuary",
    header: "SANCTUARY",
    difficulty: "xx",
    body: [
      { text: "You may grant one other player temporary refuge. They may not be challenged to combat while standing within arm's reach of you." },
    ],
  },
  {
    id: "blessing-ward",
    header: "WARD",
    difficulty: "x",
    body: [
      { text: "Once per event, when a denizen aligned to " },
      { spinosa: "EARTH" },
      { text: " would kill you, you may hand them a cleansed Curse Card instead of a Soul Shard." },
    ],
  },
  {
    id: "blessing-beacon",
    header: "BEACON",
    difficulty: "xx",
    body: [
      { text: "You shine in the dark. The next player who asks you for directions must accompany you to a shrine of your choice." },
    ],
  },
];

function BlessingCard({ card }) {
  const cardRef = useRef(null);

  const downloadPng = async () => {
    if (!cardRef.current) return;
    try {
      const canvas = await html2canvas(cardRef.current, {
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        backgroundColor: "#1a1a1c",
      });
      const link = document.createElement("a");
      link.download = `${card.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to export card:", err);
    }
  };

  return (
    <div className="blessing-card-wrap">
      <div className="blessing-card" ref={cardRef} data-card-id={card.id}>
        <div className="blessing-card-border-top">{BORDER_H}</div>
        <div className="blessing-card-border-bottom">{BORDER_H}</div>
        <div className="blessing-card-border-left"><span>{BORDER_V}</span></div>
        <div className="blessing-card-border-right"><span>{BORDER_V}</span></div>
        <div className="blessing-card-inner">
          <p className="blessing-card-you-are type-caps">YOU ARE</p>
          <h1 className="blessing-card-blessed">BLESSED</h1>
          <div className="blessing-card-icon-wrap">
            <BlessingSunIcon className="blessing-card-icon" />
          </div>
          <h2 className="blessing-card-header">{card.header}</h2>
          <p className="blessing-card-body type-body-large">
            {card.body.map((seg, i) =>
              "spinosa" in seg
                ? <span key={i} className="blessing-card-spinosa-word">{seg.spinosa}</span>
                : "br" in seg
                ? <br key={i} />
                : seg.text
            )}
          </p>
          <p className="blessing-card-xx">{card.difficulty}</p>
        </div>
      </div>
      <button className="blessing-card-dl-btn" onClick={downloadPng}>
        Download PNG
      </button>
    </div>
  );
}

export function BlessingsRoute() {
  return (
    <main className="blessings-layout">
      <h1 className="blessings-page-title type-caps">Blessing Cards</h1>
      <div className="blessings-grid">
        {BLESSING_CARDS.map((card) => (
          <BlessingCard key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
}
