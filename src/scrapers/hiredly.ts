// src/scrapers/hiredly.ts — Hiredly Malaysia job board stub
// Malaysia-focused. Not remote-focused. No public API/RSS.
import type { Job, Scraper } from "../types";
export const hiredly: Scraper = {
  name: "Hiredly",
  async scrape(): Promise<Job[]> {
    throw new Error("[Hiredly] Malaysia-focused job board. Not remote-focused. No public API. See doc/scraper-failures.md.");
  },
};
