// Weapon stat calculator: applies mod effects to base weapon stats
// Calculation layers:
// 1. Base Damage: totalBase * (1 + Σ base damage mods)
// 2. Elemental Damage: each element adds moddedBase * element%
// 3. Multishot: (1 + Σ multishot mods) multiplier
// 4. Critical: average crit multiplier with orange/red crit support
// 5. Status: baseSC * (1 + Σ SC mods)
// 6. Fire Rate / Reload: for sustained DPS

import type { WeaponData, DamageType, ModData } from '../../types/gameData';
import {
  parseWeaponStatString,
  isDamageType,
  isPhysicalDamage,
  type WeaponStatKey,
} from './weaponStatRegistry';
import {
  combineElements,
  type ElementEntry,
} from './elementCombiner';

export interface WeaponBaseStats {
  totalDamage: number;
  damageDistribution: Record<string, number>; // damage type -> base damage value
  critChance: number;    // as percentage e.g. 32 for 32%
  critMultiplier: number; // e.g. 2.8
  statusChance: number;   // as percentage e.g. 6 for 6%
  fireRate: number;
  magazineSize: number;
  reloadTime: number;
  multishot: number;      // base multishot (usually 1 for most weapons)
  // Melee-specific
  attackSpeed?: number;
  range?: number;
  comboDuration?: number;
}

export interface WeaponCalculatedStats {
  // Modded base values
  totalDamage: number;
  damagePerShot: number;
  // Damage breakdown
  physicalDamage: Record<string, number>; // IPS after mods
  elementalDamage: ElementEntry[];        // Combined elements with damage values
  totalElementalDamage: number;
  // Combat stats
  critChance: number;      // modded, can exceed 100%
  critMultiplier: number;  // modded
  statusChance: number;    // modded, capped at 100% per pellet for display
  multishot: number;       // modded
  fireRate: number;        // modded
  magazineSize: number;    // modded
  reloadTime: number;      // modded
  // DPS calculations
  avgDamagePerShot: number; // includes crit average
  burstDps: number;         // DPS during magazine
  sustainedDps: number;     // DPS including reload
  // Melee-specific
  attackSpeed?: number;
  range?: number;
  comboDuration?: number;
  // Text effects that can't be calculated
  textEffects: string[];
}

/**
 * Extract base stats from weapon data.
 * Uses the first "Normal Attack" or first attack entry.
 */
export function getWeaponBaseStats(weapon: WeaponData): WeaponBaseStats {
  const normalAttack = weapon.attacks.find(a => a.name === 'Normal Attack') ?? weapon.attacks[0];

  const damageDistribution: Record<string, number> = {};
  if (normalAttack?.damage) {
    for (const [type, value] of Object.entries(normalAttack.damage)) {
      if (value && value > 0) {
        damageDistribution[type] = value;
      }
    }
  }

  const totalDamage = Object.values(damageDistribution).reduce((a, b) => a + b, 0);

  return {
    totalDamage,
    damageDistribution,
    critChance: normalAttack?.crit_chance ?? 0,
    critMultiplier: normalAttack?.crit_mult ?? 1,
    statusChance: normalAttack?.status_chance ?? 0,
    fireRate: weapon.fireRate ?? normalAttack?.speed ?? 1,
    magazineSize: weapon.magazineSize ?? 0,
    reloadTime: weapon.reloadTime ?? 0,
    multishot: 1,
    // Melee
    attackSpeed: weapon.category === 'Melee' ? weapon.fireRate : undefined,
    range: weapon.range,
    comboDuration: weapon.comboDuration,
  };
}

/**
 * Parse weapon mod stats using the weapon stat registry.
 * Falls back to the general modParser for text effects.
 */
function parseWeaponModStats(mod: ModData, rank: number): {
  weaponStats: { stat: WeaponStatKey; value: number }[];
  textEffects: string[];
} {
  const weaponStats: { stat: WeaponStatKey; value: number }[] = [];
  const textEffects: string[] = [];

  if (!mod.levelStats || rank < 0 || rank >= mod.levelStats.length) {
    return { weaponStats, textEffects };
  }

  const levelStat = mod.levelStats[rank];
  for (const statText of levelStat.stats) {
    const lines = statText.split('\n');
    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parsed = parseWeaponStatString(trimmed);
      if (parsed) {
        weaponStats.push({ stat: parsed.stat, value: parsed.value });
      } else {
        textEffects.push(trimmed);
      }
    }
  }

  return { weaponStats, textEffects };
}

