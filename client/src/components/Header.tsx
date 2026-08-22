import React from 'react';
import { APP_NAME, APP_TAGLINE } from '../constants';

interface HeaderProps {
  savedCount?: number;
  onOpenSaved?: () => void;
}

/**
 * App header with the Lublue name, an orange accent separator,
 * and the tagline. Clean, authoritative, and uncluttered.
 */
export function Header({
  savedCount = 0,
  onOpenSaved,
}: HeaderProps): React.JSX.Element {
  return (
    <header className="header">
      {savedCount > 0 && onOpenSaved && (
        <div className="header__top-bar">
          <button
            type="button"
            className="header__saved-btn"
            onClick={onOpenSaved}
            aria-label={`View ${savedCount} saved opportunities`}
          >
            <span className="header__saved-star">★</span>
            <span className="header__saved-text">Saved Opportunities ({savedCount})</span>
          </button>
        </div>
      )}

      <h1 className="header__title">{APP_NAME}</h1>
      <span className="header__separator" aria-hidden="true" />
      <p className="header__tagline">{APP_TAGLINE}</p>
    </header>
  );
}
