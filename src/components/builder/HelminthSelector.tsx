// Helminth ability selector: lets user pick a subsumed ability to infuse
import { useState, useMemo } from 'react';
import { useBuilderStore } from '../../stores/builderStore';
import { getHelminthAbilities } from '../../data/helminthData';

export function HelminthSelector() {
  const warframe = useBuilderStore((s) => s.warframe);
  const helminthAbility = useBuilderStore((s) => s.helminthAbility);
  const setHelminthAbility = useBuilderStore((s) => s.setHelminthAbility);
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');

  const allAbilities = useMemo(() => {
    const abilities = getHelminthAbilities();
    // Exclude abilities from the currently selected warframe (can't infuse your own)
    const baseName = warframe?.name.replace(/ Prime$/, '').replace(/ Umbra$/, '');
    return abilities.filter((a) => a.source !== baseName);
  }, [warframe?.name]);

  const filtered = useMemo(() => {
    if (!search) return allAbilities;
    const lower = search.toLowerCase();
    return allAbilities.filter(
      (a) =>
        a.ability.toLowerCase().includes(lower) ||
        a.source.toLowerCase().includes(lower),
    );
  }, [allAbilities, search]);

  if (!warframe) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-wf-text-dim">Helminth</h3>

      {helminthAbility ? (
        <div className="flex items-center gap-2 p-2 rounded-lg border border-wf-border bg-wf-bg-card">
          <div className="flex-1 min-w-0">
            <div className="text-xs text-wf-text">{helminthAbility.ability}</div>
            <div className="text-xs text-wf-text-muted">
              from {helminthAbility.source}
            </div>
          </div>
          <button
            onClick={() => setHelminthAbility(null)}
            className="text-xs text-wf-text-muted hover:text-wf-danger transition-colors"
          >
            x
          </button>
        </div>
      ) : (
        <button
          onClick={() => setIsOpen(true)}
          className="w-full p-2 rounded-lg border border-dashed border-wf-border
                     text-xs text-wf-text-muted hover:border-wf-gold-dim
                     transition-colors text-center"
        >
          Infuse Helminth Ability
        </button>
      )}

      {/* Ability picker modal */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60">
          <div className="w-full max-w-md max-h-[70vh] bg-wf-bg rounded-lg border border-wf-border
                          shadow-2xl flex flex-col">
            <div className="flex items-center justify-between p-4 border-b border-wf-border">
              <h3 className="text-lg font-medium text-wf-gold">Helminth Ability</h3>
              <button
                onClick={() => { setIsOpen(false); setSearch(''); }}
                className="text-wf-text-muted hover:text-wf-text transition-colors"
              >
                Close
              </button>
            </div>

            <div className="p-4 border-b border-wf-border">
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search abilities..."
                autoFocus
                className="w-full px-3 py-2 rounded bg-wf-bg-dark border border-wf-border
                           text-wf-text text-sm placeholder:text-wf-text-muted
                           focus:outline-none focus:border-wf-gold-dim"
              />
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <div className="space-y-1">
                {filtered.map((entry) => (
                  <button
                    key={`${entry.source}-${entry.ability}`}
                    onClick={() => {
                      setHelminthAbility(entry);
                      setIsOpen(false);
                      setSearch('');
                    }}
                    className="flex items-center justify-between w-full p-2 rounded
                               hover:bg-wf-bg-hover transition-colors text-left"
                  >
                    <span className="text-sm text-wf-text">{entry.ability}</span>
                    <span className="text-xs text-wf-text-muted">{entry.source}</span>
                  </button>
                ))}
                {filtered.length === 0 && (
                  <p className="text-sm text-wf-text-muted text-center py-4">
                    No abilities found
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
