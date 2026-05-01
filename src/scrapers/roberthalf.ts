// src/scrapers/roberthalf.ts — Robert Half staffing firm stub
// Requires login/scraping behind anti-bot. Not remote-focused.
import type { Job, Scraper } from "../types";
export const roberthalf: Scraper = {
  name: "Robert Half",
  async scrape(): Promise<Job[]> {
    throw new Error("[Robert Half] Staffing firm placements; no public API/RSS. Not remote-focused. See doc/scraper-failures.md.");
  },
};
