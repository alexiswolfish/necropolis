import React, { useEffect, useMemo, useRef, useState } from "react";
import { GOING_GUEST_NAMES } from "./guestAllowlist";
import { HomeRoute } from "./routes/HomeRoute";
import { BeginGate, OnboardingWizard } from "./routes/OnboardingRoute";
import { ConcordDetailPage, ConcordsPage } from "./routes/ConcordsRoute";
import { CharacterPage, PlayersPage } from "./routes/PlayersRoute";
import { createCharacter, fetchAllCharacters, findCharacterByNormalizedName, replaceAllCharacters } from "./data/charactersApi";

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
const TEAM_BLUEPRINT = {
  "desire-conspire": {
    id: "desire-conspire",
    concordName: "Desire & Conspire",
    element: "fire",
    directSign: "Sagittarius",
    ambition: "Influence",
    earthlyDesire: "Ambition",
    palette: { id: 332, background: "#b32200", accent: "#f5dc74", title: "#f5dc74" }
  },
  "pleasure-treasure": {
    id: "pleasure-treasure",
    concordName: "Pleasure & Treasure",
    element: "earth",
    directSign: "Taurus",
    ambition: "Prosperity",
    earthlyDesire: "Hedonism",
    palette: { id: 342, background: "#0d2b0f", accent: "#b89342", title: "#f0a925" }
  },
  "brood-feud": {
    id: "brood-feud",
    concordName: "Brood & Feud",
    element: "fire",
    directSign: "Aries",
    ambition: "Dominance",
    earthlyDesire: "Conquest",
    palette: { id: 51, background: "#9e001f", accent: "#c1c494", title: "#0b25e4" }
  },
  "zeal-steel": {
    id: "zeal-steel",
    concordName: "Zeal & Steel",
    element: "earth",
    directSign: "Capricorn",
    ambition: "Order",
    earthlyDesire: "Legacy",
    palette: { id: 273, background: "#e596c9", accent: "#cc5920", title: "#7d1532" }
  },
  "tears-spears": {
    id: "tears-spears",
    concordName: "Tears & Spears",
    element: "water",
    directSign: "Cancer",
    ambition: "Sanctity",
    earthlyDesire: "Devotion",
    palette: { id: 277, background: "#3b1138", accent: "#96a8ba", title: "#df7a91" }
  },
  "veils-sails": {
    id: "veils-sails",
    concordName: "Veils & Sails",
    element: "water",
    directSign: "Pisces",
    ambition: "Transcendence",
    earthlyDesire: "Rapture",
    palette: { id: 27, background: "#1d4255", accent: "#cc8c37", title: "#e6a4dc" }
  },
  "laurels-quarrels": {
    id: "laurels-quarrels",
    concordName: "Laurels & Quarrels",
    element: "air",
    directSign: "Leo",
    ambition: "Renown",
    earthlyDesire: "Glory",
    palette: { id: 339, background: "#cc5918", accent: "#df7a91", title: "#4a1e8d" }
  },
  "wit-spit": {
    id: "wit-spit",
    concordName: "Wit & Spit",
    element: "air",
    directSign: "Gemini",
    ambition: "Leverage",
    earthlyDesire: "Cunning",
    palette: { id: 329, background: "#f7f7f7", accent: "#f3b1bc", title: "#4a1e8d" }
  }
};

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
  // D harmonic minor: D, E, F, G, A, Bb, C#
  "desire-conspire": 146.83, // D3
  "pleasure-treasure": 164.81, // E3
  "brood-feud": 174.61, // F3
  "zeal-steel": 196.0, // G3
  "tears-spears": 220.0, // A3
  "veils-sails": 233.08, // Bb3
  "laurels-quarrels": 277.18, // C#4
  "mercy-malice": 293.66, // D4
  "glory-grief": 329.63, // E4
  "oath-ruin": 349.23, // F4
  "grace-disgrace": 392.0, // G4
  "throne-thorns": 440.0, // A4
  "forge-frost": 466.16, // Bb4
  "wit-spit": 220.0 // A3
};
const STORAGE_CHARACTER_KEY = "necropolis.character";
const TEAM_MAX_SIZE = 9;
const CONCORD_TEAMS = Object.keys(TEAM_BLUEPRINT);
const DIRECT_SIGN_TO_TEAM = Object.fromEntries(Object.values(TEAM_BLUEPRINT).map((team) => [team.directSign, team.id]));
const ZODIAC_ELEMENT = {
  Aries: "fire",
  Taurus: "earth",
  Gemini: "air",
  Cancer: "water",
  Leo: "fire",
  Virgo: "earth",
  Libra: "air",
  Scorpio: "water",
  Sagittarius: "fire",
  Capricorn: "earth",
  Aquarius: "air",
  Pisces: "water"
};
const TEAM_ELEMENT = Object.fromEntries(Object.values(TEAM_BLUEPRINT).map((team) => [team.id, team.element]));
const ONBOARDING_STATS = [
  { key: "pulchritude", label: "Pulchritude", className: "Velvet Oracle" },
  { key: "grit", label: "Grit", className: "Crypt Warden" },
  { key: "brawn", label: "Brawn", className: "Iron Revenant" },
  { key: "shenanigans", label: "Shenanigans", className: "Moon Trickster" },
  { key: "vigilance", label: "Vigilance", className: "Ash Sentinel" },
  { key: "mystery", label: "Mystery", className: "Veil Seer" },
  { key: "dumbLuck", label: "Dumb Luck", className: "Fortune Ghoul" }
];
const CLASS_BY_STAT = Object.fromEntries(ONBOARDING_STATS.map((stat) => [stat.key, stat.className]));
const STAT_LABELS = Object.fromEntries(ONBOARDING_STATS.map((stat) => [stat.key, stat.label]));
const STAT_KEYS = ONBOARDING_STATS.map((stat) => stat.key);
const STAT_POINT_POOL = 16;
const INITIAL_STATS = Object.fromEntries(STAT_KEYS.map((key) => [key, 0]));

