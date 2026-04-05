// Warframe stat calculator: applies mod effects to base warframe stats
import type { WarframeData, ModData, ArcaneData, StatModifier } from '../../types/gameData';
import type { StatKey } from './statRegistry';
import { STAT_DISPLAY_NAMES } from './statRegistry';
import { parseModStats } from './modParser';
import { detectSetBonuses, type ActiveSetBonus } from '../../data/setBonus';
import { parseConditionalBuffs, type ConditionalBuff } from './conditionalBuffs';
import { parseArcaneEffects, type ArcaneEffect } from './arcaneParser';

// Base stats that come from the warframe itself
export interface WarframeBaseStats {
  health: number;
  shield: number;
  armor: number;
  energy: number;
  sprintSpeed: number;
  // Ability stats have base of 100% (1.0)
  abilityStrength: number;
  abilityDuration: number;
  abilityRange: number;
  abilityEfficiency: number;
}

export interface CalculatedStats {
  base: Record<string, number>;
  modded: Record<string, number>;
  // Text-only effects that can't be calculated
  textEffects: string[];
  // Set bonuses from equipped mods
  setBonuses: ActiveSetBonus[];
  // Conditional buffs (Galvanized stacking, On Kill, etc.)
  conditionalBuffs: ConditionalBuff[];
  // Arcane proc effects
  arcaneEffects: ArcaneEffect[];
}

/**
 * Extract base stats from warframe data.
 * Note: warframe-items health/shield/armor/energy are at rank 30 values.
 */
export function getWarframeBaseStats(warframe: WarframeData): WarframeBaseStats {
  return {
    health: warframe.health,
    shield: warframe.shield,
    armor: warframe.armor,
    energy: warframe.power,
    sprintSpeed: warframe.sprint,
    abilityStrength: 1.0,
    abilityDuration: 1.0,
    abilityRange: 1.0,
    abilityEfficiency: 1.0,
  };
}

// Stats that use the multiplicative formula: base * (1 + sum_of_mods)
const MULTIPLICATIVE_STATS: StatKey[] = [
  'health',
  'shield',
  'armor',
  'energy',
  'abilityStrength',
  'abilityDuration',
  'abilityRange',
  'abilityEfficiency',
  'sprintSpeed',
];

/**
 * Calculate final warframe stats with all mods applied.
 *
 * Formula: Final = Base × (1 + Σ additive mods)
 * For warframe stats, all mods in the same stat category stack additively,
 * then multiply the base stat.
 */
export function calculateWarframeStats(
  warframe: WarframeData,
  mods: { mod: ModData; rank: number }[],
  arcanes?: { arcane: ArcaneData; rank: number }[],
): CalculatedStats {
  const baseStats = getWarframeBaseStats(warframe);

  // Collect all stat modifiers from all mods
  const allModifiers: StatModifier[] = [];
  const textEffects: string[] = [];
  const conditionalBuffs: ConditionalBuff[] = [];

  for (const { mod, rank } of mods) {
    const modStats = parseModStats(mod, rank);

    // Check for conditional buffs (Galvanized mods, etc.)
    const condBuffs = parseConditionalBuffs(mod, rank);
    if (condBuffs.length > 0) {
      conditionalBuffs.push(...condBuffs);
    }

    for (const modifier of modStats) {
      if (modifier.stat === 'unknown') {
        textEffects.push(modifier.rawText);
      } else {
        allModifiers.push(modifier);
      }
    }
  }

  // Detect set bonuses from equipped mods
  const modsForSetDetection = mods.map(({ mod }) => ({
    modSet: mod.modSet,
    name: mod.name,
  }));
  const setBonuses = detectSetBonuses(modsForSetDetection);

  // Group modifiers by stat
  const modifiersByStat = new Map<string, number>();
  for (const mod of allModifiers) {
    const current = modifiersByStat.get(mod.stat) ?? 0;
    modifiersByStat.set(mod.stat, current + mod.value);
  }

  // Apply Umbral/Sacrificial set bonus multipliers
  for (const setBonus of setBonuses) {
    if (!setBonus.activeTier?.statBonus) continue;
    const { stat, value } = setBonus.activeTier.statBonus;
    if (stat !== 'umbralSetMultiplier' && stat !== 'sacrificialSetMultiplier') continue;

    const setPrefix = setBonus.data.setKey;
    for (const { mod, rank } of mods) {
      if (!mod.modSet?.includes(`/Sets/${setPrefix}/`)) continue;
      const modStats = parseModStats(mod, rank);
      for (const modifier of modStats) {
        if (modifier.stat !== 'unknown') {
          const current = modifiersByStat.get(modifier.stat) ?? 0;
          modifiersByStat.set(modifier.stat, current + modifier.value * value);
        }
      }
    }
  }

  // Calculate modded stats
  const base: Record<string, number> = {};
  const modded: Record<string, number> = {};

  for (const statKey of MULTIPLICATIVE_STATS) {
    const baseVal = baseStats[statKey];
    base[statKey] = baseVal;

    const totalBonus = modifiersByStat.get(statKey) ?? 0;

    if (statKey === 'abilityStrength' || statKey === 'abilityDuration' ||
        statKey === 'abilityRange' || statKey === 'abilityEfficiency') {
      // Ability stats: base is 1.0 (100%), result is percentage
      let finalVal = baseVal + totalBonus;

      // Ability Efficiency caps at 175% (1.75)
      if (statKey === 'abilityEfficiency') {
        finalVal = Math.min(finalVal, 1.75);
      }

      modded[statKey] = finalVal;
    } else {
      // Regular stats: base * (1 + bonus)
      modded[statKey] = Math.round(baseVal * (1 + totalBonus));
    }
  }

  // Handle any non-multiplicative stats (flat bonuses like radar)
  for (const [stat, bonus] of modifiersByStat) {
    if (!MULTIPLICATIVE_STATS.includes(stat as StatKey)) {
      base[stat] = 0;
      modded[stat] = bonus;
    }
  }

  // Parse arcane effects
  const arcaneEffects: ArcaneEffect[] = [];
  if (arcanes) {
    for (const { arcane, rank } of arcanes) {
      const effects = parseArcaneEffects(arcane, rank);
      arcaneEffects.push(...effects);
    }
  }

  return { base, modded, textEffects, setBonuses, conditionalBuffs, arcaneEffects };
}

/**
 * Format a stat value for display.
 */
export function formatStatValue(statKey: string, value: number): string {
  const abilityStats: string[] = [
    'abilityStrength', 'abilityDuration', 'abilityRange', 'abilityEfficiency',
  ];

  if (abilityStats.includes(statKey)) {
    return `${Math.round(value * 100)}%`;
  }

  if (statKey === 'sprintSpeed') {
    return value.toFixed(2);
  }

  if (statKey === 'enemyRadar' || statKey === 'lootRadar') {
    return `${value}m`;
  }

  return Math.round(value).toString();
}

/**
 * Get the display name for a stat key.
 */
export function getStatDisplayName(statKey: string): string {
  return STAT_DISPLAY_NAMES[statKey as StatKey] ?? statKey;
}
