// Helper de verificação visual da intro — não faz parte do build.
// uso: node scripts/shot-intro.mjs <largura> <altura> [prefixo]
import { chromium } from "playwright";

const [w = 1440, h = 900, prefix = "/tmp/intro"] = process.argv.slice(2);

const browser = await chromium.launch({ args: ["--use-gl=swiftshader"] });
const page = await browser.newPage({
  viewport: { width: Number(w), height: Number(h) },
});
const errors = [];
page.on("pageerror", (e) => errors.push(e.message.slice(0, 250)));
page.on("console", (m) => {
  if (m.type() === "error") errors.push("console: " + m.text().slice(0, 250));
});

await page.goto("http://localhost:3000", { waitUntil: "domcontentloaded" });

const marks = [200, 700, 1400];
let previous = 0;
for (const at of marks) {
  await page.waitForTimeout(at - previous);
  previous = at;
  await page.screenshot({ path: `${prefix}-${at}.png` });
}

await page.keyboard.press("Enter");
await page.waitForTimeout(500);
await page.screenshot({ path: `${prefix}-exit.png` });
await page.waitForTimeout(1400);
await page.screenshot({ path: `${prefix}-done.png` });

console.log("ok", errors.length ? errors.slice(0, 6) : "sem erros");
await browser.close();
