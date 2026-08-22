/** Unique identifier for an opportunity */
export type OpportunityId = string;

/** A funding or grant opportunity */
export interface Opportunity {
  /** Unique identifier */
  id: OpportunityId;
  /** Title of the grant or funding opportunity */
  title: string;
  /** Name of the sponsoring organization */
  organization: string;
  /** Application deadline in ISO 8601 date format (YYYY-MM-DD) */
  deadline: string;
  /** Full description of the opportunity */
  description: string;
  /** External URL to the opportunity listing */
  url: string;
  /** Keyword tags for matching */
  tags: string[];
}

/** A matched opportunity with relevance scoring */
export interface MatchResult {
  /** Unique identifier */
  id: OpportunityId;
  /** Title of the grant or funding opportunity */
  title: string;
  /** Name of the sponsoring organization */
  organization: string;
  /** Application deadline in ISO 8601 date format (YYYY-MM-DD) */
  deadline: string;
  /** Full description of the opportunity */
  description: string;
  /** External URL to the opportunity listing */
  url: string;
  /** Keyword tags for matching */
  tags: string[];
  /** Relevance score from 0 (no match) to 100 (perfect match) */
  score: number;
  /** One-line explanation of why this opportunity matched */
  matchReason: string;
}

/** Request body for the /api/match endpoint */
export interface MatchRequest {
  /** The user's biographical description */
  bio: string;
  /** Comma-separated areas of interest */
  interests: string;
}

/** Successful response from the /api/match endpoint */
export interface MatchResponse {
  /** Array of matched opportunities, sorted by score descending */
  matches: MatchResult[];
}

/** Error response from the /api/match endpoint */
export interface ErrorResponse {
  /** Human-readable error message */
  error: string;
}

/** Application view state */
export type ViewState = 'idle' | 'loading' | 'results' | 'error';
