"""Genera i PDF della pagina "Le carte della scuola" in public/documenti/.

Documenti fittizi a scopo dimostrativo, costruiti sui dati della scheda anagrafica.
Uso: python scripts/documenti_pdf.py
"""
from pathlib import Path

from reportlab.lib import colors
from reportlab.lib.enums import TA_CENTER
from reportlab.lib.pagesizes import A4
from reportlab.lib.styles import ParagraphStyle
from reportlab.lib.units import mm
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont
from reportlab.platypus import (KeepTogether, ListFlowable, ListItem, PageBreak, Paragraph,
                                SimpleDocTemplate, Spacer, Table, TableStyle)

OUT = Path(__file__).resolve().parent.parent / "public" / "documenti"
FONTS = Path("C:/Windows/Fonts")

pdfmetrics.registerFont(TTFont("Arial", FONTS / "arial.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Bold", FONTS / "arialbd.ttf"))
pdfmetrics.registerFont(TTFont("Arial-Italic", FONTS / "ariali.ttf"))
pdfmetrics.registerFontFamily("Arial", normal="Arial", bold="Arial-Bold", italic="Arial-Italic")

BLU = colors.HexColor("#17324D")
ROSSO = colors.HexColor("#B71C3C")
GRIGIO = colors.HexColor("#5C6F82")
CHIARO = colors.HexColor("#F2F4F6")

ST = {
    "titolo": ParagraphStyle("titolo", fontName="Arial-Bold", fontSize=22, leading=27, textColor=BLU, spaceAfter=4),
    "sottotitolo": ParagraphStyle("sottotitolo", fontName="Arial", fontSize=12, leading=16, textColor=GRIGIO, spaceAfter=14),
    "h1": ParagraphStyle("h1", fontName="Arial-Bold", fontSize=14, leading=18, textColor=ROSSO, spaceBefore=14, spaceAfter=6),
    "h2": ParagraphStyle("h2", fontName="Arial-Bold", fontSize=11.5, leading=15, textColor=BLU, spaceBefore=8, spaceAfter=4),
    "p": ParagraphStyle("p", fontName="Arial", fontSize=10, leading=14.5, spaceAfter=6),
    "cella": ParagraphStyle("cella", fontName="Arial", fontSize=9, leading=12),
    "cella_b": ParagraphStyle("cella_b", fontName="Arial-Bold", fontSize=9, leading=12, textColor=colors.white),
    "firma": ParagraphStyle("firma", fontName="Arial", fontSize=10, leading=14, alignment=TA_CENTER),
}

ISTITUTO = 'Istituto Comprensivo "Homo Sapiens"'
INTESTAZIONE = "Via Alessandro Volta, 24 - 20079 Castelbruno (MI) - Tel. 02 9637 4410 - miic8zh00q@istruzione.it"
CODICI = "Cod. mecc. MIIC8ZH00Q - C.F. 97654320158 - Codice IPA istsc_miic8zh00q"
AS = "2026/2027"
DS = "Dott.ssa Chiara Valsecchi"

PLESSI = [
    ["Plesso", "Codice", "Indirizzo", "Classi / sezioni", "Alunni"],
    ['Infanzia "Maria Montessori"', "MIAA8ZH01L", "Via dei Tigli, 5 - Borgo San Rocco", "3 sezioni", "75"],
    ['Infanzia "Il Girasole"', "MIAA8ZH02N", "Via Cascina Verde, 12", "3 sezioni", "75"],
    ['Primaria "Gianni Rodari"', "MIEE8ZH01T", "Via Alessandro Manzoni, 31 - Centro", "10 classi (A-B)", "225"],
    ['Primaria "Don Lorenzo Milani"', "MIEE8ZH02V", "Via Cascina Verde, 14", "10 classi (C-D)", "225"],
    ['Secondaria "Rita Levi-Montalcini"', "MIMM8ZH01R", "Via Alessandro Volta, 24 - Centro", "24 classi (A-H)", "600"],
]
TEMPO_SCUOLA = [
    ["Ordine di scuola", "Tempo scuola", "Orario"],
    ["Scuola dell'infanzia", "40 ore settimanali, con mensa", "lun-ven 8:00-16:00 (ingresso 8:00-9:00, uscita intermedia 13:00 su richiesta)"],
    ["Scuola primaria", "Tempo pieno, 40 ore settimanali, con mensa", "lun-ven 8:30-16:30"],
    ["Scuola secondaria di I grado", "Tempo normale, 30 ore settimanali", "lun-ven 8:00-14:00"],
]


# ---------------------------------------------------------------- mattoncini
def p(testo):
    return Paragraph(testo, ST["p"])


def h1(testo):
    return Paragraph(testo, ST["h1"])


def h2(testo):
    return Paragraph(testo, ST["h2"])


def elenco(voci, numerato=False):
    return ListFlowable(
        [ListItem(Paragraph(v, ST["p"]), leftIndent=14) for v in voci],
        bulletType="1" if numerato else "bullet", start="1" if numerato else None,
        bulletFontName="Arial", bulletFontSize=9 if not numerato else 10, leftIndent=14,
        bulletColor=ROSSO,
    )


def tabella(righe, larghezze=None):
    dati = [[Paragraph(str(c), ST["cella_b"]) for c in righe[0]]]
    dati += [[Paragraph(str(c), ST["cella"]) for c in r] for r in righe[1:]]
    t = Table(dati, colWidths=larghezze, repeatRows=1, hAlign="LEFT")
    t.setStyle(TableStyle([
        ("BACKGROUND", (0, 0), (-1, 0), BLU),
        ("ROWBACKGROUNDS", (0, 1), (-1, -1), [colors.white, CHIARO]),
        ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#C5CED8")),
        ("VALIGN", (0, 0), (-1, -1), "TOP"),
        ("TOPPADDING", (0, 0), (-1, -1), 4), ("BOTTOMPADDING", (0, 0), (-1, -1), 4),
    ]))
    return KeepTogether([t, Spacer(1, 8)])


