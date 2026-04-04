// Stats panel: displays calculated warframe stats
import { useBuilderStore } from '../../stores/builderStore';
import { formatStatValue, getStatDisplayName } from '../../lib/math/warframeCalc';

// Display order for stats
const STAT_ORDER = [
  'health',
  'shield',
  'armor',
  'energy',
  'sprintSpeed',
  'abilityStrength',
  'abilityDuration',
  'abilityRange',
  'abilityEfficiency',
];

export function StatsPanel() {
  const stats = useBuilderStore((s) => s.stats);
  const warframe = useBuilderStore((s) => s.warframe);

  if (!warframe) {
    return (
      <div className="p-4 rounded-lg bg-wf-bg-card border border-wf-border">
        <h3 className="text-sm font-medium text-wf-text-dim mb-2">Stats</h3>
        <p className="text-xs text-wf-text-muted">Select a warframe to view stats</p>
      </div>
    );
  }

  return (
    <div className="p-4 rounded-lg bg-wf-bg-card border border-wf-border">
      <h3 className="text-sm font-medium text-wf-gold mb-3">Stats</h3>

      <div className="space-y-1.5">
        {STAT_ORDER.map((statKey) => {
          const baseVal = stats.base[statKey];
          const moddedVal = stats.modded[statKey];
          if (baseVal === undefined && moddedVal === undefined) return null;

          const isModified = baseVal !== moddedVal;
          const isIncrease = (moddedVal ?? 0) > (baseVal ?? 0);

          return (
            <div key={statKey} className="flex items-center justify-between text-xs">
              <span className="text-wf-text-dim">{getStatDisplayName(statKey)}</span>
              <div className="flex items-center gap-2">
                {isModified && (
                  <span className="text-wf-text-muted line-through">
                    {formatStatValue(statKey, baseVal ?? 0)}
                  </span>
                )}
                <span
                  className={
                    isModified
                      ? isIncrease
                        ? 'text-wf-success font-medium'
                        : 'text-wf-danger font-medium'
                      : 'text-wf-text'
                  }
                >
                  {formatStatValue(statKey, moddedVal ?? baseVal ?? 0)}
                </span>
              </div>
            </div>
          );
        })}

        {/* Extra stats from mods (radar, etc.) */}
        {Object.entries(stats.modded)
          .filter(([key]) => !STAT_ORDER.includes(key))
          .map(([key, value]) => (
            <div key={key} className="flex items-center justify-between text-xs">
              <span className="text-wf-text-dim">{getStatDisplayName(key)}</span>
              <span className="text-wf-accent">{formatStatValue(key, value)}</span>
            </div>
          ))}
      </div>

      {/* Text-only effects */}
      {stats.textEffects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-wf-border">
          <h4 className="text-xs font-medium text-wf-text-dim mb-1">Effects</h4>
          {stats.textEffects.map((text, i) => (
            <p key={i} className="text-xs text-wf-text-muted">
              {text}
            </p>
          ))}
        </div>
      )}
    </div>
  );
}
