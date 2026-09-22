// Imposta il sito come Istituto Comprensivo: didattica organizzata per
// Scuola dell'infanzia, Scuola primaria e Scuola secondaria di I grado.
// Crea le tre pagine dedicate e aggiorna menu, sedi e testi da liceo.
// Uso: node scripts/istituto-comprensivo.mjs (dopo personalizza.mjs)
import { readdirSync, readFileSync, writeFileSync } from "node:fs";
import { join } from "node:path";

const DIR = new URL("../public/", import.meta.url).pathname.replace(/^\/([A-Za-z]:)/, "$1");
const AS = "2026/2027";
const NOME = "Istituto Comprensivo Homo Sapiens";

const ORDINI = [
  {
    id: "scuola-infanzia",
    titolo: "Scuola dell'infanzia",
    sottotitolo: "Per bambine e bambini dai 3 ai 6 anni",
    sezioni: [
      ["I plessi",
        `<ul>
          <li><strong>Infanzia "Maria Montessori"</strong> - Via dei Tigli, 5 - Borgo San Rocco (3 sezioni, 75 alunni)</li>
          <li><strong>Infanzia "Il Girasole"</strong> - Via Cascina Verde, 12 (3 sezioni, 75 alunni), nello stesso complesso della primaria "Milani"</li>
        </ul>
        <p>Le sezioni sono eterogenee per età e accolgono insieme bambine e bambini di 3, 4 e 5 anni.</p>`],
      ["Tempo scuola",
        `<ul>
          <li><strong>Orario:</strong> 40 ore settimanali, dal lunedì al venerdì, dalle 8:00 alle 16:00, con mensa</li>
          <li><strong>Ingresso:</strong> tra le 8:00 e le 9:00</li>
          <li><strong>Uscita intermedia:</strong> alle 13:00, su richiesta</li>
          <li><strong>Pre e post scuola</strong> (servizi comunali): dalle 7:30 e fino alle 18:00</li>
        </ul>`],
      ["Chi può iscriversi",
        `<p>La scuola dell'infanzia accoglie bambine e bambini dai 3 ai 6 anni. Possono essere iscritti anche i bambini
        che compiono 3 anni entro il 30 aprile dell'anno scolastico di riferimento (anticipatari), compatibilmente con la
        disponibilità di posti. L'iscrizione si presenta in segreteria, con il modulo della scuola.</p>`],
      ["I campi di esperienza",
        `<p>Le attività seguono le Indicazioni nazionali per il curricolo e si sviluppano nei cinque campi di esperienza:</p>
        <ul>
          <li>Il sé e l'altro</li>
          <li>Il corpo e il movimento</li>
          <li>Immagini, suoni, colori</li>
          <li>I discorsi e le parole</li>
          <li>La conoscenza del mondo</li>
        </ul>`],
      ["Accoglienza e continuità",
        `<p>L'inserimento dei nuovi iscritti avviene in modo graduale nelle prime settimane di scuola. Nell'ultimo anno
        i bambini partecipano al progetto di continuità <strong>"Ponti"</strong>, con laboratori condivisi con la scuola primaria.</p>`],
    ],
  },
  {
    id: "scuola-primaria",
    titolo: "Scuola primaria",
    sottotitolo: "Cinque anni di percorso, dai 6 agli 11 anni",
    sezioni: [
      ["I plessi",
        `<ul>
          <li><strong>Primaria "Gianni Rodari"</strong> - Via Alessandro Manzoni, 31 - Centro (10 classi, sezioni A-B, 225 alunni)</li>
          <li><strong>Primaria "Don Lorenzo Milani"</strong> - Via Cascina Verde, 14 (10 classi, sezioni C-D, 225 alunni)</li>
        </ul>`],
      ["Tempo scuola",
        `<p>In entrambi i plessi tutte le classi sono a <strong>tempo pieno, 40 ore settimanali</strong>: dal lunedì al
        venerdì, dalle 8:30 alle 16:30, con mensa. Sono disponibili il pre-scuola dalle 7:30 e il post-scuola fino alle
        18:00, gestiti dal Comune.</p>`],
      ["Chi può iscriversi",
        `<p>Si iscrivono alla classe prima le bambine e i bambini che compiono 6 anni entro il 31 dicembre; possono
        essere iscritti anche coloro che li compiono entro il 30 aprile dell'anno successivo. Le iscrizioni si
        effettuano online sulla piattaforma del Ministero dell'Istruzione e del Merito.</p>`],
      ["Le discipline",
        `<p>Italiano, lingua inglese, storia, geografia, matematica, scienze, tecnologia, musica, arte e immagine,
        educazione fisica, religione cattolica o attività alternativa. L'educazione civica è insegnata in modo
        trasversale, per almeno 33 ore annue. Nelle classi quarte e quinte l'educazione motoria è affidata a un docente
        specialista, per 2 ore settimanali. Tra i progetti: <strong>coding e robotica</strong> ed educazione ambientale
        con <strong>"Olona bene comune"</strong>.</p>`],
      ["Valutazione",
        `<p>La valutazione periodica e finale è espressa con giudizi sintetici, accompagnati dalla descrizione dei
        progressi di apprendimento.</p>`],
    ],
  },
  {
    id: "scuola-secondaria",
    titolo: "Scuola secondaria di I grado",
    sottotitolo: "Tre anni di percorso, dagli 11 ai 14 anni",
    sezioni: [
      ["Il plesso",
        `<p><strong>Secondaria "Rita Levi-Montalcini"</strong> - Via Alessandro Volta, 24 - Centro: 24 classi in 8
        sezioni (A-H), 600 alunni. Nello stesso edificio si trovano la presidenza e la segreteria.</p>`],
      ["Tempo scuola",
        `<p>Tutte le sezioni sono a <strong>tempo normale, 30 ore settimanali</strong>: dal lunedì al venerdì, dalle 8:00
        alle 14:00.</p>`],
      ["Le discipline e le lingue",
        `<p>Italiano, storia, geografia, matematica, scienze, lingua inglese, seconda lingua comunitaria, tecnologia,
        arte e immagine, musica, scienze motorie e sportive, religione cattolica o attività alternativa, educazione
        civica.</p>
        <ul>
          <li><strong>Francese</strong>: sezioni B, D, F</li>
          <li><strong>Spagnolo</strong>: sezioni A, C, E, G, H</li>
        </ul>
        <p>Con l'<strong>inglese potenziato</strong> gli alunni di terza possono conseguire la certificazione Cambridge A2 Key.</p>`],
      ["Accoglienza in classe prima",
        `<p>Molti alunni arrivano dalle scuole primarie dei comuni vicini. Il progetto di continuità <strong>"Ponti"</strong>
        prevede open day e laboratori ponte aperti anche a loro, per accompagnare tutti nel passaggio alla secondaria.
        Gli alunni dei comuni limitrofi raggiungono la scuola con le linee extraurbane di trasporto pubblico.</p>`],
      ["Esame di Stato e orientamento",
        `<p>Il percorso si conclude con l'Esame di Stato conclusivo del primo ciclo di istruzione: prove scritte di
        italiano, matematica e lingue straniere e un colloquio. In classe terza gli alunni svolgono le prove INVALSI e
        ricevono il consiglio orientativo per la scelta della scuola secondaria di II grado.</p>`],
    ],
  },
];

