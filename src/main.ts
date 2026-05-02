#!/usr/bin/env bun
// src/main.ts — Orchestrator: scrape → dedup → pre-filter → score → output

import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { config } from "./config";
import type { Job, Scraper } from "./types";
import type { ScoreResult } from "./types";
import { closeDb, filterNew, getSeenIds, openDb, recordJob } from "./dedup";
import { scoreAll } from "./scorer";
import { preFilter } from "./prefilter";

// ---------------------------------------------------------------------------
// Scrapers — add new sources here
// ---------------------------------------------------------------------------

// --- Working scrapers (registered below) ---
import { wwr } from "./scrapers/wwr";
import { remoteok } from "./scrapers/remoteok";
import { remotive } from "./scrapers/remotive";
import { jobicy } from "./scrapers/jobicy";
import { workingnomads } from "./scrapers/workingnomads";
import { hnWhoIsHiring } from "./scrapers/hn-whoishiring";
import { euremotejobs } from "./scrapers/euremotejobs";
import { jobspresso } from "./scrapers/jobspresso";

// --- Needs LPD_TOKEN (Lightpanda) to yield job data ---
// import { dynamitejobs } from "./scrapers/dynamitejobs";   // Vue/Pinia SPA
// import { justremote } from "./scrapers/justremote";       // React SPA
// import { remotesource } from "./scrapers/remotesource";   // React SSR streaming
// import { remote100k } from "./scrapers/remote100k";       // Framer site
// import { peerlist } from "./scrapers/peerlist";           // SPA (tiny initial HTML)
// import { dice } from "./scrapers/dice";                   // SPA
// import { flexjobs } from "./scrapers/flexjobs";           // Paywall + SPA
// import { peopleperhour } from "./scrapers/peopleperhour"; // GTM-based SPA
// import { contra } from "./scrapers/contra";               // Vike SPA
// import { truelancer } from "./scrapers/truelancer";       // Next.js SPA

// --- Needs API credentials ---
// import { careerjet } from "./scrapers/careerjet";   // TODO: CAREERJET_API_KEY (free at careerjet.com/partners)
// import { wttj } from "./scrapers/wttj";             // TODO: WTTJ_API_TOKEN (request at welcomekit.co)
// import { upwork } from "./scrapers/upwork";         // TODO: UPWORK_CLIENT_ID + UPWORK_CLIENT_SECRET (OAuth)
// import { glassdoor } from "./scrapers/glassdoor";   // TODO: GLASSDOOR_PARTNER_ID + GLASSDOOR_KEY
// import { monster } from "./scrapers/monster";       // TODO: MONSTER_PARTNER_KEY
// import { indeed } from "./scrapers/indeed";         // TODO: INDEED_PUBLISHER_ID

// --- Anti-bot / login wall — cannot be scraped ---
// import { linkedin } from "./scrapers/linkedin";           // HTTP 999 + login wall
// import { simplyhired } from "./scrapers/simplyhired";     // CAPTCHA / bot detection
// import { careerbuilder } from "./scrapers/careerbuilder"; // Anti-bot

// --- Site down / rebuilding ---
// import { himalayas } from "./scrapers/himalayas";   // HTTP 404 as of 2026-05-01
// import { novisajobs } from "./scrapers/novisajobs"; // Site rebuilding (empty SPA shell)

// --- Canada-only / low-relevance (not registered) ---
// import { eluta } from "./scrapers/eluta";           // XML API, Canada-only, may require registration
// import { jobbank } from "./scrapers/jobbank";       // RSS, Canada govt jobs only

// --- Low-relevance stubs (not registered) ---
// import { roberthalf } from "./scrapers/roberthalf";         // Staffing firm, no API
// import { comparably } from "./scrapers/comparably";         // Match-based, no API
// import { worksome } from "./scrapers/worksome";             // Enterprise FMS, no API
// import { remotecom } from "./scrapers/remotecom";           // HR platform, no API
// import { worldteams } from "./scrapers/worldteams";         // LATAM→US niche
// import { talentegg } from "./scrapers/talentegg";           // Canada students only
// import { talentcom } from "./scrapers/talentcom";           // Generalist, no API
// import { kijiji } from "./scrapers/kijiji";                 // Classifieds, no jobs API
// import { snagajob } from "./scrapers/snagajob";             // US hourly/shift work
// import { jobboom } from "./scrapers/jobboom";               // Québec French only
// import { jobilico } from "./scrapers/jobilico";             // Employer API only
// import { hiredly } from "./scrapers/hiredly";               // Malaysia market
// import { careerbuilderuk } from "./scrapers/careerbuilderuk"; // UK generalist, no API
// import { jooblefr } from "./scrapers/jooblefr";             // French aggregator, no API

