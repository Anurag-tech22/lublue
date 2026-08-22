import React from 'react';
import type { MatchResult } from '../types';

interface OpportunityCardProps {
  match: MatchResult;
  /** Animation delay index for staggered fade-in */
  index: number;
  isSaved?: boolean;
  onToggleSave?: (match: MatchResult) => void;
  onSelectMatch?: (match: MatchResult) => void;
}

/**
 * Formats an ISO date string into a compact deadline label.
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
 * Format category label for card badge
 */
function formatCategoryLabel(cat?: string): string {
  switch (cat) {
    case 'ai-tech': return 'AI & Tech';
    case 'health-bio': return 'Health & Bio';
    case 'climate': return 'Climate & Earth';
    case 'social': return 'Social Science';
    case 'fellowship': return 'Fellowship';
    default: return 'Grant';
  }
}

/**
 * Displays a single matched opportunity with rich metadata:
 * deadline badge, category pill, award tag, title, org, match reason,
 * relevance bar, bookmark action, and view details modal trigger.
 */
export function OpportunityCard({
  match,
  index,
  isSaved = false,
  onToggleSave,
  onSelectMatch,
}: OpportunityCardProps): React.JSX.Element {
  const animationDelay = `${index * 60}ms`;

  return (
    <article
      className="opportunity-card results-enter"
      style={{ animationDelay }}
    >
      <div className="opportunity-card__header-row">
        <div className="opportunity-card__badges">
          <span className="opportunity-card__deadline">
            Deadline: {formatDeadline(match.deadline)}
          </span>
          {match.category && match.category !== 'all' && (
            <span className="opportunity-card__category-badge">
              {formatCategoryLabel(match.category)}
            </span>
          )}
        </div>

        {onToggleSave && (
          <button
            type="button"
            className={`opportunity-card__star-btn ${isSaved ? 'opportunity-card__star-btn--saved' : ''}`}
            onClick={(e) => {
              e.stopPropagation();
              onToggleSave(match);
            }}
            title={isSaved ? 'Remove from saved' : 'Save opportunity'}
            aria-label={isSaved ? `Unsave ${match.title}` : `Save ${match.title}`}
          >
            {isSaved ? '★' : '☆'}
          </button>
        )}
      </div>

      <h3
        className="opportunity-card__title"
        onClick={() => onSelectMatch?.(match)}
        title="Click to view full details"
      >
        {match.title}
      </h3>

      <p className="opportunity-card__org">{match.organization}</p>

      {match.awardAmount && (
        <div className="opportunity-card__award-pill">
          <span className="opportunity-card__award-icon">💰</span>
          <span className="opportunity-card__award-text">{match.awardAmount}</span>
        </div>
      )}

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

      <div className="opportunity-card__actions">
        <button
          type="button"
          className="opportunity-card__details-btn"
          onClick={() => onSelectMatch?.(match)}
        >
          View Full Breakdown
        </button>

        <a
          className="opportunity-card__link"
          href={match.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`View official call for ${match.title} (opens in new tab)`}
        >
          Official Call
          <span className="opportunity-card__link-arrow" aria-hidden="true">→</span>
        </a>
      </div>
    </article>
  );
}
