// src/scrapers/jobboom.ts — Jobboom Québec French job board stub
// Québec-only, French-language. Not remote-focused. No public API.
import type { Job, Scraper } from "../types";
export const jobboom: Scraper = {
  name: "Jobboom",
  async scrape(): Promise<Job[]> {
    throw new Error("[Jobboom] Québec-only, French-language. Not remote-focused. No public API. See doc/scraper-failures.md.");
  },
};
