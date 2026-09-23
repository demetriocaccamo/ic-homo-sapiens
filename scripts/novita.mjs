// Sezione "Novità" e home page: notizie ricavate dalla scheda anagrafica, circolari ed eventi
// vuoti finché non ci sono contenuti verificati (il calendario 2026/27 è "da definire").
// Uso: node scripts/novita.mjs (dopo servizi.mjs)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (f) => readFileSync(join(DIR, f), "utf8");
const write = (f, s) => writeFileSync(join(DIR, f), s);

const NOTIZIE = [
  {
    id: "notizia-nuovo-sito", data: "22 settembre 2026",
    titolo: "Online il nuovo sito dell'Istituto",
    sommario: "Il sito segue il modello per le scuole di Designers Italia: informazioni su plessi, servizi e didattica in un unico posto.",
    corpo: `
                <p>È online il nuovo sito dell'Istituto Comprensivo "Homo Sapiens". È costruito sul modello per i siti delle
                  scuole di Designers Italia, pensato per rendere le informazioni più facili da trovare per famiglie,
                  studenti e personale.</p>
                <h2 class="h4">Cosa si trova nel sito</h2>
                <ul>
                  <li><a href="/scuole-la-scuola.html">La scuola</a>: presentazione, plessi, organizzazione e documenti</li>
                  <li><a href="/scuole-sezione-servizi.html">Servizi</a>: iscrizioni, mensa, trasporto, registro elettronico, pagamenti</li>
                  <li><a href="/scuole-didattica.html">Didattica</a>: scuola dell'infanzia, primaria e secondaria di I grado</li>
                  <li><a href="/scuole-sezione-notizie.html">Novità</a>: notizie, circolari ed eventi</li>
                </ul>
                <p>I contenuti saranno arricchiti nel corso dell'anno scolastico 2026/2027.</p>`,
  },
  {
    id: "notizia-sportello-ascolto", data: "22 settembre 2026",
    titolo: "Sportello d'ascolto psicologico: come accedere",
    sommario: "Uno spazio di ascolto riservato per alunni, famiglie e personale della scuola.",
    corpo: `
                <p>Nell'anno scolastico 2026/2027 l'Istituto mette a disposizione lo sportello d'ascolto psicologico,
                  rivolto ad alunni, famiglie e personale della scuola.</p>
                <p>Le modalità di prenotazione e i giorni di presenza dello psicologo saranno comunicati con una circolare.
                  Per gli alunni minorenni è necessario il consenso dei genitori.</p>
                <p>Tutte le informazioni sono nella scheda del servizio
                  <a href="/servizio-sportello-ascolto.html">Sportello d'ascolto psicologico</a>.</p>`,
  },
  {
    id: "notizia-credenziali-classi-prime", data: "22 settembre 2026",
    titolo: "Classi prime: credenziali per ClasseViva e Google Workspace",
    sommario: "Le famiglie dei nuovi iscritti possono ritirare le credenziali del registro elettronico in segreteria.",
    corpo: `
                <p>Le famiglie degli alunni iscritti alle classi prime ricevono dalla segreteria, area didattica, le
                  credenziali per il registro elettronico <strong>ClasseViva</strong>. Gli alunni ricevono l'account della
                  scuola per <strong>Google Workspace for Education</strong>.</p>
                <p>La segreteria, in Via Alessandro Volta, 24, è aperta al pubblico dal lunedì al venerdì dalle 8:00 alle 9:30
                  e dalle 12:00 alle 13:30; martedì e giovedì anche dalle 14:30 alle 16:30.</p>
                <p>Maggiori informazioni nella scheda
                  <a href="/servizio-registro-elettronico.html">Registro elettronico e piattaforme</a>.</p>`,
  },
];

