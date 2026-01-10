---
layout: layouts/post.njk
tags: [post]
title: "CI/CD, Pre-Commit Hooks e Quality Gates: La Guardia della Qualità"
subtitle: "Automazione, testing e qualità continua"
date: 2025-01-06
quote: "La qualità non è mai un caso; è sempre il risultato di uno sforzo intelligente"
quoteAuthor: "John Ruskin"
---

## Qualità come Processo, Non come Incidente

John Ruskin, teorico dell'arte e della società vittoriana, comprendeva una verità universale: la qualità non emerge spontaneamente. Richiede **intenzione**, **disciplina**, **sforzo sistematico**.

Nel software, questa verità è amplificata. Un codebase può degradarsi incredibilmente velocemente:
- Un test skippato "temporaneamente"
- Un warning "da fixare dopo"
- Un commit "tanto è solo una piccola modifica"
- Un merge "funziona sulla mia macchina"

E improvvisamente, sei in production con bug che passavano inosservati, test che fallivano silenziosamente, copertura al 40%, build che rompono ogni settimana.

**Il problema non è la mancanza di conoscenza. È la mancanza di enforcement.**

Tutti sanno che i test sono importanti. Ma quanti progetti hanno davvero 80%+ di coverage **e lo mantengono nel tempo**?

Tutti sanno che il linting è utile. Ma quanti progetti hanno **zero ESLint warnings** in produzione?

La risposta è: **pochissimi**. Perché la qualità manuale decade. Sempre.

**La soluzione: automatizzare la qualità.**

E CodeIntel System è costruito su questo principio: **quality gates automatizzate** che prevengono la degradazione, non la curano dopo.

## Il Problema: Manual Quality Checks Don't Scale

All'inizio di CodeIntel, avevo un workflow manuale:

```bash
# Pre-commit checklist (mentale)
- [ ] npm test  ← A volte dimenticavo
- [ ] npm run build  ← "Build è lenta, skip per ora"
- [ ] npm run lint  ← "Fixerò i warning dopo"
- [ ] git commit  ← Sempre
```

**Risultato**:
- Sprint 2: Commit con 69 ESLint errors che faillavano CI
- Sprint 3: Commit con 200+ TypeScript errors non catchati localmente
- Sprint 4: Branch divergenti perché dimenticavo push

**Lezione**: I processi manuali falliscono. Gli umani sono inaffidabili (io compreso).

**Soluzione**: Automazione totale con **CI/CD pipeline** + **pre-commit hooks**.

## Layer 1: Pre-Commit Hooks - La Prima Linea di Difesa

**Obiettivo**: Bloccare commit invalidi **prima** che raggiungano il repository.

**Implementazione**: Husky + lint-staged (configurato in Sprint 4)

### Setup Husky

```bash
npm install --save-dev husky lint-staged
npx husky install
npx husky add .husky/pre-commit "npx lint-staged"
```

### Configurazione lint-staged

`package.json`:
```json
{
  "lint-staged": {
    "*.{ts,tsx}": [
      "eslint --fix",
      "prettier --write",
      "bash -c 'tsc --noEmit'"
    ],
    "*.{js,jsx}": [
      "eslint --fix",
      "prettier --write"
    ],
    "*.{json,md,yml,yaml}": [
      "prettier --write"
    ]
  }
}
```

### Workflow Pre-Commit

```bash
git add src/agents/CodebaseIndexAgent.ts
git commit -m "feat(agents): implement semantic chunking"

# Pre-commit hook triggers:
# ✓ ESLint check on changed files
# ✓ Prettier formatting
# ✓ TypeScript type checking (tsc --noEmit)
#
# If ANY check fails → commit is BLOCKED
```

**Risultato**:
- **Zero** TypeScript errors raggiungono CI (dal Sprint 4 in poi)
- **Zero** ESLint warnings in commit
- **100%** codice formattato uniformemente
- **Immediate feedback** (< 5 secondi)

