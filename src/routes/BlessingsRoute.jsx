import React, { useRef } from "react";
import html2canvas from "html2canvas";

// Card shell — 300 × 525px CSS = 600 × 1050px export at html2canvas scale:2
// 600px / 300 DPI = 2"  |  1050px / 300 DPI = 3.5"  →  standard business card
// Matches curse card dimensions exactly for consistent printing.

const BLESS_BORDER_SRC = `${import.meta.env.BASE_URL}bless-border.png`;
const BLESS_ICON_SRC = `${import.meta.env.BASE_URL}bless-icon.svg`;

export const BLESSING_CARDS = [
  {
    id: "blessing-pacifism",
    header: "PACIFISM",
    body: [
      { text: "The next time you are challenged to combat, play this card and escape unscathed." },
      { br: true },
      { br: true },
      { text: "Discard afterwards." },
    ],
  },
  {
    id: "blessing-grace",
    header: "GRACE",
    body: [
      { text: "Once per event, when you would receive a " },
      { highlight: "CURSE" },
      { text: ", you may instead refuse it. The curse returns to the giver." },
    ],
  },
  {
    id: "blessing-favor",
    header: "FAVOR",
    body: [
      { text: "A member of your " },
      { highlight: "CONCORD" },
      { text: " may perform one BOON of service for you in your stead." },
    ],
  },
  {
    id: "blessing-radiance",
    header: "RADIANCE",
    body: [
      { text: "Your presence draws attention. Add " },
      { highlight: "+1" },
      { text: " to the outcome of your next Duel if an audience of at least three witnesses watches." },
    ],
  },
  {
    id: "blessing-sanctuary",
    header: "SANCTUARY",
    body: [
      { text: "You may grant one other player temporary refuge. They may not be challenged to combat while standing within arm's reach of you." },
    ],
  },
  {
    id: "blessing-ward",
    header: "WARD",
    body: [
      { text: "Once per event, when a denizen aligned to " },
      { highlight: "EARTH" },
      { text: " would kill you, you may hand them a cleansed Curse Card instead of a Soul Shard." },
    ],
  },
  {
    id: "blessing-beacon",
    header: "BEACON",
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
        backgroundColor: "#ffffff",
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
        {/* Content renders below the border overlay */}
        <div className="blessing-card-inner">
          <p className="blessing-card-you-are type-caps">YOU ARE</p>
          <h1 className="blessing-card-blessed">Blessed</h1>
          <div className="blessing-card-icon-wrap">
            <img src={BLESS_ICON_SRC} alt="" className="blessing-card-icon" />
          </div>
          <h2 className="blessing-card-header type-caps">{card.header}</h2>
          <p className="blessing-card-body type-body">
            {card.body.map((seg, i) =>
              "highlight" in seg
                ? <span key={i} className={`blessing-card-highlight${seg.highlight === "CURSE" ? " blessing-card-highlight--curse" : ""}`}>{seg.highlight}</span>
                : "br" in seg
                ? <br key={i} />
                : seg.text
            )}
          </p>
        </div>
        {/* Border image overlaid on top using multiply so white areas vanish */}
        <img src={BLESS_BORDER_SRC} alt="" className="blessing-card-border-img" />
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
