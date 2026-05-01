# Job Sources — Feed URLs & Integration Notes

_Last updated: 2026-05-01_

---

## From LinkedIn Post (23 platforms)

### 1. Peerlist

| Format   | URL                       |
| -------- | ------------------------- |
| Website  | https://peerlist.io/jobs  |

Startup & remote jobs board. No public API/RSS.

---

### 2. Comparably

| Format   | URL                                       |
| -------- | ----------------------------------------- |
| Website  | https://www.comparably.com/jobs/companies/browse |

Employer branding / salary transparency platform. Companies browse & match. No public API/RSS.

---

### 3. PeoplePerHour

| Format   | URL                              |
| -------- | -------------------------------- |
| Website  | https://www.peopleperhour.com/   |

UK-first freelance marketplace. Project-based, not full-time roles. No public API/RSS.

---

### 4. Contra

| Format   | URL                                  |
| -------- | ------------------------------------ |
| Website  | https://contra.com/                  |
| Jobs     | https://contra.com/jobs              |

Commission-free freelance network. No public API/RSS.

---

### 5. Truelancer

| Format   | URL                               |
| -------- | --------------------------------- |
| Website  | https://www.truelancer.com/       |

Freelance marketplace (Fiverr/Upwork style). No public API/RSS.

---

### 6. Worksome

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://www.worksome.com/      |

Freelance Management System for enterprises. Not a job board per se. No public API/RSS.

---

### 7. CareerBuilder UK

| Format   | URL                                  |
| -------- | ------------------------------------ |
| Website  | https://www.careerbuilder.co.uk/     |

UK generalist job board. Not remote-focused. No public API/RSS.

---

### 8. Jooble France

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://fr.jooble.org/         |

French job search aggregator (meta-search). Not remote-focused. No public API/RSS.

---

### 9. JustRemotechJobs

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://justremote.co/         |

Remote tech jobs board. No public API/RSS (requires scraping).

---

### 10. Remote (remote.com)

| Format   | URL                                    |
| -------- | -------------------------------------- |
| Website  | https://remote.com/                    |

Global HR/payroll platform. Has a job board for roles at companies using Remote. No public API/RSS.

---

### 11. Hiredly

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://my.hiredly.com/        |

Malaysia-focused job board. Not remote-focused. No public API/RSS.

---

### 12. Remote100K

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://remote100k.com/        |

Remote jobs paying $100K+ USD. Curated, apply directly. No public API/RSS.

---

### 13. We Work Remotely ✅ (already integrated)

| Format   | URL                                                       |
| -------- | --------------------------------------------------------- |
| RSS      | `https://weworkremotely.com/remote-jobs.rss`              |
| RSS (dev)| `https://weworkremotely.com/categories/remote-programming-jobs.rss` |
| Website  | https://weworkremotely.com                                |

---

### 14. RemoteOK

| Format   | URL                                    |
| -------- | -------------------------------------- |
| JSON API | `https://remoteok.com/api`             |
| RSS      | `https://remoteok.com/remote-jobs.rss` |
| Website  | https://remoteok.com                   |

No auth needed. Add `User-Agent` header and credit them.

---

### 15. Remotive

| Format   | URL                                            |
| -------- | ---------------------------------------------- |
| JSON API | `https://remotive.com/api/remote-jobs`         |
| XML Feed | `https://remotive.com/api/remote-jobs.xml`     |
| RSS      | `https://remotive.com/remote-jobs/rss-feed`    |
| Website  | https://remotive.com                           |

Public, no auth. Link back to Remotive in output.

---

### 16. Jobspresso

| Format   | URL                                      |
| -------- | ---------------------------------------- |
| Website  | https://jobspresso.co/                   |

Curated remote jobs (tech, marketing, support). No public API/RSS.

---

### 17. Dynamite Jobs

| Format   | URL                                        |
| -------- | ------------------------------------------ |
| Website  | https://dynamitejobs.com/remote-jobs       |

Remote-first job board. 100% verified remote roles. No public API/RSS.

---

### 18. Working Nomads

| Format     | URL                                                    |
| ---------- | ------------------------------------------------------ |
| JSON API   | `https://www.workingnomads.com/jobsapi/_search` (POST) |
| JSON Feed  | `https://www.workingnomads.co/api/exposed_jobs/`       |
| Website    | https://www.workingnomads.com                          |

---

### 19. Himalayas 🌟

| Format   | URL                                        |
| -------- | ------------------------------------------ |
| JSON API | `https://himalayas.app/jobs/api`           |
| RSS      | `https://himalayas.app/rss`                |
| Docs     | https://himalayas.app/docs                 |
| Website  | https://himalayas.app                      |

Free public JSON API + RSS. No auth. Search by keyword, country, seniority, timezone. Excellent integration candidate.

