// Sezione "Servizi": una scheda per ogni servizio della scheda anagrafica (par. 6-7),
// generata dal template "servizio generico", più le pagine elenco e la panoramica.
// Uso: node scripts/servizi.mjs (dopo scheda.mjs)
import { readFileSync, writeFileSync, readdirSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (f) => readFileSync(join(DIR, f), "utf8");
const write = (f, s) => writeFileSync(join(DIR, f), s);

const TEL = "02 9637 4410";
const EMAIL = "miic8zh00q@istruzione.it";
const SEGRETERIA = `<p><strong>Segreteria dell'Istituto</strong> - Via Alessandro Volta, 24 - 20079 Castelbruno (MI)<br>
                  Tel. ${TEL} - Email <a href="mailto:${EMAIL}">${EMAIL}</a></p>
                <p>Apertura al pubblico dal lunedì al venerdì 8:00 - 9:30 e 12:00 - 13:30; martedì e giovedì anche 14:30 - 16:30.
                  Si riceve su appuntamento.</p>`;
const COMUNE = `<p><strong>Comune di Castelbruno - Settore Istruzione</strong>, che gestisce il servizio per conto delle famiglie.</p>
                <p>Per informazioni sull'organizzazione a scuola è possibile rivolgersi anche alla segreteria dell'Istituto
                  (tel. ${TEL}).</p>`;

const CAT = {
  famiglie: { label: "Famiglie e studenti", pagina: "scuole-servizio-tipologia.html" },
  personale: { label: "Personale scolastico", pagina: "servizi-personale.html" },
};

const SERVIZI = [
  {
    id: "servizio-iscrizioni", cat: "famiglie", titolo: "Iscrizioni",
    descr: "Come iscriversi alla scuola dell'infanzia, alla primaria e alla secondaria di I grado",
    argomenti: ["Iscrizioni", "Famiglia"],
    sezioni: [
      ["Cos'è", `<p>Le iscrizioni alle classi prime della scuola primaria e della scuola secondaria di I grado e alla scuola
        dell'infanzia si effettuano una volta all'anno, nel periodo stabilito dal Ministero dell'Istruzione e del Merito.</p>`],
      ["Come si accede al servizio", `<ul>
          <li><strong>Scuola dell'infanzia</strong>: domanda in segreteria con il modulo dell'Istituto.</li>
          <li><strong>Scuola primaria e secondaria di I grado</strong>: domanda online sulla piattaforma
            <a href="https://unica.istruzione.gov.it/" target="_blank" rel="noopener">Unica</a> del Ministero, accedendo
            con SPID, CIE, CNS o eIDAS.</li>
        </ul>
        <p>Per le famiglie che hanno bisogno di aiuto nella compilazione, la segreteria offre supporto su appuntamento.</p>`],
      ["Cosa serve", `<ul>
          <li>Codice fiscale dell'alunno e dei genitori</li>
          <li>Codice del plesso scelto (vedi sotto)</li>
          <li>Per la scuola dell'infanzia, il modulo di iscrizione compilato</li>
        </ul>`],
      ["Codici dei plessi", `<ul>
          <li>Infanzia "Maria Montessori": MIAA8ZH01L</li>
          <li>Infanzia "Il Girasole": MIAA8ZH02N</li>
          <li>Primaria "Gianni Rodari": MIEE8ZH01T</li>
          <li>Primaria "Don Lorenzo Milani": MIEE8ZH02V</li>
          <li>Secondaria "Rita Levi-Montalcini": MIMM8ZH01R</li>
        </ul>`],
      ["Tempi e scadenze", `<p>Le date di apertura e chiusura delle iscrizioni sono fissate ogni anno dal Ministero e
        vengono pubblicate nelle notizie del sito. Prima delle iscrizioni l'Istituto organizza gli open day del progetto
        di continuità <strong>"Ponti"</strong>, aperti anche alle famiglie dei comuni vicini.</p>`],
      ["Contatti", SEGRETERIA],
    ],
  },
  {
    id: "servizio-mensa", cat: "famiglie", titolo: "Mensa scolastica",
    descr: "Il pranzo a scuola per la scuola dell'infanzia e la scuola primaria",
    argomenti: ["Alimentazione", "Famiglia", "Pagamenti"],
    sezioni: [
      ["Cos'è", `<p>La mensa è attiva nelle scuole dell'infanzia e nelle scuole primarie dell'Istituto, dove tutte le
        classi seguono un orario con rientro pomeridiano. Il servizio è organizzato dal Comune di Castelbruno e gestito da
        un'azienda di ristorazione per conto del Comune.</p>`],
      ["Il menù", `<p>Il menù è stagionale ed è approvato da ATS Milano.</p>`],
      ["Diete speciali", `<p>Sono disponibili diete speciali, presentando la relativa certificazione. La richiesta si presenta
        al Comune, Settore Istruzione.</p>`],
      ["Come si accede al servizio", `<p>L'iscrizione alla mensa, le tariffe e i pagamenti sono gestiti dal Comune di
        Castelbruno, Settore Istruzione.</p>`],
      ["Contatti", COMUNE],
    ],
  },
  {
    id: "servizio-pre-post-scuola", cat: "famiglie", titolo: "Pre-scuola e post-scuola",
    descr: "Accoglienza dalle 7:30 e fino alle 18:00 per infanzia e primaria",
    argomenti: ["Famiglia", "Orari"],
    sezioni: [
      ["Cos'è", `<p>Il pre-scuola e il post-scuola sono servizi comunali per le famiglie che hanno bisogno di
        anticipare l'ingresso o posticipare l'uscita dei figli.</p>
        <ul>
          <li><strong>Pre-scuola</strong>: dalle 7:30 all'inizio delle lezioni</li>
          <li><strong>Post-scuola</strong>: dalla fine delle lezioni fino alle 18:00</li>
        </ul>`],
      ["A chi si rivolge", `<p>Alunni delle scuole dell'infanzia e delle scuole primarie, in tutti i plessi dell'Istituto.</p>`],
      ["Come si accede al servizio", `<p>L'iscrizione e le tariffe sono gestite dal Comune di Castelbruno, Settore Istruzione.</p>`],
      ["Contatti", COMUNE],
    ],
  },
  {
    id: "servizio-trasporto", cat: "famiglie", titolo: "Trasporto scolastico",
    descr: "Lo scuolabus comunale per i residenti di Cascina Verde e delle frazioni",
    argomenti: ["Trasporti", "Famiglia"],
    sezioni: [
      ["Cos'è", `<p>Il trasporto scolastico è un servizio comunale per gli alunni della scuola primaria e della scuola
        secondaria di I grado residenti a Cascina Verde e nelle frazioni.</p>`],
      ["Alunni dei comuni vicini", `<p>Gli alunni della secondaria che arrivano dai comuni limitrofi raggiungono la
        scuola con le linee extraurbane di trasporto pubblico.</p>`],
      ["Come si accede al servizio", `<p>L'iscrizione, i percorsi, le fermate e le tariffe sono gestiti dal Comune di
        Castelbruno, Settore Istruzione.</p>`],
      ["Contatti", COMUNE],
    ],
  },
  {
    id: "servizio-registro-elettronico", cat: "famiglie", titolo: "Registro elettronico e piattaforme",
    descr: "ClasseViva e Google Workspace for Education",
    argomenti: ["Famiglia", "Digitale"],
    sezioni: [
      ["Cos'è", `<p>L'Istituto usa due strumenti digitali:</p>
        <ul>
          <li><strong>ClasseViva</strong>, il registro elettronico: assenze, valutazioni, compiti, comunicazioni,
            prenotazione dei colloqui e pagella.</li>
          <li><strong>Google Workspace for Education</strong>, la piattaforma didattica, con un account personale della
            scuola per ogni alunno e docente.</li>
        </ul>`],
      ["Come si accede al servizio", `<p>Le credenziali di ClasseViva per le famiglie e gli account di Google Workspace
        per gli alunni sono consegnati dalla segreteria, area didattica, all'inizio del percorso scolastico.</p>`],
      ["Casi particolari", `<p>In caso di credenziali smarrite o scadute è possibile chiederne di nuove alla segreteria,
        via email o allo sportello.</p>`],
      ["Contatti", SEGRETERIA],
    ],
  },
  {
    id: "servizio-pagamenti", cat: "famiglie", titolo: "Pagamenti con PagoPA",
    descr: "Versamenti alla scuola tramite Pago In Rete",
    argomenti: ["Pagamenti", "Famiglia"],
    sezioni: [
      ["Cos'è", `<p>Tutti i pagamenti verso l'Istituto (per esempio contributi volontari, uscite didattiche e viaggi di
        istruzione) si effettuano con il sistema <strong>PagoPA</strong>, tramite il servizio <strong>Pago In Rete</strong>
        del Ministero dell'Istruzione e del Merito.</p>`],
      ["Come si accede al servizio", `<p>Si accede a Pago In Rete dal sito del Ministero con SPID, CIE o eIDAS. Dopo il
        primo accesso è necessario accettare le condizioni del servizio; la scuola associa poi i genitori agli alunni.
        Gli avvisi di pagamento si possono pagare online oppure stampare e pagare presso gli esercenti abilitati.</p>`],
      ["Casi particolari", `<p>Mensa, pre e post scuola e trasporto scolastico si pagano al Comune di Castelbruno, non
        alla scuola.</p>`],
      ["Contatti", SEGRETERIA],
    ],
  },
  {
    id: "servizio-sportello-ascolto", cat: "famiglie", titolo: "Sportello d'ascolto psicologico",
    descr: "Uno spazio di ascolto per alunni, famiglie e personale",
    argomenti: ["Benessere", "Famiglia"],
    sezioni: [
      ["Cos'è", `<p>Lo sportello d'ascolto è uno spazio riservato con uno psicologo, per affrontare difficoltà
        personali, scolastiche o relazionali. È rivolto ad alunni, famiglie e personale della scuola.</p>`],
      ["Come si accede al servizio", `<p>Le modalità di prenotazione e i giorni di presenza dello psicologo sono comunicati
        con una circolare all'inizio dell'anno scolastico. Per gli alunni minorenni è necessario il consenso dei genitori.</p>`],
      ["Contatti", SEGRETERIA],
    ],
  },
  {
    id: "servizio-segreteria", cat: "famiglie", titolo: "Segreteria",
    descr: "Orari, uffici e contatti della segreteria dell'Istituto",
    argomenti: ["Famiglia", "Personale"],
    sezioni: [
      ["Cos'è", `<p>La segreteria si trova in Via Alessandro Volta, 24, nel plesso della scuola secondaria, ed è
        organizzata in quattro uffici:</p>
        <ul>
          <li>Area didattica (alunni): iscrizioni, certificati, nulla osta, credenziali del registro elettronico</li>
          <li>Area personale</li>
          <li>Area contabilità</li>
          <li>Protocollo e affari generali</li>
        </ul>`],
      ["Orari", `<ul>
          <li>Dal lunedì al venerdì: 8:00 - 9:30 e 12:00 - 13:30</li>
          <li>Martedì e giovedì: anche 14:30 - 16:30</li>
        </ul>
        <p>Si riceve su appuntamento, da richiedere via email o per telefono.</p>`],
      ["Contatti", SEGRETERIA + `
                <p>PEC: <a href="mailto:miic8zh00q@pec.istruzione.it">miic8zh00q@pec.istruzione.it</a></p>`],
    ],
  },
  {
    id: "servizio-area-personale", cat: "personale", titolo: "Segreteria - area personale",
    descr: "Pratiche del personale docente e ATA",
    argomenti: ["Personale"],
    sezioni: [
      ["Cos'è", `<p>L'area personale della segreteria segue le pratiche del personale docente e ATA: presa di servizio,
        contratti, assenze e permessi, certificati di servizio e ricostruzioni di carriera.</p>`],
      ["Come si accede al servizio", `<p>Le richieste si presentano in segreteria o via email. Per le pratiche più
        complesse si consiglia di prendere appuntamento.</p>`],
      ["Contatti", SEGRETERIA],
    ],
  },
  {
    id: "servizio-piattaforme-personale", cat: "personale", titolo: "Registro elettronico e piattaforme",
    descr: "ClasseViva e Google Workspace for Education per i docenti",
    argomenti: ["Personale", "Digitale"],
    sezioni: [
      ["Cos'è", `<p>I docenti usano <strong>ClasseViva</strong> come registro elettronico e <strong>Google Workspace
        for Education</strong> come piattaforma didattica. L'animatore digitale, Prof. Luca Sironi, coordina il supporto
        e la formazione sugli strumenti digitali.</p>`],
      ["Come si accede al servizio", `<p>Le credenziali sono consegnate dalla segreteria al momento della presa di servizio.</p>`],
      ["Contatti", SEGRETERIA],
    ],
  },
];
// Lo sportello d'ascolto è rivolto anche al personale
const PER_PERSONALE = ["servizio-area-personale", "servizio-piattaforme-personale", "servizio-sportello-ascolto"];
const PER_FAMIGLIE = SERVIZI.filter((s) => s.cat === "famiglie").map((s) => s.id);
const byId = Object.fromEntries(SERVIZI.map((s) => [s.id, s]));

// ---------------------------------------------------------------- scheda del singolo servizio
const tpl = read("scuole-servizio-generico.html");
const pad2 = (n) => String(n).padStart(2, "0");

for (const sv of SERVIZI) {
  const cat = CAT[sv.cat];
  const indice = sv.sezioni.map(([t], i) => `
                    <li>
                      <a class="list-item scroll-anchor-offset" href="#art-par-${pad2(i + 1)}">${t}</a>
                    </li>`).join("");
  const corpo = sv.sezioni.map(([t, html], i) => `
                <h2 class="h4" id="art-par-${pad2(i + 1)}">${t}</h2>
                <div class="row variable-gutters">
                  <div class="col-lg-9">
                    ${html}
                  </div>
                </div>`).join("\n");
  let s = tpl
    .replace(/<title>[^<]*<\/title>/, `<title>${sv.titolo} - Istituto Comprensivo Homo Sapiens</title>`)
    .replace(/<li class="breadcrumb-item"><a href="[^"]*" title="Vai alla pagina: Servizi">Famiglie e studenti<\/a><\/li>/,
      `<li class="breadcrumb-item"><a href="/${cat.pagina}" title="Vai alla pagina: ${cat.label}">${cat.label}</a></li>`)
    .replace(/<li class="breadcrumb-item active" aria-current="page"><span>[^<]*<\/span><\/li>/,
      `<li class="breadcrumb-item active" aria-current="page"><span>${sv.titolo}</span></li>`)
    .replace(/<small class="h6 text-purplelight">[^<]*<\/small>/, `<small class="h6 text-purplelight">${cat.label}</small>`)
    .replace(/(<h1 class="mb-3" data-element="service-title">)[^<]*(<\/h1>)/, `$1${sv.titolo}$2`)
    .replace(/(<p data-element="service-description">)[^<]*(<\/p>)/, `$1${sv.descr}$2`)
    .replace(/(<div class="badges">)[\s\S]*?(<\/div><!-- \/badges -->)/, `$1${sv.argomenti.map((a) => `
                  <span class="badge badge-sm badge-pill badge-outline-purplelight">${a}</span>`).join("")}
                $2`)
    .replace(/\s*<section class="bg-alert py-2" id="alert">[\s\S]*?<\/section>/, "")
    .replace(/(<ul class="link-list" data-element="page-index">)[\s\S]*?(<\/ul>)/, `$1${indice}
                  $2`)
    .replace(/<article class="article-wrapper">[\s\S]*?<\/article>/, `<article class="article-wrapper">${corpo}
                <p class="mt-5 text-muted"><small>Anno scolastico 2026/2027</small></p>
              </article>`)
    // "Altri contenuti che potrebbero interessarti": segnaposto del template
    .replace(/\s*<section class="section bg-gray-gradient py-5">[\s\S]*?<\/section>(\s*<\/main>)/, "$1");
  write(`${sv.id}.html`, s);
}

