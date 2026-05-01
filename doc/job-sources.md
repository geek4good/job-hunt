# Job Sources — Feed URLs & Integration Notes

_Last updated: 2026-05-01_

---

## 1. LinkedIn Post — Remote-Focused Platforms (22)

### 1.1 Peerlist

| Format   | URL                       |
| -------- | ------------------------- |
| Website  | https://peerlist.io/jobs  |

Startup & remote jobs board. No public API/RSS.

---

### 1.2 Comparably

| Format   | URL                                       |
| -------- | ----------------------------------------- |
| Website  | https://www.comparably.com/jobs/companies/browse |

Employer branding / salary transparency platform. Companies browse & match. No public API/RSS.

---

### 1.3 PeoplePerHour

| Format   | URL                              |
| -------- | -------------------------------- |
| Website  | https://www.peopleperhour.com/   |

UK-first freelance marketplace. Project-based, not full-time roles. No public API/RSS.

---

### 1.4 Contra

| Format   | URL                                  |
| -------- | ------------------------------------ |
| Website  | https://contra.com/                  |
| Jobs     | https://contra.com/jobs              |

Commission-free freelance network. No public API/RSS.

---

### 1.5 Truelancer

| Format   | URL                               |
| -------- | --------------------------------- |
| Website  | https://www.truelancer.com/       |

Freelance marketplace (Fiverr/Upwork style). No public API/RSS.

---

### 1.6 Worksome

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://www.worksome.com/      |

Freelance Management System for enterprises. Not a job board per se. No public API/RSS.

---

### 1.7 CareerBuilder UK

| Format   | URL                                  |
| -------- | ------------------------------------ |
| Website  | https://www.careerbuilder.co.uk/     |

UK generalist job board. Not remote-focused. No public API/RSS.

---

### 1.8 Jooble France

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://fr.jooble.org/         |

French job search aggregator (meta-search). Not remote-focused. No public API/RSS.

---

### 1.9 JustRemotechJobs

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://justremote.co/         |

Remote tech jobs board. No public API/RSS (requires scraping).

---

### 1.10 Remote (remote.com)

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://remote.com/                    |

Global HR/payroll platform. Has a job board for roles at companies using Remote. No public API/RSS.

---

### 1.11 Hiredly

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://my.hiredly.com/        |

Malaysia-focused job board. Not remote-focused. No public API/RSS.

---

### 1.12 Remote100K

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://remote100k.com/        |

Remote jobs paying $100K+ USD. Curated, apply directly. No public API/RSS.

---

### 1.13 We Work Remotely ✅ (already integrated)

| Format   | URL                                                       |
| -------- | --------------------------------------------------------- |
| RSS      | `https://weworkremotely.com/remote-jobs.rss`              |
| RSS (dev)| `https://weworkremotely.com/categories/remote-programming-jobs.rss` |
| Website  | https://weworkremotely.com                                |

---

### 1.14 RemoteOK

| Format   | URL                                    |
| -------- | -------------------------------------- |
| JSON API | `https://remoteok.com/api`             |
| RSS      | `https://remoteok.com/remote-jobs.rss` |
| Website  | https://remoteok.com                   |

No auth needed. Add `User-Agent` header and credit them.

---

### 1.15 Remotive

| Format   | URL                                            |
| -------- | ---------------------------------------------- |
| JSON API | `https://remotive.com/api/remote-jobs`         |
| XML Feed | `https://remotive.com/api/remote-jobs.xml`     |
| RSS      | `https://remotive.com/remote-jobs/rss-feed`    |
| Website  | https://remotive.com                           |

Public, no auth. Link back to Remotive in output.

---

### 1.16 Jobspresso

| Format   | URL                                      |
| -------- | ---------------------------------------- |
| Website  | https://jobspresso.co/                   |

Curated remote jobs (tech, marketing, support). No public API/RSS.

---

### 1.17 Dynamite Jobs

| Format   | URL                                        |
| -------- | ------------------------------------------ |
| Website  | https://dynamitejobs.com/remote-jobs       |

Remote-first job board. 100% verified remote roles. No public API/RSS.

---

### 1.18 Working Nomads

| Format     | URL                                                    |
| ---------- | ------------------------------------------------------ |
| JSON API   | `https://www.workingnomads.com/jobsapi/_search` (POST) |
| JSON Feed  | `https://www.workingnomads.co/api/exposed_jobs/`       |
| Website    | https://www.workingnomads.com                          |