def firma(ruolo="La Dirigente scolastica", nome=DS):
    return KeepTogether([Spacer(1, 18), Paragraph(ruolo, ST["firma"]), Paragraph(nome, ST["firma"]),
                         Paragraph("<font size=8 color='#5C6F82'>(firma omessa: documento dimostrativo)</font>", ST["firma"])])


def pagina(canvas, doc):
    canvas.saveState()
    w, h = A4
    canvas.setFillColor(BLU)
    canvas.rect(0, h - 22 * mm, w, 22 * mm, stroke=0, fill=1)
    canvas.setFillColor(colors.white)
    canvas.setFont("Arial-Bold", 12)
    canvas.drawString(18 * mm, h - 11 * mm, ISTITUTO)
    canvas.setFont("Arial", 7.5)
    canvas.drawString(18 * mm, h - 16.5 * mm, INTESTAZIONE)
    canvas.drawRightString(w - 18 * mm, h - 11 * mm, f"A.S. {AS}")
    canvas.setFillColor(ROSSO)
    canvas.rect(0, h - 23.2 * mm, w, 1.2 * mm, stroke=0, fill=1)
    canvas.setFillColor(GRIGIO)
    canvas.setFont("Arial", 7.5)
    canvas.drawString(18 * mm, 11 * mm, CODICI)
    canvas.drawString(18 * mm, 7 * mm, "Documento fittizio a scopo dimostrativo: istituto, persone e dati non corrispondono a realtà esistenti.")
    canvas.drawRightString(w - 18 * mm, 11 * mm, f"{doc.titolo_breve} - pag. {doc.page}")
    canvas.restoreState()


def crea(file, titolo, sottotitolo, contenuto, titolo_breve=None):
    OUT.mkdir(parents=True, exist_ok=True)
    doc = SimpleDocTemplate(str(OUT / file), pagesize=A4, leftMargin=18 * mm, rightMargin=18 * mm,
                            topMargin=32 * mm, bottomMargin=20 * mm, title=f"{titolo} - {ISTITUTO}",
                            author=ISTITUTO, subject=sottotitolo, lang="it-IT")
    doc.titolo_breve = titolo_breve or titolo
    storia = [Paragraph(titolo, ST["titolo"]), Paragraph(sottotitolo, ST["sottotitolo"])] + contenuto
    doc.build(storia, onFirstPage=pagina, onLaterPages=pagina)
    return file


W = A4[0] - 36 * mm  # larghezza utile
DOCUMENTI = []


def documento(file, titolo, sottotitolo, breve=None):
    def dec(f):
        DOCUMENTI.append((file, titolo, sottotitolo, breve, f))
        return f
    return dec


# ---------------------------------------------------------------- 1. PTOF
@documento("ptof-2025-2028.pdf", "Piano triennale dell'offerta formativa",
           "Triennio 2025/26 - 2027/28 - Aggiornamento per l'anno scolastico 2026/2027", "PTOF 2025-2028")
