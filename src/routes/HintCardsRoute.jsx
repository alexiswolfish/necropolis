import React, { useRef, useState } from "react";
import html2canvas from "html2canvas";
import { jsPDF } from "jspdf";


/* Eerie question mark — pale, looming, unsettling */
function HintQuestionIcon({ className }) {
  return (
    <svg
      className={className}
      viewBox="0 0 100 100"
      xmlns="http://www.w3.org/2000/svg"
      aria-hidden
    >
      <text
        x="50"
        y="62"
        textAnchor="middle"
        fill="#1e0e3f"
        fontSize="72"
        fontFamily="Spinosa BTW01 Regular, Times New Roman, serif"
        fontWeight="normal"
      >
        ?
      </text>
    </svg>
  );
}

export const HINT_CARDS = [
  {
    id: "hint-death-forgets",
    print: 2,
    header: "Death Forgets His Lines",

    lore: "Death squints at the ledger, curses, and says, \"Just show me.\"",
    therefore: "Therefore: at The Gate of Names That Should Not Be, teams need to act out the death physically in silhouette, not explain it verbally.",
  },
  {
    id: "hint-body-keeps-secret",
    print: 2,
    header: "The Body Keeps the Secret",

    lore: "A Minion mutters, \"The pose mattered more.\"",
    therefore: "Therefore: for The Gate of Names That Should Not Be, the important part is clear body positions, poses, and shapes.",
  },
  {
    id: "hint-verdict-witnesses",
    print: 2,
    header: "A Verdict Requires Witnesses",

    lore: "The court hisses, \"Truth without agreement is useless.\"",
    therefore: "Therefore: at The Tribunal of Shattered Oaths, it is not enough for one person to know the scent. The group present needs to agree on the answer together.",
  },
  {
    id: "hint-too-many-mourners",
    print: 2,
    header: "Too Many Mourners Spoil the Judgment",

    lore: "A Minion snaps, \"Then come back with fewer opinions.\"",
    therefore: "Therefore: at The Tribunal of Shattered Oaths, only the people present at the shrine need consensus. If the whole group cannot agree, come back with fewer players.",
  },
  {
    id: "hint-fine-print",
    print: 2,
    header: "The Fine Print Bites",

    lore: "The keeper says, \"I asked for the letter, not the spirit.\"",
    therefore: "Therefore: at The Garden of Conditional Rites, contracts should be read literally and exactly as written.",
  },
  {
    id: "hint-no-more-no-less",
    print: 2,
    header: "No More, No Less",

    lore: "The contract is stamped: UNNECESSARY.",
    therefore: "Therefore: at The Garden of Conditional Rites, do not overcomplicate the contracts. If the stated requirement is met exactly, it counts.",
  },
  {
    id: "hint-no-one-stumbles",
    print: 2,
    header: "No One Stumbles Gracefully at the End",

    lore: "Death trips. A Minion sighs, \"Preparation matters.\"",
    therefore: "Therefore: The Hall of Final Passage rewards teams that are prepared and have done prior shrine work.",
  },
  {
    id: "hint-well-equipped",
    print: 4,
    header: "The Well-Equipped Die Better",

    lore: "A Minion sees your relics and quietly removes obstacles.",
    therefore: "Therefore: relics from the other shrines make The Hall of Final Passage much easier.",
  },
  {
    id: "hint-incomplete-ending",
    print: 4,
    header: "An Incomplete Ending",

    lore: "A ledger page reads: \"Finish the death properly.\"",
    therefore: "Therefore: to get the relic at The Gate of Names That Should Not Be, teams need to do more than just the basic silhouette prompt. They need to complete the scene in the special hidden way.",
  },
  {
    id: "hint-candles-departed",
    print: 4,
    header: "Candles for the Departed",

    lore: "Death hisses, \"I leave important things in plain sight.\"",
    therefore: "Therefore: for the relic at The Gate of Names That Should Not Be, players should use the candles available as part of the acted-out death scene.",
  },
  {
    id: "hint-article-thirty-four",
    print: 4,
    header: "Article Thirty-Four",

    lore: "A hidden vial rolls out: 34.",
    therefore: "Therefore: to get the relic at The Tribunal of Shattered Oaths, teams should ask for Scent 34.",
  },
  {
    id: "hint-name-before-court",
    print: 4,
    header: "Name It Before the Court",

    lore: "A Minion says, \"If you asked for it, name it.\"",
    therefore: "Therefore: at The Tribunal of Shattered Oaths, after requesting Scent 34, the team must identify it aloud.",
  },
  {
    id: "hint-shard-well-spent",
    print: 4,
    header: "A Shard Well-Spent",

    lore: "A margin note reads: \"One shard may fulfill more.\"",
    therefore: "Therefore: at The Garden of Conditional Rites, the right soul shard can count extra or satisfy more than one requirement.",
  },
  {
    id: "hint-provenance",
    print: 4,
    header: "Provenance Is Everything",

    lore: "The scribe shrugs. \"Yes. Provenance matters.\"",
    therefore: "Therefore: at The Garden of Conditional Rites, if a contract specifies both a team and a class, then a shard from someone matching both is especially valuable.",
  },
  {
    id: "hint-full-set-sorrows",
    print: 4,
    header: "A Full Set of Sorrows",

    lore: "Death scowls. \"Oh. You brought all of them.\"",
    therefore: "Therefore: if a team has all relics, The Hall of Final Passage becomes extremely easy.",
  },
  {
    id: "hint-come-back-fears",
    print: 4,
    header: "Come Back When Death Fears You",

    lore: "A Minion calls after you: \"Try again prepared.\"",
    therefore: "Therefore: if The Hall of Final Passage feels impossible, the team probably needs to collect more relics first.",
  },
  {
    id: "hint-missing-nose",
    print: 4,
    header: "Missing Under Death's Nose",

    lore: "A Minion whispers, \"Things keep vanishing near him.\"",
    therefore: "Therefore: the Ferryman is not far away. He is hidden somewhere within the structure of Necropolis or tournament play.",
  },
  {
    id: "hint-truth-lens",
    print: 4,
    header: "Truth Needs the Proper Lens",

    lore: "A dropped note mentions the Lens of Truth.",
    therefore: "Therefore: the Ferryman's clues are hidden and require the Lens of Truth.",
  },
  {
    id: "hint-earn-right-see",
    print: 4,
    header: "Earn the Right to See",

    lore: "Death snaps, \"Relics first. Passage after.\"",
    therefore: "Therefore: to get the Lens of Truth, teams must gather all relics and finish The Hall of Final Passage.",
  },
  {
    id: "hint-certificates-refuse",
    print: 4,
    header: "What the Certificates Refuse to Say",

    lore: "Candlelight reveals writing, then it vanishes.",
    therefore: "Therefore: the certificates of completion have deeper meaning that can be revealed with the Lens of Truth.",
  },
  {
    id: "hint-victory-not-understanding",
    print: 4,
    header: "Victory Is Not the Same as Understanding",

    lore: "A former champion says, \"Winning is not the point.\"",
    therefore: "Therefore: some clues are about the larger story, not just beating a shrine. Players should pay attention to the underlying mystery.",
  },
  {
    id: "hint-not-hollowed-out",
    print: 4,
    header: "Do Not Come Hollowed-Out",

    lore: "A Minion grimaces: \"Not like that. Not half-empty.\"",
    therefore: "Therefore: before visiting the Ferryman, players should make sure they are not low on soul shards.",
  },
  {
    id: "hint-more-than-three",
    print: 4,
    header: "More Than Three for Passage",

    lore: "A soaked note reads: MORE THAN THREE.",
    therefore: "Therefore: when a team goes to meet the Ferryman, they should have more than 3 soul shards.",
  },
  {
    id: "hint-paper-starts-talking",
    print: 4,
    header: "When the Paper Starts Talking",

    lore: "A margin note reads: \"Follow what the paper reveals.\"",
    therefore: "Therefore: if the certificates start revealing hidden content, the team is on the correct path toward the Ferryman.",
  },
  {
    id: "hint-bruises-unprepared",
    print: 4,
    header: "Bruises Are for the Unprepared",

    lore: "A Minion shrugs. \"Could have been worse.\"",
    therefore: "Therefore: some shrine penalties can be reduced or softened if players prepare beforehand.",
  },
  {
    id: "hint-not-merely-trophy",
    print: 4,
    header: "Not Merely a Trophy",

    lore: "Death returns the relic himself. \"Don't lose this.\"",
    therefore: "Therefore: relics are important later. Teams should keep track of them carefully.",
  },
  {
    id: "hint-won-here-used-elsewhere",
    print: 4,
    header: "Won Here, Used Elsewhere",

    lore: "A keeper mutters, \"Its use is rarely here.\"",
    therefore: "Therefore: some rewards are more useful later or at another shrine than where they were earned.",
  },
  {
    id: "hint-two-games",
    print: 4,
    header: "Two Games Are Being Played",

    lore: "One player celebrates. Another looks terrified.",
    therefore: "Therefore: there are really two tracks in the game: winning the tournament, and uncovering the truth of Necropolis.",
  },
  {
    id: "hint-blank",
    print: 8,
    header: "",

    lore: "",
    therefore: "",
  },
];

