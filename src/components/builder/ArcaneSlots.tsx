// Arcane slots component: two arcane slots with browser integration
import { useBuilderStore } from '../../stores/builderStore';
import { getItemImageUrl } from '../../data/warframeData';

export function ArcaneSlots() {
  const arcanes = useBuilderStore((s) => s.arcanes);
  const removeArcane = useBuilderStore((s) => s.removeArcane);
  const openModBrowser = useBuilderStore((s) => s.openModBrowser);
  const warframe = useBuilderStore((s) => s.warframe);

  if (!warframe) return null;

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-wf-text-dim">Arcanes</h3>
      <div className="flex gap-3">
        {([0, 1] as const).map((index) => {
          const entry = arcanes[index];
          return (
            <div
              key={index}
              onClick={() => !entry && openModBrowser('arcane', index)}
              className={`
                flex-1 min-h-[60px] rounded-lg border border-dashed
                transition-colors flex items-center gap-2 p-2
                ${entry
                  ? 'border-wf-border bg-wf-bg-card'
                  : 'border-wf-border hover:border-wf-gold-dim cursor-pointer'
                }
              `}
            >
              {entry ? (
                <>
                  {entry.arcane.imageName && (
                    <img
                      src={getItemImageUrl(entry.arcane.imageName)}
                      alt={entry.arcane.name}
                      className="w-10 h-10 object-contain"
                      loading="lazy"
                    />
                  )}
                  <div className="flex-1 min-w-0">
                    <div className="text-xs text-wf-text truncate">{entry.arcane.name}</div>
                    <div className="text-xs text-wf-text-muted">Rank {entry.rank}</div>
                  </div>
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removeArcane(index);
                    }}
                    className="text-wf-text-muted hover:text-wf-danger text-xs transition-colors"
                  >
                    x
                  </button>
                </>
              ) : (
                <span className="text-xs text-wf-text-muted w-full text-center">
                  Arcane {index + 1}
                </span>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
