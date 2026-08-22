import React, { useState, useCallback } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { BioInput } from './components/BioInput';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { OpportunityCard } from './components/OpportunityCard';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { API_ENDPOINT } from './constants';
import type { ViewState, MatchResult, MatchResponse, ErrorResponse } from './types';

/**
 * Root application component. Manages a simple state machine:
 * idle → loading → results/error. Each state maps to exactly
 * one screen view.
 */
export function App(): React.JSX.Element {
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [lastBio, setLastBio] = useState('');
  const [lastInterests, setLastInterests] = useState('');

  /**
   * Submits the bio to the match API and transitions through
   * loading → results or error states.
   */
  const handleSubmit = useCallback(async (bio: string, interests: string) => {
    setLastBio(bio);
    setLastInterests(interests);
    setViewState('loading');

    try {
      const response = await fetch(API_ENDPOINT, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ bio, interests }),
      });

      if (!response.ok) {
        const errorData: ErrorResponse = await response.json().catch(() => ({
          error: 'Request failed',
        }));
        console.error('[lublue] API error:', errorData.error);
        setViewState('error');
        return;
      }

      const data: MatchResponse = await response.json();
      setMatches(data.matches);
      setViewState('results');
    } catch (error) {
      console.error('[lublue] Network error:', error);
      setViewState('error');
    }
  }, []);

  /** Returns to the input screen, preserving previously entered text. */
  const handleBack = useCallback(() => {
    setViewState('idle');
    setMatches([]);
  }, []);

  /** Retries the last submission with the same bio and interests. */
  const handleRetry = useCallback(() => {
    if (lastBio) {
      handleSubmit(lastBio, lastInterests);
    } else {
      setViewState('idle');
    }
  }, [lastBio, lastInterests, handleSubmit]);

  return (
    <Layout>
      <Header />

      {viewState === 'idle' && (
        <BioInput onSubmit={handleSubmit} />
      )}

      {viewState === 'loading' && (
        <LoadingSkeleton />
      )}

      {viewState === 'results' && (
        <>
          <button className="back-button" onClick={handleBack} type="button">
            <span className="back-button__arrow" aria-hidden="true">←</span>
            Start over
          </button>

          {matches.length === 0 ? (
            <EmptyState onBack={handleBack} />
          ) : (
            <>
              <div className="results-header">
                <h2 className="results-header__title">Your matches</h2>
                <p className="results-header__count">
                  {matches.length} {matches.length === 1 ? 'opportunity' : 'opportunities'} found
                </p>
              </div>
              <div className="results-list">
                {matches.map((match, index) => (
                  <OpportunityCard key={match.id} match={match} index={index} />
                ))}
              </div>
            </>
          )}
        </>
      )}

      {viewState === 'error' && (
        <>
          <button className="back-button" onClick={handleBack} type="button">
            <span className="back-button__arrow" aria-hidden="true">←</span>
            Start over
          </button>
          <ErrorState onRetry={handleRetry} />
        </>
      )}
    </Layout>
  );
}