// ---------------------------------------------------------------- elenchi per tipologia
function elenco(file, sorgente, cat, ids) {
  let s = read(sorgente);
  const voci = ids.map((id) => byId[id]).map((sv) => `
              <article class="card card-bg card-article card-article-purplelight">
                <div class="card-body">
                  <div class="card-article-content">
                    <h2 class="h3"><a href="/${sv.id}.html" data-element="service-link">${sv.titolo}</a></h2>
                    <p>${sv.descr}</p>
                  </div><!-- /card-avatar-content -->
                </div><!-- /card-body -->
              </article><!-- /card card-bg card-article -->`).join("");
  const filtri = Object.entries(CAT).map(([k, c]) => `
                  <li>${k === cat ? `<strong>${c.label}</strong>` : `<a href="/${c.pagina}">${c.label}</a>`}</li>`).join("");
  s = s
    .replace(/<title>[^<]*<\/title>/, `<title>${CAT[cat].label} - Servizi</title>`)
    .replace(/<li class="breadcrumb-item active" aria-current="page"><span>[^<]*<\/span><\/li>/,
      `<li class="breadcrumb-item active" aria-current="page"><span>${CAT[cat].label}</span></li>`)
    .replace(/(<h1 class="p-0 mb-2">)[^<]*(<\/h1>)/, `$1${CAT[cat].label}$2`)
    .replace(/(<h2 class="h6"><strong>Tipologia<\/strong><\/h2>\s*<ul>)[\s\S]*?(<\/ul>)/, `$1${filtri}
                $2`)
    .replace(/(<div class="col-lg-7 offset-lg-1 pt84">)[\s\S]*?(<\/div><!-- \/col-lg-8 -->\s*<\/div><!-- \/row -->)/,
      `$1${voci}
            $2`);
  write(file, s);
}
elenco("scuole-servizio-tipologia.html", "scuole-servizio-tipologia.html", "famiglie", PER_FAMIGLIE);
elenco("servizi-personale.html", "scuole-servizio-tipologia.html", "personale", PER_PERSONALE);