// ---------------------------------------------------------------- pagine delle notizie
const tpl = read("scuole-pagina-singola.html");
for (const n of NOTIZIE) {
  const s = tpl
    .replace(/<title>[^<]*<\/title>/, `<title>${n.titolo} - Istituto Comprensivo Homo Sapiens</title>`)
    .replace(/<li class="breadcrumb-item active" aria-current="page"><span>[\s\S]*?<\/span><\/li>/,
      `<li class="breadcrumb-item"><a href="/scuole-sezione-notizie.html" title="Vai alla pagina: Novità">Novità</a></li>
                    <li class="breadcrumb-item active" aria-current="page"><span>${n.titolo}</span></li>`)
    .replace(/<h1 class="h2 mb-3">[^<]*<\/h1>\s*<p>[^<]*<\/p>/, `<h1 class="h2 mb-3">${n.titolo}</h1>\n                <p>${n.sommario}</p>`)
    .replace(/<article class="article-wrapper">[\s\S]*?<\/article>/, `<article class="article-wrapper">
                <p class="text-muted"><small>Notizia pubblicata il ${n.data}</small></p>${n.corpo}
              </article>`);
  write(`${n.id}.html`, s);
}

// ---------------------------------------------------------------- componenti
const cardNotizia = (n, h = "h3") => `
              <div class="card card-bg card-vertical-thumb bg-white card-thumb-rounded mb-4">
                <div class="card-body">
                  <div class="card-content">
                    <small class="h6 text-muted">${n.data}</small>
                    <${h} class="h5"><a href="/${n.id}.html">${n.titolo}</a></${h}>
                    <p>${n.sommario}</p>
                  </div>
                </div><!-- /card-body -->
              </div><!-- /card -->`;
const vuoto = (testo) => `
              <div class="card card-bg bg-white rounded mb-4">
                <div class="card-body">
                  <p class="mb-0">${testo}</p>
                </div>
              </div>`;
const TESTO_CIRCOLARI = "Non ci sono circolari pubblicate.";
const TESTO_EVENTI = "Non ci sono eventi in programma. Il calendario scolastico 2026/2027 sarà pubblicato dopo la verifica della delibera regionale della Lombardia e delle delibere del Consiglio d'istituto.";

// ---------------------------------------------------------------- panoramica Novità
{
  let s = read("scuole-sezione-notizie.html");
  const sezione = (bg, id, titolo, contenuto) => `
      <section class="section ${bg} py-5" id="${id}">
        <div class="container">
          <div class="title-section mb-5">
            <h2 class="h4">${titolo}</h2>
          </div><!-- /title-large -->
          <div class="row variable-gutters">${contenuto}
          </div><!-- /row -->
        </div><!-- /container -->
      </section><!-- /section -->`;
  const html =
    sezione("bg-gray-light", "notizie", "Notizie recenti", NOTIZIE.map((n) => `
            <div class="col-lg-4">${cardNotizia(n)}
            </div>`).join("")) +
    sezione("bg-white", "circolari", "Circolari", `
            <div class="col-lg-8">${vuoto(TESTO_CIRCOLARI)}
            </div>`) +
    sezione("bg-gray-light", "eventi", "Eventi", `
            <div class="col-lg-8">${vuoto(TESTO_EVENTI)}
            </div>`);
  s = s.replace(/<title>[^<]*<\/title>/, "<title>Novità - Istituto Comprensivo Homo Sapiens</title>");
  s = s.replace(/(<h1 class="p-0 mb-2">Novità<\/h1>\s*<p[^>]*>)[\s\S]*?(<\/p>)/, "$1Notizie, circolari ed eventi dell'Istituto$2");
  const h1 = s.indexOf("<h1", s.indexOf("<main"));
  const inizio = s.indexOf("\n", s.indexOf("</section>", h1)) + 1;
  s = s.slice(0, inizio) + html + "\n\n    " + s.slice(s.indexOf("</main>", inizio));
  write("scuole-sezione-notizie.html", s);
}

