// src/scrapers/worldteams.ts — WorldTeams LATAM→US outsourcing stub
// LATAM → US outsourcing model; no public API/RSS.
import type { Job, Scraper } from "../types";
export const worldteams: Scraper = {
  name: "WorldTeams",
  async scrape(): Promise<Job[]> {
    throw new Error("[WorldTeams] LATAM→US outsourcing model. No public API/RSS. See doc/scraper-failures.md.");
  },
};
