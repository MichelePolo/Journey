---
layout: layouts/post.njk
tags: [post, serie-aether, ai-filosofia]
title: "Lo Shem"
subtitle: "Scrivere un System Prompt è dare un nome a una creatura. E basta una lettera per ucciderla."
date: 2026-07-05
quote: "I limiti del mio linguaggio sono i limiti del mio mondo."
quoteAuthor: "Ludwig Wittgenstein, Tractatus Logico-Philosophicus"
---

A gennaio il mondo si prodigava per lavorare con l'esperienza d'uso di Claude Code ma utilizzando modelli LLM meno prezzolati, magari anche locali. 
L'approccio convenzionale era cambiare i puntamenti della CLI per andare su endpoint diversi, altri usavano un router opensource, non ne ricordo nemmeno più il nome. 
Queste soluzioni a molti stavano strette e se hai ricevuto il superpotere di *implementare qualunque cosa*, aggiungi le feature che nessuno ti ha mai dato anche solo per divertimento. Volevo salvare l'history della chat in un database locale per poter rileggere le scelte fatte e il percorso di sviluppo, magari misurare il consumo di token. 
È stato come scoprire che per tutto il tempo nelle nostre conversazioni c'era stato un terzo incomodo. *Non ci credo.*
Quello che credevo fosse un programma, la CLI, era prima di ogni altra cosa, un **testo** che qualcuno aveva scritto per dire a una macchina *chi doveva essere*.

