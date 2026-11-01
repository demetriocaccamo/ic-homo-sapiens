// Vercel Web Analytics per un sito HTML statico: lo script va inserito in ogni pagina
// (https://vercel.com/docs/analytics/quickstart, sezione HTML). Le statistiche vanno attivate
// anche nel progetto su Vercel, scheda Analytics.
// Uso: node scripts/analytics.mjs (per ultimo, dopo gli altri script)
import { readFileSync, writeFileSync, readdirSync, statSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const SNIPPET = `<!-- Vercel Web Analytics -->
<script>
  window.va = window.va || function () { (window.vaq = window.vaq || []).push(arguments); };
</script>
<script defer src="/_vercel/insights/script.js"></script>
`;

const pagine = (dir) => readdirSync(dir).flatMap((f) => {
  const p = join(dir, f);
  if (statSync(p).isDirectory()) return f === "assets" ? [] : pagine(p); // assets: librerie, non pagine del sito
  return f.endsWith(".html") && f !== "templates.html" ? [p] : [];
});

let n = 0;
for (const p of pagine(DIR)) {
  const s = readFileSync(p, "utf8");
  if (s.includes("/_vercel/insights/script.js") || !s.includes("</head>")) continue;
  writeFileSync(p, s.replace("</head>", () => SNIPPET + "</head>"));
  n++;
}
console.log(`Vercel Web Analytics: script aggiunto in ${n} pagine.`);
