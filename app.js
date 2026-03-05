const CONCORDS = [
  {
    id: "pleasure-treasure",
    label: "Pleasure & Treasure",
    paletteId: 342,
    element: "Warded Earth",
    earthlyDesire: "Hedonism",
    lede:
      "Those pledged to the CONCORD of Pleasure & Treasure are insatiable.",
    body:
      "They learned early that glory burns bright and dies young. Gold does not. They pursue power because power hardens into possession. Land can be held. Ships can be anchored. Mines can be dug deeper. Coin can be stacked until it outlives its owner. Influence drifts; wealth settles. The Concord prefers what settles.",
    preview: {
      start: "#0d2b0f",
      end: "#102f12",
      border: "#b89342",
      text: "#f0a925"
    }
  },
  {
    id: "desire-conspire",
    label: "Desire & Conspire",
    paletteId: 332,
    element: "Wandering Fire",
    earthlyDesire: "Ambition",
    lede: "Those sworn to Desire & Conspire sharpen longing into strategy.",
    body:
      "They do not wait for fate to move first. They braid rumor, leverage, and timing until outcomes bend. Where others see chaos, they see openings. Where others see loyalty, they see terms.",
    preview: {
      start: "#b32200",
      end: "#ad2000",
      border: "#f5dc74",
      text: "#f5dc74"
    }
  },
  {
    id: "mercy-malice",
    label: "Mercy & Malice",
    paletteId: 338,
    element: "Warded Air",
    earthlyDesire: "Control",
    lede: "Mercy & Malice keeps a soft hand and a prepared knife.",
    body:
      "They offer sanctuary only when sanctuary serves. Their bargains are wrapped in kindness and sealed in fear. Every pardon is remembered, and every debt is eventually collected.",
    preview: {
      start: "#cc5918",
      end: "#ca5717",
      border: "#4a1e8d",
      text: "#4a1e8d"
    }
  },
  {
    id: "glory-grief",
    label: "Glory & Grief",
    paletteId: 229,
    element: "Warded Air",
    earthlyDesire: "Legacy",
    lede: "Glory & Grief knows triumph is brief and mourning is long.",
    body:
      "They build monuments knowing weather will take them. Still they build. They inherit names like armor, then dent that armor in public until it fits their own shape.",
    preview: {
      start: "#f39b29",
      end: "#f39b29",
      border: "#e4220f",
      text: "#e4220f"
    }
  },
  {
    id: "oath-ruin",
    label: "Oath & Ruin",
    paletteId: 310,
    element: "Wakened Earth",
    earthlyDesire: "Certainty",
    lede: "Oath & Ruin confuses devotion with permanence.",
    body:
      "They bind themselves to vows older than memory and enforce those vows with patient violence. Their certainty steadies allies and terrifies everyone else.",
    preview: {
      start: "#e596c9",
      end: "#e596c9",
      border: "#7d1532",
      text: "#7d1532"
    }
  },
  {
    id: "grace-disgrace",
    label: "Grace & Disgrace",
    paletteId: 341,
    element: "Wandering Water",
    earthlyDesire: "Prestige",
    lede: "Grace & Disgrace turns reputation into a weaponized mask.",
    body:
      "They host the feast, write the invitation list, and decide who arrives already ruined. Their courtesy is impeccable and their penalties are intimate.",
    preview: {
      start: "#1d4255",
      end: "#1d4255",
      border: "#e6a4dc",
      text: "#e6a4dc"
    }
  },
  {
    id: "throne-thorns",
    label: "Throne & Thorns",
    paletteId: 348,
    element: "Wakened Fire",
    earthlyDesire: "Authority",
    lede: "Throne & Thorns rules best when obedience feels voluntary.",
    body:
      "They cultivate courts the way gardeners cultivate hedges: trimmed, ornamental, and full of hidden blades. Their patience is seasonal and their punishments are perennial.",
    preview: {
      start: "#9e001f",
      end: "#9e001f",
      border: "#0b25e4",
      text: "#0b25e4"
    }
  },
  {
    id: "forge-frost",
    label: "Forge & Frost",
    paletteId: 268,
    element: "Wakened Water",
    earthlyDesire: "Mastery",
    lede: "Forge & Frost believes discipline is the purest form of hunger.",
    body:
      "They temper desire until it cuts clean. Their halls reward craft, endurance, and immaculate control. They do not forgive waste, especially wasted talent.",
    preview: {
      start: "#3b1138",
      end: "#3b1138",
      border: "#df7a91",
      text: "#df7a91"
    }
  }
];

