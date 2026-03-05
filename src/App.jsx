import React, { useEffect, useMemo, useRef, useState } from "react";

const CONCORDS = [
  {
    id: "pleasure-treasure",
    label: "Pleasure & Treasure",
    paletteId: 342,
    element: "Warded Earth",
    earthlyDesire: "Hedonism",
    lede: "The Concord of Pleasure & Treasure approaches life with admirable focus: if something is beautiful, comfortable, delicious, or made of gold, it is probably worth having.",
    bodyParagraphs: [
      "Members favor velvet, brocade, sashes, open collars, and enough jewelry to suggest they recently discovered a treasure chest and decided not to share the news. Coins, pearls, rings, and brightly colored fabrics are common. Texture is important. So is weight.",
      <>They value <strong>pleasure, possession, and excellent company</strong>. Good wine should be finished, fine food should be appreciated slowly, and gold should ideally be counted several times just to enjoy the sound.</>,
      "In contest they fight with the stubborn patience of earth itself. They advance slowly, refuse to be hurried, and prove extremely difficult to dislodge once they have decided they would like something, whether that something is a chair, a jewel, or victory.",
      "At a gathering they are usually found reclining somewhere comfortable, enjoying themselves immensely while quietly accumulating small valuables and allies.",
      "After all, pleasure is wonderful.",
      "But treasure lasts."
    ],
    preview: { start: "#0d2b0f", end: "#102f12", border: "#b89342", text: "#f0a925" }
  },
  {
    id: "desire-conspire",
    label: "Desire & Conspire",
    paletteId: 332,
    element: "Wandering Fire",
    earthlyDesire: "Ambition",
    lede: "Those sworn to Desire & Conspire sharpen longing into strategy.",
    body: "They do not wait for fate to move first. They braid rumor, leverage, and timing until outcomes bend. Where others see chaos, they see openings. Where others see loyalty, they see terms.",
    preview: { start: "#b32200", end: "#ad2000", border: "#f5dc74", text: "#f5dc74" }
  },
  {
    id: "mercy-malice",
    label: "Mercy & Malice",
    paletteId: 338,
    element: "Warded Air",
    earthlyDesire: "Control",
    lede: "Mercy & Malice keeps a soft hand and a prepared knife.",
    body: "They offer sanctuary only when sanctuary serves. Their bargains are wrapped in kindness and sealed in fear. Every pardon is remembered, and every debt is eventually collected.",
    preview: { start: "#cc5918", end: "#ca5717", border: "#4a1e8d", text: "#4a1e8d" }
  },
  {
    id: "glory-grief",
    label: "Glory & Grief",
    paletteId: 229,
    element: "Warded Air",
    earthlyDesire: "Legacy",
    lede: "Glory & Grief knows triumph is brief and mourning is long.",
    body: "They build monuments knowing weather will take them. Still they build. They inherit names like armor, then dent that armor in public until it fits their own shape.",
    preview: { start: "#f39b29", end: "#f39b29", border: "#e4220f", text: "#e4220f" }
  },
  {
    id: "oath-ruin",
    label: "Oath & Ruin",
    paletteId: 310,
    element: "Wakened Earth",
    earthlyDesire: "Certainty",
    lede: "Oath & Ruin confuses devotion with permanence.",
    body: "They bind themselves to vows older than memory and enforce those vows with patient violence. Their certainty steadies allies and terrifies everyone else.",
    preview: { start: "#e596c9", end: "#e596c9", border: "#cc5920", text: "#7d1532" }
  },
  {
    id: "grace-disgrace",
    label: "Grace & Disgrace",
    paletteId: 341,
    element: "Wandering Water",
    earthlyDesire: "Prestige",
    lede: "Grace & Disgrace turns reputation into a weaponized mask.",
    body: "They host the feast, write the invitation list, and decide who arrives already ruined. Their courtesy is impeccable and their penalties are intimate.",
    preview: { start: "#1d4255", end: "#1d4255", border: "#cc8c37", text: "#e6a4dc" }
  },
  {
    id: "throne-thorns",
    label: "Throne & Thorns",
    paletteId: 348,
    element: "Wakened Fire",
    earthlyDesire: "Authority",
    lede: "Throne & Thorns rules best when obedience feels voluntary.",
    body: "They cultivate courts the way gardeners cultivate hedges: trimmed, ornamental, and full of hidden blades. Their patience is seasonal and their punishments are perennial.",
    preview: { start: "#9e001f", end: "#9e001f", border: "#0b25e4", text: "#0b25e4" }
  },
  {
    id: "forge-frost",
    label: "Forge & Frost",
    paletteId: 268,
    element: "Wakened Water",
    earthlyDesire: "Mastery",
    lede: "Forge & Frost believes discipline is the purest form of hunger.",
    body: "They temper desire until it cuts clean. Their halls reward craft, endurance, and immaculate control. They do not forgive waste, especially wasted talent.",
    preview: { start: "#3b1138", end: "#3b1138", border: "#96a8ba", text: "#df7a91" }
  }
];

