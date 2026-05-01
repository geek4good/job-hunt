// src/scrapers/hn-whoishiring.ts — Hacker News "Who is Hiring?" scraper
//
// Uses Algolia API to find the latest monthly thread, then fetches all
// top-level comment replies which are individual job posts.

import type { Job, Scraper } from "../types";
import { UA, hashUrl, stripHtml, truncate } from "./helpers";

const ALGOLIA_BASE = "https://hn.algolia.com/api/v1";

interface AlgoliaStoryHit {
  objectID: string;
  title: string;
  created_at: string;
}

interface AlgoliaCommentHit {
  objectID: string;
  comment_text: string;
  author: string;
  created_at: string;
  parent_id: number;
  story_id: number;
}

interface AlgoliaResponse<T> {
  hits: T[];
}

/** Parse the first line of an HN hiring comment for Company and Role. */
function parseFirstLine(text: string): { company: string; title: string } {
  const firstLine = text.split("\n")[0]?.trim() ?? "";
  // Common format: "Company | Role | Location | ..."
  const parts = firstLine.split("|").map((s) => s.trim());
  if (parts.length >= 2 && parts[0] && parts[1]) {
    return { company: parts[0], title: parts[1] };
  }
  // Fallback: use truncated first line as title
  const company = parts[0] || "Unknown";
  const title = firstLine.slice(0, 80) || "Engineering Role";
  return { company, title };
}

export const hnWhoIsHiring: Scraper = {
  name: "HN Who's Hiring",

  async scrape(): Promise<Job[]> {
    console.log(`📡 [${this.name}] Finding latest thread via Algolia...`);

    // Step 1: Find the most recent "Who is Hiring?" thread (sort by date)
    const storyRes = await fetch(
      `${ALGOLIA_BASE}/search_by_date?tags=story,author_whoishiring&hitsPerPage=1`,
      { headers: UA },
    );
    if (!storyRes.ok) {
      throw new Error(`[${this.name}] Algolia story fetch failed: ${storyRes.status}`);
    }

    const storyData = await storyRes.json() as AlgoliaResponse<AlgoliaStoryHit>;
    const thread = storyData.hits[0];
    if (!thread) throw new Error(`[${this.name}] no thread found`);

    const threadId = thread.objectID;
    console.log(`   [${this.name}] Thread: "${thread.title}" (ID: ${threadId})`);

    // Step 2: Fetch all top-level comment replies (job posts)
    const commentRes = await fetch(
      `${ALGOLIA_BASE}/search?tags=comment,story_${threadId}&hitsPerPage=1000`,
      { headers: UA },
    );
    if (!commentRes.ok) {
      throw new Error(`[${this.name}] Algolia comment fetch failed: ${commentRes.status}`);
    }

    const commentData = await commentRes.json() as AlgoliaResponse<AlgoliaCommentHit>;
    const allComments = commentData.hits;

    // Keep only direct replies to the thread (parent_id === threadId)
    const threadIdNum = Number(threadId);
    const topLevel = allComments.filter(
      (c) => c.parent_id === threadIdNum && c.comment_text?.length >= 100,
    );

    const jobs: Job[] = topLevel.map((comment) => {
      const url = `https://news.ycombinator.com/item?id=${comment.objectID}`;
      const rawText = stripHtml(comment.comment_text ?? "");
      const { company, title } = parseFirstLine(rawText);

      return {
        id: hashUrl(url),
        title,
        url,
        company,
        description: truncate(rawText),
        publishedAt: comment.created_at ?? new Date().toISOString(),
        source: "hn-whoishiring",
        region: "",
        category: "",
      };
    });

    console.log(`   [${this.name}] Found ${jobs.length} listings.`);
    return jobs;
  },
};
