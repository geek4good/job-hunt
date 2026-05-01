// src/profile.ts — Extract candidate profile text from a PDF via pdftotext

import { config } from "./config";

let cachedProfile: string | null = null;

/**
 * Extract plain text from the candidate's CV PDF.
 * Uses the system `pdftotext` binary (poppler).
 * Result is cached for the process lifetime.
 */
export async function loadProfile(): Promise<string> {
  if (cachedProfile) return cachedProfile;

  try {
    const proc = Bun.spawn(["pdftotext", config.cvPath, "-"], {
      stdout: "pipe",
      stderr: "pipe",
    });
    const stdout = await new Response(proc.stdout).text();
    const exitCode = await proc.exited;

    if (exitCode !== 0) {
      const stderr = await new Response(proc.stderr).text();
      throw new Error(`pdftotext exited ${exitCode}: ${stderr}`);
    }

    cachedProfile = stdout.trim();
    return cachedProfile;
  } catch (err) {
    console.error(
      `Failed to extract CV from ${config.cvPath}. ` +
        `Ensure pdftotext is installed (brew install poppler).`,
    );
    throw err;
  }
}
