// Verifica o modo leve (sem aceleração de hardware) - não faz parte do build.
// uso: node scripts/check-perf.mjs [url]
import { chromium } from "playwright";

const url = process.argv[2] ?? "http://localhost:3000";

/** Headless + swiftshader = exatamente o cenário sem aceleração. */
const browser = await chromium.launch({ args: ["--use-gl=swiftshader"] });

async function run(label, { force, wait = 9000 } = {}) {
  const context = await browser.newContext({
    viewport: { width: 1440, height: 900 },
  });
  if (force) {
    await context.addInitScript(
      `localStorage.setItem("nsantos:perf", "${force}")`,
    );
  }

  const page = await context.newPage();
  const errors = [];
  page.on("pageerror", (e) => errors.push(e.message.slice(0, 400)));
  page.on("console", (m) => {
    if (m.type() === "error") errors.push("console: " + m.text().slice(0, 400));
  });

  await page.goto(url, { waitUntil: "load" });
  await page.waitForTimeout(wait);

  const read = () =>
    page.evaluate(() => ({
      perf: document.documentElement.dataset.perf,
      intro: document.documentElement.dataset.intro,
      canvas: document.querySelectorAll("[data-globe] canvas").length,
      svgGlobe: document.querySelectorAll("[data-globe] svg").length,
      painel:
        document
          .querySelector("[data-perf-panel]")
          ?.textContent?.slice(0, 80) ?? null,
      indicador:
        document.querySelector("[data-perf-indicator]")?.textContent?.trim() ??
        null,
      cursor: Boolean(document.querySelector("[data-custom-cursor]")),
      blur: getComputedStyle(document.body).backdropFilter,
    }));

  console.log(label, await read(), errors.length ? errors.slice(0, 3) : "ok");
  await page.screenshot({ path: `/tmp/perf-${label}-hero.png` });

  // o indicador precisa voltar depois de dispensar o painel
  const close = page.locator("[data-perf-panel] button[aria-label]");
  if (await close.count()) {
    await close.click();
    await page.waitForTimeout(800);
    const pill = page.locator("[data-perf-indicator]");
    console.log(`${label} indicador:`, (await pill.textContent())?.trim());
    await pill.click();
    await page.waitForTimeout(800);
    console.log(
      `${label} reabriu:`,
      (await page.locator("[data-perf-panel]").textContent())?.slice(0, 60),
    );
  }

  await page.evaluate(() =>
    document.getElementById("projetos")?.scrollIntoView(),
  );
  await page.waitForTimeout(1800);
  await page.screenshot({ path: `/tmp/perf-${label}-projetos.png` });

  await context.close();
}

await run("lite");
// na versão completa o globo em software demora: a intro tem teto de 10s
await run("full", { force: "full", wait: 15000 });

await browser.close();
