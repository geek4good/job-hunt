// src/scrapers/workingnomads.ts — Working Nomads JSON API scraper

import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

const API_URL = "https://www.workingnomads.co/api/exposed_jobs/";

interface WorkingNomadsJob {
  url: string;
  title: string;
  description: string;
  company_name: string;
  category_name: string;
  tags: string;
  location: string;
  pub_date: string;
}

export const workingnomads: Scraper = {
  name: "Working Nomads",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${API_URL}`);

    const response = await fetch(API_URL, { headers: UA });
    if (!response.ok) {
      throw new Error(`[${this.name}] fetch failed: ${response.status} ${response.statusText}`);
    }

    const items = await response.json() as WorkingNomadsJob[];

    const jobs: Job[] = items.map((item) => ({
      id: hashUrl(item.url),
      title: item.title ?? "Untitled",
      url: item.url,
      company: item.company_name ?? "Unknown",
      description: truncate(stripHtml(item.description ?? "")),
      publishedAt: safeDate(item.pub_date),
      source: "workingnomads",
      region: item.location ?? "",
      category: item.category_name ?? "",
    }));

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
