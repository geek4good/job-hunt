// src/config.ts — Centralised configuration from environment / .mise.toml / .env

const env = (key: string, fallback: string): string =>
  process.env[key] ?? fallback;

export const config = {
  /** Ollama model name (must be pulled already). */
  ollamaModel: env("OLLAMA_MODEL", "qwen3:8b"),

  /** Ollama HTTP base URL. */
  ollamaUrl: env("OLLAMA_URL", "http://localhost:11434"),

  /**
   * Score threshold (0-10). Jobs scoring >= this value are accepted.
   *
   * 0-3  → poor match, skip
   * 4-5  → borderline, might review manually
   * 6-7  → good match, recommend        ← default
   * 8-10 → excellent match, strong recommend
   */
  scoreThreshold: parseInt(env("SCORE_THRESHOLD", "6"), 10),

  /** SQLite database path for deduplication. */
  dbPath: env("DB_PATH", "data/jobs.db"),

  /** Path to the candidate's CV (PDF). */
  cvPath: env("CV_PATH", "doc/CV-Lucas_Mbiwe.pdf"),

  /** Minimum annual salary in USD before tax. */
  minSalaryUsd: parseInt(env("MIN_SALARY_USD", "75000"), 10),
} as const;