---

### 1.19 Himalayas 🌟

| Format   | URL                                        |
| -------- | ------------------------------------------ |
| JSON API | `https://himalayas.app/jobs/api`           |
| RSS      | `https://himalayas.app/rss`                |
| Docs     | https://himalayas.app/docs                 |
| Website  | https://himalayas.app                      |

Free public JSON API + RSS. No auth. Search by keyword, country, seniority, timezone. Excellent integration candidate.

---

### 1.20 RemoteSource

| Format   | URL                                      |
| -------- | ---------------------------------------- |
| Website  | https://www.remotesource.com/jobs        |

100% remote jobs. Free to access. No public API/RSS.

---

### 1.21 No Visa Jobs

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://novisajobs.com/        |

Remote jobs that don't require US/EU/UK visas. Pay-as-you-wish. Currently in hiatus / rebuilding. No public API/RSS.

---

### 1.22 WorldTeams

| Format   | URL                                        |
| -------- | ------------------------------------------ |
| Website  | https://careers.worldteams.com/            |

Remote jobs for LATAM talent working with US companies. No public API/RSS.

---

## 2. LinkedIn Image — Generalist & Traditional Job Boards (20)

### 2.1 Indeed

| Format   | URL                                    |
| -------- | -------------------------------------- |
| API      | `https://apis.indeed.com/graphql`      |
| Docs     | https://opensource.indeedeng.io/api-documentation/ |
| Website  | https://www.indeed.com                 |

World's largest job site. API is partner-focused (GraphQL). Requires publisher account. No simple public RSS.

---

### 2.2 Glassdoor

| Format   | URL                                    |
| -------- | -------------------------------------- |
| API      | `https://api.glassdoor.com/api/api.htm`|
| Docs     | https://www.glassdoor.com/developer/index.htm |
| Website  | https://www.glassdoor.com              |

REST API (JSON). Requires partner ID + API key. Jobs API has limited public access; full access requires partnership.

---

### 2.3 Workopolis

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.workopolis.com/            |

⚠️ **Shut down.** Acquired by Indeed in 2018. Now a white-label portal for Indeed Canada. Not usable as an independent source.

---

### 2.4 Eluta.ca

| Format   | URL                                    |
| -------- | -------------------------------------- |
| XML API  | `https://www.eluta.ca/elutaxml`        |
| Website  | https://eluta.ca/                      |

Canadian job search engine. Has an XML API for publishers. Not remote-focused. Canada-only.

---

### 2.5 JobBank Canada

| Format   | URL                                    |
| -------- | -------------------------------------- |
| RSS      | Available via search (see below)       |
| Website  | https://www.jobbank.gc.ca/jobsearch/   |

Official Canadian government job board. RSS feeds available via search result pages. Not remote-focused. Canada-only.

---

### 2.6 Monster

| Format   | URL                                            |
| -------- | ---------------------------------------------- |
| API      | `https://api.jobs.com/v3/search/jobs`          |
| RSS      | Available via search (last 24h only)            |
| Docs     | https://partner.monster.com/job-search         |
| Website  | https://www.monster.com                        |

Major global job board. Partner API available. RSS feed only covers last 24 hours. Not remote-focused.

---

### 2.7 SimplyHired

| Format   | URL                                    |
| -------- | -------------------------------------- |
| API      | Via Techmap (`portal=simplyhired`)     |
| Website  | https://www.simplyhired.com            |

Job search engine. No direct public API. Accessible via Techmap's Job Postings API (paid, with free tier). Not remote-focused.

---

### 2.8 Jobboom

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.jobboom.com/               |

Québec-focused job board (French-language). No public API/RSS. Canada/Québec only.

---

### 2.9 Jobilico

| Format   | URL                                    |
| -------- | -------------------------------------- |
| API      | `https://www.jobillico.com/api/info`   |
| Docs     | https://www.jobillico.com/api/help/jobillico-api |
| Website  | https://www.jobillico.com              |

Canadian job board. Has an API for employers to post jobs (not for job seekers to search). Not remote-focused.

---

### 2.10 FlexJobs

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.flexjobs.com/remote-jobs   |

Paid subscription remote/flexible job board. Hand-screened listings. No public API/RSS. Requires scraping (behind paywall).

---

### 2.11 Talent.com

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.talent.com                 |
| Publishers | https://www.talent.com/publishers    |