---

### 20. RemoteSource

| Format   | URL                                      |
| -------- | ---------------------------------------- |
| Website  | https://www.remotesource.com/jobs        |

100% remote jobs. Free to access. No public API/RSS.

---

### 21. No Visa Jobs

| Format   | URL                            |
| -------- | ------------------------------ |
| Website  | https://novisajobs.com/        |

Remote jobs that don't require US/EU/UK visas. Pay-as-you-wish. Currently in hiatus / rebuilding. No public API/RSS.

---

### 22. WorldTeams

| Format   | URL                                        |
| -------- | ------------------------------------------ |
| Website  | https://careers.worldteams.com/            |

Remote jobs for LATAM talent working with US companies. No public API/RSS.

---

## Previously Researched — Additional Sources

### Jobicy

| Format   | URL                                            |
| -------- | ---------------------------------------------- |
| JSON API | `https://jobicy.com/api/v2/remote-jobs`        |
| RSS      | `https://jobicy.com/rss-feed`                  |
| Website  | https://jobicy.com                             |

Free public API. Filter by geo, industry, tag. No auth.

---

### Hacker News — "Who is Hiring?"

| Format                | URL                                                                                   |
| --------------------- | ------------------------------------------------------------------------------------- |
| Current month thread  | `https://news.ycombinator.com/item?id=<monthly_thread_id>`                            |
| All threads (user)    | `https://news.ycombinator.com/submitted?id=whoishiring`                               |
| API (Algolia)         | `https://hn.algolia.com/api/v1/search?tags=story,author_whoishiring`                  |
| 3rd-party aggregator  | https://whoishiring.io                                                                |

No RSS. Monthly text thread — requires Algolia API + comment parsing. High-quality signal but more work.

---

### Europe Remotely (EU Remote Jobs)

| Format | URL                                                    |
| ------ | ------------------------------------------------------ |
| RSS    | `https://euremotejobs.com/get-widget-embed-code/`      |
| Website| https://euremotejobs.com                               |

RSS exists but is primarily an embed widget. Unclean feed.

---

## Integration Difficulty Summary

| Priority     | Source            | Difficulty | Feed Type           | Notes                                       |
| ------------ | ----------------- | ---------- | ------------------- | ------------------------------------------- |
| ✅ Done       | WWR               | —          | RSS                 | Already integrated                          |
| 🟢 Easy      | RemoteOK          | Easy       | JSON API + RSS      | No auth, high volume                        |
| 🟢 Easy      | Remotive          | Easy       | JSON API + XML      | No auth                                     |
| 🟢 Easy      | Himalayas         | Easy       | JSON API + RSS      | No auth, excellent docs, searchable         |
| 🟢 Easy      | Jobicy            | Easy       | JSON API + RSS      | No auth, filterable                         |
| 🟡 Medium    | Working Nomads    | Medium     | JSON API (POST)     | Requires POST request                       |
| 🔴 Hard      | HN Who's Hiring   | Hard       | None (Algolia API)  | Comment parsing required                    |
| 🔴 Hard      | JustRemote        | Hard       | None                | Scraping only                               |
| 🔴 Hard      | Europe Remotely   | Hard       | Unclean RSS         | Widget-embedded feed                        |
| ⚪ No Feed   | Peerlist          | —          | None                | No API/RSS                                  |
| ⚪ No Feed   | Comparably        | —          | None                | Match-based, not browseable                 |
| ⚪ No Feed   | PeoplePerHour     | —          | None                | Freelance marketplace                       |
| ⚪ No Feed   | Contra            | —          | None                | Freelance network                           |
| ⚪ No Feed   | Truelancer        | —          | None                | Freelance marketplace                       |
| ⚪ No Feed   | Worksome          | —          | None                | Enterprise FMS, not a job board             |
| ⚪ No Feed   | CareerBuilder UK  | —          | None                | UK generalist, not remote-focused           |
| ⚪ No Feed   | Jooble France     | —          | None                | French aggregator, not remote-focused       |
| ⚪ No Feed   | Remote.com        | —          | None                | HR/payroll platform                         |
| ⚪ No Feed   | Hiredly           | —          | None                | Malaysia-focused                            |
| ⚪ No Feed   | Remote100K        | —          | None                | $100K+ remote, curated                      |
| ⚪ No Feed   | Jobspresso        | —          | None                | Curated remote, no API                      |
| ⚪ No Feed   | Dynamite Jobs     | —          | None                | Remote-first, no API                        |
| ⚪ No Feed   | RemoteSource      | —          | None                | 100% remote, no API                         |
| ⚪ No Feed   | No Visa Jobs      | —          | None                | In hiatus / rebuilding                      |
| ⚪ No Feed   | WorldTeams        | —          | None                | LATAM → US, no API                          |
