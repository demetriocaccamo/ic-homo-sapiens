// Sezione "Lab": lezioni inserite nel layout del sito.
// - lab.html: elenco delle lezioni
// - una pagina per lezione, a partire dai file in lezioni/<cartella>/ (intestazione e footer sono quelli del sito)
// - barra in alto: la voce "Lab" sostituisce "Argomento 1, 2, 3"; resta "Tutti gli argomenti"
// Uso: node scripts/lab.mjs (per ultimo, dopo gli altri script)
import { readFileSync, writeFileSync, readdirSync, cpSync, mkdirSync } from "node:fs";
import { join } from "node:path";

const RADICE = new URL("../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const DIR = join(RADICE, "public");
const read = (f) => readFileSync(join(DIR, f), "utf8");
const write = (f, s) => { mkdirSync(join(DIR, f, ".."), { recursive: true }); writeFileSync(join(DIR, f), s); };

// L'ordine dell'elenco è quello della pagina Lab (Lezione 1, 2, ...)
const LEZIONI = [
  {
    tipo: "presentazione",
    cartella: "ufficio-virtuale-ds",
    sorgente: "Ufficio_virtuale_del_DS.html",
    pagina: "lab-ufficio-virtuale-ds.html",
    titolo: "L'ufficio virtuale del DS",
    etichetta: "Corso di formazione per dirigenti scolastici",
    descrizione: "Usare l'intelligenza artificiale come metodo di lavoro, non come gadget: Progetti, skill, artefatti e connettori di Claude organizzati come i reparti di un ufficio. La presentazione del corso, con sei video dimostrativi.",
    video: [
      ["Video_D07_Progetti.mp4", "Un Progetto dall'interno", "Il reparto Corrispondenza e atti: istruzioni, documenti di riferimento e conversazioni raccolti in un unico spazio di lavoro che resta nel tempo."],
      ["Video_D09_Skill.mp4", "Una skill per la delibera", "La skill delibera-organi-collegiali trasforma gli appunti di una seduta nel testo della delibera, secondo il format della scuola."],
      ["Video_D11_Artefatti.mp4", "Una circolare come documento", "Un artefatto: la circolare prende forma accanto alla conversazione, pronta da rivedere, correggere e scaricare."],
      ["Video_D14_Corrispondenza.mp4", "La risposta al genitore", "Un genitore lamenta il poco preavviso di un'uscita didattica: la bozza di risposta è cortese ma ferma, nel tono della scuola e senza dati personali."],
      ["Video_D16_Documenti_strategici.mp4", "Il controllo di coerenza", "Priorità e traguardi del RAV confrontati con il Piano di miglioramento e il PTOF, con la tabella dei collegamenti e le corrispondenze che mancano."],
      ["Video_D18_Sito_web.mp4", "Dalla direttiva al sito", "Il sito dell'IC Homo Sapiens si aggiorna descrivendo in italiano che cosa cambiare, un'area alla volta."],
    ],
  },
  {
    cartella: "percorso-circolari",
    sorgente: "percorso-circolari.html",
    pagina: "lab-percorso-circolari.html",
    titolo: "Dal modulo alla circolare",
    etichetta: "Percorso Circolari per il dirigente",
    descrizione: "Il dirigente compila un breve modulo con i dati della circolare. Claude restituisce il testo già su carta intestata, scritto in un italiano chiaro e con in evidenza i dati che mancano.",
  },
];

// Il CSS del sito aggiunge un elemento invisibile (:target::before) alla sezione raggiunta da un link interno,
// per compensare l'intestazione fissa. Nelle griglie delle lezioni quell'elemento occupa una colonna e
// restringe il contenuto: lo si toglie e si compensa l'intestazione con scroll-margin-top.
const CORREZIONI = `<style>
main [id]:target::before{content:none;display:none}
main [id]{scroll-margin-top:130px}
</style>`;

// ---------------------------------------------------------------- pagine delle lezioni
const guscio = read("scuole-pagina-singola.html");
for (const [n, l] of LEZIONI.entries()) {
  if (l.tipo === "presentazione") { paginaPresentazione(n, l); continue; }
  const src = readFileSync(join(RADICE, "lezioni", l.cartella, l.sorgente), "utf8");
  const stile = src.match(/<style>[\s\S]*?<\/style>/)[0];
  const descr = (src.match(/<meta name="description" content="([^"]*)"/) || [, l.descrizione])[1];
  const avviso = (src.match(/<div class="demo-strip"[\s\S]*?<\/div><\/div>/) || [""])[0];
  const materiali = `/lab/${l.cartella}/materiali/`;
  let main = src.match(/<main[\s\S]*<\/main>/)[0]
    .replaceAll("https://ichomosapiens.vercel.app/", "/")
    .replaceAll('href="materiali/', `href="${materiali}`)
    .replaceAll("Lab · Percorso", `Lab · Lezione ${n + 1} · Percorso`);
  // Avviso "scuola immaginaria" in testa alla pagina e collegamento al Lab in coda
  main = main.replace(/(<main[^>]*>)/, (m) => `${m}\n${avviso}`);
  const fine = main.lastIndexOf("</div></section>");
  main = main.slice(0, fine) + `\n<p class="intro"><a href="/lab.html">Torna alle lezioni del Lab</a></p>` + main.slice(fine);

  const pagina = guscio
    .replace(/<title>[^<]*<\/title>/, () => `<title>${l.titolo} - Lab - Istituto Comprensivo Homo Sapiens</title>`)
    .replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${descr}">`)
    .replace("</head>", () => `${stile}\n${CORREZIONI}\n</head>`)
    .replace(/<main[\s\S]*<\/main>/, () => main);
  write(l.pagina, pagina);
  cpSync(join(RADICE, "lezioni", l.cartella, "materiali"), join(DIR, "lab", l.cartella, "materiali"), { recursive: true });
}

// Lezione con presentazione: la presentazione resta un file a sé (lab/<cartella>/presentazione.html),
// mostrata nella pagina e apribile a schermo intero; i video incorporati diventano file separati.
function paginaPresentazione(n, l) {
  const base = `/lab/${l.cartella}`;
  const src = readFileSync(join(RADICE, "lezioni", l.cartella, l.sorgente), "utf8")
    .replace(/<video src="data:video\/mp4;base64,[A-Za-z0-9+/=]+"([^>]*?)preload="auto"([^>]*?)\((Video_[^)]+\.mp4)\)"/g,
      (m, a, b, file) => `<video src="video/${file}"${a}preload="metadata"${b}(${file})"`);
  if (/data:video/.test(src)) throw new Error(`${l.sorgente}: video incorporati non convertiti`);
  write(`lab/${l.cartella}/presentazione.html`, src);
  cpSync(join(RADICE, "lezioni", l.cartella, "Video"), join(DIR, "lab", l.cartella, "video"), { recursive: true });

  const video = l.video.map(([file, titolo, testo]) => `
            <div class="col-lg-6 mb-4">
              <div class="card card-bg bg-white rounded h-100">
                <div class="card-body">
                  <video controls preload="metadata" playsinline src="${base}/video/${file}" style="width:100%;border-radius:4px;background:#14213D"
                    aria-label="Video dimostrativo: ${titolo}"></video>
                  <h3 class="h5 mt-3 mb-2">${titolo}</h3>
                  <p class="mb-0">${testo}</p>
                </div>
              </div>
            </div>`).join("");
  const main = `<main id="main-container" class="main-container greendark">
      <section class="section py-2 bg-white d-none d-sm-block">
        <div class="container"><div class="row variable-gutters"><div class="col-12"><div class="breadcrumb">
          <nav aria-label="breadcrumb"><ol class="breadcrumbs-list" data-element="breadcrumb">
            <li class="breadcrumb-item"><a href="/" title="Vai alla pagina: Home">Home</a></li>
            <li class="breadcrumb-item"><a href="/lab.html" title="Vai alla pagina: Lab">Lab</a></li>
            <li class="breadcrumb-item active" aria-current="page"><span>${l.titolo}</span></li>
          </ol></nav>
        </div></div></div></div>
      </section>

      <section class="section bg-greendark bg-greendarkgradient py-5 position-relative d-flex align-items-center overflow-hidden">
        <div class="container"><div class="row variable-gutters"><div class="col-lg-8"><div class="hero-title text-left">
          <small class="h6 text-white">Lab · Lezione ${n + 1} · ${l.etichetta}</small>
          <h1 class="p-0 mb-2 mt-2">${l.titolo}</h1>
          <p class="h4 font-weight-normal">${l.descrizione}</p>
        </div></div></div></div>
      </section>

      <section class="section bg-white py-5" id="presentazione">
        <div class="container">
          <div class="title-section mb-3"><h2 class="h4">La presentazione</h2></div>
          <p>Si sfoglia con le frecce in basso a destra, che compaiono passando con il mouse sulla presentazione, oppure
            con i tasti freccia dopo averci cliccato sopra. Nelle slide di dimostrazione un clic avvia il video.</p>
          <div style="position:relative;width:100%;aspect-ratio:16/9;background:#0F1A2B;border-radius:4px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.12)">
            <iframe src="${base}/presentazione.html" title="Presentazione: ${l.titolo}" allow="fullscreen"
              allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>
          </div>
          <p class="mt-3"><a class="btn btn-sm btn-outline-greendark" href="${base}/presentazione.html" target="_blank" rel="noopener">Apri la presentazione a schermo intero</a></p>
        </div>
      </section>

      <section class="section bg-gray-light py-5" id="video">
        <div class="container">
          <div class="title-section mb-3"><h2 class="h4">I video dimostrativi</h2></div>
          <p class="mb-4">Gli stessi video della presentazione, da guardare uno per uno.</p>
          <div class="row variable-gutters">${video}
          </div>
          <p class="mt-2"><a href="/lab.html">Torna alle lezioni del Lab</a></p>
        </div>
      </section>
    </main>`;
  const pagina = guscio
    .replace(/<title>[^<]*<\/title>/, () => `<title>${l.titolo} - Lab - Istituto Comprensivo Homo Sapiens</title>`)
    .replace(/<meta name="description" content="[^"]*">/, () => `<meta name="description" content="${l.descrizione}">`)
    .replace("</head>", () => `${CORREZIONI}\n</head>`)
    .replace(/<main[\s\S]*<\/main>/, () => main);
  write(l.pagina, pagina);
}

