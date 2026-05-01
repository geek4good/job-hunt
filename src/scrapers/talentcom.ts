// src/scrapers/talentcom.ts — Talent.com generalist aggregator stub
// Global job aggregator. XML feed is for employers only. No job seeker API.
import type { Job, Scraper } from "../types";
export const talentcom: Scraper = {
  name: "Talent.com",
  async scrape(): Promise<Job[]> {
    throw new Error("[Talent.com] Generalist aggregator; XML feed for employers only. No public job seeker API. See doc/scraper-failures.md.");
  },
};
