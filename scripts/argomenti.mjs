// Pagina "Argomenti": per ogni argomento, le pagine e i documenti del sito che ne parlano.
// Collega anche le etichette "Argomenti" delle schede servizio all'argomento corrispondente.
// Uso: node scripts/argomenti.mjs (dopo servizi.mjs e novita.mjs, prima di lab.mjs)
import { readFileSync, writeFileSync, readdirSync, existsSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (f) => readFileSync(join(DIR, f), "utf8");
const write = (f, s) => writeFileSync(join(DIR, f), s);
const PAGINA = "scuole-argomenti.html";

// [titolo, descrizione, [[testo del link, indirizzo], ...]]
const ARGOMENTI = [
  ["Iscrizioni", "Come e quando iscriversi ai tre ordini di scuola", [
    ["Iscrizioni: come si presenta la domanda", "servizio-iscrizioni.html"],
    ["Scuola dell'infanzia", "scuola-infanzia.html"],
    ["Scuola primaria", "scuola-primaria.html"],
    ["Scuola secondaria di I grado", "scuola-secondaria.html"],
  ]],
  ["Orari", "Tempo scuola, pre e post scuola, apertura della segreteria", [
    ["Tempo scuola della scuola dell'infanzia", "scuola-infanzia.html"],
    ["Tempo scuola della scuola primaria", "scuola-primaria.html"],
    ["Tempo scuola della scuola secondaria di I grado", "scuola-secondaria.html"],
    ["Pre-scuola e post-scuola", "servizio-pre-post-scuola.html"],
    ["Orari della segreteria", "servizio-segreteria.html"],
  ]],
  ["Alimentazione", "La mensa scolastica e le diete speciali", [
    ["Mensa scolastica", "servizio-mensa.html"],
  ]],
  ["Trasporti", "Scuolabus comunale e trasporto pubblico", [
    ["Trasporto scolastico", "servizio-trasporto.html"],
  ]],
  ["Pagamenti", "Versamenti alla scuola e servizi a pagamento del Comune", [
    ["Pagamenti con PagoPA", "servizio-pagamenti.html"],
    ["Mensa scolastica", "servizio-mensa.html"],
    ["Pre-scuola e post-scuola", "servizio-pre-post-scuola.html"],
  ]],
  ["Digitale", "Registro elettronico, piattaforme e competenze digitali", [
    ["Registro elettronico e piattaforme", "servizio-registro-elettronico.html"],
    ["Classi prime: credenziali per ClasseViva e Google Workspace", "notizia-credenziali-classi-prime.html"],
    ["Registro elettronico e piattaforme per i docenti", "servizio-piattaforme-personale.html"],
  ]],
  ["Benessere", "Ascolto, prevenzione del bullismo, patto tra scuola e famiglia", [
    ["Sportello d'ascolto psicologico", "servizio-sportello-ascolto.html"],
    ["Patto educativo di corresponsabilità (PDF)", "documenti/patto-corresponsabilita.pdf"],
    ["Regolamento d'istituto (PDF)", "documenti/regolamento-istituto.pdf"],
  ]],
  ["Inclusione", "Bisogni educativi speciali e accoglienza degli alunni stranieri", [
    ["Piano annuale per l'inclusione (PDF)", "documenti/piano-annuale-inclusione.pdf"],
    ["Protocollo di accoglienza degli alunni stranieri (PDF)", "documenti/protocollo-accoglienza-alunni-stranieri.pdf"],
    ["Le persone: referente per l'inclusione", "scuole-sezione-persone.html"],
  ]],
  ["Offerta formativa", "Che cosa si impara e come: PTOF, curricolo, progetti", [
    ["La didattica nei tre ordini di scuola", "scuole-didattica.html"],
    ["Piano triennale dell'offerta formativa (PDF)", "documenti/ptof-2025-2028.pdf"],
    ["Curricolo verticale (PDF)", "documenti/curricolo-verticale.pdf"],
    ["Presentazione della scuola e progetti", "scuole-presentazione.html"],
  ]],
  ["Documenti e regolamenti", "Le carte della scuola", [
    ["Le carte della scuola", "scuole-documenti.html"],
    ["Regolamento d'istituto (PDF)", "documenti/regolamento-istituto.pdf"],
    ["Carta dei servizi (PDF)", "documenti/carta-dei-servizi.pdf"],
    ["Rapporto di autovalutazione, sintesi (PDF)", "documenti/rav-sintesi.pdf"],
    ["Piano di miglioramento (PDF)", "documenti/piano-di-miglioramento.pdf"],
  ]],
  ["Segreteria e contatti", "Uffici, persone e sedi dell'Istituto", [
    ["Segreteria", "servizio-segreteria.html"],
    ["Organizzazione", "scuole-scheda-organizzazione.html"],
    ["Le persone", "scuole-sezione-persone.html"],
    ["I luoghi", "scuole-luoghi.html"],
  ]],
  ["Personale", "Servizi per docenti e personale ATA", [
    ["Servizi per il personale scolastico", "servizi-personale.html"],
    ["Segreteria - area personale", "servizio-area-personale.html"],
    ["Registro elettronico e piattaforme per i docenti", "servizio-piattaforme-personale.html"],
  ]],
  ["Lab", "Lezioni su che cosa si può fare con Claude a scuola", [
    ["Tutte le lezioni del Lab", "lab.html"],
    ["Lezione 1: dal modulo alla circolare", "lab-percorso-circolari.html"],
  ]],
];
const slug = (t) => t.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

// Nessun link a pagine che non esistono
for (const [titolo, , link] of ARGOMENTI)
  for (const [, href] of link)
    if (!existsSync(join(DIR, href))) throw new Error(`Argomento "${titolo}": manca ${href}`);

// ---------------------------------------------------------------- pagina Argomenti
{
  let s = read(PAGINA).replace(/<title>[^<]*<\/title>/, "<title>Argomenti - Istituto Comprensivo Homo Sapiens</title>")
    .replace(/(<h1 class="p-0 mb-2">Argomenti<\/h1>\s*<p class="h4 font-weight-normal">)[^<]*(<\/p>)/, "$1Trova le informazioni a partire dall'argomento che ti interessa$2");
  const indice = ARGOMENTI.map(([t, d]) => `
          <div class="col-lg-4 mb-4">
            <div class="card card-bg card-icon rounded h-100">
              <a href="#${slug(t)}">
                <div class="card-body">
                  <svg class="icon svg-marker-simple" aria-hidden="true">
                    <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-bookmark-solid"></use>
                  </svg>
                  <div class="card-icon-content">
                    <p><strong>${t}</strong></p>
                    <small>${d}</small>
                  </div><!-- /card-icon-content -->
                </div><!-- /card-body -->
              </a>
            </div><!-- /card card-bg card-icon rounded -->
          </div>`).join("");
  const dettaglio = ARGOMENTI.map(([t, d, link]) => `
            <div class="col-lg-6 mb-4" id="${slug(t)}">
              <h3 class="h5">${t}</h3>
              <p class="mb-2">${d}.</p>
              <ul>${link.map(([testo, href]) => `
                <li><a href="/${href}"${href.endsWith(".pdf") ? ' target="_blank" rel="noopener"' : ""}>${testo}</a></li>`).join("")}
              </ul>
            </div>`).join("");
  const html = `
      <section class="section bg-white py-5">
        <div class="container">
          <div class="title-section mb-5">
            <h2 class="h4">Tutti gli argomenti</h2>
          </div><!-- /title-large -->
          <div class="row">${indice}
          </div>
        </div><!-- /container -->
      </section><!-- /section -->

      <section class="section bg-gray-light py-5">
        <div class="container">
          <div class="title-section mb-5">
            <h2 class="h4">Pagine e documenti per argomento</h2>
          </div><!-- /title-large -->
          <div class="row variable-gutters">${dettaglio}
          </div>
        </div><!-- /container -->
      </section><!-- /section -->`;
  const h1 = s.indexOf("<h1", s.indexOf("<main"));
  const inizio = s.indexOf("\n", s.indexOf("</section>", h1)) + 1;
  write(PAGINA, s.slice(0, inizio) + html + "\n\n    " + s.slice(s.indexOf("</main>", inizio)));
}

// ---------------------------------------------------------------- etichette "Argomenti" delle schede servizio
const NOMI = new Map(ARGOMENTI.map(([t]) => [t, slug(t)]));
let n = 0;
for (const f of readdirSync(DIR).filter((f) => /^servizio-.*\.html$/.test(f))) {
  const prima = read(f);
  const s = prima.replace(/<span class="(badge badge-sm badge-pill badge-outline-purplelight)">([^<]+)<\/span>/g,
    (m, classi, nome) => (NOMI.has(nome) ? `<a href="/${PAGINA}#${NOMI.get(nome)}" class="${classi}">${nome}</a>` : m));
  if (s !== prima) { write(f, s); n++; }
}
// ---------------------------------------------------------------- "Tag" nella finestra di ricerca di tutte le pagine
const TAG = ARGOMENTI.slice(0, 8).map(([t]) => `
                        <a href="/${PAGINA}#${slug(t)}" class="badge badge-sm badge-pill badge-outline-primary">${t}</a>`).join("") + `
                        <a href="/${PAGINA}" aria-label="Visualizza tutti gli argomenti" title="Visualizza tutti gli argomenti"
                          class="badge badge-sm badge-pill badge-outline-primary">...</a>
                      `;
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html") && f !== "templates.html")) {
  const prima = read(f);
  const s = prima.replace(/(<h3 class="h4">Tag<\/h3>\s*<div class="badges">)[\s\S]*?(<\/div><!-- \/badges -->)/, (m, a, b) => a + TAG + b);
  if (s !== prima) write(f, s);
}
console.log(`Argomenti: ${ARGOMENTI.length} argomenti, etichette collegate in ${n} schede servizio.`);
