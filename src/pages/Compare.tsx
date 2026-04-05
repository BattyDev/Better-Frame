import { useState, useMemo } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { fetchBuildById } from '../lib/social';
import { getWarframeByUniqueName, getModByUniqueName, getArcaneByUniqueName, getItemImageUrl } from '../data/warframeData';
import { getWeaponByUniqueName } from '../data/weaponData';
import { calculateWarframeStats, formatStatValue, getStatDisplayName } from '../lib/math/warframeCalc';
import type { PublicBuild } from '../types';
import type { ModData, ArcaneData } from '../types/gameData';

// ─── Stat calculation for a build config ────────────────────────────────────

function useCalculatedStats(build: PublicBuild | null | undefined) {
  return useMemo(() => {
    if (!build || build.itemCategory !== 'Warframe') return null;
    const warframe = getWarframeByUniqueName(build.itemUniqueName);
    if (!warframe) return null;

    const allMods: { mod: ModData; rank: number }[] = [];
    for (const entry of [build.config.aura, build.config.exilus, ...build.config.mods]) {
      if (!entry) continue;
      const mod = getModByUniqueName(entry.uniqueName);
      if (mod) allMods.push({ mod, rank: entry.rank });
    }

    const arcaneEntries: { arcane: ArcaneData; rank: number }[] = [];
    for (const entry of build.config.arcanes) {
      if (!entry) continue;
      const arcane = getArcaneByUniqueName(entry.uniqueName);
      if (arcane) arcaneEntries.push({ arcane, rank: entry.rank });
    }

    return calculateWarframeStats(warframe, allMods, arcaneEntries);
  }, [build]);
}

function getItemName(build: PublicBuild): string {
  if (build.itemCategory === 'Warframe') {
    return getWarframeByUniqueName(build.itemUniqueName)?.name ?? build.itemUniqueName;
  }
  return getWeaponByUniqueName(build.itemUniqueName)?.name ?? build.itemUniqueName;
}

function getItemImage(build: PublicBuild): string | null {
  if (build.itemCategory === 'Warframe') {
    const wf = getWarframeByUniqueName(build.itemUniqueName);
    return wf?.imageName ? getItemImageUrl(wf.imageName) : null;
  }
  const weapon = getWeaponByUniqueName(build.itemUniqueName);
  return weapon?.imageName ? getItemImageUrl(weapon.imageName) : null;
}

// ─── Stat comparison row ────────────────────────────────────────────────────

const STAT_ORDER = [
  'health', 'shield', 'armor', 'energy', 'sprintSpeed',
  'abilityStrength', 'abilityDuration', 'abilityRange', 'abilityEfficiency',
];

function ComparisonRow({ statKey, valueA, valueB }: {
  statKey: string;
  valueA: number | undefined;
  valueB: number | undefined;
}) {
  const a = valueA ?? 0;
  const b = valueB ?? 0;
  const diff = b - a;

  return (
    <div className="grid grid-cols-3 gap-2 text-xs py-1">
      <div className={`text-right ${diff < 0 ? 'text-wf-success font-medium' : 'text-wf-text'}`}>
        {formatStatValue(statKey, a)}
      </div>
      <div className="text-center text-wf-text-dim">{getStatDisplayName(statKey)}</div>
      <div className={`text-left ${diff > 0 ? 'text-wf-success font-medium' : 'text-wf-text'}`}>
        {formatStatValue(statKey, b)}
      </div>
    </div>
  );
}

// ─── Build selector ─────────────────────────────────────────────────────────

function BuildIdInput({ label, buildId, onSubmit }: {
  label: string;
  buildId: string;
  onSubmit: (id: string) => void;
}) {
  const [value, setValue] = useState(buildId);

  return (
    <div className="flex items-center gap-2">
      <label className="text-xs text-wf-text-dim">{label}:</label>
      <input
        type="text"
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && onSubmit(value.trim())}
        placeholder="Paste build ID..."
        className="flex-1 px-2 py-1 text-xs rounded bg-wf-bg border border-wf-border text-wf-text placeholder-wf-text-muted focus:border-wf-gold focus:outline-none"
      />
      <button
        onClick={() => onSubmit(value.trim())}
        className="px-2 py-1 text-xs rounded bg-wf-gold text-wf-bg-dark hover:bg-wf-gold-light transition-colors"
      >
        Load
      </button>
    </div>
  );
}

// ─── Build summary card ─────────────────────────────────────────────────────

function BuildCard({ build }: { build: PublicBuild }) {
  const imageUrl = getItemImage(build);
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-wf-bg border border-wf-border">
      {imageUrl && (
        <img src={imageUrl} alt="" className="w-10 h-10 object-contain" />
      )}
      <div className="min-w-0">
        <p className="text-sm font-medium text-wf-text truncate">{build.name}</p>
        <p className="text-xs text-wf-text-dim">{getItemName(build)}</p>
      </div>
    </div>
  );
}

