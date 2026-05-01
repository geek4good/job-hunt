// src/types.ts — Shared type definitions for the job-hunt agent

/** A normalized job extracted from any source. */
export interface Job {
  /** Deterministic hash of the URL (used as primary key). */
  id: string;
  /** Job title (source-specific cleanup applied). */
  title: string;
  /** Direct link to the job listing. */
  url: string;
  /** Company name. */
  company: string;
  /** Plain-text job description (HTML stripped). */
  description: string;
  /** ISO 8601 publication date. */
  publishedAt: string;
  /** Source identifier, e.g. "wwr". */
  source: string;
  /** Region string from the source (e.g. "Anywhere in the World"). */
  region: string;
  /** Category from the source (e.g. "Full-Stack Programming"). */
  category: string;
}

/**
 * A self-contained job source.
 *
 * Each scraper owns its base URL, fetch logic, and normalisation.
 * Drop a new file in src/scrapers/, implement this interface, and
 * add it to the scrapers array in main.ts — nothing else changes.
 */
export interface Scraper {
  /** Human-readable name for logging, e.g. "We Work Remotely". */
  readonly name: string;
  /** Fetch and return normalised jobs from this source. */
  scrape(): Promise<Job[]>;
}

/** Structured scoring response from Ollama. */
export interface ScoreResult {
  /** 0-10 overall fit score. */
  score: number;
  /** Whether the role is fully remote. */
  is_remote: boolean;
  /** Whether the role is pure front-end (negative signal). */
  is_frontend_only: boolean;
  /** How the location fits: "thailand" | "spain" | "other" | "anywhere" | "unknown". */
  location_fit: string;
  /** Any salary info found in the listing, or null. */
  salary_mentions: string | null;
  /** Whether salary appears to meet the $75k threshold. null if unknown. */
  salary_meets_threshold: boolean | null;
  /** Detected role type. */
  role_type:
    | "backend"
    | "frontend"
    | "fullstack"
    | "devops"
    | "management"
    | "other";
  /** Detected engagement type. */
  engagement_type:
    | "fulltime"
    | "freelance"
    | "contract"
    | "parttime"
    | "unknown";
  /** Technologies from the listing that match the candidate's stack. */
  stack_match: string[];
  /** Detected seniority level. */
  seniority: "junior" | "mid" | "senior" | "lead" | "unknown";
  /** Brief human-readable explanation of the score. */
  reason: string;
  /** Final recommendation (true only if score >= threshold AND hard filters pass). */
  recommend: boolean;
}

/** A job that passed scoring with its score attached. */
export interface ScoredJob extends Job {
  scoreResult: ScoreResult;
}
