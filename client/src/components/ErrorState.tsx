import React from 'react';
import { ERROR_STATE_HEADING, ERROR_STATE_MESSAGE } from '../constants';

interface ErrorStateProps {
  onRetry: () => void;
}

/**
 * Error state shown when the API request fails.
 * Uses a parchment card with icon+text label, clean heading,
 * and a bordered retry button. Never exposes raw error strings.
 */
export function ErrorState({ onRetry }: ErrorStateProps): React.JSX.Element {
  return (
    <div className="error-state">
      <p className="error-state__label">
        <span aria-hidden="true">△</span>
        Connection issue
      </p>
      <h2 className="error-state__heading">{ERROR_STATE_HEADING}</h2>
      <p className="error-state__message">{ERROR_STATE_MESSAGE}</p>
      <button className="error-state__button" onClick={onRetry} type="button">
        Try again
      </button>
    </div>
  );
}