def ptof():
    return [
        p("Il Piano triennale dell'offerta formativa (PTOF) è il documento con cui l'Istituto dichiara la propria identità "
          "culturale e progettuale ed esplicita la progettazione curricolare, extracurricolare, educativa e organizzativa "
          "(art. 1, comma 14, legge 107/2015). È elaborato dal Collegio dei docenti sulla base dell'atto di indirizzo della "
          "Dirigente scolastica e approvato dal Consiglio d'istituto, che ne delibera anche l'aggiornamento annuale."),
        h1("1. La scuola e il suo contesto"),
        h2("Il territorio"),
        p("L'Istituto opera a Castelbruno (MI), città di circa 51.000 abitanti nell'hinterland nord-ovest di Milano, a circa "
          "20 km dal capoluogo e collegata dalla linea ferroviaria suburbana. Il territorio è di pianura ed è attraversato dal "
          "torrente Olona; accanto al centro storico di origine medievale si sono sviluppati quartieri residenziali tra gli anni "
          "'60 e '80 e, a nord, una zona artigianale e industriale."),
        p("In città sono presenti tre istituti comprensivi statali e un istituto superiore, l'IIS \"Carlo Cattaneo\" (liceo "
          "scientifico e istituto tecnico economico). L'IC \"Homo Sapiens\" serve il centro e i quartieri Borgo San Rocco e "
          "Cascina Verde. Il Comune di Castelbruno, Settore Istruzione, gestisce mensa, trasporto scolastico, pre e post scuola "
          "e l'assistenza educativa per gli alunni con disabilità."),
        h2("I plessi"),
        tabella(PLESSI, [W * .27, W * .15, W * .30, W * .17, W * .11]),
        p("Totale: 1.200 alunni in 50 tra classi e sezioni. Una parte consistente degli alunni della secondaria proviene dalle "
          "scuole primarie dei comuni limitrofi: per questo la secondaria conta 8 sezioni, mentre le primarie interne ne hanno 4."),
        h2("Le risorse professionali"),
        tabella([["Personale", "Unità"], ["Docenti (di cui 28 di sostegno e 4 di religione cattolica)", "132"],
                 ["DSGA", "1"], ["Assistenti amministrativi", "7"], ["Collaboratori scolastici", "26"]], [W * .75, W * .25]),
        h1("2. Le scelte strategiche"),
        h2("Priorità desunte dal RAV"),
        elenco([
            "<b>Risultati nelle prove standardizzate nazionali</b>: ridurre la variabilità dei risultati in matematica tra le "
            "classi della scuola secondaria.",
            "<b>Competenze chiave europee</b>: sviluppare in modo verticale le competenze di cittadinanza, con particolare "
            "attenzione alla sostenibilità ambientale e alla cittadinanza digitale.",
            "<b>Continuità</b>: accompagnare il passaggio alla secondaria degli alunni provenienti da altri istituti.",
        ], numerato=True),
        h2("Obiettivi formativi prioritari (legge 107/2015, art. 1, comma 7)"),
        elenco([
            "valorizzazione e potenziamento delle competenze linguistiche, con particolare riferimento all'inglese;",
            "potenziamento delle competenze matematico-logiche e scientifiche;",
            "sviluppo delle competenze digitali degli studenti, con riguardo al pensiero computazionale;",
            "sviluppo di comportamenti responsabili ispirati alla conoscenza e al rispetto della legalità e della sostenibilità ambientale;",
            "prevenzione e contrasto della dispersione scolastica, di ogni forma di discriminazione e del bullismo, anche informatico;",
            "potenziamento dell'inclusione scolastica e del diritto allo studio degli alunni con bisogni educativi speciali.",
        ]),
        h1("3. L'offerta formativa"),
        h2("Tempo scuola"),
        tabella(TEMPO_SCUOLA, [W * .25, W * .30, W * .45]),
        p("Nella scuola secondaria la seconda lingua comunitaria è il francese nelle sezioni B, D, F e lo spagnolo nelle sezioni "
          "A, C, E, G, H."),
        h2("Curricolo"),
        p("L'Istituto adotta un curricolo verticale dalla scuola dell'infanzia alla secondaria di I grado, costruito sulle "
          "Indicazioni nazionali e sulle competenze chiave europee; comprende il curricolo di educazione civica, per non meno "
          "di 33 ore annue in ciascuna classe."),
        h2("Progetti caratterizzanti"),
        tabella([
            ["Progetto", "Destinatari", "Descrizione"],
            ['"Olona bene comune"', "Tutti gli ordini", "Educazione ambientale in collaborazione con il Parco locale: uscite sul territorio, osservazione del torrente, azioni di cura dei beni comuni."],
            ['Continuità "Ponti"', "Infanzia, primaria, secondaria", "Open day e laboratori ponte per il passaggio infanzia-primaria e primaria-secondaria, aperti anche agli alunni delle primarie dei comuni limitrofi."],
            ["Inglese potenziato", "Secondaria, classi terze", "Preparazione alla certificazione Cambridge A2 Key."],
            ["Coding e robotica", "Primaria e secondaria", "Pensiero computazionale, programmazione a blocchi e robotica educativa."],
            ["Sportello d'ascolto psicologico", "Alunni, famiglie, personale", "Colloqui riservati con uno psicologo, su prenotazione."],
        ], [W * .24, W * .22, W * .54]),
        h2("Valutazione"),
        p("Nella scuola primaria la valutazione periodica e finale è espressa con giudizi sintetici; nella scuola secondaria con "
          "voti in decimi. Il comportamento è valutato secondo i criteri deliberati dal Collegio dei docenti. I criteri completi "
          "sono allegati al presente Piano."),
        h1("4. L'organizzazione"),
        tabella([
            ["Incarico", "Nominativo"],
            ["Dirigente scolastica", DS],
            ["Primo collaboratore", "Prof. Marco Brambilla"],
            ["Seconda collaboratrice", "Ins. Paola Colombo"],
            ["DSGA", "Dott. Giorgio Ferrario"],
            ["FS PTOF e valutazione", "Prof.ssa Laura Crippa"],
            ["FS Inclusione", "Ins. Anna Bonfanti"],
            ["FS Continuità e orientamento", "Prof. Davide Mauri"],
            ["FS Tecnologie e innovazione digitale / Animatore digitale", "Prof. Luca Sironi"],
        ], [W * .55, W * .45]),
        h2("Rapporti con le famiglie"),
        p("Le comunicazioni avvengono tramite il registro elettronico ClasseViva e il sito istituzionale. Sono previsti colloqui "
          "individuali e generali secondo il piano annuale delle attività. I pagamenti verso la scuola si effettuano con PagoPA "
          "tramite Pago In Rete."),
        h2("Piano di formazione del personale"),
        elenco(["didattica per competenze e valutazione;", "inclusione e bisogni educativi speciali;",
                "competenze digitali e uso consapevole delle piattaforme;", "sicurezza nei luoghi di lavoro e primo soccorso."]),
        firma(),
    ]


# ---------------------------------------------------------------- 2. RAV
@documento("rav-sintesi.pdf", "Rapporto di autovalutazione (RAV)",
           "Sintesi per le famiglie - la versione integrale è pubblicata su Scuola in Chiaro", "RAV - sintesi")
