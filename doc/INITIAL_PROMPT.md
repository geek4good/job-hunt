You are an expert TypeScript/Bun engineer. Build a local job-hunt agent that runs on my machine using Bun and Ollama, managed by mise.

Goal:
- Pull jobs from the We Work Remotely RSS feed first.
- Normalize each job entry into a consistent JSON schema.
- Deduplicate jobs using a local file / sqlite.
- Send each new job to a local Ollama model for fit scoring.
- Only keep and print jobs that meet my criteria.
- Make the implementation deterministic, minimal, and easy to extend later.

My profile and criteria:
- My CV: ./doc/CV-Lucas_Mbiwe.pdf
- Fully remote only.
- Prefer roles available to someone in Thailand; Spain is also acceptable.
- Minimum salary: 75,000 USD/year before tax.
- Prefer backend, team lead, engineering management, or full-stack.
- Pure front-end roles are not a good fit.
- Strong positive signals: TypeScript, Ruby on Rails, Node.js, Bun, AWS, Cloudflare, DevOps, system design, APIs, distributed systems, leadership.
- Mid-level roles are acceptable if compensation meets the threshold.

Tech constraints:
- Use Bun for all scripts.
- Use Ollama locally via HTTP.
- Use mise to manage Bun and Ollama versions and environment variables.
- Prefer clean TypeScript.
- Keep external dependencies light.

Target source for v1:
- We Work Remotely RSS feed.

Required output:
1. A project structure.
2. package.json scripts.
3. mise configuration.
4. TypeScript source files for:
   - RSS fetch and parsing.
   - Deduplication.
   - Ollama scoring/matching.
   - Main orchestrator.
5. A sample .env or environment variable list.
6. Clear run instructions.

Implementation requirements:
- Use a local data file to store seen job URLs or IDs.
- Make the matching logic return structured JSON.
- Include a scoring threshold and explain it in code.
- Keep code readable and production-minded.
- Do not include fake APIs.
- Do not use Docker for the first version.
- Do not over-engineer; start with one RSS source and one local Ollama call.

Important behavior:
- Reject jobs that are not fully remote.
- Reject jobs that are clearly pure front-end.
- Reject jobs with salary clearly below the threshold.
- Prefer jobs that match my stack and seniority, but allow mid-level roles if pay is high enough.
- Output a short summary and the original link for each accepted job.

Format your response as:
- Brief architecture summary.
- File tree.
- Code blocks for each file.
- Instructions to run.
- Next step suggestions.

If any detail is ambiguous, choose the simplest reasonable implementation and note the assumption briefly.
