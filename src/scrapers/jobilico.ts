// src/scrapers/jobilico.ts — Jobilico Canadian job board stub
// Employer-facing API only; not for job seekers. Not remote-focused.
import type { Job, Scraper } from "../types";
export const jobilico: Scraper = {
  name: "Jobilico",
  async scrape(): Promise<Job[]> {
    throw new Error("[Jobilico] Employer-facing API only (not job seeker search). Not remote-focused. See doc/scraper-failures.md.");
  },
};
