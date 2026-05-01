// src/scrapers/kijiji.ts — Kijiji Canadian classifieds stub
// Canadian classifieds. Not remote-focused. No public API for jobs.
import type { Job, Scraper } from "../types";
export const kijiji: Scraper = {
  name: "Kijiji",
  async scrape(): Promise<Job[]> {
    throw new Error("[Kijiji] Canadian classifieds. Not remote-focused. No public API. See doc/scraper-failures.md.");
  },
};
