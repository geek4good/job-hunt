// src/scrapers/truelancer.ts — Truelancer freelance marketplace scraper
//
// Next.js SPA (data not in initial render) — requires Lightpanda.
// Note: Truelancer is a freelance marketplace, not a full-time job board.
// Without a browser, returns 0 jobs.

import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate, extractJsonLd, looksLikeJobListings } from "./helpers";
import { hasBrowser, fetchWithBrowser } from "./browser";

const URL = "https://www.truelancer.com/freelance-web-developer-jobs";

function parseJobsFromHtml(html: string): Job[] {
  const jobs: Job[] = [];
  for (const item of extractJsonLd(html)) {
    const d = item as Record<string, unknown>;
    if (d["@type"] !== "JobPosting") continue;
    const url = String(d.url ?? "");
    if (!url) continue;
    const org = d.hiringOrganization as Record<string, unknown> | undefined;
    jobs.push({
      id: hashUrl(url),
      title: String(d.title ?? "Untitled"),
      url,
      company: String(org?.name ?? "Unknown"),
      description: truncate(stripHtml(String(d.description ?? ""))),
      publishedAt: safeDate(d.datePosted),
      source: "truelancer",
      region: "",
      category: "Freelance",
    });
  }
  return jobs;
}

export const truelancer: Scraper = {
  name: "Truelancer",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Fetching: ${URL}`);

    let html = await fetch(URL, { headers: UA }).then((r) => r.text()).catch(() => "");
    if (!looksLikeJobListings(html) && hasBrowser) {
      console.log(`   [${this.name}] SPA detected, retrying with Lightpanda...`);
      html = (await fetchWithBrowser(URL)) ?? html;
    }

    if (!looksLikeJobListings(html)) {
      console.log(`   [${this.name}] No job data — set LPD_TOKEN (Lightpanda) to enable.`);
      return [];
    }

    const jobs = parseJobsFromHtml(html);
    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
