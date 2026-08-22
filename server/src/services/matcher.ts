import { fetchOpportunities } from './brightdata';
import { STOPWORDS, MAX_RESULTS } from '../constants';
import type { MatchResult, Opportunity } from '../types';

/**
 * Extracts meaningful keywords from a text string.
 * Lowercases, strips punctuation, splits on whitespace, removes
 * stopwords and very short tokens.
 * @param text - Raw text to extract keywords from
 * @returns Set of unique, meaningful keywords
 */
function extractKeywords(text: string): Set<string> {
  const cleaned = text
    .toLowerCase()
    .replace(/[^\w\s-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();

  const words = cleaned.split(' ');
  const keywords = new Set<string>();

  for (const word of words) {
    if (word.length >= 3 && !STOPWORDS.has(word)) {
      keywords.add(word);
    }
  }

  return keywords;
}

/**
 * Computes a relevance score between user keywords and an opportunity.
 * Considers both tag matches (weighted higher) and description keyword
 * overlap. Returns a score from 0 to 100.
 * @param userKeywords - Keywords extracted from the user's bio and interests
 * @param opportunity - The opportunity to score against
 * @returns Numeric score from 0 (no match) to 100 (strong match)
 */
function computeScore(userKeywords: Set<string>, opportunity: Opportunity): number {
  if (userKeywords.size === 0) {
    return 0;
  }

  const tagKeywords = new Set<string>();
  for (const tag of opportunity.tags) {
    for (const word of tag.toLowerCase().split(/\s+/)) {
      if (word.length >= 3) {
        tagKeywords.add(word);
      }
    }
  }

  const descKeywords = extractKeywords(opportunity.description);

  let tagMatches = 0;
  let descMatches = 0;

  for (const keyword of userKeywords) {
    if (tagKeywords.has(keyword)) {
      tagMatches++;
    }
    if (descKeywords.has(keyword)) {
      descMatches++;
    }
  }

  // Tags are weighted 3x more than description matches
  const TAG_WEIGHT = 3;
  const DESC_WEIGHT = 1;

  const maxPossibleTagScore = Math.min(userKeywords.size, tagKeywords.size) * TAG_WEIGHT;
  const maxPossibleDescScore = Math.min(userKeywords.size, descKeywords.size) * DESC_WEIGHT;
  const maxPossible = maxPossibleTagScore + maxPossibleDescScore;

  if (maxPossible === 0) {
    return 0;
  }

  const rawScore = (tagMatches * TAG_WEIGHT + descMatches * DESC_WEIGHT) / maxPossible;

  // Scale to 0–100 with a slight boost so good matches feel meaningful
  const scaled = Math.round(Math.min(rawScore * 130, 100));

  return scaled;
}

/**
 * Generates a human-readable one-line reason explaining why an
 * opportunity matched the user's profile.
 * @param userKeywords - Keywords extracted from the user's bio and interests
 * @param opportunity - The matched opportunity
 * @returns A sentence explaining the match
 */
function generateMatchReason(userKeywords: Set<string>, opportunity: Opportunity): string {
  const matchedTags: string[] = [];

  for (const tag of opportunity.tags) {
    const tagWords = tag.toLowerCase().split(/\s+/);
    const hasMatch = tagWords.some((word) => userKeywords.has(word));
    if (hasMatch && matchedTags.length < 3) {
      matchedTags.push(tag);
    }
  }

  if (matchedTags.length === 0) {
    return `Aligns with your research profile and background.`;
  }

  if (matchedTags.length === 1) {
    return `Matches your interest in ${matchedTags[0]}.`;
  }

  const last = matchedTags.pop()!;
  return `Matches your interest in ${matchedTags.join(', ')} and ${last}.`;
}

/**
 * Matches a user's bio and interests against available grant opportunities.
 * Fetches all opportunities, scores each one against the user's keywords,
 * filters out low-scoring results, and returns the top matches sorted
 * by relevance.
 * @param bio - The user's biographical text
 * @param interests - Comma-separated areas of interest
 * @returns Array of matched opportunities with scores and reasons, sorted by score descending
 */
export async function matchOpportunities(
  bio: string,
  interests: string,
): Promise<MatchResult[]> {
  const opportunities = await fetchOpportunities();
  const combinedText = `${bio} ${interests}`;
  const userKeywords = extractKeywords(combinedText);

  const scored: MatchResult[] = opportunities.map((opp) => {
    const score = computeScore(userKeywords, opp);
    const matchReason = generateMatchReason(userKeywords, opp);

    return {
      ...opp,
      score,
      matchReason,
    };
  });

  // Filter out very low scores and sort descending
  const MINIMUM_SCORE = 5;
  const filtered = scored
    .filter((result) => result.score >= MINIMUM_SCORE)
    .sort((a, b) => b.score - a.score)
    .slice(0, MAX_RESULTS);

  return filtered;
}
