// Mod capacity calculation: polarity matching, aura bonuses, reactor doubling
import type { Polarity } from '../../types';
import type { ModData } from '../../types/gameData';
import { getModDrain } from './modParser';

const BASE_CAPACITY = 30;

/**
 * Calculate the effective drain of a mod in a given slot.
 *
 * Polarity matching rules:
 * - Matching polarity: drain halved (rounded up for positive, rounded down for negative/aura)
 * - Mismatched polarity (slot has polarity, mod has different): drain increased by 25% (rounded up)
 * - No polarity on slot: drain unchanged
 */
export function getEffectiveDrain(
  mod: ModData,
  rank: number,
  slotPolarity: Polarity | null,
): number {
  const baseDrain = getModDrain(mod, rank);

  if (!slotPolarity) {
    return baseDrain;
  }

  if (mod.polarity === slotPolarity) {
    // Matching: halve the drain
    if (baseDrain < 0) {
      // Aura: matching doubles the bonus (more negative = more capacity)
      return baseDrain * 2;
    }
    return Math.ceil(baseDrain / 2);
  }

  // Mismatched: slot has polarity but mod doesn't match
  if (baseDrain < 0) {
    // Aura with wrong polarity: halved bonus (less negative)
    return Math.ceil(baseDrain / 2);
  }
  return Math.ceil(baseDrain * 1.25);
}

export interface CapacityResult {
  totalCapacity: number;
  usedCapacity: number;
  remainingCapacity: number;
  isOverCapacity: boolean;
}

/**
 * Calculate total build capacity.
 *
 * @param hasReactor - Whether an Orokin Reactor is installed (doubles base)
 * @param auraMod - The aura mod (if any)
 * @param auraRank - Rank of the aura mod
 * @param auraSlotPolarity - Polarity of the aura slot
 * @param mods - Array of {mod, rank, slotPolarity} for each filled slot
 * @param exilusMod - Exilus mod (if any)
 * @param exilusRank - Rank of exilus
 * @param exilusSlotPolarity - Polarity of exilus slot
 */
export function calculateCapacity(params: {
  hasReactor: boolean;
  auraMod: ModData | null;
  auraRank: number;
  auraSlotPolarity: Polarity | null;
  mods: { mod: ModData; rank: number; slotPolarity: Polarity | null }[];
  exilusMod: ModData | null;
  exilusRank: number;
  exilusSlotPolarity: Polarity | null;
}): CapacityResult {
  let totalCapacity = BASE_CAPACITY;

  // Orokin Reactor doubles base capacity
  if (params.hasReactor) {
    totalCapacity *= 2;
  }

  // Aura adds capacity (aura drain is negative, so we subtract it to add)
  if (params.auraMod) {
    const auraDrain = getEffectiveDrain(
      params.auraMod,
      params.auraRank,
      params.auraSlotPolarity,
    );
    totalCapacity -= auraDrain; // drain is negative, so this adds
  }

  // Sum drain from all regular mods
  let usedCapacity = 0;

  for (const slot of params.mods) {
    usedCapacity += getEffectiveDrain(slot.mod, slot.rank, slot.slotPolarity);
  }

  // Exilus drain
  if (params.exilusMod) {
    usedCapacity += getEffectiveDrain(
      params.exilusMod,
      params.exilusRank,
      params.exilusSlotPolarity,
    );
  }

  return {
    totalCapacity,
    usedCapacity,
    remainingCapacity: totalCapacity - usedCapacity,
    isOverCapacity: usedCapacity > totalCapacity,
  };
}