const EXTRA_CONCORD_CARDS = [
  { id: "brood-feud", title: "Brood\n&\nFeud", element: "Wakened Fire", desire: "Conquest", symbol: "♂", colorBg: "#9e001f", colorTop: "#0b25e4", colorTitle: "#0b25e4", routeId: "throne-thorns" },
  { id: "zeal-steel", title: "Zeal\n&\nSteel", element: "Wakened Earth", desire: "Legacy", symbol: "♄", colorBg: "#e596c9", colorTop: "#cc5920", colorTitle: "#7d1532", routeId: "oath-ruin" },
  { id: "tears-spears", title: "Tears\n&\nSpears", element: "Wakened Water", desire: "Devotion", symbol: "☽", colorBg: "#3b1138", colorTop: "#96a8ba", colorTitle: "#df7a91", routeId: "forge-frost" },
  { id: "veils-sails", title: "Veils\n&\nSails", element: "Wandering Water", desire: "Rapture", symbol: "♆", colorBg: "#1d4255", colorTop: "#cc8c37", colorTitle: "#e6a4dc", routeId: "grace-disgrace" },
  { id: "laurels-quarrels", title: "Laurels\n&\nQuarrels", element: "Warded Air", desire: "Glory", symbol: "☉", colorBg: "#cc5918", colorTop: "#df7a91", colorTitle: "#4a1e8d", routeId: "mercy-malice" },
  { id: "wit-spit", title: "Wit\n&\nSpit", element: "Wandering Air", desire: "Cunning", symbol: "⚶", colorBg: "#f7f7f7", colorTop: "#f3b1bc", colorTitle: "#4a1e8d", routeId: "grace-disgrace" },
  { id: "desire-conspire-gold", title: "Desire\n&\nConspire", element: "Wandering Fire", desire: "Ambition", symbol: "♃", colorBg: "#b32200", colorTop: "#f39b29", colorTitle: "#f5dc74", routeId: "desire-conspire" },
  { id: "pleasure-treasure-gold", title: "Pleasure\n&\nTreasure", element: "Warded Earth", desire: "Hedonism", symbol: "♀", colorBg: "#0d2b0f", colorTop: "#cc8c37", colorTitle: "#f0a925", routeId: "pleasure-treasure" }
];

const CONCORDS_BY_ID = new Map(CONCORDS.map((concord) => [concord.id, concord]));

const BASE_CONCORD_CARDS = CONCORDS.map((concord, index) => {
  const symbols = ["♃", "♂", "☉", "♄", "♆", "☽", "⚶", "♀"];
  return {
    id: `${concord.id}-base`,
    title: concord.label.replace(" & ", "\n&\n"),
    element: concord.element,
    desire: concord.earthlyDesire,
    symbol: symbols[index % symbols.length],
    colorBg: concord.preview.start,
    colorTop: concord.preview.border,
    colorTitle: concord.preview.text,
    routeId: concord.id
  };
});

const ALL_CONCORD_CARDS = [...BASE_CONCORD_CARDS, ...EXTRA_CONCORD_CARDS];
const MAIN_CARD_IDS = new Set([
  "desire-conspire-base",
  "pleasure-treasure-base",
  "brood-feud",
  "zeal-steel",
  "tears-spears",
  "veils-sails",
  "laurels-quarrels",
  "wit-spit"
]);

const MAIN_CONCORD_CARDS = ALL_CONCORD_CARDS.filter((card) => MAIN_CARD_IDS.has(card.id));
const SPARE_CONCORD_CARDS = ALL_CONCORD_CARDS.filter((card) => !MAIN_CARD_IDS.has(card.id));
const CONCORD_NOTES_BY_ID = {
  "desire-conspire": 146.83, // D3
  "forge-frost": 155.56, // D#3
  "glory-grief": 174.61, // F3
  "grace-disgrace": 196.0, // G3
  "mercy-malice": 220.0, // A3
  "oath-ruin": 233.08, // A#3
  "pleasure-treasure": 261.63, // C4
  "throne-thorns": 293.66 // D4
};