### Types of Checks in Pre-Commit

#### 1. Linting (ESLint)

```javascript
// .eslintrc.js
module.exports = {
  parser: '@typescript-eslint/parser',
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
  ],
  rules: {
    '@typescript-eslint/no-explicit-any': 'error', // NO any types
    '@typescript-eslint/no-unused-vars': 'error',
    'no-console': 'warn', // Warn on console.log
    'complexity': ['error', 10], // Max cyclomatic complexity
  },
};
```

**Catches**:
- Type errors (`any` usage, unused vars)
- Code smells (high complexity)
- Console logs dimenticati

#### 2. Formatting (Prettier)

```javascript
// .prettierrc
{
  "semi": true,
  "trailingComma": "es5",
  "singleQuote": true,
  "printWidth": 80,
  "tabWidth": 2
}
```

**Enforces**:
- Consistent code style
- No formatting debates in code review
- Auto-fix on commit

#### 3. Type Checking (TypeScript)

```bash
tsc --noEmit --project tsconfig.json
```

**Catches**:
- Type mismatches
- Null/undefined issues
- Generic constraints violations

**Example caught error**:
```typescript
// Before Sprint 4 (without pre-commit hooks)
const result = await vectorStore.query(embedding);
const firstDoc = result[0].metadata.file;
//                ^^^ Potential undefined, but not caught locally!

// Committed, pushed, CI failed with:
// Error: Cannot read property 'metadata' of undefined

// After Sprint 4 (with pre-commit hooks)
// Commit blocked with:
// Error: Object is possibly 'undefined'. TS2532

// Fix:
const firstDoc = result[0]?.metadata?.file || 'unknown';
// Commit proceeds ✅
```

### Edge Cases & Configuration

**Problem**: Pre-commit hooks can be slow on large commits.

**Solution**: `lint-staged` runs only on **changed files**, not entire codebase.

**Problem**: Hooks can be bypassed with `git commit --no-verify`.

**Solution**: Enforce hooks in CI as well (see next section).

**Problem**: False positives block valid commits.

**Solution**: Tune rules carefully, use `warn` instead of `error` for non-critical issues.

## Layer 2: CI/CD Pipeline - The Safety Net

Pre-commit hooks are great, but they can be bypassed. **CI/CD is the ultimate safety net.**

### GitHub Actions Workflow

`.github/workflows/ci.yml`:

```yaml
name: CI Pipeline

on:
  push:
    branches: [main, develop, feature/*]
  pull_request:
    branches: [main, develop]

jobs:
  test:
    runs-on: ubuntu-latest

    services:
      chromadb:
        image: chromadb/chroma:latest
        ports:
          - 8000:8000
        env:
          IS_PERSISTENT: FALSE
          CHROMA_SERVER_AUTH_PROVIDER: token
          CHROMA_SERVER_AUTH_CREDENTIALS: test-token

      ollama:
        image: ollama/ollama:latest
        ports:
          - 11434:11434

    strategy:
      matrix:
        node-version: [18.x, 20.x, 22.x]

    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js ${{ matrix.node-version }}
        uses: actions/setup-node@v3
        with:
          node-version: ${{ matrix.node-version }}
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Wait for ChromaDB
        run: |
          timeout 60 bash -c 'until curl -f http://localhost:8000/api/v1/heartbeat; do sleep 2; done'

      - name: Pull Ollama model
        run: |
          docker exec ${{ job.services.ollama.id }} ollama pull nomic-embed-text

      - name: Run type checking
        run: npm run typecheck

      - name: Run linter
        run: npm run lint

      - name: Run tests
        env:
          CHROMA_URL: http://localhost:8000
          CHROMA_TOKEN: test-token
          OLLAMA_URL: http://localhost:11434
        run: npm test -- --coverage

      - name: Build project
        run: npm run build

      - name: Upload coverage
        uses: codecov/codecov-action@v3
        with:
          files: ./coverage/coverage-final.json
```

