// src/scrapers/upwork.ts — Upwork GraphQL API stub
//
// Requires OAuth credentials from https://developer.upwork.com/
// Set UPWORK_CLIENT_ID and UPWORK_CLIENT_SECRET in the environment.
// Note: Upwork is freelance/project-based, not full-time roles.
// See doc/scraper-failures.md for details.

import type { Job, Scraper } from "../types";

export const upwork: Scraper = {
  name: "Upwork",
  async scrape(): Promise<Job[]> {
    throw new Error(
      "[Upwork] Requires OAuth credentials from https://developer.upwork.com/ — " +
      "set UPWORK_CLIENT_ID and UPWORK_CLIENT_SECRET env vars and implement OAuth flow in this file.",
    );
  },
};
