// src/scrapers/linkedin.ts — LinkedIn Jobs scraper stub
//
// LinkedIn returns HTTP 999 for non-browser clients and requires login
// for job detail pages. Cannot be scraped without authenticated sessions.
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const linkedin: Scraper = {
  name: "LinkedIn",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[LinkedIn] Aggressive anti-bot (HTTP 999) and requires authenticated login. " +
      "Cannot be scraped programmatically. See doc/scraper-failures.md.",
    );
  },
};