Global job search engine (77 countries). XML feed integrations for employers. No public job seeker API/RSS. Not remote-focused.

---

### 2.12 TalentEgg

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://talentegg.ca/                  |

Canadian job board for students, grads, and early-career professionals. No public API/RSS. Not remote-focused.

---

### 2.13 CareerBuilder

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.careerbuilder.com/         |

Major global job board. Has partner APIs for employers. No public job seeker API/RSS. Not remote-focused.

---

### 2.14 Robert Half

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.roberthalf.com/us/en/find-jobs |

Staffing/recruitment firm specializing in finance, tech, marketing, legal, admin. Job board for their placements. No public API/RSS. Not remote-focused.

---

### 2.15 Kijiji

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.kijiji.ca/                 |

Canadian classifieds (eBay subsidiary). Has a jobs section. No public API/RSS for jobs. Not remote-focused.

---

### 2.16 Snagajob

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.snagajob.com/              |

US hourly/part-time job marketplace. No public job seeker API/RSS. Not remote-focused. Hourly roles only.

---

### 2.17 Dice

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://www.dice.com/                  |

Tech-focused US job board. No public API/RSS. Requires scraping or Apify third-party scrapers. Good for tech roles but not remote-focused.

---

### 2.18 Upwork

| Format   | URL                                        |
| -------- | ------------------------------------------ |
| API      | `https://api.upwork.com/graphql`           |
| RSS      | Available (search-based feeds)              |
| Docs     | https://developer.upwork.com/              |
| Website  | https://www.upwork.com                     |

Freelance marketplace. Has GraphQL API + RSS feeds. Requires OAuth for API. Freelance/project-based, not full-time roles.

---

### 2.19 Careerjet

| Format   | URL                                              |
| -------- | ------------------------------------------------ |
| API      | `https://search.api.careerjet.net/v4/query`      |
| Docs     | https://www.careerjet.com/partners/api            |
| Website  | https://www.careerjet.com                        |

Job search aggregator. Partner API (JSON/XML). Requires API key (free). Multi-country. Not remote-focused.

---

### 2.20 Welcome to the Jungle (WTTJ)

| Format   | URL                                                    |
| -------- | ------------------------------------------------------ |
| API      | `https://www.welcomekit.co/api/v1/external/jobs/all`   |
| Docs     | https://developers.welcomekit.co/                      |
| Website  | https://www.welcometothejungle.com                     |

French/European job board (expanding globally). Has a REST API. Requires auth token (request via form). Good tech listings. Not remote-focused.

---

## 3. Previously Researched — Additional Sources

### 3.1 Jobicy

| Format   | URL                                            |
| -------- | ---------------------------------------------- |
| JSON API | `https://jobicy.com/api/v2/remote-jobs`        |
| RSS      | `https://jobicy.com/rss-feed`                  |
| Website  | https://jobicy.com                             |

Free public API. Filter by geo, industry, tag. No auth.

---

### 3.2 Hacker News — "Who is Hiring?"

| Format                | URL                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------- |
| Current month thread  | `https://news.ycombinator.com/item?id=<monthly_thread_id>`                            |
| All threads (user)    | `https://news.ycombinator.com/submitted?id=whoishiring`                               |
| API (Algolia)         | `https://hn.algolia.com/api/v1/search?tags=story,author_whoishiring`                  |
| 3rd-party aggregator  | https://whoishiring.io                                                                |

No RSS. Monthly text thread — requires Algolia API + comment parsing. High-quality signal but more work.

---

### 3.3 Europe Remotely (EU Remote Jobs)

| Format | URL                                                    |
| ------ | ------------------------------------------------------ |
| RSS    | `https://euremotejobs.com/get-widget-embed-code/`      |
| Website| https://euremotejobs.com                               |

RSS exists but is primarily an embed widget. Unclean feed.

---

## Integration Difficulty Summary

> **Note:** Scraping is a valid approach. Sources marked "scrape" below can be
> integrated by fetching and parsing their HTML job listing pages. This is more
> fragile than API/RSS (breaks on site redesigns) but opens up many more sources.

### Candidates for Agent Integration