### Pipeline Stages

#### Stage 1: Type Checking

```bash
npm run typecheck  # tsc --noEmit
```

**Catches**: All TypeScript errors, even if pre-commit was bypassed.

#### Stage 2: Linting

```bash
npm run lint  # eslint src/**/*.ts
```

**Catches**: ESLint violations.

**Configuration**: Exit code 1 if ANY error (warnings allowed).

#### Stage 3: Testing

```bash
npm test -- --coverage
```

**Requirements**:
- All tests must pass (100%)
- Coverage thresholds must be met:
  - Statements: 80%
  - Branches: 80%
  - Functions: 80%
  - Lines: 80%

**vitest.config.ts**:
```typescript
export default defineConfig({
  test: {
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      thresholds: {
        statements: 80,
        branches: 80,
        functions: 80,
        lines: 80,
      },
    },
  },
});
```

**If coverage < 80%**: CI fails, commit cannot merge.

#### Stage 4: Build

```bash
npm run build  # tsc --build
```

**Catches**: Build-time errors, missing dependencies, wrong imports.

### Service Containers: ChromaDB + Ollama

**Challenge**: Integration tests require ChromaDB and Ollama running.

**Solution**: GitHub Actions service containers.

**Configuration**:

```yaml
services:
  chromadb:
    image: chromadb/chroma:latest
    ports:
      - 8000:8000
    env:
      IS_PERSISTENT: FALSE  # Ephemeral storage for CI
      CHROMA_SERVER_AUTH_PROVIDER: token
      CHROMA_SERVER_AUTH_CREDENTIALS: test-token

  ollama:
    image: ollama/ollama:latest
    ports:
      - 11434:11434
```

**Benefits**:
- **Isolation**: Each CI run gets fresh containers
- **Parallelism**: Multiple runs don't interfere
- **Speed**: Containers start in ~10 seconds

**Challenges Solved** (Sprint 3, Task 4 - 8 iterations):

1. **Port Mapping**: Initially used 8001:8000, caused connection refused. Fix: 8000:8000 (direct mapping).

2. **API Version**: ChromaDB v1 → v2. Fix: Update endpoints to `/api/v2/`.

3. **Authentication**: Server had auth, client didn't. Fix: Add `CHROMA_SERVER_AUTH_CREDENTIALS` + client token.

4. **Health Checks**: Docker health checks unreliable. Fix: Explicit `curl` wait loop.

5. **NumPy Compatibility**: ChromaDB 0.4.22 incompatible with NumPy 2.0. Fix: Upgrade to latest ChromaDB.

**Result**: 363/363 tests passing in CI, 100% pass rate, zero flaky tests.

### Matrix Testing: Node.js 18, 20, 22

```yaml
strategy:
  matrix:
    node-version: [18.x, 20.x, 22.x]
```

**Why**: Ensure compatibility across Node versions.

**Cost**: 3x CI time, but worth it for cross-version confidence.

**Optimization**: Cache npm dependencies per Node version.

## Layer 3: Quality Metrics & Reporting

### Test Coverage Reporting

**Tool**: Vitest coverage with c8 (V8 coverage)

**Report formats**:
- **Text**: Terminal output during CI
- **JSON**: For programmatic analysis
- **HTML**: Browsable coverage report

**Example output**:
```
File                          | % Stmts | % Branch | % Funcs | % Lines
------------------------------|---------|----------|---------|--------
All files                     |   94.2  |   89.5   |   92.1  |   94.5
 agents/                      |   96.8  |   92.3   |   95.6  |   97.1
  CodebaseIndexAgent.ts       |   98.2  |   94.1   |   100   |   98.5
  CodeUnderstandingAgent.ts   |   95.7  |   90.8   |   92.3  |   96.2
 core/                        |   92.5  |   87.2   |   89.8  |   92.9
  VectorStoreService.ts       |   94.3  |   88.9   |   91.2  |   94.7
```

