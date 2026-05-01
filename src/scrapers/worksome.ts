// src/scrapers/worksome.ts — Worksome enterprise FMS stub
// Enterprise Freelance Management System — not a job board.
import type { Job, Scraper } from "../types";
export const worksome: Scraper = {
  name: "Worksome",
  async scrape(): Promise<Job[]> {
    throw new Error("[Worksome] Enterprise FMS platform — not a publicly browseable job board. See doc/scraper-failures.md.");
  },
};
