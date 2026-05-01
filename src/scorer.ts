// src/scorer.ts — Score jobs against the candidate profile using a local Ollama model

import type { Job, ScoreResult } from "./types";
import { config } from "./config";
import { loadProfile } from "./profile";

// ---------------------------------------------------------------------------
// Prompt construction
// ---------------------------------------------------------------------------

function buildPrompt(job: Job, profileText: string): string {
  return `You are a precise job-matching assistant. Evaluate this job listing against the candidate profile and scoring criteria. Be strict and objective.

CANDIDATE PROFILE:
${profileText}

SCORING CRITERIA (total 0-10):
1. Remote work (HARD FILTER): Must be fully remote. If on-site or hybrid-only, score 0 overall and set recommend=false.
2. Location availability (0-2): Prefer roles available from Thailand. Spain is also acceptable. "Anywhere" or "Worldwide" = full 2 points. US-only or restricted = 0 points.
3. Compensation (0-2): Minimum $${config.minSalaryUsd.toLocaleString()} USD/year. If explicitly stated below threshold, score 0 overall. If not stated, assume it might meet threshold and give 1 point.
4. Role type (0-3): This criterion measures how close the role is to HANDS-ON SOFTWARE ENGINEERING.
   - backend developer/engineer: 3
   - full-stack developer/engineer: 2.5
   - team lead / engineering manager (still close to code): 3
   - DevOps / SRE / platform engineer: 2.5
   - system architect: 2.5
   - Pure front-end developer (no backend): 0. Set is_frontend_only=true and recommend=false.
   - product manager, product owner (no coding): 1
   - product designer, UX designer: 0. Set recommend=false.
   - product marketing manager: 0. Set recommend=false.
   - non-software roles (electrical, mechanical, etc.): 0. Set recommend=false.
   IMPORTANT: If the role is NOT a software engineering role (writing code), set role_type to "other" and score this criterion 0. Set recommend=false.
5. Stack match (0-2): TypeScript, Ruby on Rails, Node.js, Bun, AWS, Cloudflare, DevOps, system design, APIs, distributed systems, leadership. Award 0.5 points per matched technology, max 2.
6. Seniority (0-1): Senior or lead = 1. Mid-level = 0.5 (acceptable if pay is high enough). Junior = 0.

JOB LISTING:
Title: ${job.title}
Company: ${job.company}
Region: ${job.region}
Category: ${job.category}
Description:
${job.description}

Respond with ONLY valid JSON matching this exact schema (no markdown, no commentary, no thinking tags):
{
  "is_remote": boolean,
  "is_frontend_only": boolean,
  "location_fit": "thailand" | "spain" | "other" | "anywhere" | "unknown",
  "salary_mentions": "string or null",
  "salary_meets_threshold": boolean | null,
  "role_type": "backend" | "frontend" | "fullstack" | "devops" | "management" | "other",
  "stack_match": ["matched technology 1", "matched technology 2"],
  "seniority": "junior" | "mid" | "senior" | "lead" | "unknown",
  "score": number,
  "reason": "one-sentence explanation",
  "recommend": boolean
}

Set recommend=true only when score >= ${config.scoreThreshold} AND is_remote=true AND is_frontend_only=false AND salary is not clearly below threshold.`;
}

// ---------------------------------------------------------------------------
// Ollama HTTP call
// ---------------------------------------------------------------------------

interface OllamaChatResponse {
  message: { content: string };
}

/**
 * Extract the JSON object from Ollama's raw response.
 * Handles  tags, markdown fences, and other noise.
 */
function extractJson(raw: string): string {
  // Remove all angle-bracket tags and their content (think, thinking, etc.)
  let text = raw.replace(/<[^>]+>[\s\S]*?<\/[^>]+>/g, "");
  // Remove self-closing tags like 
  text = text.replace(/<\/?think[^>]*\/?>/g, "");
  // Remove markdown fences
  text = text.replace(/```(?:json)?\s*/gi, "");
  text = text.trim();

  // Find the JSON object boundaries
  const start = text.indexOf("{");
  const end = text.lastIndexOf("}");
  if (start === -1 || end === -1 || end <= start) {
    throw new Error("No JSON object found in response");
  }
  return text.slice(start, end + 1);
}

/**
 * Send a job to Ollama for scoring.
 * Returns a parsed ScoreResult, or null if the call fails.
 */
export async function scoreJob(job: Job): Promise<ScoreResult | null> {
  const profileText = await loadProfile();
  const prompt = buildPrompt(job, profileText);

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 120_000); // 2 min per job

  try {
    const response = await fetch(`${config.ollamaUrl}/api/chat`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        model: config.ollamaModel,
        messages: [
          {
            role: "system",
            content:
              "You output only valid JSON. No thinking tags. No markdown fences. No commentary.",
          },
          { role: "user", content: prompt },
        ],
        format: "json",
        stream: false,
        options: {
          temperature: 0.1,
          // Gemma 4 uses internal reasoning tokens that consume the output budget.
          // With a long CV + job description as input, 1024 is too tight.
          // 4096 gives the model room to reason and still emit the JSON.
          num_predict: 4096,
        },
      }),
    });

    if (!response.ok) {
      const body = await response.text();
      console.error(`\n   ⚠ Ollama error for "${job.title}": ${response.status} ${body}`);
      return null;
    }

    const data = (await response.json()) as OllamaChatResponse;
    const content = data.message?.content ?? "";

    const jsonStr = extractJson(content);
    const parsed = JSON.parse(jsonStr) as ScoreResult;

    // Clamp score to 0-10
    parsed.score = Math.max(0, Math.min(10, parsed.score));

    return parsed;
  } catch (err) {
    if (controller.signal.aborted) {
      console.error(`\n   ⚠ Timeout scoring "${job.title}"`);
    } else {
      console.error(
        `\n   ⚠ Failed to score "${job.title}": ${err instanceof Error ? err.message : err}`,
      );
    }
    return null;
  } finally {
    clearTimeout(timeout);
  }
}

/**
 * Score a batch of jobs sequentially (Ollama handles one request at a time).
 * Returns only jobs that pass the threshold.
 */
export async function scoreAll(
  jobs: Job[],
  threshold: number,
): Promise<{ job: Job; result: ScoreResult }[]> {
  const accepted: { job: Job; result: ScoreResult }[] = [];

  for (let i = 0; i < jobs.length; i++) {
    const job = jobs[i];
    if (!job) continue;

    process.stdout.write(
      `   [${i + 1}/${jobs.length}] Scoring: ${job.company} — ${job.title} ... `,
    );

    const result = await scoreJob(job);

    if (!result) {
      console.log("SKIP (scoring failed)");
      continue;
    }

    const emoji = result.recommend ? "✅" : "❌";
    console.log(
      `${emoji} score=${result.score} (${result.role_type}, ${result.seniority})`,
    );

    if (result.recommend && result.score >= threshold) {
      accepted.push({ job, result });
    }
  }

  return accepted;
}
