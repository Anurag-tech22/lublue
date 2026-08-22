import React from 'react';
import type { OpportunityCategory } from '../types';

interface FilterBarProps {
  selectedCategory: OpportunityCategory;
  onSelectCategory: (category: OpportunityCategory) => void;
  counts: Record<OpportunityCategory, number>;
}

const CATEGORIES: { id: OpportunityCategory; label: string }[] = [
  { id: 'all', label: 'All Matches' },
  { id: 'ai-tech', label: 'AI & Tech' },
  { id: 'health-bio', label: 'Health & Bio' },
  { id: 'climate', label: 'Climate & Earth' },
  { id: 'social', label: 'Social Sciences' },
  { id: 'fellowship', label: 'Fellowships' },
];

/**
 * FilterBar allows researchers to quickly narrow down matches
 * by scientific discipline or funding type.
 */
export function FilterBar({
  selectedCategory,
  onSelectCategory,
  counts,
}: FilterBarProps): React.JSX.Element {
  return (
    <nav className="filter-bar" aria-label="Filter opportunities by category">
      <div className="filter-bar__track">
        {CATEGORIES.map((cat) => {
          const count = counts[cat.id] ?? 0;
          const isSelected = selectedCategory === cat.id;

          return (
            <button
              key={cat.id}
              type="button"
              className={`filter-bar__pill ${isSelected ? 'filter-bar__pill--active' : ''}`}
              onClick={() => onSelectCategory(cat.id)}
              aria-pressed={isSelected}
            >
              <span className="filter-bar__pill-label">{cat.label}</span>
              {count > 0 && (
                <span className="filter-bar__pill-count">{count}</span>
              )}
            </button>
          );
        })}
      </div>
    </nav>
  );
}
