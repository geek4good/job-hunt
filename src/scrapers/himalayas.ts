// src/scrapers/himalayas.ts — Himalayas JSON API scraper
//
// NOTE: As of 2026-05-01 the site returned HTTP 404 for all endpoints including
// the root domain. The scraper is implemented against their documented API
// (https://himalayas.app/docs) and will work once they're back online.

import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

const API_URL = "https://himalayas.app/jobs/api";

export const himalayas: Scraper = {
  name: "Himalayas",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${API_URL}`);

    const response = await fetch(API_URL, { headers: UA });
    if (!response.ok) {
      throw new Error(`[${this.name}] fetch failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json() as { jobs?: unknown[] };
    const items = (data.jobs ?? data) as Record<string, unknown>[];
    if (!Array.isArray(items)) {
      throw new Error(`[${this.name}] unexpected response shape`);
    }

    const jobs: Job[] = items.map((item) => {
      const url = String(
        item.applicationUrl ?? item.url ?? item.jobUrl ?? ""
      );
      const description = truncate(
        stripHtml(String(item.description ?? item.jobDescription ?? ""))
      );

      return {
        id: hashUrl(url),
        title: String(item.title ?? item.jobTitle ?? "Untitled"),
        url,
        company: String(
          item.companyName ?? item.company ?? "Unknown"
        ),
        description,
        publishedAt: safeDate(
          item.publishedAt ?? item.pubDate ?? item.createdAt
        ),
        source: "himalayas",
        region: String(item.location ?? item.region ?? item.country ?? ""),
        category: String(item.category ?? item.jobCategory ?? ""),
      };
    });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
