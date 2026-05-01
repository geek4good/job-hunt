// src/scrapers/careerjet.ts — Careerjet partner API stub
//
// Requires a free API key from https://www.careerjet.com/partners/api
// Set CAREERJET_API_KEY in the environment to enable.
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const careerjet: Scraper = {
  name: "Careerjet",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[Careerjet] Requires a free API key from https://www.careerjet.com/partners/api — " +
      "set CAREERJET_API_KEY env var and implement the fetch call in this file.",
    );
  },
};