const EXTRA_CONCORD_CARDS = [
  {
    id: "brood-feud",
    title: "Brood\n&\nFeud",
    element: "Wakened Fire",
    desire: "Conquest",
    symbol: "♂",
    colorBg: "#9e001f",
    colorTop: "#0b25e4",
    colorTitle: "#0b25e4",
    routeId: "throne-thorns"
  },
  {
    id: "zeal-steel",
    title: "Zeal\n&\nSteel",
    element: "Wakened Earth",
    desire: "Legacy",
    symbol: "♄",
    colorBg: "#e596c9",
    colorTop: "#cc5920",
    colorTitle: "#7d1532",
    routeId: "oath-ruin"
  },
  {
    id: "tears-spears",
    title: "Tears\n&\nSpears",
    element: "Wakened Water",
    desire: "Devotion",
    symbol: "☽",
    colorBg: "#3b1138",
    colorTop: "#96a8ba",
    colorTitle: "#df7a91",
    routeId: "forge-frost"
  },
  {
    id: "veils-sails",
    title: "Veils\n&\nSails",
    element: "Wandering Water",
    desire: "Rapture",
    symbol: "♆",
    colorBg: "#1d4255",
    colorTop: "#cc8c37",
    colorTitle: "#e6a4dc",
    routeId: "grace-disgrace"
  },
  {
    id: "laurels-quarrels",
    title: "Laurels\n&\nQuarrels",
    element: "Warded Air",
    desire: "Glory",
    symbol: "☉",
    colorBg: "#cc5918",
    colorTop: "#df7a91",
    colorTitle: "#4a1e8d",
    routeId: "mercy-malice"
  },
  {
    id: "wit-spit",
    title: "Wit\n&\nSpit",
    element: "Wandering Air",
    desire: "Cunning",
    symbol: "⚶",
    colorBg: "#f7f7f7",
    colorTop: "#f3b1bc",
    colorTitle: "#4a1e8d",
    routeId: "grace-disgrace"
  },
  {
    id: "desire-conspire-gold",
    title: "Desire\n&\nConspire",
    element: "Wandering Fire",
    desire: "Ambition",
    symbol: "♃",
    colorBg: "#b32200",
    colorTop: "#f39b29",
    colorTitle: "#f5dc74",
    routeId: "desire-conspire"
  },
  {
    id: "pleasure-treasure-gold",
    title: "Pleasure\n&\nTreasure",
    element: "Warded Earth",
    desire: "Hedonism",
    symbol: "♀",
    colorBg: "#0d2b0f",
    colorTop: "#cc8c37",
    colorTitle: "#f0a925",
    routeId: "pleasure-treasure"
  }
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

const CONCORD_BOARD_CARDS = [...BASE_CONCORD_CARDS, ...EXTRA_CONCORD_CARDS];
const app = document.getElementById("app");

function escapeHtml(text) {
  return text
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#39;");
}

function toFirstWordCapital(text) {
  const lower = text.toLowerCase();
  return lower.replace(/^([a-z])/, (match) => match.toUpperCase());
}

function formatTitleWithBreaks(title) {
  return title
    .split("\n")
    .map((line) => escapeHtml(toFirstWordCapital(line)))
    .join("<br />");
}

function getRouteFromPath(pathname) {
  if (pathname === "/") {
    return { page: "home" };
  }

  if (pathname === "/concords") {
    return { page: "concords" };
  }

  const detailMatch = pathname.match(/^\/concords\/([a-z0-9-]+)$/);
  if (detailMatch && CONCORDS_BY_ID.has(detailMatch[1])) {
    return { page: "concord-detail", concordId: detailMatch[1] };
  }

  return { page: "not-found" };
}

function getPathFromRoute(route) {
  if (route.page === "concords") {
    return "/concords";
  }

  if (route.page === "concord-detail" && route.concordId) {
    return `/concords/${route.concordId}`;
  }

  return "/";
}

function renderStoryPage() {
  return `
    <main class="hero-layout">
      <aside class="event-meta type-caps">
        <p>March 14th 2026</p>
        <p>Piedmont</p>
        <p>Community</p>
        <p>Center</p>
      </aside>

      <article class="story-block">
        <h1 class="type-before before-mark">Before...</h1>
        <p class="type-body story-paragraph">
          the dead were put to rest, and before the end of Wonders or the withering of Mystery,
          there loomed in the dusk of all things, the city of Necropolis.
        </p>
        <p class="type-body story-paragraph">
          There, eight CONCORDS, may they be both cursed and blessed, return to the sparring fields
          to compete in another cycle of the eternal tournament.
        </p>
        <p class="type-body story-paragraph">
          Victory promises eternal renewal, dominion, or release, each Concord tells the tale it prefers,
          but all agree on this: <strong>the Tournament must be held, and you must attend.</strong>
        </p>
        <p class="type-body story-paragraph">
          Death has no hold on those bound by grim accord. Yet even here, beneath rite and rivalry,
          its shadow gathers and its patience thins.
        </p>
        <p class="type-body story-paragraph">But Death but claim us all.</p>
      </article>
    </main>
  `;
}

function renderConcordsPage() {
  const tiles = CONCORD_BOARD_CARDS.map((card) => {
    return `
      <button
        type="button"
        class="concord-card"
        data-concord-open="${card.routeId}"
        style="--card-bg:${card.colorBg};--card-secondary:${card.colorTop};--card-title:${card.colorTitle};"
      >
        <p class="concord-card-symbol">${escapeHtml(card.symbol)}</p>
        <p class="concord-card-element">${escapeHtml(card.element.toLowerCase())}</p>
        <h3 class="concord-card-title">${formatTitleWithBreaks(card.title)}</h3>
        <p class="concord-card-desire">${escapeHtml(card.desire.toLowerCase())}</p>
      </button>
    `;
  }).join("");

  return `
    <main class="concords-layout">
      <section class="concord-grid concord-grid-exact" aria-label="Concord squares">${tiles}</section>
    </main>
  `;
}

function renderConcordDetailPage(concord) {
  return `
    <main class="concord-detail-layout">
      <aside class="concord-detail-left">
        <button type="button" class="type-caps concord-back" data-nav-route="concords">
          Back to Concords
        </button>

        <h1 class="type-before concord-detail-name">${escapeHtml(concord.label)}</h1>

        <dl class="concord-meta">
          <div class="concord-meta-row">
            <dt class="type-caps">Element:</dt>
            <dd class="type-caps">${escapeHtml(concord.element)}</dd>
          </div>
          <div class="concord-meta-row">
            <dt class="type-caps">Earthly Desire:</dt>
            <dd class="type-caps">${escapeHtml(concord.earthlyDesire)}</dd>
          </div>
          <div class="concord-meta-row">
            <dt class="type-caps">Palette:</dt>
            <dd class="type-caps">Wada #${concord.paletteId}</dd>
          </div>
        </dl>
      </aside>

      <article class="concord-detail-right">
        <p class="concord-lede">${escapeHtml(concord.lede)}</p>
        <p class="concord-body">${escapeHtml(concord.body)}</p>
      </article>
    </main>
  `;
}

function renderNotFoundPage() {
  return `
    <main class="not-found-layout" aria-labelledby="not-found-title">
      <h1 id="not-found-title" class="not-found-code">404</h1>
      <p class="not-found-message">It's pitch back. You are likely to be eaten by a grue.</p>
      <a href="/" data-nav-route="home" class="not-found-link">return home</a>
    </main>
  `;
}

function render() {
  const route = getRouteFromPath(window.location.pathname);
  const selectedConcord = route.page === "concord-detail" ? CONCORDS_BY_ID.get(route.concordId) : null;
  const inConcordsSection = route.page === "concords" || route.page === "concord-detail";

  let pageContent = renderStoryPage();
  if (route.page === "concords") {
    pageContent = renderConcordsPage();
  }
  if (route.page === "concord-detail" && selectedConcord) {
    pageContent = renderConcordDetailPage(selectedConcord);
  }
  if (route.page === "not-found") {
    pageContent = renderNotFoundPage();
  }

  const dataConcordAttr = selectedConcord ? ` data-concord="${selectedConcord.id}"` : "";

  app.innerHTML = `
    <div class="page-shell" data-page="${route.page}"${dataConcordAttr}>
      <header class="top-bar">
        <a href="/" data-nav-route="home" class="type-logo brand" aria-label="Necropolis home">Necropolis</a>
        <nav class="top-nav" aria-label="Primary">
          <a href="/concords" data-nav-route="concords" class="type-caps top-nav-link"${
            inConcordsSection ? ' aria-current="page"' : ""
          }>
            Concords
          </a>
          <a href="#" class="type-caps top-nav-link">Sign In</a>
        </nav>
      </header>
      ${pageContent}
    </div>
  `;
}

function navigate(route) {
  const nextPath = getPathFromRoute(route);
  if (window.location.pathname !== nextPath) {
    window.history.pushState({}, "", nextPath);
  }
  render();
}

app.addEventListener("click", (event) => {
  const concordOpen = event.target.closest("[data-concord-open]");
  if (concordOpen) {
    event.preventDefault();
    navigate({ page: "concord-detail", concordId: concordOpen.dataset.concordOpen });
    return;
  }

  const nav = event.target.closest("[data-nav-route]");
  if (nav) {
    event.preventDefault();
    const page = nav.dataset.navRoute;
    if (page === "concords") {
      navigate({ page: "concords" });
      return;
    }
    navigate({ page: "home" });
  }
});

window.addEventListener("popstate", render);

if ("fonts" in document) {
  Promise.race([
    Promise.allSettled([
      document.fonts.load('400 1em "Lohengrin"'),
      document.fonts.load('400 1em "Darksame Regular"')
    ]),
    new Promise((resolve) => setTimeout(resolve, 2500))
  ]).finally(() => {
    document.documentElement.classList.add("fonts-ready");
    render();
  });
} else {
  document.documentElement.classList.add("fonts-ready");
  render();
}