| Priority   | Source                  | Method             | Difficulty | Notes                                         |
| ---------- | ----------------------- | ------------------ | ---------- | --------------------------------------------- |
| ✅ Done     | WWR                     | RSS                | —          | Already integrated                            |
| 🟢 Easy    | RemoteOK                | JSON API + RSS     | Easy       | No auth, high volume                          |
| 🟢 Easy    | Remotive                | JSON API + XML     | Easy       | No auth                                       |
| 🟢 Easy    | Himalayas               | JSON API + RSS     | Easy       | No auth, excellent docs, searchable           |
| 🟢 Easy    | Jobicy                  | JSON API + RSS     | Easy       | No auth, filterable                           |
| 🟡 Medium  | Working Nomads          | JSON API (POST)    | Medium     | Requires POST request                         |
| 🟡 Medium  | Careerjet               | REST API (JSON/XML)| Medium     | Free API key required                         |
| 🟡 Medium  | Welcome to the Jungle   | REST API           | Medium     | Requires auth token (request form)            |
| 🟡 Medium  | Upwork                  | GraphQL API + RSS  | Medium     | Requires OAuth, freelance only                |
| 🟡 Medium  | Remote100K              | Scrape             | Medium     | $100K+ remote jobs, clean listing pages       |
| 🟡 Medium  | Jobspresso              | Scrape             | Medium     | Curated remote, simple HTML structure         |
| 🟡 Medium  | Dynamite Jobs           | Scrape             | Medium     | Remote-first, clean listing pages             |
| 🟡 Medium  | JustRemote              | Scrape             | Medium     | Remote tech jobs, browseable listing pages    |
| 🟡 Medium  | RemoteSource            | Scrape             | Medium     | 100% remote, clean listing pages              |
| 🟡 Medium  | No Visa Jobs            | Scrape             | Medium     | No visa requirement, may still be rebuilding  |
| 🟡 Medium  | Dice                    | Scrape             | Medium     | Tech-focused, good for backend roles          |
| 🟡 Medium  | FlexJobs                | Scrape             | Medium     | Paywall may block; high-quality remote roles  |
| 🟡 Medium  | Peerlist                | Scrape             | Medium     | Startup/remote jobs, clean pages              |
| 🔴 Hard    | HN Who's Hiring         | Scrape (Algolia)   | Hard       | Comment parsing required, monthly thread      |
| 🔴 Hard    | Indeed                  | Scrape             | Hard       | Aggressive anti-bot, high volume              |
| 🔴 Hard    | Glassdoor               | Scrape             | Hard       | Anti-bot, login wall                          |
| 🔴 Hard    | Monster                 | Scrape             | Hard       | Anti-bot measures                             |
| 🔴 Hard    | LinkedIn Jobs           | Scrape             | Hard       | Aggressive anti-bot, login wall               |
| 🔴 Hard    | SimplyHired             | Scrape             | Hard       | Anti-bot measures                             |
| 🔴 Hard    | CareerBuilder           | Scrape             | Hard       | Anti-bot measures                             |
| 🔴 Hard    | Europe Remotely         | Scrape             | Hard       | Unclean feed, small volume                    |

### Low Relevance for Our Use Case

These are either defunct, not remote-focused, geographically restricted, or
not engineering roles. Included for completeness but not recommended for the
job-hunt agent.

| Source          | Reason to skip                                  |
| --------------- | ----------------------------------------------- |
| Workopolis      | **Defunct** — acquired by Indeed (2018)         |
| Eluta.ca        | Canada-only, not remote-focused                 |
| JobBank Canada  | Canada-only, not remote-focused                 |
| Jobboom         | Québec-only, French-language                    |
| Jobilico        | Employer-facing API only, not remote-focused    |
| Talent.com      | Generalist, not remote-focused                  |
| TalentEgg       | Canada students/grads only                      |
| Robert Half     | Staffing firm placements, not remote-focused    |
| Kijiji          | Classifieds, not remote-focused                 |
| Snagajob        | US hourly/part-time only                        |
| Comparably      | Match-based, not browseable                     |
| PeoplePerHour   | Freelance marketplace, not full-time roles      |
| Contra          | Freelance network, not full-time roles          |
| Truelancer      | Freelance marketplace, not full-time roles      |
| Worksome        | Enterprise FMS, not a job board                 |
| CareerBuilder UK| UK generalist, not remote-focused               |
| Jooble France   | French aggregator, not remote-focused           |
| Remote.com      | HR/payroll platform, not a job board            |
| Hiredly         | Malaysia-focused, not remote-focused            |
| WorldTeams      | LATAM → US outsourcing, specific model          |
