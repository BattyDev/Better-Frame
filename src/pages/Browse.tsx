import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicBuilds } from '../lib/social';
import { BuildCard } from '../components/social/BuildCard';
import type { ItemCategory } from '../types';
import type { SortOption } from '../lib/social';

const CATEGORIES: { value: ItemCategory | 'all'; label: string }[] = [
  { value: 'all', label: 'All' },
  { value: 'Warframe', label: 'Warframes' },
  { value: 'Primary', label: 'Primary' },
  { value: 'Secondary', label: 'Secondary' },
  { value: 'Melee', label: 'Melee' },
];

const SORT_OPTIONS: { value: SortOption; label: string }[] = [
  { value: 'newest', label: 'Newest' },
  { value: 'top', label: 'Top Rated' },
  { value: 'views', label: 'Most Viewed' },
];

const PAGE_SIZE = 24;

export default function Browse() {
  const [category, setCategory] = useState<ItemCategory | 'all'>('all');
  const [sort, setSort] = useState<SortOption>('newest');
  const [search, setSearch] = useState('');
  const [debouncedSearch, setDebouncedSearch] = useState('');
  const [page, setPage] = useState(0);

  // Debounce search input
  function handleSearchChange(value: string) {
    setSearch(value);
    setPage(0);
    clearTimeout((handleSearchChange as { _timer?: ReturnType<typeof setTimeout> })._timer);
    const timer = setTimeout(() => setDebouncedSearch(value), 350);
    (handleSearchChange as { _timer?: ReturnType<typeof setTimeout> })._timer = timer;
  }

  const queryKey = ['browse', category, sort, debouncedSearch, page];

  const { data, isLoading, isError } = useQuery({
    queryKey,
    queryFn: () =>
      fetchPublicBuilds({ category, sort, search: debouncedSearch, page, pageSize: PAGE_SIZE }),
    placeholderData: (prev) => prev,
  });

  const builds = data?.builds ?? [];
  const total = data?.total ?? 0;
  const totalPages = Math.ceil(total / PAGE_SIZE);

  function handleCategoryChange(value: ItemCategory | 'all') {
    setCategory(value);
    setPage(0);
  }

  function handleSortChange(value: SortOption) {
    setSort(value);
    setPage(0);
  }

  return (
    <div className="flex-1 p-4 lg:p-6">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-2xl font-bold text-wf-gold mb-6">Browse Builds</h1>

        {/* Filters */}
        <div className="flex flex-wrap gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 min-w-48">
            <input
              type="text"
              value={search}
              onChange={(e) => handleSearchChange(e.target.value)}
              placeholder="Search builds…"
              className="w-full bg-wf-bg-card border border-wf-border rounded-lg px-3 py-2 text-sm text-wf-text placeholder:text-wf-text-muted focus:outline-none focus:border-wf-border-light"
            />
          </div>

          {/* Category filter */}
          <div className="flex gap-1 bg-wf-bg-card border border-wf-border rounded-lg p-1">
            {CATEGORIES.map((cat) => (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-3 py-1 rounded text-sm font-medium transition-colors ${
                  category === cat.value
                    ? 'bg-wf-gold text-wf-bg-dark'
                    : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-hover'
                }`}
              >
                {cat.label}
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
            {total === 0 ? 'No builds found' : `${total} build${total === 1 ? '' : 's'}`}
            {debouncedSearch && ` matching "${debouncedSearch}"`}
          </p>
        )}

        {/* Grid */}
        {isLoading ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {Array.from({ length: 12 }).map((_, i) => (
              <div key={i} className="h-48 rounded-lg bg-wf-bg-card border border-wf-border animate-pulse" />
            ))}
          </div>
        ) : isError ? (
          <div className="rounded-lg border border-wf-border bg-wf-bg-card p-8 text-center text-wf-danger">
            Failed to load builds. Check your connection.
          </div>
        ) : builds.length === 0 ? (
          <div className="rounded-lg border border-dashed border-wf-border bg-wf-bg-card p-8 text-center">
            <p className="text-wf-text-dim mb-1">No builds found.</p>
            <p className="text-sm text-wf-text-muted">
              Try a different search or filter, or{' '}
              <a href="/builder" className="text-wf-gold hover:underline">create the first one</a>.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
            {builds.map((build) => (
              <BuildCard key={build.id} build={build} />
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
