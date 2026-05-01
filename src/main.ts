#!/usr/bin/env bun
// src/main.ts — Orchestrator: scrape → dedup → pre-filter → score → output

import { mkdirSync } from "node:fs";
import { dirname } from "node:path";
import { config } from "./config";
import type { Job, Scraper } from "./types";
import { closeDb, filterNew, getSeenIds, openDb, recordJob } from "./dedup";
import { scoreAll } from "./scorer";
import { preFilter } from "./prefilter";

// ---------------------------------------------------------------------------
// Scrapers — add new sources here
// ---------------------------------------------------------------------------

import { wwr } from "./scrapers/wwr";

/** Each scraper is self-contained. Add a new import + entry to extend. */
const scrapers: Scraper[] = [wwr];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function banner(): void {
  const scraperNames = scrapers.map((s) => s.name).join(", ");
  console.log("\n🔍 job-hunt agent v1.0");
  console.log(`   Scrapers:   ${scraperNames}`);
  console.log(`   Model:      ${config.ollamaModel}`);
  console.log(`   Threshold:  ${config.scoreThreshold}/10`);
  console.log(`   Min salary: $${config.minSalaryUsd.toLocaleString()}/yr\n`);
}

function printAccepted(
  results: {
    job: (typeof results)[number]["job"];
    result: (typeof results)[number]["result"];
  }[],
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
│ Score: ${result.score}/10  |  ${result.role_type}  |  ${result.seniority}
│ Location fit: ${result.location_fit}  |  Remote: ${result.is_remote}
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

    // 3. Pre-filter: skip obvious non-matches in code (saves Ollama calls)
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

    if (rejected.length > 0) {
      console.log(`   🚫 Pre-filtered out ${rejected.length} jobs:`);
      for (const { job, reason } of rejected) {
        console.log(`      — ${job.company}: ${job.title} (${reason})`);
      }
      console.log();
    }

    if (candidates.length === 0) {
      console.log("📭 No candidates after pre-filtering.\n");
      for (const { job } of rejected) {
        recordJob(db, job, 0, false);
      }
      return;
    }

    // 4. Score remaining candidates with Ollama
    console.log(`🤖 Scoring ${candidates.length} candidates via Ollama...\n`);
    const accepted = await scoreAll(candidates, config.scoreThreshold);

    // 5. Record all jobs for dedup
    for (const { job, result } of accepted) {
      recordJob(db, job, result.score, true);
    }
    for (const { job } of rejected) {
      recordJob(db, job, 0, false);
    }
    const acceptedIds = new Set(accepted.map((a) => a.job.id));
    for (const job of candidates) {
      if (!acceptedIds.has(job.id)) {
        recordJob(db, job, 0, false);
      }
    }

    // 6. Print results
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
