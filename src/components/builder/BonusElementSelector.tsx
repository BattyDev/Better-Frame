// Kuva/Tenet bonus element selector
import { useWeaponBuilderStore } from '../../stores/weaponBuilderStore';
import { ELEMENT_COLORS, ELEMENT_DISPLAY_NAMES } from '../../lib/math/elementCombiner';
import type { DamageType } from '../../types/gameData';

const BASE_ELEMENTS: DamageType[] = ['heat', 'cold', 'electricity', 'toxin'];
const BONUS_VALUES = [0.25, 0.30, 0.35, 0.40, 0.45, 0.50, 0.55, 0.60];

export function BonusElementSelector() {
  const weapon = useWeaponBuilderStore((s) => s.weapon);
  const bonusElement = useWeaponBuilderStore((s) => s.bonusElement);
  const bonusElementValue = useWeaponBuilderStore((s) => s.bonusElementValue);
  const setBonusElement = useWeaponBuilderStore((s) => s.setBonusElement);

  if (!weapon) return null;

  // Only show for Kuva/Tenet weapons
  const isKuvaTenet = weapon.name.startsWith('Kuva ') || weapon.name.startsWith('Tenet ');
  if (!isKuvaTenet) return null;

  return (
    <div className="p-3 rounded-lg bg-wf-bg-card border border-wf-border space-y-2">
      <h3 className="text-xs font-medium text-wf-gold">Bonus Element</h3>

      {/* Element selection */}
      <div className="flex gap-2">
        {BASE_ELEMENTS.map((elem) => (
          <button
            key={elem}
            onClick={() => setBonusElement(
              bonusElement === elem ? null : elem,
              bonusElement === elem ? 0 : bonusElementValue || 0.60,
            )}
            className={`
              flex items-center gap-1 px-2 py-1 rounded text-xs transition-colors
              ${bonusElement === elem
                ? 'border-2 bg-wf-bg-hover'
                : 'border border-wf-border hover:border-wf-border-light'
              }
            `}
            style={{
              borderColor: bonusElement === elem ? ELEMENT_COLORS[elem] : undefined,
              color: bonusElement === elem ? ELEMENT_COLORS[elem] : undefined,
            }}
          >
            <span
              className="w-2 h-2 rounded-full"
              style={{ backgroundColor: ELEMENT_COLORS[elem] }}
            />
            {ELEMENT_DISPLAY_NAMES[elem]}
          </button>
        ))}
      </div>

      {/* Value slider */}
      {bonusElement && (
        <div className="flex items-center gap-2">
          <span className="text-xs text-wf-text-muted">Bonus:</span>
          <select
            value={bonusElementValue}
            onChange={(e) => setBonusElement(bonusElement, parseFloat(e.target.value))}
            className="px-2 py-1 rounded bg-wf-bg-dark border border-wf-border
                       text-wf-text text-xs focus:outline-none focus:border-wf-gold-dim"
          >
            {BONUS_VALUES.map((v) => (
              <option key={v} value={v}>{Math.round(v * 100)}%</option>
            ))}
          </select>
        </div>
      )}
    </div>
  );
}
