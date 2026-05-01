// src/scrapers/wwr.ts — We Work Remotely RSS scraper

import { XMLParser } from "fast-xml-parser";
import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml } from "./helpers";

const FEED_URL =
  "https://weworkremotely.com/categories/remote-programming-jobs.rss";

function parseTitle(raw: string): { company: string; title: string } {
  const idx = raw.indexOf(":");
  if (idx === -1) return { company: "Unknown", title: raw };
  return {
    company: raw.slice(0, idx).trim(),
    title: raw.slice(idx + 1).trim(),
  };
}

export const wwr: Scraper = {
  name: "We Work Remotely",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${FEED_URL}`);

    const response = await fetch(FEED_URL, { headers: UA });

    if (!response.ok) {
      throw new Error(
        `[${this.name}] fetch failed: ${response.status} ${response.statusText}`,
      );
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
    });

    const parsed = parser.parse(xml);
    const channel = parsed.rss?.channel;
    if (!channel) throw new Error(`[${this.name}] no <channel> in feed`);

    // XML parser returns a single object for one-item arrays
    const items: unknown[] = Array.isArray(channel.item)
      ? channel.item
      : [channel.item].filter(Boolean);

    const jobs: Job[] = items.map((raw: unknown) => {
      const item = raw as Record<string, unknown>;
      const rawTitle = String(item.title ?? "Untitled");
      const url = String(item.link ?? "");
      const { company, title } = parseTitle(rawTitle);
      const description = stripHtml(String(item.description ?? ""));

      // Truncate to ~4000 chars — most signal is in the first half.
      const truncated =
        description.length > 4000
          ? description.slice(0, 4000) + "\n[...truncated]"
          : description;

      return {
        id: hashUrl(url),
        title,
        url,
        company,
        description: truncated,
        publishedAt: String(item.pubDate ?? new Date().toISOString()),
        source: "wwr",
        region: String(item.region ?? ""),
        category: String(item.category ?? ""),
      };
    });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