def rav():
    return [
        p("Il Rapporto di autovalutazione è lo strumento con cui la scuola analizza i propri punti di forza e di debolezza "
          "nell'ambito del Sistema nazionale di valutazione (DPR 80/2013). Viene redatto dal Nucleo interno di valutazione e "
          "pubblicato sul portale Scuola in Chiaro. Questo documento ne presenta una sintesi."),
        h1("1. Contesto e risorse"),
        tabella([["Area", "Punti di forza", "Punti di debolezza"],
                 ["Popolazione scolastica", "Utenza eterogenea; buona partecipazione delle famiglie agli organi collegiali.",
                  "Numerosi ingressi in classe prima secondaria da altri istituti, con percorsi pregressi diversi."],
                 ["Territorio", "Collaborazione con il Comune e con il Parco locale; buoni collegamenti con Milano.",
                  "Pendolarismo degli alunni dei comuni limitrofi, che rende più complesse le attività pomeridiane."],
                 ["Risorse professionali", "Organico stabile; docenti con competenze digitali e linguistiche.",
                  "Turn-over sui posti di sostegno."]], [W * .22, W * .39, W * .39]),
        h1("2. Esiti"),
        tabella([["Area", "Sintesi"],
                 ["Risultati scolastici", "Ammissioni alla classe successiva in linea con i riferimenti territoriali."],
                 ["Prove standardizzate", "Risultati complessivamente in linea con la media regionale; variabilità tra le classi più alta del riferimento in matematica nella secondaria."],
                 ["Competenze chiave europee", "Buone competenze sociali e civiche; da consolidare le competenze digitali e l'imparare a imparare."],
                 ["Risultati a distanza", "Buona corrispondenza tra consiglio orientativo e scelta della scuola secondaria di II grado."]],
                [W * .3, W * .7]),
        h1("3. Processi"),
        elenco([
            "<b>Curricolo, progettazione e valutazione</b>: curricolo verticale definito; da rafforzare le prove comuni per classi parallele.",
            "<b>Ambiente di apprendimento</b>: dotazioni digitali presenti in tutti i plessi; da estendere la didattica laboratoriale.",
            "<b>Inclusione e differenziazione</b>: buone pratiche per gli alunni con disabilità e BES; protocollo per gli alunni stranieri.",
            "<b>Continuità e orientamento</b>: progetto \"Ponti\" consolidato con le primarie interne; da estendere ai comuni limitrofi.",
            "<b>Orientamento strategico</b>: funzioni strumentali e referenti chiaramente definiti.",
        ]),
        h1("4. Priorità e traguardi"),
        tabella([["Esiti", "Priorità", "Traguardo"],
                 ["Prove standardizzate nazionali", "Ridurre la variabilità dei risultati in matematica tra le classi della secondaria.",
                  "Avvicinare la variabilità tra le classi al riferimento regionale entro il triennio."],
                 ["Competenze chiave europee", "Sviluppare in verticale le competenze di cittadinanza ambientale e digitale.",
                  "Adottare in tutte le classi una rubrica comune di valutazione delle competenze di cittadinanza."]],
                [W * .24, W * .38, W * .38]),
        h2("Obiettivi di processo collegati"),
        elenco(["Progettare e somministrare prove comuni di matematica per classi parallele.",
                "Realizzare laboratori ponte con le primarie dei comuni limitrofi.",
                "Formare i docenti sulla didattica per competenze e sulla valutazione con rubriche."], numerato=True),
        p("Le azioni previste per raggiungere i traguardi sono descritte nel Piano di miglioramento."),
    ]


# ---------------------------------------------------------------- 3. Piano di miglioramento
@documento("piano-di-miglioramento.pdf", "Piano di miglioramento",
           f"Azioni collegate alle priorità del RAV - anno scolastico {AS}", "Piano di miglioramento")
def pdm():
    return [
        p("Il Piano di miglioramento traduce in azioni concrete le priorità e i traguardi individuati nel Rapporto di "
          "autovalutazione. È parte integrante del PTOF ed è coordinato dal Nucleo interno di valutazione con la funzione "
          "strumentale PTOF e valutazione, Prof.ssa Laura Crippa."),
        h1("Priorità 1 - Risultati in matematica"),
        p("<b>Traguardo</b>: ridurre la variabilità dei risultati in matematica tra le classi della scuola secondaria."),
        tabella([["Azione", "Responsabili", "Tempi", "Indicatore"],
                 ["Prove comuni di matematica per classi parallele (ingresso, intermedia, finale)", "Dipartimento di matematica e scienze", "Ottobre, gennaio, maggio", "Prove somministrate in tutte le 24 classi"],
                 ["Analisi condivisa dei risultati INVALSI", "Nucleo interno di valutazione", "Settembre-ottobre", "Report presentato al Collegio dei docenti"],
                 ["Formazione su didattica laboratoriale della matematica", "Dirigente scolastica, FS PTOF", "Novembre-marzo", "Partecipazione di almeno il 70% dei docenti di matematica"]],
                [W * .36, W * .22, W * .18, W * .24]),
        h1("Priorità 2 - Competenze di cittadinanza"),
        p("<b>Traguardo</b>: adottare in tutte le classi una rubrica comune di valutazione delle competenze di cittadinanza."),
        tabella([["Azione", "Responsabili", "Tempi", "Indicatore"],
                 ["Rubrica verticale di cittadinanza ambientale e digitale", "Referente educazione civica, Prof.ssa Elena Cattaneo", "Entro dicembre", "Rubrica approvata dal Collegio"],
                 ['Compiti di realtà del progetto "Olona bene comune"', "Consigli di classe e interclasse", "Secondo quadrimestre", "Almeno un compito di realtà per classe"],
                 ["Percorsi di cittadinanza digitale e prevenzione del cyberbullismo", "Referente bullismo e cyberbullismo, Prof.ssa Silvia Radaelli; Animatore digitale", "Intero anno", "Percorsi svolti in tutte le classi della secondaria"]],
                [W * .36, W * .22, W * .18, W * .24]),
        h1("Continuità"),
        tabella([["Azione", "Responsabili", "Tempi", "Indicatore"],
                 ['Laboratori ponte "Ponti" aperti alle primarie dei comuni limitrofi', "FS Continuità e orientamento, Prof. Davide Mauri", "Novembre-gennaio", "Numero di scuole esterne coinvolte"],
                 ["Accoglienza in classe prima secondaria con attività di conoscenza", "Coordinatori delle classi prime", "Settembre", "Questionario di gradimento di alunni e famiglie"]],
                [W * .36, W * .22, W * .18, W * .24]),
        h1("Monitoraggio"),
        p("Il Nucleo interno di valutazione verifica lo stato di avanzamento delle azioni a metà anno e al termine dell'anno "
          "scolastico e ne riferisce al Collegio dei docenti e al Consiglio d'istituto. Gli esiti del monitoraggio sono usati per "
          "l'aggiornamento annuale del PTOF."),
        firma(),
    ]


# ---------------------------------------------------------------- 4. Curricolo verticale
@documento("curricolo-verticale.pdf", "Curricolo verticale",
           "Dalla scuola dell'infanzia alla secondaria di I grado - con il curricolo di educazione civica", "Curricolo verticale")
