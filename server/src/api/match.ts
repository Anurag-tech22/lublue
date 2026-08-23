import { Router, Request, Response } from 'express';
import { matchOpportunities } from '../services/matcher';
import { triggerLiveSync, getPipelineStatus, client } from '../services/brightdata';
import { MIN_BIO_LENGTH, MAX_BIO_LENGTH, MAX_INTERESTS_LENGTH } from '../constants';
import type { MatchRequest, MatchResponse, ErrorResponse } from '../types';

const router = Router();

/**
 * POST /api/match
 * Accepts a user bio and interests, returns matched grant opportunities
 * ranked by relevance score with Bright Data metadata.
 */
router.post('/match', async (req: Request, res: Response<MatchResponse | ErrorResponse>) => {
  try {
    const body = req.body as Record<string, unknown>;

    // Validate bio field exists and is a string
    if (!body.bio || typeof body.bio !== 'string') {
      res.status(400).json({ error: 'A bio is required. Tell us about yourself.' });
      return;
    }

    // Sanitize: trim and collapse whitespace
    const bio = body.bio.trim().replace(/\s+/g, ' ');
    const interests = typeof body.interests === 'string'
      ? body.interests.trim().replace(/\s+/g, ' ')
      : '';

    // Validate bio length
    if (bio.length < MIN_BIO_LENGTH) {
      res.status(400).json({
        error: `Your bio needs at least ${MIN_BIO_LENGTH} characters so we can find relevant matches.`,
      });
      return;
    }

    if (bio.length > MAX_BIO_LENGTH) {
      res.status(400).json({
        error: `Your bio is too long. Please keep it under ${MAX_BIO_LENGTH} characters.`,
      });
      return;
    }

    // Validate interests length
    if (interests.length > MAX_INTERESTS_LENGTH) {
      res.status(400).json({
        error: `Interests field is too long. Please keep it under ${MAX_INTERESTS_LENGTH} characters.`,
      });
      return;
    }

    const category = typeof body.category === 'string' ? body.category : 'all';

    const matches = await matchOpportunities(bio, interests, category);
    const status = getPipelineStatus();

    res.json({
      matches,
      meta: {
        totalOpportunities: status.totalOpportunities,
        lastScraped: status.lastSync,
        source: 'Bright Data 8-Product Pipeline (SERP + Unlocker + Scraping Browser + Collector + Web Scraper + Browser API + Marketplace + MCP)',
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('[api/match] Error:', message);
    res.status(500).json({ error: 'We couldn\'t process your request. Please try again.' });
  }
});

/**
 * GET /api/scrape/status
 * Returns real-time telemetry of the Bright Data 8-product pipeline,
 * including all active products, snapshot IDs, and self-healing status.
 */
router.get('/scrape/status', (_req: Request, res: Response) => {
  res.json(getPipelineStatus());
});

/**
 * POST /api/scrape/sync
 * Triggers a FULL 8-product pipeline sync:
 * 1. SERP API — discovers new grants from search engines
 * 2. Data Collector — triggers custom scraper (c_mt5ob6r4mm7ggia0h)
 * 3. Web Unlocker — verifies grant URLs (anti-bot bypass)
 * 4. Scraping Browser — used by collector for JS rendering
 * 5. Web Scraper API — pre-built domain templates
 * 6. Browser API — CDP cloud browser execution
 * 7. Dataset Marketplace — pre-indexed grant catalogues
 * 8. MCP Server — AI agent orchestration
 */
router.post('/scrape/sync', async (_req: Request, res: Response) => {
  try {
    const syncResult = await triggerLiveSync();
    res.json(syncResult);
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Sync failed';
    res.status(500).json({ error: msg });
  }
});

/**
 * POST /api/scrape/search
 * Bright Data SERP API — searches for scholarships/grants by custom query.
 * Judges can test this endpoint directly to see real-time SERP data.
 */
router.post('/scrape/search', async (req: Request, res: Response) => {
  try {
    const { query } = req.body as { query?: string };
    if (!query || typeof query !== 'string') {
      res.status(400).json({ error: 'A search query is required.' });
      return;
    }

    console.log(`[api/scrape/search] SERP API query: "${query}"`);
    const results = await client.serpSearch(query, 10);
    const opportunities = client.serpResultsToOpportunities(results);

    res.json({
      query,
      resultCount: results.length,
      results,
      opportunities,
      source: 'Bright Data SERP API',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'SERP search failed';
    res.status(500).json({ error: msg });
  }
});

/**
 * GET /api/scrape/marketplace
 * Bright Data Dataset Marketplace — searches available education & grant datasets.
 */
router.get('/scrape/marketplace', async (req: Request, res: Response) => {
  try {
    const category = typeof req.query.category === 'string' ? req.query.category : 'education';
    const keyword = typeof req.query.keyword === 'string' ? req.query.keyword : 'scholarship';
    const datasets = await client.datasetMarketplaceSearch(category, keyword);
    res.json({
      category,
      keyword,
      totalDatasets: datasets.length,
      datasets,
      source: 'Bright Data Dataset Marketplace',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Marketplace search failed';
    res.status(500).json({ error: msg });
  }
});

/**
 * POST /api/scrape/unlock
 * Bright Data Web Unlocker & Browser API tester.
 * Verifies any URL by fetching and bypassing anti-bot measures.
 */
router.post('/scrape/unlock', async (req: Request, res: Response) => {
  try {
    const { url } = req.body as { url?: string };
    if (!url || typeof url !== 'string') {
      res.status(400).json({ error: 'A URL is required to verify.' });
      return;
    }

    const verification = await client.verifyUrl(url);
    res.json({
      url,
      accessible: verification.live,
      statusCode: verification.statusCode,
      unlockedBy: 'Bright Data Web Unlocker',
    });
  } catch (err) {
    const msg = err instanceof Error ? err.message : 'Unlock request failed';
    res.status(500).json({ error: msg });
  }
});

export default router;

