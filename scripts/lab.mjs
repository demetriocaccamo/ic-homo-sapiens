// Sezione "Lab": lezioni inserite nel layout del sito.
// - lab.html: elenco delle lezioni
// - una pagina per lezione, a partire dai file in lezioni/<cartella>/ (intestazione e footer sono quelli del sito)
// - barra in alto: la voce "Lab" sostituisce "Argomento 1, 2, 3, Tutti gli argomenti"
// Uso: node scripts/lab.mjs (per ultimo, dopo gli altri script)
import { readFileSync, writeFileSync, readdirSync, cpSync } from "node:fs";
import { join } from "node:path";

const RADICE = new URL("../", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const DIR = join(RADICE, "public");
const read = (f) => readFileSync(join(DIR, f), "utf8");
const write = (f, s) => writeFileSync(join(DIR, f), s);

const LEZIONI = [
  {
    cartella: "percorso-circolari",
    sorgente: "percorso-circolari.html",
    pagina: "lab-percorso-circolari.html",
    titolo: "Dal modulo alla circolare",
    etichetta: "Percorso Circolari per il dirigente",
    descrizione: "Il dirigente compila un breve modulo con i dati della circolare. Claude restituisce il testo già su carta intestata, scritto in un italiano chiaro e con in evidenza i dati che mancano.",
  },
];

// ---------------------------------------------------------------- pagine delle lezioni
const guscio = read("scuole-pagina-singola.html");
for (const [n, l] of LEZIONI.entries()) {
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
    .replace("</head>", () => `${stile}\n</head>`)
    .replace(/<main[\s\S]*<\/main>/, () => main);
  write(l.pagina, pagina);
  cpSync(join(RADICE, "lezioni", l.cartella, "materiali"), join(DIR, "lab", l.cartella, "materiali"), { recursive: true });
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
    (m, sp) => `<nav aria-label="Lab">${sp}<ul class="nav-list nav-list-secondary">${sp}  <li>${sp}    <a href="/lab.html"${m.includes('tabindex="-1"') ? ' tabindex="-1"' : ""}>Lab</a>${sp}  </li>${sp}</ul>`);
  if (s !== prima) { write(f, s); n++; }
}
console.log(`Lab: ${LEZIONI.length} lezione/i, elenco e barra in alto aggiornati (${n} pagine modificate).`);