const read = (f) => readFileSync(join(DIR, f), "utf8");
const write = (f, s) => writeFileSync(join(DIR, f), s);

// --- 1. Blocco "La didattica" (home e pagina Didattica) con tre schede ---
function tabDidattica() {
  const tabs = ORDINI.map((o) => `<li><a href="#${o.id}">${o.titolo}</a></li>`).join("\n                    ");
  const contents = ORDINI.map((o) => {
    const acc = o.sezioni.map(([t, body]) => `
                      <hr />
                      <div tabindex="0" class="accordion-large-title accordion-header">
                        <h3>${t}</h3>
                      </div><!-- /accordion-large-title -->
                      <div class="accordion-large-content accordion-content">
                        ${body}
                      </div><!-- /accordion-large-content -->`).join("");
    return `
                  <div id="${o.id}" class="responsive-tabs-content">
                    <div class="accordion-large accordion-wrapper">${acc}
                      <hr />
                      <div class="text-center text-sm-left">
                        <a class="btn btn-redbrown mt-4 mb-2" href="/${o.id}.html">Vai alla ${o.titolo[0].toLowerCase() + o.titolo.slice(1)}</a>
                      </div>
                    </div><!-- /accordion-large -->
                  </div>`;
  }).join("\n");
  return `<div class="responsive-tabs responsive-tabs-aside padding-bottom-200">
                  <ul>
                    ${tabs}
                  </ul>${contents}
                </div><!-- /responsive-tabs -->`;
}

