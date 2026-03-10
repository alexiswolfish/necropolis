import puppeteer from "puppeteer";
import { mkdir } from "fs/promises";
import path from "path";

const OUTPUT_DIR = path.join(process.env.HOME, "Pictures/murder-mystery-iii/curses/generated");
const URL = "http://localhost:5174/necropolis/curses";

const browser = await puppeteer.launch();
const page = await browser.newPage();

await page.setViewport({ width: 1600, height: 900, deviceScaleFactor: 2 });
await page.goto(URL, { waitUntil: "networkidle0" });

await mkdir(OUTPUT_DIR, { recursive: true });

const cards = await page.$$(".curse-card");
const ids = await page.evaluate(() =>
  Array.from(document.querySelectorAll("[class^='curse-card-wrap'], .curse-card-wrap")).map((wrap) => {
    const btn = wrap.querySelector(".curse-card-dl-btn");
    // Extract id from the download filename via onclick — fallback to header text
    const header = wrap.querySelector(".curse-card-header")?.textContent ?? "card";
    return header.toLowerCase().replace(/[^\w]+/g, "-").replace(/^-|-$/g, "");
  })
);

for (let i = 0; i < cards.length; i++) {
  const filename = `${String(i + 1).padStart(2, "0")}-${ids[i]}.png`;
  const filepath = path.join(OUTPUT_DIR, filename);
  await cards[i].screenshot({ path: filepath });
  console.log(`✓ ${filename}`);
}

await browser.close();
console.log(`\nSaved ${cards.length} cards to ${OUTPUT_DIR}`);
