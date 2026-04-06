import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicLoadouts } from '../lib/social';
import { LoadoutCard } from '../components/social/LoadoutCard';
import type { FocusSchool } from '../types';
import type { SortOption } from '../lib/social';

const FOCUS_OPTIONS: { value: FocusSchool | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Madurai', label: 'Madurai' },
  { value: 'Vazarin', label: 'Vazarin' },
  { value: 'Naramon', label: 'Naramon' },
  { value: 'Zenurik', label: 'Zenurik' },
  { value: 'Unairu', label: 'Unairu' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'top', label: 'Top Rated' },
  { value: 'views', label: 'Most Viewed' },
];

const PAGE_SIZE = 24;

export default function BrowseLoadouts() {
  const [focusSchool, setFocusSchool] = useState<FocusSchool | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);

  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(0);
    clearTimeout((handleSearchChange as { _timer?: ReturnType<typeof setTimeout> })._timer);
    const timer = setTimeout(() => setDebouncedSearch(value), 350);
    (handleSearchChange as { _timer?: ReturnType<typeof setTimeout> })._timer = timer;
  }

  const queryKey = ['browseLoadouts', focusSchool, sort, debouncedSearch, page];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      fetchPublicLoadouts({
        focusSchool,
        sort,
        search: debouncedSearch,
        page,
        pageSize: PAGE_SIZE,
      }),
    placeholderData: (prev) => prev,
  });

  const loadouts = data?.loadouts ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function handleFocusChange(value: FocusSchool | 'all') {
    setFocusSchool(value);
    setPage(0);
  }

  function handleSortChange(value: SortOption) {
    setSort(value);
    setPage(0);
  }

  return (
    <div className="flex-1 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-wf-gold mb-6">Browse Loadouts</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-48">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search loadouts…"
              className="w-full bg-wf-bg-card border border-wf-border rounded-lg px-3 py-2 text-sm text-wf-text placeholder:text-wf-text-muted focus:outline-none focus:border-wf-border-light"
            />
          </div>

          {/* Focus School filter */}
          <div className="flex gap-1 bg-wf-bg-card border border-wf-border rounded-lg p-1">
            {FOCUS_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleFocusChange(opt.value)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  focusSchool === opt.value
                    ? 'bg-wf-gold text-wf-bg-dark'
                    : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-hover'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>

          {/* Sort */}
          <div className="flex gap-1 bg-wf-bg-card border border-wf-border rounded-lg p-1">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => handleSortChange(opt.value)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  sort === opt.value
                    ? 'bg-wf-bg-hover text-wf-text border border-wf-border-light'
                    : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-hover'
                }`}
              >
                {opt.label}
              </button>
            ))}
          </div>
        </div>

        {/* Results summary */}
        {!isLoading && (
          <p className="text-sm text-wf-text-muted mb-4">
            {total === 0 ? 'No loadouts found' : `${total} loadout${total === 1 ? '' : 's'}`}
            {debouncedSearch && ` matching "${debouncedSearch}"`}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-40 rounded-lg bg-wf-bg-card border border-wf-border animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-wf-border bg-wf-bg-card p-8 text-center text-wf-danger">
            Failed to load loadouts. Check your connection.
          </div>
        ) : loadouts.length === 0 ? (
          <div className="rounded-lg border border-dashed border-wf-border bg-wf-bg-card p-8 text-center">
            <p className="text-wf-text-dim mb-1">No loadouts found.</p>
            <p className="text-sm text-wf-text-muted">
              Try a different search or filter, or{' '}
              <a href="/loadout" className="text-wf-gold hover:underline">create the first one</a>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
            {loadouts.map((loadout) => (
              <LoadoutCard key={loadout.id} loadout={loadout} />
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-2 mt-8">
            <button
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              className="px-3 py-1.5 text-sm border border-wf-border rounded text-wf-text-dim hover:text-wf-text hover:border-wf-border-light transition-colors disabled:opacity-40"
            >
              ← Prev
            </button>
            <span className="text-sm text-wf-text-muted">
              Page {page + 1} of {totalPages}
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page >= totalPages - 1}
              className="px-3 py-1.5 text-sm border border-wf-border rounded text-wf-text-dim hover:text-wf-text hover:border-wf-border-light transition-colors disabled:opacity-40"
            >
              Next →
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
