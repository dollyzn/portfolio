// Verifica jank de carregamento e interação do globo - não faz parte do build.
// uso: node scripts/check-globe.mjs
import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--use-gl=swiftshader"] });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  hasTouch: true,
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 300)));
page.on("console", (m) => {
  if (m.type() === "error" || m.type() === "warning")
    errors.push(`${m.type()}: ${m.text().slice(0, 300)}`);
});

// mede tarefas longas desde o começo do carregamento
await page.addInitScript(() => {
  window.__long = [];
  new PerformanceObserver((list) => {
    for (const entry of list.getEntries())
      window.__long.push(Math.round(entry.duration));
  }).observe({ entryTypes: ["longtask"] });
});

await page.goto("http://localhost:3000", { waitUntil: "load" });
await page.waitForSelector("canvas", { timeout: 10000 });
await page.waitForTimeout(2500);

const info = await page.evaluate(() => {
  const canvas = document.querySelector("canvas");
  return {
    picoDeBloqueio: Math.max(...window.__long, 0),
    acimaDe200ms: window.__long.filter((d) => d > 200),
    touchAction: getComputedStyle(canvas).touchAction,
    canvas: `${canvas.clientWidth}x${canvas.clientHeight}`,
  };
});

// arrasto horizontal precisa girar mais do que a rotação automática
const box = await page.locator("canvas").boundingBox();
const cx = box.x + box.width / 2;
const cy = box.y + box.height / 2;

const antes = await page.locator("canvas").screenshot();
await page.mouse.move(cx, cy);
await page.mouse.down();
for (let i = 1; i <= 12; i++) await page.mouse.move(cx + i * 14, cy);
await page.mouse.up();
await page.waitForTimeout(700);
const depois = await page.locator("canvas").screenshot();

console.log(info);
console.log("arrasto mudou a imagem:", !antes.equals(depois));

const mobile = await browser.newPage({
  viewport: { width: 390, height: 844 },
  hasTouch: true,
  isMobile: true,
  reducedMotion: "reduce",
});
await mobile.goto("http://localhost:3000", { waitUntil: "load" });
await mobile.waitForSelector("canvas", { timeout: 10000 });
await mobile.waitForTimeout(2200);

const touchInfo = await mobile.evaluate(() => {
  const canvas = document.querySelector("canvas");
  return getComputedStyle(canvas).touchAction;
});

const mbox = await mobile.locator("canvas").boundingBox();
const beforeTouch = await mobile.locator("canvas").screenshot();
await mobile.mouse.move(mbox.x + 48, mbox.y + mbox.height / 2);
await mobile.mouse.down();
await mobile.mouse.move(mbox.x + mbox.width - 48, mbox.y + mbox.height / 2, {
  steps: 14,
});
await mobile.mouse.up();
await mobile.waitForTimeout(400);
const afterTouch = await mobile.locator("canvas").screenshot();

console.log("touch-action mobile:", touchInfo);
console.log("toque mudou a imagem:", !beforeTouch.equals(afterTouch));
console.log(errors.length ? errors.slice(0, 8) : "sem erros/warnings");
await browser.close();
