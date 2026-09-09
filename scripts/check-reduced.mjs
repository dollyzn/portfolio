// Verifica o comportamento com prefers-reduced-motion - não faz parte do build.
// uso: node scripts/check-reduced.mjs
import { chromium } from "playwright";

const browser = await chromium.launch({ args: ["--use-gl=swiftshader"] });
const page = await browser.newPage({
  viewport: { width: 1440, height: 900 },
  reducedMotion: "reduce",
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 6000)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text().slice(0, 6000));
});

await page.goto("http://localhost:3000", { waitUntil: "networkidle" });
await page.waitForTimeout(1500);

const state = await page.evaluate(() => ({
  intro: document.documentElement.dataset.intro,
  overlay: Boolean(document.querySelector('[role="dialog"]')),
  heroVisivel: Boolean(
    document.getElementById("top")?.getBoundingClientRect().height,
  ),
  conteudoOpacidade: getComputedStyle(document.getElementById("conteudo"))
    .opacity,
}));

console.log(state);
await page.screenshot({ path: "/tmp/reduced.png" });
console.log(errors.length ? errors.slice(0, 5) : "sem erros");
await browser.close();
