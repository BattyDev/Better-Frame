// Parses mod levelStats strings into structured StatModifier objects
import type { ModData } from '../../types/gameData';
import type { StatModifier } from '../../types/gameData';
import { parseStatString } from './statRegistry';

/**
 * Parse all stat effects from a mod at a given rank.
 * Returns an array of StatModifier objects for stats we can calculate,
 * plus raw text entries for effects we can't parse (text-only effects).
 */
export function parseModStats(mod: ModData, rank: number): StatModifier[] {
  if (!mod.levelStats || rank < 0 || rank >= mod.levelStats.length) {
    return [];
  }

  const levelStat = mod.levelStats[rank];
  const modifiers: StatModifier[] = [];

  for (const statText of levelStat.stats) {
    // Some stats have multiple lines separated by \n
    const lines = statText.split('\n');

    for (const line of lines) {
      const trimmed = line.trim();
      if (!trimmed) continue;

      const parsed = parseStatString(trimmed);
      if (parsed) {
        modifiers.push({
          stat: parsed.stat,
          value: parsed.value,
          isPercentage: parsed.isPercentage,
          isNegative: parsed.value < 0,
          rawText: trimmed,
        });
      } else {
        // Text-only effect — store raw text with no calculable stat
        modifiers.push({
          stat: 'unknown' as string,
          value: 0,
          isPercentage: false,
          isNegative: false,
          rawText: trimmed,
        });
      }
    }
  }

  return modifiers;
}

/**
 * Get the max rank of a mod.
 */
export function getModMaxRank(mod: ModData): number {
  return mod.fusionLimit;
}

/**
 * Get the drain of a mod at a given rank.
 * Drain increases by 1 per rank from baseDrain.
 */
export function getModDrain(mod: ModData, rank: number): number {
  return mod.baseDrain + rank;
}
