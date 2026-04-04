// Warframe selector: searchable grid with images from CDN
import { useState, useMemo } from 'react';
import { getAllWarframes, getItemImageUrl } from '../../data/warframeData';
import { useBuilderStore } from '../../stores/builderStore';
import type { WarframeData } from '../../types/gameData';

export function WarframeSelector() {
  const [search, setSearch] = useState('');
  const [showPrimeOnly, setShowPrimeOnly] = useState(false);
  const warframe = useBuilderStore((s) => s.warframe);
  const selectWarframe = useBuilderStore((s) => s.selectWarframe);

  const allWarframes = useMemo(() => getAllWarframes(), []);

  const filtered = useMemo(() => {
    let list = allWarframes;
    if (showPrimeOnly) {
      list = list.filter((wf) => wf.isPrime);
    }
    if (search) {
      const lower = search.toLowerCase();
      list = list.filter((wf) => wf.name.toLowerCase().includes(lower));
    }
    // Sort: Prime variants first, then alphabetically
    return list.sort((a, b) => {
      if (a.isPrime !== b.isPrime) return a.isPrime ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [allWarframes, search, showPrimeOnly]);

  if (warframe) {
    return <SelectedWarframeHeader warframe={warframe} />;
  }

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-wf-gold">Select Warframe</h2>

      {/* Search and filters */}
      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search warframes..."
          className="flex-1 px-3 py-2 rounded bg-wf-bg-dark border border-wf-border
                     text-wf-text text-sm placeholder:text-wf-text-muted
                     focus:outline-none focus:border-wf-gold-dim"
        />
        <button
          onClick={() => setShowPrimeOnly(!showPrimeOnly)}
          className={`
            px-3 py-2 rounded border text-sm transition-colors
            ${showPrimeOnly
              ? 'border-wf-gold text-wf-gold bg-wf-gold/10'
              : 'border-wf-border text-wf-text-dim hover:border-wf-border-light'
            }
          `}
        >
          Prime
        </button>
      </div>

      {/* Grid */}
      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {filtered.map((wf) => (
          <button
            key={wf.uniqueName}
            onClick={() => selectWarframe(wf)}
            className="flex flex-col items-center p-2 rounded-lg border border-transparent
                       hover:border-wf-gold-dim hover:bg-wf-bg-hover transition-colors group"
          >
            <img
              src={getItemImageUrl(wf.imageName)}
              alt={wf.name}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              loading="lazy"
            />
            <span className="text-xs text-wf-text-dim mt-1 text-center leading-tight">
              {wf.name}
            </span>
            {wf.isPrime && (
              <span className="text-[10px] text-wf-gold-dim">Prime</span>
            )}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-wf-text-muted text-center py-8">
          No warframes found matching "{search}"
        </p>
      )}
    </div>
  );
}

function SelectedWarframeHeader({ warframe }: { warframe: WarframeData }) {
  const clearWarframe = useBuilderStore((s) => s.clearWarframe);

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-wf-bg-card border border-wf-border">
      <img
        src={getItemImageUrl(warframe.imageName)}
        alt={warframe.name}
        className="w-16 h-16 object-contain"
      />
      <div className="flex-1">
        <h2 className="text-lg font-medium text-wf-gold">{warframe.name}</h2>
        <p className="text-xs text-wf-text-muted">
          Health {warframe.health} | Shield {warframe.shield} | Armor {warframe.armor} | Energy{' '}
          {warframe.power}
        </p>
      </div>
      <button
        onClick={clearWarframe}
        className="px-3 py-1.5 text-sm rounded border border-wf-border text-wf-text-dim
                   hover:border-wf-danger hover:text-wf-danger transition-colors"
      >
        Change
      </button>
    </div>
  );
}
