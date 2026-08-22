import React from 'react';
import type { MatchResult } from '../types';

interface OpportunityCardProps {
  match: MatchResult;
  /** Animation delay index for staggered fade-in */
  index: number;
}

/**
 * Formats an ISO date string into a compact deadline label.
 * @param isoDate - Date string in YYYY-MM-DD format
 * @returns Formatted date like "Oct 21, 2027"
 */
function formatDeadline(isoDate: string): string {
  try {
    const date = new Date(isoDate + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Displays a single matched opportunity with the refined card hierarchy:
 * deadline badge, title, org, match reason, relevance bar with label,
 * and "View Call" text link with arrow animation.
 */
export function OpportunityCard({ match, index }: OpportunityCardProps): React.JSX.Element {
  const animationDelay = `${index * 60}ms`;

  return (
    <article
      className="opportunity-card results-enter"
      style={{ animationDelay }}
    >
      <span className="opportunity-card__deadline">
        Deadline: {formatDeadline(match.deadline)}
      </span>

      <h3 className="opportunity-card__title">{match.title}</h3>

      <p className="opportunity-card__org">{match.organization}</p>

      <p className="opportunity-card__reason">{match.matchReason}</p>

      <div className="opportunity-card__relevance" aria-label={`Relevance: ${match.score} out of 100`}>
        <span className="opportunity-card__relevance-label">Relevance</span>
        <div className="opportunity-card__relevance-bar-track">
          <div
            className="opportunity-card__relevance-bar-fill"
            style={{ width: `${match.score}%` }}
          />
        </div>
        <span className="opportunity-card__relevance-value">{match.score}</span>
      </div>

      <a
        className="opportunity-card__link"
        href={match.url}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={`View call for ${match.title} (opens in new tab)`}
      >
        View Call
        <span className="opportunity-card__link-arrow" aria-hidden="true">→</span>
      </a>
    </article>
  );
}
