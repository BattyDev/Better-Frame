import { useEffect, useCallback } from 'react';
import { WarframeSelector } from '../components/builder/WarframeSelector';
import { ModSlotGrid } from '../components/builder/ModSlotGrid';
import { ModBrowser } from '../components/builder/ModBrowser';
import { CapacityBar } from '../components/builder/CapacityBar';
import { StatsPanel } from '../components/builder/StatsPanel';
import { ArcaneSlots } from '../components/builder/ArcaneSlots';
import { HelminthSelector } from '../components/builder/HelminthSelector';
import { FormaCounter } from '../components/builder/FormaSelector';
import { useBuilderStore } from '../stores/builderStore';
import { useAuthStore } from '../stores/authStore';
import { supabase } from '../lib/supabase';
import { getWarframeByUniqueName } from '../data/warframeData';

const DRAFT_KEY = 'better-frame-draft';

export default function Builder() {
  const warframe = useBuilderStore((s) => s.warframe);
  const exportConfig = useBuilderStore((s) => s.exportConfig);
  const importConfig = useBuilderStore((s) => s.importConfig);
  const resetBuild = useBuilderStore((s) => s.resetBuild);
  const user = useAuthStore((s) => s.user);

  // Auto-save draft to localStorage on changes
  useEffect(() => {
    if (!warframe) return;
    const config = exportConfig();
    const draft = {
      warframeUniqueName: warframe.uniqueName,
      config,
    };
    localStorage.setItem(DRAFT_KEY, JSON.stringify(draft));
  }, [warframe, exportConfig]);

  // Load draft on mount
  useEffect(() => {
    const saved = localStorage.getItem(DRAFT_KEY);
    if (!saved) return;
    try {
      const draft = JSON.parse(saved);
      if (draft.warframeUniqueName && draft.config) {
        const wf = getWarframeByUniqueName(draft.warframeUniqueName);
        if (wf) {
          importConfig(draft.config, wf);
        }
      }
    } catch {
      // Invalid draft, ignore
    }
  }, [importConfig]);

  const handleSave = useCallback(async () => {
    if (!user || !warframe) return;

    const config = exportConfig();
    const buildName = `${warframe.name} Build`;

    const { error } = await supabase.from('builds').insert({
      user_id: user.id,
      name: buildName,
      item_unique_name: warframe.uniqueName,
      item_category: 'Warframe',
      config,
      is_public: false,
    });

    if (error) {
      console.error('Failed to save build:', error);
    } else {
      localStorage.removeItem(DRAFT_KEY);
    }
  }, [user, warframe, exportConfig]);

  const handleReset = useCallback(() => {
    resetBuild();
    localStorage.removeItem(DRAFT_KEY);
  }, [resetBuild]);

  return (
    <div className="flex-1 p-4 lg:p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-4">
        <h1 className="text-2xl font-bold text-wf-gold">Build Editor</h1>
        <div className="flex items-center gap-3">
          <FormaCounter />
          {warframe && (
            <>
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

      {/* Warframe selector / header */}
      <WarframeSelector />

      {/* Builder layout */}
      {warframe && (
        <div className="mt-6 grid grid-cols-1 lg:grid-cols-[1fr_280px] gap-6">
          {/* Left: Mod grid + Arcanes */}
          <div className="space-y-6">
            <CapacityBar />
            <ModSlotGrid />
            <ArcaneSlots />
            <HelminthSelector />
          </div>

          {/* Right: Stats panel */}
          <div>
            <StatsPanel />
          </div>
        </div>
      )}

      {/* Mod browser modal */}
      <ModBrowser />
    </div>
  );
}
