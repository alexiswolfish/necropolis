// Renders each business card as a composite PNG using the downloaded assets.
// Figma canvas: 2654 × 4394px. We render at 600px wide (≈22.6% scale).
import puppeteer from "puppeteer";
import { writeFile, mkdir } from "fs/promises";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ASSETS = `file://${path.join(__dirname, "../public/cards")}`;
const OUT = path.join(__dirname, "../public/cards");

// Scale factor: render at 600px wide
const S = 600 / 2654;
const W = 600;
const H = Math.round(4394 * S); // 993px

const FONT = "SpinosaBTW01-Regular";

// Each card: HTML body that replicates the Figma composition
const cards = [
  {
    name: "card-back",
    html: `
      <img src="${ASSETS}/card-back-inner.png" style="position:absolute;left:${325*S}px;top:${245*S}px;width:${2029*S}px;height:${3773*S}px;object-fit:cover;">
      <img src="${ASSETS}/card-back-frame.png" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${2244*S}px;height:${3910*S}px;object-fit:cover;">
    `,
  },
  {
    name: "card-1",
    html: `
      <img src="${ASSETS}/card-frame.png" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${2244*S}px;height:${3910*S}px;">
      <img src="${ASSETS}/card-1-weapon.png" style="position:absolute;left:${(1327-769)*S}px;top:${894*S}px;width:${1538*S}px;height:${2418*S}px;object-fit:cover;">
      <span style="position:absolute;left:${390*S}px;top:${160*S}px;font-size:${541*S}px;color:white;line-height:1;">1</span>
      <span style="position:absolute;right:${(2654-2020-200)*S}px;bottom:${(4394-3397-541)*S}px;font-size:${541*S}px;color:white;line-height:1;transform:rotate(180deg);">1</span>
    `,
  },
  {
    name: "card-2",
    html: `
      <img src="${ASSETS}/card-frame.png" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${2244*S}px;height:${3910*S}px;">
      <img src="${ASSETS}/card-2-weapon.png" style="position:absolute;left:${500*S}px;top:${853*S}px;width:${795*S}px;height:${2648*S}px;object-fit:cover;">
      <img src="${ASSETS}/card-2-weapon.png" style="position:absolute;left:${1360*S}px;top:${853*S}px;width:${795*S}px;height:${2648*S}px;object-fit:cover;transform:rotate(180deg);">
      <span style="position:absolute;left:${370*S}px;top:${160*S}px;font-size:${541*S}px;color:white;line-height:1;">2</span>
      <span style="position:absolute;right:${(2654-1963-200)*S}px;bottom:${(4394-3397-541)*S}px;font-size:${541*S}px;color:white;line-height:1;transform:rotate(180deg);">2</span>
    `,
  },
  {
    name: "card-3",
    html: `
      <img src="${ASSETS}/card-frame.png" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${2244*S}px;height:${3910*S}px;">
      <img src="${ASSETS}/card-3-c.png" style="position:absolute;left:${370*S}px;top:${779*S}px;width:${790*S}px;height:${2744*S}px;object-fit:cover;transform:rotate(180deg);">
      <img src="${ASSETS}/card-3-a.png" style="position:absolute;left:${(967-409)*S}px;top:${779*S}px;width:${818*S}px;height:${3145*S}px;object-fit:cover;transform:rotate(180deg);">
      <img src="${ASSETS}/card-3-b.png" style="position:absolute;left:${1749*S}px;top:${431*S}px;width:${448*S}px;height:${3033*S}px;object-fit:cover;transform:scaleY(-1);">
      <span style="position:absolute;left:${370*S}px;top:${160*S}px;font-size:${541*S}px;color:white;line-height:1;">3</span>
      <span style="position:absolute;right:${(2654-1974-200)*S}px;bottom:${(4394-3397-541)*S}px;font-size:${541*S}px;color:white;line-height:1;transform:rotate(180deg);">3</span>
    `,
  },
  {
    name: "card-4",
    html: `
      <img src="${ASSETS}/card-4-weapon.png" style="position:absolute;left:${266*S}px;top:${858*S}px;width:${1033*S}px;height:${1271*S}px;object-fit:cover;">
      <img src="${ASSETS}/card-4-weapon.png" style="position:absolute;left:${1355*S}px;top:${858*S}px;width:${1033*S}px;height:${1271*S}px;object-fit:cover;">
      <img src="${ASSETS}/card-4-weapon.png" style="position:absolute;left:${266*S}px;top:${2222*S}px;width:${1033*S}px;height:${1271*S}px;object-fit:cover;transform:rotate(180deg);">
      <img src="${ASSETS}/card-4-weapon.png" style="position:absolute;left:${1351*S}px;top:${2225*S}px;width:${1033*S}px;height:${1271*S}px;object-fit:cover;transform:scaleY(-1);">
      <img src="${ASSETS}/card-frame.png" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${2244*S}px;height:${3910*S}px;">
      <span style="position:absolute;left:${370*S}px;top:${160*S}px;font-size:${541*S}px;color:white;line-height:1;">4</span>
      <span style="position:absolute;right:${(2654-1983-200)*S}px;bottom:${(4394-3397-541)*S}px;font-size:${541*S}px;color:white;line-height:1;transform:rotate(180deg);">4</span>
    `,
  },
  {
    name: "card-5",
    html: `
      <img src="${ASSETS}/card-frame.png" style="position:absolute;left:50%;top:50%;transform:translate(-50%,-50%);width:${2244*S}px;height:${3910*S}px;">
      <img src="${ASSETS}/card-5-weapon.png" style="position:absolute;left:${902*S}px;top:${392*S}px;width:${455*S}px;height:${1172*S}px;object-fit:cover;transform-origin:center;transform:rotate(20.92deg);">
      <img src="${ASSETS}/card-5-weapon.png" style="position:absolute;left:${1350*S}px;top:${1128*S}px;width:${455*S}px;height:${1172*S}px;object-fit:cover;transform-origin:center;transform:rotate(-124.76deg);">
      <img src="${ASSETS}/card-5-weapon.png" style="position:absolute;left:${246*S}px;top:${1688*S}px;width:${455*S}px;height:${1172*S}px;object-fit:cover;transform-origin:center;transform:scaleY(-1) rotate(-74.13deg);">
      <img src="${ASSETS}/card-5-weapon.png" style="position:absolute;left:${1049*S}px;top:${2298*S}px;width:${455*S}px;height:${1172*S}px;object-fit:cover;transform-origin:center;transform:scaleY(-1) rotate(-112.84deg);">
      <img src="${ASSETS}/card-5-weapon.png" style="position:absolute;left:${488*S}px;top:${2686*S}px;width:${455*S}px;height:${1172*S}px;object-fit:cover;transform-origin:center;transform:rotate(-26.38deg);">
      <span style="position:absolute;left:${370*S}px;top:${160*S}px;font-size:${541*S}px;color:white;line-height:1;">5</span>
      <span style="position:absolute;right:${(2654-1974-200)*S}px;bottom:${(4394-3397-541)*S}px;font-size:${541*S}px;color:white;line-height:1;transform:rotate(180deg);">5</span>
    `,
  },
];

const browser = await puppeteer.launch();
const page = await browser.newPage();
await page.setViewport({ width: W, height: H, deviceScaleFactor: 2 });

for (const card of cards) {
  await page.setContent(`<!DOCTYPE html>
<html><head><style>
  @font-face { font-family: "${FONT}"; src: url("file://${path.join(__dirname, "../public/fonts/SpinosaBTW01-Regular.ttf")}"); }
  * { margin:0; padding:0; box-sizing:border-box; }
  body { width:${W}px; height:${H}px; background:#111314; position:relative; overflow:hidden;
         font-family:"${FONT}", serif; }
  span { font-family:"${FONT}", serif; display:block; }
</style></head><body>${card.html}</body></html>`, { waitUntil: "load", timeout: 60000 });
  // Give images a moment to fully paint
  await new Promise(r => setTimeout(r, 500));

  const filepath = path.join(OUT, `${card.name}.png`);
  await page.screenshot({ path: filepath });
  console.log(`✓ ${card.name}.png`);
}

await browser.close();
console.log(`\nDone → ${OUT}`);
