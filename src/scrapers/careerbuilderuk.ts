// src/scrapers/careerbuilderuk.ts — CareerBuilder UK stub
// UK generalist job board. Not remote-focused. No public API/RSS.
import type { Job, Scraper } from "../types";
export const careerbuilderuk: Scraper = {
  name: "CareerBuilder UK",
  async scrape(): Promise<Job[]> {
    throw new Error("[CareerBuilder UK] UK generalist job board. Not remote-focused. No public API. See doc/scraper-failures.md.");
  },
};
