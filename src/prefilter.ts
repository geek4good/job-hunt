// src/prefilter.ts — Hard-filter jobs in code before sending to Ollama
//
// This saves Ollama calls and catches obvious mismatches that smaller
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

  return { pass: true };
}