function normalizeName(name) {
  return name.trim().toLowerCase().replace(/[^\w\s]/g, " ").replace(/\s+/g, " ");
}

function tokenizeName(name) {
  return normalizeName(name).split(" ").filter(Boolean);
}

function tokensLikelyMatch(inputToken, guestToken, minPrefixLength = 3) {
  if (!inputToken || !guestToken) return false;
  if (inputToken === guestToken) return true;
  if (inputToken.length >= minPrefixLength && guestToken.startsWith(inputToken)) return true;
  if (guestToken.length >= minPrefixLength && inputToken.startsWith(guestToken)) return true;
  return false;
}

function namesLikelyMatch(inputName, guestName) {
  const inputTokens = tokenizeName(inputName);
  const guestTokens = tokenizeName(guestName);
  if (inputTokens.length === 0 || guestTokens.length === 0) return false;

  const normalizedInput = inputTokens.join(" ");
  const normalizedGuest = guestTokens.join(" ");
  if (normalizedInput === normalizedGuest) return true;

  // First name can match exactly or by strong prefix (alex <-> alexandra).
  if (!tokensLikelyMatch(inputTokens[0], guestTokens[0])) return false;

  const inputLast = inputTokens[inputTokens.length - 1];
  const guestLast = guestTokens[guestTokens.length - 1];
  if (!inputLast || !guestLast) return false;

  if (tokensLikelyMatch(inputLast, guestLast, 2)) return true;

  // "Jeff H" matches "Jeff Henderson" (and vice versa).
  if (inputLast.length === 1 && guestLast.startsWith(inputLast)) return true;
  if (guestLast.length === 1 && inputLast.startsWith(guestLast)) return true;

  return false;
}

function findGuestNameMatch(realName) {
  if (GOING_GUEST_NAMES.length === 0) return realName.trim();
  return GOING_GUEST_NAMES.find((guestName) => namesLikelyMatch(realName, guestName)) ?? null;
}