def curricolo():
    return [
        p("Il curricolo verticale descrive il percorso formativo che accompagna gli alunni dai 3 ai 14 anni. È costruito sulle "
          "Indicazioni nazionali per il curricolo della scuola dell'infanzia e del primo ciclo di istruzione e sulle competenze "
          "chiave per l'apprendimento permanente indicate dalla Raccomandazione del Consiglio dell'Unione europea del 22 maggio 2018."),
        h1("1. Principi"),
        elenco(["<b>Continuità</b>: ogni ordine di scuola riprende e sviluppa i traguardi del precedente.",
                "<b>Centralità dell'alunno</b>: le attività partono dall'esperienza e dagli interessi dei bambini e dei ragazzi.",
                "<b>Didattica per competenze</b>: conoscenze e abilità sono usate per affrontare compiti reali.",
                "<b>Inclusione</b>: il curricolo è personalizzato per rispondere ai bisogni di ciascuno."]),
        h1("2. Le competenze chiave europee nei tre ordini"),
        tabella([["Competenza chiave", "Infanzia (campi di esperienza)", "Primaria e secondaria (discipline)"],
                 ["Competenza alfabetica funzionale", "I discorsi e le parole", "Italiano e tutte le discipline"],
                 ["Competenza multilinguistica", "I discorsi e le parole", "Inglese; seconda lingua comunitaria (secondaria)"],
                 ["Competenza matematica e in scienze, tecnologie e ingegneria", "La conoscenza del mondo", "Matematica, scienze, tecnologia"],
                 ["Competenza digitale", "Tutti i campi", "Tecnologia e tutte le discipline; coding e robotica"],
                 ["Competenza personale, sociale e capacità di imparare a imparare", "Il sé e l'altro", "Tutte le discipline"],
                 ["Competenza in materia di cittadinanza", "Il sé e l'altro", "Educazione civica, storia, geografia"],
                 ["Competenza imprenditoriale", "Tutti i campi", "Tutte le discipline; compiti di realtà"],
                 ["Competenza in materia di consapevolezza ed espressione culturali", "Immagini, suoni, colori; Il corpo e il movimento", "Arte e immagine, musica, educazione fisica, storia"]],
                [W * .36, W * .30, W * .34]),
        h1("3. Traguardi di uscita"),
        h2("Al termine della scuola dell'infanzia"),
        p("Il bambino riconosce ed esprime le proprie emozioni, gioca e lavora in modo costruttivo con gli altri, racconta "
          "esperienze usando un lessico adeguato, esplora la realtà con curiosità formulando domande e ipotesi."),
        h2("Al termine della scuola primaria"),
        p("L'alunno legge e comprende testi di vario tipo, scrive testi corretti e coerenti, usa il calcolo e il ragionamento "
          "per risolvere problemi, comunica in inglese in situazioni semplici e quotidiane, usa le tecnologie digitali con "
          "consapevolezza."),
        h2("Al termine della scuola secondaria di I grado"),
        p("L'alunno padroneggia la lingua italiana, comunica in inglese al livello A2 del Quadro comune europeo e in una seconda "
          "lingua comunitaria al livello A1, analizza dati e fatti della realtà, usa le tecnologie in modo critico e "
          "responsabile, orienta le proprie scelte in modo consapevole."),
        h1("4. Curricolo di educazione civica"),
        p("L'educazione civica è insegnata in modo trasversale per non meno di 33 ore annue in ciascuna classe (legge 92/2019), "
          "secondo le Linee guida ministeriali, ed è organizzata in tre nuclei."),
        tabella([["Nucleo", "Infanzia", "Primaria", "Secondaria"],
                 ["Costituzione", "Regole della convivenza in sezione", "Diritti e doveri; le istituzioni del Comune", "La Costituzione; istituzioni dello Stato e dell'Unione europea"],
                 ["Sviluppo economico e sostenibilità", "Cura dell'ambiente e dei materiali", '"Olona bene comune": il torrente e il territorio', "Agenda 2030; tutela dell'ambiente e dei beni comuni"],
                 ["Cittadinanza digitale", "Primo approccio ai dispositivi", "Uso sicuro della rete", "Identità digitale, affidabilità delle fonti, prevenzione del cyberbullismo"]],
                [W * .22, W * .24, W * .26, W * .28]),
        p("Il coordinamento è affidato alla referente per l'educazione civica, Prof.ssa Elena Cattaneo."),
    ]


# ---------------------------------------------------------------- 5. Regolamento d'istituto
@documento("regolamento-istituto.pdf", "Regolamento d'istituto",
           "Con il regolamento di disciplina della scuola secondaria di I grado", "Regolamento d'istituto")
