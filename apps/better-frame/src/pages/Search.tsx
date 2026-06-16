import { useMemo, useState } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { searchWarframes, getItemImageUrl } from '../data/warframeData';
import { searchWeapons } from '../data/weaponData';
import { searchCompanions, searchArchwings } from '../data/equipmentData';
import { fetchPublicBuilds, searchPublicLoadouts } from '../lib/social';
import { BuildCard } from '../components/social/BuildCard';

type FilterType = 'all' | 'warframes' | 'weapons' | 'companions' | 'builds' | 'loadouts';

interface ItemResult {
  name: string;
  uniqueName: string;
  category: string;
  imageUrl: string | null;
  to: string;
}

function useItemSearch(query: string): ItemResult[] {
  return useMemo(() => {
    if (query.length < 2) return [];
    const results: ItemResult[] = [];

    for (const wf of searchWarframes(query)) {
      results.push({
        name: wf.name,
        uniqueName: wf.uniqueName,
        category: 'Warframe',
        imageUrl: wf.imageName ? getItemImageUrl(wf.imageName) : null,
        to: `/builds/warframe?item=${encodeURIComponent(wf.uniqueName)}`,
      });
    }

    for (const w of searchWeapons(query)) {
      results.push({
        name: w.name,
        uniqueName: w.uniqueName,
        category: w.category,
        imageUrl: w.imageName ? getItemImageUrl(w.imageName) : null,
        to: `/builds/${w.category.toLowerCase()}?item=${encodeURIComponent(w.uniqueName)}`,
      });
    }

    for (const c of searchCompanions(query)) {
      results.push({
        name: c.name,
        uniqueName: c.uniqueName,
        category: 'Companion',
        imageUrl: c.imageName ? getItemImageUrl(c.imageName) : null,
        to: `/builds/companion?item=${encodeURIComponent(c.uniqueName)}`,
      });
    }

    for (const a of searchArchwings(query)) {
      results.push({
        name: a.name,
        uniqueName: a.uniqueName,
        category: 'Archwing',
        imageUrl: a.imageName ? getItemImageUrl(a.imageName) : null,
        to: `/builds/archwing?item=${encodeURIComponent(a.uniqueName)}`,
      });
    }

    return results;
  }, [query]);
}

export function Search() {
  const [searchParams] = useSearchParams();
  const query = searchParams.get('q') ?? '';
  const [filter, setFilter] = useState<FilterType>('all');

  const itemResults = useItemSearch(query);

  const { data: buildResults } = useQuery({
    queryKey: ['searchBuilds', query],
    queryFn: () => fetchPublicBuilds({ search: query, pageSize: 12 }),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });

  const { data: loadoutResults } = useQuery({
    queryKey: ['searchLoadouts', query],
    queryFn: () => searchPublicLoadouts(query, 0, 12),
    enabled: query.length >= 2,
    staleTime: 30_000,
  });

  const filters: { key: FilterType; label: string }[] = [
    { key: 'all', label: 'All' },
    { key: 'warframes', label: 'Warframes' },
    { key: 'weapons', label: 'Weapons' },
    { key: 'companions', label: 'Companions' },
    { key: 'builds', label: 'Builds' },
    { key: 'loadouts', label: 'Loadouts' },
  ];

  const filteredItems = useMemo(() => {
    if (filter === 'all') return itemResults;
    if (filter === 'warframes') return itemResults.filter((i) => i.category === 'Warframe');
    if (filter === 'weapons')
      return itemResults.filter((i) =>
        ['Primary', 'Secondary', 'Melee'].includes(i.category),
      );
    if (filter === 'companions') return itemResults.filter((i) => i.category === 'Companion');
    return [];
  }, [itemResults, filter]);

  const showItems = filter === 'all' || filter === 'warframes' || filter === 'weapons' || filter === 'companions';
  const showBuilds = filter === 'all' || filter === 'builds';
  const showLoadouts = filter === 'all' || filter === 'loadouts';

  if (!query) {
    return (
      <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto">
        <p className="text-wf-text-muted">Enter a search term to find warframes, weapons, builds, and loadouts.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
      <h1 className="text-xl font-bold text-wf-text mb-1">
        Search results for "{query}"
      </h1>

      {/* Filter tabs */}
      <div className="flex gap-1 mb-6 overflow-x-auto">
        {filters.map((f) => (
          <button
            key={f.key}
            onClick={() => setFilter(f.key)}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors whitespace-nowrap ${
              filter === f.key
                ? 'bg-wf-gold/20 text-wf-gold border border-wf-gold/30'
                : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-hover border border-transparent'
            }`}
          >
            {f.label}
          </button>
        ))}
      </div>

      {/* Items section */}
      {showItems && filteredItems.length > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-wf-text-muted uppercase tracking-wide mb-3">
            Items ({filteredItems.length})
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
            {filteredItems.map((item) => (
              <Link
                key={item.uniqueName}
                to={item.to}
                className="flex flex-col items-center p-3 rounded-lg bg-wf-bg-card border border-wf-border
                           hover:border-wf-gold-dim hover:bg-wf-bg-hover transition-colors group"
              >
                {item.imageUrl ? (
                  <img
                    src={item.imageUrl}
                    alt={item.name}
                    className="w-12 h-12 object-contain mb-2 group-hover:scale-105 transition-transform"
                  />
                ) : (
                  <div className="w-12 h-12 mb-2 flex items-center justify-center text-wf-text-muted text-xs">
                    {item.category}
                  </div>
                )}
                <span className="text-xs text-wf-text text-center truncate w-full">
                  {item.name}
                </span>
                <span className="text-xs text-wf-text-muted">{item.category}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* Builds section */}
      {showBuilds && (buildResults?.builds?.length ?? 0) > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-wf-text-muted uppercase tracking-wide mb-3">
            Builds ({buildResults!.total})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {buildResults!.builds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>
        </section>
      )}

      {/* Loadouts section */}
      {showLoadouts && (loadoutResults?.loadouts?.length ?? 0) > 0 && (
        <section className="mb-8">
          <h2 className="text-sm font-semibold text-wf-text-muted uppercase tracking-wide mb-3">
            Loadouts ({loadoutResults!.total})
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {loadoutResults!.loadouts.map((loadout) => (
              <Link
                key={loadout.id}
                to={`/loadout/${loadout.id}`}
                className="block p-4 rounded-lg bg-wf-bg-card border border-wf-border
                           hover:border-wf-border-light hover:bg-wf-bg-hover transition-colors"
              >
                <h3 className="text-sm font-medium text-wf-text truncate">{loadout.name}</h3>
                {loadout.description && (
                  <p className="text-xs text-wf-text-dim mt-1 truncate">{loadout.description}</p>
                )}
                <p className="text-xs text-wf-text-muted mt-2">
                  by{' '}
                  <span className="text-wf-blue">{loadout.author.username}</span>
                </p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* No results */}
      {showItems && filteredItems.length === 0 && showBuilds && (buildResults?.builds?.length ?? 0) === 0 && showLoadouts && (loadoutResults?.loadouts?.length ?? 0) === 0 && (
        <div className="text-center py-12">
          <p className="text-wf-text-muted">No results found for "{query}".</p>
          <p className="text-sm text-wf-text-muted mt-1">
            Try a different search term or{' '}
            <Link to="/builder" className="text-wf-gold hover:underline">
              create a new build
            </Link>
            .
          </p>
        </div>
      )}
    </div>
  );
}