function HintCard({ card }) {
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
    <div className="hint-card-wrap">
      <div className="hint-card" ref={cardRef} data-card-id={card.id}>
        <div className="hint-card-border" />
        <div className="hint-card-inner">
          <p className="hint-card-you-are-given type-caps">HINT</p>
          <div className="hint-card-icon-wrap">
            <HintQuestionIcon className="hint-card-icon" />
          </div>
          {card.header && <h2 className="hint-card-header">{card.header}</h2>}
          {card.lore && <p className="hint-card-lore type-body-large">{card.lore}</p>}
          {card.therefore && <p className="hint-card-therefore type-body-large">{card.therefore}</p>}
        </div>
      </div>
      <button className="hint-card-dl-btn" onClick={downloadPng}>
        Download PNG
      </button>
      <p className="hint-card-print-count">{card.print ?? 1} in PDF</p>
    </div>
  );
}

export function HintCardsRoute() {
  const gridRef = useRef(null);
  const [pdfGenerating, setPdfGenerating] = useState(false);

  const downloadPdf = async () => {
    const grid = gridRef.current;
    if (!grid) return;
    setPdfGenerating(true);
    try {
      const MARGIN = 18;
      const PAGE_W = 612;
      const PAGE_H = 792;
      const SLOT_W = (PAGE_W - MARGIN * 2) / 2;
      const SLOT_H = (PAGE_H - MARGIN * 2) / 2;
      const CARDS_PER_PAGE = 4;

      const toPrint = HINT_CARDS.flatMap((card) =>
        Array.from({ length: card.print ?? 1 }, () => card.id)
      );

      const pdf = new jsPDF({ unit: "pt", format: "letter" });

      for (let i = 0; i < toPrint.length; i++) {
        if (i > 0 && i % CARDS_PER_PAGE === 0) {
          pdf.addPage();
        }
        const col = i % 2;
        const row = Math.floor((i % CARDS_PER_PAGE) / 2);
        const x = MARGIN + col * SLOT_W;
        const y = MARGIN + row * SLOT_H;

        const cardEl = grid.querySelector(`.hint-card[data-card-id="${toPrint[i]}"]`);
        if (!cardEl) continue;

        const canvas = await html2canvas(cardEl, {
          scale: 2,
          useCORS: true,
          allowTaint: false,
          logging: false,
          backgroundColor: "#ffffff",
        });

        const imgData = canvas.toDataURL("image/png");
        const imgW = canvas.width;
        const imgH = canvas.height;
        const slotRatio = SLOT_W / SLOT_H;
        const imgRatio = imgW / imgH;
        let drawW = SLOT_W;
        let drawH = SLOT_H;
        let drawX = x;
        let drawY = y;
        if (imgRatio > slotRatio) {
          drawH = SLOT_W / imgRatio;
          drawY = y + (SLOT_H - drawH) / 2;
        } else {
          drawW = SLOT_H * imgRatio;
          drawX = x + (SLOT_W - drawW) / 2;
        }
        pdf.addImage(imgData, "PNG", drawX, drawY, drawW, drawH);
      }

      pdf.save("hint-cards.pdf");
    } catch (err) {
      console.error("Failed to generate PDF:", err);
    } finally {
      setPdfGenerating(false);
    }
  };

  return (
    <main className="hint-cards-layout">
      <div className="hint-cards-header">
        <h1 className="hint-cards-page-title type-caps">Hint Cards</h1>
        <button
          className="hint-cards-pdf-btn"
          onClick={downloadPdf}
          disabled={pdfGenerating}
        >
          {pdfGenerating ? "Generating…" : "Download PDF (4 per page)"}
        </button>
      </div>
      <div className="hint-cards-grid" ref={gridRef}>
        {HINT_CARDS.map((card) => (
          <HintCard key={card.id} card={card} />
        ))}
      </div>
    </main>
  );
}
