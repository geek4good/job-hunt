// src/scrapers/jooblefr.ts — Jooble France job aggregator stub
// French job search aggregator (meta-search). Not remote-focused.
import type { Job, Scraper } from "../types";
export const jooblefr: Scraper = {
  name: "Jooble France",
  async scrape(): Promise<Job[]> {
    throw new Error("[Jooble France] French job aggregator (meta-search). Not remote-focused. No public API. See doc/scraper-failures.md.");
  },
};