/**
 * Calculate the average critical multiplier, accounting for orange/red crits.
 *
 * At >100% crit chance:
 * - 100-200%: guaranteed orange crit (2x tier), chance for red (3x tier) on remainder
 * - Formula: avgCritMult = 1 + (critChance/100) * (critMult - 1)
 *   where critMult is the weapon's crit multiplier
 */
function calculateAvgCritMultiplier(critChance: number, critMult: number): number {
  if (critChance <= 0) return 1;

  // Simplified: avgCritMult = 1 + (CC/100) * (CM - 1)
  // This handles all crit tiers naturally
  return 1 + (critChance / 100) * (critMult - 1);
}

/**
 * Calculate final weapon stats with all mods applied.
 *
 * @param weapon - The weapon data
 * @param mods - Array of mods with ranks, in slot order (important for element combining!)
 * @param stanceMod - Stance mod for melee (adds capacity, no damage effect in calc)
 * @param bonusElement - Kuva/Tenet bonus element
 * @param bonusElementValue - Bonus element damage percentage (0-1)
 */
export function calculateWeaponStats(
  weapon: WeaponData,
  mods: { mod: ModData; rank: number }[],
  bonusElement?: DamageType,
  bonusElementValue?: number,
): WeaponCalculatedStats {
  const base = getWeaponBaseStats(weapon);
  const textEffects: string[] = [];

  // Collect all mod stats, preserving slot order for elements
  const modStatsByKey = new Map<WeaponStatKey, number>();
  const elementModsInOrder: { type: WeaponStatKey; value: number }[] = [];

  for (const { mod, rank } of mods) {
    const { weaponStats, textEffects: texts } = parseWeaponModStats(mod, rank);
    textEffects.push(...texts);

    for (const { stat, value } of weaponStats) {
      if (isDamageType(stat)) {
        // Elements and physical damage mods need slot-order tracking
        elementModsInOrder.push({ type: stat, value });
        // Also accumulate for physical damage
        if (isPhysicalDamage(stat)) {
          const current = modStatsByKey.get(stat) ?? 0;
          modStatsByKey.set(stat, current + value);
        }
      } else {
        const current = modStatsByKey.get(stat) ?? 0;
        modStatsByKey.set(stat, current + value);
      }
    }
  }

  // --- Layer 1: Base Damage ---
  const baseDamageBonus = modStatsByKey.get('damage') ?? 0;
  const moddedTotalDamage = base.totalDamage * (1 + baseDamageBonus);

  // Calculate modded physical damage (IPS)
  const physicalDamage: Record<string, number> = {};
  for (const [type, baseDmg] of Object.entries(base.damageDistribution)) {
    if (type === 'impact' || type === 'puncture' || type === 'slash') {
      const physBonus = modStatsByKey.get(type as WeaponStatKey) ?? 0;
      physicalDamage[type] = baseDmg * (1 + baseDamageBonus) * (1 + physBonus);
    }
  }

  // --- Layer 2: Elemental Damage ---
  // Separate innate elements (from weapon base) and mod elements
  const innateElements: ElementEntry[] = [];
  for (const [type, baseDmg] of Object.entries(base.damageDistribution)) {
    if (type !== 'impact' && type !== 'puncture' && type !== 'slash') {
      innateElements.push({
        type: type as DamageType,
        damage: baseDmg * (1 + baseDamageBonus),
      });
    }
  }

  // Only pass elemental mods (not physical) for element combining
  const elementalMods = elementModsInOrder.filter(
    e => !isPhysicalDamage(e.type)
  );

  const elementResult = combineElements(
    moddedTotalDamage,
    innateElements,
    elementalMods,
    bonusElement,
    bonusElementValue,
  );

  const totalElementalDamage = elementResult.elements.reduce(
    (sum, e) => sum + e.damage, 0,
  );

  // Total damage per projectile (physical + elemental)
  const totalPhysical = Object.values(physicalDamage).reduce((a, b) => a + b, 0);
  const damagePerShot = totalPhysical + totalElementalDamage;

  // --- Layer 3: Multishot ---
  const multishotBonus = modStatsByKey.get('multishot') ?? 0;
  const multishot = base.multishot * (1 + multishotBonus);

  // --- Layer 4: Critical ---
  const critChanceBonus = modStatsByKey.get('critChance') ?? 0;
  const critDamageBonus = modStatsByKey.get('critDamage') ?? 0;
  const moddedCritChance = base.critChance * (1 + critChanceBonus);
  const moddedCritMult = base.critMultiplier * (1 + critDamageBonus);
  const avgCritMult = calculateAvgCritMultiplier(moddedCritChance, moddedCritMult);

  // --- Layer 5: Status ---
  const statusChanceBonus = modStatsByKey.get('statusChance') ?? 0;
  const moddedStatusChance = base.statusChance * (1 + statusChanceBonus);

  // --- Layer 6: Fire Rate / Reload ---
  const fireRateBonus = modStatsByKey.get('fireRate') ?? 0;
  const attackSpeedBonus = modStatsByKey.get('attackSpeed') ?? 0;
  const rateBonus = weapon.category === 'Melee' ? attackSpeedBonus : fireRateBonus;
  const moddedFireRate = base.fireRate * (1 + rateBonus);

  const reloadSpeedBonus = modStatsByKey.get('reloadSpeed') ?? 0;
  const moddedReloadTime = base.reloadTime > 0
    ? base.reloadTime / (1 + reloadSpeedBonus)
    : 0;

  const magCapBonus = modStatsByKey.get('magazineCapacity') ?? 0;
  const moddedMagazine = Math.round(base.magazineSize * (1 + magCapBonus));

  // --- DPS Calculations ---
  const avgDamagePerShot = damagePerShot * multishot * avgCritMult;

  // Burst DPS = avgDamage * fireRate
  const burstDps = avgDamagePerShot * moddedFireRate;

  // Sustained DPS = (avgDamage * magazine) / (magazine/fireRate + reloadTime)
  const timeToEmpty = moddedMagazine > 0 ? moddedMagazine / moddedFireRate : 0;
  const sustainedDps = moddedMagazine > 0 && (timeToEmpty + moddedReloadTime) > 0
    ? (avgDamagePerShot * moddedMagazine) / (timeToEmpty + moddedReloadTime)
    : burstDps; // melee/continuous weapons

  // Melee-specific
  const rangeBonus = modStatsByKey.get('range') ?? 0;
  const moddedRange = base.range ? base.range * (1 + rangeBonus) : undefined;
  const comboDurationBonus = modStatsByKey.get('comboDuration') ?? 0;
  const moddedComboDuration = base.comboDuration
    ? base.comboDuration + comboDurationBonus
    : undefined;

  return {
    totalDamage: moddedTotalDamage,
    damagePerShot,
    physicalDamage,
    elementalDamage: elementResult.elements,
    totalElementalDamage,
    critChance: moddedCritChance,
    critMultiplier: moddedCritMult,
    statusChance: moddedStatusChance,
    multishot,
    fireRate: moddedFireRate,
    magazineSize: moddedMagazine,
    reloadTime: moddedReloadTime,
    avgDamagePerShot,
    burstDps,
    sustainedDps,
    attackSpeed: weapon.category === 'Melee' ? moddedFireRate : undefined,
    range: moddedRange,
    comboDuration: moddedComboDuration,
    textEffects,
  };
}

/**
 * Format a weapon stat value for display.
 */
export function formatWeaponStatValue(statKey: string, value: number): string {
  switch (statKey) {
    case 'critChance':
    case 'statusChance':
      return `${value.toFixed(1)}%`;
    case 'critMultiplier':
      return `${value.toFixed(1)}x`;
    case 'multishot':
      return value.toFixed(2);
    case 'fireRate':
    case 'attackSpeed':
      return value.toFixed(2);
    case 'reloadTime':
      return `${value.toFixed(2)}s`;
    case 'magazineSize':
      return Math.round(value).toString();
    case 'range':
      return `${value.toFixed(1)}m`;
    case 'comboDuration':
      return `${value.toFixed(1)}s`;
    case 'burstDps':
    case 'sustainedDps':
    case 'avgDamagePerShot':
    case 'totalDamage':
    case 'damagePerShot':
      return Math.round(value).toLocaleString();
    default:
      return Math.round(value).toString();
  }
}
