// src/scrapers/helpers.ts — shared utilities for all scrapers

export const UA = { "User-Agent": "job-hunt-agent/1.0" };

export function hashUrl(url: string): string {
  const hasher = new Bun.CryptoHasher("sha256");
  hasher.update(url);
  return hasher.digest("hex").slice(0, 16);
}

export function stripHtml(html: string): string {
  return html
    .replace(/<br\s*\/?>/gi, "\n")
    .replace(/<\/p>/gi, "\n")
    .replace(/<\/li>/gi, "\n")
    .replace(/<[^>]+>/g, "")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&nbsp;/g, " ")
    .replace(/&#39;/g, "'")
    .replace(/&quot;/g, '"')
    .replace(/&#x([0-9a-fA-F]+);/g, (_, hex) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#([0-9]+);/g, (_, dec) => String.fromCodePoint(parseInt(dec, 10)))
    .replace(/\n{3,}/g, "\n\n")
    .trim();
}

export function truncate(text: string, max = 4000): string {
  return text.length > max ? text.slice(0, max) + "\n[...truncated]" : text;
}

export function safeDate(raw: unknown): string {
  if (!raw) return new Date().toISOString();
  const d = new Date(String(raw));
  return isNaN(d.getTime()) ? new Date().toISOString() : d.toISOString();
}

/** Rough check: does the HTML look like it contains job listings? */
export function looksLikeJobListings(html: string): boolean {
  const lower = html.toLowerCase();
  let hits = 0;
  if (lower.includes("apply")) hits++;
  if (lower.includes("remote")) hits++;
  if (lower.includes("full-time") || lower.includes("fulltime")) hits++;
  if (lower.includes("salary") || lower.includes("compensation")) hits++;
  if (lower.includes("job title") || lower.includes("jobtitle")) hits++;
  return hits >= 2;
}

/** Extract JSON-LD job postings from HTML. Returns array of parsed objects. */
export function extractJsonLd(html: string): unknown[] {
  const results: unknown[] = [];
  const re = /<script[^>]*type=["']application\/ld\+json["'][^>]*>([\s\S]*?)<\/script>/gi;
  let m: RegExpExecArray | null;
  while ((m = re.exec(html)) !== null) {
    try {
      const parsed = JSON.parse(m[1]);
      if (Array.isArray(parsed)) {
        results.push(...parsed);
      } else {
        results.push(parsed);
      }
    } catch {
      // skip malformed JSON-LD
    }
  }
  return results;
}

/** Extract Next.js __NEXT_DATA__ blob from HTML, or null. */
export function extractNextData(html: string): unknown | null {
  const m = html.match(/<script id="__NEXT_DATA__"[^>]*>([\s\S]*?)<\/script>/);
  if (!m) return null;
  try {
    return JSON.parse(m[1]);
  } catch {
    return null;
  }
}
