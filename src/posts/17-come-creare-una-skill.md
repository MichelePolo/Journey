---
layout: layouts/post.njk
tags: [post]
title: "Come Creare una Skill per Claude Code"
subtitle: "Insegnare un mestiere a chi impara in fretta"
date: 2026-04-01
quote: "Dimmi e dimenticherò, mostrami e forse ricorderò, coinvolgimi e comprenderò."
quoteAuthor: "Benjamin Franklin"
---

## Il Manuale di Istruzioni che Non Sapevi di Poter Scrivere

Hai presente quando spieghi qualcosa a un collega nuovo? Le prime volte ripeti tutto: il contesto, le regole, le eccezioni. Poi a un certo punto gli scrivi un documento — non perché non ti fidi, ma perché quel documento è più affidabile della tua memoria alle otto di mattina.

Una **Skill** in Claude Code è esattamente questo: un documento di istruzioni che trasforma Claude in un assistente specializzato per un dominio specifico. Non un prompt generico. Un manuale operativo strutturato che Claude segue ogni volta che riconosce il contesto giusto.

Questo è il primo post di una serie di tutorial su Claude Code. Oggi partiamo dalle Skill perché sono lo strumento che mi ha dato la soddisfazione più immediata — e perché il caso reale che ho costruito, **ClaudeTrading**, è un buon esempio di quanto lontano si può arrivare con un singolo file Markdown ben scritto.

## Cos'è una Skill, in Concreto

Una Skill è un file `.md` che vive nella cartella `.claude/skills/` del tuo progetto. Quando Claude Code si attiva in quel progetto, legge automaticamente le skill disponibili e le utilizza come contesto operativo.

La differenza rispetto al `CLAUDE.md` è di scopo:

- **CLAUDE.md** → istruzioni generali sul progetto (convenzioni, architettura, comandi)
- **Skill** → istruzioni specializzate per un compito specifico (trading, deploy, analisi dati, testing)

Il `CLAUDE.md` è il regolamento interno dell'azienda. La Skill è il manuale di reparto.

La struttura minima di una Skill è semplice:

```markdown
# Nome della Skill

## Quando Attivarsi
Descrivi il trigger: quando l'utente menziona X, Y o Z, attiva questa skill.

## Contesto
Il dominio, le regole, i vincoli.

## Flusso Operativo
I passi che Claude deve seguire, in ordine.

## Vincoli
Cosa NON deve fare. Mai.
```

Non serve magia. Serve chiarezza.

## Il Caso Reale: ClaudeTrading

ClaudeTrading è una Skill che ho costruito per trasformare Claude in un assistente di trading su MetaTrader 5. L'idea era semplice: descrivere un'operazione in linguaggio naturale e ottenere un comando Python validato, pronto per l'esecuzione.

Non un chatbot che dà consigli finanziari. Un **traduttore strutturato** tra intenzione umana e comando macchina, con controlli di rischio integrati.

La Skill istruisce Claude a seguire un flusso preciso ogni volta che l'utente menziona trading:

1. **Analisi tecnica** — esegui prima gli indicatori (SMA, EMA, RSI, MACD, Bollinger, ATR, Stochastic, ADX, Pivot Points, TEMA)
2. **Verifica account** — controlla margine disponibile, posizioni aperte, esposizione
3. **Calcolo lotti** — dimensiona la posizione in base alla percentuale di rischio
4. **Riepilogo rischio** — mostra un sommario chiaro prima di qualsiasi azione
5. **Conferma esplicita** — chiedi all'utente prima di generare il comando
6. **Output** — comando CLI o strategia JSON, mai esecuzione automatica

Il punto chiave è il numero 6: la Skill contiene un vincolo esplicito — *"non eseguire mai automaticamente"*. Claude lo rispetta in modo affidabile. Quando i guardrail contano — e nel trading contano — questo pattern funziona.

### Un Esempio dal Vivo

Un utente scrive, in italiano:

> "Voglio aprire un trade ogni volta che la TEMA incrocia la linea del prezzo"

Una frase. Claude risponde implementando:

- La funzione `tema()` nel modulo indicatori (TEMA = 3×EMA1 − 3×EMA2 + EMA3)
- Una regola `tema_price_cross` nel monitor
- Una configurazione JSON pronta all'uso:

```json
{
  "name": "TEMA/Price crossover EURUSD H1",
  "type": "tema_price_cross",
  "enabled": true,
  "symbol": "EURUSD",
  "timeframe": "H1",
  "tema_period": 20,
  "volume": 0.01,
  "sl_points": 200,
  "tp_points": 400,
  "magic": 1001,
  "close_opposite": true
}
```

Una frase in linguaggio naturale → nuovo indicatore + regola di monitoraggio + configurazione JSON. Pronto per il `--dry-run` prima, per l'esecuzione reale dopo.

Questo è il potere di una Skill ben scritta: Claude non improvvisa. Segue il flusso, rispetta i vincoli, produce output strutturato.

### Il Post Originale su Claude.ai

Qui sotto trovate il post completo che ho pubblicato su ClaudeTrading, con tutti i dettagli tecnici e gli esempi di utilizzo:

<iframe src="https://claude.site/public/artifacts/bac34737-7b0c-43e8-92cc-30eea5b57b0a/embed" title="ClaudeTrading - Skill per MetaTrader 5" width="100%" height="600" frameborder="0" allow="clipboard-write" allowfullscreen></iframe>

## Come Scrivere una Skill che Funziona

Dopo aver costruito ClaudeTrading e averla testata a fondo, ho distillato alcune regole pratiche.

### 1. Sii Specifico sul Trigger

