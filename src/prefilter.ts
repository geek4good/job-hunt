// src/prefilter.ts — Hard-filter jobs in code before sending to GLM
//
// This saves GLM calls and catches obvious mismatches that smaller
// models might miss (e.g. "Electrical Design Lead" scored as fullstack).

import type { Job } from "./types";

/** Title patterns that clearly indicate a non-engineering role. */
const NON_ENGINEERING_PATTERNS = [
  /\belectri(?:c|cal)\b/i,
  /\bmechanical\b/i,
  /\bsales\b/i,
  /\baccount\s*exec\b/i,
  /\brecruit(?:er|ment)\b/i,
  /\bhr\b/i,
  /\bhuman\s+resources\b/i,
  /\bmarketing\b/i,
  /\bcontent\s+(?:writ|strateg|creat)/i,
  /\bcopywrit/i,
  /\bgraphic\s+design/i,
  /\bux\s+research/i,
  /\bdata\s+entry/i,
  /\bcustomer\s+success\b/i,
  /\bcustomer\s+support\b/i,
  /\btechnical\s+writer\b/i,
  /\blegal\b/i,
  /\bfinance\b/i,
  /\baccounting\b/i,
  /\bcompliance\b/i,
  /\bproduct\s+design/i,
  /\bdesign\s+lead/i,
  /\bux\s+design/i,
  /\bui\s+design/i,
  /\bcontent\s+design/i,
  /\bvisual\s+design/i,
  /\bdevops\b/i,
  /\bphp\s+(?:dev|eng|developer|engineer)/i,
  /\blaravel\s+(?:dev|eng|developer|engineer)/i,
  /\bwordpress\s+(?:dev|eng|developer|engineer)/i,
];

/** Title patterns that indicate pure front-end (not a fit). */
const FRONTEND_ONLY_PATTERNS = [
  /\bfront[\s-]?end\s+(?:dev|eng|engineer|developer)/i,
  /\breact\s+dev/i,
  /\bvue\s+dev/i,
  /\bangular\s+dev/i,
  /\bcss\s+(?:dev|engineer|specialist)/i,
  /\bui\s+dev/i,
  /\bweb\s+design/i,
  /\b(?:html|css)\s+only/i,
  /\bproduct\s+owner\s+frontend/i,
  /\bfrontend\b.*\b(?:only|specialist)\b/i,
];

/**
 * Location restriction patterns that clearly exclude both Thailand and Spain.
 * Checked against title + region + first 500 chars of description.
 * EU/Europe/EMEA/APAC are intentionally NOT listed — Spain is in Europe, Thailand is in APAC.
 */
const LOCATION_EXCLUSION_PATTERNS = [
  // US-only
  /\b(?:us|u\.s\.?|usa|united\s+states?)\s*[-–)]?\s*only\b/i,
  /\bremote\s*[-–(]\s*(?:us|u\.s\.?|usa|united\s+states?)[\s)–-]/i,
  /\bremote\s+in\s+(?:the\s+)?(?:us|u\.s\.?|usa|united\s+states?)\b/i,
  /\bmust\s+(?:be\s+)?(?:located?|resid\w+|based|living?)\s+in\s+(?:the\s+)?(?:us|u\.s\.?|usa|united\s+states?)\b/i,
  /\bauthori[sz]ed\s+to\s+work\s+in\s+(?:the\s+)?(?:us|u\.s\.?|usa|united\s+states?)\b/i,
  // US timezone anchors (implies US-only)
  /\b(?:must\s+(?:be\s+)?(?:available|work)\s+(?:in\s+)?)?(?:et|ct|mt|pt|est|cst|mst|pst)\s+(?:hours?|timezone|time\s*zone)\s+required\b/i,
  // North America / US + Canada
  /\bnorth\s+america[n]?\s+only\b/i,
  /\bremote\s*[-–(]?\s*(?:us|usa?)\s*[&+/]\s*can(?:ada)?\b/i,
  /\bremote\s*[-–(]?\s*can(?:ada)?\s*[&+/]\s*(?:us|usa?)\b/i,
  /\bopen\s+to\s+(?:us|usa?)\s*[&+/]\s*can(?:ada)?\s+(?:residents?|candidates?|applicants?)\b/i,
  // Canada-only
  /\bcanada\s+only\b/i,
  /\bremote\s+in\s+canada\b/i,
  // UK-only
  /\b(?:uk|u\.k\.|united\s+kingdom)\s+only\b/i,
  /\bremote\s+in\s+(?:the\s+)?(?:uk|u\.k\.|united\s+kingdom)\b/i,
  // Australia-only
  /\baustralia[n]?\s+only\b/i,
  /\bremote\s+in\s+australia\b/i,
];

/** Category values from WWR that are not engineering. */
const NON_ENGINEERING_CATEGORIES = [
  "Design",
  "Marketing",
  "Sales",
  "Customer Support",
  "HR",
  "Finance",
  "Legal",
  "Copywriting",
];

/**
 * Pre-filter a job. Returns null if the job should be skipped,
 * or a reason string if it should be kept.
 */
export function preFilter(job: Job): { pass: true } | { pass: false; reason: string } {
  const text = `${job.title} ${job.category}`;

  // 1. Reject non-engineering categories (word-boundary matching to avoid
  //    false positives, e.g. "Chrome" contains "hr")
  for (const cat of NON_ENGINEERING_CATEGORIES) {
    const re = new RegExp(`\\b${cat.replace(/\s+/g, "\\s+")}\\b`, "i");
    if (re.test(text)) {
      return { pass: false, reason: `non-engineering category: ${cat}` };
    }
  }

  // 2. Reject non-engineering titles
  for (const pattern of NON_ENGINEERING_PATTERNS) {
    if (pattern.test(job.title)) {
      return {
        pass: false,
        reason: `non-engineering title: matched ${pattern.source}`,
      };
    }
  }

  // 3. Reject pure front-end roles
  for (const pattern of FRONTEND_ONLY_PATTERNS) {
    if (pattern.test(job.title)) {
      return { pass: false, reason: `pure frontend role: matched ${pattern.source}` };
    }
  }

  // 4. Reject location-restricted roles that exclude Thailand and Spain
  const locationText = `${job.title} ${job.region} ${job.description.slice(0, 500)}`;
  for (const pattern of LOCATION_EXCLUSION_PATTERNS) {
    if (pattern.test(locationText)) {
      return { pass: false, reason: `location restricted: matched ${pattern.source}` };
    }
  }

  // 5. Reject predominantly-PHP stacks: PHP mentioned 3+ times with no preferred stack present
  const desc = job.description.toLowerCase();
  const phpCount = (desc.match(/\bphp\b/g) ?? []).length;
  const hasPreferredStack = /\b(?:typescript|node\.?js|ruby|rails|rust|golang|python|java|kotlin|scala|bun|aws|cloudflare)\b/i.test(desc);
  if (phpCount >= 3 && !hasPreferredStack) {
    return { pass: false, reason: "predominantly PHP stack" };
  }

  return { pass: true };
}
