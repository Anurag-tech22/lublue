import React from 'react';
import { APP_NAME, APP_TAGLINE } from '../constants';

interface HeaderProps {
  savedCount?: number;
  onOpenSaved?: () => void;
  onRefreshScraper?: () => void;
  isSyncing?: boolean;
}

/**
 * App header with the Lublue name, an orange accent separator,
 * the tagline, and an interactive status toolbar for saved grants and live pipeline.
 */
export function Header({
  savedCount = 0,
  onOpenSaved,
  onRefreshScraper,
  isSyncing = false,
}: HeaderProps): React.JSX.Element {
  return (
    <header className="header">
      <div className="header__top-bar">
        <button
          type="button"
          className="header__badge"
          onClick={onRefreshScraper}
          title="Click to sync live opportunities via Bright Data"
        >
          <span className={`header__badge-dot ${isSyncing ? 'header__badge-dot--syncing' : ''}`} aria-hidden="true" />
          <span className="header__badge-text">
            {isSyncing ? 'Syncing Bright Data...' : 'Bright Data Pipeline Live'}
          </span>
        </button>

        {savedCount > 0 && onOpenSaved && (
          <button
            type="button"
            className="header__saved-btn"
            onClick={onOpenSaved}
            aria-label={`View ${savedCount} saved opportunities`}
          >
            <span className="header__saved-star">★</span>
            <span className="header__saved-text">Saved ({savedCount})</span>
          </button>
        )}
      </div>

      <h1 className="header__title">{APP_NAME}</h1>
      <span className="header__separator" aria-hidden="true" />
      <p className="header__tagline">{APP_TAGLINE}</p>
    </header>
  );
}
