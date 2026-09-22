// Applica i dati della scheda anagrafica (Desktop/base/scheda-anagrafica-ic-homo-sapiens.md)
// alla sezione "Scuola" del sito, al footer e ai collegamenti di tutte le pagine.
// Tutti i dati sono fittizi. Uso: node scripts/scheda.mjs (dopo istituto-comprensivo.mjs)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const read = (f) => readFileSync(join(DIR, f), "utf8");
const write = (f, s) => writeFileSync(join(DIR, f), s);

// ---------------------------------------------------------------- dati
const IST = {
  nome: 'Istituto Comprensivo "Homo Sapiens"',
  indirizzo: "Via Alessandro Volta, 24 - 20079 Castelbruno (MI)",
  tel: "02 9637 4410",
  email: "miic8zh00q@istruzione.it",
  pec: "miic8zh00q@pec.istruzione.it",
  meccanografico: "MIIC8ZH00Q",
  cf: "97654320158",
  ipa: "istsc_miic8zh00q",
  cuf: "UFZH7Q",
  as: "2026/2027",
};

const PLESSI = [
  { gruppo: "Scuole dell'infanzia", nome: 'Infanzia "Maria Montessori"', codice: "MIAA8ZH01L", indirizzo: "Via dei Tigli, 5 - Borgo San Rocco", dettaglio: "3 sezioni, 75 alunni" },
  { gruppo: "Scuole dell'infanzia", nome: 'Infanzia "Il Girasole"', codice: "MIAA8ZH02N", indirizzo: "Via Cascina Verde, 12", dettaglio: "3 sezioni, 75 alunni" },
  { gruppo: "Scuole primarie", nome: 'Primaria "Gianni Rodari"', codice: "MIEE8ZH01T", indirizzo: "Via Alessandro Manzoni, 31 - Centro", dettaglio: "10 classi, sezioni A-B, 225 alunni, tempo pieno" },
  { gruppo: "Scuole primarie", nome: 'Primaria "Don Lorenzo Milani"', codice: "MIEE8ZH02V", indirizzo: "Via Cascina Verde, 14", dettaglio: "10 classi, sezioni C-D, 225 alunni, tempo pieno" },
  { gruppo: "Scuola secondaria di I grado", nome: 'Secondaria "Rita Levi-Montalcini"', codice: "MIMM8ZH01R", indirizzo: "Via Alessandro Volta, 24 - Centro", dettaglio: "24 classi, sezioni A-H, 600 alunni" },
];

const STAFF = [
  ["Dott.ssa Chiara Valsecchi", "Dirigente scolastica"],
  ["Prof. Marco Brambilla", "Primo collaboratore del DS (secondaria)"],
  ["Ins. Paola Colombo", 'Seconda collaboratrice del DS (primaria "Rodari")'],
  ["Dott. Giorgio Ferrario", "Direttore dei servizi generali e amministrativi (DSGA)"],
];
const REFERENTI = [
  ["Prof. Luca Sironi", "Animatore digitale"],
  ["Ins. Anna Bonfanti", "Referente inclusione"],
  ["Prof.ssa Silvia Radaelli", "Referente bullismo e cyberbullismo"],
  ["Prof.ssa Elena Cattaneo", "Referente educazione civica"],
  ["Prof. Davide Mauri", "Referente orientamento"],
];
const REF_PLESSO = [
  ["Ins. Giulia Riva", 'Infanzia "Montessori"'],
  ["Ins. Roberta Galli", 'Infanzia "Il Girasole"'],
  ["Ins. Paola Colombo", 'Primaria "Rodari"'],
  ["Ins. Stefania Pozzi", 'Primaria "Milani"'],
  ["Prof. Marco Brambilla", 'Secondaria "Levi-Montalcini"'],
];
const FUNZIONI = [
  ["Prof.ssa Laura Crippa", "Funzione strumentale PTOF e valutazione"],
  ["Ins. Anna Bonfanti", "Funzione strumentale inclusione"],
  ["Prof. Davide Mauri", "Funzione strumentale continuità e orientamento"],
  ["Prof. Luca Sironi", "Funzione strumentale tecnologie e innovazione digitale"],
];
const ESTERNI = [
  ["Ing. Fabio Locatelli", "Responsabile servizio prevenzione e protezione (RSPP)"],
  ["Avv. Michela Arosio", "Responsabile protezione dati (DPO)"],
];

