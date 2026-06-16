// Weapon stats panel: damage breakdown, elements, crit, DPS
import { useWeaponBuilderStore } from '../../stores/weaponBuilderStore';
import { formatWeaponStatValue } from '../../lib/math/weaponCalc';
import { ELEMENT_COLORS, ELEMENT_DISPLAY_NAMES } from '../../lib/math/elementCombiner';

export function WeaponStatsPanel() {
  const stats = useWeaponBuilderStore((s) => s.stats);
  const weapon = useWeaponBuilderStore((s) => s.weapon);

  if (!weapon) {
    return (
      <div className="p-4 rounded-lg bg-wf-bg-card border border-wf-border">
        <h3 className="text-sm font-medium text-wf-text-dim mb-2">Stats</h3>
        <p className="text-xs text-wf-text-muted">Select a weapon to view stats</p>
      </div>
    );
  }

  const isMelee = weapon.category === 'Melee';

  return (
    <div className="p-4 rounded-lg bg-wf-bg-card border border-wf-border space-y-4">
      {/* DPS Summary */}
      <div>
        <h3 className="text-sm font-medium text-wf-gold mb-2">DPS</h3>
        <div className="space-y-1">
          <StatRow label="Avg Damage/Shot" value={formatWeaponStatValue('avgDamagePerShot', stats.avgDamagePerShot)} highlight />
          <StatRow label="Burst DPS" value={formatWeaponStatValue('burstDps', stats.burstDps)} highlight />
          {!isMelee && (
            <StatRow label="Sustained DPS" value={formatWeaponStatValue('sustainedDps', stats.sustainedDps)} highlight />
          )}
        </div>
      </div>

      {/* Damage Breakdown */}
      <div>
        <h3 className="text-sm font-medium text-wf-gold mb-2">Damage</h3>
        <div className="space-y-1">
          <StatRow label="Total Base" value={formatWeaponStatValue('totalDamage', stats.totalDamage)} />
          <StatRow label="Per Shot" value={formatWeaponStatValue('damagePerShot', stats.damagePerShot)} />
        </div>

        {/* Physical damage (IPS) */}
        {Object.entries(stats.physicalDamage).map(([type, value]) => (
          <div key={type} className="flex items-center justify-between text-xs mt-1">
            <span className="text-wf-text-dim flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: ELEMENT_COLORS[type] }}
              />
              {ELEMENT_DISPLAY_NAMES[type] ?? type}
            </span>
            <span className="text-wf-text">{Math.round(value)}</span>
          </div>
        ))}

        {/* Elemental damage */}
        {stats.elementalDamage.map((elem, i) => (
          <div key={`${elem.type}-${i}`} className="flex items-center justify-between text-xs mt-1">
            <span className="text-wf-text-dim flex items-center gap-1">
              <span
                className="w-2 h-2 rounded-full inline-block"
                style={{ backgroundColor: ELEMENT_COLORS[elem.type] }}
              />
              {ELEMENT_DISPLAY_NAMES[elem.type] ?? elem.type}
            </span>
            <span style={{ color: ELEMENT_COLORS[elem.type] }}>
              {Math.round(elem.damage)}
            </span>
          </div>
        ))}
      </div>

      {/* Combat Stats */}
      <div>
        <h3 className="text-sm font-medium text-wf-gold mb-2">Combat</h3>
        <div className="space-y-1">
          <StatRow label="Critical Chance" value={formatWeaponStatValue('critChance', stats.critChance)} />
          <StatRow label="Critical Multiplier" value={formatWeaponStatValue('critMultiplier', stats.critMultiplier)} />
          <StatRow label="Status Chance" value={formatWeaponStatValue('statusChance', stats.statusChance)} />
          <StatRow label="Multishot" value={formatWeaponStatValue('multishot', stats.multishot)} />
          {isMelee ? (
            <>
              <StatRow label="Attack Speed" value={formatWeaponStatValue('attackSpeed', stats.attackSpeed ?? 0)} />
              {stats.range != null && (
                <StatRow label="Range" value={formatWeaponStatValue('range', stats.range)} />
              )}
              {stats.comboDuration != null && (
                <StatRow label="Combo Duration" value={formatWeaponStatValue('comboDuration', stats.comboDuration)} />
              )}
            </>
          ) : (
            <>
              <StatRow label="Fire Rate" value={formatWeaponStatValue('fireRate', stats.fireRate)} />
              <StatRow label="Magazine" value={formatWeaponStatValue('magazineSize', stats.magazineSize)} />
              <StatRow label="Reload" value={formatWeaponStatValue('reloadTime', stats.reloadTime)} />
            </>
          )}
        </div>
      </div>

      {/* Text effects */}
      {stats.textEffects.length > 0 && (
        <div className="pt-3 border-t border-wf-border">
          <h4 className="text-xs font-medium text-wf-text-dim mb-1">Effects</h4>
          {stats.textEffects.map((text, i) => (
            <p key={i} className="text-xs text-wf-text-muted">{text}</p>
          ))}
        </div>
      )}
    </div>
  );
}

function StatRow({ label, value, highlight }: { label: string; value: string; highlight?: boolean }) {
  return (
    <div className="flex items-center justify-between text-xs">
      <span className="text-wf-text-dim">{label}</span>
      <span className={highlight ? 'text-wf-gold font-medium' : 'text-wf-text'}>{value}</span>
    </div>
  );
}