// ─── Main comparison page ───────────────────────────────────────────────────

export default function Compare() {
  const [searchParams, setSearchParams] = useSearchParams();
  const idA = searchParams.get('a') ?? '';
  const idB = searchParams.get('b') ?? '';

  const buildA = useQuery({
    queryKey: ['build', idA],
    queryFn: () => fetchBuildById(idA),
    enabled: !!idA,
  });

  const buildB = useQuery({
    queryKey: ['build', idB],
    queryFn: () => fetchBuildById(idB),
    enabled: !!idB,
  });

  const statsA = useCalculatedStats(buildA.data);
  const statsB = useCalculatedStats(buildB.data);

  const setId = (side: 'a' | 'b', id: string) => {
    const params = new URLSearchParams(searchParams);
    if (id) params.set(side, id);
    else params.delete(side);
    setSearchParams(params);
  };

  // Collect all stat keys from both builds
  const allStatKeys = useMemo(() => {
    const keys = new Set(STAT_ORDER);
    if (statsA) Object.keys(statsA.modded).forEach(k => keys.add(k));
    if (statsB) Object.keys(statsB.modded).forEach(k => keys.add(k));
    return [...keys];
  }, [statsA, statsB]);

  return (
    <div className="max-w-3xl mx-auto space-y-6">
      <h1 className="text-xl font-bold text-wf-gold">Compare Builds</h1>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        <div className="space-y-2">
          <BuildIdInput label="Build A" buildId={idA} onSubmit={(id) => setId('a', id)} />
          {buildA.data && <BuildCard build={buildA.data} />}
          {buildA.isLoading && <p className="text-xs text-wf-text-muted">Loading...</p>}
          {buildA.error && <p className="text-xs text-wf-danger">Build not found</p>}
        </div>
        <div className="space-y-2">
          <BuildIdInput label="Build B" buildId={idB} onSubmit={(id) => setId('b', id)} />
          {buildB.data && <BuildCard build={buildB.data} />}
          {buildB.isLoading && <p className="text-xs text-wf-text-muted">Loading...</p>}
          {buildB.error && <p className="text-xs text-wf-danger">Build not found</p>}
        </div>
      </div>

      {/* Stat comparison table */}
      {statsA && statsB && (
        <div className="p-4 rounded-lg bg-wf-bg-card border border-wf-border">
          <h2 className="text-sm font-medium text-wf-gold mb-3">Stat Comparison</h2>

          {/* Headers */}
          <div className="grid grid-cols-3 gap-2 text-xs mb-2 pb-2 border-b border-wf-border">
            <div className="text-right text-wf-text-dim font-medium">
              {buildA.data ? getItemName(buildA.data) : 'Build A'}
            </div>
            <div className="text-center text-wf-text-muted">Stat</div>
            <div className="text-left text-wf-text-dim font-medium">
              {buildB.data ? getItemName(buildB.data) : 'Build B'}
            </div>
          </div>

          {allStatKeys.map((statKey) => (
            <ComparisonRow
              key={statKey}
              statKey={statKey}
              valueA={statsA.modded[statKey]}
              valueB={statsB.modded[statKey]}
            />
          ))}

          {/* Set bonus comparison */}
          {(statsA.setBonuses.length > 0 || statsB.setBonuses.length > 0) && (
            <div className="mt-3 pt-3 border-t border-wf-border">
              <h3 className="text-xs font-medium text-wf-accent mb-2">Set Bonuses</h3>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  {statsA.setBonuses.map((sb) => (
                    <p key={sb.data.setKey} className="text-xs text-wf-success">
                      {sb.data.name} ({sb.equippedCount})
                    </p>
                  ))}
                  {statsA.setBonuses.length === 0 && (
                    <p className="text-xs text-wf-text-muted">None</p>
                  )}
                </div>
                <div className="space-y-1">
                  {statsB.setBonuses.map((sb) => (
                    <p key={sb.data.setKey} className="text-xs text-wf-success">
                      {sb.data.name} ({sb.equippedCount})
                    </p>
                  ))}
                  {statsB.setBonuses.length === 0 && (
                    <p className="text-xs text-wf-text-muted">None</p>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {!statsA && !statsB && idA && idB && !buildA.isLoading && !buildB.isLoading && (
        <p className="text-sm text-wf-text-muted text-center py-8">
          Stat comparison is available for Warframe builds. Load two Warframe builds to compare.
        </p>
      )}

      {!idA && !idB && (
        <p className="text-sm text-wf-text-muted text-center py-8">
          Enter two build IDs to compare their stats side by side.
        </p>
      )}
    </div>
  );
}