function playGongTone(audioContext, frequency) {
  const now = audioContext.currentTime;
  const endTime = now + 3.4;

  const master = audioContext.createGain();
  const lowpass = audioContext.createBiquadFilter();

  lowpass.type = "lowpass";
  lowpass.frequency.setValueAtTime(2200, now);
  lowpass.frequency.exponentialRampToValueAtTime(500, endTime);
  lowpass.Q.value = 0.7;

  master.gain.setValueAtTime(0.0001, now);
  master.gain.exponentialRampToValueAtTime(0.24, now + 0.03);
  master.gain.exponentialRampToValueAtTime(0.0001, endTime);

  lowpass.connect(master);
  master.connect(audioContext.destination);

  const partials = [
    { ratio: 1, type: "triangle", gain: 0.95 },
    { ratio: 2.15, type: "sine", gain: 0.24 },
    { ratio: 2.92, type: "sine", gain: 0.14 }
  ];

  partials.forEach((partial) => {
    const osc = audioContext.createOscillator();
    const oscGain = audioContext.createGain();

    osc.type = partial.type;
    osc.frequency.setValueAtTime(frequency * partial.ratio, now);
    osc.detune.setValueAtTime((Math.random() - 0.5) * 8, now);

    oscGain.gain.setValueAtTime(partial.gain, now);
    oscGain.gain.exponentialRampToValueAtTime(0.0001, endTime);

    osc.connect(oscGain);
    oscGain.connect(lowpass);

    osc.start(now);
    osc.stop(endTime);
    osc.onended = () => {
      osc.disconnect();
      oscGain.disconnect();
    };
  });

  setTimeout(() => {
    lowpass.disconnect();
    master.disconnect();
  }, 3600);
}

function toFirstWordCapital(text) {
  const lower = text.toLowerCase();
  return lower.replace(/^([a-z])/, (m) => m.toUpperCase());
}

function getRouteFromPath(pathname) {
  if (pathname === "/") return { page: "home" };
  if (pathname === "/concords") return { page: "concords" };
  if (pathname === "/concords/spare") return { page: "concords-spare" };

  const detailMatch = pathname.match(/^\/concords\/([a-z0-9-]+)$/);
  if (detailMatch && CONCORDS_BY_ID.has(detailMatch[1])) {
    return { page: "concord-detail", concordId: detailMatch[1] };
  }

  return { page: "not-found" };
}

function getPathFromRoute(route) {
  if (route.page === "home") return "/";
  if (route.page === "concords") return "/concords";
  if (route.page === "concords-spare") return "/concords/spare";
  if (route.page === "concord-detail" && route.concordId) return `/concords/${route.concordId}`;
  return "/";
}

function StoryPage() {
  return (
    <main className="hero-layout">
      <aside className="event-meta type-caps">
        <p>March 14th 2026</p>
        <p>Piedmont</p>
        <p>Community</p>
        <p>Center</p>
      </aside>

      <article className="story-block">
        <h1 className="type-before before-mark">Before...</h1>
        <p className="type-body story-paragraph">the dead were put to rest, and before the end of Wonders or the withering of Mystery, there loomed in the dusk of all things, the city of Necropolis.</p>
        <p className="type-body story-paragraph">There, eight CONCORDS, may they be both cursed and blessed, return to the sparring fields to compete in another cycle of the eternal tournament.</p>
        <p className="type-body story-paragraph">Victory promises eternal renewal, dominion, or release, each Concord tells the tale it prefers, but all agree on this: <strong>the Tournament must be held, and you must attend.</strong></p>
        <p className="type-body story-paragraph">Death has no hold on those bound by grim accord. Yet even here, beneath rite and rivalry, its shadow gathers and its patience thins.</p>
        <p className="type-body story-paragraph">But Death but claim us all.</p>
      </article>
    </main>
  );
}

function ConcordsPage({ onOpenConcord, onHoverConcord, cards }) {
  return (
    <main className="concords-layout">
      <section className="concord-grid concord-grid-exact" aria-label="Concord squares">
        {cards.map((card) => (
          <button
            key={card.id}
            type="button"
            className="concord-card"
            onClick={onOpenConcord(card.routeId)}
            onMouseEnter={() => onHoverConcord(card.routeId)}
            style={{
              "--card-bg": card.colorBg,
              "--card-secondary": card.colorTop,
              "--card-title": card.colorTitle
            }}
          >
            <p className="concord-card-symbol">{card.symbol}</p>
            <p className="concord-card-element">{card.element.toLowerCase()}</p>
            <h3 className="concord-card-title">
              {card.title.split("\n").map((line, index, allLines) => (
                <span key={`${card.id}-${line}-${index}`}>
                  {toFirstWordCapital(line)}
                  {index < allLines.length - 1 ? <br /> : null}
                </span>
              ))}
            </h3>
            <p className="concord-card-desire">{card.desire.toLowerCase()}</p>
          </button>
        ))}
      </section>
    </main>
  );
}

