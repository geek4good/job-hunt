// src/scrapers/remotive.ts — Remotive JSON API scraper

import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

const API_URL = "https://remotive.com/api/remote-jobs";

interface RemotiveJob {
  id: number;
  url: string;
  title: string;
  company_name: string;
  description: string;
  publication_date: string;
  candidate_required_location: string;
  category: string;
  tags: string[];
  job_type: string;
}

interface RemotiveResponse {
  "job-count": number;
  jobs: RemotiveJob[];
}

export const remotive: Scraper = {
  name: "Remotive",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${API_URL}`);

    const response = await fetch(API_URL, { headers: UA });
    if (!response.ok) {
      throw new Error(`[${this.name}] fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as RemotiveResponse;
    const items = data.jobs ?? [];

    const jobs: Job[] = items.map((item) => ({
      id: hashUrl(item.url),
      title: item.title ?? "Untitled",
      url: item.url,
      company: item.company_name ?? "Unknown",
      description: truncate(stripHtml(item.description ?? "")),
      publishedAt: safeDate(item.publication_date),
      source: "remotive",
      region: item.candidate_required_location ?? "",
      category: item.category ?? "",
    }));

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
