# job-hunt

A personal job-hunt agent that scrapes remote job boards daily, deduplicates results across runs, and scores each listing against your CV using GLM (z.ai). Designed for a senior backend/full-stack engineer who prefers freelance/contract work and can be based in Thailand or Spain.

## What It Does

1. **Scrapes** 8 remote job sources (RSS feeds, JSON APIs, HN Who's Hiring)
2. **Deduplicates** against a local SQLite database — jobs already seen are never re-evaluated
3. **Pre-filters** obvious non-matches in code (non-engineering roles, pure frontend, etc.) before spending any API quota
4. **Scores** remaining candidates 0–10 against the candidate profile using GLM 4 Air
5. **Prints** accepted jobs (score ≥ 6) with structured reasoning

A full run fetches ~700 listings and typically scores ~500 candidates after pre-filtering.

## Prerequisites

- [Bun](https://bun.sh) (managed by mise: `mise install`)
- `pdftotext` — `brew install poppler` (macOS) or `apt install poppler-utils` (Linux)
- A [z.ai / Zhipu Cloud](https://open.bigmodel.cn) API key (`GLM_API_KEY`)
- Your CV as a PDF at `doc/cv.pdf`

## Setup

```bash
# Install dependencies
bun install

# Put your CV in place
cp /path/to/your/cv.pdf doc/cv.pdf

# Set your GLM API key (add to ~/.zshrc or similar)
export GLM_API_KEY=your_key_here
```

## Running

```bash
# Run the full pipeline
mise run hunt

# Reset the dedup database (re-evaluate all jobs from scratch)
mise run reset
```

Or directly with Bun:

```bash
bun run src/main.ts
```

## Configuration

All config is driven by environment variables. Defaults are set in `mise.toml`.

| Variable | Default | Description |
|---|---|---|
| `GLM_API_KEY` | _(required)_ | z.ai API key |
| `GLM_MODEL` | `glm-4-air` | Model name |
| `GLM_BASE_URL` | `https://api.z.ai/api/paas/v4` | API base URL |
| `SCORE_THRESHOLD` | `6` | Minimum score (0–10) to accept a job |
| `MIN_SALARY_USD` | `65000` | Full-time annual salary floor |
| `MIN_DAY_RATE_USD` | `300` | Freelance/contract day rate floor (~$37.50/hr) |
| `CV_PATH` | `doc/cv.pdf` | Path to your CV |
| `DB_PATH` | `data/jobs.db` | SQLite deduplication database |

## Architecture

```
┌─────────────────────────────────────────┐
│               Scrapers (8)              │
│  WWR · RemoteOK · Remotive · Jobicy    │
│  WorkingNomads · HN · EURemote · Jobspresso │
└───────────────────┬─────────────────────┘
                    │ ~700 jobs/run
                    ▼
         ┌──────────────────┐
         │  Deduplication   │  SQLite (data/jobs.db)
         │  (seen_jobs)     │  keyed on sha256(url)
         └────────┬─────────┘
                  │ new jobs only
                  ▼
         ┌──────────────────┐
         │   Pre-filter     │  regex — no API cost
         │  (prefilter.ts)  │  rejects non-eng, frontend-only
         └────────┬─────────┘
                  │ candidates
                  ▼
         ┌──────────────────┐
         │  GLM Scorer      │  glm-4-air via z.ai
         │  (scorer.ts)     │  CV + job → structured JSON
         └────────┬─────────┘
                  │ accepted (score ≥ 6)
                  ▼
         ┌──────────────────┐
         │  Print & Record  │  all jobs written to SQLite
         └──────────────────┘
```

### Scoring Criteria (0–10)

| Criterion | Points | Notes |
|---|---|---|
| Remote (hard filter) | pass/fail | Non-remote → score 0 |
| Location fit | 0–2 | Worldwide = 2; Thailand/Spain = 1–2; US-only = 0 |
| Compensation | 0–2 | ≥ $65k/yr or ≥ $300/day; unstated = 1 |
| Role type | 0–3 | Backend/lead = 3; fullstack/devops = 2.5; pure frontend = 0 |
| Engagement type | 0–1 | Freelance/contract = 1 (preferred); full-time = 0.5 |
| Stack match | 0–2 | 0.5 per match: TypeScript, Rails, Node, Bun, AWS, Cloudflare… |
| Seniority | 0–1 | Senior/lead = 1; mid = 0.5; junior = 0 |

### Pre-filter (no API cost)

Jobs are rejected in code — before calling GLM — if they match any of:
- Non-engineering **categories**: Design, Marketing, Sales, HR, Finance, Legal, etc.
- Non-engineering **title patterns**: electrical, recruiter, content writer, product designer, etc.
- Pure **frontend patterns**: "react dev", "vue dev", "front-end developer", etc.

This typically reduces the scoring pool by ~20%.

## Active Sources

| Source | Type | Listings/run |
|---|---|---|
| [We Work Remotely](https://weworkremotely.com) | RSS | ~25 |
| [RemoteOK](https://remoteok.com) | JSON API | ~97 |
| [Remotive](https://remotive.com) | JSON API | ~20 |
| [Jobicy](https://jobicy.com) | JSON API | ~100 |
| [Working Nomads](https://workingnomads.co) | JSON API | ~30 |
| [HN Who's Hiring](https://news.ycombinator.com) | Algolia API | ~340 |
| [EU Remote Jobs](https://euremotejobs.com) | RSS | ~15 |
| [Jobspresso](https://jobspresso.co) | RSS (paginated) | ~60 |

### Disabled Sources

**Needs Lightpanda** (JS-rendered SPAs — set `LPD_TOKEN` or `LPD_CDP_URL` to enable): Dynamite Jobs, JustRemote, RemoteSource, Remote100K, Peerlist, Dice, FlexJobs, PeoplePerHour, Contra, Truelancer

**Needs API credentials** (uncomment in `main.ts` once available): CareerJet (`CAREERJET_API_KEY`), Welcome to the Jungle (`WTTJ_API_TOKEN`), Upwork (OAuth), Glassdoor, Monster, Indeed

**Not scrappable**: LinkedIn (HTTP 999), SimplyHired (CAPTCHA), CareerBuilder (anti-bot)

See `doc/scraper-failures.md` for full details.

## Enabling Lightpanda (JS-rendered sites)

[Lightpanda](https://lightpanda.io) is a lightweight headless browser that speaks CDP over WebSocket. It's the fallback for SPA-based job boards.

**Cloud (10h/month free):**
```bash
export LPD_TOKEN=your_token_from_console.lightpanda.io
```

**Self-hosted (Docker):**
```bash
docker run -d -p 127.0.0.1:9222:9222 lightpanda/browser:nightly
export LPD_CDP_URL=ws://127.0.0.1:9222
```

Then uncomment the relevant scrapers in `src/main.ts`.

## Adding a New Scraper

1. Create `src/scrapers/<source>.ts` exporting a `Scraper`
2. Use helpers from `./helpers`: `UA`, `hashUrl`, `stripHtml`, `truncate`, `safeDate`
3. Test it: `bun --eval "import { x } from './src/scrapers/x'; console.log(await x.scrape())"`
4. If it works, add the import and entry to `scrapers[]` in `src/main.ts`
5. If it fails, make the `scrape()` throw immediately and document it in `doc/scraper-failures.md`

## Project Structure

```
src/
  main.ts          pipeline orchestrator
  config.ts        all env-driven configuration
  types.ts         Job, Scraper, ScoreResult interfaces
  prefilter.ts     regex hard-filter (no API cost)
  scorer.ts        GLM scoring via OpenAI-compatible API
  dedup.ts         SQLite deduplication
  profile.ts       CV loading via pdftotext
  scrapers/        one file per source
    helpers.ts     shared utilities
    browser.ts     Lightpanda wrapper
doc/
  job-sources.md        catalog of 42 sources with integration notes
  scraper-failures.md   documented reasons for each failed integration
mise.toml          env config + task runner
```
