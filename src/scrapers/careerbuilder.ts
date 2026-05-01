// src/scrapers/careerbuilder.ts — CareerBuilder scraper stub
//
// CareerBuilder employs anti-bot measures. No public job seeker API/RSS.
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const careerbuilder: Scraper = {
  name: "CareerBuilder",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[CareerBuilder] Anti-bot measures block programmatic access. " +
      "No public job seeker API available. See doc/scraper-failures.md.",
    );
  },
};
