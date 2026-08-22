import { Router, Request, Response } from 'express';
import { matchOpportunities } from '../services/matcher';
import { MIN_BIO_LENGTH, MAX_BIO_LENGTH, MAX_INTERESTS_LENGTH } from '../constants';
import type { MatchRequest, MatchResponse, ErrorResponse } from '../types';

const router = Router();

/**
 * POST /api/match
 * Accepts a user bio and interests, returns matched grant opportunities
 * ranked by relevance score.
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

    const matches = await matchOpportunities(bio, interests);

    res.json({ matches });
  } catch (error) {
    const message = error instanceof Error ? error.message : 'An unexpected error occurred';
    console.error('[api/match] Error:', message);
    res.status(500).json({ error: 'We couldn\'t process your request. Please try again.' });
  }
});

export default router;
