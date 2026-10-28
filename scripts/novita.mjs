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

// ---------------------------------------------------------------- eventi
// Ogni evento ha una scheda generata dal template "scheda evento" del modello Scuole.
const EVENTI = [
  {
    id: "evento-corsa-campestre",
    titolo: "Corsa campestre d'istituto",
    giorno: 18, mese: "nov", anno: 2026, quando: "Mercoledì 18 novembre 2026", orario: "9:00 - 12:30",
    sommario: "Una mattinata di corsa al Parco dell'Olona per le classi della secondaria e le quinte della primaria.",
    immagine: ["assets/img/corsa-campestre.svg", "center 72%", "Illustrazione: ragazze e ragazzi corrono su un sentiero tra i prati lungo il torrente, segnato da bandierine"],
    argomenti: [["Benessere", "benessere"], ["Offerta formativa", "offerta-formativa"]],
    sezioni: [
      ["Cos'è", `<p>La corsa campestre d'istituto è una gara di corsa su prato organizzata dai docenti di scienze motorie
        della secondaria e dai docenti di educazione motoria della primaria. È un'occasione per fare sport all'aperto,
        conoscere il parco lungo il torrente e stare insieme tra classi diverse.</p>
        <p>I primi sei classificati di ogni categoria della secondaria rappresentano la scuola alla fase provinciale dei
        Campionati studenteschi di corsa campestre.</p>`],
      ["Chi partecipa", `<ul>
          <li>tutte le classi della secondaria "Rita Levi-Montalcini"</li>
          <li>le classi quinte delle primarie "Gianni Rodari" e "Don Lorenzo Milani"</li>
        </ul>
        <p>Le gare sono divise per anno di corso, maschili e femminili:</p>
        <ul>
          <li>classi quinte della primaria: 800 metri</li>
          <li>classi prime della secondaria: 1.000 metri</li>
          <li>classi seconde e terze della secondaria: 1.500 metri</li>
        </ul>`],
      ["Luogo", `<p><strong>Parco dell'Olona</strong>, area dei prati lungo il torrente, Castelbruno (MI).</p>
        <p>Le classi raggiungono il parco a piedi, accompagnate dai docenti.</p>`],
      ["Date e orari", `<ul>
          <li><strong>Mercoledì 18 novembre 2026</strong>, dalle 9:00 alle 12:30</li>
          <li>Partenza dalla scuola alle 8:30, rientro entro le 12:30</li>
          <li>In caso di maltempo la corsa è rinviata a <strong>mercoledì 25 novembre</strong>, con gli stessi orari</li>
        </ul>
        <p>Dopo il rientro le lezioni proseguono regolarmente; alla primaria la mensa è confermata.</p>`],
      ["Cosa portare", `<ul>
          <li>tuta o abbigliamento sportivo comodo e una giacca impermeabile</li>
          <li>scarpe da ginnastica adatte a correre sull'erba</li>
          <li>una borraccia con acqua e un cambio di maglietta</li>
        </ul>`],
      ["Costi", `<p>La partecipazione è gratuita.</p>`],
      ["Autorizzazioni", `<p>Le famiglie riceveranno una circolare con le indicazioni e il modulo di autorizzazione da
        consegnare ai docenti. Gli alunni esonerati dall'attività fisica partecipano come aiuto all'organizzazione.</p>`],
      ["Contatti", `<p>Segreteria dell'Istituto, Via Alessandro Volta, 24 - Castelbruno (MI)<br>
        Tel. 02 9637 4410 - Email <a href="mailto:miic8zh00q@istruzione.it">miic8zh00q@istruzione.it</a></p>`],
    ],
  },
];
{
  const tplEvento = read("scuole-scheda-evento.html");
  for (const e of EVENTI) {
    const indice = e.sezioni.map(([t], i) => `
                    <li>
                      <a class="list-item scroll-anchor-offset" href="#art-par-${String(i + 1).padStart(2, "0")}">${t}</a>
                    </li>`).join("");
    const corpo = e.sezioni.map(([t, html], i) => `
                <h2 class="h4" id="art-par-${String(i + 1).padStart(2, "0")}">${t}</h2>
                <div class="col-lg-12 px-0 wysiwig-text mb-4">
                  ${html}
                </div>`).join("");
    const s = tplEvento
      .replace(/<title>[^<]*<\/title>/, `<title>${e.titolo} - Istituto Comprensivo Homo Sapiens</title>`)
      .replace(/(<ol class="breadcrumbs-list" data-element="breadcrumb">)[\s\S]*?(<\/ol>)/, `$1
                    <li class="breadcrumb-item"><a href="/" title="Vai alla pagina: Home">Home</a></li>
                    <li class="breadcrumb-item"><a href="/scuole-sezione-notizie.html" title="Vai alla pagina: Novità">Novità</a></li>
                    <li class="breadcrumb-item"><a href="/scuole-sezione-notizie.html#eventi" title="Vai alla pagina: Eventi">Eventi</a></li>
                    <li class="breadcrumb-item active" aria-current="page"><span>${e.titolo}</span></li>
                  $2`)
      .replace(/<div class="title-img"[^>]*><\/div>/, () => e.immagine
        ? `<div class="title-img" role="img" aria-label="${e.immagine[2]}" style="background-image: url('${e.immagine[0]}'); background-position: ${e.immagine[1]};"></div>`
        : "")
      .replace(/<h1 class="h2">[^<]*<\/h1>\s*<div class="h3 text-greendark mb-3">[^<]*<\/div>\s*<p class="mb-0">[^<]*<\/p>/,
        `<h1 class="h2">${e.titolo}</h1>\n                <div class="h3 text-greendark mb-3">${e.quando}</div>\n                <p class="mb-0">${e.sommario}</p>`)
      .replace(/(<div class="h4">Argomenti<\/div>\s*<div class="badges">)[\s\S]*?(<\/div><!-- \/badges -->)/, `$1${e.argomenti.map(([t, a]) => `
                    <a href="/scuole-argomenti.html#${a}" class="badge badge-sm badge-pill badge-outline-greendark">${t}</a>`).join("")}
                  $2`)
      // collegamento "Titolo della circolare" del template: non c'è ancora una circolare
      .replace(/\s*<div class="text-icon">\s*<a href="#">[\s\S]*?<p>Titolo della circolare<\/p>\s*<\/a>\s*<\/div>/, "")
      .replace(/(<div id="lista-paragrafi"[^>]*>\s*<ul class="link-list">)[\s\S]*?(<\/ul>)/, `$1${indice}
                  $2`)
      .replace(/<article class="article-wrapper pt-4 px-3">[\s\S]*?<\/article>/, `<article class="article-wrapper pt-4 px-3">${corpo}
                <div class="article-footer">
                  <p><strong>Pubblicato:</strong> 28.10.2026</p>
                </div><!-- /article-footer -->
              </article>`)
      // "aggiungi a Google Calendar" e "Contenuti correlati" sono segnaposto del template
      .replace(/\s*<div class="d-flex justify-content-end pb-4">\s*<div class="actions-wrapper actions-main">\s*<p><a class="text-underline text-greendark" target="_blank" href="#">[\s\S]*?<\/div>\s*<\/div>/, "")
      .replace(/\s*<section class="section bg-gray-gradient py-5" id="art-par-09">[\s\S]*?<\/section>(\s*<\/main>)/, "$1");
    write(`${e.id}.html`, s);
  }
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
// Circolari: i PDF sono in public/circolari/. La più recente per prima.
const CIRCOLARI = [
  {
    numero: 27, data: "26 ottobre 2026", file: "circ027_2026_consigli-classe-b.pdf",
    titolo: "Consigli delle classi 1ª B, 2ª B e 3ª B di martedì 10 novembre",
    destinatari: "Docenti e rappresentanti dei genitori delle classi 1ª B, 2ª B e 3ª B, secondaria Levi-Montalcini",
    sommario: "Martedì 10 novembre, dalle 14.30 alle 17.30, sono convocati i consigli delle classi 1ª B, 2ª B e 3ª B nell'aula riunioni della secondaria.",
  },
  {
    numero: 23, data: "13 ottobre 2026", file: "circ023_2026_uscita-museo.pdf",
    titolo: "Mercoledì 11 novembre uscita didattica al Museo di Storia Naturale di Milano",
    destinatari: "Famiglie e docenti delle classi 3ª A e 3ª B, primaria Rodari",
    sommario: "Le classi 3ª A e 3ª B della primaria Rodari visitano il Museo di Storia Naturale di Milano. Autorizzazione e quota entro venerdì 23 ottobre.",
    allegati: [["Modulo di autorizzazione", "circ023_2026_uscita-museo_all1.pdf"]],
  },
  {
    numero: 21, data: "12 ottobre 2026", file: "circ021_2026_sciopero.pdf",
    titolo: "Venerdì 23 ottobre sciopero nazionale della scuola",
    destinatari: "Famiglie, personale docente e ATA",
    sommario: "Venerdì 23 ottobre è previsto uno sciopero nazionale del personale della scuola, per l'intera giornata. Le lezioni potrebbero non svolgersi regolarmente.",
  },
];
const pdf = (file, testo, aria) => `<a href="/circolari/${file}" target="_blank" rel="noopener" aria-label="${aria} (PDF, apre in una nuova scheda)">${testo}</a>`;
const cardCircolare = (c, h = "h3") => `
              <div class="card card-bg card-vertical-thumb bg-white card-thumb-rounded mb-4">
                <div class="card-body">
                  <div class="card-content">
                    <small class="h6 text-greendark">Circolare n. ${c.numero} del ${c.data}</small>
                    <${h} class="h5">${pdf(c.file, c.titolo, `Circolare n. ${c.numero}: ${c.titolo}`)}</${h}>
                    <p class="text-normal">${c.sommario}</p>
                    <p class="mb-0"><small><strong>A chi è rivolta:</strong> ${c.destinatari}</small></p>${(c.allegati || []).map(([t, f]) => `
                    <p class="mb-0 mt-2"><small><strong>Allegato:</strong> ${pdf(f, t, `Allegato alla circolare n. ${c.numero}: ${t}`)} (PDF)</small></p>`).join("")}
                  </div>
                </div><!-- /card-body -->
              </div><!-- /card -->`;
const cardEvento = (e, h = "h3") => `
              <div class="card card-bg card-event bg-white card-thumb-rounded mb-4">
                <div class="card-body">
                  <div class="card-content">
                    <${h} class="h5"><a href="/${e.id}.html">${e.titolo}</a></${h}>
                    <p>${e.sommario}</p>
                  </div>
                </div><!-- /card-body -->
                <div class="card-event-dates">
                  <div class="card-event-dates-icon">
                    <svg class="icon svg-calendar">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-calendar"></use>
                    </svg>
                  </div><!-- /card-event-dates-icon -->
                  <div class="card-event-dates-content">
                    <p class="font-weight-normal"><strong>${e.quando}<br />${e.orario}</strong></p>
                  </div><!-- /card-event-dates-content -->
                </div><!-- /card-event-dates -->
              </div><!-- /card -->`;
const TESTO_EVENTI = "Il calendario scolastico 2026/2027 sarà pubblicato dopo la verifica della delibera regionale della Lombardia e delle delibere del Consiglio d'istituto.";

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
${CIRCOLARI.map((c) => `
            <div class="col-lg-4">${cardCircolare(c)}
            </div>`).join("")}`) +
    sezione("bg-gray-light", "eventi", "Eventi", `
${EVENTI.map((e) => `
            <div class="col-lg-4">${cardEvento(e)}
            </div>`).join("")}
            <div class="col-12"><p class="mb-0"><small>${TESTO_EVENTI}</small></p></div>`);
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
      `$1${blocco("Notizie", cardNotizia(NOTIZIE[0]), "/scuole-sezione-notizie.html#notizie", "Leggi tutte le notizie")}${blocco("Circolari", cardCircolare(CIRCOLARI[0]), "/scuole-sezione-notizie.html#circolari", "Leggi tutte le circolari")}${blocco("Eventi", cardEvento(EVENTI[0]), "/scuole-sezione-notizie.html#eventi", "Vedi tutti gli eventi", "Vedi tutti")}
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