def regolamento():
    return [
        h1("Titolo I - Principi generali"),
        p("<b>Art. 1</b> - Il presente Regolamento disciplina la vita dell'Istituto nel rispetto della Costituzione, dello Statuto "
          "delle studentesse e degli studenti (DPR 249/1998 e successive modifiche) e del Patto educativo di corresponsabilità."),
        p("<b>Art. 2</b> - Tutte le componenti della comunità scolastica sono tenute a conoscere e rispettare il Regolamento, "
          "pubblicato sul sito dell'Istituto."),
        h1("Titolo II - Orari, ingressi e uscite"),
        p("<b>Art. 3</b> - Gli orari delle lezioni sono i seguenti:"),
        tabella(TEMPO_SCUOLA, [W * .25, W * .30, W * .45]),
        p("<b>Art. 4</b> - Gli alunni entrano nei cinque minuti che precedono l'inizio delle lezioni, accolti dai docenti della "
          "prima ora. Il pre-scuola comunale è attivo dalle 7:30 nei plessi di infanzia e primaria."),
        p("<b>Art. 5</b> - I ritardi e le uscite anticipate sono annotati sul registro elettronico e giustificati dai genitori. "
          "Gli alunni possono uscire in anticipo solo se accompagnati da un genitore o da una persona maggiorenne delegata per iscritto."),
        p("<b>Art. 6</b> - Al termine delle lezioni gli alunni sono affidati ai genitori o a persone delegate. Per gli alunni della "
          "scuola secondaria i genitori possono autorizzare l'uscita autonoma, ai sensi dell'art. 19-bis del DL 148/2017."),
        h1("Titolo III - Assenze"),
        p("<b>Art. 7</b> - Le assenze sono giustificate dai genitori tramite il registro elettronico ClasseViva il giorno del rientro."),
        p("<b>Art. 8</b> - Nella scuola secondaria, ai fini della validità dell'anno scolastico, è richiesta la frequenza di almeno "
          "tre quarti dell'orario annuale personalizzato, salvo le deroghe deliberate dal Collegio dei docenti."),
        h1("Titolo IV - Comportamento e uso dei dispositivi"),
        p("<b>Art. 9</b> - Gli alunni hanno cura degli ambienti, degli arredi e dei materiali della scuola. Eventuali danni sono "
          "risarciti da chi li ha causati."),
        p("<b>Art. 10</b> - Durante l'orario scolastico l'uso dello smartphone da parte degli alunni non è consentito, secondo le "
          "indicazioni ministeriali per il primo ciclo di istruzione. Restano salvi gli strumenti previsti dai piani educativi "
          "individualizzati e dai piani didattici personalizzati."),
        p("<b>Art. 11</b> - L'uso delle piattaforme digitali (Google Workspace for Education) avviene esclusivamente con l'account "
          "fornito dalla scuola e per finalità didattiche."),
        h1("Titolo V - Servizi e rapporti con le famiglie"),
        p("<b>Art. 12</b> - Il servizio mensa, il pre e post scuola e il trasporto sono gestiti dal Comune di Castelbruno. Durante "
          "la mensa valgono le stesse regole di comportamento delle attività didattiche."),
        p("<b>Art. 13</b> - I colloqui con i docenti si prenotano tramite il registro elettronico. Le comunicazioni ufficiali della "
          "scuola sono pubblicate sul registro elettronico e sul sito."),
        PageBreak(),
        h1("Regolamento di disciplina - scuola secondaria di I grado"),
        p("<b>Art. 14 - Finalità</b>. I provvedimenti disciplinari hanno finalità educativa e tendono al rafforzamento del senso di "
          "responsabilità. La responsabilità disciplinare è personale e nessuno può essere sottoposto a sanzioni senza essere "
          "stato prima invitato a esporre le proprie ragioni."),
        p("<b>Art. 15 - Mancanze e sanzioni</b>."),
        tabella([["Mancanza", "Sanzione", "Organo competente"],
                 ["Ritardi ripetuti, mancanza del materiale, disturbo occasionale", "Richiamo verbale; annotazione sul registro", "Docente"],
                 ["Disturbo reiterato, uso non consentito dello smartphone", "Nota disciplinare e comunicazione alla famiglia; ritiro del dispositivo, riconsegnato ai genitori", "Docente, Dirigente scolastica"],
                 ["Linguaggio offensivo, danni volontari a beni della scuola", "Attività a favore della comunità scolastica; risarcimento del danno", "Consiglio di classe"],
                 ["Comportamenti gravi, atti di bullismo o cyberbullismo", "Allontanamento dalla comunità scolastica fino a 15 giorni, con percorso educativo", "Consiglio di classe"]],
                [W * .38, W * .40, W * .22]),
        p("<b>Art. 16 - Procedura</b>. La contestazione è comunicata alla famiglia; l'alunno può esporre le proprie ragioni, anche "
          "per iscritto, prima della decisione. Il provvedimento è motivato e comunicato per iscritto."),
        p("<b>Art. 17 - Organo di garanzia</b>. Contro le sanzioni disciplinari è ammesso ricorso, entro 15 giorni dalla "
          "comunicazione, all'Organo di garanzia interno, composto dalla Dirigente scolastica, che lo presiede, da un docente e da "
          "due genitori designati dal Consiglio d'istituto. L'Organo decide entro 10 giorni."),
        firma(),
    ]


# ---------------------------------------------------------------- 6. Patto di corresponsabilità
@documento("patto-corresponsabilita.pdf", "Patto educativo di corresponsabilità",
           "Scuola, famiglia e alunni: impegni condivisi (DPR 235/2007, art. 5-bis)", "Patto di corresponsabilità")
def patto():
    colonna = lambda voci: ListFlowable([ListItem(Paragraph(v, ST["cella"]), leftIndent=8) for v in voci],
                                        bulletType="bullet", bulletFontSize=7, leftIndent=8, bulletColor=ROSSO)
    impegni = Table([
        [Paragraph("La scuola si impegna a", ST["cella_b"]), Paragraph("La famiglia si impegna a", ST["cella_b"]),
         Paragraph("L'alunno si impegna a", ST["cella_b"])],
        [colonna(["offrire un ambiente sereno, sicuro e inclusivo;", "presentare con chiarezza obiettivi, criteri di valutazione e regole;",
                  "comunicare con tempestività andamento e assenze tramite il registro elettronico;",
                  "valorizzare le capacità di ciascuno e personalizzare i percorsi;",
                  "prevenire e contrastare ogni forma di bullismo e cyberbullismo."]),
         colonna(["conoscere il PTOF e il Regolamento d'istituto;", "garantire la frequenza regolare e la puntualità;",
                  "consultare il registro elettronico e partecipare ai colloqui;",
                  "collaborare con i docenti nel rispetto dei ruoli;",
                  "vigilare sull'uso dei dispositivi e della rete da parte dei figli."]),
         colonna(["rispettare compagni, adulti e ambienti;", "frequentare con regolarità ed eseguire i compiti;",
                  "portare il materiale necessario;", "rispettare le regole sull'uso dello smartphone;",
                  "chiedere aiuto e segnalare agli adulti situazioni di disagio o di prepotenza."])],
    ], colWidths=[W / 3] * 3)
    impegni.setStyle(TableStyle([("BACKGROUND", (0, 0), (-1, 0), BLU), ("GRID", (0, 0), (-1, -1), 0.4, colors.HexColor("#C5CED8")),
                                 ("VALIGN", (0, 0), (-1, -1), "TOP"), ("TOPPADDING", (0, 0), (-1, -1), 5)]))
    return [
        p("Il Patto educativo di corresponsabilità definisce in modo condiviso diritti e doveri nel rapporto tra l'Istituto, le "
          "famiglie e gli alunni. È sottoscritto dai genitori all'atto dell'iscrizione e resta valido per l'intero percorso "
          "nell'Istituto."),
        impegni,
        Spacer(1, 10),
        h1("Prevenzione del bullismo e del cyberbullismo"),
        p("In attuazione della legge 71/2017 e successive modifiche, l'Istituto ha nominato una referente per la prevenzione e il "
          "contrasto del bullismo e del cyberbullismo, Prof.ssa Silvia Radaelli, e adotta un protocollo di intervento. Scuola e "
          "famiglia si impegnano a segnalare tempestivamente ogni episodio e a collaborare nei percorsi educativi conseguenti."),
        h1("Sottoscrizione"),
        p("I sottoscritti, genitori dell'alunno/a ______________________________ iscritto/a alla classe/sezione ______ del plesso "
          "______________________, dichiarano di aver letto e di condividere il presente Patto."),
        Spacer(1, 16),
        Table([["Firma dei genitori", "La Dirigente scolastica"],
               ["_____________________________", DS],
               ["_____________________________", ""]], colWidths=[W / 2, W / 2],
              style=[("FONTNAME", (0, 0), (-1, -1), "Arial"), ("FONTSIZE", (0, 0), (-1, -1), 10),
                     ("ALIGN", (0, 0), (-1, -1), "CENTER"), ("TOPPADDING", (0, 1), (-1, -1), 12)]),
    ]


