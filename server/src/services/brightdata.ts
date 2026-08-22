import fs from 'fs';
import { SAMPLE_DATA_PATH } from '../constants';
import type { Opportunity } from '../types';

// ─────────────────────────────────────────────────────────────────────────────
// To switch from sample data to live Bright Data scraping:
//
// 1. Uncomment the "LIVE MODE" section below
// 2. Comment out the "SAMPLE MODE" section
// 3. Set BRIGHTDATA_API_KEY and BRIGHTDATA_COLLECTOR_ID in your .env
//
// That's it — one file, one change.
// ─────────────────────────────────────────────────────────────────────────────

// ── LIVE MODE (uncomment when ready) ────────────────────────────────────────
//
// import { BrightDataClient } from '../lib/brightdata-client';
//
// const client = new BrightDataClient({
//   apiKey: process.env.BRIGHTDATA_API_KEY!,
//   collectorId: process.env.BRIGHTDATA_COLLECTOR_ID!,
// });
//
// /**
//  * Fetches grant opportunities from live sources via Bright Data.
//  * Triggers a Data Collector scraping job and returns the results.
//  * @returns Array of scraped opportunities
//  */
// export async function fetchOpportunities(): Promise<Opportunity[]> {
//   try {
//     const response = await client.trigger({ query: 'research grants' });
//     // In production, you'd poll for results using response.snapshot_id
//     // or configure a webhook to receive results asynchronously.
//     console.log(`[brightdata] Triggered collector, snapshot: ${response.snapshot_id}`);
//     // For now, return sample data as a fallback
//     return readSampleData();
//   } catch (error) {
//     console.error('[brightdata] Live fetch failed, falling back to sample data:', error);
//     return readSampleData();
//   }
// }
//
// ── END LIVE MODE ───────────────────────────────────────────────────────────

// ── SAMPLE MODE (active) ───────────────────────────────────────────────────

/**
 * Fetches grant opportunities from the local sample data file.
 * In production, this will be replaced by a call to Bright Data's
 * Data Collector API (POST /dca/trigger).
 * @returns Array of sample opportunities
 */
export async function fetchOpportunities(): Promise<Opportunity[]> {
  return readSampleData();
}

// ── END SAMPLE MODE ─────────────────────────────────────────────────────────

/**
 * Reads and parses the sample opportunities JSON file.
 * @returns Array of opportunities parsed from the sample data file
 * @throws Error if the file cannot be read or parsed
 */
function readSampleData(): Opportunity[] {
  try {
    const raw = fs.readFileSync(SAMPLE_DATA_PATH, 'utf-8');
    const data: unknown = JSON.parse(raw);

    if (!Array.isArray(data)) {
      throw new Error('Sample data is not an array');
    }

    return data as Opportunity[];
  } catch (error) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to read sample opportunities: ${message}`);
  }
}
