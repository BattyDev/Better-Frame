import { useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { WeaponSelector } from '../components/builder/WeaponSelector';
import { WeaponModSlotGrid } from '../components/builder/WeaponModSlotGrid';
import { WeaponModBrowser } from '../components/builder/WeaponModBrowser';
import { CapacityBar } from '../components/builder/CapacityBar';
import { WeaponStatsPanel } from '../components/builder/WeaponStatsPanel';
import { BonusElementSelector } from '../components/builder/BonusElementSelector';
import { FormaCounter } from '../components/builder/FormaSelector';
import { useWeaponBuilderStore } from '../stores/weaponBuilderStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { getWeaponByUniqueName } from '../data/weaponData';
import type { WeaponCategory } from '../types/gameData';

function getDraftKey(category: WeaponCategory) {
  return `better-frame-weapon-draft-${category.toLowerCase()}`;
}

export default function WeaponBuilder() {
  const { category: categoryParam } = useParams<{ category: string }>();
  const category = (categoryParam?.charAt(0).toUpperCase() + (categoryParam?.slice(1) ?? '')) as WeaponCategory;

  const weapon = useWeaponBuilderStore((s) => s.weapon);
  const capacity = useWeaponBuilderStore((s) => s.capacity);
  const hasCatalyst = useWeaponBuilderStore((s) => s.hasCatalyst);
  const formaCount = useWeaponBuilderStore((s) => s.formaCount);
  const exportConfig = useWeaponBuilderStore((s) => s.exportConfig);
  const importConfig = useWeaponBuilderStore((s) => s.importConfig);
  const resetBuild = useWeaponBuilderStore((s) => s.resetBuild);
  const toggleCatalyst = useWeaponBuilderStore((s) => s.toggleCatalyst);
  const user = useAuthStore((s) => s.user);

  // Reset when category changes
  useEffect(() => {
    resetBuild();
  }, [category, resetBuild]);

  // Auto-save draft
  useEffect(() => {
    if (!weapon) return;
    const config = exportConfig();
    const draft = { weaponUniqueName: weapon.uniqueName, config };
    localStorage.setItem(getDraftKey(category), JSON.stringify(draft));
  }, [weapon, exportConfig, category]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(getDraftKey(category));
    if (!saved) return;
    try {
      const draft = JSON.parse(saved);
      if (draft.weaponUniqueName && draft.config) {
        const w = getWeaponByUniqueName(draft.weaponUniqueName);
        if (w && w.category === category) {
          importConfig(draft.config, w);
        }
      }
    } catch {
      // Invalid draft
    }
  }, [category, importConfig]);

  const handleSave = useCallback(async () => {
    if (!user || !weapon) return;
    const config = exportConfig();
    const buildName = `${weapon.name} Build`;

    const { error } = await supabase.from('builds').insert({
      user_id: user.id,
      name: buildName,
      item_unique_name: weapon.uniqueName,
      item_category: category,
      config,
      is_public: false,
    });

    if (error) {
      console.error('Failed to save build:', error);
    } else {
      localStorage.removeItem(getDraftKey(category));
    }
  }, [user, weapon, exportConfig, category]);

  const handleReset = useCallback(() => {
    resetBuild();
    localStorage.removeItem(getDraftKey(category));
  }, [resetBuild, category]);

  if (!['Primary', 'Secondary', 'Melee', 'Archgun', 'Archmelee'].includes(category)) {
    return (
      <div className="flex-1 p-4 lg:p-6">
        <p className="text-wf-text-muted">Invalid weapon category.</p>
      </div>
    );
  }

  const label = category === 'Primary' ? 'Primary'
    : category === 'Secondary' ? 'Secondary'
    : category === 'Melee' ? 'Melee'
    : category === 'Archgun' ? 'Arch-Gun'
    : 'Arch-Melee';

  return (
    <div className="flex-1 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-wf-gold">{label} Builder</h1>
        <div className="flex items-center gap-3">
          {weapon && (
            <>
              {/* Forma counter */}
              {formaCount > 0 && (
                <span className="text-xs text-wf-text-muted">
                  {formaCount} Forma
                </span>
              )}

              {/* Catalyst toggle */}
              <button
                onClick={toggleCatalyst}
                className={`
                  px-3 py-1.5 text-xs rounded border transition-colors
                  ${hasCatalyst
                    ? 'border-wf-accent text-wf-accent bg-wf-accent/10'
                    : 'border-wf-border text-wf-text-dim hover:border-wf-border-light'
                  }
                `}
              >
                {hasCatalyst ? 'Catalyst ✓' : 'Catalyst'}
              </button>

              {user && (
                <button
                  onClick={handleSave}
                  className="px-4 py-1.5 text-sm rounded bg-wf-gold text-wf-bg-dark
                             font-medium hover:bg-wf-gold-light transition-colors"
                >
                  Save
                </button>
              )}
              <button
                onClick={handleReset}
                className="px-4 py-1.5 text-sm rounded border border-wf-border
                           text-wf-text-dim hover:border-wf-danger hover:text-wf-danger
                           transition-colors"
              >
                Reset
              </button>
            </>
          )}
        </div>
      </div>

      {/* Weapon selector */}
      <WeaponSelector category={category} />

      {/* Builder layout */}
      {weapon && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Left: Mod grid + extras */}
          <div className="space-y-6">
            {/* Capacity bar */}
            <WeaponCapacityBar />
            <BonusElementSelector />
            <WeaponModSlotGrid />
          </div>

          {/* Right: Stats panel */}
          <div>
            <WeaponStatsPanel />
          </div>
        </div>
      )}

      {/* Mod browser modal */}
      <WeaponModBrowser />
    </div>
  );
}

/** Capacity bar that reads from weapon builder store */
function WeaponCapacityBar() {
  const capacity = useWeaponBuilderStore((s) => s.capacity);

  const usedPercent = capacity.totalCapacity > 0
    ? Math.min(100, (capacity.usedCapacity / capacity.totalCapacity) * 100)
    : 0;

  return (
    <div className="space-y-1">
      <div className="flex items-center justify-between text-xs">
        <span className="text-wf-text-dim">Capacity</span>
        <span className={capacity.isOverCapacity ? 'text-wf-danger font-medium' : 'text-wf-text'}>
          {capacity.usedCapacity} / {capacity.totalCapacity}
        </span>
      </div>
      <div className="h-2 rounded-full bg-wf-bg-dark overflow-hidden">
        <div
          className={`h-full rounded-full transition-all ${
            capacity.isOverCapacity ? 'bg-wf-danger' : 'bg-wf-gold'
          }`}
          style={{ width: `${usedPercent}%` }}
        />
      </div>
    </div>
  );
}
