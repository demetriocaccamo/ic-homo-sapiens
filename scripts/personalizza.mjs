// Personalizza i template ufficiali Designers Italia (modello Scuole)
// con i dati dell'istituto e collega i menu alle pagine reali.
// Uso: node scripts/personalizza.mjs
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const SCUOLA = {
  tipo: "Istituto Comprensivo",
  nome: "Homo Sapiens",
  get completo() { return `${this.tipo} ${this.nome}`; },
};

const DIR = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");

// Voci di menu -> pagine. "Panoramica" compare una volta per sezione, in quest'ordine.
const PANORAMICHE = ["scuole-la-scuola.html", "scuole-sezione-servizi.html", "scuole-sezione-notizie.html", "scuole-didattica.html"];
const MENU = {
  "Presentazione": "scuole-presentazione.html",
  "I luoghi": "scuole-luoghi.html",
  "Le carte della scuola": "scuole-documenti.html",
  "Organizzazione": "scuole-scheda-organizzazione.html",
  "Le persone": "scuole-sezione-persone.html",
  "I numeri della scuola": "scuole-pagina-singola.html",
  "La storia": "scuole-pagina-singola.html",
  "Personale scolastico": "scuole-servizio-tipologia.html",
  "Famiglie e studenti": "scuole-servizio-tipologia.html",
  "Percorsi di studio": "scuole-servizio-generico.html",
  "Le notizie": "scuole-sezione-notizie.html",
  "Le circolari": "scuole-news-circolare.html",
  "Calendario eventi": "scuole-archivio-eventi.html",
  "Albo online": "scuole-documenti.html",
  "Offerta formativa": "scuole-didattica.html",
  "Le schede didattiche": "scuole-scheda-didattica.html",
  "I progetti delle classi": "scuole-scheda-progetto.html",
};

function personalizza(html) {
  // Blocchi logo (header, header mobile, footer)
  html = html.replace(
    /<span>Liceo Scientifico Statale<\/span>\s*<span><strong>Federigo Enriques<\/strong><\/span>\s*<span>Livorno<\/span>/g,
    `<span>${SCUOLA.tipo}</span>\n                  <span><strong>${SCUOLA.nome}</strong></span>`
  );
  // Titolo hero della home
  html = html.replace(
    /<span class="d-line d-xl-block">Liceo Scientifico<\/span> Federigo Enriques/g,
    `<span class="d-line d-xl-block">${SCUOLA.tipo}</span> ${SCUOLA.nome}`
  );
  // Varianti testuali del nome segnaposto
  html = html
    .replace(/Liceo Scientifico Statale Federigo Enriques Livorno/g, SCUOLA.completo)
    .replace(/Liceo Scientifico (Statale )?Feder(?:ig|ic)o Enriques/g, SCUOLA.completo)
    .replace(/Istituto Federigo Enriques/g, SCUOLA.completo)
    .replace(/Liceo "Federigo Enriques"/g, `${SCUOLA.tipo} "${SCUOLA.nome}"`)
    .replace(/Scuola primaria Federigo Enriques/g, `Scuola primaria ${SCUOLA.nome}`)
    .replace(/Feder(?:ig|ic)o Enriques/g, SCUOLA.nome)
    .replace(/Liceo Scientifico <strong>Federigo\s+Enriques<\/strong>/g, `${SCUOLA.tipo} <strong>${SCUOLA.nome}</strong>`)
    .replace(/Liceo Scientifico <strong>/g, `${SCUOLA.tipo} <strong>`)
    .replace(/(dal|del) liceo scientifico Enriques/g, (m, a) => `${a}l'${SCUOLA.tipo} ${SCUOLA.nome}`)
    .replace(/Istituto Comprensivo\s+Padre Semeria/g, SCUOLA.completo)
    .replace(/(dal|del) l'Istituto/g, "$1l'Istituto")
    .replace(/Orario Completo Liceo Scientifico/g, "Orario completo")
    .replace(/<span class="d-line d-xl-block text-redbrown">Livorno<\/span>/g, "")
    .replace(/Istituto Giorgio La Pira/g, "Benvenuti")
    .replace(/Liceo Scientifico Statale/g, SCUOLA.tipo);

  // Logo -> home
  html = html.replace(/<a href="#" class="d-inline-flex" aria-label="home/g, '<a href="/" class="d-inline-flex" aria-label="home');

  // Menu principale, menu mobile e footer
  let p = 0;
  html = html.replace(/<a ([^>]*?)href="#"([^>]*)>([^<]+)<\/a>/g, (m, pre, post, label) => {
    const t = label.trim();
    const dest = t === "Panoramica" ? PANORAMICHE[p++ % PANORAMICHE.length]
      : t === "Vai alla presentazione della scuola" ? "scuole-presentazione.html"
      : MENU[t];
    return dest ? `<a ${pre}href="/${dest}"${post}>${label}</a>` : m;
  });

  html = html.replace(/scuole-home\.html/g, "index.html");
  return html;
}

let n = 0;
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html"))) {
  const path = join(DIR, f);
  const before = readFileSync(path, "utf8");
  const after = personalizza(before);
  if (after !== before) { writeFileSync(path, after); n++; }
}
console.log(`Personalizzati ${n} file per "${SCUOLA.completo}".`);
