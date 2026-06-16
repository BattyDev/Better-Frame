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

      {/* Set Bonuses */}
      {stats.setBonuses.length > 0 && (
        <div className="mt-3 pt-3 border-t border-wf-border">
          <h4 className="text-xs font-medium text-wf-accent mb-2">Set Bonuses</h4>
          {stats.setBonuses.map((setBonus) => (
            <div key={setBonus.data.setKey} className="mb-2">
              <div className="flex items-center justify-between">
                <span className="text-xs font-medium text-wf-text">
                  {setBonus.data.name} Set
                </span>
                <span className="text-xs text-wf-text-dim">
                  {setBonus.equippedCount}/{setBonus.data.tiers[setBonus.data.tiers.length - 1]?.count ?? 0}
                </span>
              </div>
              {setBonus.activeTier && (
                <p className="text-xs text-wf-success mt-0.5">
                  {setBonus.activeTier.description}
                </p>
              )}
              <div className="flex gap-0.5 mt-1">
                {setBonus.data.tiers.map((tier) => (
                  <div
                    key={tier.count}
                    className={`h-1 flex-1 rounded-full ${
                      setBonus.equippedCount >= tier.count
                        ? 'bg-wf-accent'
                        : 'bg-wf-bg-light'
                    }`}
                  />
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Conditional Buffs (Galvanized, etc.) */}
      {stats.conditionalBuffs.length > 0 && (
        <div className="mt-3 pt-3 border-t border-wf-border">
          <h4 className="text-xs font-medium text-wf-warning mb-2">Conditional Buffs</h4>
          {stats.conditionalBuffs.map((buff, i) => (
            <div key={i} className="mb-2 p-2 rounded bg-wf-bg-light">
              <div className="text-xs font-medium text-wf-text">{buff.modName}</div>
              <div className="text-xs text-wf-warning mt-0.5">{buff.trigger}</div>
              <div className="text-xs text-wf-text-dim mt-0.5">
                {buff.perStack}
                {buff.maxStacks > 1 && (
                  <span className="text-wf-text-muted"> (up to {buff.maxStacks}x)</span>
                )}
              </div>
              {buff.duration > 0 && (
                <div className="text-xs text-wf-text-muted">{buff.duration}s duration</div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* Arcane Effects */}
      {stats.arcaneEffects.length > 0 && (
        <div className="mt-3 pt-3 border-t border-wf-border">
          <h4 className="text-xs font-medium text-wf-gold mb-2">Arcane Effects</h4>
          {stats.arcaneEffects.map((effect, i) => (
            <div key={i} className="mb-2 p-2 rounded bg-wf-bg-light">
              <div className="text-xs font-medium text-wf-text">{effect.arcaneName}</div>
              <div className="text-xs text-wf-gold mt-0.5">{effect.trigger}</div>
              {effect.chance !== null && (
                <div className="text-xs text-wf-text-muted">{effect.chance}% chance</div>
              )}
              {effect.effects.map((eff, j) => (
                <div key={j} className="text-xs text-wf-success mt-0.5">{eff}</div>
              ))}
              {effect.duration !== null && (
                <div className="text-xs text-wf-text-muted">{effect.duration}s duration</div>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
