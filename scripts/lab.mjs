// Sezione "Lab": lezioni inserite nel layout del sito.
// - lab.html: elenco delle lezioni
// - una pagina per lezione, a partire dai file in lezioni/<cartella>/ (intestazione e footer sono quelli del sito)
// - barra in alto: la voce "Lab" sostituisce "Argomento 1, 2, 3"; resta "Tutti gli argomenti"
// Uso: node scripts/lab.mjs (per ultimo, dopo gli altri script)
import { readFileSync, writeFileSync, readdirSync, cpSync, mkdirSync, existsSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { createHash } from "node:crypto";

const RADICE = fileURLToPath(new URL("../", import.meta.url));
const DIR = join(RADICE, "public");
const read = (f) => readFileSync(join(DIR, f), "utf8");
const write = (f, s) => { mkdirSync(join(DIR, f, ".."), { recursive: true }); writeFileSync(join(DIR, f), s); };

// L'ordine dell'elenco è quello della pagina Lab (Lezione 1, 2, ...)
const LEZIONI = [
  {
    tipo: "presentazione",
    cartella: "incontro-1",
    sorgente: "Incontro1_Presentazione.html",
    pagina: "lab-incontro-1.html",
    titolo: "L'ufficio virtuale del DS: il metodo e un caso dall'inizio alla fine",
    etichetta: "Incontro 1 · Pavia, 25 novembre · Lodi, 26 novembre",
    descrizione: "La presentazione del primo incontro del corso per dirigenti scolastici: che cos'è Claude, i Progetti come reparti dell'ufficio, le skill, e un caso seguito dal reclamo di un genitore fino alla circolare. Con le istruzioni dei quattro Progetti usati come esempio al corso.",
    // PDF in lezioni/<cartella>/istruzioni/
    istruzioni: [
      ["Istruzioni_Corrispondenza_e_atti.pdf", "Corrispondenza e atti", "Risposte a famiglie, docenti ed enti, ordini del giorno degli organi collegiali, delibere e circolari nello stile della scuola. Contiene anche i dati della scuola: plessi, orari, collaboratori."],
      ["Istruzioni_Documenti_strategici.pdf", "Documenti strategici", "Coerenza e aggiornamento di RAV, Piano di Miglioramento e PTOF: la tabella dei collegamenti, le incongruenze e le proposte di allineamento."],
      ["Istruzioni_Comunicazione_e_sito_web.pdf", "Comunicazione e sito web", "Avvisi e notizie per il sito e messaggi per le famiglie: linguaggio semplice, struttura fissa, al massimo 120 parole."],
      ["Istruzioni_Normativa_e_ricerca.pdf", "Normativa e ricerca", "Quadri sintetici sulla normativa scolastica, con ogni riferimento da verificare su Normattiva, Gazzetta Ufficiale o sito del Ministero."],
    ],
  },
  {
    cartella: "percorso-circolari",
    nascosta: true, // non compare nell'elenco della pagina Lab (la pagina della lezione resta raggiungibile)
    sorgente: "percorso-circolari.html",
    pagina: "lab-percorso-circolari.html",
    titolo: "Dai dati alla circolare",
    etichetta: "Percorso Circolari per il dirigente",
    descrizione: "Il dirigente fornisce i dati essenziali della circolare. Claude restituisce il testo già su carta intestata, scritto in un italiano chiaro e con in evidenza i dati che mancano.",
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
  // Ogni video incorporato è collegato al file della cartella Video con lo stesso contenuto
  // (il nome nell'etichetta può cambiare quando si aggiungono slide).
  const cartellaVideo = join(RADICE, "lezioni", l.cartella, "Video");
  const conVideo = existsSync(cartellaVideo);
  const impronta = (b) => createHash("sha1").update(b).digest("hex");
  const perContenuto = new Map(conVideo ? readdirSync(cartellaVideo).map((f) => [impronta(readFileSync(join(cartellaVideo, f))), f]) : []);
  const src = readFileSync(join(RADICE, "lezioni", l.cartella, l.sorgente), "utf8")
    .replace(/<video src="data:video\/mp4;base64,([A-Za-z0-9+/=]+)"([^>]*?)preload="auto"/g, (m, dati, a) => {
      const file = perContenuto.get(impronta(Buffer.from(dati, "base64")));
      if (!file) throw new Error(`${l.sorgente}: un video incorporato non corrisponde a nessun file della cartella Video`);
      return `<video src="video/${file}"${a}preload="metadata"`;
    });
  if (/data:video/.test(src)) throw new Error(`${l.sorgente}: video incorporati non convertiti`);
  write(`lab/${l.cartella}/presentazione.html`, src);
  if (conVideo) cpSync(cartellaVideo, join(DIR, "lab", l.cartella, "video"), { recursive: true });
  if (l.istruzioni) cpSync(join(RADICE, "lezioni", l.cartella, "istruzioni"), join(DIR, "lab", l.cartella, "istruzioni"), { recursive: true });

  const video = (l.video || []).map(([file, titolo, testo]) => `
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
  const istruzioni = (l.istruzioni || []).map(([file, titolo, testo]) => `
            <div class="col-lg-6 mb-4">
              <div class="card card-bg bg-white rounded h-100">
                <div class="card-body">
                  <small class="h6 text-muted">Progetto</small>
                  <h3 class="h5 mt-2 mb-2">IC Homo Sapiens – ${titolo}</h3>
                  <p>${testo}</p>
                  <a class="btn btn-sm btn-outline-greendark" href="${base}/istruzioni/${file}" target="_blank" rel="noopener">Apri le istruzioni (PDF)</a>
                </div>
              </div>
            </div>`).join("");
  // Sezioni dopo la presentazione; il collegamento al Lab va in fondo all'ultima
  const sezioni = [];
  if (video) sezioni.push(["video", "I video dimostrativi", "Gli stessi video della presentazione, da guardare uno per uno.", video]);
  if (istruzioni) sezioni.push(["istruzioni", "Le istruzioni dei progetti",
    "Sono gli esempi di istruzioni di progetto utilizzati al corso: quattro reparti dell'ufficio virtuale della dirigente dell'IC Homo Sapiens, " +
    "una scuola immaginaria. Ogni testo è quello che si incolla nel campo Istruzioni di un Progetto di Claude: ruolo, di cosa si occupa, " +
    "come vuole i testi, regole sempre valide, che cosa fare con poco contesto e come consegnare gli atti. Si possono prendere come modello " +
    "e adattare alla propria scuola.", istruzioni]);
  const torna = `
          <p class="mt-2"><a href="/lab.html">Torna alle lezioni del Lab</a></p>`;
  const altre = sezioni.map(([id, titolo, intro, schede], i) => `
      <section class="section ${i % 2 ? "bg-white" : "bg-gray-light"} py-5" id="${id}">
        <div class="container">
          <div class="title-section mb-3"><h2 class="h4">${titolo}</h2></div>
          <p class="mb-4">${intro}</p>
          <div class="row variable-gutters">${schede}
          </div>${i === sezioni.length - 1 ? torna : ""}
        </div>
      </section>`).join("");
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
            con i tasti freccia dopo averci cliccato sopra.${video ? " Nelle slide di dimostrazione un clic avvia il video." : ""}</p>
          <div style="position:relative;width:100%;aspect-ratio:16/9;background:#0F1A2B;border-radius:4px;overflow:hidden;box-shadow:0 2px 20px rgba(0,0,0,.12)">
            <iframe src="${base}/presentazione.html" title="Presentazione: ${l.titolo}" allow="fullscreen"
              allowfullscreen style="position:absolute;inset:0;width:100%;height:100%;border:0"></iframe>
          </div>
          <p class="mt-3"><a class="btn btn-sm btn-outline-greendark" href="${base}/presentazione.html" target="_blank" rel="noopener">Apri la presentazione a schermo intero</a></p>${sezioni.length ? "" : torna}
        </div>
      </section>
${altre}
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
  const lezioni = LEZIONI.map((l, n) => l.nascosta ? "" : `
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
