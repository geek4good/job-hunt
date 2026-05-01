# AGENTS.md — AI Agent Reference

## What This Project Is

A personal job-hunt agent that scrapes remote job boards, deduplicates results across runs, pre-filters obvious non-matches in code, then scores each candidate listing against the owner's CV using GLM (z.ai). The owner (Lucas Mbiwe) is a senior backend/full-stack engineer who prefers freelance/contract work and can work from Thailand or Spain.

---

## Repository Layout

```
src/
  main.ts          — pipeline orchestrator (scrape → dedup → prefilter → score → print)
  config.ts        — all env-driven config; single source of truth
  types.ts         — DO NOT MODIFY — Job, Scraper, ScoreResult, ScoredJob interfaces
  prefilter.ts     — regex hard-filter (runs before GLM to save API calls)
  scorer.ts        — GLM (z.ai) scoring via OpenAI-compatible API
  dedup.ts         — SQLite-backed deduplication using bun:sqlite
  profile.ts       — loads CV as plaintext via system `pdftotext`
  scrapers/
    helpers.ts     — ALL scrapers import from here (UA, hashUrl, stripHtml, truncate, safeDate, looksLikeJobListings, extractJsonLd, extractNextData)
    browser.ts     — Lightpanda wrapper (puppeteer-core, hasBrowser, fetchWithBrowser)
    wwr.ts         — ACTIVE: We Work Remotely (RSS)
    remoteok.ts    — ACTIVE: RemoteOK (JSON API)
    remotive.ts    — ACTIVE: Remotive (JSON API)
    jobicy.ts      — ACTIVE: Jobicy (JSON API)
    workingnomads.ts — ACTIVE: Working Nomads (JSON API)
    hn-whoishiring.ts — ACTIVE: HN Who's Hiring (Algolia API)
    euremotejobs.ts — ACTIVE: EU Remote Jobs (WP RSS)
    jobspresso.ts  — ACTIVE: Jobspresso (WP RSS, paginated)
    [38 more]      — stubs only; see main.ts comments for why each is disabled
doc/
  job-sources.md        — full catalog of 42 sources with integration difficulty
  scraper-failures.md   — documented failure reasons for all non-working sources
mise.toml              — env vars + mise tasks (hunt, reset)
```

---

## Core Interfaces (`src/types.ts`)

```typescript
interface Job {
  id: string;           // sha256(url).slice(0,16) — deterministic, stable PK
  title: string;
  url: string;
  company: string;
  description: string;  // plain text, max 4000 chars (stripHtml + truncate)
  publishedAt: string;  // ISO 8601
  source: string;       // scraper identifier (e.g. "remoteok", "jobspresso")
  region: string;       // location string from source, or "" if unknown
  category: string;     // job category string, or ""
}

interface Scraper {
  name: string;
  scrape(): Promise<Job[]>;
}

interface ScoreResult {
  is_remote: boolean;
  is_frontend_only: boolean;
  location_fit: "thailand" | "spain" | "other" | "anywhere" | "unknown";
  salary_mentions: string | null;
  salary_meets_threshold: boolean | null;
  role_type: "backend" | "frontend" | "fullstack" | "devops" | "management" | "other";
  engagement_type: "fulltime" | "freelance" | "contract" | "parttime" | "unknown";
  stack_match: string[];
  seniority: "junior" | "mid" | "senior" | "lead" | "unknown";
  score: number;        // 0-10, clamped in scorer.ts
  reason: string;
  recommend: boolean;
}
```

---

## Pipeline (main.ts)

```
scrape all → merge → filter new vs SQLite → prefilter (regex) → score with GLM → record all → print accepted
```

The pipeline catches all scraper errors individually — one failing scraper never aborts the run. Jobs failing scoring return `null` and are skipped (not recorded). All jobs (accepted and rejected) are recorded to SQLite after scoring so they won't be re-evaluated on the next run.

---

## Configuration (`src/config.ts`)

All values come from env vars. Defaults shown below.

| Env var | Default | Notes |
|---|---|---|
| `GLM_MODEL` | `glm-4.5-air` | z.ai model name |
| `GLM_BASE_URL` | `https://api.z.ai/api/paas/v4` | OpenAI-compatible base |
| `GLM_API_KEY` | `""` | Required for scoring; set in shell or .env |
| `SCORE_THRESHOLD` | `6` | 0-10; jobs below this are rejected |
| `DB_PATH` | `data/jobs.db` | SQLite dedup database |
| `CV_PATH` | `doc/cv.pdf` | Candidate CV for profile text |
| `MIN_SALARY_USD` | `65000` | Full-time annual floor |
| `MIN_DAY_RATE_USD` | `300` | Freelance floor (~$37.50/hr) |

`mise.toml` sets all non-secret vars. `GLM_API_KEY` must come from shell environment or `.env` (gitignored).

---

## Scraper Pattern

Every scraper must follow this shape:

```typescript
import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

export const mysource: Scraper = {
  name: "My Source",
  async scrape(): Promise<Job[]> {
    // fetch, parse, map to Job[]
    return jobs;
  },
};
```

