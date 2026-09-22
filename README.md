# Istituto Comprensivo Homo Sapiens

Sito web della scuola basato sul [modello Scuole di Designers Italia](https://designers.italia.it/modelli/scuole/),
a partire dai template HTML ufficiali ([italia/design-scuole-pagine-statiche](https://github.com/italia/design-scuole-pagine-statiche), licenza BSD-3-Clause, vedi `LICENSE-designers-italia`).

## Struttura

- `public/` — il sito (pagine HTML + `assets/`). `index.html` è la home.
- `public/templates.html` — indice di tutti i 30 template del modello.
- `scripts/personalizza.mjs` — applica nome della scuola e collegamenti del menu ai template.

## In locale

```bash
npm run dev
```

Poi apri http://localhost:3000.

## Pubblicazione

Il repository è collegato a Vercel: ogni `git push` sul ramo `main` pubblica automaticamente il sito.
Per modificare un contenuto, modifica il relativo file in `public/` (anche direttamente da GitHub) e fai commit.
