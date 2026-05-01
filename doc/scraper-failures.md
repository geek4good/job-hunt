# Scraper Failures

Sources that could not be integrated after one or more attempts.

---

## Anti-bot / Login Wall

### [LinkedIn Jobs](https://www.linkedin.com/jobs/)

- **Date attempted:** 2026-05-01
- **Approach 1:** Plain `fetch` with UA header to `/jobs/`
  - **Result:** HTTP 999 — LinkedIn actively blocks non-browser clients at the edge
- **Reason:** Requires authenticated browser session; HTTP 999 blocks all bots. No public job seeker API.

### [SimplyHired](https://www.simplyhired.com)

- **Date attempted:** 2026-05-01
- **Approach 1:** Plain `fetch` with UA header
  - **Result:** CAPTCHA / bot detection page returned instead of job listings
- **Reason:** Anti-bot fingerprinting and CAPTCHA wall on all search result pages. No public API.

### [CareerBuilder](https://www.careerbuilder.com/)

- **Date attempted:** 2026-05-01
- **Approach 1:** Plain `fetch` with UA header
  - **Result:** Anti-bot challenge page — no job data in response HTML
- **Reason:** Aggressive bot detection. No public job seeker API or RSS feed.

---

## Site Down / Rebuilding

### [Himalayas](https://himalayas.app/jobs/api)

- **Date attempted:** 2026-05-01
- **Approach 1:** `GET https://himalayas.app/jobs/api` (documented JSON API)
  - **Result:** HTTP 404
- **Approach 2:** `GET https://himalayas.app/` (root domain to check if site is up)
  - **Result:** HTTP 404
- **Reason:** Entire domain returning 404 as of 2026-05-01. Site appears to be down or migrated.

### [No Visa Jobs](https://novisajobs.com/)

- **Date attempted:** 2026-05-01
- **Approach 1:** Plain `fetch` to root
  - **Result:** 1989-byte HTML shell — empty SPA scaffold with no data, no API endpoints visible
- **Reason:** Site appears to be rebuilding or in maintenance mode. No job data accessible.

---

## Requires Lightpanda (JavaScript Execution)

These sources use SPAs or client-side rendering. Job data is not present in the initial HTML
response and requires JavaScript execution to load. Scrapers are implemented with a Lightpanda
fallback but return `[]` without `LPD_TOKEN` or `LPD_CDP_URL` set.

| Source | Framework | Notes |
|---|---|---|
| [Dynamite Jobs](https://dynamitejobs.com/remote-jobs) | Vue / Pinia | `window.__PINIA_STATE__` hydration |
| [JustRemote](https://justremote.co/) | React SPA | `<div id="root">` only |
| [RemoteSource](https://www.remotesource.com/jobs) | React SSR streaming | `<div hidden=""><!--$-->` streaming placeholder |
| [Remote100K](https://remote100k.com/) | Framer | 460KB page, only Corporation/WebSite JSON-LD |
| [Peerlist](https://peerlist.io/jobs) | SPA | 5.3KB initial HTML, no data |
| [Dice](https://www.dice.com/) | SPA | No job data in initial HTML |
| [FlexJobs](https://www.flexjobs.com/remote-jobs) | SPA + Paywall | Requires login to view listings |
| [PeoplePerHour](https://www.peopleperhour.com/) | GTM-based SPA | 650KB page, no job data without JS |
| [Contra](https://contra.com/jobs) | Vike SPA | Relay map empty in initial HTML |
| [Truelancer](https://www.truelancer.com/) | Next.js | `__NEXT_DATA__` only has `session`, not jobs |

**To enable:** Set `LPD_TOKEN=<token>` (from console.lightpanda.io) or `LPD_CDP_URL=ws://127.0.0.1:9222` (Docker).

---

## Requires API Credentials

Public job-seeker access is gated behind a partner/publisher API key.

| Source | Credential needed | How to obtain |
|---|---|---|
| [CareerJet](https://www.careerjet.com/) | `CAREERJET_API_KEY` | Free at careerjet.com/partners |
| [Welcome to the Jungle](https://www.welcometothejungle.com/) | `WTTJ_API_TOKEN` | Request form at welcomekit.co |
| [Upwork](https://www.upwork.com/) | `UPWORK_CLIENT_ID` + `UPWORK_CLIENT_SECRET` | OAuth app at developers.upwork.com |
| [Glassdoor](https://www.glassdoor.com/) | `GLASSDOOR_PARTNER_ID` + `GLASSDOOR_KEY` | Partner account required |
| [Monster](https://www.monster.com/) | `MONSTER_PARTNER_KEY` | Partner program |
| [Indeed](https://www.indeed.com/) | `INDEED_PUBLISHER_ID` | Publisher account (waitlisted) |

---

## Canada-Only / Low-Relevance (not registered)

### [Eluta.ca](https://www.eluta.ca/)

- **Date attempted:** 2026-05-01
- **Approach:** `GET https://www.eluta.ca/elutaxml?q=software+developer+remote`
- **Reason:** Canada-only job board. API may require registration for sustained access. Not relevant to remote/global job search.

### [Job Bank Canada](https://www.jobbank.gc.ca/)

- **Date attempted:** 2026-05-01
- **Approach:** `GET https://www.jobbank.gc.ca/rss/jobsearch.rss?searchstring=software+developer`
- **Reason:** Canada government job board only (federal/provincial). Not remote-focused. Listings skew toward on-site positions in Canadian cities.

---

## Low-Relevance Stubs (not attempted)

These sources were excluded without a scraping attempt because they target markets or job types
outside the scope of this agent (remote software engineering).

| Source | Reason |
|---|---|
| [Robert Half](https://www.roberthalf.com/) | Staffing/temp firm — no public job seeker API |
| [Comparably](https://www.comparably.com/) | Company culture ratings, not a job board |
| [Worksome](https://www.worksome.com/) | Enterprise freelancer management system — no public listings |
| [Remote.com](https://remote.com/) | HR/payroll platform — not a job board |
| [WorldTeams](https://careers.worldteams.com/) | LATAM-to-US niche, very limited volume |
| [TalentEgg](https://talentegg.ca/) | Canada student/entry-level only |
| [Talent.com](https://www.talent.com/) | Aggregator — duplicates other sources |
| [Kijiji](https://www.kijiji.ca/) | Classifieds — no jobs API, very low signal |
| [Snagajob](https://www.snagajob.com/) | US hourly/shift work — not software engineering |
| [Jobboom](https://www.jobboom.com/) | Québec French-language only |
| [Jobillico](https://www.jobillico.com/) | Employer-side API only, no job seeker endpoint |
| [Hiredly](https://my.hiredly.com/) | Malaysia market only |
| [CareerBuilder UK](https://www.careerbuilder.co.uk/) | UK generalist — same anti-bot as US counterpart |
| [Jooble FR](https://fr.jooble.org/) | French-language aggregator — duplicates other sources |