function ConcordDetailPage({ concord }) {
  return (
    <main className="concord-detail-layout">
      <aside className="concord-detail-left">
        <h1 className="concord-detail-name">{concord.label}</h1>

        <dl className="concord-meta">
          <div className="concord-meta-row">
            <dt className="type-caps">Element:</dt>
            <dd className="type-caps concord-meta-value">{concord.element}</dd>
          </div>
          <div className="concord-meta-row">
            <dt className="type-caps">Earthly Desire:</dt>
            <dd className="type-caps concord-meta-value">{concord.earthlyDesire}</dd>
          </div>
          <div className="concord-meta-row">
            <dt className="type-caps">Palette:</dt>
            <dd className="type-caps concord-meta-value">Wada #{concord.paletteId}</dd>
          </div>
        </dl>
      </aside>

      <article className="concord-detail-right">
        <p className="concord-lede">{concord.lede}</p>
        {(concord.bodyParagraphs ?? [concord.body]).map((paragraph, index) => (
          <p key={`${concord.id}-body-${index}`} className="concord-body">{paragraph}</p>
        ))}
      </article>
    </main>
  );
}

function NotFoundPage({ onReturnHome }) {
  return (
    <main className="not-found-layout" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="not-found-code">404</h1>
      <p className="not-found-message">It's pitch back. You are likely to be eaten by a grue.</p>
      <a href="/" onClick={onReturnHome} className="not-found-link">return home</a>
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => getRouteFromPath(window.location.pathname));
  const audioContextRef = useRef(null);
  const lastHoverRef = useRef({ concordId: "", time: 0 });

  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => () => {
    if (audioContextRef.current) {
      audioContextRef.current.close().catch(() => {});
    }
  }, []);

  const selectedConcord = useMemo(() => {
    if (route.page !== "concord-detail") return null;
    return CONCORDS_BY_ID.get(route.concordId) ?? null;
  }, [route]);

  const navigate = (nextRoute) => (event) => {
    event.preventDefault();
    const nextPath = getPathFromRoute(nextRoute);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setRoute(nextRoute);
  };

  const handleConcordHover = (concordId) => {
    if (typeof window === "undefined") return;

    const now = window.performance.now();
    if (lastHoverRef.current.concordId === concordId && now - lastHoverRef.current.time < 220) {
      return;
    }
    lastHoverRef.current = { concordId, time: now };

    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }

    const audioContext = audioContextRef.current;
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }

    const frequency = CONCORD_NOTES_BY_ID[concordId] ?? 196.0;
    playGongTone(audioContext, frequency);
  };

  let pageContent = <StoryPage />;
  if (route.page === "concords") {
    pageContent = <ConcordsPage cards={MAIN_CONCORD_CARDS} onOpenConcord={(id) => navigate({ page: "concord-detail", concordId: id })} onHoverConcord={handleConcordHover} />;
  }
  if (route.page === "concords-spare") {
    pageContent = <ConcordsPage cards={SPARE_CONCORD_CARDS} onOpenConcord={(id) => navigate({ page: "concord-detail", concordId: id })} onHoverConcord={handleConcordHover} />;
  }
  if (route.page === "concord-detail" && selectedConcord) {
    pageContent = <ConcordDetailPage concord={selectedConcord} />;
  }
  if (route.page === "not-found") {
    pageContent = <NotFoundPage onReturnHome={navigate({ page: "home" })} />;
  }

  const inConcordsSection = route.page === "concords" || route.page === "concords-spare" || route.page === "concord-detail";

  return (
    <div className="page-shell" data-page={route.page} data-concord={selectedConcord ? selectedConcord.id : undefined}>
      <header className="top-bar">
        <a href="/" onClick={navigate({ page: "home" })} className="type-logo brand" aria-label="Necropolis home">Necropolis</a>
        <nav className="top-nav" aria-label="Primary">
          <a href="/concords" onClick={navigate({ page: "concords" })} className="type-caps top-nav-link" aria-current={inConcordsSection ? "page" : undefined}>Concords</a>
          <a href="#" className="type-caps top-nav-link">Sign In</a>
        </nav>
      </header>

      {pageContent}
    </div>
  );
}
