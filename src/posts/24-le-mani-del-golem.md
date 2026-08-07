---
layout: layouts/post.njk
tags: [post, serie-aether, tutorial]
title: "Le Mani del Golem"
subtitle: "Lo shem dà il nome, i tool danno le mani. Cos'è il Model Context Protocol, come si implementa un server, e perché le mani che non dai contano quanto quelle che dai."
date: 2026-08-04
quote: "L'uomo è il più intelligente degli animali perché ha le mani."
quoteAuthor: "Anassagora, riportato da Aristotele nel De partibus animalium"
---

Nel post precedente ho riportato per intero il System Prompt di Aether — versione 38, 8267 caratteri. Se siete arrivati in fondo a quel testo avrete notato che non finiva con le sezioni Voice, Honesty e Safety: sotto c'era una lista di venticinque strumenti, ognuno con un nome e una descrizione. `Terminal.execute_command`, `Filesystem.read_text_file`, `Git.git_push`. Mi sono trattenuto dal parlarne, perché quella lista è la seconda metà della storia. Eccola.

Un Golem con il solo nome è una creatura che parla. Risponde, argomenta, consiglia - ma non tocca niente. È la differenza tra un consulente e un collaboratore: al consulente chiedi *cosa faresti tu?*, al collaboratore dici *fallo*. Perché un'IA possa fare qualcosa dobbiamo fornirla delle mani. E da fine 2024 esiste un modo standard per dargliele: si chiama **Model Context Protocol**.

## Una sola lingua

Prima di MCP ogni applicazione basata su LLM integrava ogni strumento a modo suo: N assistenti per M strumenti facevano N×M integrazioni su misura, ognuna col suo formato, i suoi bug, la sua manutenzione. Poi Anthropic ha pubblicato un protocollo aperto e l'industria - cosa rara - l'ha adottato in blocco: un server scritto una volta funziona con qualunque host conforme. M e basta.

Genesi 11: *«Tutta la terra aveva una sola lingua e le stesse parole»*. Nella storia della torre di Babele la lingua unica è il pericolo e la confusione delle lingue la punizione. Nel nostro mestiere è l'esatto contrario: la confusione delle lingue è lo stato di natura, la lingua unica è la conquista. HTTP, SQL, USB - riusciamo a costruire torri solo quando smettiamo di tradurre. 
MCP è nella sostanza il concetto di API riportato al mondo degli LLM: al prompt viene concatenata la lista degli strumenti disponibili, con la descrizione, in linguaggio naturale, di cosa fanno e di come vanno chiamati. Siamo cresciuti sviluppando comandi con argomenti fissi, e quell'era oggi ci ritorna utile.

## Tre ruoli e due fatti

I ruoli del protocollo sono tre, e nessuno è una novità:

- **Host** — l'applicazione LLM (Aether, Claude Code, l'assistente nell'IDE). Decide *quali* server connettere e *quando* un tool può girare.
- **Client** — l'oggetto-connessione che l'host possiede, uno per server.
- **Server** — il processo o l'endpoint che espone le capacità. Non sa nulla di chi lo interroga: risponde e basta.

