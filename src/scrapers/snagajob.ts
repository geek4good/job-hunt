// src/scrapers/snagajob.ts — Snagajob US hourly jobs stub
// US hourly/part-time marketplace. Not remote-focused. No public API.
import type { Job, Scraper } from "../types";
export const snagajob: Scraper = {
  name: "Snagajob",
  async scrape(): Promise<Job[]> {
    throw new Error("[Snagajob] US hourly/part-time marketplace. Not remote-focused. No public API. See doc/scraper-failures.md.");
  },
};
