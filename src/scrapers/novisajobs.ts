// src/scrapers/novisajobs.ts — No Visa Jobs scraper
//
// Site is currently in hiatus / rebuilding (returns a 1.9KB empty SPA shell).
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const novisajobs: Scraper = {
  name: "No Visa Jobs",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[No Visa Jobs] Site is currently in hiatus/rebuilding — returns an empty SPA with no content. " +
      "See doc/scraper-failures.md for details.",
    );
  },
};