function parseMonthDayInput(input) {
  const trimmed = String(input ?? "").trim();
  if (!trimmed) return null;

  const monthDayMatch = trimmed.match(/^(\d{1,2})\/(\d{1,2})$/);
  if (monthDayMatch) {
    const month = Number(monthDayMatch[1]);
    const day = Number(monthDayMatch[2]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return { month, day };
    }
    return null;
  }

  const isoMatch = trimmed.match(/^(\d{4})-(\d{2})-(\d{2})$/);
  if (isoMatch) {
    const month = Number(isoMatch[2]);
    const day = Number(isoMatch[3]);
    if (month >= 1 && month <= 12 && day >= 1 && day <= 31) {
      return { month, day };
    }
  }

  return null;
}

function normalizeMonthDayInput(raw) {
  const digits = String(raw ?? "").replace(/\D/g, "").slice(0, 4);
  if (digits.length <= 2) return digits;
  return `${digits.slice(0, 2)}/${digits.slice(2)}`;
}

function monthDayToStorageDate(monthDayInput) {
  const parsed = parseMonthDayInput(monthDayInput);
  if (!parsed) return monthDayInput;
  const month = String(parsed.month).padStart(2, "0");
  const day = String(parsed.day).padStart(2, "0");
  return `2000-${month}-${day}`;
}

