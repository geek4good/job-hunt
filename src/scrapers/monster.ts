// src/scrapers/monster.ts — Monster partner API stub
//
// Requires a partner key from https://partner.monster.com/job-search
// Set MONSTER_PARTNER_KEY in the environment.
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const monster: Scraper = {
  name: "Monster",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[Monster] Requires a partner key from https://partner.monster.com/job-search — " +
      "set MONSTER_PARTNER_KEY env var and implement the API call in this file.",
    );
  },
};
