import React, { useState, useCallback, useEffect, useMemo } from 'react';
import { Layout } from './components/Layout';
import { Header } from './components/Header';
import { BioInput } from './components/BioInput';
import { LoadingSkeleton } from './components/LoadingSkeleton';
import { OpportunityCard } from './components/OpportunityCard';
import { OpportunityModal } from './components/OpportunityModal';
import { FilterBar } from './components/FilterBar';
import { SavedDrawer } from './components/SavedDrawer';
import { EmptyState } from './components/EmptyState';
import { ErrorState } from './components/ErrorState';
import { API_ENDPOINT } from './constants';
import type { ViewState, MatchResult, MatchResponse, ErrorResponse, OpportunityCategory } from './types';

const SAVED_STORAGE_KEY = 'lublue_saved_grants_v1';

/**
 * Root application component for Lublue.
 * Manages full lifecycle: bio input, live matching, category filtering,
 * modal breakdowns, bookmarked opportunities, and scraper pipeline sync.
 */
export function App(): React.JSX.Element {
  const [viewState, setViewState] = useState<ViewState>('idle');
  const [matches, setMatches] = useState<MatchResult[]>([]);
  const [lastBio, setLastBio] = useState('');
  const [lastInterests, setLastInterests] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<OpportunityCategory>('all');
  const [activeModalMatch, setActiveModalMatch] = useState<MatchResult | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  // Initialize saved grants from localStorage
  const [savedMatches, setSavedMatches] = useState<MatchResult[]>(() => {
    try {
      const stored = localStorage.getItem(SAVED_STORAGE_KEY);
      return stored ? (JSON.parse(stored) as MatchResult[]) : [];
    } catch {
      return [];
    }
  });

  // Sync saved grants to localStorage
  useEffect(() => {
    try {
      localStorage.setItem(SAVED_STORAGE_KEY, JSON.stringify(savedMatches));
    } catch (err) {
      console.error('[lublue] Failed to persist saved matches:', err);
    }
  }, [savedMatches]);

  /** Submits the bio to the match API */
  const handleSubmit = useCallback(async (bio: string, interests: string) => {
    setLastBio(bio);
    setLastInterests(interests);
    setViewState('loading');
    setSelectedCategory('all');

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

  /** Returns to the input screen */
  const handleBack = useCallback(() => {
    setViewState('idle');
    setMatches([]);
    setSelectedCategory('all');
  }, []);

  /** Retries the last submission */
  const handleRetry = useCallback(() => {
    if (lastBio) {
      handleSubmit(lastBio, lastInterests);
    } else {
      setViewState('idle');
    }
  }, [lastBio, lastInterests, handleSubmit]);

  /** Toggle bookmark for a grant */
  const handleToggleSave = useCallback((match: MatchResult) => {
    setSavedMatches((prev) => {
      const exists = prev.some((item) => item.id === match.id);
      if (exists) {
        return prev.filter((item) => item.id !== match.id);
      }
      return [...prev, match];
    });
  }, []);

  /** Remove from saved list */
  const handleRemoveSaved = useCallback((id: string) => {
    setSavedMatches((prev) => prev.filter((item) => item.id !== id));
  }, []);

  /** Filtered matches based on selected category */
  const filteredMatches = useMemo(() => {
    if (selectedCategory === 'all') return matches;
    return matches.filter((m) => m.category === selectedCategory || m.tags.includes(selectedCategory));
  }, [matches, selectedCategory]);

  /** Category match counts */
  const categoryCounts = useMemo(() => {
    const counts: Record<OpportunityCategory, number> = {
      all: matches.length,
      'ai-tech': 0,
      'health-bio': 0,
      climate: 0,
      social: 0,
      fellowship: 0,
    };

    for (const m of matches) {
      if (m.category && m.category in counts) {
        counts[m.category as OpportunityCategory]++;
      }
    }
    return counts;
  }, [matches]);

  const isCurrentModalSaved = useMemo(() => {
    return activeModalMatch ? savedMatches.some((m) => m.id === activeModalMatch.id) : false;
  }, [activeModalMatch, savedMatches]);

  return (
    <Layout>
      <Header
        savedCount={savedMatches.length}
        onOpenSaved={() => setIsDrawerOpen(true)}
      />

      {viewState === 'idle' && (
        <BioInput onSubmit={handleSubmit} />
      )}

      {viewState === 'loading' && (
        <LoadingSkeleton />
      )}

      {viewState === 'results' && (
        <>
          <div className="results-top-nav">
            <button className="back-button" onClick={handleBack} type="button">
              <span className="back-button__arrow" aria-hidden="true">←</span>
              Start over
            </button>
          </div>

          {matches.length === 0 ? (
            <EmptyState onBack={handleBack} />
          ) : (
            <>
              <div className="results-header">
                <div>
                  <h2 className="results-header__title">Your Matches</h2>
                  <p className="results-header__count">
                    {filteredMatches.length} of {matches.length} curated {matches.length === 1 ? 'opportunity' : 'opportunities'}
                  </p>
                </div>
              </div>

              <FilterBar
                selectedCategory={selectedCategory}
                onSelectCategory={setSelectedCategory}
                counts={categoryCounts}
              />

              <div className="results-list">
                {filteredMatches.map((match, index) => {
                  const isSaved = savedMatches.some((s) => s.id === match.id);
                  return (
                    <OpportunityCard
                      key={match.id}
                      match={match}
                      index={index}
                      isSaved={isSaved}
                      onToggleSave={handleToggleSave}
                      onSelectMatch={setActiveModalMatch}
                    />
                  );
                })}
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

      {/* In-depth Opportunity Modal */}
      <OpportunityModal
        match={activeModalMatch}
        isOpen={Boolean(activeModalMatch)}
        onClose={() => setActiveModalMatch(null)}
        isSaved={isCurrentModalSaved}
        onToggleSave={handleToggleSave}
      />

      {/* Saved Opportunities Drawer */}
      <SavedDrawer
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
        savedMatches={savedMatches}
        onRemove={handleRemoveSaved}
        onSelectMatch={setActiveModalMatch}
      />
    </Layout>
  );
}
