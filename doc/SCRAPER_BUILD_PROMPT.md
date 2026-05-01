# Prompt: Build Scrapers for All Job Sources

You are an expert TypeScript/Bun engineer continuing work on the `job-hunt` agent. Your task is to implement a scraper for **every source** listed in `doc/job-sources.md`, following the existing patterns exactly.

---

## Context

This project is a local job-hunt agent that:
- Scrapes job listings from multiple sources
- Deduplicates them via SQLite
- Pre-filters obvious non-matches in code
- Scores remaining candidates with a local Ollama model
- Outputs only jobs that meet the candidate's criteria

**One scraper is already implemented:** `src/scrapers/wwr.ts` (We Work Remotely, via RSS). Use it as your reference implementation.

---

## Your Mission

Implement scrapers for **every source** listed in `doc/job-sources.md` that is not already done (WWR ✅) and not marked as **shut down** (Workopolis — skip it entirely).

Work through them **in priority order**:

1. **Easy (🟢):** RemoteOK, Remotive, Himalayas, Jobicy
2. **Medium (🟡):** Working Nomads, Upwork, Careerjet, Welcome to the Jungle
3. **Hard (🔴):** HN Who's Hiring, JustRemote, Europe Remotely
4. **Scraping-only / no public feed (all remaining sources):** These require web scraping. Try HTTP fetch first (many job boards serve server-rendered HTML). If that fails due to JS-only rendering, try using `fetch` with appropriate headers. If the site blocks scrapers, note it.

For each source, consult `doc/job-sources.md` for the available URLs, feed types, API endpoints, and integration notes.

---

## Rules

### Architecture

- **One file per scraper** in `src/scrapers/`, named descriptively (e.g., `remoteok.ts`, `remotive.ts`, `himalayas.ts`).
- Each scraper must implement the `Scraper` interface from `src/types.ts`:
  ```typescript
  interface Scraper {
    readonly name: string;
    scrape(): Promise<Job[]>;
  }
  ```
- Each scraper must return an array of `Job` objects with all fields populated:
  - `id`: deterministic hash of the URL (use `Bun.CryptoHasher("sha256")` like wwr.ts does)
  - `title`, `url`, `company`, `description` (plain text, HTML stripped, max ~4000 chars)
  - `publishedAt` (ISO 8601)
  - `source`: a short lowercase identifier (e.g., `"remoteok"`, `"remotive"`)
  - `region`: location/region info from the source, or `""` if unavailable
  - `category`: category from the source, or `""` if unavailable
- Import and register each new scraper in the `scrapers` array in `src/main.ts`.
- Keep dependencies minimal. The project currently uses only `fast-xml-parser`. Prefer `fetch` + built-in APIs. Only add new npm packages if absolutely necessary (and explain why).

### Scraping Strategy

For sources with public APIs or feeds (JSON, XML, RSS):
- Use the feed/API endpoint directly. This is always preferred.
- Add a descriptive `User-Agent` header: `job-hunt-agent/1.0`.

For sources with partner/auth APIs:
- If a free API key or token is needed, document it clearly as a `TODO` comment and skip the actual fetch — but still implement the scraper with a placeholder that throws a clear error explaining what's needed.
- If there's a free tier that works without signup, use it.

For sources with no API/feed at all (scraping-only):
- **Attempt 1:** Try fetching the website URL directly with `fetch`. Many job boards render job listings in the initial HTML (SSR). Parse the HTML to extract job data.
- **Attempt 2:** If the HTML doesn't contain job listings (likely client-rendered), check if the site loads data via XHR/fetch calls to an internal API. Look for patterns like `/api/jobs`, `/api/search`, `/_next/data/`, etc. in the page source.
- **Attempt 3:** If neither works, document the failure and move on.

### Testing & Validation

**After implementing each scraper, test it immediately** by running:

```bash
bun run -e "
import { theScraper } from './src/scrapers/thescraper';
const jobs = await theScraper.scrape();
console.log(JSON.stringify(jobs.slice(0, 2), null, 2));
console.log('Total jobs:', jobs.length);
"
```

Or create a small test script if needed. The goal is to verify the scraper actually returns valid `Job[]` objects with real data.

**If a scraper fails:**
1. Read the error carefully.
2. Debug: inspect the actual HTTP response (status code, content type, body snippet).
3. Try an alternative approach (e.g., different endpoint, different parsing strategy).
4. Retry **up to 3 times** with different approaches before giving up on a source.

### Failure Tracking

If a source cannot be scraped after multiple attempts, **do not skip silently**. Instead:

1. Add the source to `doc/scraper-failures.md` with the following format:

```markdown
# Scraper Failures

Sources that could not be integrated after multiple attempts.

---

## [Source Name](URL)

- **Website:** URL
- **Date attempted:** YYYY-MM-DD
- **Approach 1:** [what was tried, e.g. "Fetched RSS feed at URL"]
  - **Result:** [what happened, e.g. "403 Forbidden — site blocks non-browser User-Agents"]
- **Approach 2:** [e.g. "Fetched HTML and attempted DOM parsing"]
  - **Result:** [e.g. "Page is a JS SPA, no job data in initial HTML"]
- **Approach 3:** [e.g. "Searched for internal API endpoints in page source"]
  - **Result:** [e.g. "No internal API found; data loaded via authenticated GraphQL"]
- **Reason:** One-sentence summary of why this source can't be scraped.
```

2. Still create the scraper file, but have `scrape()` throw a clear error that references the failure doc. This keeps the codebase honest and makes it easy to retry later.

3. Do NOT add the scraper to the `scrapers` array in `main.ts` if it's known to fail — comment it out with a note.

---

## Execution Flow

Follow this exact workflow for **each source**, one at a time:

```
for each source in doc/job-sources.md (in priority order):
  1. Read the source's entry in doc/job-sources.md for URLs and notes.
  2. Create src/scrapers/{name}.ts implementing the Scraper interface.
  3. Test the scraper by running it.
  4. If it works:
     a. Register it in src/main.ts.
     b. Move to the next source.
  5. If it fails:
     a. Debug, try a different approach (up to 3 attempts).
     b. If all attempts fail, add to doc/scraper-failures.md.
     c. Comment out the import in main.ts with a note.
     d. Move to the next source.
  6. Do not stop. Keep going until ALL sources have been attempted.
```

**Do not stop early.** Do not ask for confirmation between sources. Work through them all autonomously.

---

## Important Constraints

- Use **Bun APIs** (`Bun.CryptoHasher`, `fetch`, etc.). This project runs on Bun, not Node.
- Do not modify `src/types.ts` — the `Job` and `Scraper` interfaces are stable.
- Do not modify `src/dedup.ts`, `src/prefilter.ts`, `src/scorer.ts`, or `src/profile.ts`.
- Do not modify `src/config.ts` unless you need to add a new config value (justify it).
- You MAY add new helper functions to scraper files. You MAY create a shared `src/scrapers/helpers.ts` if multiple scrapers need the same utility (e.g., `hashUrl`, `stripHtml` — extract them from `wwr.ts`).
- Include the `User-Agent: job-hunt-agent/1.0` header on all HTTP requests.
- Be a good citizen: don't hammer APIs. If a source has rate limits, respect them.
- For sources that are clearly not relevant (non-remote, wrong geography, freelance-only, niche), still attempt the scraper but add a note in the source file that it may not yield relevant results for this candidate's profile. The pre-filter and scorer downstream will handle relevance.

---

## Sources to Skip Entirely

- **Workopolis** — shut down, acquired by Indeed.

## Sources That May Be Explicitly Out of Scope

These are noted in the source doc as "No Feed / Low Relevance." Still attempt them, but if scraping fails quickly, you may move on after just 1 attempt instead of 3:

- Non-remote, geography-specific boards that clearly won't have remote roles (CareerBuilder UK, Jooble France, Hiredly, Eluta.ca, JobBank Canada, Jobboom, Jobilico, TalentEgg, Kijiji, Snagajob)
- Freelance-only platforms (PeoplePerHour, Contra, Truelancer, Upwork) — attempt them but note they're freelance-focused
- Paywalled sites (FlexJobs) — try the public pages, but if blocked, fail fast

---

## Deliverables

When you are done, the project should have:

1. **One `.ts` file per source** in `src/scrapers/` (or a clear reason in failures.md).
2. **All working scrapers registered** in `src/main.ts`.
3. **`doc/scraper-failures.md`** listing any sources that couldn't be integrated.
4. **Each scraper tested** and confirmed to return real data (or confirmed to fail with a clear reason).
5. **No regressions** — `bun run src/main.ts` should still work end-to-end with all registered scrapers.

---

## Quick Reference: Existing Scraper Pattern

```typescript
// src/scrapers/wwr.ts — reference implementation
import { XMLParser } from "fast-xml-parser";
import type { Job, Scraper } from "../types";

const FEED_URL = "https://weworkremotely.com/categories/remote-programming-jobs.rss";

function hashUrl(url: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(url);
  return hasher.digest("hex").slice(0, 16);
}

function stripHtml(html: string): string { /* ... */ }

export const wwr: Scraper = {
  name: "We Work Remotely",
  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${FEED_URL}`);
    const response = await fetch(FEED_URL, {
      headers: { "User-Agent": "job-hunt-agent/1.0" },
    });
    if (!response.ok) throw new Error(`[${this.name}] fetch failed: ${response.status}`);
    // ... parse, normalize, return Job[]
  },
};
```

Follow this pattern. Keep each scraper self-contained and focused.
