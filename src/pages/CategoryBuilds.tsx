import { useState } from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchPublicBuilds, type SortOption } from '../lib/social';
import { BuildCard } from '../components/social/BuildCard';
import { getWarframeByUniqueName, getItemImageUrl } from '../data/warframeData';
import { getWeaponByUniqueName } from '../data/weaponData';
import { getArchwingByUniqueName, getCompanionByUniqueName, getNecramechByUniqueName } from '../data/equipmentData';
import type { ItemCategory } from '../types';

const CATEGORY_MAP: Record<string, { label: string; itemCategory: ItemCategory; builderRoute: string }> = {
  warframe: { label: 'Warframes', itemCategory: 'Warframe', builderRoute: '/builder' },
  primary: { label: 'Primary Weapons', itemCategory: 'Primary', builderRoute: '/builder/primary' },
  secondary: { label: 'Secondary Weapons', itemCategory: 'Secondary', builderRoute: '/builder/secondary' },
  melee: { label: 'Melee Weapons', itemCategory: 'Melee', builderRoute: '/builder/melee' },
  companion: { label: 'Companions', itemCategory: 'Companion', builderRoute: '/builder/companion' },
  archwing: { label: 'Archwing', itemCategory: 'Archwing', builderRoute: '/builder/archwing' },
  necramech: { label: 'Necramech', itemCategory: 'Necramech', builderRoute: '/builder/necramech' },
};

function ItemHeader({ uniqueName, category }: { uniqueName: string; category: string }) {
  let item: { name: string; imageName?: string } | undefined;
  switch (category) {
    case 'Warframe':
      item = getWarframeByUniqueName(uniqueName);
      break;
    case 'Archwing':
      item = getArchwingByUniqueName(uniqueName);
      break;
    case 'Companion':
      item = getCompanionByUniqueName(uniqueName);
      break;
    case 'Necramech':
      item = getNecramechByUniqueName(uniqueName);
      break;
    default:
      item = getWeaponByUniqueName(uniqueName);
  }

  if (!item) return null;

  const imageUrl = item.imageName ? getItemImageUrl(item.imageName) : null;

  return (
    <div className="flex items-center gap-4 mb-6 p-4 rounded-lg bg-wf-bg-card border border-wf-border">
      {imageUrl && (
        <img src={imageUrl} alt={item.name} className="w-16 h-16 object-contain" />
      )}
      <div>
        <h2 className="text-lg font-bold text-wf-gold">{item.name}</h2>
        <p className="text-xs text-wf-text-muted">{category}</p>
      </div>
    </div>
  );
}

export function CategoryBuilds() {
  const { category } = useParams<{ category: string }>();
  const [searchParams] = useSearchParams();
  const itemUniqueName = searchParams.get('item') ?? undefined;

  const config = category ? CATEGORY_MAP[category.toLowerCase()] : undefined;
  const [sort, setSort] = useState<SortOption>('top');
  const [page, setPage] = useState(0);
  const pageSize = 24;

  const { data, isLoading } = useQuery({
    queryKey: ['categoryBuilds', config?.itemCategory, sort, page, itemUniqueName],
    queryFn: () =>
      fetchPublicBuilds({
        category: config!.itemCategory,
        sort,
        page,
        pageSize,
        itemUniqueName,
      }),
    enabled: !!config,
    staleTime: 30_000,
  });

  if (!config) {
    return (
      <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto">
        <p className="text-wf-text-muted">Unknown category.</p>
        <Link to="/" className="text-wf-gold hover:underline text-sm">
          Back to Home
        </Link>
      </div>
    );
  }

  const totalPages = Math.ceil((data?.total ?? 0) / pageSize);

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-5xl mx-auto w-full">
      {/* Back link */}
      <Link to="/" className="text-sm text-wf-text-muted hover:text-wf-text mb-4 inline-block">
        &larr; Home
      </Link>

      <h1 className="text-2xl font-bold text-wf-gold mb-4">{config.label}</h1>

      {/* Item header if filtering by specific item */}
      {itemUniqueName && (
        <ItemHeader uniqueName={itemUniqueName} category={config.itemCategory} />
      )}

      {/* Create your own prompt */}
      <div className="mb-6 p-4 rounded-lg bg-wf-bg-card border border-wf-gold-dim flex items-center justify-between">
        <div>
          <p className="text-sm text-wf-text">
            Build your own {config.label.toLowerCase().replace(/s$/, '')}
          </p>
          <p className="text-xs text-wf-text-dim">
            Use the builder with full stat calculations and mod planning.
          </p>
        </div>
        <Link
          to={config.builderRoute}
          className="px-4 py-2 bg-wf-gold text-wf-bg-dark font-semibold rounded-lg hover:bg-wf-gold-light transition-colors text-sm shrink-0"
        >
          Create Build
        </Link>
      </div>

      {/* Sort controls */}
      <div className="flex items-center gap-2 mb-4">
        {([
          { key: 'top' as SortOption, label: 'Top Rated' },
          { key: 'newest' as SortOption, label: 'Newest' },
          { key: 'views' as SortOption, label: 'Most Viewed' },
        ]).map((s) => (
          <button
            key={s.key}
            onClick={() => { setSort(s.key); setPage(0); }}
            className={`px-3 py-1.5 rounded-md text-sm font-medium transition-colors ${
              sort === s.key
                ? 'bg-wf-gold/20 text-wf-gold border border-wf-gold/30'
                : 'text-wf-text-dim hover:text-wf-text hover:bg-wf-bg-hover border border-transparent'
            }`}
          >
            {s.label}
          </button>
        ))}
      </div>

      {/* Builds grid */}
      {isLoading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="h-48 rounded-lg bg-wf-bg-card border border-wf-border animate-pulse" />
          ))}
        </div>
      ) : (data?.builds?.length ?? 0) > 0 ? (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {data!.builds.map((build) => (
              <BuildCard key={build.id} build={build} />
            ))}
          </div>

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-4 mt-6">
              <button
                onClick={() => setPage((p) => Math.max(0, p - 1))}
                disabled={page === 0}
                className="px-3 py-1.5 text-sm rounded border border-wf-border text-wf-text-dim
                           hover:bg-wf-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Previous
              </button>
              <span className="text-sm text-wf-text-muted">
                Page {page + 1} of {totalPages}
              </span>
              <button
                onClick={() => setPage((p) => p + 1)}
                disabled={page >= totalPages - 1}
                className="px-3 py-1.5 text-sm rounded border border-wf-border text-wf-text-dim
                           hover:bg-wf-bg-hover disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
              >
                Next
              </button>
            </div>
          )}
        </>
      ) : (
        <div className="text-center py-12 rounded-lg border border-dashed border-wf-border bg-wf-bg-card">
          <p className="text-wf-text-muted mb-2">No builds found{itemUniqueName ? ' for this item' : ''}.</p>
          <Link to={config.builderRoute} className="text-sm text-wf-gold hover:underline">
            Create the first one
          </Link>
        </div>
      )}
    </div>
  );
}
