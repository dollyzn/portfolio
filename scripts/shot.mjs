// Helper de verificação visual - não faz parte do build.
// uso: node scripts/shot.mjs <largura> <altura> <scrollY> <saida> [reduced]
import { chromium } from "playwright";

const [w = 1440, h = 900, y = 0, out = "/tmp/shot.png", mode] =
  process.argv.slice(2);

const browser = await chromium.launch({ args: ["--use-gl=swiftshader"] });
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
  // por padrão pula a intro (reduced-motion); passe "motion" pra testar com ela
  reducedMotion: mode === "motion" ? "no-preference" : "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 200)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text().slice(0, 200));
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.evaluate(async (target) => {
  for (let v = 0; v <= target; v += 400) {
    window.scrollTo(0, v);
    await new Promise((r) => setTimeout(r, 90));
  }
  window.scrollTo(0, target);
}, Number(y));
await page.waitForTimeout(2200);
await page.screenshot({ path: out });
console.log("ok", out, errors.length ? errors.slice(0, 5) : "sem erros");
await browser.close();
