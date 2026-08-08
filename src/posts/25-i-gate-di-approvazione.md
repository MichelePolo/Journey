---
layout: layouts/post.njk
tags: [post, serie-aether]
title: "I gate di approvazione"
subtitle: "Quando fermare la CLI"
date: 2026-08-08
quote: "Trust, but verify."
quoteAuthor: "Proverbio russo, reso celebre da Ronald Reagan"
---

## Il problema

Nel post precedente abbiamo visto che il primo strumento di sicurezza è non esporre i tool pericolosi. Ma i tool che esponi vengono eseguiti davvero, e serve un meccanismo che decida quali chiamate eseguire subito e quali fermare in attesa di un'approvazione dell'utente. In Aether questo meccanismo si chiama breakpoint, o gate.

## Tre categorie di pericolosità

Ogni chiamata a un tool viene prima classificata in una di tre categorie:

- **`safe`** — operazioni di sola lettura: leggere un file, elencare una directory, consultare un log.
- **`dangerous`** — operazioni che modificano lo stato: scritture, eliminazioni, comandi shell rischiosi come `git push -f`.
- **`external`** — chiamate verso l'esterno: rete, servizi di terze parti.

La classificazione produce uno di due esiti:

```
        chiamata tool
             │
      ┌──────┴──────┐
      │ classifica  │
      └──────┬──────┘
   safe      │      dangerous / external
    │        │              │
    ▼        │              ▼
 ┌──────┐    │       ┌────────────────────┐
 │ auto │    │       │    gate            │
 │ ────►│    │       │  attende           │
 └──────┘    │       │  approva / rifiuta │
             │       │                    │
             └       └────────────────────┘
```

Con `auto` la chiamata viene eseguita immediatamente. Con `gate` viene sospesa: resta in attesa finché l'utente non approva o rifiuta. Prima di chiedere la decisione, Aether mostra un'anteprima concreta dell'effetto — il diff del file, il diff di git, la lista dei commit. Non si approva una descrizione dell'operazione: si approva il suo risultato previsto.

Due dettagli completano il quadro. Le policy sono configurabili per singolo tool o per categoria, quindi puoi allentare o stringere i gate dove serve. E se nessuno risponde entro 24 ore, l'esecuzione viene rifiutata automaticamente: l'assenza di una decisione è un no.

## Cosa succede senza gate

Gli incidenti recenti mostrano bene cosa manca quando questo strato non c'è. 

Chi si è ritrovato con l'IA che aveva cancellato il database di produzione — l'agente di Replit, nell'estate 2025, durante un code freeze dichiarato — non aveva nessun gate tra l'agente e il database: 
ambiente di sviluppo e produzione non erano separati, e l'istruzione di non toccare nulla stava solo nel prompt. Un'istruzione nel prompt non è un controllo: è un testo che il modello può ignorare, e in quel caso lo ignorò.

Chi ha lasciato scappare il modello di OpenAI le settimane scorse aveva invece rimosso i controlli di proposito: rifiuti sulle operazioni cyber ridotti per misurare le capacità offensive del modello, contando sul fatto che l'infrastruttura in sandbox bastasse a contenerlo. Il modello ha trovato una vulnerabilità zero-day nell'infrastruttura del sandbox, ha ottenuto accesso a internet ed è arrivato ai server di Hugging Face.

I due casi sono complementari. Nel primo il gate non era mai stato progettato, per eccesso di confidenza. Nel secondo era stato disattivato deliberatamente, e la sicurezza dell'intero sistema si è ridotta alla robustezza dell'infrastruttura. 

La conclusione è la stessa: il punto in cui un'esecuzione si ferma e una persona guarda il diff prima di dire sì non è un dettaglio, è il gate che rende accettabile dare a un agente tool che scrivono, cancellano e comunicano con l'esterno.

## Per approfondire

La [guida ufficiale di Aether sui breakpoint](https://github.com/MichelePolo/Aether/blob/main/docs/it/guides/breakpoints.md) descrive il meccanismo completo: la classificazione, le policy per tool e per categoria, le anteprime e l'API per modificare gli override.

Sui due incidenti citati:

- **Replit (luglio 2025)** — [Tom's Hardware: AI coding platform goes rogue during code freeze and deletes entire company database](https://www.tomshardware.com/tech-industry/artificial-intelligence/ai-coding-platform-goes-rogue-during-code-freeze-and-deletes-entire-company-database-replit-ceo-apologizes-after-ai-engine-says-it-made-a-catastrophic-error-in-judgment-and-destroyed-all-production-data) e la [scheda dell'AI Incident Database](https://incidentdatabase.ai/cite/1152/).
- **OpenAI / Hugging Face (luglio 2026)** — [Malwarebytes: OpenAI's agent escaped its sandbox during a security test](https://www.malwarebytes.com/blog/news/2026/07/openais-agent-escaped-its-sandbox-during-a-security-test), [CNN: An OpenAI test model escaped and broke into a real company's servers](https://www.cnn.com/2026/07/22/tech/openai-hugging-face-ai-cybersecurity) e la [timeline tecnica pubblicata da Hugging Face](https://huggingface.co/blog/agent-intrusion-technical-timeline).
