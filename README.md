# Journey Blog Template

Un template per blog minimalista basato su [Eleventy](https://www.11ty.dev/), progettato per essere semplice da configurare e personalizzare.

## Caratteristiche

- Generatore di siti statici con Eleventy
- Deploy automatico su GitHub Pages tramite GitHub Actions
- Sistema di post con frontmatter YAML
- Supporto per citazioni nei post
- Filtri per formattazione date in italiano
- Design minimalista e responsive

## Prerequisiti

- [Node.js](https://nodejs.org/) versione 20 o superiore
- [Git](https://git-scm.com/)
- Un account [GitHub](https://github.com) (per il deploy)

## Installazione

### 1. Clona il repository

```bash
git clone https://github.com/MichelePolo/Journey
cd Journey
```

Oppure usa questo repository come template:
1. Clicca su "Use this template" su GitHub
2. Crea un nuovo repository con il tuo nome
3. Clona il tuo nuovo repository

### 2. Installa le dipendenze

```bash
npm install
```

### 3. Avvia il server di sviluppo

```bash
npm run dev
```

Il sito sarà disponibile su `http://localhost:8080`

## Personalizzazione

### Configurazione base

#### 1. Modifica il `pathPrefix` in `.eleventy.js`

Se pubblichi su GitHub Pages con un repository chiamato `Journey`, il sito sarà su `https://TUO_USERNAME.github.io/Journey/`.

```javascript
// .eleventy.js, riga 30
pathPrefix: "/Journey/",  // Cambia "Journey" con il nome del tuo repo
```

Se invece usi un dominio personalizzato o il repository è `TUO_USERNAME.github.io`, rimuovi o commenta questa riga:

```javascript
// pathPrefix: "/Journey/",
```

#### 2. Aggiorna il `package.json`

```json
{
  "name": "il-tuo-blog",
  "author": "Il Tuo Nome",
  "description": "La descrizione del tuo blog"
}
```

### Creare nuovi post

I post vanno nella cartella `src/posts/`. Ogni post è un file Markdown con frontmatter YAML.

Esempio di post (`src/posts/mio-primo-post.md`):

```markdown
---
layout: layouts/post.njk
tags: [post]
title: "Il mio primo post"
subtitle: "Un sottotitolo accattivante"
date: 2025-01-11
quote: "Una citazione ispiratrice (opzionale)"
quoteAuthor: "Autore della citazione (opzionale)"
---

## Il contenuto del post inizia qui

Scrivi il tuo contenuto in Markdown...
```

#### Campi del frontmatter

- `layout`: Template da usare (solitamente `layouts/post.njk`)
- `tags`: Array di tag, `[post]` è obbligatorio per includere il post nella lista
- `title`: Titolo del post
- `subtitle`: Sottotitolo (opzionale)
- `date`: Data nel formato `YYYY-MM-DD`
- `quote`: Citazione da mostrare (opzionale)
- `quoteAuthor`: Autore della citazione (opzionale)

### Modificare lo stile

Gli asset (CSS, JavaScript, immagini) si trovano in `src/assets/`. Modifica questi file per personalizzare l'aspetto del tuo blog.

### Modificare i layout

I template Nunjucks sono in `src/_includes/layouts/`. Qui puoi modificare:
- `post.njk`: Layout dei singoli post
- Altri layout presenti nella cartella

## Deploy su GitHub Pages

Il repository include già un workflow GitHub Actions (`.github/workflows/deploy.yml`) che automatizza il deploy.

### Configurazione GitHub Pages

1. Vai nelle impostazioni del tuo repository su GitHub
2. Vai in **Settings > Pages**
3. Sotto **Source**, seleziona **GitHub Actions**
4. Fai un push sul branch `main`
5. Il sito verrà automaticamente buildato e pubblicato

Il sito sarà disponibile su `https://tuo-username.github.io/nome-repo/`

### Build manuale

Per buildare il sito localmente:

```bash
npm run build
```

Il sito buildato sarà nella cartella `_site/`.

## Struttura del progetto

```
Journey/
├── .github/
│   └── workflows/
│       └── deploy.yml          # GitHub Actions per deploy automatico
├── src/
│   ├── _data/                  # Dati globali del sito
│   ├── _includes/
│   │   └── layouts/            # Template Nunjucks
│   ├── assets/                 # CSS, JS, immagini
│   ├── pages/                  # Pagine statiche
│   └── posts/                  # Post del blog (*.md)
├── .eleventy.js                # Configurazione Eleventy
├── package.json
└── README.md
```

## Comandi disponibili

- `npm run dev` - Avvia server di sviluppo con hot reload
- `npm run build` - Build del sito per produzione

## Personalizzazione avanzata

### Cambiare la lingua

I filtri per le date sono configurati in italiano in `.eleventy.js`:

```javascript
eleventyConfig.addFilter("readableDate", (dateObj) => {
  const options = { year: 'numeric', month: 'long', day: 'numeric' };
  return new Date(dateObj).toLocaleDateString('it-IT', options); // Cambia 'it-IT'
});
```

### Aggiungere nuove collezioni

In `.eleventy.js` puoi aggiungere nuove collezioni:

```javascript
eleventyConfig.addCollection("tutorial", function(collectionApi) {
  return collectionApi.getFilteredByTag("tutorial");
});
```

### Aggiungere filtri personalizzati

```javascript
eleventyConfig.addFilter("nomeFilter", function(value) {
  // La tua logica
  return value;
});
```

## Risoluzione problemi

### Il sito non si carica correttamente su GitHub Pages

Verifica che il `pathPrefix` in `.eleventy.js` corrisponda al nome del tuo repository.

### Gli asset non vengono caricati

Controlla la configurazione `addPassthroughCopy` in `.eleventy.js`.

### Errori durante il build

Assicurati che:
- Tutti i post abbiano il frontmatter corretto
- Non ci siano errori di sintassi nei file Markdown
- I template Nunjucks siano validi

## Licenza

Questo progetto è open source. Sentiti libero di usarlo, modificarlo e personalizzarlo per il tuo blog.

## Risorse utili

- [Documentazione Eleventy](https://www.11ty.dev/docs/)
- [Nunjucks Template Language](https://mozilla.github.io/nunjucks/)
- [Markdown Guide](https://www.markdownguide.org/)
- [GitHub Pages Documentation](https://docs.github.com/en/pages)

## Contribuire

Se trovi bug o hai suggerimenti per migliorare questo template, apri pure una issue o una pull request!
