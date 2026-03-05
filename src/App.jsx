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
    lede: "The Concord of Desire & Conspire drifts from court to court wherever power gathers. They favor velvet, rings, and candlelit corners, moving easily among nobles, spies, and fools alike.",
    bodyParagraphs: [
      "They are students of ambition. Every glance, rumor, and careless word is weighed for advantage. Gossip is their sport and their weapon. A quiet whisper can wound more deeply than steel.",
      "Members of the Concord carry themselves with charm and danger in equal measure. They flirt, provoke, and linger where secrets are being traded. Laughter comes easily, but their eyes are always searching the room for the next opportunity.",
      "At any gathering they can be found close to the center of intrigue-wine in hand, velvet draped over their shoulders, smiling as if they already know how the night will end."
    ],
    preview: { start: "#b32200", end: "#ad2000", border: "#f5dc74", text: "#f5dc74" }
  },
  {
    id: "mercy-malice",
    label: "Mercy & Malice",
    paletteId: 339,
    element: "Warded Air",
    earthlyDesire: "Control",
    lede: "Mercy & Malice keeps a soft hand and a prepared knife.",
    body: "They offer sanctuary only when sanctuary serves. Their bargains are wrapped in kindness and sealed in fear. Every pardon is remembered, and every debt is eventually collected.",
    preview: { start: "#cc5918", end: "#ca5717", border: "#4a1e8d", text: "#4a1e8d" }
  },
  {
    id: "glory-grief",
    label: "Glory & Grief",
    paletteId: 257,
    element: "Warded Air",
    earthlyDesire: "Legacy",
    lede: "Glory & Grief knows triumph is brief and mourning is long.",
    body: "They build monuments knowing weather will take them. Still they build. They inherit names like armor, then dent that armor in public until it fits their own shape.",
    preview: { start: "#f39b29", end: "#f39b29", border: "#e4220f", text: "#e4220f" }
  },
  {
    id: "oath-ruin",
    label: "Oath & Ruin",
    paletteId: 273,
    element: "Wakened Earth",
    earthlyDesire: "Certainty",
    lede: "Oath & Ruin confuses devotion with permanence.",
    body: "They bind themselves to vows older than memory and enforce those vows with patient violence. Their certainty steadies allies and terrifies everyone else.",
    preview: { start: "#e596c9", end: "#e596c9", border: "#cc5920", text: "#7d1532" }
  },
  {
    id: "grace-disgrace",
    label: "Grace & Disgrace",
    paletteId: 27,
    element: "Wandering Water",
    earthlyDesire: "Prestige",
    lede: "Grace & Disgrace turns reputation into a weaponized mask.",
    body: "They host the feast, write the invitation list, and decide who arrives already ruined. Their courtesy is impeccable and their penalties are intimate.",
    preview: { start: "#1d4255", end: "#1d4255", border: "#cc8c37", text: "#e6a4dc" }
  },
  {
    id: "throne-thorns",
    label: "Throne & Thorns",
    paletteId: 51,
    element: "Wakened Fire",
    earthlyDesire: "Authority",
    lede: "Throne & Thorns rules best when obedience feels voluntary.",
    body: "They cultivate courts the way gardeners cultivate hedges: trimmed, ornamental, and full of hidden blades. Their patience is seasonal and their punishments are perennial.",
    preview: { start: "#9e001f", end: "#9e001f", border: "#0b25e4", text: "#0b25e4" }
  },
  {
    id: "forge-frost",
    label: "Forge & Frost",
    paletteId: 277,
    element: "Wakened Water",
    earthlyDesire: "Mastery",
    lede: "Forge & Frost believes discipline is the purest form of hunger.",
    body: "They temper desire until it cuts clean. Their halls reward craft, endurance, and immaculate control. They do not forgive waste, especially wasted talent.",
    preview: { start: "#3b1138", end: "#3b1138", border: "#96a8ba", text: "#df7a91" }
  }
];

