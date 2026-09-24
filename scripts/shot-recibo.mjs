// Helper para capturar telas do Recibo Livre - não faz parte do build.
// uso: node scripts/shot-recibo.mjs [baseUrl]
import { createRequire } from "node:module";
import { chromium } from "playwright";

// sharp vem junto com o next; não é dependência direta do projeto.
const require = createRequire(import.meta.url);
const sharp = createRequire(require.resolve("next/package.json"))("sharp");

const base = process.argv[2] ?? "http://localhost:3000";
const outDir = "public/projects/recibo-livre";
const shots = [];

async function save(target, name, width) {
  shots.push(
    sharp(await target.screenshot())
      .resize(width)
      .webp({ quality: 82 })
      .toFile(`${outDir}/${name}.webp`),
  );
}

const draft = {
  numero: "0042",
  data: "18/09/2026",
  hora: "14:32",
  itens: [
    {
      id: "a",
      descricao: "Desenvolvimento de landing page",
      quantidade: 1,
      valor: 1800,
    },
    { id: "b", descricao: "Manutenção mensal", quantidade: 2, valor: 350 },
  ],
  observacao: "",
  pagador: {
    nome: "Estúdio Aurora LTDA",
    documento: "12.345.678/0001-90",
    celular: "(22) 99876-5432",
    cidade: "",
  },
  beneficiario: {
    nome: "Natã Santos",
    documento: "123.456.789-09",
    celular: "",
    cidade: "Campos dos Goytacazes - RJ",
  },
  referencias: {
    id: "E0000000020260918",
    documento: "",
    autenticacao: "8F2A.91C4.77D0",
  },
};

const browser = await chromium.launch();

for (const theme of ["dark", "light"]) {
  const ctx = await browser.newContext({
    viewport: { width: 1440, height: 900 },
    deviceScaleFactor: 2,
    colorScheme: theme,
    reducedMotion: "reduce",
  });
  await ctx.addInitScript((d) => {
    localStorage.setItem("recibo-livre:rascunho", JSON.stringify(d));
    const style = document.createElement("style");
    style.textContent =
      "[data-sonner-toaster],nextjs-portal{display:none!important}";
    document.addEventListener("DOMContentLoaded", () =>
      document.head.appendChild(style),
    );
  }, draft);
  const page = await ctx.newPage();

  await page.goto(base, { waitUntil: "networkidle" });
  await page.waitForTimeout(1200);
  await save(page, `landing-${theme}`, 960);

  await page.goto(`${base}/gerar`, { waitUntil: "networkidle" });
  await page.waitForTimeout(1500);
  await save(page, `gerar-${theme}`, 960);

  if (theme === "light") {
    const sheet = page.locator(".receipt-sheet").first().locator("xpath=../..");
    await sheet.scrollIntoViewIfNeeded();
    await page.waitForTimeout(400);
    await save(sheet, "recibo", 560);
  }
  await ctx.close();
}

await browser.close();
await Promise.all(shots);
console.log("ok");
