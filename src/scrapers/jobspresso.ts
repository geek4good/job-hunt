// src/scrapers/jobspresso.ts — Jobspresso WP Job Manager RSS scraper
//
// Uses the WordPress job_listing post type feed (with content:encoded).
// Company is in dc:creator as "Company<br>⚲&nbsp;Location".

import { XMLParser } from "fast-xml-parser";
import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

const FEED_BASE = "https://jobspresso.co/?post_type=job_listing&feed=rss2";
const MAX_PAGES = 3;

function extractCompanyFromCreator(raw: string): string {
  // Format: "Company<br>⚲&nbsp;Location" or just "Company"
  const clean = raw.replace(/<br\s*\/?>/gi, "|").replace(/<[^>]+>/g, "");
  return clean.split("|")[0]?.trim() ?? "Unknown";
}

async function fetchPage(page: number): Promise<unknown[]> {
  const url = page === 1 ? FEED_BASE : `${FEED_BASE}&paged=${page}`;
  const res = await fetch(url, { headers: UA });
  if (!res.ok) throw new Error(`fetch failed: ${res.status}`);
  const xml = await res.text();
  const parser = new XMLParser({
    ignoreAttributes: false,
    attributeNamePrefix: "@_",
    cdataPropName: "__cdata",
  });
  const parsed = parser.parse(xml);
  const items = parsed.rss?.channel?.item;
  if (!items) return [];
  return Array.isArray(items) ? items : [items];
}

export const jobspresso: Scraper = {
  name: "Jobspresso",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching RSS (up to ${MAX_PAGES} pages)...`);

    const allItems: unknown[] = [];
    for (let page = 1; page <= MAX_PAGES; page++) {
      const items = await fetchPage(page);
      if (items.length === 0) break;
      allItems.push(...items);
    }

    const jobs: Job[] = allItems.map((raw: unknown) => {
      const item = raw as Record<string, unknown>;
      const url = String(item.link ?? "");
      const creatorRaw = String(
        (item["dc:creator"] as Record<string, unknown>)?.__cdata ??
        item["dc:creator"] ??
        ""
      );
      const company = extractCompanyFromCreator(creatorRaw);
      const htmlDesc = String(
        (item["content:encoded"] as Record<string, unknown>)?.__cdata ??
        item["content:encoded"] ??
        (item.description as Record<string, unknown>)?.__cdata ??
        item.description ??
        ""
      );
      const titleRaw = String(
        (item.title as Record<string, unknown>)?.__cdata ?? item.title ?? "Untitled"
      );

      return {
        id: hashUrl(url),
        title: titleRaw,
        url,
        company,
        description: truncate(stripHtml(htmlDesc)),
        publishedAt: safeDate(item.pubDate),
        source: "jobspresso",
        region: "Worldwide",
        category: "",
      };
    });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
