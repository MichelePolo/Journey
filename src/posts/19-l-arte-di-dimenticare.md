---
layout: layouts/post.njk
tags: [post, ai, philosophy]
title: "L'Arte di Dimenticare"
subtitle: "Costruire la memoria di un agente AI è un esercizio borgesiano."
date: 2026-05-04
---

Borges, nel 1942, immaginò un uomo che dopo una caduta da cavallo non riuscì più a dimenticare nulla.

*Ireneo Funes ricordava ogni foglia di ogni albero, ogni nuvola di ogni pomeriggio, ogni sfumatura di ogni voce che gli avesse mai parlato. Per noi è una fantasia irresistibile — chi non vorrebbe ricordare tutto? Borges però fa di Funes non un genio ma un infermo. Funes non riesce a pensare. Pensare è generalizzare; generalizzare significa prima dimenticare.*

Mi è tornato alla mente quel racconto dopo aver passato giorni a progettare una CLI per la gestione di agenti AI che facesse disclosure e manipulation del context window e della memoria.
Sulla carta sembra tutto pulito. L'utente fa una domanda, il sistema recupera ciò che è rilevante, il modello risponde, il tutto si chiude. Una sessione. In produzione, però, c'è una domanda che mette in ginocchio il novanta per cento delle architetture: di tutto quello che *potrebbe* entrare nella finestra di contesto, cosa ci entra davvero?
La risposta è che ci entra di tutto. E la logica che sta dietro a questo di tutto è assurdamente complessa.
 
Un grazie a [Mosè Bottacini](https://www.linkedin.com/in/mosebottacini/) per il suo guardare sotto il cofano e per i system prompt della Claude Code CLI.

Il problema non è la memoria. Il problema è la **selezione**.

A ventisette anni pensavo che essere un buon programmatore significasse ricordare tutto. Ogni package di Oracle, ogni signature delle standard libraries Java, ogni opzione di Solaris. A quarantasette ho capito che essere un buon programmatore significa sapere *cosa ignorare*. La memoria umana, vista da fuori, è un disastro: dimentica, distorce, riscrive. Vista da dentro è un capolavoro di compressione — tiene quello che serve a navigare il mondo e butta il resto. Funes era semplicemente un sistema senza politica di eviction.

E' così che dimentichiamo la strada percorsa in macchina per andare al lavoro, non perchè non guidiamo in stato di alert, ma perchè appena arrivati a destinazione il cervello comprime la memoria del percorso inutile, monotono e privo di eventi significativi sugli altri 5000 viaggi fatti per arrivare in ufficio, e libera risorse per la giornata.

## La scrivania

Quando costruisci un agente, ti accorgi che il modello è la parte facile. Il difficile è la gestione della memoria e la selezione delle informazioni da inserire nel context window.

Immagina la scrivania di chi sta lavorando a un progetto.

- Sopra, in questo momento, c'è il foglio aperto: gli appunti presi durante la giornata, ciò che chiamiamo *short-term memory*.

- Sullo scaffale dietro, in ordine sparso, ci sono i libri che potrebbero servire — la *long-term memory*, raggiungibile per significato, non per posizione. È il vector search che ti restituisce il libro giusto anche se non ne ricordi il titolo, solo l'argomento. 

- Sul lato c'è un quaderno aperto, dove stai annotando lo stato di quello che fai: attività completate, operazioni in attesa, l'errore da rivedere. È lo *state*. 

- E poi c'è l'agenda: quando questo task parte, quando quell'altro si sveglia, chi avvisa chi quando finisce. È la *coordinazione*.

Quattro funzioni diverse. Quattro velocità diverse. Quattro discipline diverse di lettura e scrittura.

In produzione, queste quattro funzioni devono vivere nello stesso mobile. Se le metti in quattro sistemi separati, paghi la latenza dei sistemi distribuiti.

Redis, per quel che ho capito, copre tutti e quattro i ruoli: strutture in-memory per la scrivania, vector search per lo scaffale, hash e JSON per il quaderno, stream per l'agenda. La cache e lo stato restano sotto il millisecondo; il vector search dipende da workload e configurazione dell'indice — più grande è la biblioteca, più tempo serve a cercare. Niente meno di ciò che ti serve.

## La simmetria

Quel che mi colpisce, alla fine, non è l'eleganza tecnica. È la simmetria filosofica.

La nostra identità — quella che chiamiamo "io" — è anche lei un'architettura di memoria con politiche di eviction. Ogni mattina decidiamo, senza saperlo, cosa portare nella scrivania di oggi. Cosa lasciare nello scaffale. Cosa annotare nel quaderno. A quale appuntamento rispondere. Funes non poteva fare niente di tutto questo. Per Funes non esisteva un "oggi" distinto da tutti i giorni precedenti messi insieme: tutto era presente, tutto contemporaneo, tutto uguale. Ed era esattamente questo che lo paralizzava.

Costruire un agente, mi sto convincendo, non è automatizzare l'intelligenza. È riconoscere che l'intelligenza — la nostra e la loro — vive in larga parte nelle politiche silenziose di selezione. Cosa si trasferisce allo scaffale. Cosa scade. Cosa si riassume. Cosa si butta senza rimorsi.

La parte facile è insegnare a una macchina a ricordare.

La parte ambiziosa — quella che mi tiene sveglio — è insegnarle a dimenticare il superfluo, anche perchè lo paghiamo in token e in qualità della risposta.
