// Weapon selector: searchable grid with images from CDN, variant filtering, MR display
import { useState, useMemo } from 'react';
import { getWeaponsByCategory, searchWeapons } from '../../data/weaponData';
import { getItemImageUrl } from '../../data/warframeData';
import { useWeaponBuilderStore } from '../../stores/weaponBuilderStore';
import type { WeaponData, WeaponCategory } from '../../types/gameData';

interface WeaponSelectorProps {
  category: WeaponCategory;
}

export function WeaponSelector({ category }: WeaponSelectorProps) {
  const [search, setSearch] = useState('');
  const [showPrimeOnly, setShowPrimeOnly] = useState(false);
  const weapon = useWeaponBuilderStore((s) => s.weapon);
  const selectWeapon = useWeaponBuilderStore((s) => s.selectWeapon);

  const allWeapons = useMemo(() => getWeaponsByCategory(category), [category]);

  const filtered = useMemo(() => {
    let list = allWeapons;
    if (showPrimeOnly) {
      list = list.filter((w) => w.isPrime);
    }
    if (search) {
      const lower = search.toLowerCase();
      list = list.filter((w) => w.name.toLowerCase().includes(lower));
    }
    return list.sort((a, b) => {
      if (a.isPrime !== b.isPrime) return a.isPrime ? -1 : 1;
      return a.name.localeCompare(b.name);
    });
  }, [allWeapons, search, showPrimeOnly]);

  if (weapon) {
    return <SelectedWeaponHeader weapon={weapon} />;
  }

  const label = category === 'Primary' ? 'Primary Weapon'
    : category === 'Secondary' ? 'Secondary Weapon'
    : 'Melee Weapon';

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-medium text-wf-gold">Select {label}</h2>

      <div className="flex gap-3">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder={`Search ${category.toLowerCase()} weapons...`}
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

      <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 lg:grid-cols-8 gap-2">
        {filtered.map((w) => (
          <button
            key={w.uniqueName}
            onClick={() => selectWeapon(w)}
            className="flex flex-col items-center p-2 rounded-lg border border-transparent
                       hover:border-wf-gold-dim hover:bg-wf-bg-hover transition-colors group"
          >
            <img
              src={getItemImageUrl(w.imageName)}
              alt={w.name}
              className="w-14 h-14 object-contain group-hover:scale-105 transition-transform"
              loading="lazy"
            />
            <span className="text-xs text-wf-text-dim mt-1 text-center leading-tight">
              {w.name}
            </span>
            <div className="flex items-center gap-1">
              {w.isPrime && (
                <span className="text-[10px] text-wf-gold-dim">Prime</span>
              )}
              <span className="text-[10px] text-wf-text-muted">MR {w.masteryReq}</span>
            </div>
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <p className="text-sm text-wf-text-muted text-center py-8">
          No weapons found matching "{search}"
        </p>
      )}
    </div>
  );
}

function SelectedWeaponHeader({ weapon }: { weapon: WeaponData }) {
  const clearWeapon = useWeaponBuilderStore((s) => s.clearWeapon);
  const normalAttack = weapon.attacks.find(a => a.name === 'Normal Attack') ?? weapon.attacks[0];

  return (
    <div className="flex items-center gap-4 p-3 rounded-lg bg-wf-bg-card border border-wf-border">
      <img
        src={getItemImageUrl(weapon.imageName)}
        alt={weapon.name}
        className="w-16 h-16 object-contain"
      />
      <div className="flex-1">
        <h2 className="text-lg font-medium text-wf-gold">{weapon.name}</h2>
        <p className="text-xs text-wf-text-muted">
          {weapon.category} | MR {weapon.masteryReq}
          {normalAttack && (
            <> | {normalAttack.crit_chance}% CC | {normalAttack.crit_mult}x CD | {normalAttack.status_chance}% SC</>
          )}
        </p>
      </div>
      <button
        onClick={clearWeapon}
        className="px-3 py-1.5 text-sm rounded border border-wf-border text-wf-text-dim
                   hover:border-wf-danger hover:text-wf-danger transition-colors"
      >
        Change
      </button>
    </div>
  );
}
