// src/scrapers/glassdoor.ts — Glassdoor partner API stub
//
// Requires a partner ID and API key from https://www.glassdoor.com/developer/
// Set GLASSDOOR_PARTNER_ID and GLASSDOOR_KEY in the environment.
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const glassdoor: Scraper = {
  name: "Glassdoor",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[Glassdoor] Requires partner credentials from https://www.glassdoor.com/developer/ — " +
      "set GLASSDOOR_PARTNER_ID and GLASSDOOR_KEY env vars and implement the API call in this file.",
    );
  },
};