const EXTRA_CONCORD_CARDS = [
  { id: "brood-feud", title: "Brood\n&\nFeud", element: "Wakened Fire", desire: "Conquest", symbol: "♂", colorBg: "#9e001f", colorTop: "#c1c494", colorTitle: "#0b25e4", routeId: "brood-feud" },
  { id: "zeal-steel", title: "Zeal\n&\nSteel", element: "Wakened Earth", desire: "Legacy", symbol: "♄", colorBg: "#e596c9", colorTop: "#cc5920", colorTitle: "#7d1532", routeId: "zeal-steel" },
  { id: "tears-spears", title: "Tears\n&\nSpears", element: "Wakened Water", desire: "Devotion", symbol: "☽", colorBg: "#3b1138", colorTop: "#96a8ba", colorTitle: "#df7a91", routeId: "tears-spears" },
  { id: "veils-sails", title: "Veils\n&\nSails", element: "Wandering Water", desire: "Rapture", symbol: "♆", colorBg: "#1d4255", colorTop: "#cc8c37", colorTitle: "#e6a4dc", routeId: "veils-sails" },
  { id: "laurels-quarrels", title: "Laurels\n&\nQuarrels", element: "Warded Air", desire: "Glory", symbol: "☉", colorBg: "#cc5918", colorTop: "#df7a91", colorTitle: "#4a1e8d", routeId: "laurels-quarrels" },
  { id: "wit-spit", title: "Wit\n&\nSpit", element: "Wandering Air", desire: "Cunning", symbol: "⚶", colorBg: "#f7f7f7", colorTop: "#f3b1bc", colorTitle: "#4a1e8d", routeId: "wit-spit" },
  { id: "desire-conspire-gold", title: "Desire\n&\nConspire", element: "Wandering Fire", desire: "Ambition", symbol: "♃", colorBg: "#b32200", colorTop: "#f39b29", colorTitle: "#f5dc74", routeId: "desire-conspire" },
  { id: "pleasure-treasure-gold", title: "Pleasure\n&\nTreasure", element: "Warded Earth", desire: "Hedonism", symbol: "♀", colorBg: "#0d2b0f", colorTop: "#cc8c37", colorTitle: "#f0a925", routeId: "pleasure-treasure" }
];

