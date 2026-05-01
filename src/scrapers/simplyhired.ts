// src/scrapers/simplyhired.ts — SimplyHired scraper stub
//
// SimplyHired employs anti-bot measures (CAPTCHA, bot detection).
// No public API available. See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const simplyhired: Scraper = {
  name: "SimplyHired",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[SimplyHired] Anti-bot measures (CAPTCHA/bot detection) block programmatic access. " +
      "No public API available. See doc/scraper-failures.md.",
    );
  },
};
