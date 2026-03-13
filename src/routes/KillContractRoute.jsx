import React, { useRef } from "react";
import html2canvas from "html2canvas";

// Card shell — 396 × 612px CSS = 792 × 1224px export at html2canvas scale:2
// 792px / 144 DPI = 5.5"  |  1224px / 144 DPI = 8.5"  →  half of landscape letter

// Number of X marks per edge — adjust to taste
const H_COUNT = 17; // top and bottom
const V_COUNT = 25; // left and right
const XS_H = Array(H_COUNT).fill("x");
const XS_V = Array(V_COUNT).fill("x");

export const KILL_CONTRACTS = [
  {
    id: "kill-wizard",
    targetLabel: "ONE WIZARD",
    imageSrc: `${import.meta.env.BASE_URL}wizard.png`,
    reward: "one ancient relic of dubious worth to adorn your table.",
  },
];

function KillContractCard({ contract }) {
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
      link.download = `${contract.id}.png`;
      link.href = canvas.toDataURL("image/png");
      link.click();
    } catch (err) {
      console.error("Failed to export card:", err);
    }
  };

  return (
    <div className="kc-wrap">
      <div className="kc-card" ref={cardRef}>
        {/* Border: evenly-spaced Spinosa X marks on all four sides */}
        <div className="kc-border-top">
          {XS_H.map((x, i) => <span key={i}>{x}</span>)}
        </div>
        <div className="kc-border-bottom">
          {XS_H.map((x, i) => <span key={i}>{x}</span>)}
        </div>
        <div className="kc-border-left">
          {XS_V.map((x, i) => <span key={i}>{x}</span>)}
        </div>
        <div className="kc-border-right">
          {XS_V.map((x, i) => <span key={i}>{x}</span>)}
        </div>

        <div className="kc-inner">
          <h1 className="kc-kill">KILL</h1>
          <h2 className="kc-contract">CONTRACT</h2>
          <div className="kc-photo-wrap">
            <img src={contract.imageSrc} alt="" className="kc-photo" />
          </div>
          <p className="kc-target">{contract.targetLabel}</p>
          <p className="kc-reward type-body">
            <span className="kc-reward-label">Reward:</span>{" "}
            {contract.reward}
          </p>
        </div>
      </div>
      <button className="kc-dl-btn" onClick={downloadPng}>Download PNG</button>
    </div>
  );
}

export function KillContractRoute() {
  return (
    <main className="kc-layout">
      <h1 className="kc-page-title type-caps">Kill Contracts</h1>
      <div className="kc-grid">
        {KILL_CONTRACTS.map((contract) => (
          <KillContractCard key={contract.id} contract={contract} />
        ))}
      </div>
    </main>
  );
}
