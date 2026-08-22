import React, { useEffect } from 'react';
import type { MatchResult } from '../types';

interface OpportunityModalProps {
  match: MatchResult | null;
  isOpen: boolean;
  onClose: () => void;
  isSaved: boolean;
  onToggleSave: (match: MatchResult) => void;
}

/**
 * Formats an ISO date into full readable format.
 */
function formatFullDate(isoDate: string): string {
  try {
    const date = new Date(isoDate + 'T00:00:00');
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  } catch {
    return isoDate;
  }
}

/**
 * Calculates remaining days until deadline.
 */
function getDaysRemaining(isoDate: string): string {
  try {
    const target = new Date(isoDate + 'T00:00:00').getTime();
    const now = new Date().getTime();
    const diff = Math.ceil((target - now) / (1000 * 60 * 60 * 24));
    if (diff <= 0) return 'Deadline today or passed';
    if (diff === 1) return '1 day remaining';
    return `${diff} days remaining`;
  } catch {
    return 'Upcoming deadline';
  }
}

/**
 * OpportunityModal provides an in-depth view of a grant,
 * including full description, eligibility criteria, award package,
 * countdown, and direct application action.
 */
export function OpportunityModal({
  match,
  isOpen,
  onClose,
  isSaved,
  onToggleSave,
}: OpportunityModalProps): React.JSX.Element | null {
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };

    if (isOpen) {
      document.body.style.overflow = 'hidden';
      window.addEventListener('keydown', handleKeyDown);
    } else {
      document.body.style.overflow = '';
    }

    return () => {
      document.body.style.overflow = '';
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen, onClose]);

  if (!isOpen || !match) return null;

  return (
    <div className="modal-backdrop" onClick={onClose} role="dialog" aria-modal="true">
      <div
        className="modal-container"
        onClick={(e) => e.stopPropagation()}
        role="document"
      >
        <header className="modal-header">
          <div className="modal-header__meta">
            <span className="modal-badge modal-badge--deadline">
              Deadline: {formatFullDate(match.deadline)}
            </span>
            <span className="modal-badge modal-badge--countdown">
              ⏳ {getDaysRemaining(match.deadline)}
            </span>
          </div>

          <div className="modal-header__actions">
            <button
              type="button"
              className={`modal-action-btn ${isSaved ? 'modal-action-btn--saved' : ''}`}
              onClick={() => onToggleSave(match)}
              aria-label={isSaved ? 'Remove from saved' : 'Save opportunity'}
            >
              {isSaved ? '★ Saved' : '☆ Save'}
            </button>
            <button
              type="button"
              className="modal-close-btn"
              onClick={onClose}
              aria-label="Close details"
            >
              ✕
            </button>
          </div>
        </header>

        <main className="modal-body">
          <h2 className="modal-title">{match.title}</h2>
          <p className="modal-org">{match.organization}</p>

          {match.awardAmount && (
            <div className="modal-award-card">
              <span className="modal-award-label">Estimated Award Package</span>
              <span className="modal-award-value">{match.awardAmount}</span>
            </div>
          )}

          <div className="modal-section">
            <h4 className="modal-section-title">Why This Matches You</h4>
            <div className="modal-match-box">
              <span className="modal-match-score">Relevance Score: {match.score}/100</span>
              <p className="modal-match-reason">{match.matchReason}</p>
            </div>
          </div>

          <div className="modal-section">
            <h4 className="modal-section-title">About the Opportunity</h4>
            <p className="modal-desc">{match.description}</p>
          </div>

          {match.eligibility && (
            <div className="modal-section">
              <h4 className="modal-section-title">Eligibility Criteria</h4>
              <p className="modal-eligibility">{match.eligibility}</p>
            </div>
          )}

          {match.tags && match.tags.length > 0 && (
            <div className="modal-section">
              <h4 className="modal-section-title">Focus Keywords & Tags</h4>
              <div className="modal-tags">
                {match.tags.map((tag) => (
                  <span key={tag} className="modal-tag">
                    #{tag}
                  </span>
                ))}
              </div>
            </div>
          )}
        </main>

        <footer className="modal-footer">
          <button
            type="button"
            className="modal-secondary-btn"
            onClick={onClose}
          >
            Back to matches
          </button>
          <a
            href={match.url}
            target="_blank"
            rel="noopener noreferrer"
            className="modal-primary-btn"
          >
            Apply on Official Site
            <span aria-hidden="true"> ↗</span>
          </a>
        </footer>
      </div>
    </div>
  );
}