const EXTRA_CONCORD_DETAILS = [
  {
    id: "brood-feud",
    label: "Brood & Feud",
    paletteId: 51,
    element: "Wakened Fire",
    earthlyDesire: "Conquest",
    lede: "The Concord of Brood & Feud settles disputes the old-fashioned way: loudly, immediately, and preferably with witnesses.",
    bodyParagraphs: [
      "They live for contest. Steel, argument, arm-wrestling, duels of honor, duels of insults-any contest will do so long as someone wins and someone else knows they lost. Grudges are kept carefully and revisited often, like family heirlooms brought out for special occasions.",
      "Victory matters deeply to them. Details such as fairness, subtlety, or long-term diplomacy matter somewhat less.",
      "Members of the Concord arrive ready for battle, dressed in leather, steel, and the sort of attire that suggests they may have come directly from a fight-or are about to start one. Music is loud, tempers are quick, and alliances are usually sealed with a handshake that feels suspiciously like the beginning of a wrestling match.",
      "Spend enough time near them and you will learn an important truth: for the Concord of Brood & Feud, peace is simply the brief and pleasant interval between fights."
    ],
    preview: { start: "#9e001f", end: "#9e001f", border: "#c1c494", text: "#0b25e4" }
  },
  {
    id: "zeal-steel",
    label: "Zeal & Steel",
    paletteId: 273,
    element: "Wakened Earth",
    earthlyDesire: "Legacy",
    lede: "The Concord of Zeal & Steel believes that anything worth doing is worth organizing properly.",
    bodyParagraphs: [
      "They build things meant to last-fortresses, roads, institutions, and occasionally very large filing systems. Their governing body is known, quite sincerely, as the Administration, which many outsiders have observed bears a striking resemblance to an incredibly German bureaucracy.",
      "Members favor dark coats, iron clasps, and heavy iron signet rings engraved with the mark of Saturn. These rings denote office, achievement, and seniority.",
      "Particularly accomplished members tend to wear several, which makes their handshakes increasingly memorable.",
      "They speak plainly, respect hierarchy, and have the remarkable ability to turn even the most festive gathering into the opening session of a committee.",
      "At a party they can usually be found discussing plans, forming subcommittees, or quietly evaluating whether the evening could be run more efficiently.",
      "Legacy matters to them. But so does proper documentation.",
      "And ideally both will be filed in triplicate."
    ],
    preview: { start: "#e596c9", end: "#e596c9", border: "#cc5920", text: "#7d1532" }
  },
  {
    id: "tears-spears",
    label: "Tears & Spears",
    paletteId: 277,
    element: "Wakened Water",
    earthlyDesire: "Devotion",
    lede: "The great halls of the CONCORD of Tears & Spears were once nothing but a pale forest of white birch, where moonlight fell into pools of silver water collected amongst the tangled roots.",
    bodyParagraphs: [
      "There, in that quiet wood, the first of their order knelt.",
      "They began as the keepers of small promises by which lives are bound together. A devotion to kin, to memory, to the soft gravity that binds blood to blood.",
      "Yet grief and love, when tended such, retain a sharp edge. And what was once tenderness hardened into oath. Oath into doctrine, and doctrine into Order.",
      "When an acolyte swears their vow, they kneel beside the mirrored pools and shed a single tear into the water. The oath is inscribed upon a strip of pale silk, dipped in wax against wind and weather, and tied beneath the blade of a spear planted among the roots. Over the years the banks have grown thick with such spears, their pale prayer strips stirring softly beneath the birches.",
      "Woe, and the blade of a bright mirrored spear may meet any soul foolish enough to scorn their emotions. Bright eyes plays, probably."
    ],
    preview: { start: "#3b1138", end: "#3b1138", border: "#96a8ba", text: "#df7a91" }
  },
  {
    id: "laurels-quarrels",
    label: "Laurels & Quarrels",
    paletteId: 339,
    element: "Warded Air",
    earthlyDesire: "Glory",
    lede: "The Concord of Laurels & Quarrels lives for glory-loud, visible, and properly witnessed.",
    bodyParagraphs: [
      "Members carry themselves like champions whether or not a victory has technically occurred yet. They favor bold entrances, sweeping gestures, and the sort of confidence that suggests applause is expected to arrive shortly.",
      "They dress to be seen: bright fabrics, gold accents, laurel wreaths, and capes that move well during dramatic turns. One should always look ready for a portrait.",
      "They value reputation as much as victory. Achievements are important, but stories about achievements are equally essential.",
      "In contest they fight openly and spectacularly, seizing the center and making the moment theirs. Subtlety is avoided, partly on principle and partly because it is difficult to applaud subtlety properly.",
      "At a gathering they are usually found at the center of the room-holding court, recounting triumphs, and debating who deserves the laurels.",
      "The matter remains unsettled, largely because everyone present is quite certain it ought to be them."
    ],
    preview: { start: "#cc5918", end: "#cc5918", border: "#df7a91", text: "#4a1e8d" }
  },
  {
    id: "veils-sails",
    label: "Veils & Sails",
    paletteId: 27,
    element: "Wandering Water",
    earthlyDesire: "Rapture",
    lede: "The Concord of Veils & Sails travels as loose covens of sea-witches, sailors, and the sort of people who stare at the horizon long enough that it eventually stares back.",
    bodyParagraphs: [
      "They dress for the weather and the tide: fishermen's sweaters, nets worn as shawls, shells and shards of abalone catching the light like bits of drowned moon. Hair tends toward the windblown and pockets often contain things that probably came from the sea and may or may not still belong to it.",
      "They dress for the weather and the tide: fishermen's sweaters, nets worn as shawls, shells and shards of abalone catching the light like fragments of drowned moon. Hair tends toward the windblown and pockets often contain things that probably came from the sea and may or may not still belong to it.",
      "They long for rapture-the moment when song, salt air, strong drink, and crashing waves blur the edges of the world until it becomes pleasantly unclear where the self ends and the ocean begins.",
      "In contest they fight much the same way the sea behaves: circling, teasing, pulling opponents off balance until the moment arrives to surge all at once. Many mistake them for dreamers.",
      "The tide, however, has an excellent, and inevitable, record when it comes to victory."
    ],
    preview: { start: "#1d4255", end: "#1d4255", border: "#cc8c37", text: "#e6a4dc" }
  },
  {
    id: "wit-spit",
    label: "Wit & Spit",
    paletteId: 329,
    element: "Wandering Air",
    earthlyDesire: "Cunning",
    lede: "The Concord of Wit & Spit traces its origins to the Faculty, a wandering institution devoted to scholarship, debate, and the careful study of other people's mistakes.",
    bodyParagraphs: [
      "Members travel widely collecting manuscripts, rumors, theories, and useful bits of information that other people were careless enough to say out loud. Libraries are respected, but conversation is often more productive.",
      "They favor dark coats, ink-stained cuffs, spectacles, and the general air of someone who has either been studying very hard or quietly winning an argument that hasn't happened yet.",
      "Among the Concords they are known for quick tongues, sharper minds, and the unsettling habit of finishing other people's thoughts when they become predictable.",
      "Members of the Faculty take pride in being the most informed person in the room.",
      "Knowledge is useful. Knowing when to use it is fatal."
    ],
    preview: { start: "#f7f7f7", end: "#f7f7f7", border: "#f3b1bc", text: "#4a1e8d" }
  }
];

