// Mod browser/picker: searchable, filterable modal for selecting mods
import { useState, useMemo } from 'react';
import { useBuilderStore } from '../../stores/builderStore';
import {
  getWarframeCompatibleMods,
  getAuraMods,
  getExilusMods,
  getWarframeArcanes,
} from '../../data/warframeData';
import { ModCard } from './ModCard';
import type { ModData } from '../../types/gameData';
import type { ArcaneData } from '../../types/gameData';
import type { Polarity } from '../../types';

const POLARITY_OPTIONS: Polarity[] = [
  'madurai', 'vazarin', 'naramon', 'zenurik', 'unairu', 'penjaga', 'umbra',
];

const RARITY_OPTIONS = ['Common', 'Uncommon', 'Rare', 'Legendary'];

export function ModBrowser() {
  const activeModBrowser = useBuilderStore((s) => s.activeModBrowser);
  const targetSlotIndex = useBuilderStore((s) => s.targetSlotIndex);
  const closeModBrowser = useBuilderStore((s) => s.closeModBrowser);
  const setMod = useBuilderStore((s) => s.setMod);
  const setAura = useBuilderStore((s) => s.setAura);
  const setExilus = useBuilderStore((s) => s.setExilus);
  const setArcane = useBuilderStore((s) => s.setArcane);
  const mods = useBuilderStore((s) => s.mods);
  const aura = useBuilderStore((s) => s.aura);
  const exilus = useBuilderStore((s) => s.exilus);

  const [search, setSearch] = useState('');
  const [polarityFilter, setPolarityFilter] = useState<Polarity | null>(null);
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);

  // Get the right mod list based on browser type
  const availableMods = useMemo(() => {
    if (activeModBrowser === 'aura') return getAuraMods();
    if (activeModBrowser === 'exilus') return getExilusMods();
    if (activeModBrowser === 'regular') return getWarframeCompatibleMods();
    return [];
  }, [activeModBrowser]);

  const availableArcanes = useMemo(() => {
    if (activeModBrowser === 'arcane') return getWarframeArcanes();
    return [];
  }, [activeModBrowser]);

  // Get currently equipped mod unique names to prevent duplicates
  const equippedModNames = useMemo(() => {
    const names = new Set<string>();
    for (const entry of mods) {
      if (entry) names.add(entry.mod.uniqueName);
    }
    if (aura) names.add(aura.mod.uniqueName);
    if (exilus) names.add(exilus.mod.uniqueName);
    return names;
  }, [mods, aura, exilus]);

  const filteredMods = useMemo(() => {
    return availableMods.filter((mod) => {
      // Exclude already equipped mods (no duplicates)
      if (equippedModNames.has(mod.uniqueName)) return false;

      if (search && !mod.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (polarityFilter && mod.polarity !== polarityFilter) return false;
      if (rarityFilter && mod.rarity !== rarityFilter) return false;
      return true;
    });
  }, [availableMods, equippedModNames, search, polarityFilter, rarityFilter]);

  const filteredArcanes = useMemo(() => {
    if (activeModBrowser !== 'arcane') return [];
    return availableArcanes.filter((arcane) => {
      if (search && !arcane.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [availableArcanes, activeModBrowser, search]);

  if (!activeModBrowser) return null;

  function handleSelectMod(mod: ModData) {
    const maxRank = mod.fusionLimit;
    if (activeModBrowser === 'aura') {
      setAura(mod, maxRank);
    } else if (activeModBrowser === 'exilus') {
      setExilus(mod, maxRank);
    } else if (activeModBrowser === 'regular' && targetSlotIndex !== null) {
      setMod(targetSlotIndex, mod, maxRank);
    }
    closeModBrowser();
    setSearch('');
    setPolarityFilter(null);
    setRarityFilter(null);
  }

  function handleSelectArcane(arcane: ArcaneData) {
    if (targetSlotIndex !== null) {
      const maxRank = arcane.levelStats ? arcane.levelStats.length - 1 : 0;
      setArcane(targetSlotIndex as 0 | 1, arcane, maxRank);
    }
    closeModBrowser();
    setSearch('');
  }

  const title =
    activeModBrowser === 'aura'
      ? 'Select Aura'
      : activeModBrowser === 'exilus'
        ? 'Select Exilus Mod'
        : activeModBrowser === 'arcane'
          ? 'Select Arcane'
          : 'Select Mod';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl max-h-[80vh] bg-wf-bg rounded-lg border border-wf-border
                      shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wf-border">
          <h3 className="text-lg font-medium text-wf-gold">{title}</h3>
          <button
            onClick={() => {
              closeModBrowser();
              setSearch('');
              setPolarityFilter(null);
              setRarityFilter(null);
            }}
            className="text-wf-text-muted hover:text-wf-text transition-colors"
          >
            Close
          </button>
        </div>

        {/* Filters */}
        <div className="p-4 space-y-3 border-b border-wf-border">
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search..."
            autoFocus
            className="w-full px-3 py-2 rounded bg-wf-bg-dark border border-wf-border
                       text-wf-text text-sm placeholder:text-wf-text-muted
                       focus:outline-none focus:border-wf-gold-dim"
          />

          {activeModBrowser !== 'arcane' && (
            <div className="flex gap-2 flex-wrap">
              {/* Polarity filter */}
              <div className="flex gap-1">
                {POLARITY_OPTIONS.map((pol) => (
                  <button
                    key={pol}
                    onClick={() => setPolarityFilter(polarityFilter === pol ? null : pol)}
                    className={`
                      px-2 py-1 rounded text-xs transition-colors capitalize
                      ${polarityFilter === pol
                        ? 'bg-wf-gold/20 text-wf-gold border border-wf-gold'
                        : 'bg-wf-bg-dark text-wf-text-dim border border-wf-border hover:border-wf-border-light'
                      }
                    `}
                  >
                    {pol}
                  </button>
                ))}
              </div>

              {/* Rarity filter */}
              <div className="flex gap-1">
                {RARITY_OPTIONS.map((rarity) => (
                  <button
                    key={rarity}
                    onClick={() => setRarityFilter(rarityFilter === rarity ? null : rarity)}
                    className={`
                      px-2 py-1 rounded text-xs transition-colors
                      ${rarityFilter === rarity
                        ? 'bg-wf-gold/20 text-wf-gold border border-wf-gold'
                        : 'bg-wf-bg-dark text-wf-text-dim border border-wf-border hover:border-wf-border-light'
                      }
                    `}
                  >
                    {rarity}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Mod list */}
        <div className="flex-1 overflow-y-auto p-4">
          {activeModBrowser === 'arcane' ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredArcanes.map((arcane) => (
                <button
                  key={arcane.uniqueName}
                  onClick={() => handleSelectArcane(arcane)}
                  className="flex items-center gap-2 p-2 rounded border border-wf-border
                             bg-wf-bg-card hover:bg-wf-bg-hover transition-colors text-left"
                >
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-wf-text truncate">{arcane.name}</div>
                    <div className="text-xs text-wf-text-muted truncate">
                      {arcane.levelStats?.[arcane.levelStats.length - 1]?.stats?.[0]?.slice(0, 50)}
                    </div>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
              {filteredMods.map((mod) => (
                <ModCard
                  key={mod.uniqueName}
                  mod={mod}
                  rank={mod.fusionLimit}
                  compact
                  onClick={() => handleSelectMod(mod)}
                />
              ))}
            </div>
          )}

          {((activeModBrowser !== 'arcane' && filteredMods.length === 0) ||
            (activeModBrowser === 'arcane' && filteredArcanes.length === 0)) && (
            <p className="text-sm text-wf-text-muted text-center py-8">
              No {activeModBrowser === 'arcane' ? 'arcanes' : 'mods'} found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
