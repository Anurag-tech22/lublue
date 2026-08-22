import React from 'react';
import { LOADING_CARD_COUNT } from '../constants';

/**
 * Premium loading state with a status message and skeleton cards
 * that stagger in with a gradient shimmer. Mimics the refined
 * OpportunityCard shape for visual continuity.
 */
export function LoadingSkeleton(): React.JSX.Element {
  const cards = Array.from({ length: LOADING_CARD_COUNT }, (_, i) => i);

  return (
    <div className="loading-container" role="status" aria-label="Loading matches">
      <div className="loading-status">
        <p className="loading-status__text">
          Searching for opportunities
          <span className="loading-status__dot" style={{ animationDelay: '0ms' }}> .</span>
          <span className="loading-status__dot" style={{ animationDelay: '200ms' }}> .</span>
          <span className="loading-status__dot" style={{ animationDelay: '400ms' }}> .</span>
        </p>
      </div>
      <div className="skeleton-list">
        {cards.map((index) => (
          <div className="skeleton-card" key={index}>
            <div className="skeleton-line skeleton-line--badge" />
            <div className="skeleton-line skeleton-line--title" />
            <div className="skeleton-line skeleton-line--org" />
            <div className="skeleton-line skeleton-line--desc" />
            <div className="skeleton-line skeleton-line--bar" />
            <div className="skeleton-line skeleton-line--short" />
          </div>
        ))}
      </div>
    </div>
  );
}