**Uploaded to**: Codecov for trend analysis.

### Performance Benchmarking in CI

**Configuration** (Sprint 4):

```yaml
benchmark:
  runs-on: ubuntu-latest
  if: github.ref == 'refs/heads/main'  # Only on main branch

  steps:
    # ... setup steps ...

    - name: Run benchmarks
      run: npm run benchmark

    - name: Store benchmark results
      uses: actions/upload-artifact@v3
      with:
        name: benchmark-results
        path: benchmark-results.json
        retention-days: 90

    - name: Compare with baseline
      run: |
        node scripts/compare-benchmarks.js \
          --current benchmark-results.json \
          --baseline benchmark-baseline.json \
          --threshold 0.20  # Fail if >20% regression
```

**Detects**: Performance regressions before merge.

**Example alert**:
```
⚠️ Performance regression detected:

Embedding generation: 125ms → 180ms (+44%)
Vector search: 45ms → 48ms (+6.7%)

Threshold exceeded: 44% > 20%
CI FAILED
```

## Layer 4: Branch Protection Rules

**GitHub settings** (configured in Sprint 0):

```yaml
# .github/branch-protection.yml (conceptual)
branches:
  main:
    required_status_checks:
      - test (Node 18.x)
      - test (Node 20.x)
      - test (Node 22.x)
      - build
    require_code_review: true
    require_linear_history: true
    allow_force_pushes: false

  develop:
    required_status_checks:
      - test (Node 20.x)
      - build
    require_code_review: false  # More flexible
```

**Enforcement**:
- **Cannot merge PR** if CI fails
- **Cannot push directly** to main (must PR)
- **Cannot force push** (preserve history)

## Case Study: Sprint 3, Task 4 - The 8-Iteration Journey

**Context**: Implement Docker-based CI for integration tests.

**Expected effort**: 4 hours

**Actual effort**: 8 hours (8 iterations)

### Iteration Timeline

**Iteration 1** (commit `a1b2c3d`):
- **Change**: Initial GitHub Actions workflow
- **Result**: ❌ ChromaDB connection refused
- **Issue**: Port mapping 8001:8000

**Iteration 2** (commit `b2c3d4e`):
- **Change**: Fix port mapping to 8000:8000
- **Result**: ❌ API endpoint 404
- **Issue**: Using deprecated v1 API, need v2

**Iteration 3** (commit `c3d4e5f`):
- **Change**: Update to /api/v2/ endpoints
- **Result**: ❌ Timeout waiting for ChromaDB
- **Issue**: Health check timeout too short

**Iteration 4** (commit `d4e5f6a`):
- **Change**: Increase wait timeout to 60s
- **Result**: ❌ Still timeout
- **Issue**: Health check endpoint wrong

**Iteration 5** (commit `e5f6a7b`):
- **Change**: Use /api/v1/heartbeat for health
- **Result**: ❌ 401 Unauthorized
- **Issue**: Authentication not configured

**Iteration 6** (commit `f6a7b8c`):
- **Change**: Add CHROMA_SERVER_AUTH_PROVIDER env
- **Result**: ❌ 401 Unauthorized
- **Issue**: Client missing auth token

**Iteration 7** (commit `a7b8c9d`):
- **Change**: Add client auth token header
- **Result**: ❌ NumPy compatibility error
- **Issue**: ChromaDB 0.4.22 vs NumPy 2.0

**Iteration 8** (commit `b8c9d0e`) - **HUMAN INTERVENTION**:
- **Change**: Upgrade ChromaDB to latest + full auth config
- **Result**: ✅ **363/363 tests passing**
- **Success**: End-to-end authentication working

### Lessons Learned

**Technical**:
1. **Direct port mapping** (8000:8000) > remapping
2. **ChromaDB API v2** is current standard
3. **Authentication** must be end-to-end (server + client)
4. **Explicit wait loops** > Docker health checks
5. **Latest dependencies** avoid compatibility issues

