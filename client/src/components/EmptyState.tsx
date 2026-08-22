import React from 'react';
import { EMPTY_STATE_HEADING, EMPTY_STATE_MESSAGE } from '../constants';

interface EmptyStateProps {
  onBack: () => void;
}

/**
 * Empty state shown when no matching opportunities are found.
 * Uses a parchment card with icon+text label, clean heading,
 * and a bordered action button. No decorative elements.
 */
export function EmptyState({ onBack }: EmptyStateProps): React.JSX.Element {
  return (
    <div className="empty-state">
      <p className="empty-state__label">
        <span aria-hidden="true">○</span>
        No results
      </p>
      <h2 className="empty-state__heading">{EMPTY_STATE_HEADING}</h2>
      <p className="empty-state__message">{EMPTY_STATE_MESSAGE}</p>
      <button className="empty-state__button" onClick={onBack} type="button">
        Refine your story
      </button>
    </div>
  );
}