function getStoredCharacter() {
  try {
    const raw = window.localStorage.getItem(STORAGE_CHARACTER_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function setStoredCharacter(character) {
  window.localStorage.setItem(STORAGE_CHARACTER_KEY, JSON.stringify(character));
}

function clearStoredCharacter() {
  window.localStorage.removeItem(STORAGE_CHARACTER_KEY);
}

function getTeamCounts(characters) {
  const counts = Object.fromEntries(CONCORD_TEAMS.map((teamId) => [teamId, 0]));
  for (const character of characters) {
    if (character?.concordId && counts[character.concordId] !== undefined) {
      counts[character.concordId] += 1;
    }
  }
  return counts;
}

function getLeastFilledTeam(teamIds, counts, maxSize = TEAM_MAX_SIZE) {
  const candidates = teamIds.filter((teamId) => (counts[teamId] ?? 0) < maxSize);
  if (candidates.length === 0) return null;
  return candidates.sort((a, b) => (counts[a] - counts[b]) || CONCORD_TEAMS.indexOf(a) - CONCORD_TEAMS.indexOf(b))[0];
}

function assignTeamForSign(sign, counts) {
  const signElement = ZODIAC_ELEMENT[sign] ?? null;
  const directTeam = DIRECT_SIGN_TO_TEAM[sign] ?? null;

  if (directTeam && (counts[directTeam] ?? 0) < TEAM_MAX_SIZE) {
    return directTeam;
  }

  if (signElement) {
    const sameElementTeams = CONCORD_TEAMS.filter((teamId) => TEAM_ELEMENT[teamId] === signElement);
    const sameElementCandidate = getLeastFilledTeam(sameElementTeams, counts, TEAM_MAX_SIZE);
    if (sameElementCandidate) return sameElementCandidate;
  }

  return getLeastFilledTeam(CONCORD_TEAMS, counts, TEAM_MAX_SIZE) ?? getLeastFilledTeam(CONCORD_TEAMS, counts, Number.POSITIVE_INFINITY);
}

function getZodiacSign(dateString) {
  const parsed = parseMonthDayInput(dateString);
  if (!parsed) return null;
  const { month, day } = parsed;

  if ((month === 3 && day >= 21) || (month === 4 && day <= 19)) return "Aries";
  if ((month === 4 && day >= 20) || (month === 5 && day <= 20)) return "Taurus";
  if ((month === 5 && day >= 21) || (month === 6 && day <= 20)) return "Gemini";
  if ((month === 6 && day >= 21) || (month === 7 && day <= 22)) return "Cancer";
  if ((month === 7 && day >= 23) || (month === 8 && day <= 22)) return "Leo";
  if ((month === 8 && day >= 23) || (month === 9 && day <= 22)) return "Virgo";
  if ((month === 9 && day >= 23) || (month === 10 && day <= 22)) return "Libra";
  if ((month === 10 && day >= 23) || (month === 11 && day <= 21)) return "Scorpio";
  if ((month === 11 && day >= 22) || (month === 12 && day <= 21)) return "Sagittarius";
  if ((month === 12 && day >= 22) || (month === 1 && day <= 19)) return "Capricorn";
  if ((month === 1 && day >= 20) || (month === 2 && day <= 18)) return "Aquarius";
  return "Pisces";
}

function getAssignedClass(stats) {
  const entries = Object.entries(stats);
  entries.sort((a, b) => b[1] - a[1]);
  if (entries.length < 2 || entries[0][1] !== entries[1][1]) {
    return CLASS_BY_STAT[entries[0][0]] ?? "Doom Herald";
  }
  return "Doom Herald";
}

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

function getRouteFromPath(pathname) {
  const appPath = stripBase(pathname);
  if (appPath === "/") return { page: "home" };
  if (appPath === "/concords") return { page: "concords" };
  if (appPath === "/concords/spare") return { page: "concords-spare" };
  if (appPath === "/players") return { page: "players" };
  if (appPath === "/character") return { page: "character" };

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
  if (route.page === "players") return withBase("/players");
  if (route.page === "character") return withBase("/character");
  if (route.page === "concord-detail" && route.concordId) {
    if (route.detailTab === "costumes") return withBase(`/concords/${route.concordId}/costumes`);
    return withBase(`/concords/${route.concordId}`);
  }
  return withBase("/");
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
  const storedCharacter = getStoredCharacter();
  const [route, setRoute] = useState(() => getRouteFromPath(window.location.pathname));
  const [character, setCharacter] = useState(() => storedCharacter);
  const [allCharacters, setAllCharacters] = useState([]);
  const [onboardingStep, setOnboardingStep] = useState(0);
  const [onboardingError, setOnboardingError] = useState("");
  const [onboardingForm, setOnboardingForm] = useState({
    realName: "",
    birthDate: "",
    botTrap: "",
    stats: INITIAL_STATS
  });
  const audioContextRef = useRef(null);
  const lastHoverRef = useRef({ concordId: "", time: 0 });
  const ominousHumRef = useRef(null);
  const detailHumRef = useRef(null);

  useEffect(() => {
    const onPopState = () => setRoute(getRouteFromPath(window.location.pathname));
    window.addEventListener("popstate", onPopState);
    return () => window.removeEventListener("popstate", onPopState);
  }, []);

  useEffect(() => {
    let cancelled = false;

    async function hydrateRoster() {
      try {
        const roster = await fetchAllCharacters();
        if (!cancelled) {
          setAllCharacters(roster);
        }
      } catch (error) {
        console.error("Failed to load characters from Supabase.", error);
      }
    }

    void hydrateRoster();
    return () => {
      cancelled = true;
    };
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
  const zodiacSign = useMemo(() => getZodiacSign(onboardingForm.birthDate), [onboardingForm.birthDate]);
  const matchedGuestName = useMemo(() => findGuestNameMatch(onboardingForm.realName), [onboardingForm.realName]);
  const teamCounts = useMemo(() => getTeamCounts(allCharacters), [allCharacters]);
  const assignedConcordId = zodiacSign ? assignTeamForSign(zodiacSign, teamCounts) : null;
  const assignedConcordLabel = assignedConcordId ? (TEAM_BLUEPRINT[assignedConcordId]?.concordName ?? CONCORDS_BY_ID.get(assignedConcordId)?.label ?? null) : null;
  const assignedConcordCard = useMemo(() => {
    if (!assignedConcordId) return null;
    return ALL_CONCORD_CARDS.find((card) => card.routeId === assignedConcordId) ?? null;
  }, [assignedConcordId]);
  const assignedClass = useMemo(() => getAssignedClass(onboardingForm.stats), [onboardingForm.stats]);
  const remainingStatPoints = STAT_POINT_POOL - Object.values(onboardingForm.stats).reduce((total, value) => total + value, 0);
  const canAccessStory = Boolean(character);

  const navigate = (nextRoute) => (event) => {
    event.preventDefault();
    const nextPath = getPathFromRoute(nextRoute);
    if (window.location.pathname !== nextPath) {
      window.history.pushState({}, "", nextPath);
    }
    setRoute(nextRoute);
  };

  const handleOnboardingBack = () => {
    setOnboardingError("");
    setOnboardingStep((step) => Math.max(1, step - 1));
  };

  const handleAdjustStat = (statKey, direction) => {
    setOnboardingForm((current) => {
      const currentValue = current.stats[statKey];
      const nextValue = currentValue + direction;
      if (nextValue < 0 || nextValue > 10) return current;
      const total = Object.values(current.stats).reduce((sum, value) => sum + value, 0);
      if (direction > 0 && total >= STAT_POINT_POOL) return current;

      return {
        ...current,
        stats: {
          ...current.stats,
          [statKey]: nextValue
        }
      };
    });
  };

  const handleOnboardingNext = async () => {
    setOnboardingError("");

    if (onboardingStep === 1) {
      const matchedName = findGuestNameMatch(onboardingForm.realName);
      const normalized = normalizeName(matchedName ?? onboardingForm.realName);
      if (onboardingForm.botTrap.trim()) {
        setOnboardingError("Unable to proceed.");
        return;
      }
      if (normalized.length < 3) {
        setOnboardingError("Please enter your real name.");
        return;
      }
      if (!matchedName) {
        setOnboardingError("Name not recognized in RSVP list.");
        return;
      }
      const localDuplicate = allCharacters.some((entry) => normalizeName(entry.realName) === normalized);
      if (localDuplicate) {
        setOnboardingError("A character already exists for that name.");
        return;
      }
      setOnboardingForm((current) => ({ ...current, realName: matchedName }));
      setOnboardingStep(2);
      return;
    }

    if (onboardingStep === 2) {
      if (!zodiacSign || !assignedConcordId) {
        setOnboardingError("Please enter a valid birth date.");
        return;
      }
      setOnboardingStep(3);
      return;
    }

    if (onboardingStep === 3) {
      setOnboardingStep(4);
      return;
    }

    if (onboardingStep === 4) {
      if (remainingStatPoints > 0) {
        setOnboardingError("Spend all stat points before continuing.");
        return;
      }
      if (!zodiacSign) {
        setOnboardingError("Missing zodiac sign.");
        return;
      }

      let latestCharacters;
      try {
        latestCharacters = await fetchAllCharacters();
      } catch {
        setOnboardingError("Unable to reach the roster. Please try again.");
        return;
      }

      const claimed = latestCharacters.some((entry) => normalizeName(entry.realName) === normalizeName(onboardingForm.realName));
      if (claimed) {
        setOnboardingError("A character already exists for that name.");
        return;
      }

      const latestCounts = getTeamCounts(latestCharacters);
      const allocatedConcordId = assignTeamForSign(zodiacSign, latestCounts);
      if (!allocatedConcordId) {
        setOnboardingError("No teams available.");
        return;
      }

      const nextCharacter = {
        realName: (matchedGuestName ?? onboardingForm.realName).trim(),
        birthDate: monthDayToStorageDate(onboardingForm.birthDate),
        zodiacSign,
        concordId: allocatedConcordId,
        className: assignedClass,
        stats: onboardingForm.stats,
        completedAt: new Date().toISOString()
      };

      try {
        await createCharacter(nextCharacter);
      } catch (error) {
        const duplicateCheck = await findCharacterByNormalizedName(normalizeName(onboardingForm.realName)).catch(() => null);
        if (duplicateCheck) {
          setOnboardingError("A character already exists for that name.");
          return;
        }
        setOnboardingError("Unable to save your character. Please try again.");
        return;
      }

      const updatedCharacters = await fetchAllCharacters().catch(() => latestCharacters);
      const createdCharacter = updatedCharacters.find((entry) => normalizeName(entry.realName) === normalizeName(nextCharacter.realName)) ?? nextCharacter;
      setCharacter(createdCharacter);
      setStoredCharacter(createdCharacter);
      setAllCharacters(updatedCharacters);
      setOnboardingStep(0);
      const nextPath = getPathFromRoute({ page: "home" });
      if (window.location.pathname !== nextPath) {
        window.history.pushState({}, "", nextPath);
      }
      setRoute({ page: "home" });
    }
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

  const startDetailConcordHum = (concordId) => {
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

    const frequency = CONCORD_NOTES_BY_ID[concordId] ?? 196.0;
    const active = detailHumRef.current;
    if (active && active.concordId === concordId) return;

    if (active) {
      const now = audioContext.currentTime;
      active.gain.gain.cancelScheduledValues(now);
      active.gain.gain.setValueAtTime(Math.max(active.gain.gain.value, 0.0001), now);
      active.gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.5);
      active.oscA.stop(now + 0.52);
      active.oscB.stop(now + 0.52);
      active.oscC.stop(now + 0.52);
      setTimeout(() => {
        active.oscA.disconnect();
        active.oscB.disconnect();
        active.oscC.disconnect();
        active.lowpass.disconnect();
        active.gain.disconnect();
      }, 600);
    }

    const now = audioContext.currentTime;
    const gain = audioContext.createGain();
    const lowpass = audioContext.createBiquadFilter();
    const oscA = audioContext.createOscillator();
    const oscB = audioContext.createOscillator();
    const oscC = audioContext.createOscillator();

    lowpass.type = "lowpass";
    lowpass.frequency.setValueAtTime(620, now);
    lowpass.Q.value = 1.1;

    oscA.type = "triangle";
    oscB.type = "sine";
    oscC.type = "sine";
    oscA.frequency.setValueAtTime(frequency, now);
    oscB.frequency.setValueAtTime(frequency * 0.5, now);
    oscC.frequency.setValueAtTime(frequency * 1.5, now);

    gain.gain.setValueAtTime(0.0001, now);
    gain.gain.exponentialRampToValueAtTime(0.055, now + 0.8);

    oscA.connect(lowpass);
    oscB.connect(lowpass);
    oscC.connect(lowpass);
    lowpass.connect(gain);
    gain.connect(audioContext.destination);

    oscA.start(now);
    oscB.start(now);
    oscC.start(now);

    detailHumRef.current = { concordId, gain, lowpass, oscA, oscB, oscC };
  };

  const stopDetailConcordHum = () => {
    const active = detailHumRef.current;
    if (!active || !audioContextRef.current) return;

    const now = audioContextRef.current.currentTime;
    active.gain.gain.cancelScheduledValues(now);
    active.gain.gain.setValueAtTime(Math.max(active.gain.gain.value, 0.0001), now);
    active.gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.0);

    active.oscA.stop(now + 1.05);
    active.oscB.stop(now + 1.05);
    active.oscC.stop(now + 1.05);
    setTimeout(() => {
      active.oscA.disconnect();
      active.oscB.disconnect();
      active.oscC.disconnect();
      active.lowpass.disconnect();
      active.gain.disconnect();
    }, 1150);

    detailHumRef.current = null;
  };

  const concordsVisible = route.page === "concords" || route.page === "concords-spare" || route.page === "concord-detail";
  const shouldShowOnboardingGate = !canAccessStory && !concordsVisible;
  const canSeeCharacterPage = canAccessStory;

  let pageContent = <HomeRoute onHoverOmenStart={startOminousHum} onHoverOmenEnd={stopOminousHum} deathImageSrc={withAssetBase("/death.png")} />;
  if (shouldShowOnboardingGate && onboardingStep === 0) {
    pageContent = <BeginGate onBegin={() => setOnboardingStep((current) => (current > 0 ? current : 1))} onHoverOmenStart={startOminousHum} onHoverOmenEnd={stopOminousHum} />;
  }
  if (shouldShowOnboardingGate && onboardingStep > 0) {
    pageContent = (
      <OnboardingWizard
        step={onboardingStep}
        form={onboardingForm}
        remainingPoints={remainingStatPoints}
        assignedClass={assignedClass}
        zodiacSign={zodiacSign}
        assignedConcordLabel={assignedConcordLabel}
        assignedConcordCard={assignedConcordCard}
        welcomeName={matchedGuestName ?? onboardingForm.realName}
        error={onboardingError}
        statKeys={STAT_KEYS}
        statLabels={STAT_LABELS}
        onNameChange={(realName) => setOnboardingForm((current) => ({ ...current, realName }))}
        onBotTrapChange={(botTrap) => setOnboardingForm((current) => ({ ...current, botTrap }))}
        onBirthDateChange={(birthDate) => setOnboardingForm((current) => ({ ...current, birthDate: normalizeMonthDayInput(birthDate) }))}
        onAdjustStat={handleAdjustStat}
        onResetStats={() => setOnboardingForm((current) => ({ ...current, stats: INITIAL_STATS }))}
        onBack={handleOnboardingBack}
        onNext={handleOnboardingNext}
        onHoverOmenStart={startOminousHum}
        onHoverOmenEnd={stopOminousHum}
      />
    );
  }
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
        onStartDetailHum={startDetailConcordHum}
        onStopDetailHum={stopDetailConcordHum}
        getPathFromRoute={getPathFromRoute}
        costumeImagesByConcord={COSTUME_IMAGES_BY_CONCORD}
        teamBlueprint={TEAM_BLUEPRINT}
      />
    );
  }
  if (route.page === "players") {
    pageContent = canAccessStory
      ? <PlayersPage characters={allCharacters} teamBlueprint={TEAM_BLUEPRINT} />
      : <BeginGate onBegin={() => setOnboardingStep((current) => (current > 0 ? current : 1))} onHoverOmenStart={startOminousHum} onHoverOmenEnd={stopOminousHum} />;
  }
  if (route.page === "character") {
    pageContent = canSeeCharacterPage
      ? (
        <CharacterPage
          character={character}
          allCharacters={allCharacters}
          concordTeams={CONCORD_TEAMS}
          teamBlueprint={TEAM_BLUEPRINT}
          onSaveRoster={(nextRoster) => {
            void (async () => {
              try {
                const savedRoster = await replaceAllCharacters(nextRoster);
                setAllCharacters(savedRoster);
                if (character) {
                  const updatedSelf = savedRoster.find((entry) => normalizeName(entry.realName) === normalizeName(character.realName));
                  if (updatedSelf) {
                    setCharacter(updatedSelf);
                    setStoredCharacter(updatedSelf);
                  } else {
                    setCharacter(null);
                    clearStoredCharacter();
                  }
                }
              } catch (error) {
                console.error("Failed to save roster.", error);
                window.alert("Unable to save roster right now.");
              }
            })();
          }}
        />
      )
      : <BeginGate onBegin={() => setOnboardingStep((current) => (current > 0 ? current : 1))} onHoverOmenStart={startOminousHum} onHoverOmenEnd={stopOminousHum} />;
  }
  if (route.page === "not-found") {
    pageContent = <NotFoundPage onReturnHome={navigate({ page: "home" })} />;
  }

  const inConcordsSection = concordsVisible;
  const inPlayersSection = route.page === "players";
  const inCharacterSection = route.page === "character";

  return (
    <div className="page-shell" data-page={route.page} data-concord={selectedConcord ? selectedConcord.id : undefined}>
      <header className="top-bar">
        <a href={getPathFromRoute({ page: "home" })} onClick={navigate({ page: "home" })} className="type-logo brand" aria-label="Necropolis home">Necropolis</a>
        <nav className="top-nav" aria-label="Primary">
          <a href={getPathFromRoute({ page: "concords" })} onClick={navigate({ page: "concords" })} className="type-caps top-nav-link" aria-current={inConcordsSection ? "page" : undefined}>Concords</a>
          <a href={getPathFromRoute({ page: "players" })} onClick={navigate({ page: "players" })} className="type-caps top-nav-link" aria-current={inPlayersSection ? "page" : undefined}>Players</a>
          <a href={getPathFromRoute({ page: canAccessStory ? "character" : "home" })} onClick={navigate({ page: canAccessStory ? "character" : "home" })} className="type-caps top-nav-link" aria-current={inCharacterSection ? "page" : undefined}>{canAccessStory ? "Character" : "Sign In"}</a>
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
