// src/scrapers/remoteok.ts — RemoteOK JSON API scraper

import type { Job, Scraper } from "../types";
import { UA, hashUrl, truncate, safeDate } from "./helpers";

const API_URL = "https://remoteok.com/api";

export const remoteok: Scraper = {
  name: "RemoteOK",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${API_URL}`);

    const response = await fetch(API_URL, { headers: UA });
    if (!response.ok) {
      throw new Error(`[${this.name}] fetch failed: ${response.status} ${response.statusText}`);
    }

    const raw = await response.json() as unknown[];
    // First element is a legal/metadata object, skip it
    const items = raw.slice(1) as Record<string, unknown>[];

    const jobs: Job[] = items
      .filter((item) => item.url && item.position)
      .map((item) => {
        const url = String(item.url ?? "");
        const description = truncate(String(item.description ?? ""));
        // date is Unix epoch as number or string
        let publishedAt: string;
        const epoch = Number(item.date);
        if (!isNaN(epoch) && epoch > 0) {
          publishedAt = new Date(epoch * 1000).toISOString();
        } else {
          publishedAt = safeDate(item.date);
        }

        return {
          id: hashUrl(url),
          title: String(item.position ?? "Untitled"),
          url,
          company: String(item.company ?? "Unknown"),
          description,
          publishedAt,
          source: "remoteok",
          region: String(item.location ?? ""),
          category: Array.isArray(item.tags)
            ? (item.tags as string[]).join(", ")
            : String(item.tags ?? ""),
        };
      });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
