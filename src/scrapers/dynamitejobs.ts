// src/scrapers/dynamitejobs.ts — Dynamite Jobs scraper
//
// Vue SPA — requires Lightpanda (set LPD_TOKEN or LPD_CDP_URL) for JS rendering.
// Without a browser, returns 0 jobs.

import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate, safeDate, extractJsonLd, extractNextData, looksLikeJobListings } from "./helpers";
import { hasBrowser, fetchWithBrowser } from "./browser";

const URL = "https://dynamitejobs.com/remote-jobs";

function parseJobsFromHtml(html: string): Job[] {
  const jobs: Job[] = [];

  // Try JSON-LD JobPosting
  const jsonLds = extractJsonLd(html);
  for (const item of jsonLds) {
    const d = item as Record<string, unknown>;
    if (d["@type"] !== "JobPosting") continue;
    const url = String(d.url ?? d.sameAs ?? "");
    if (!url) continue;
    const org = d.hiringOrganization as Record<string, unknown> | undefined;
    jobs.push({
      id: hashUrl(url),
      title: String(d.title ?? "Untitled"),
      url,
      company: String(org?.name ?? "Unknown"),
      description: truncate(stripHtml(String(d.description ?? ""))),
      publishedAt: safeDate(d.datePosted),
      source: "dynamitejobs",
      region: String((d.jobLocation as Record<string, unknown>)?.["@type"] === "Place" ? "" : d.jobLocationType ?? ""),
      category: String(d.occupationalCategory ?? ""),
    });
  }

  // Try __NEXT_DATA__
  if (jobs.length === 0) {
    const nextData = extractNextData(html) as Record<string, unknown> | null;
    if (nextData) {
      // navigate to job listings — structure varies; return empty if not found
    }
  }

  return jobs;
}

export const dynamitejobs: Scraper = {
  name: "Dynamite Jobs",

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
