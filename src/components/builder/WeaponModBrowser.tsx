// Weapon mod browser: searchable, filterable modal for selecting weapon mods
import { useState, useMemo } from 'react';
import { useWeaponBuilderStore } from '../../stores/weaponBuilderStore';
import {
  getWeaponCompatibleMods,
  getWeaponExilusMods,
  getStanceMods,
} from '../../data/weaponData';
import { ModCard } from './ModCard';
import type { ModData, WeaponCategory } from '../../types/gameData';
import type { Polarity } from '../../types';

const POLARITY_OPTIONS: Polarity[] = [
  'madurai', 'vazarin', 'naramon', 'zenurik', 'unairu', 'penjaga',
];

const RARITY_OPTIONS = ['Common', 'Uncommon', 'Rare', 'Legendary'];

export function WeaponModBrowser() {
  const activeModBrowser = useWeaponBuilderStore((s) => s.activeModBrowser);
  const targetSlotIndex = useWeaponBuilderStore((s) => s.targetSlotIndex);
  const closeModBrowser = useWeaponBuilderStore((s) => s.closeModBrowser);
  const setMod = useWeaponBuilderStore((s) => s.setMod);
  const setExilus = useWeaponBuilderStore((s) => s.setExilus);
  const setStance = useWeaponBuilderStore((s) => s.setStance);
  const mods = useWeaponBuilderStore((s) => s.mods);
  const exilus = useWeaponBuilderStore((s) => s.exilus);
  const stance = useWeaponBuilderStore((s) => s.stance);
  const weapon = useWeaponBuilderStore((s) => s.weapon);
  const category = useWeaponBuilderStore((s) => s.category);

  const [search, setSearch] = useState('');
  const [polarityFilter, setPolarityFilter] = useState<Polarity | null>(null);
  const [rarityFilter, setRarityFilter] = useState<string | null>(null);

  const availableMods = useMemo(() => {
    if (!category) return [];
    if (activeModBrowser === 'exilus') return getWeaponExilusMods(category);
    if (activeModBrowser === 'stance') return getStanceMods();
    if (activeModBrowser === 'regular')
      return getWeaponCompatibleMods(category, weapon?.name);
    return [];
  }, [activeModBrowser, category, weapon?.name]);

  const equippedModNames = useMemo(() => {
    const names = new Set<string>();
    for (const entry of mods) {
      if (entry) names.add(entry.mod.uniqueName);
    }
    if (exilus) names.add(exilus.mod.uniqueName);
    if (stance) names.add(stance.mod.uniqueName);
    return names;
  }, [mods, exilus, stance]);

  const filteredMods = useMemo(() => {
    return availableMods.filter((mod) => {
      if (equippedModNames.has(mod.uniqueName)) return false;
      if (search && !mod.name.toLowerCase().includes(search.toLowerCase())) return false;
      if (polarityFilter && mod.polarity !== polarityFilter) return false;
      if (rarityFilter && mod.rarity !== rarityFilter) return false;
      return true;
    });
  }, [availableMods, equippedModNames, search, polarityFilter, rarityFilter]);

  if (!activeModBrowser) return null;

  function handleSelectMod(mod: ModData) {
    const maxRank = mod.fusionLimit;
    if (activeModBrowser === 'exilus') {
      setExilus(mod, maxRank);
    } else if (activeModBrowser === 'stance') {
      setStance(mod, maxRank);
    } else if (activeModBrowser === 'regular' && targetSlotIndex !== null) {
      setMod(targetSlotIndex, mod, maxRank);
    }
    closeModBrowser();
    resetFilters();
  }

  function resetFilters() {
    setSearch('');
    setPolarityFilter(null);
    setRarityFilter(null);
  }

  const title =
    activeModBrowser === 'exilus'
      ? 'Select Exilus Mod'
      : activeModBrowser === 'stance'
        ? 'Select Stance'
        : 'Select Mod';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
      <div className="w-full max-w-2xl max-h-[80vh] bg-wf-bg rounded-lg border border-wf-border
                      shadow-2xl flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b border-wf-border">
          <h3 className="text-lg font-medium text-wf-gold">{title}</h3>
          <button
            onClick={() => { closeModBrowser(); resetFilters(); }}
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

          <div className="flex gap-2 flex-wrap">
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
        </div>

        {/* Mod list */}
        <div className="flex-1 overflow-y-auto p-4">
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

          {filteredMods.length === 0 && (
            <p className="text-sm text-wf-text-muted text-center py-8">
              No mods found
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