/** Each scraper is self-contained. Add a new import + entry to extend. */
const scrapers: Scraper[] = [
  wwr,
  remoteok,
  remotive,
  jobicy,
  workingnomads,
  hnWhoIsHiring,
  euremotejobs,
  jobspresso,
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function banner(): void {
  const scraperNames = scrapers.map((s) => s.name).join(", ");
  console.log("\n🔍 job-hunt agent v1.0");
  console.log(`   Scrapers:   ${scraperNames}`);
  console.log(`   Model:      ${config.glmModel} (z.ai)`);
  console.log(`   Threshold:  ${config.scoreThreshold}/10`);
  console.log(`   Min salary: $${config.minSalaryUsd.toLocaleString()}/yr  |  Min day rate: $${config.minDayRateUsd}/day (~$${config.minHourlyRateUsd}/hr)\n`);
}

function formatDate(iso: string): string {
  const d = new Date(iso);
  return isNaN(d.getTime()) ? "unknown" : d.toISOString().slice(0, 10);
}

function printAccepted(
  results: { job: Job; result: ScoreResult }[],
): void {
  if (results.length === 0) {
    console.log("\n📭 No new jobs matched your criteria this run.\n");
    return;
  }

  console.log(`\n${"=".repeat(72)}`);
  console.log(`📬 ${results.length} ACCEPTED JOB${results.length === 1 ? "" : "S"}`);
  console.log("=".repeat(72));

  for (const { job, result } of results) {
    console.log(`
┌──────────────────────────────────────────────────────────────────────
│ ${job.company} — ${job.title}
│ Score: ${result.score}/10  |  ${result.role_type}  |  ${result.seniority}  |  ${result.engagement_type ?? "unknown"}
│ Location fit: ${result.location_fit}  |  Remote: ${result.is_remote}  |  Posted: ${formatDate(job.publishedAt)}
│ Salary: ${result.salary_mentions ?? "not stated"} (meets threshold: ${result.salary_meets_threshold ?? "unknown"})
│ Stack: ${result.stack_match.join(", ") || "none matched"}
│ Reason: ${result.reason}
│
│ ${job.url}
└──────────────────────────────────────────────────────────────────────`);
  }
}

// ---------------------------------------------------------------------------
// Pipeline
// ---------------------------------------------------------------------------

/** Run all scrapers and return merged results. */
async function fetchAllJobs(): Promise<Job[]> {
  const allJobs: Job[] = [];
  for (const scraper of scrapers) {
    try {
      const jobs = await scraper.scrape();
      allJobs.push(...jobs);
    } catch (err) {
      console.error(
        `   ⚠ ${scraper.name} failed: ${err instanceof Error ? err.message : err}`,
      );
    }
  }
  return allJobs;
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  banner();

  mkdirSync(dirname(config.dbPath), { recursive: true });

  // 1. Scrape all sources
  const allJobs = await fetchAllJobs();

  // 2. Deduplicate against SQLite
  const db = openDb();
  try {
    const seenIds = getSeenIds(db);
    const newJobs = filterNew(allJobs, seenIds);

    console.log(`   Already seen: ${seenIds.size} | New: ${newJobs.length}\n`);

    if (newJobs.length === 0) {
      console.log("📭 No new jobs to evaluate.\n");
      return;
    }

    // 3. Pre-filter: skip obvious non-matches in code (saves GLM calls)
    const candidates: typeof newJobs = [];
    const rejected: { job: (typeof newJobs)[number]; reason: string }[] = [];

    for (const job of newJobs) {
      const filterResult = preFilter(job);
      if (filterResult.pass) {
        candidates.push(job);
      } else {
        rejected.push({ job, reason: filterResult.reason });
      }
    }

    // Record pre-filtered jobs immediately so they're skipped on resume
    for (const { job } of rejected) {
      recordJob(db, job, 0, false);
    }

    if (rejected.length > 0) {
      console.log(`   🚫 Pre-filtered out ${rejected.length} jobs:`);
      for (const { job, reason } of rejected) {
        console.log(`      — ${job.company}: ${job.title} (${reason})`);
      }
      console.log();
    }

    if (candidates.length === 0) {
      console.log("📭 No candidates after pre-filtering.\n");
      return;
    }

    // 4. Score remaining candidates with GLM (each job recorded to SQLite immediately)
    console.log(`🤖 Scoring ${candidates.length} candidates via GLM...\n`);
    const accepted = await scoreAll(candidates, config.scoreThreshold, db);

    printAccepted(accepted);

    console.log(
      `\n📊 Summary: ${allJobs.length} fetched → ${newJobs.length} new → ` +
        `${rejected.length} pre-filtered → ${candidates.length} scored → ${accepted.length} accepted\n`,
    );
  } finally {
    closeDb();
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
