// Parses conditional buff patterns from Galvanized and other conditional mods
// e.g. "On Kill:\n+60% Status Chance for 6s. Stacks up to 4x."

import type { ModData } from '../../types/gameData';

export interface ConditionalBuff {
  modName: string;
  trigger: string; // "On Kill", "On Headshot", etc.
  description: string; // Full conditional text
  perStack: string; // e.g. "+60% Status Chance"
  maxStacks: number;
  duration: number; // seconds
}

const CONDITIONAL_PATTERN = /^(On (?:Kill|Headshot|Critical Hit|Melee Kill)[^:]*):$/;
const STACK_PATTERN = /Stacks?\s+up\s+to\s+(\d+)x/i;
const DURATION_PATTERN = /for\s+(\d+(?:\.\d+)?)\s*s/i;

/**
 * Parse conditional buff patterns from a mod's levelStats.
 * Returns empty array if the mod has no conditional buffs.
 */
export function parseConditionalBuffs(mod: ModData, rank: number): ConditionalBuff[] {
  if (!mod.levelStats || rank < 0 || rank >= mod.levelStats.length) {
    return [];
  }

  const buffs: ConditionalBuff[] = [];
  const levelStat = mod.levelStats[rank];

  for (const statText of levelStat.stats) {
    const lines = statText.split('\n').map(l => l.trim()).filter(Boolean);

    for (let i = 0; i < lines.length; i++) {
      const triggerMatch = lines[i].match(CONDITIONAL_PATTERN);
      if (!triggerMatch) continue;

      const trigger = triggerMatch[1];
      // The next line(s) contain the buff description
      const buffLines: string[] = [];
      for (let j = i + 1; j < lines.length; j++) {
        // Stop if we hit another trigger line
        if (CONDITIONAL_PATTERN.test(lines[j])) break;
        buffLines.push(lines[j]);
      }

      if (buffLines.length === 0) continue;

      const fullText = buffLines.join(' ');
      const stackMatch = fullText.match(STACK_PATTERN);
      const durationMatch = fullText.match(DURATION_PATTERN);
      // Extract the per-stack bonus (text before "for Xs")
      const perStack = fullText.replace(/\s*for\s+\d+(?:\.\d+)?\s*s.*$/i, '').trim();

      buffs.push({
        modName: mod.name,
        trigger,
        description: fullText,
        perStack,
        maxStacks: stackMatch ? parseInt(stackMatch[1], 10) : 1,
        duration: durationMatch ? parseFloat(durationMatch[1]) : 0,
      });
    }
  }

  return buffs;
}
