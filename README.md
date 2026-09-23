# Istituto Comprensivo Homo Sapiens

Sito web della scuola basato sul [modello Scuole di Designers Italia](https://designers.italia.it/modelli/scuole/),
a partire dai template HTML ufficiali ([italia/design-scuole-pagine-statiche](https://github.com/italia/design-scuole-pagine-statiche), licenza BSD-3-Clause, vedi `LICENSE-designers-italia`).

## Struttura

- `public/` — il sito (pagine HTML + `assets/`). `index.html` è la home.
- `public/templates.html` — indice di tutti i 30 template del modello.
- `scripts/personalizza.mjs` — applica nome della scuola e collegamenti del menu ai template.
- `scripts/istituto-comprensivo.mjs` — organizza la Didattica per infanzia, primaria e secondaria di I grado.
- `scripts/scheda.mjs` — applica i dati della scheda anagrafica (contatti, plessi, persone, organizzazione, documenti).
- `scripts/servizi.mjs` — crea le schede dei servizi (mensa, trasporto, iscrizioni, registro elettronico...) e gli elenchi.
- `scripts/novita.mjs` — notizie, circolari, eventi e contenuti della home page.
- `scripts/documenti_pdf.py` — genera i 9 PDF di "Le carte della scuola" in `public/documenti/` (richiede `pip install reportlab pypdf`).

Gli script si eseguono in quest'ordine e si possono rieseguire:

```bash
node scripts/personalizza.mjs && node scripts/istituto-comprensivo.mjs && node scripts/scheda.mjs && node scripts/servizi.mjs && node scripts/novita.mjs
```

I dati dell'Istituto sono fittizi.

## In locale

```bash
npm run dev
```

Poi apri http://localhost:3000.

## Pubblicazione

Il repository è collegato a Vercel: ogni `git push` sul ramo `main` pubblica automaticamente il sito.
Per modificare un contenuto, modifica il relativo file in `public/` (anche direttamente da GitHub) e fai commit.
