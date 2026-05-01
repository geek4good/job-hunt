// src/scrapers/indeed.ts — Indeed GraphQL API stub
//
// Requires a publisher account from https://opensource.indeedeng.io/api-documentation/
// Set INDEED_PUBLISHER_ID in the environment.
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const indeed: Scraper = {
  name: "Indeed",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[Indeed] Requires a publisher account from https://opensource.indeedeng.io/api-documentation/ — " +
      "set INDEED_PUBLISHER_ID env var and implement the GraphQL call in this file.",
    );
  },
};