// ---------------------------------------------------------------- home page
{
  let s = read("index.html");
  const SERVIZI_HOME = [
    ["servizio-iscrizioni", "Iscrizioni", "Infanzia, primaria e secondaria di I grado"],
    ["servizio-mensa", "Mensa scolastica", "Per infanzia e primaria"],
    ["servizio-pre-post-scuola", "Pre-scuola e post-scuola", "Dalle 7:30 e fino alle 18:00"],
    ["servizio-trasporto", "Trasporto scolastico", "Scuolabus comunale"],
    ["servizio-registro-elettronico", "Registro elettronico", "ClasseViva e Google Workspace"],
    ["servizio-pagamenti", "Pagamenti con PagoPA", "Tramite Pago In Rete"],
  ];
  const cardServizio = ([id, t, d]) => `
            <div class="col-lg-4">
              <div class="card card-bg card-noicon rounded">
                <a href="/${id}.html">
                  <div class="card-body">
                    <div class="card-icon-content">
                      <p><strong>${t}</strong></p>
                      <small>${d}</small>
                    </div><!-- /card-icon-content -->
                  </div><!-- /card-body -->
                </a>
              </div><!-- /card card-bg rounded -->
            </div><!-- /col-lg-4 -->`;
  const blocco = (titolo, contenuto, href, aria, link = "Leggi tutte") => `
            <div class="col-lg-4">
              <div class="title-section pb-4">
                <h2>${titolo}</h2>
              </div><!-- /title-section -->${contenuto}
              <div class="py-4">
                <a aria-label="${aria}" class="text-underline" href="${href}"><strong>${link}</strong></a>
              </div>
            </div><!-- /col-lg-4 -->`;
  s = s
    .replace(/(<a class="btn btn-sm btn-outline-white mt-4" href=")[^"]*(">Vai alla scuola<\/a>)/, "$1/scuole-la-scuola.html$2")
    // Immagine accanto al riquadro "Benvenuti"
    .replace(/<div class="hero-img[^"]*"[^>]*>/,
      `<div class="hero-img" role="img"
          aria-label="Una figura in stile pittura rupestre cammina su un libro aperto, tra simboli preistorici, lettere e numeri"
          style="background-image: url('assets/img/hero-home.webp');">`)
    // Notizie, circolari ed eventi
    .replace(/(<section class="section bg-white py-2 py-lg-3 py-xl-5">\s*<div class="container">\s*<div class="row variable-gutters">)[\s\S]*?(<\/div><!-- \/row -->\s*<\/div><!-- \/container -->\s*<\/section><!-- \/section -->)/,
      `$1${blocco("Notizie", cardNotizia(NOTIZIE[0]), "/scuole-sezione-notizie.html#notizie", "Leggi tutte le notizie")}${blocco("Circolari", vuoto(TESTO_CIRCOLARI), "/scuole-sezione-notizie.html#circolari", "Leggi tutte le circolari")}${blocco("Eventi", vuoto("Non ci sono eventi in programma."), "/scuole-sezione-notizie.html#eventi", "Vedi tutti gli eventi", "Vedi tutti")}
          $2`)
    // Servizi in evidenza
    .replace(/(<div class="container position-relative slided-top">)[\s\S]*?(<div class="pb-5 text-center">\s*<a class="text-underline" href=")[^"]*(">)/,
      `$1
          <div class="row variable-gutters mb-4">${SERVIZI_HOME.slice(0, 3).map(cardServizio).join("")}
          </div><!-- /row -->
          <div class="row variable-gutters mb-4 pb-3">${SERVIZI_HOME.slice(3).map(cardServizio).join("")}
          </div><!-- /row -->
          $2/scuole-sezione-servizi.html$3`)
    .replace(/I servizi offerti dall'Istituto Comprensivo Homo Sapiens dedicati a tutti i genitori, studenti, personale\s*ATA e docenti/,
      "I servizi dell'Istituto e del Comune per famiglie, studenti e personale scolastico")
    .replace(/(<a class="btn btn-sm btn-outline-bluelectric" href=")[^"]*(">Vai alla didattica)/, "$1/scuole-didattica.html$2");
  write("index.html", s);
}

// ---------------------------------------------------------------- menu in tutte le pagine
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html") && f !== "templates.html")) {
  let s = read(f);
  const prima = s;
  s = s
    .replace(/href="\/scuole-news-circolare\.html"([^>]*)>Le circolari</g, 'href="/scuole-sezione-notizie.html#circolari"$1>Le circolari<')
    .replace(/href="\/scuole-archivio-eventi\.html"([^>]*)>Calendario eventi</g, 'href="/scuole-sezione-notizie.html#eventi"$1>Calendario eventi<')
    .replace(/href="\/scuole-sezione-notizie\.html"([^>]*)>Le notizie</g, 'href="/scuole-sezione-notizie.html#notizie"$1>Le notizie<');
  if (s !== prima) write(f, s);
}
console.log(`Novità: ${NOTIZIE.length} notizie, panoramica e home aggiornate.`);