// ---------------------------------------------------------------- componenti
const avatar = (nome, ruolo, dark = false) => `
                <div class="col-lg-4">
                  <div class="card card-bg${dark ? " bg-color bg-dark" : ""} card-avatar rounded mb-3">
                    <div class="card-body">
                      <div class="card-avatar-img">
                        <img src="assets/placeholders/img-avatar-250x250.png" alt="">
                      </div><!-- /card-avatar-img -->
                      <div class="card-avatar-content">
                        <p><strong>${nome}</strong></p>
                        <small>${ruolo}</small>
                      </div><!-- /card-avatar-content -->
                    </div><!-- /card-body -->
                  </div><!-- /card card-bg card-avatar rounded -->
                </div><!-- /col-lg-4 -->`;

const gruppoPersone = (bg, titolo, righe, primaScura = false) => `
      <section class="section ${bg} py-5">
        <div class="container">
          <div class="row variable-gutters mb-4">
            <div class="col-lg-3">
              <h2 class="text-lg-right mb-3 h4">${titolo}</h2>
            </div><!-- /col-lg-3 -->
            <div class="col-lg-9">
              <div class="row variable-gutters">${righe.map(([n, r], i) => avatar(n, r, primaScura && i === 0)).join("")}
              </div><!-- /row -->
            </div><!-- /col-lg-9 -->
          </div><!-- /row -->
        </div><!-- /container -->
      </section><!-- /section -->`;

const cardLuogo = (titolo, sotto) => `
          <div class="card card-bg card-icon rounded mb-3">
            <a href="#" data-element="location-link">
              <div class="card-body">
                <svg class="icon svg-marker-simple">
                  <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#svg-marker-simple"></use>
                </svg>
                <div class="card-icon-content">
                  <p><strong>${titolo}</strong></p>
                  <small>${sotto}</small>
                </div><!-- /card-icon-content -->
              </div><!-- /card-body -->
            </a>
          </div><!-- /card card-bg card-icon rounded -->`;

const cardDoc = (titolo, descr, href = "#") => `
            <div class="col-lg-4 mb-3 mb-lg-4">
              <div class="card card-bg card-icon h-100 rounded">
                <a href="${href}"${href.startsWith("http") ? ' target="_blank" rel="noopener"' : ""}>
                  <div class="card-body">
                    <svg class="icon it-pdf-document">
                      <use xmlns:xlink="http://www.w3.org/1999/xlink" xlink:href="#it-pdf-document"></use>
                    </svg>
                    <div class="card-icon-content">
                      <p><strong>${titolo}</strong></p>
                      <small>${descr}</small>
                    </div><!-- /card-icon-content -->
                  </div><!-- /card-body -->
                </a>
              </div><!-- /card card-bg rounded -->
            </div><!-- /col-lg-4 -->`;

const sezioneDoc = (bg, titolo, docs) => `
      <section class="section ${bg} py-5">
        <div class="container">
          <div class="title-section mb-5">
            <h2 class="h4">${titolo}</h2>
          </div><!-- /title-large -->
          <div class="row variable-gutters">${docs.map((d) => cardDoc(...d)).join("")}
          </div><!-- /row -->
        </div><!-- /container -->
      </section><!-- /section -->`;

const articolo = (bg, html) => `
      <section class="section ${bg} py-5">
        <div class="container">
          <div class="row variable-gutters d-flex justify-content-center">
            <div class="col-lg-8">
              <article class="article-wrapper">
${html}
              </article>
            </div><!-- /col-lg-8 -->
          </div><!-- /row -->
        </div><!-- /container -->
      </section><!-- /section -->`;

const tabella = (intest, righe) => `
                <div class="table-responsive mb-4">
                  <table class="table">
                    <thead><tr>${intest.map((h) => `<th scope="col">${h}</th>`).join("")}</tr></thead>
                    <tbody>
${righe.map((r) => `                      <tr>${r.map((c, i) => i === 0 ? `<th scope="row">${c}</th>` : `<td>${c}</td>`).join("")}</tr>`).join("\n")}
                    </tbody>
                  </table>
                </div>`;

