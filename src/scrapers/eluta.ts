// src/scrapers/eluta.ts — Eluta.ca Canadian job search engine scraper
//
// Has an XML API for publishers. Canada-only, not remote-focused.

import { XMLParser } from "fast-xml-parser";
import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate } from "./helpers";

const API_URL = "https://www.eluta.ca/elutaxml?q=software+developer+remote";

export const eluta: Scraper = {
  name: "Eluta.ca",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${API_URL}`);

    const response = await fetch(API_URL, { headers: UA });
    if (!response.ok) {
      throw new Error(`[${this.name}] fetch failed: ${response.status} ${response.statusText}`);
    }

    const xml = await response.text();
    if (!xml.trim().startsWith("<?xml") && !xml.includes("<job")) {
      throw new Error(`[${this.name}] unexpected response — API may require registration`);
    }

    const parser = new XMLParser({ ignoreAttributes: false, cdataPropName: "__cdata" });
    const parsed = parser.parse(xml);
    const jobs_raw = parsed?.jobs?.job ?? parsed?.job ?? [];
    const items = Array.isArray(jobs_raw) ? jobs_raw : [jobs_raw];

    const jobs: Job[] = items.filter(Boolean).map((item: Record<string, unknown>) => {
      const url = String(item.url ?? item.link ?? "");
      return {
        id: hashUrl(url),
        title: String(item.title ?? "Untitled"),
        url,
        company: String(item.company ?? "Unknown"),
        description: truncate(stripHtml(String(item.description ?? ""))),
        publishedAt: safeDate(item.date ?? item.pubDate),
        source: "eluta",
        region: "Canada",
        category: String(item.category ?? ""),
      };
    });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