# ---------------------------------------------------------------- 7. PAI
@documento("piano-annuale-inclusione.pdf", "Piano annuale per l'inclusione (PAI)",
           f"Anno scolastico {AS}", "PAI")
def pai():
    return [
        p("Il Piano annuale per l'inclusione descrive come l'Istituto risponde ai bisogni educativi speciali (BES) degli alunni. "
          "È elaborato dal Gruppo di lavoro per l'inclusione (GLI, D.Lgs. 66/2017) e approvato dal Collegio dei docenti."),
        h1("1. Destinatari"),
        tabella([["Area", "Riferimenti", "Strumento"],
                 ["Alunni con disabilità", "Legge 104/1992, D.Lgs. 66/2017", "Piano educativo individualizzato (PEI)"],
                 ["Alunni con disturbi specifici di apprendimento", "Legge 170/2010", "Piano didattico personalizzato (PDP)"],
                 ["Altri bisogni educativi speciali (svantaggio socio-economico, linguistico, culturale)", "Direttiva MIUR 27/12/2012", "PDP, anche temporaneo"],
                 ["Alunni con cittadinanza non italiana neo-arrivati", "Linee guida ministeriali", "Protocollo di accoglienza; percorsi di italiano L2"]],
                [W * .38, W * .28, W * .34]),
        h1("2. Risorse"),
        elenco(["28 docenti di sostegno, distribuiti su tutti gli ordini di scuola;",
                "assistenza educativa per gli alunni con disabilità, garantita dal Comune di Castelbruno, Settore Istruzione;",
                "funzione strumentale e referente per l'inclusione, Ins. Anna Bonfanti;",
                "sportello d'ascolto psicologico per alunni, famiglie e personale;",
                "collaborazione con i servizi sociosanitari del territorio."]),
        h1("3. Organizzazione"),
        tabella([["Organo", "Composizione", "Compiti"],
                 ["GLI", "Dirigente scolastica, FS inclusione, docenti di sostegno e curricolari, rappresentanti dei genitori, specialisti", "Rileva i BES, elabora il PAI, supporta i consigli di classe"],
                 ["GLO", "Consiglio di classe o team, genitori, specialisti", "Redige e verifica il PEI di ciascun alunno con disabilità"],
                 ["Consigli di classe e team docenti", "Docenti della classe", "Individuano i BES e predispongono i PDP"]],
                [W * .18, W * .45, W * .37]),
        h1("4. Obiettivi di incremento dell'inclusività per il 2026/2027"),
        elenco(["Uniformare tra i plessi i modelli di PDP e i tempi di redazione (entro il 30 novembre).",
                "Formare i docenti sull'uso di strumenti compensativi digitali.",
                "Rafforzare il raccordo con le primarie dei comuni limitrofi per gli alunni con BES in ingresso alla secondaria.",
                "Attivare laboratori di italiano L2 per gli alunni neo-arrivati in tutti i plessi."], numerato=True),
        h1("5. Monitoraggio"),
        p("Il GLI verifica l'attuazione del Piano a metà e a fine anno; gli esiti sono usati per l'aggiornamento del PAI dell'anno "
          "successivo."),
        firma(),
    ]


# ---------------------------------------------------------------- 8. Protocollo alunni stranieri
@documento("protocollo-accoglienza-alunni-stranieri.pdf", "Protocollo di accoglienza degli alunni stranieri",
           "Iscrizione, inserimento e accompagnamento degli alunni con cittadinanza non italiana", "Protocollo accoglienza")
