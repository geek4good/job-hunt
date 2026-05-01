// src/scrapers/jobicy.ts — Jobicy JSON API scraper

import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

const API_URL = "https://jobicy.com/api/v2/remote-jobs";

interface JobicyJob {
  id: number;
  jobSlug: string;
  jobTitle: string;
  jobExcerpt: string;
  jobDescription: string;
  url: string;
  companyName: string;
  companyLogo: string;
  jobGeo: string;
  jobIndustry: string;
  pubDate: string;
  annualSalaryMin?: number;
  annualSalaryMax?: number;
  salaryCurrency?: string;
}

interface JobicyResponse {
  jobs: JobicyJob[];
}

export const jobicy: Scraper = {
  name: "Jobicy",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${API_URL}`);

    const response = await fetch(API_URL, { headers: UA });
    if (!response.ok) {
      throw new Error(`[${this.name}] fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as JobicyResponse;
    const items = data.jobs ?? [];

    const jobs: Job[] = items.map((item) => {
      const url = item.url ?? `https://jobicy.com/jobs/${item.jobSlug}`;
      const descHtml = item.jobDescription ?? item.jobExcerpt ?? "";
      return {
        id: hashUrl(url),
        title: item.jobTitle ?? "Untitled",
        url,
        company: item.companyName ?? "Unknown",
        description: truncate(stripHtml(descHtml)),
        publishedAt: safeDate(item.pubDate),
        source: "jobicy",
        region: item.jobGeo ?? "",
        category: Array.isArray(item.jobIndustry)
          ? (item.jobIndustry as string[]).join(", ")
          : String(item.jobIndustry ?? ""),
      };
    });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