// Sostituisce tutto il contenuto di <main> dopo la sezione hero (quella con l'<h1>)
function dopoHero(html, nuovo) {
  const h1 = html.indexOf("<h1", html.indexOf("<main"));
  const fineHero = html.indexOf("</section>", h1);
  const inizio = html.indexOf("\n", fineHero) + 1;
  const fine = html.indexOf("</main>", inizio);
  return html.slice(0, inizio) + nuovo + "\n\n    " + html.slice(fine);
}
const sottotitoloHero = (html, testo) =>
  html.replace(/(<h1 class="p-0 mb-2">[^<]*<\/h1>\s*<p class="h4 font-weight-normal">)[^<]*(<\/p>)/, `$1${testo}$2`);

// ---------------------------------------------------------------- 1. tutte le pagine
const FOOTER_TESTO = `<p>${IST.nome} - ${IST.indirizzo} - Telefono: <a href="tel:+390296374410">${IST.tel}</a> - Email:
              <a href="mailto:${IST.email}">${IST.email}</a> - Posta elettronica certificata (PEC): <a href="mailto:${IST.pec}">${IST.pec}</a><br>Codice meccanografico: ${IST.meccanografico} -
              Codice Indice delle Pubbliche Amministrazioni (IPA): ${IST.ipa} - Codice fiscale ${IST.cf} - Codice univoco fatturazione elettronica (CUF): ${IST.cuf}
            </p>`;
const LINK_ESTERNI = {
  "Ministero dell'Istruzione e del Merito": "https://www.mim.gov.it/",
  "Ufficio Scolastico Regionale": "https://usr.istruzione.lombardia.gov.it/",
  "Ufficio Scolastico Territoriale": "https://milano.istruzione.lombardia.gov.it/",
  "Scuola in Chiaro": "https://unica.istruzione.gov.it/",
  "Iscrizioni online": "https://unica.istruzione.gov.it/",
  "Invalsi": "https://www.invalsi.it/",
};

for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html") && f !== "templates.html")) {
  let s = read(f);
  const prima = s;
  s = s
    // Contatti nel footer
    .replace(/<div class="col-lg-12 text-left text-md-center footer-text">\s*<p>[\s\S]*?<\/p>/,
      `<div class="col-lg-12 text-left text-md-center footer-text">\n            ${FOOTER_TESTO}`)
    // Voci Didattica duplicate nel footer (versione su più righe)
    .replace(/\n *<li>\n *<a class="text-underline-hover" href="\/scuola-(?:infanzia|primaria|secondaria)\.html">[^<]*<\/a>\n *<\/li>/g, "")
    // I numeri della scuola / La storia: pagine dedicate
    .replace(/href="\/scuole-pagina-singola\.html"([^>]*)>I numeri della scuola</g, 'href="/scuola-numeri.html"$1>I numeri della scuola<')
    .replace(/href="\/scuole-pagina-singola\.html"([^>]*)>La storia</g, 'href="/scuola-storia.html"$1>La storia<')
    // Briciole di pane
    .replace(/<a href="#" title="Vai alla pagina: Home">/g, '<a href="/" title="Vai alla pagina: Home">')
    .replace(/<a href="#" title="Vai alla pagina: Scuola">/g, '<a href="/scuole-la-scuola.html" title="Vai alla pagina: Scuola">')
    // Collegamenti esterni
    .replace(/aria-label="Iscrizioni On LIne - link esterno - apertura nuova scheda">Iscrizioni On LIne/g,
      'aria-label="Iscrizioni online - link esterno - apertura nuova scheda">Iscrizioni online')
    .replace(/aria-label="Comune - link esterno - apertura nuova scheda">Comune</g,
      'aria-label="Comune di Castelbruno - link esterno - apertura nuova scheda">Comune di Castelbruno<');
  for (const [label, url] of Object.entries(LINK_ESTERNI)) {
    s = s.replace(new RegExp(`href="#" target="_blank"(\\s+)aria-label="${label} - `, "g"),
      `href="${url}" target="_blank" rel="noopener"$1aria-label="${label} - `);
  }
  if (s !== prima) write(f, s);
}