// ---------------------------------------------------------------- elenco delle lezioni
{
  let s = read("scuole-sezione-notizie.html")
    .replace(/<title>[^<]*<\/title>/, "<title>Lab - Istituto Comprensivo Homo Sapiens</title>")
    .replace(/<li class="breadcrumb-item active" aria-current="page"><span>Novità<\/span><\/li>/,
      '<li class="breadcrumb-item active" aria-current="page"><span>Lab</span></li>')
    .replace(/<h1 class="p-0 mb-2">Novità<\/h1>\s*<p class="h4 font-weight-normal">[^<]*<\/p>/,
      `<h1 class="p-0 mb-2">Lab</h1>\n                <p class="h4 font-weight-normal">Lezioni su che cosa si può fare con Claude nell'organizzazione della scuola</p>`);
  const lezioni = LEZIONI.map((l, n) => `
            <div class="col-lg-6">
              <article class="card card-bg bg-white rounded mb-4">
                <div class="card-body">
                  <small class="h6 text-muted">Lezione ${n + 1} · ${l.etichetta}</small>
                  <h2 class="h4 mt-2"><a href="/${l.pagina}">${l.titolo}</a></h2>
                  <p>${l.descrizione}</p>
                  <a class="btn btn-sm btn-outline-greendark" href="/${l.pagina}">Apri la lezione</a>
                </div>
              </article>
            </div>`).join("");
  const html = `
      <section class="section bg-gray-light py-5">
        <div class="container">
          <div class="row variable-gutters">
            <div class="col-lg-8 mb-4">
              <p>L'Istituto Comprensivo Homo Sapiens è una scuola immaginaria. Nel Lab raccogliamo lezioni pratiche che
                mostrano, su esempi concreti, come si può usare Claude nel lavoro di tutti i giorni a scuola.</p>
            </div>
          </div>
          <div class="row variable-gutters">${lezioni}
          </div><!-- /row -->
        </div><!-- /container -->
      </section><!-- /section -->`;
  const h1 = s.indexOf("<h1", s.indexOf("<main"));
  const inizio = s.indexOf("\n", s.indexOf("</section>", h1)) + 1;
  write("lab.html", s.slice(0, inizio) + html + "\n\n    " + s.slice(s.indexOf("</main>", inizio)));
}

// ---------------------------------------------------------------- barra in alto: "Lab" al posto degli argomenti
let n = 0;
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html") && f !== "templates.html")) {
  const prima = read(f);
  const s = prima.replace(/<nav aria-label="(?:Argomenti|Lab)">(\s*)<ul class="nav-list nav-list-secondary">[\s\S]*?<\/ul>/g,
    (m, sp) => { const t = m.includes('tabindex="-1"') ? ' tabindex="-1"' : ""; return `<nav aria-label="Lab">${sp}<ul class="nav-list nav-list-secondary">${sp}  <li>${sp}    <a href="/lab.html"${t}><strong>Lab</strong></a>${sp}  </li>${sp}  <li>${sp}    <a href="/scuole-argomenti.html"${t}>Tutti gli argomenti</a>${sp}  </li>${sp}</ul>`; });
  if (s !== prima) { write(f, s); n++; }
}
console.log(`Lab: ${LEZIONI.length} lezione/i, elenco e barra in alto aggiornati (${n} pagine modificate).`);