for (const f of ["index.html", "scuole-didattica.html"]) {
  let s = read(f);
  s = s.replace(/<div class="responsive-tabs responsive-tabs-aside padding-bottom-200">[\s\S]*?<\/div><!-- \/responsive-tabs -->/, tabDidattica());
  s = s.replace(/<p>A\.S\. 2021 \/ 2022<\/p>/, `<p>A.S. ${AS.replace("/", " / ")}</p>`);
  s = s.replace(/<div class="h5">La scuola<\/div>/, `<div class="h5">Infanzia · Primaria · Secondaria di I grado</div>`);
  write(f, s);
}

// --- 2. Pagine dedicate ai tre ordini (dal template "pagina singola") ---
const tpl = read("scuole-pagina-singola.html");
for (const o of ORDINI) {
  const corpo = o.sezioni.map(([t, body]) => `
                <h2 class="h4">${t}</h2>
                ${body}`).join("\n");
  let s = tpl
    .replace(/<title>[^<]*<\/title>/, `<title>${o.titolo} - ${NOME}</title>`)
    .replace(/<li class="breadcrumb-item active" aria-current="page"><span>[\s\S]*?<\/span><\/li>/,
      `<li class="breadcrumb-item"><a href="/scuole-didattica.html" title="Vai alla pagina: Didattica">Didattica</a></li>
                    <li class="breadcrumb-item active" aria-current="page"><span>${o.titolo}</span></li>`)
    .replace(/<h1 class="h2 mb-3">[^<]*<\/h1>\s*<p>[^<]*<\/p>/,
      `<h1 class="h2 mb-3">${o.titolo}</h1>\n                <p>${o.sottotitolo}</p>`)
    .replace(/<article class="article-wrapper">[\s\S]*?<\/article>/,
      `<article class="article-wrapper">${corpo}
                <p class="mt-5"><em>Anno scolastico ${AS}. Per informazioni rivolgersi alla segreteria dell'Istituto.</em></p>
              </article>`);
  write(`${o.id}.html`, s);
}

// --- 3. Correzioni in tutte le pagine ---
const MENU_ORDINI = (indent, pre, post) => ORDINI.map((o) =>
  `${indent}<li>\n${indent}  <a ${pre}href="/${o.id}.html"${post}>${o.titolo}</a>\n${indent}</li>`).join("\n");

for (const f of readdirSync(DIR).filter((f) => f.endsWith(".html") && f !== "templates.html")) {
  let s = read(f);
  const prima = s;
  if (!s.includes('class="text-underline-hover" href="/scuola-infanzia.html"')) {
    // Menu desktop e mobile: dopo "Offerta formativa"
    s = s.replace(/( *)<li>\s*<a ((?:(?!text-underline-hover)[^>])*?)href="\/scuole-didattica\.html"([^>]*)>Offerta formativa<\/a>\s*<\/li>/g,
      (m, indent, pre, post) => `${m}\n${MENU_ORDINI(indent, pre, post)}`);
    // Footer
    s = s.replace(/( *)<li><a class="text-underline-hover" href="\/scuole-didattica\.html">Offerta formativa<\/a><\/li>/g,
      (m, indent) => `${m}\n` + ORDINI.map((o) => `${indent}<li><a class="text-underline-hover" href="/${o.id}.html">${o.titolo}</a></li>`).join("\n"));
  }
  s = s
    // Sedi (pagina I luoghi)
    .replace(/Scuola primaria "G\. Segantini"/g, "Scuola dell'infanzia")
    .replace(/Scuola secondaria "K\. Wojtyla"/g, "Scuola secondaria di I grado")
    .replace(/Scuola primaria "I\. Calvino"/g, "Scuola primaria")
    // Testi da liceo
    .replace(/Approfondiamo la cultura liceale nella prospettiva del rapporto fra i saperi\s*scientifici e la tradizione umanistica, maturando le competenze/g,
      "Gli edifici dell'Istituto: scuola dell'infanzia, scuola primaria e scuola secondaria di I grado")
    .replace(/I servizi offerti dal liceo/g, "I servizi offerti dall'Istituto")
    .replace(/Scuola Secondaria 2° grado/g, "Scuola secondaria di I grado")
    .replace(/title="Vai alla pagina: Liceo Linguistico">Liceo scientifico</g,
      'title="Vai alla pagina: Scuola secondaria di I grado">Scuola secondaria di I grado<')
    .replace(/liceo@pec\.it/g, "pec@ichomosapiens.edu.it")
    .replace(/liceo@scuole\.it/g, "segreteria@ichomosapiens.edu.it")
    .replace(/2021 ?\/ ?2022/g, AS)
    .replace(/2021-2022/g, AS.replace("/", "-"));
  if (s !== prima) write(f, s);
}
console.log("Sito impostato come Istituto Comprensivo: 3 pagine create, menu e testi aggiornati.");