// ---------------------------------------------------------------- 2. La scuola (panoramica)
{
  let s = read("scuole-la-scuola.html");
  s = s
    .replace(/<h2>Da sempre una realtà differente nel sistema scolastico italiano<\/h2>/,
      "<h2>Dalla scuola dell'infanzia alla secondaria di I grado: 1.200 alunni, cinque plessi, un unico percorso a Castelbruno</h2>")
    // La timeline storica del template non riguarda l'Istituto: la storia è ancora da scrivere
    .replace(/\s*<section class="section section-padding bg-blue-dark history-box">[\s\S]*?<\/section><!-- \/section -->/, "")
    .replace(/Una scuola è fatta di Le persone\. Ecco come siamo organizzati e come possiamo entrare in\s*contatto/,
      "Una scuola è fatta di persone. Ecco come siamo organizzati e come entrare in contatto con noi")
    .replace(/<h3 class="h4">Dirigenza<\/h3>(\s*<p>[^<]*<\/p>)*/, '<h3 class="h4">Dirigenza</h3>\n                    <p>Dott.ssa Chiara Valsecchi, dirigente scolastica</p>')
    .replace(/<h3 class="h4">Segreteria<\/h3>(\s*<p>[^<]*<\/p>)*/, `<h3 class="h4">Segreteria</h3>\n                    <p>Via Alessandro Volta, 24 - tel. ${IST.tel}</p>`)
    .replace(/href="#">Tutta l'organizzazione/, 'href="/scuole-scheda-organizzazione.html">Tutta l\'organizzazione')
    .replace(/<h3><a href="#\/">Piano triennale offerta formativa \(PTOF\) 2022-2025<\/a><\/h3>/,
      '<h3><a href="/scuole-documenti.html">Piano triennale dell\'offerta formativa (PTOF) 2025/26 - 2027/28</a></h3>')
    .replace(/aria-label="scopri PTOF 2022-2025 "/, 'aria-label="scopri il PTOF 2025/26 - 2027/28"')
    .replace(/<h3><a href="#">Rapporto di autovalutazione \(RAV\)<\/a>/, '<h3><a href="/scuole-documenti.html">Rapporto di autovalutazione (RAV)</a>')
    .replace(/<h3><a href="#">Regolamento d'Istituto<\/a>/, '<h3><a href="/scuole-documenti.html">Regolamento d\'istituto</a>')
    .replace(/<p>Versione dicembre 2021<\/p>/, "<p>Comprende il regolamento di disciplina della scuola secondaria</p>")
    .replace(/<a class="read-more" href="#" aria-label="scopri/g, '<a class="read-more" href="/scuole-documenti.html" aria-label="scopri')
    .replace(/href="#">Vedi tutti i luoghi/, 'href="/scuole-luoghi.html">Vedi tutti i luoghi')
    .replace(/Gli edifici dell'Istituto: scuola dell'infanzia, scuola primaria e scuola secondaria di I grado/,
      "Due scuole dell'infanzia, due scuole primarie e una scuola secondaria di I grado nel centro, a Borgo San Rocco e a Cascina Verde")
    .replace(/Dati ultimo anno ut enim ad minima veniam, nostrum exercitationem ullam\./, `Dati dell'anno scolastico ${IST.as}.`)
    .replace(/<p>993<\/p>/, "<p>1.200</p>")
    .replace(/<p>43<\/p>/, "<p>50</p>")
    .replace(/<p>23<\/p>(\s*<small>Media alunni \/ classe)/, "<p>24</p>$1")
    .replace(/<p>Numero classi<\/p>/, "<p>Classi e sezioni</p>")
    .replace(/aria-label="scopri di più sulla scuola in numeri" class="btn btn-redbrown" href="#"/,
      'aria-label="scopri di più sulla scuola in numeri" class="btn btn-redbrown" href="/scuola-numeri.html"');
  write("scuole-la-scuola.html", s);
}

// ---------------------------------------------------------------- 3. Presentazione
{
  let s = read("scuole-presentazione.html");
  s = sottotitoloHero(s, "Chi siamo, dove siamo, che cosa ci caratterizza");
  const testo = `
                <h2 class="h4">Chi siamo</h2>
                <p>L'${IST.nome} accompagna bambine, bambini e ragazzi dai 3 ai 14 anni: dalla scuola dell'infanzia
                  alla scuola secondaria di I grado. Nell'anno scolastico ${IST.as} accoglie <strong>1.200 alunni</strong>
                  in <strong>50 tra classi e sezioni</strong>, distribuiti in cinque plessi.</p>
                <h2 class="h4">Il territorio</h2>
                <p>L'Istituto si trova a <strong>Castelbruno</strong> (MI), città di circa 51.000 abitanti nell'hinterland
                  nord-ovest di Milano, a circa 20 km dal capoluogo e collegata dalla linea ferroviaria suburbana. Il
                  territorio, di pianura, è attraversato dal torrente Olona: accanto al centro storico di origine medievale
                  ci sono quartieri residenziali sorti tra gli anni '60 e '80 e, a nord, una zona artigianale e industriale.</p>
                <p>In città ci sono tre istituti comprensivi statali: il nostro serve il <strong>centro</strong> e i quartieri
                  <strong>Borgo San Rocco</strong> e <strong>Cascina Verde</strong>. Mensa, trasporto scolastico, pre e
                  post scuola e assistenza educativa per gli alunni con disabilità sono gestiti con il Comune di
                  Castelbruno, Settore Istruzione.</p>
                <h2 class="h4">I nostri plessi</h2>
                <ul>
${PLESSI.map((p) => `                  <li><strong>${p.nome}</strong> - ${p.indirizzo} (${p.dettaglio})</li>`).join("\n")}
                </ul>
                <p>La sede legale, la presidenza e la segreteria si trovano nel plesso della secondaria, in Via Alessandro Volta, 24.</p>
                <h2 class="h4">Che cosa ci caratterizza</h2>
                <ul>
                  <li><strong>"Olona bene comune"</strong>: educazione ambientale in tutti gli ordini di scuola, in collaborazione con il Parco locale.</li>
                  <li><strong>Continuità "Ponti"</strong>: open day e laboratori ponte per il passaggio dall'infanzia alla primaria e dalla primaria alla secondaria, aperti anche agli alunni delle primarie dei comuni vicini.</li>
                  <li><strong>Inglese potenziato</strong>: certificazione Cambridge A2 Key in classe terza della secondaria.</li>
                  <li><strong>Coding e robotica</strong> alla primaria e alla secondaria.</li>
                  <li><strong>Sportello d'ascolto psicologico</strong> per alunni, famiglie e personale.</li>
                </ul>`;
  const link = [
    ["I numeri della scuola", "Alunni, classi e personale", "/scuola-numeri.html"],
    ["I luoghi", "I cinque plessi e la segreteria", "/scuole-luoghi.html"],
    ["Organizzazione", "Organi collegiali e segreteria", "/scuole-scheda-organizzazione.html"],
    ["Le persone", "Dirigenza, staff e referenti", "/scuole-sezione-persone.html"],
  ];
  const cards = `
      <section class="section bg-gray-light py-5">
        <div class="container">
          <div class="row variable-gutters">${link.map(([t, d, h]) => `
            <div class="col-lg-3 col-md-6 mb-3">
              <div class="card card-bg card-icon h-100 rounded">
                <a href="${h}">
                  <div class="card-body">
                    <div class="card-icon-content">
                      <p><strong>${t}</strong></p>
                      <small>${d}</small>
                    </div>
                  </div>
                </a>
              </div>
            </div>`).join("")}
          </div><!-- /row -->
        </div><!-- /container -->
      </section><!-- /section -->`;
  write("scuole-presentazione.html", dopoHero(s, articolo("bg-white", testo) + cards));
}

// ---------------------------------------------------------------- 4. I luoghi
{
  let s = read("scuole-luoghi.html");
  s = sottotitoloHero(s, "I cinque plessi dell'Istituto a Castelbruno");
  s = s.replace(/<p class="h4 font-weight-normal">Questi sono i luoghi della nostra scuola<\/p>/,
    '<p class="h4 font-weight-normal">I cinque plessi dell\'Istituto a Castelbruno</p>');
  const gruppi = [...new Set(PLESSI.map((p) => p.gruppo))];
  const html = gruppi.map((g) => `
          <h2 class="h3">${g}</h2>${PLESSI.filter((p) => p.gruppo === g).map((p) => cardLuogo(p.nome, `${p.indirizzo}<br>${p.dettaglio}`)).join("")}`).join("") + `
          <h2 class="h3">Segreteria e presidenza</h2>${cardLuogo("Segreteria", `Via Alessandro Volta, 24 - Centro<br>Tel. ${IST.tel}`)}
        `;
  s = s.replace(/(<div class="map-aside">)[\s\S]*?(<\/div>\s*<div class="map-wrapper">)/, `$1${html}$2`);
  write("scuole-luoghi.html", s);
}

// ---------------------------------------------------------------- 5. Le carte della scuola
{
  let s = read("scuole-documenti.html");
  s = sottotitoloHero(s, "I documenti fondamentali dell'Istituto");
  const sezioni =
    sezioneDoc("bg-white", "Progettazione e autovalutazione", [
      ["Piano triennale dell'offerta formativa (PTOF)", "Triennio 2025/26 - 2027/28, con aggiornamento annuale approvato dal Consiglio d'istituto"],
      ["Rapporto di autovalutazione (RAV)", "Ultima pubblicazione su Scuola in Chiaro", "https://unica.istruzione.gov.it/"],
      ["Piano di miglioramento", "Le azioni di miglioramento collegate al RAV"],
      ["Curricolo verticale", "Dall'infanzia alla secondaria, comprende il curricolo di educazione civica"],
    ]) +
    sezioneDoc("bg-gray-light", "Regolamenti", [
      ["Regolamento d'istituto", "Comprende il regolamento di disciplina della scuola secondaria"],
      ["Patto educativo di corresponsabilità", "L'impegno condiviso tra scuola, famiglie e alunni"],
    ]) +
    sezioneDoc("bg-white", "Inclusione e servizi", [
      ["Piano annuale per l'inclusione (PAI)", "Le azioni per l'inclusione di tutti gli alunni"],
      ["Protocollo di accoglienza alunni stranieri", "Modalità di iscrizione, inserimento e accompagnamento"],
      ["Carta dei servizi", "I servizi offerti dall'Istituto e i relativi standard"],
    ]);
  write("scuole-documenti.html", dopoHero(s, sezioni));
}

// ---------------------------------------------------------------- 6. Le persone
{
  let s = read("scuole-sezione-persone.html");
  // Il template ha una sezione e un </main> in più dopo la chiusura del contenuto
  s = s.replace(/(<\/main>)\s*<section class="section bg-light py-5 mt-3">[\s\S]*?<\/section>\s*<\/main>/, "$1");
  s = s.replace(/(<h1 class="p-0 mb-2">Le persone<\/h1>\s*<p[^>]*>)[\s\S]*?(<\/p>)/,
    "$1Dirigenza, staff, referenti e funzioni strumentali dell'Istituto$2");
  const sezioni =
    gruppoPersone("bg-gray-light", "Dirigenza e staff", STAFF, true) +
    gruppoPersone("bg-white", "Referenti di plesso", REF_PLESSO.map(([n, p]) => [n, `Referente di plesso - ${p}`])) +
    gruppoPersone("bg-gray-light", "Referenti", REFERENTI) +
    gruppoPersone("bg-white", "Funzioni strumentali", FUNZIONI) +
    gruppoPersone("bg-gray-light", "Figure esterne", ESTERNI);
  write("scuole-sezione-persone.html", dopoHero(s, sezioni));
}

// ---------------------------------------------------------------- 7. Organizzazione
{
  let s = read("scuole-scheda-organizzazione.html");
  s = sottotitoloHero(s, "Organi collegiali, segreteria e personale dell'Istituto");
  const organi = `
                <h2 class="h4">Dirigenza</h2>
                <p>La dirigente scolastica è la <strong>Dott.ssa Chiara Valsecchi</strong>, affiancata dal primo collaboratore
                  Prof. Marco Brambilla e dalla seconda collaboratrice Ins. Paola Colombo. I servizi generali e amministrativi sono
                  diretti dal DSGA, Dott. Giorgio Ferrario. <a href="/scuole-sezione-persone.html">Vedi tutte le persone</a>.</p>
                <h2 class="h4">Organi collegiali</h2>
                <ul>
                  <li><strong>Consiglio d'istituto</strong>: 19 membri (8 docenti, 8 genitori, 2 rappresentanti del personale ATA
                    e la dirigente scolastica). Presidente: sig. Andrea Mariani (genitore).</li>
                  <li><strong>Giunta esecutiva</strong>: presieduta dalla dirigente scolastica; ne fanno parte il DSGA, 1 docente,
                    2 genitori e 1 rappresentante del personale ATA.</li>
                  <li><strong>Collegio dei docenti</strong>: unitario, con articolazioni per ordine di scuola.</li>
                  <li><strong>Comitato di valutazione</strong>.</li>
                  <li><strong>Organo di garanzia</strong>: per la scuola secondaria di I grado.</li>
                </ul>
                <h2 class="h4">Segreteria</h2>
                <p>Via Alessandro Volta, 24 - 20079 Castelbruno (MI) - Tel. ${IST.tel} - Email
                  <a href="mailto:${IST.email}">${IST.email}</a></p>
${tabella(["Giorni", "Apertura al pubblico"], [
  ["Dal lunedì al venerdì", "8:00 - 9:30 e 12:00 - 13:30"],
  ["Martedì e giovedì", "anche 14:30 - 16:30"],
])}
                <p>Si riceve su appuntamento, da richiedere via email o per telefono. La segreteria è organizzata in quattro
                  uffici: area didattica (alunni), area personale, area contabilità, protocollo e affari generali.</p>
                <h2 class="h4">Il personale</h2>
                <p>Organico indicativo per l'anno scolastico ${IST.as}.</p>
${tabella(["Categoria", "Numero"], [
  ["Docenti scuola dell'infanzia (posto comune)", "12"],
  ["Docenti scuola primaria (posto comune, inglese, motoria)", "44"],
  ["Docenti scuola secondaria di I grado", "44"],
  ["Docenti di sostegno (tutti gli ordini)", "28"],
  ["Docenti di religione cattolica", "4"],
  ["<strong>Totale docenti</strong>", "<strong>132</strong>"],
  ["DSGA", "1"],
  ["Assistenti amministrativi", "7"],
  ["Collaboratori scolastici", "26"],
  ["<strong>Totale personale ATA</strong>", "<strong>34</strong>"],
])}`;
  write("scuole-scheda-organizzazione.html", dopoHero(s, articolo("bg-white", organi)));
}

// ---------------------------------------------------------------- 8. Pagine nuove: numeri e storia
function paginaSingola(file, titolo, sottotitolo, corpo) {
  let s = read("scuole-pagina-singola.html")
    .replace(/<title>[^<]*<\/title>/, `<title>${titolo} - Istituto Comprensivo Homo Sapiens</title>`)
    .replace(/<li class="breadcrumb-item active" aria-current="page"><span>[\s\S]*?<\/span><\/li>/,
      `<li class="breadcrumb-item"><a href="/scuole-la-scuola.html" title="Vai alla pagina: Scuola">Scuola</a></li>
                    <li class="breadcrumb-item active" aria-current="page"><span>${titolo}</span></li>`)
    .replace(/<h1 class="h2 mb-3">[^<]*<\/h1>\s*<p>[^<]*<\/p>/, `<h1 class="h2 mb-3">${titolo}</h1>\n                <p>${sottotitolo}</p>`)
    .replace(/<article class="article-wrapper">[\s\S]*?<\/article>/, `<article class="article-wrapper">\n${corpo}\n              </article>`);
  write(file, s);
}

paginaSingola("scuola-numeri.html", "I numeri della scuola", `Anno scolastico ${IST.as}`, `
                <h2 class="h4">Alunni, classi e sezioni</h2>
${tabella(["Ordine di scuola", "Plessi", "Classi / sezioni", "Alunni"], [
  ["Scuola dell'infanzia", "2", "6 sezioni", "150"],
  ["Scuola primaria", "2", "20 classi", "450"],
  ["Scuola secondaria di I grado", "1", "24 classi", "600"],
  ["<strong>Totale</strong>", "<strong>5</strong>", "<strong>50</strong>", "<strong>1.200</strong>"],
])}
                <h2 class="h4">Plessi</h2>
${tabella(["Plesso", "Codice", "Indirizzo", "Classi e alunni"], PLESSI.map((p) => [p.nome, p.codice, p.indirizzo, p.dettaglio]))}
                <p>Una parte consistente degli alunni della secondaria proviene dalle scuole primarie dei comuni vicini:
                  per questo la secondaria ha 8 sezioni, mentre le primarie dell'Istituto ne hanno 4.</p>
                <h2 class="h4">Il personale</h2>
                <p>132 docenti (di cui 28 di sostegno) e 34 unità di personale ATA. Il dettaglio è nella pagina
                  <a href="/scuole-scheda-organizzazione.html">Organizzazione</a>.</p>`);

paginaSingola("scuola-storia.html", "La storia", "La storia dell'Istituto Comprensivo Homo Sapiens", `
                <p>Questa pagina è in preparazione: presto racconteremo la nascita dell'Istituto e l'origine della sua intitolazione.</p>
                <p>Nel frattempo puoi leggere la <a href="/scuole-presentazione.html">presentazione della scuola</a>.</p>`);

console.log("Dati della scheda anagrafica applicati.");