def protocollo():
    return [
        p("Il Protocollo definisce le procedure per l'accoglienza degli alunni con cittadinanza non italiana, in coerenza con "
          "l'art. 45 del DPR 394/1999 e con le Linee guida ministeriali per l'accoglienza e l'integrazione degli alunni stranieri. "
          "Gli alunni stranieri hanno diritto all'istruzione indipendentemente dalla regolarità della loro posizione di soggiorno."),
        h1("1. Fase amministrativa"),
        elenco(["La segreteria, area didattica, riceve la domanda di iscrizione in qualsiasi momento dell'anno.",
                "Vengono raccolti i documenti anagrafici, sanitari e scolastici disponibili; in mancanza, sono ammesse autocertificazioni.",
                "La famiglia riceve informazioni essenziali sull'organizzazione della scuola, se possibile tradotte nella lingua d'origine.",
                "La segreteria informa la commissione accoglienza entro due giorni lavorativi."]),
        h1("2. Fase comunicativa e relazionale"),
        p("La commissione accoglienza, coordinata dalla funzione strumentale per l'inclusione, incontra la famiglia e l'alunno, "
          "anche con l'aiuto di un mediatore linguistico-culturale, per conoscere il percorso scolastico precedente, le "
          "competenze linguistiche e gli interessi."),
        h1("3. Assegnazione alla classe"),
        p("L'alunno è iscritto di norma alla classe corrispondente all'età anagrafica. Il Collegio dei docenti può deliberare "
          "l'iscrizione alla classe immediatamente inferiore o superiore tenendo conto dell'ordinamento degli studi del paese "
          "di provenienza, delle competenze accertate e del titolo di studio posseduto. Nella scelta della sezione si evita la "
          "concentrazione di alunni neo-arrivati nella stessa classe."),
        h1("4. Fase educativa e didattica"),
        elenco(["attività di accoglienza nella classe e individuazione di un compagno tutor;",
                "laboratori di italiano L2 per la comunicazione e per lo studio;",
                "eventuale piano didattico personalizzato temporaneo, predisposto dal consiglio di classe o dal team;",
                "valorizzazione della lingua e della cultura d'origine nelle attività della classe."]),
        h1("5. Valutazione"),
        p("La valutazione tiene conto del percorso personalizzato, dei progressi nell'apprendimento dell'italiano, della "
          "motivazione e dell'impegno. Nel primo periodo il consiglio di classe può esprimere una valutazione riferita ai soli "
          "obiettivi del piano personalizzato."),
        h1("6. Rapporti con il territorio"),
        p("L'Istituto collabora con il Comune di Castelbruno e con le associazioni del territorio per la mediazione "
          "linguistico-culturale e le attività di supporto allo studio."),
        firma(),
    ]


# ---------------------------------------------------------------- 9. Carta dei servizi
@documento("carta-dei-servizi.pdf", "Carta dei servizi",
           "Principi, servizi offerti e standard di qualità dell'Istituto", "Carta dei servizi")
def carta():
    return [
        p("La Carta dei servizi presenta i principi a cui si ispira l'Istituto, i servizi che offre e gli standard di qualità "
          "che si impegna a rispettare nei confronti di alunni, famiglie e cittadini."),
        h1("1. Principi fondamentali"),
        elenco(["<b>Uguaglianza</b>: nessuna discriminazione per sesso, etnia, lingua, religione, opinioni politiche, condizioni psicofisiche e socio-economiche.",
                "<b>Imparzialità e regolarità</b>: il servizio è erogato con obiettività ed equità, garantendo continuità anche in caso di conflitti sindacali, nei limiti della normativa.",
                "<b>Accoglienza e integrazione</b>: particolare attenzione alle fasi di ingresso e agli alunni con bisogni educativi speciali.",
                "<b>Partecipazione e trasparenza</b>: famiglie, alunni e personale partecipano alla vita della scuola attraverso gli organi collegiali.",
                "<b>Libertà di insegnamento e aggiornamento del personale</b>."]),
        h1("2. Servizi didattici"),
        p("L'offerta formativa è descritta nel PTOF. L'Istituto comprende due scuole dell'infanzia, due scuole primarie a tempo "
          "pieno e una scuola secondaria di I grado a tempo normale, per 1.200 alunni in 50 tra classi e sezioni."),
        h1("3. Servizi amministrativi"),
        tabella([["Orari di apertura al pubblico della segreteria", ""],
                 ["Dal lunedì al venerdì", "8:00 - 9:30 e 12:00 - 13:30"],
                 ["Martedì e giovedì", "anche 14:30 - 16:30"]], [W * .5, W * .5]),
        p("Si riceve su appuntamento, da richiedere via email (miic8zh00q@istruzione.it) o per telefono (02 9637 4410)."),
        h2("Standard di qualità"),
        tabella([["Servizio", "Tempo massimo"],
                 ["Certificati di iscrizione e di frequenza", "3 giorni lavorativi"],
                 ["Certificati con votazioni o giudizi", "5 giorni lavorativi"],
                 ["Nulla osta al trasferimento", "5 giorni lavorativi"],
                 ["Consegna delle credenziali del registro elettronico", "5 giorni lavorativi dall'iscrizione"],
                 ["Risposta scritta a richieste e reclami", "15 giorni"]], [W * .65, W * .35]),
        h1("4. Servizi in collaborazione con il Comune"),
        p("Mensa (infanzia e primaria), pre-scuola dalle 7:30 e post-scuola fino alle 18:00 (infanzia e primaria), trasporto "
          "scolastico (primaria e secondaria, per i residenti di Cascina Verde e delle frazioni) e assistenza educativa per gli "
          "alunni con disabilità sono gestiti dal Comune di Castelbruno, Settore Istruzione."),
        h1("5. Sicurezza"),
        p("Ogni plesso dispone del documento di valutazione dei rischi e del piano di emergenza; sono effettuate almeno due prove "
          "di evacuazione per anno scolastico. Il responsabile del servizio di prevenzione e protezione è l'Ing. Fabio Locatelli."),
        h1("6. Reclami e valutazione del servizio"),
        p("I reclami si presentano per iscritto, anche via email, alla Dirigente scolastica, indicando le generalità del "
          "proponente. La Dirigente risponde per iscritto entro 15 giorni. Al termine dell'anno scolastico l'Istituto raccoglie "
          "il parere di famiglie e personale con questionari anonimi."),
        firma(),
    ]


if __name__ == "__main__":
    from pypdf import PdfReader
    for file, titolo, sottotitolo, breve, f in DOCUMENTI:
        crea(file, titolo, sottotitolo, f(), breve)
        pagine = len(PdfReader(OUT / file).pages)
        kb = (OUT / file).stat().st_size // 1024
        print(f"{file}: {pagine} pagine, {kb} KB")