Then add to the `scrapers[]` array in `main.ts`. Do not add stubs to the array — they must throw immediately and stay commented out.

**ID generation:** always `hashUrl(url)` from helpers. Never generate IDs any other way.

**Description:** always `truncate(stripHtml(rawHtml))` — the 4000-char limit prevents context overflow in the scorer prompt.

**Lightpanda fallback pattern** (for SPA sites):
```typescript
import { hasBrowser, fetchWithBrowser } from "./browser";
import { looksLikeJobListings } from "./helpers";

let html = await fetch(URL, { headers: UA }).then(r => r.text());
if (!looksLikeJobListings(html) && hasBrowser) {
  html = await fetchWithBrowser(URL) ?? html;
}
```

Lightpanda activates when `LPD_TOKEN` (cloud) or `LPD_CDP_URL` (Docker) is set. Without either, `hasBrowser` is false and the fallback is skipped silently.

---

## Prefilter (`src/prefilter.ts`)

Runs before GLM. Rejects jobs matching:
- **Non-engineering categories** (Design, Marketing, Sales, HR, Finance, Legal, etc.)
- **Non-engineering title patterns** (electrical, mechanical, sales, recruiter, content writer, product designer, data entry, etc.)
- **Pure frontend title patterns** (`front.?end dev`, `react dev`, `vue dev`, `angular dev`, etc.)

Returns `{ pass: true }` or `{ pass: false, reason: string }`. Rejected jobs are recorded to SQLite at score=0 so they're not re-evaluated.

---

## Scorer (`src/scorer.ts`)

**Scoring criteria (0–10 total):**
1. Remote (hard filter) — non-remote → score 0, recommend=false
2. Location fit (0–2) — Thailand preferred, Spain OK, Worldwide = 2, US-only = 0
3. Compensation (0–2) — full-time ≥ $65k/yr, freelance ≥ $300/day; unstated = 1 (give benefit of doubt)
4. Role type (0–3) — backend/lead/management = 3; fullstack/devops/architect = 2.5; pure frontend = 0 + recommend=false
5. Engagement type bonus (0–1) — freelance/contract = 1 (preferred); full-time = 0.5
6. Stack match (0–2) — 0.5 per match: TypeScript, Ruby on Rails, Node.js, Bun, AWS, Cloudflare, DevOps, system design, APIs, distributed systems, leadership
7. Seniority (0–1) — senior/lead = 1; mid = 0.5; junior = 0

`recommend=true` requires: score ≥ threshold AND is_remote=true AND is_frontend_only=false AND salary not clearly below threshold.

GLM call uses OpenAI-compatible `/chat/completions` with `Authorization: Bearer` header, `response_format: { type: "json_object" }`, temperature 0.1, and a 120s timeout per job.

---

## Deduplication (`src/dedup.ts`)

SQLite table `seen_jobs` keyed on `job.id`. On each run:
1. `getSeenIds(db)` → `Set<string>` of all previously seen IDs
2. `filterNew(jobs, seenIds)` → only unseen jobs pass through
3. After scoring, `recordJob(db, job, score, recommended)` for every job (including rejected ones)

WAL mode is enabled. The `data/` directory is gitignored entirely.

---

## Profile Loading (`src/profile.ts`)

Reads `config.cvPath` (default: `doc/cv.pdf`) via system `pdftotext` binary (from the `poppler` package). Result is cached in memory for the process lifetime. If `pdftotext` is missing, throws with a message suggesting `brew install poppler`. The CV text is embedded verbatim in the GLM scoring prompt.

---

## Key Decisions (do not revert)

- **GLM over Ollama** — replaced in full; no Ollama code or env vars remain anywhere
- **Freelance-first scoring** — engagement_type freelance/contract scores 1, full-time scores 0.5
- **Thailand + Spain as primary locations** — hardcoded in prompt and ScoreResult type
- **Pre-filter before LLM** — always run prefilter.ts first; adding new filter rules there is cheaper than tuning the prompt
- **Deterministic job IDs** — `sha256(url).slice(0,16)` only; never use titles or compound keys
- **Stubs throw immediately** — any scraper not in `scrapers[]` must throw on `scrape()`, never return `[]`
- **descriptions capped at 4000 chars** — `truncate()` is mandatory; do not remove or raise the limit without considering prompt size
- **No auth scrapers in the active array** — scrapers requiring API keys stay commented out until credentials are provided

---

## Adding a New Scraper (checklist)

1. Create `src/scrapers/<source>.ts` exporting a `Scraper`
2. Import `UA`, `hashUrl`, `stripHtml`, `truncate`, `safeDate` from `./helpers`
3. Test: `bun --eval "import { x } from './src/scrapers/x'; console.log(await x.scrape())"`
4. If working: add import + entry to `scrapers[]` in `src/main.ts`
5. If failing: add stub that throws, add entry to `doc/scraper-failures.md`

---

## Running

```bash
mise run hunt      # scrape + score
mise run reset     # clear SQLite dedup DB
```

Or directly: `bun run src/main.ts`

**Required:** `GLM_API_KEY` in environment. **Required system dep:** `pdftotext` (`brew install poppler`).
