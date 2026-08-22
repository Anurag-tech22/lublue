import React from 'react';
import type { MatchResult } from '../types';

interface SavedDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  savedMatches: MatchResult[];
  onRemove: (id: string) => void;
  onSelectMatch: (match: MatchResult) => void;
}

/**
 * SavedDrawer displays all bookmarked grant opportunities
 * with quick access to view details, apply, or un-save.
 */
export function SavedDrawer({
  isOpen,
  onClose,
  savedMatches,
  onRemove,
  onSelectMatch,
}: SavedDrawerProps): React.JSX.Element | null {
  if (!isOpen) return null;

  return (
    <div className="drawer-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <aside
        className="drawer-panel"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <header className="drawer-header">
          <div>
            <h3 className="drawer-title">Saved Opportunities</h3>
            <p className="drawer-subtitle">
              {savedMatches.length} {savedMatches.length === 1 ? 'grant' : 'grants'} saved in your list
            </p>
          </div>
          <button
            type="button"
            className="drawer-close-btn"
            onClick={onClose}
            aria-label="Close saved drawer"
          >
            ✕
          </button>
        </header>

        <main className="drawer-body">
          {savedMatches.length === 0 ? (
            <div className="drawer-empty">
              <span className="drawer-empty-icon">☆</span>
              <p className="drawer-empty-text">No saved opportunities yet.</p>
              <p className="drawer-empty-subtext">Click the star button on any grant card to save it here for quick reference.</p>
            </div>
          ) : (
            <div className="drawer-list">
              {savedMatches.map((match) => (
                <article key={match.id} className="drawer-card">
                  <div className="drawer-card-header">
                    <span className="drawer-card-badge">Deadline: {match.deadline}</span>
                    <button
                      type="button"
                      className="drawer-card-remove"
                      onClick={() => onRemove(match.id)}
                      title="Remove from saved"
                      aria-label={`Remove ${match.title} from saved`}
                    >
                      ✕
                    </button>
                  </div>
                  <h4
                    className="drawer-card-title"
                    onClick={() => {
                      onSelectMatch(match);
                      onClose();
                    }}
                  >
                    {match.title}
                  </h4>
                  <p className="drawer-card-org">{match.organization}</p>
                  {match.awardAmount && (
                    <span className="drawer-card-award">{match.awardAmount}</span>
                  )}
                  <div className="drawer-card-footer">
                    <button
                      type="button"
                      className="drawer-card-btn-view"
                      onClick={() => {
                        onSelectMatch(match);
                        onClose();
                      }}
                    >
                      View Details
                    </button>
                    <a
                      href={match.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="drawer-card-btn-apply"
                    >
                      Apply ↗
                    </a>
                  </div>
                </article>
              ))}
            </div>
          )}
        </main>
      </aside>
    </div>
  );
}