Sotto il cofano il formato è JSON-RPC 2.0 su un trasporto: **stdio** (l'host lancia il server come processo figlio e scambia JSON riga per riga su stdin/stdout) oppure **HTTP** (un endpoint remoto). La sessione si apre con un handshake - `initialize` - e poi parla tre primitive: **tools** (funzioni che il *modello* ha a disposizione), **resources** (dati che l'*host* inietta come contesto), **prompts** (template che l'*utente* richiama). In pratica, quasi tutti gli host agentici di oggi usano solo la prima: ad oggi si fa così.

I fatti che cambiano tutto, però, sono due — e valgono da soli il tutorial.

**Primo: l'LLM non parla mai con il server.** La calcolatrice non chiama niente: emette un'*intenzione* — un JSON che dice "vorrei invocare `get_weather` con `city: Milano`" — e si ferma. Chi esegue è l'host.

**Secondo: il gate dei permessi vive nell'host**, esattamente in quello spazio tra l'intenzione e l'esecuzione. Ed è per questo che funziona identico per ogni server, compresi quelli che non hai scritto tu.

```
Utente            Host (l'harness)        LLM          Server MCP
  │                     │                  │                │
  │                     │    initialize + tools/list        │
  │                     ├──────────────────────────────────>│
  │                     │<──────────────────────────────────┤
  │ "che tempo fa       │                  │                │
  │  a Milano?"         │                  │                │
  ├────────────────────>│ prompt + tool    │                │
  │                     ├─────────────────>│                │
  │                     │ intenzione:      │                │
  │                     │ get_weather(MI)  │                │
  │                     │<─────────────────┤                │
  │  ┌──────────────────┴────────────────┐ │                │
  │  │ GATE DEI PERMESSI — vive qui:     │ │                │
  │  │ auto se safe, chiede se dangerous │ │                │
  │  └──────────────────┬────────────────┘ │                │
  │                     │    tools/call (JSON-RPC)          │
  │                     ├──────────────────────────────────>│
  │                     │    content + isError              │
  │                     │<──────────────────────────────────┤
  │                     │ risultato nel    │                │
  │                     │ context (18°sun) │                │
  │                     ├─────────────────>│                │
  │ "A Milano 18°C,     │<─────────────────┤                │
  │  sereno"            │                  │                │
  │<────────────────────┤                  │                │
```

## Anatomia di una mano

Un tool è tre cose: un nome, una descrizione, un JSON Schema degli argomenti.
Sempre l'esempio del meteo.

```json
{
  "name": "get_weather",
  "description": "Meteo attuale per una città. Sola lettura,
                  nessun effetto collaterale. Timeout 10s.",
  "inputSchema": {
    "type": "object",
    "properties": { "city": { "type": "string" } },
    "required": ["city"]
  }
}
```

La riga da sottolineare è la seconda: **la descrizione è un prompt**. È l'unica documentazione che il modello vede nel momento in cui decide se e come invocare, quindi limiti, default e rifiuti vanno dichiarati lì. Rileggete la lista del post precedente: "30s default timeout, dangerous patterns blocked", "Never force". Non sono note per l'utente. Sono ordini per la creatura — lo shem che continua, un tool alla volta.

Il secondo punto è il modello mentale sui risultati: **il risultato di un tool si prepara per il modello, non per un software**. La risposta è un blocco di contenuto più un flag `isError`, e la distinzione che conta è la stessa che nel mondo REST separa il 500 dall'errore di business: un fallimento *di dominio* (file non trovato, saldo insufficiente, exit code 1) va riportato come contenuto leggibile, così l'LLM nel loop agentico può capire e reagire; l'errore *di protocollo* si riserva alle chiamate malformate. Un server che risponde ai fallimenti di dominio con errori di protocollo uccide lo scambio e basta - la creatura non può recuperare da ciò che non può leggere.

## Quanto costa un server

Meno di quanto pensiate. Il builtin Terminal di Aether, `aether-shell.ts`, è un server MCP completo in un centinaio di righe: un loop che accumula stdin, spezza per newline, fa `JSON.parse` e risponde a tre metodi.

```ts
// il protocollo, tutto qui
process.stdin.on('data', (chunk) => {
  for (const line of righeComplete(chunk)) {
    const req = JSON.parse(line);
    switch (req.method) {
      case 'initialize': rispondi(req.id, capabilities());     break;
      case 'tools/list': rispondi(req.id, { tools: [TOOL] });  break;
      case 'tools/call': rispondi(req.id, await esegui(req));  break;
    }
  }
});
```

Fine del protocollo, letteralmente. La scelta architetturale che vi porto a casa è un'altra: la logica non sta lì dentro. L'handler è una funzione pura, separata, testabile in-process con il vostro test runner preferito - senza avviare il server, senza parlare JSON-RPC. I test del protocollo e i test della logica sono cose diverse, e tenerle separate è la differenza tra un giocattolo e uno strumento.

## Le tre strade - e le mani che non dai

I tre builtin di Aether implementano tre strategie deliberatamente diverse, ed è il motivo per cui sono un buon materiale di studio:

**Filesystem** — riusa il pacchetto ufficiale `@modelcontextprotocol/server-filesystem`.
La lezione: quando esiste un server ufficiale maturo, il valore non è reimplementarlo ma *confinarlo* — le root consentite si passano allo spawn, e il server nasce incapace di uscirne.

**Terminal** — fatto in casa, un solo tool generico.
La lezione: massima flessibilità, massima superficie d'attacco — ogni chiamata attende l'approvazione.

**Git** — fatto in casa, dieci tool specializzati.
La lezione: ogni tool codifica invarianti che una descrizione non può garantire.

Il confronto Terminal↔Git è la lezione di design del software più importante: **un tool generico guadagna flessibilità pagando in superficie d'attacco; N tool specifici guadagnano stabilità**. E gli argomenti vanno trattati come ostili in entrambi i casi — sono testo generato dal modello, ed è da lì che la prompt injection arriva.

Ma la lezione di sicurezza più importante è lo strato zero. In Git di Aether, `git_rebase`, `git_reset` e il force-push non sono vietati, non sono gated: **semplicemente non esistono**. Non compaiono in `tools/list`. Non si scrive nella descrizione "ricordati di non cancellare il database" sperando che basti - la prompt injection più elaborata del mondo non può invocare una funzione che non c'è. Nel dubbio, la mano non si dà.

## Anassagora e Aristotele

Anassagora sosteneva che l'uomo è il più intelligente degli animali *perché* ha le mani. Aristotele lo rimprovera nel De partibus animalium: è il contrario - la natura ha dato le mani all'uomo perché era il più intelligente.

Per la nostra creatura la disputa si scioglie in un modo che nessuno dei due aveva previsto: intelligenza e mani arrivano separate, e da mani diverse. Il modello - l'intelligenza, o il suo simulacro - lo scegli ma non lo plasmi; le mani invece le dichiari una per una, e ogni tool è una frase in più nel linguaggio con cui la creatura tocca il mondo. Il Wittgenstein del post precedente vale anche qui, solo più concreto: i limiti dei suoi tool sono i limiti di ciò che può *fare*. Ogni mano che non dai è una frase che non può pronunciare - ed è l'unica garanzia, l'unica davvero, che nessuna injection, nessuna svista, nessun click distratto su "approva" potrà mai pronunciarla al posto suo.

## Per approfondire

Questo era l'ingresso. La [guida ufficiale di Aether sui server MCP builtin](https://github.com/MichelePolo/Aether/blob/main/docs/it/guides/builtin-mcp.md) è il tutorial completo di quello che ho imparato durante l'implementazione: la checklist delle dieci best practice distillate dall'ecosistema, i tre builtin riga per riga, il ciclo di vita dei processi (pooling per workspace, eviction LRU), la sicurezza a strati nel dettaglio, e la ricetta per aggiungere un quarto builtin senza toccare il resto.

E come sempre: Aether è un harness, e un harness serve a imparare facendo. Apritela, abilitate i toggle dei builtin, guardate nel pannello di Reasoning come i tool vengono dichiarati al modello. Poi scrivete il vostro server da cento righe e collegatelo. 
**La creatura ha già un nome *ma glielo potete cambiare* - ha anche già 3 mani *ma altre gliele potete dare voi*.**