Non scrivere "quando l'utente chiede aiuto". Scrivi "quando l'utente menziona trading, ordini, posizioni, analisi tecnica, o simboli forex". Claude ha bisogno di pattern riconoscibili per attivarsi nel contesto giusto.

### 2. Definisci un Flusso, Non una Lista di Funzioni

La differenza tra una Skill mediocre e una buona è il **flusso decisionale**. Non elencare cosa Claude sa fare — descrivi l'ordine in cui deve farlo. "Prima analizza, poi verifica, poi calcola, poi mostra, poi chiedi conferma" è più potente di "può fare analisi, verifiche, calcoli".

### 3. I Vincoli Negativi Sono i Più Importanti

Scrivi cosa Claude **non deve mai fare**. "Non eseguire automaticamente." "Non procedere senza stop loss." "Non superare il 2% di rischio per operazione." I vincoli negativi sono rispettati con più affidabilità delle istruzioni positive, perché sono binari: o li violi o no.

### 4. Usa un Formato Intermedio

Nel caso di ClaudeTrading, il formato intermedio è JSON. Claude "pensa" in JSON, l'utente valida il JSON, il sistema esegue il JSON. Questa separazione è un'astrazione pulita: il linguaggio naturale entra, il formato strutturato esce, l'esecuzione è sempre sotto controllo umano.

### 5. Scrivi per il Caso Reale, Non per Quello Ideale

La Skill deve gestire l'utente che scrive in italiano, quello che scrive in inglese, quello che dimentica di specificare il simbolo, quello che chiede qualcosa di ambiguo. Non servono mille righe — serve anticipare i tre o quattro casi che capitano davvero.

## SKILL-CREATOR: Testare e Fare Benchmark

Scrivere una Skill è un'iterazione. Non esce perfetta al primo colpo — come qualsiasi codice, va testata.

Ho utilizzato **SKILL-CREATOR**, una skill specializzata nella creazione e nel benchmarking di altre skill. Il concetto è ricorsivo e un po' vertiginoso: una Skill che crea Skill. Ma funziona sorprendentemente bene.

Il flusso è questo:

1. Descrivi a Claude cosa vuoi che la tua skill faccia
2. SKILL-CREATOR genera una prima bozza strutturata
3. Testi la bozza in conversazione reale
4. Raccogli i casi in cui Claude non si comporta come previsto
5. Raffini la Skill, aggiungi vincoli, migliori il flusso
6. Ripeti

Il benchmark è qualitativo più che quantitativo: non stai misurando millisecondi, stai misurando **affidabilità comportamentale**. La domanda è: "se do questo input dieci volte, Claude segue il flusso tutte e dieci?" Se la risposta è no, la Skill ha bisogno di più chiarezza in quel punto specifico.

Con ClaudeTrading ho fatto una dozzina di iterazioni prima di arrivare a una versione stabile. Le prime bozze erano troppo vaghe nei vincoli di rischio. Le versioni intermedie erano troppo rigide nel flusso. La versione finale trova un equilibrio: struttura chiara, flessibilità dove serve, rigidità dove conta.

## Perché le Skill Funzionano Meglio dei Prompt

Un prompt è una conversazione. Una Skill è un contratto.

Il prompt vive nel momento: lo scrivi, Claude risponde, la prossima volta riscrivi tutto da capo. La Skill persiste: è un file nel progetto, versionato con git, condivisibile con il team, migliorabile nel tempo.

Ma la differenza più profonda è strutturale. Un prompt dice "fai questo". Una Skill dice "quando succede questo, segui questo flusso, rispetta questi vincoli, produci questo output". È la differenza tra dare un ordine e definire un ruolo.

Claude con una buona Skill non è più un assistente generico che prova a fare trading. È un assistente di trading che sa esattamente cosa fare, in che ordine, e cosa non fare mai.

## Lezioni Apprese

Costruire ClaudeTrading mi ha insegnato tre cose che non avevo previsto:

**Il file Markdown è più potente di quanto sembri.** Un singolo `.md` ben scritto cambia radicalmente il comportamento di Claude. Non serve un framework, non serve un'API custom, non serve un plugin. Serve scrivere bene.

**Il formato JSON come rappresentazione intermedia è un pattern riutilizzabile.** Non vale solo per il trading. Qualsiasi dominio dove devi tradurre intenzione in azione beneficia di un formato intermedio che l'utente può validare prima dell'esecuzione. Deploy, configurazioni, query, pipeline — il pattern è lo stesso.

**I guardrail funzionano quando sono espliciti.** "Non eseguire mai automaticamente" funziona. "Sii prudente" no. Claude rispetta le regole binarie con affidabilità. Le regole sfumate le interpreta — e l'interpretazione non è sempre quella che volevi.

## Inizia dalla Tua Skill

Se vuoi provare, il percorso più breve è questo:

1. Pensa a un compito che ripeti spesso con Claude
2. Scrivi il flusso che segui mentalmente quando lo fai
3. Aggiungi i vincoli — cosa non deve mai succedere
4. Metti il file in `.claude/skills/`
5. Testa, rompi, migliora

Non serve che sia perfetta. Serve che sia chiara.

Il repository di ClaudeTrading è su GitHub: [github.com/MichelePolo/ClaudeTrading](https://github.com/MichelePolo/ClaudeTrading). Può servire come riferimento concreto per la struttura di una Skill reale.

Nel prossimo post della serie parleremo di **Hooks** — l'altro strumento che cambia radicalmente il modo in cui Claude Code lavora nel tuo progetto.

---

**Serie "Come Utilizzare Claude Code"**
- **Post 1**: Come Creare una Skill ← *Sei qui*
