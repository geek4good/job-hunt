// src/dedup.ts — SQLite-backed deduplication using bun:sqlite

import { Database } from "bun:sqlite";
import { config } from "./config";
import type { Job } from "./types";

let db: Database;

/** Open (or create) the SQLite database and ensure the schema exists. */
export function openDb(): Database {
  db = new Database(config.dbPath, { create: true });
  db.exec("PRAGMA journal_mode = WAL");
  db.exec("PRAGMA strict_mode = ON");

  db.exec(`
    CREATE TABLE IF NOT EXISTS seen_jobs (
      id          TEXT PRIMARY KEY,
      url         TEXT NOT NULL,
      title       TEXT NOT NULL,
      company     TEXT NOT NULL,
      score       INTEGER,
      recommended INTEGER DEFAULT 0,
      first_seen  TEXT NOT NULL DEFAULT (datetime('now')),
      status      TEXT NOT NULL DEFAULT 'new'
        CHECK (status IN ('new', 'accepted', 'rejected'))
    )
  `);

  return db;
}

/** Return job IDs that we have already processed. */
export function getSeenIds(db: Database): Set<string> {
  const rows = db.query("SELECT id FROM seen_jobs").all() as { id: string }[];
  return new Set(rows.map((r) => r.id));
}

/** Filter a list of jobs, keeping only those never seen before. */
export function filterNew(jobs: Job[], seenIds: Set<string>): Job[] {
  return jobs.filter((job) => !seenIds.has(job.id));
}

/** Mark a job as processed with its score and recommendation. */
export function recordJob(
  db: Database,
  job: Job,
  score: number,
  recommended: boolean,
): void {
  db.query(
    `INSERT OR IGNORE INTO seen_jobs (id, url, title, company, score, recommended, status)
     VALUES (?, ?, ?, ?, ?, ?, ?)`,
  ).run(
    job.id,
    job.url,
    job.title,
    job.company,
    score,
    recommended ? 1 : 0,
    recommended ? "accepted" : "rejected",
  );
}

/** Close the database connection. */
export function closeDb(): void {
  db?.close();
}