// ---------------------------------------------------------------- panoramica Servizi
{
  let s = read("scuole-sezione-servizi.html");
  const card = (href, t, d) => `
            <div class="col-lg-4 mb-3 mb-lg-4">
              <div class="card card-bg card-icon h-100 rounded">
                <a href="${href}" class="h-100">
                  <div class="card-body">
                    <svg class="icon svg-service">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-service"></use>
                    </svg>
                    <div class="card-icon-content">
                      <p><strong>${t}</strong></p>
                      <small>${d}</small>
                    </div><!-- /card-icon-content -->
                  </div><!-- /card-body -->
                </a>
              </div><!-- /card card-bg rounded -->
            </div><!-- /col-lg-4 -->`;
  const gruppo = (bg, titolo, cards, tutti) => `
      <section class="section ${bg} py-5">
        <div class="container">
          <div class="title-section mb-5">
            <h2 class="h4">${titolo}</h2>
          </div><!-- /title-large -->
          <div class="row variable-gutters">${cards.join("")}
          </div><!-- /row -->${tutti ? `
          <div class="pt-3 text-center">
            <a class="text-underline" href="${tutti}"><strong>Vedi tutti</strong></a>
          </div>` : ""}
        </div><!-- /container -->
      </section><!-- /section -->`;
  const sv = (id) => card(`/${id}.html`, byId[id].titolo, byId[id].descr);
  const html =
    gruppo("bg-white", "Famiglie e studenti", PER_FAMIGLIE.map(sv), "/scuole-servizio-tipologia.html") +
    gruppo("bg-gray-light", "Personale scolastico", PER_PERSONALE.map(sv), "/servizi-personale.html") +
    gruppo("bg-white", "Percorsi di studio", [
      card("/scuola-infanzia.html", "Scuola dell'infanzia", "Due plessi, 40 ore settimanali"),
      card("/scuola-primaria.html", "Scuola primaria", "Due plessi, tempo pieno 40 ore"),
      card("/scuola-secondaria.html", "Scuola secondaria di I grado", "Tempo normale 30 ore, francese o spagnolo"),
    ]);
  s = s.replace(/(<h1 class="p-0 mb-2">Servizi<\/h1>\s*<p[^>]*>)[\s\S]*?(<\/p>)/,
    "$1I servizi dell'Istituto e del Comune per famiglie, studenti e personale scolastico$2");
  const h1 = s.indexOf("<h1", s.indexOf("<main"));
  const inizio = s.indexOf("\n", s.indexOf("</section>", h1)) + 1;
  s = s.slice(0, inizio) + html + "\n\n    " + s.slice(s.indexOf("</main>", inizio));
  write("scuole-sezione-servizi.html", s);
}

// ---------------------------------------------------------------- menu e collegamenti in tutte le pagine
for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html") && f !== "templates.html")) {
  let s = read(f);
  const prima = s;
  s = s
    .replace(/href="\/scuole-servizio-tipologia\.html"([^>]*)>Personale scolastico</g, 'href="/servizi-personale.html"$1>Personale scolastico<')
    .replace(/href="\/scuole-servizio-generico\.html"([^>]*)>Percorsi di studio</g, 'href="/scuole-didattica.html"$1>Percorsi di studio<')
    .replace(/<a href="#" title="Vai alla pagina: Servizi">Servizi<\/a>/g, '<a href="/scuole-sezione-servizi.html" title="Vai alla pagina: Servizi">Servizi</a>');
  if (s !== prima) write(f, s);
}
console.log(`Servizi: ${SERVIZI.length} schede, 2 elenchi e panoramica aggiornati.`);
