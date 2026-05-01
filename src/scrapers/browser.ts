// src/scrapers/browser.ts — Lightpanda CDP wrapper for JS-rendered pages
//
// Set LPD_TOKEN for Lightpanda cloud (wss://euwest.cloud.lightpanda.io).
// Set LPD_CDP_URL for self-hosted Docker (e.g. ws://127.0.0.1:9222).
// If neither is set, fetchWithBrowser returns null and scrapers skip browser.

import puppeteer from "puppeteer-core";

const LPD_TOKEN = process.env.LPD_TOKEN;
const LPD_CDP_URL = process.env.LPD_CDP_URL;

export const hasBrowser = Boolean(LPD_TOKEN || LPD_CDP_URL);

function wsEndpoint(): string | null {
  if (LPD_TOKEN) return `wss://euwest.cloud.lightpanda.io/ws?token=${LPD_TOKEN}`;
  if (LPD_CDP_URL) return LPD_CDP_URL;
  return null;
}

export async function fetchWithBrowser(url: string): Promise<string | null> {
  const endpoint = wsEndpoint();
  if (!endpoint) return null;

  const browser = await puppeteer.connect({ browserWSEndpoint: endpoint });
  try {
    const context = await browser.createBrowserContext();
    const page = await context.newPage();
    await page.goto(url, { waitUntil: "networkidle0", timeout: 30_000 });
    const html = await page.content();
    await page.close();
    await context.close();
    return html;
  } finally {
    await browser.disconnect();
  }
}
