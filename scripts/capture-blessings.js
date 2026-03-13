import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import path from "path";

const OUTPUT_DIR = path.join(process.env.HOME, "Pictures/murder-mystery-iii/blessings/generated");
const URL = "http://localhost:5174/necropolis/blessings";

// Optional: pass a card ID as argument to capture only one card
// e.g. node scripts/capture-blessings.js blessing-grace
const filterById = process.argv[2] ?? null;

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 4 });
await page.goto(URL, { waitUntil: "networkidle0" });

await mkdir(OUTPUT_DIR, { recursive: true });

const cards = await page.$$(".blessing-card[data-card-id]");

for (let i = 0; i < cards.length; i++) {
  const cardId = await cards[i].evaluate((el) => el.getAttribute("data-card-id"));
  if (filterById && cardId !== filterById) continue;
  const filename = `${String(i + 1).padStart(2, "0")}-${cardId}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);
  await cards[i].screenshot({ path: filepath });
  console.log(`✓ ${filename}`);
}

await browser.close();
console.log(`\nDone → ${OUTPUT_DIR}`);