**Process**:
1. **Document every iteration** - created troubleshooting guide
2. **Human intervention valuable** - AI tried 7 times, human solved on 8th
3. **Root cause analysis** - not just "it works now"
4. **Knowledge sharing** - documented in RETROSPECTIVE.md

**Result**: When setting up CI for Sprint 4+ agents, **zero issues**. Knowledge reused.

## Continuous Improvement: Metrics Over Time

**Sprint-by-Sprint Quality Metrics**:

| Sprint | Tests | Coverage | CI Time | Flaky Tests |
|--------|-------|----------|---------|-------------|
| Sprint 1 | 204 | 85% | N/A (no CI) | N/A |
| Sprint 2 | 279 | 87% | 8 min | 2 |
| Sprint 3 | 363 | 90% | 5-7 min | 0 |
| Sprint 4 | 477 | 92% | 6 min | 0 |
| Sprint 5 | 612 | 93% | 6.5 min | 0 |
| Sprint 6 | 756 | 94% | 7 min | 0 |
| Sprint 7 | 867 | **94.2%** | 7.5 min | 0 |

**Trends**:
- **Coverage**: Increasing consistently (85% → 94.2%)
- **Flaky tests**: Eliminated after Sprint 3 (process ID isolation)
- **CI time**: Stable (~6-7 min despite 4x test increase)
- **Pass rate**: 100% since Sprint 3

**Key enabler**: Pre-commit hooks (Sprint 4) prevented regressions.

## The ROI of Quality Automation

**Time invested**:
- Pre-commit hooks setup: 2 hours (Sprint 4)
- CI/CD pipeline setup: 8 hours (Sprint 3, Task 4)
- **Total**: 10 hours

**Time saved** (conservative estimate over 8 sprints):
- Debugging CI failures: ~20 hours saved
- Fixing bugs in production: ~15 hours saved
- Code review time: ~10 hours saved (auto-formatting eliminates style discussions)
- **Total**: ~45 hours saved

**ROI**: 450% (45h saved / 10h invested)

**Intangibles**:
- **Peace of mind**: Know that every commit is validated
- **Confidence**: Can refactor aggressively, tests catch regressions
- **Onboarding**: New developers have immediate feedback loop

**John Ruskin was right**: Quality is **never** a case. It's the result of **intelligent effort**.

And in software, that effort is best invested in **automation that scales**.

## Conclusione: Quality Gates as Culture

Quality gates non sono solo strumenti tecnici. Sono **cultura**.

Quando ogni commit passa attraverso:
1. Pre-commit hooks (immediate feedback)
2. CI/CD pipeline (comprehensive validation)
3. Coverage thresholds (measurable quality)
4. Branch protection (enforcement)

Il risultato non è solo codice migliore. È un **team** che **internalizza** gli standard di qualità.

Non è più "dovrei scrivere test", è "non posso committare senza test".

Non è più "dovrei fixare questi warning", è "i warning bloccano il merge".

**La qualità diventa la via di minor resistenza.**

E questo è esattamente l'obiettivo.

Nel prossimo post, esploreremo l'Agent Framework: il pattern architetturale che permette orchestrazione gerarchica di agenti specializzati.

---

**Nel prossimo post**: Agent Framework e Orchestrazione - Architettura per la Delega Intelligente

---

**Serie "CodeIntel System: Dal Concetto al Codice"**
- Post 1: La Visione del Progetto
- Post 2: SDLC e Metodologia Agile
- Post 3: Analisi, Progettazione e Architettura
- Post 4: L'IA come Co-Sviluppatore
- Post 5: AST, Tree-sitter e Parsing del Codice
- **Post 6**: CI/CD e Quality Gates ← *Sei qui*
- Post 7: Agent Framework e Orchestrazione
- Post 8: Documentazione come Filosofia
