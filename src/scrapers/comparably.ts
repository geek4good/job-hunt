// src/scrapers/comparably.ts — Comparably employer branding platform stub
// Match-based platform, not a browseable job board. No public API/RSS.
import type { Job, Scraper } from "../types";
export const comparably: Scraper = {
  name: "Comparably",
  async scrape(): Promise<Job[]> {
    throw new Error("[Comparably] Match-based platform — no browseable job listing feed. See doc/scraper-failures.md.");
  },
};
