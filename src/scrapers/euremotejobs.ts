// src/scrapers/euremotejobs.ts — EU Remote Jobs (WordPress job listings RSS)
//
// Uses the WP Job Manager RSS feed at /job-listings/feed/
// Note: company field is not in RSS — extracted heuristically from description.

import { XMLParser } from "fast-xml-parser";
import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

const FEED_URL = "https://euremotejobs.com/job-listings/feed/";

/** Try to extract company name from job description. */
function extractCompany(text: string): string {
  // Pattern: "At Company," or "At Company." or "At Company is"
  const m1 = text.match(/\bAt\s+([A-Z][A-Za-z0-9 &.,'-]{1,50}?)[,.](?:\s|$)/);
  if (m1) return m1[1].trim();
  // Pattern: "Company is hiring" or "Company is looking"
  const m2 = text.match(/^([A-Z][A-Za-z0-9 &.,'-]{1,50}?)\s+is\s+(?:hiring|looking|seeking)/m);
  if (m2) return m2[1].trim();
  return "Unknown";
}

export const euremotejobs: Scraper = {
  name: "EU Remote Jobs",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${FEED_URL}`);

    const response = await fetch(FEED_URL, { headers: UA });
    if (!response.ok) {
      throw new Error(`[${this.name}] fetch failed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    const parser = new XMLParser({
      ignoreAttributes: false,
      attributeNamePrefix: "@_",
      cdataPropName: "__cdata",
    });

    const parsed = parser.parse(xml);
    const channel = parsed.rss?.channel;
    if (!channel) throw new Error(`[${this.name}] no <channel> in feed`);

    const items: unknown[] = Array.isArray(channel.item)
      ? channel.item
      : [channel.item].filter(Boolean);

    const jobs: Job[] = items.map((raw: unknown) => {
      const item = raw as Record<string, unknown>;
      const url = String(item.link ?? item.guid ?? "");
      // Use content:encoded if available, fall back to description
      const htmlDesc = String(
        (item["content:encoded"] as Record<string, unknown>)?.__cdata ??
        item["content:encoded"] ??
        (item.description as Record<string, unknown>)?.__cdata ??
        item.description ??
        ""
      );
      const plainText = stripHtml(htmlDesc);
      const company = extractCompany(plainText);
      const title = String(
        (item.title as Record<string, unknown>)?.__cdata ?? item.title ?? "Untitled"
      );

      return {
        id: hashUrl(url),
        title,
        url,
        company,
        description: truncate(plainText),
        publishedAt: safeDate(item.pubDate),
        source: "euremotejobs",
        region: "EMEA",
        category: "",
      };
    });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
