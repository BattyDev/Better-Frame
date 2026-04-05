// Parses arcane levelStats text to extract trigger conditions and effects
// Arcane text format: "On Critical Hit:\n30% chance for +90% Fire Rate for 12s"

import type { ArcaneData } from '../../types/gameData';

export interface ArcaneEffect {
  arcaneName: string;
  trigger: string; // "On Critical Hit", "On Energy Pickup", etc.
  chance: number | null; // 0-100, null if always active
  effects: string[]; // e.g. ["+90% Fire Rate"]
  duration: number | null; // seconds, null if permanent
  rawText: string;
}

const TRIGGER_PATTERN = /^(On [^:]+):$/;
const CHANCE_PATTERN = /(\d+(?:\.\d+)?)\s*%\s*chance/i;
const DURATION_PATTERN = /for\s+(\d+(?:\.\d+)?)\s*s/i;

/**
 * Parse arcane effects from an arcane's levelStats at a given rank.
 */
export function parseArcaneEffects(arcane: ArcaneData, rank: number): ArcaneEffect[] {
  if (!arcane.levelStats || rank < 0 || rank >= arcane.levelStats.length) {
    return [];
  }

  const effects: ArcaneEffect[] = [];
  const levelStat = arcane.levelStats[rank];

  for (const statText of levelStat.stats) {
    const lines = statText.split('\n').map(l => l.trim()).filter(Boolean);

    let trigger = 'Passive';
    let effectLines: string[] = [];

    for (const line of lines) {
      const triggerMatch = line.match(TRIGGER_PATTERN);
      if (triggerMatch) {
        // If we already collected effect lines, flush previous effect
        if (effectLines.length > 0) {
          effects.push(buildEffect(arcane.name, trigger, effectLines, statText));
          effectLines = [];
        }
        trigger = triggerMatch[1];
      } else {
        effectLines.push(line);
      }
    }

    // Flush remaining
    if (effectLines.length > 0) {
      effects.push(buildEffect(arcane.name, trigger, effectLines, statText));
    } else if (lines.length > 0 && !TRIGGER_PATTERN.test(lines[0])) {
      // No trigger pattern found — passive arcane
      effects.push(buildEffect(arcane.name, 'Passive', lines, statText));
    }
  }

  return effects;
}

function buildEffect(
  arcaneName: string,
  trigger: string,
  effectLines: string[],
  rawText: string,
): ArcaneEffect {
  const fullText = effectLines.join(' ');
  const chanceMatch = fullText.match(CHANCE_PATTERN);
  const durationMatch = fullText.match(DURATION_PATTERN);

  // Extract stat bonuses from the text (e.g., "+90% Fire Rate", "+150 Health")
  const effectParts = fullText
    .replace(/\d+(?:\.\d+)?%\s*chance\s*/i, '')
    .replace(/for\s+\d+(?:\.\d+)?\s*s\.?/i, '')
    .replace(/^\s*for\s+/, '')
    .split(/,\s*/)
    .map(s => s.trim())
    .filter(s => s && /[+-]?\d/.test(s));

  return {
    arcaneName,
    trigger,
    chance: chanceMatch ? parseFloat(chanceMatch[1]) : null,
    effects: effectParts.length > 0 ? effectParts : [fullText],
    duration: durationMatch ? parseFloat(durationMatch[1]) : null,
    rawText,
  };
}
