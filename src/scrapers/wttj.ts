// src/scrapers/wttj.ts — Welcome to the Jungle partner API stub
//
// Requires an auth token from https://developers.welcomekit.co/
// (request via the form on that page).
// Set WTTJ_API_TOKEN in the environment to enable.
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const wttj: Scraper = {
  name: "Welcome to the Jungle",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[Welcome to the Jungle] Requires an API token from https://developers.welcomekit.co/ — " +
      "set WTTJ_API_TOKEN env var and implement the fetch call in this file.",
    );
  },
};