const CONCORDS_BY_ID = new Map([...CONCORDS, ...EXTRA_CONCORD_DETAILS].map((concord) => [concord.id, concord]));

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
const PARTY_DATE = "March 14th 2026";
const PARTY_ADDRESS = "Piedmont Community Center";
const APP_BASE = (import.meta.env.BASE_URL || "/").replace(/\/$/, "");

function withBase(pathname) {
  const normalized = pathname.startsWith("/") ? pathname : `/${pathname}`;
  if (!APP_BASE) return normalized;
  if (normalized === "/") return `${APP_BASE}/`;
  return `${APP_BASE}${normalized}`;
}

function stripBase(pathname) {
  if (!APP_BASE) return pathname;
  if (pathname === APP_BASE || pathname === `${APP_BASE}/`) return "/";
  if (pathname.startsWith(`${APP_BASE}/`)) return pathname.slice(APP_BASE.length);
  return pathname;
}

function withAssetBase(pathname) {
  const clean = pathname.replace(/^\//, "");
  return `${import.meta.env.BASE_URL}${clean}`;
}

const COSTUME_IMAGE_COUNTS = {
  "brood-feud": 13,
  "desire-conspire": 12,
  "laurels-quarrels": 9,
  "pleasure-treasure": 11,
  "tears-spears": 16,
  "veils-sails": 15,
  "wit-spit": 14,
  "zeal-steel": 12
};

const COSTUME_IMAGES_BY_CONCORD = Object.fromEntries(
  Object.entries(COSTUME_IMAGE_COUNTS).map(([concordId, count]) => [
    concordId,
    Array.from({ length: count }, (_, index) => withAssetBase(`/costumes/${concordId}/img-${String(index + 1).padStart(2, "0")}.png`))
  ])
);
const CONCORD_NOTES_BY_ID = {
  "brood-feud": 138.59, // C#3
  "desire-conspire": 146.83, // D3
  "forge-frost": 155.56, // D#3
  "glory-grief": 174.61, // F3
  "grace-disgrace": 196.0, // G3
  "laurels-quarrels": 207.65, // G#3
  "mercy-malice": 220.0, // A3
  "oath-ruin": 233.08, // A#3
  "pleasure-treasure": 261.63, // C4
  "throne-thorns": 293.66, // D4
  "tears-spears": 349.23, // F4
  "veils-sails": 311.13, // D#4
  "wit-spit": 329.63, // E4
  "zeal-steel": 246.94 // B3
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
  const appPath = stripBase(pathname);
  if (appPath === "/") return { page: "home" };
  if (appPath === "/concords") return { page: "concords" };
  if (appPath === "/concords/spare") return { page: "concords-spare" };

  const detailMatch = appPath.match(/^\/concords\/([a-z0-9-]+)(?:\/(backstory|costumes))?$/);
  if (detailMatch && CONCORDS_BY_ID.has(detailMatch[1])) {
    return { page: "concord-detail", concordId: detailMatch[1], detailTab: detailMatch[2] ?? "backstory" };
  }

  return { page: "not-found" };
}

function getPathFromRoute(route) {
  if (route.page === "home") return withBase("/");
  if (route.page === "concords") return withBase("/concords");
  if (route.page === "concords-spare") return withBase("/concords/spare");
  if (route.page === "concord-detail" && route.concordId) {
    if (route.detailTab === "costumes") return withBase(`/concords/${route.concordId}/costumes`);
    return withBase(`/concords/${route.concordId}`);
  }
  return withBase("/");
}

function StoryPage({ onHoverOmenStart, onHoverOmenEnd }) {
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
        <p className="type-body story-paragraph">There, eight <span className="story-concord-word">Concords</span>, may they be both cursed and blessed, return to the sparring fields to compete in another cycle of the eternal tournament.</p>
        <p className="type-body story-paragraph">Victory promises eternal renewal, dominion, or release, each Concord tells the tale it prefers, but all agree on this: <strong>the Tournament must be held, and you must attend.</strong></p>
        <p className="type-body story-paragraph">Death has no hold on those bound by grim accord. Yet even here, beneath rite and rivalry, its shadow gathers and its patience thins.</p>
        <p className="type-body story-paragraph story-omen-paragraph">
          <span
            className="story-concord-word story-omen-word"
            onMouseEnter={onHoverOmenStart}
            onMouseLeave={onHoverOmenEnd}
          >
            but death must claim us all
          </span>
          .
        </p>
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

function ConcordDetailPage({ concord, detailTab, onOpenTab }) {
  const [leftLabel, rightLabel] = concord.label.split(" & ");
  const [loadedCostumeImages, setLoadedCostumeImages] = useState({});
  const displayLabel = rightLabel
    ? (
      <>
        {leftLabel}
        <br />
        &
        <br />
        {rightLabel}
      </>
    )
    : concord.label;
  const costumeImages = COSTUME_IMAGES_BY_CONCORD[concord.id] ?? [];

  return (
    <main className="concord-detail-layout">
      <aside className="concord-detail-left">
        <h1 className="concord-detail-name">{displayLabel}</h1>

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
        <nav className="concord-subnav" aria-label={`${concord.label} detail sections`}>
          <a
            href={getPathFromRoute({ page: "concord-detail", concordId: concord.id, detailTab: "backstory" })}
            onClick={onOpenTab("backstory")}
            className="type-caps concord-subnav-link"
            aria-current={detailTab !== "costumes" ? "page" : undefined}
          >
            Backstory
          </a>
          <a
            href={getPathFromRoute({ page: "concord-detail", concordId: concord.id, detailTab: "costumes" })}
            onClick={onOpenTab("costumes")}
            className="type-caps concord-subnav-link"
            aria-current={detailTab === "costumes" ? "page" : undefined}
          >
            Costumes
          </a>
        </nav>

        {detailTab === "costumes" ? (
          <section className="costume-grid" aria-label={`${concord.label} costumes`}>
            {costumeImages.map((src, index) => (
              <img
                key={`${concord.id}-costume-${index + 1}`}
                src={src}
                alt={`${concord.label} costume ${index + 1}`}
                className={`costume-image${loadedCostumeImages[src] ? " is-loaded" : ""}`}
                loading="lazy"
                decoding="async"
                onLoad={() => {
                  setLoadedCostumeImages((prev) => {
                    if (prev[src]) return prev;
                    return { ...prev, [src]: true };
                  });
                }}
              />
            ))}
          </section>
        ) : (
          <>
            <p className="concord-lede">{concord.lede}</p>
            {(concord.bodyParagraphs ?? [concord.body]).map((paragraph, index) => (
              <p key={`${concord.id}-body-${index}`} className="concord-body">{paragraph}</p>
            ))}
          </>
        )}
      </article>
    </main>
  );
}

function NotFoundPage({ onReturnHome }) {
  return (
    <main className="not-found-layout" aria-labelledby="not-found-title">
      <h1 id="not-found-title" className="not-found-code">404</h1>
      <p className="not-found-message">It's pitch back. You are likely to be eaten by a grue.</p>
      <a href={getPathFromRoute({ page: "home" })} onClick={onReturnHome} className="not-found-link">return home</a>
    </main>
  );
}

export default function App() {
  const [route, setRoute] = useState(() => getRouteFromPath(window.location.pathname));
  const audioContextRef = useRef(null);
  const lastHoverRef = useRef({ concordId: "", time: 0 });
  const ominousHumRef = useRef(null);

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

  const startOminousHum = () => {
    if (typeof window === "undefined") return;
    const AudioContextClass = window.AudioContext || window.webkitAudioContext;
    if (!AudioContextClass) return;

    if (!audioContextRef.current) {
      audioContextRef.current = new AudioContextClass();
    }
    const audioContext = audioContextRef.current;
    if (audioContext.state === "suspended") {
      audioContext.resume().catch(() => {});
    }
    if (ominousHumRef.current) return;

    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const lowpass = audioContext.createBiquadFilter();
    const oscA = audioContext.createOscillator();
    const oscB = audioContext.createOscillator();

    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(520, now);
    lowpass.Q.value = 0.9;

    oscA.type = "triangle";
    oscA.frequency.setValueAtTime(73.42, now);
    oscB.type = "sine";
    oscB.frequency.setValueAtTime(77.78, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.045, now + 0.65);

    oscA.connect(lowpass);
    oscB.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(audioContext.destination);

    oscA.start(now);
    oscB.start(now);

    ominousHumRef.current = { gain, lowpass, oscA, oscB };
  };

  const stopOminousHum = () => {
    const hum = ominousHumRef.current;
    if (!hum || !audioContextRef.current) return;

    const now = audioContextRef.current.currentTime;
    hum.gain.gain.cancelScheduledValues(now);
    hum.gain.gain.setValueAtTime(Math.max(hum.gain.gain.value, 0.0001), now);
    hum.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.45);

    hum.oscA.stop(now + 0.48);
    hum.oscB.stop(now + 0.48);
    setTimeout(() => {
      hum.oscA.disconnect();
      hum.oscB.disconnect();
      hum.lowpass.disconnect();
      hum.gain.disconnect();
    }, 550);

    ominousHumRef.current = null;
  };

  let pageContent = <StoryPage onHoverOmenStart={startOminousHum} onHoverOmenEnd={stopOminousHum} />;
  if (route.page === "concords") {
    pageContent = <ConcordsPage cards={MAIN_CONCORD_CARDS} onOpenConcord={(id) => navigate({ page: "concord-detail", concordId: id })} onHoverConcord={handleConcordHover} />;
  }
  if (route.page === "concords-spare") {
    pageContent = <ConcordsPage cards={SPARE_CONCORD_CARDS} onOpenConcord={(id) => navigate({ page: "concord-detail", concordId: id })} onHoverConcord={handleConcordHover} />;
  }
  if (route.page === "concord-detail" && selectedConcord) {
    pageContent = (
      <ConcordDetailPage
        concord={selectedConcord}
        detailTab={route.detailTab ?? "backstory"}
        onOpenTab={(detailTab) => navigate({ page: "concord-detail", concordId: selectedConcord.id, detailTab })}
      />
    );
  }
  if (route.page === "not-found") {
    pageContent = <NotFoundPage onReturnHome={navigate({ page: "home" })} />;
  }

  const inConcordsSection = route.page === "concords" || route.page === "concords-spare" || route.page === "concord-detail";

  return (
    <div className="page-shell" data-page={route.page} data-concord={selectedConcord ? selectedConcord.id : undefined}>
      <header className="top-bar">
        <a href={getPathFromRoute({ page: "home" })} onClick={navigate({ page: "home" })} className="type-logo brand" aria-label="Necropolis home">Necropolis</a>
        <nav className="top-nav" aria-label="Primary">
          <a href={getPathFromRoute({ page: "concords" })} onClick={navigate({ page: "concords" })} className="type-caps top-nav-link" aria-current={inConcordsSection ? "page" : undefined}>Concords</a>
          <a href="#" className="type-caps top-nav-link">Sign In</a>
        </nav>
      </header>

      {pageContent}

      <footer className="site-footer" aria-label="Party details">
        <p className="type-caps site-footer-date">{PARTY_DATE}</p>
        <p className="type-caps site-footer-address">{PARTY_ADDRESS}</p>
      </footer>
    </div>
  );
}
