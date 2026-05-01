// src/scrapers/jobbank.ts — Job Bank Canada (Government) RSS scraper
//
// Canada-only government job board. Not remote-focused.
// Uses RSS feeds from search results.

import { XMLParser } from "fast-xml-parser";
import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

const FEED_URL = "https://www.jobbank.gc.ca/rss/jobsearch.rss?searchstring=software+developer&fldjob=&fldloc=&fldlang=en&fldjob=&fldtype=6";

export const jobbank: Scraper = {
  name: "Job Bank Canada",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${FEED_URL}`);

    const response = await fetch(FEED_URL, { headers: UA });
    if (!response.ok) {
      throw new Error(`[${this.name}] fetch failed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: "__cdata" });
    const parsed = parser.parse(xml);
    const channel = parsed.rss?.channel;
    if (!channel) throw new Error(`[${this.name}] no <channel> in RSS`);

    const items: unknown[] = Array.isArray(channel.item)
      ? channel.item
      : [channel.item].filter(Boolean);

    const jobs: Job[] = items.map((raw: unknown) => {
      const item = raw as Record<string, unknown>;
      const url = String(item.link ?? "");
      const desc = String(
        (item.description as Record<string, unknown>)?.__cdata ?? item.description ?? ""
      );

      return {
        id: hashUrl(url),
        title: String(
          (item.title as Record<string, unknown>)?.__cdata ?? item.title ?? "Untitled"
        ),
        url,
        company: "Government of Canada / Employer",
        description: truncate(stripHtml(desc)),
        publishedAt: safeDate(item.pubDate),
        source: "jobbank",
        region: "Canada",
        category: "",
      };
    });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
