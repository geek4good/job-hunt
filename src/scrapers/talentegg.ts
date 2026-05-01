// src/scrapers/talentegg.ts — TalentEgg Canadian student board stub
// Canada students/early-career only. Not remote-focused. No public API/RSS.
import type { Job, Scraper } from "../types";
export const talentegg: Scraper = {
  name: "TalentEgg",
  async scrape(): Promise<Job[]> {
    throw new Error("[TalentEgg] Canada students/grads only. Not remote-focused. No public API. See doc/scraper-failures.md.");
  },
};
