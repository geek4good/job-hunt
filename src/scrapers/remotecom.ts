// src/scrapers/remotecom.ts — Remote.com HR platform stub
// HR/payroll platform — not a public job board.
import type { Job, Scraper } from "../types";
export const remotecom: Scraper = {
  name: "Remote.com",
  async scrape(): Promise<Job[]> {
    throw new Error("[Remote.com] HR/payroll platform — job board is for companies using Remote as their employer of record. No public feed. See doc/scraper-failures.md.");
  },
};
