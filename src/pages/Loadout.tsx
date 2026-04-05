import { useEffect, useCallback } from 'react';
import { useAuthStore } from '../stores/authStore';
import { useLoadoutStore, type LoadoutBuildSummary } from '../stores/loadoutStore';
import type { FocusSchool } from '../types';

const SLOT_CONFIG = [
  { key: 'warframeBuildId' as const, label: 'Warframe', category: 'Warframe' },
  { key: 'primaryBuildId' as const, label: 'Primary', category: 'Primary' },
  { key: 'secondaryBuildId' as const, label: 'Secondary', category: 'Secondary' },
  { key: 'meleeBuildId' as const, label: 'Melee', category: 'Melee' },
  { key: 'exaltedBuildId' as const, label: 'Exalted', category: null },
] as const;

const FOCUS_SCHOOLS: FocusSchool[] = ['Madurai', 'Vazarin', 'Naramon', 'Zenurik', 'Unairu'];

export default function Loadout() {
  const user = useAuthStore((s) => s.user);
  const name = useLoadoutStore((s) => s.name);
  const description = useLoadoutStore((s) => s.description);
  const slots = useLoadoutStore((s) => s.slots);
  const focusSchool = useLoadoutStore((s) => s.focusSchool);
  const buildSummaries = useLoadoutStore((s) => s.buildSummaries);
  const userBuilds = useLoadoutStore((s) => s.userBuilds);
  const isSaving = useLoadoutStore((s) => s.isSaving);
  const setName = useLoadoutStore((s) => s.setName);
  const setDescription = useLoadoutStore((s) => s.setDescription);
  const setSlot = useLoadoutStore((s) => s.setSlot);
  const clearSlot = useLoadoutStore((s) => s.clearSlot);
  const setFocusSchool = useLoadoutStore((s) => s.setFocusSchool);
  const loadUserBuilds = useLoadoutStore((s) => s.loadUserBuilds);
  const saveLoadout = useLoadoutStore((s) => s.saveLoadout);
  const resetLoadout = useLoadoutStore((s) => s.resetLoadout);

  useEffect(() => {
    if (user) loadUserBuilds(user.id);
  }, [user, loadUserBuilds]);

  const handleSave = useCallback(async () => {
    if (!user) return;
    await saveLoadout(user.id);
  }, [user, saveLoadout]);

  if (!user) {
    return (
      <div className="flex-1 p-4 lg:p-6">
        <h1 className="text-2xl font-bold text-wf-gold mb-4">Loadout Builder</h1>
        <p className="text-wf-text-muted">Sign in to create loadouts.</p>
      </div>
    );
  }

  return (
    <div className="flex-1 p-4 lg:p-6 max-w-3xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-wf-gold">Loadout Builder</h1>
        <div className="flex items-center gap-3">
          <button
            onClick={handleSave}
            disabled={isSaving || !name.trim()}
            className="px-4 py-1.5 text-sm rounded bg-wf-gold text-wf-bg-dark
                       font-medium hover:bg-wf-gold-light transition-colors
                       disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {isSaving ? 'Saving...' : 'Save Loadout'}
          </button>
          <button
            onClick={resetLoadout}
            className="px-4 py-1.5 text-sm rounded border border-wf-border
                       text-wf-text-dim hover:border-wf-danger hover:text-wf-danger
                       transition-colors"
          >
            Reset
          </button>
        </div>
      </div>

      {/* Loadout name & description */}
      <div className="space-y-3 mb-6">
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Loadout Name"
          className="w-full px-3 py-2 rounded bg-wf-bg-dark border border-wf-border
                     text-wf-text text-sm placeholder:text-wf-text-muted
                     focus:outline-none focus:border-wf-gold-dim"
        />
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder="Description (optional)"
          rows={2}
          className="w-full px-3 py-2 rounded bg-wf-bg-dark border border-wf-border
                     text-wf-text text-sm placeholder:text-wf-text-muted
                     focus:outline-none focus:border-wf-gold-dim resize-none"
        />
      </div>

      {/* Build slots */}
      <div className="space-y-3 mb-6">
        <h2 className="text-sm font-medium text-wf-gold">Builds</h2>
        {SLOT_CONFIG.map(({ key, label, category }) => {
          const currentBuildId = slots[key];
          const summary = buildSummaries[key];
          const compatible = category
            ? userBuilds.filter(b => b.itemCategory === category)
            : userBuilds;

          return (
            <BuildSlot
              key={key}
              label={label}
              currentBuildId={currentBuildId}
              summary={summary}
              builds={compatible}
              onSelect={(buildId) => setSlot(key, buildId)}
              onClear={() => clearSlot(key)}
            />
          );
        })}
      </div>

      {/* Focus School */}
      <div className="mb-6">
        <h2 className="text-sm font-medium text-wf-gold mb-2">Focus School</h2>
        <div className="flex gap-2">
          {FOCUS_SCHOOLS.map((school) => (
            <button
              key={school}
              onClick={() => setFocusSchool(focusSchool === school ? null : school)}
              className={`
                px-3 py-1.5 rounded text-xs transition-colors
                ${focusSchool === school
                  ? 'border border-wf-gold text-wf-gold bg-wf-gold/10'
                  : 'border border-wf-border text-wf-text-dim hover:border-wf-border-light'
                }
              `}
            >
              {school}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

function BuildSlot({
  label,
  currentBuildId,
  summary,
  builds,
  onSelect,
  onClear,
}: {
  label: string;
  currentBuildId: string | null;
  summary?: LoadoutBuildSummary;
  builds: LoadoutBuildSummary[];
  onSelect: (buildId: string) => void;
  onClear: () => void;
}) {
  return (
    <div className="flex items-center gap-3 p-3 rounded-lg bg-wf-bg-card border border-wf-border">
      <span className="text-xs text-wf-text-dim w-20 shrink-0">{label}</span>

      {currentBuildId && summary ? (
        <div className="flex-1 flex items-center justify-between">
          <span className="text-sm text-wf-text">{summary.name}</span>
          <button
            onClick={onClear}
            className="text-xs text-wf-text-muted hover:text-wf-danger transition-colors"
          >
            Remove
          </button>
        </div>
      ) : (
        <select
          value=""
          onChange={(e) => e.target.value && onSelect(e.target.value)}
          className="flex-1 px-2 py-1 rounded bg-wf-bg-dark border border-wf-border
                     text-wf-text text-xs focus:outline-none focus:border-wf-gold-dim"
        >
          <option value="">— Select a build —</option>
          {builds.map((b) => (
            <option key={b.id} value={b.id}>
              {b.name}
            </option>
          ))}
        </select>
      )}
    </div>
  );
}