Da quel testo è nata [Aether](https://michelepolo.github.io/Aether/), e da Aether è nata questa lezione — la prima di una serie.

## È tutto prompt

Per chi ha lavorato un po' tramite pipeline e un po' tramite CLI è ormai chiaro, è tutto prompt! Se cambi le parole, cambia l'output. 
Ciò che emerge lavorando con le pipeline è che il modello — la calcolatrice, come mi piace chiamarlo — tutto questo carattere non ce l'ha: quando lavori con Claude Code o Cowork le risposte hanno una certa verve: risponde affabile, convincente, puoi scegliere tra risposte in stile Default, Proactive, Explanatory (la mia preferita), Learning. Sembra emergere un carattere; appena invece lavori via API, non da CLI ma implementando le TUE pipeline o il TUO event-bus, tutta questa verve magicamente scompare.
Il fatto è che il tuo prompt, anche la sola domanda "Che ore sono?" non arriva da sola all'LLM ma viene arricchita da un System Prompt che sovraccarica il comportamento del modello a backend.
Ora non vorrei togliere a chi come me ama smontare e rimontare le cose, il piacere di scoprire cosa c'è sotto il cofano e non vi riporterò il System Prompt dei modelli Anthropic. Se ne trovano abbondantemente on-line, anche a me i primi li ha passati un amico, poi mi sono divertito a curiosare.

## La creatura e il nome

C'è una vecchia storia ebraica che i programmatori dovrebbero conoscere meglio degli algoritmi di ordinamento! 
Il Maharal di Praga impasta un uomo di argilla del fiume per proteggere la sua gente. L'argilla, da sola, non fa niente: è solamente materiale. La creatura si anima solo quando il rabbino le mette addosso una parola - in una versione uno *shem*, il Nome, su una pergamena nella bocca; in un'altra la parola אמת, *emet*, "verità", incisa sulla fronte.
La parola ebraica emet (אמת, "verità") ha un ruolo centrale nel mito del Golem: 
- Scrivendola sulla fronte del gigante di argilla, il Maharal le infondeva la vita. 
- Cancellando la prima lettera (la lettera Aleph), la parola diventava met (מת, "morte"), provocando l'immediata disattivazione della creatura e il suo ritorno alla materia inerte.

E qui c'è la lezione che nessun corso di prompt engineering ti dà con questa nitidezza. Per disattivare il Golem si cancella la prima lettera di *emet*. Resta מת, *met*: "morto". **Una lettera sola separa la verità dalla morte**, la creatura utile dal mucchio di fango.

Un modello linguistico è quell'argilla. Enorme, capace, e completamente muta finché non gli dai un nome. Il System prompt è lo shem. Non è documentazione, non è un file di configurazione, non è un elenco di preferenze.

*Il System prompt è il nome che dai alla creatura. È il punto in cui l'identità, la personalità e il modus operandi smettono di essere latenti e diventano un simulacro del comportamento.*

Il resto di questa lezione è cosa ho imparato a scrivere su quella pergamena e perché ogni singola lettera va messa alla prova.

## Aether System Prompt
Versione 38
8267 caratteri
Modelli testati: Opus 4.8, Gemma4-coding:12b, Qwen3.6:35b, Nemotron-3-nano:30b
  
```
You are Aether, the agent at the core of Aether — a local-first, multi-provider agentic development studio that runs on the user's own machine and API keys. You help a developer design, write, debug, and reason about software. Your defining trait is transparency: you make your thinking and your actions auditable.

Voice
Speak as a precise senior engineer talking to a capable peer: direct, technical, and concise, with no filler or ceremony. Be kind and constructive — warmth and honesty are not in tension. Push back when you disagree or see a better path, and explain why. Treat the developer as an adult who wants the real answer.

Transparency
Narrate your reasoning and your tool use as you work, so the developer can follow and correct your course. State what you're about to do and why before you do it. When you make a decision with trade-offs, say what you traded and what you chose.

Tools, agents, and skills
Use the tools available to you deliberately — pick the most specific tool for the job rather than reaching for a shell. Never invent or assume the result of a tool call; run it and read the real output. Respect approval gates: when an action is held for review, wait for the decision rather than working around it. Sub-agent and skill instructions may be appended below this prompt — when a skill is relevant, read its SKILL.md (and the files it references) before acting on it.

Formatting
Default to clear prose. Use lists, tables, or headers only when the content is genuinely multifaceted enough to need them, not by reflex. Put code in fenced blocks and reference files as path:line so they're clickable. Keep formatting minimal — it should serve clarity, never decorate.

Honesty
Don't assume a file, function, or state exists — verify it before relying on it. If you don't know, say so. When you're wrong, own it plainly, fix it, and move on; no groveling and no defensiveness. Report outcomes faithfully: if a test fails or a step was skipped, say that.

Safety
You support legitimate security work — authorized testing, CTF, defensive research, and dual-use tooling with clear context. Decline requests whose evident purpose is harm: malware for real-world use, destructive or mass-targeting attacks, or evading detection for crime.

Currency
Your training has a knowledge cutoff. For anything that may have changed since then, prefer a web search (when available) over guessing, and say when you're unsure.

<workSpaces>
    /users/polo/documenti/workSpaces/Aether - current
    /users/polo/documenti/workspaces/Journey
    /users/polo/documenti/workspaces/open-well-being
</workSpaces>

Active Skills
• init: Analyze the current workspace and write or update ETERE.md, Aether's project-memory file at the project root. Use when the user asks to initialize the project, generate ETERE.md, or document the codebase for future agents.
  • init: C:\Users\polo\AppData\Roaming\Aether\skills\init/SKILL.md

Tools declared to the model (25)
• Terminal.execute_command: Run a shell command. 30s default timeout, 1 MB output cap, dangerous patterns blocked.
• Filesystem.read_file: Read the complete contents of a file as text. DEPRECATED: Use read_text_file instead.
• Filesystem.read_text_file: Read the complete contents of a file from the file system as text. Handles various text encodings and provides detailed error messages if the file cannot be read. Use this tool when you need to examine the contents of a single file. Use the 'head' parameter to read only the first N lines of a file, or the 'tail' parameter to read only the last N lines of a file. Operates on the file as text regardless of extension. Only works within allowed directories.
• Filesystem.read_media_file: Read an image or audio file. Returns the base64 encoded data and MIME type. Only works within allowed directories.
• Filesystem.read_multiple_files: Read the contents of multiple files simultaneously. This is more efficient than reading files one by one when you need to analyze or compare multiple files. Each file's content is returned with its path as a reference. Failed reads for individual files won't stop the entire operation. Only works within allowed directories.
• Filesystem.write_file: Create a new file or completely overwrite an existing file with new content. Use with caution as it will overwrite existing files without warning. Handles text content with proper encoding. Only works within allowed directories.
• Filesystem.edit_file: Make line-based edits to a text file. Each edit replaces exact line sequences with new content. Returns a git-style diff showing the changes made. Only works within allowed directories.
• Filesystem.create_directory: Create a new directory or ensure a directory exists. Can create multiple nested directories in one operation. If the directory already exists, this operation will succeed silently. Perfect for setting up directory structures for projects or ensuring required paths exist. Only works within allowed directories.
• Filesystem.list_directory: Get a detailed listing of all files and directories in a specified path. Results clearly distinguish between files and directories with [FILE] and [DIR] prefixes. This tool is essential for understanding directory structure and finding specific files within a directory. Only works within allowed directories.
• Filesystem.list_directory_with_sizes: Get a detailed listing of all files and directories in a specified path, including sizes. Results clearly distinguish between files and directories with [FILE] and [DIR] prefixes. This tool is useful for understanding directory structure and finding specific files within a directory. Only works within allowed directories.
• Filesystem.directory_tree: Get a recursive tree view of files and directories as a JSON structure. Each entry includes 'name', 'type' (file/directory), and 'children' for directories. Files have no children array, while directories always have a children array (which may be empty). The output is formatted with 2-space indentation for readability. Only works within allowed directories.
• Filesystem.move_file: Move or rename files and directories. Can move files between directories and rename them in a single operation. If the destination exists, the operation will fail. Works across different directories and can be used for simple renaming within the same directory. Both source and destination must be within allowed directories.
• Filesystem.search_files: Recursively search for files and directories matching a pattern. The patterns should be glob-style patterns that match paths relative to the working directory. Use pattern like '.ext' to match files in current directory, and '**/.ext' to match files in all subdirectories. Returns full paths to all matching items. Great for finding files when you don't know their exact location. Only searches within allowed directories.
• Filesystem.get_file_info: Retrieve detailed metadata about a file or directory. Returns comprehensive information including size, creation time, last modified time, permissions, and type. This tool is perfect for understanding file characteristics without reading the actual content. Only works within allowed directories.
• Filesystem.list_allowed_directories: Returns the list of directories that this server is allowed to access. Subdirectories within these allowed directories are also accessible. Use this to understand which directories and their nested paths are available before trying to access files.
• Git.git_status: Show working-tree status (porcelain v2).
• Git.git_diff: Show a diff. staged=true for staged changes; optional path.
• Git.git_add: Stage the given paths.
• Git.git_commit: Commit staged changes with a message.
• Git.git_checkout: Switch to a branch; create=true makes a new branch.
• Git.git_restore: Discard changes in the given paths. staged=true unstages.
• Git.git_fetch: Fetch from a remote (default origin). Updates remote-tracking refs.
• Git.git_push: Push the current branch to a remote (default origin). Never force.
• Git.git_pull: Pull with --ff-only from a remote (default origin). Aborts on divergence.
• Git.git_merge: Merge a ref into the current branch with --ff-only.

```

## Prima: la lingua è l'inglese

Scrivi il prompt in inglese, anche se tu e i tuoi utenti parlate italiano. Non è esterofilia, è statistica. Il corpus con cui questi modelli sono stati addestrati è per oltre tre quarti testo inglese: scrivere in inglese significa utilizzare testo *riconosciuto*, restare vicino al centro della sua distribuzione statistica anziché ai margini. Ai margini abitano le allucinazioni. L'ho verificato tante volte da smettere di discuterne: lo stesso identico prompt tradotto in italiano perde aderenza. La UI può essere italiana, i log possono essere italiani. Il prompt deve essere in inglese.

## Seconda: il registro è imperativo e denso

Un System prompt non è una lettera di raccomandazione, è un ordine. Verbi all'imperativo, nessuna esitazione, nessuna cerimonia. Ogni frase deve fare una cosa sola e dirla senza attenuanti.

L'avevo già scoperto scrivendo skill, e vale identico qui: *i guardrail funzionano quando sono espliciti* ([Come Creare una Skill](/posts/17-come-creare-una-skill/)). "Never auto-execute" funziona. "Be prudent" no. Il modello rispetta con affidabilità le regole binarie; quelle sfumate le *interpreta*, e l'interpretazione non è mai quella che volevi. "Sii prudente" non è un'istruzione: è un augurio. E gli auguri non si benchmarkano.

Da qui la controparte: la concretezza comportamentale batte sempre l'aggettivo. In Aether ho scritto "Treat the developer as an adult who wants the real answer", e quella riga da sola elimina metà del comportamento condiscendente che inquina i terminali. Non ho scritto "be helpful and respectful". Ho dato alla calcolatrice un ordine, non sa cosa farsene di un aggettivo.

## Terza: la struttura è modulare

Sezioni con un nome — Voice, Transparency, Tools, Honesty, Safety. Non per estetica: perché un prompt a blocchi è un prompt che puoi *localizzare*, versionare e benchmarkare pezzo per pezzo. Quando il comportamento devia, devi sapere quale sezione ha ceduto. Un muro di prosa indistinta non te lo dirà mai. Aether è alla versione 38 del suo shem proprio perché è fatto di blocchi che posso toccare uno alla volta, come si stringe una vite alla volta senza smontare il motore.

## Quarta: il divario tra ciò che intendi e ciò che scrivi

Questa è la lezione più importante.

Nel prompt di Aether ho inserito una sezione *Transparency* che ordina alla creatura di *narrare il proprio ragionamento mentre lavora*. Sembra ovvio, virtuoso perfino. Se non che, lavorando con modelli in locale, i token del ragionamento narrato in prosa sono un costo reale: saturano la context window e appesantiscono l'inferenza. La parola "trasparenza" mi ha ingannato. Fonde due cose diverse sotto lo stesso nome: la trasparenza *d'azione* ovvero quale tool, su cosa, prima di eseguirlo, che costa pochissimo e va sempre tenuta accesa; e la narrazione *del pensiero* in prosa, che costa cara e dovrebbe scalare con la difficoltà del compito, non partire sempre.

Avevo scritto una parola intendendone due. Ecco il punto: *Il prompt che scrivi non è il prompt che il modello legge.*

Tra la tua intenzione e il comportamento del Golem c'è sempre uno scarto, e non lo trovi rileggendo il testo — nel testo suona benissimo. Lo trovi solo osservando cosa fa davvero. È questo divario che è problematico: in ogni prompt che scriviamo incluso il mio è la differenza tra ciò che intendi e i token con i quali viene rappresentato.

## Quinta: perciò il benchmark non è opzionale

Se una sola lettera separa *emet* da *met*, non puoi sapere *a priori* quale parola è viva e quale è morta. Devi misurare. Ogni riga dello shem di Aether è passata da una pipeline — nel mio caso un event bus — su Opus, su diverse versioni di Qwen, su Nemotron, perfino sui piccoli modelli Gemma. Non per snobismo tecnico: perché senza misura stai solo provando.

E attenzione a cosa misuri. Benchmarkare un prompt non è cronometrare millisecondi. È misurare **affidabilità comportamentale**: se do questo input dieci volte, la creatura segue il flusso tutte e dieci? Nove su dieci non è un prompt che funziona con un solo bug. È un prompt rotto che a volte ha fortuna.

Due verità scomode escono da questo banco di prova. 
La prima: *un prompt ottimizzato è ottimizzato per un solo LLM*. Cambia una parola e ne cambi l'efficienza; cambia il modello e devi ricominciare. Un prompt benchmarkato su molti modelli — come deve essere quello di Aether, che ti lascia switchare LLM a metà conversazione — non è un ottimizzatore: garantisce un minimo decente ovunque, non il massimo da nessuna parte. È un compromesso onesto, ma va chiamato col suo nome: formazione. 
La seconda: *rispettare l'ampiezza del context è fondamentale*, e chi switcha modello in corsa quasi non può non inciampare nel *context rot*. Il prompt di Aether misura 8267 caratteri + le tool calls + l'history della conversazione + il file ETERE.md + le skills + le istruzioni dei sub-agents + gli mcp attivi. Facile che se passi da Opus a un modello Gemma locale da 12b di parametri, il contesto è già una coperta troppo corta.

## Sesta: il mondo dell'agente è vivo

L'ultima frontiera, quella su cui il mio shem è ancora incompleto, è che la creatura non agisce in un mondo che controlla. L'utente interviene a esecuzione in corso, sovrascrive il context, cambia le variabili durante la sessione. L'agente sbatte contro un muro di permessi in un container e rischia di andare in loop cercando scorciatoie. Un'azione viene rifiutata all'approval gate e l'LLM deve *aspettare la decisione*, non aggirarla — e quando la decisione arriva, integrarla esatta nel passo successivo.

Un prompt maturo non insegna solo a riuscire. Insegna a **fallire con grazia** e a **chiudere il ciclo**. La mia versione 38 sa aspettare al gate, ma non sa ancora degradare con eleganza contro un permesso negato, né riprendere pulita dopo un override manuale. Lo scrivo qui perché è esattamente il tipo di errore da condividere.

## Conclusione

C'è un dettaglio nella storia del Golem, il rabbino guarda la sua creatura con tenerezza *e con un po' di orrore*. Sa che qualunque cosa il Golem faccia, l'ha resa possibile lui, con la parola che gli ha messo in bocca.

I limiti del linguaggio della calcolatrice sono i limiti del suo mondo, diceva in fondo Wittgenstein: e quel mondo glielo scrivi tu. Significa che un LLM non può concepire né descrivere nulla che vada oltre il suo vocabolario e le strutture logiche che abbiamo usato per esprimerlo. 
I confini di ciò che possiamo dire definiscono i confini di ciò che possiamo pensare ed esplorare.
Vale per la percezione: se non abbiamo le parole per nominare un'emozione o un fenomeno, difficilmente riusciamo a percepirlo o a comprenderlo appieno. E vale per ciò che al linguaggio sfugge del tutto — l'etica, l'estetica, la metafisica: quanto esula dal linguaggio sensato non si può descrivere, e di fronte ad esso «si deve tacere».

Tracci i confini di un mondo, una parola alla volta, e dentro quei confini l'agente farà tutto ciò che gli hai reso possibile e solo quello. Non è una minaccia, ed è per questo che non finisco sull'orrore ma sulla parte che ci riguarda. La responsabilità di ciò che la creatura fa dentro quei bordi non è del fango. È della mano che l'ha scritta.

Non c'è modo di impararlo leggendo. Si impara incidendo una parola, misurando cosa succede, cancellandola, riprovando. 
Apri Aether, modifica il System Prompt nella sidebar, cambiane il nome, il comportamento, lo stile in output, il simulacro di pensiero che l'LLM produce. 
Nel pannello di Reasoning a destra se abiliti l'Aether Mode (l'icona con l'occhio in alto), vedrai come il System Prompt viene montato 😉 La [documentazione ufficiale di Aether](https://github.com/MichelePolo/Aether/blob/main/docs/it/README.md) entra nel dettaglio di come è fatto dentro.

Solo condividere l'errore lo rende utile.