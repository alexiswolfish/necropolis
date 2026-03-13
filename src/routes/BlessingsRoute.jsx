import React, { useRef } from "react";
import html2canvas from "html2canvas";

// Card shell — 300 × 525px CSS = 600 × 1050px export at html2canvas scale:2
// 600px / 300 DPI = 2"  |  1050px / 300 DPI = 3.5"  →  standard business card
// Matches curse card dimensions exactly for consistent printing.

const BLESS_BORDER_SRC = `${import.meta.env.BASE_URL}bless-border.png`;
const BLESS_ICON_SRC = `${import.meta.env.BASE_URL}bless-icon.svg`;

export const BLESSING_CARDS = [
  {
    id: "blessing-sanctified",
    header: "SANCTIFIED",
    body: [
      { text: "The next time you would be " },
      { highlight: "CURSED" },
      { text: ", discard this card and remain immune." },
      { br: true },
      { br: true },
      { text: "You may then give the curse to someone of your choice." },
    ],
  },
  {
    id: "blessing-second-wind",
    header: "SECOND WIND",
    body: [
      { text: "The next time you lose a round of BRUTAL combat, you may burn this blessing to begin the round again." },
    ],
  },
  {
    id: "blessing-feeling-lucky",
    header: "FEELING LUCKY",
    body: [
      { text: "The next time you FAIL a challenge, if available, roll a luck dice. On a 3, you succeed." },
    ],
  },
  {
    id: "blessing-foresight",
    header: "FORESIGHT",
    body: [
      { text: "Right before trying a SHRINE TRIAL, show the keeper this card. If you fail, you may not be cursed. Burn afterwards." },
    ],
  },
  {
    id: "blessing-geas",
    header: "GEAS",
    body: [
      { text: "When challenged to combat, you may choose another player to fight in your place." },
    ],
  },
  {
    id: "blessing-boon",
    header: "BOON",
    body: [
      { text: "Write the name of another player on the back of this card and give it to them. They owe you a favor before the night ends." },
    ],
  },
  {
    id: "blessing-righteous-scorn",
    header: "RIGHTEOUS SCORN",
    body: [
      { text: "Write the name of another player upon this card. If they are under a " },
      { highlight: "CURSE" },
      { text: ", they must give you one of their soul shards. Discard this blessing." },
    ],
  },
  {
    id: "blessing-revelry",
    header: "REVELRY",
    body: [
      { text: "Give out three drinks. Next time you must be re-incarnated, gain an extra soul shard." },
      { br: true },
      { br: true },
      { text: "Give this card to ALEX." },
    ],
  },
  {
    id: "blessing-cleansing",
    header: "CLEANSING",
    body: [
      { text: "Gather three players and perform a ritual bow together. All participants may end the suffering of a single " },
      { highlight: "CURSE" },
      { text: "." },
    ],
  },
  {
    id: "blessing-procession",
    header: "PROCESSION",
    body: [
      { text: "Choose two players. They must follow you in a line until you attempt the next shrine trial." },
    ],
  },
  {
    id: "blessing-exorcism",
    header: "EXORCISM",
    body: [
      { text: "Have another player kneel before you. You may remove one of their " },
      { highlight: "CURSES" },
      { text: "." },
    ],
  },
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
                ? <span key={i} className={`blessing-card-highlight${seg.highlight.startsWith("CURSE") ? " blessing-card-highlight--curse" : ""}`}>{seg.highlight}</span>
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
