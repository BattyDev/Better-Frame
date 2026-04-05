// Element combination logic for Warframe weapon modding
// Elements combine left-to-right based on mod slot order.
// Base elements: Heat, Cold, Electricity, Toxin
// Combined elements are formed by pairing base elements in specific combos.

import type { DamageType } from '../../types/gameData';
import type { WeaponStatKey } from './weaponStatRegistry';

type BaseElement = 'heat' | 'cold' | 'electricity' | 'toxin';

// Element combination rules: [element1, element2] -> combined element
// Order doesn't matter for the pair, but processing order matters
const ELEMENT_COMBINATIONS: Record<string, DamageType> = {
  'cold+heat': 'blast',
  'heat+cold': 'blast',
  'electricity+toxin': 'corrosive',
  'toxin+electricity': 'corrosive',
  'heat+toxin': 'gas',
  'toxin+heat': 'gas',
  'cold+electricity': 'magnetic',
  'electricity+cold': 'magnetic',
  'heat+electricity': 'radiation',
  'electricity+heat': 'radiation',
  'cold+toxin': 'viral',
  'toxin+cold': 'viral',
};

function combineKey(a: string, b: string): string {
  return `${a}+${b}`;
}

function isBaseElement(e: string): e is BaseElement {
  return e === 'heat' || e === 'cold' || e === 'electricity' || e === 'toxin';
}

export interface ElementEntry {
  type: DamageType;
  damage: number;
}

export interface ElementCombineResult {
  elements: ElementEntry[];
}

/**
 * Combine elements based on mod slot order.
 *
 * @param moddedBaseDamage - Total base damage after base damage mods (Serration etc.)
 * @param innateElements - Elements already on the weapon (from base damage distribution)
 * @param modElements - Elements from mods, in slot order (left to right)
 * @param bonusElement - Kuva/Tenet bonus element (combines FIRST, before any mod elements)
 * @param bonusElementValue - Damage percentage for bonus element (e.g., 0.60 for 60%)
 * @returns Combined element list with damage values
 */
export function combineElements(
  moddedBaseDamage: number,
  innateElements: ElementEntry[],
  modElements: { type: WeaponStatKey; value: number }[],
  bonusElement?: DamageType,
  bonusElementValue?: number,
): ElementCombineResult {
  // Start with innate elements
  // Build an ordered list of elements to process
  const elementQueue: { type: string; damage: number }[] = [];

  // 1. Kuva/Tenet bonus element goes first
  if (bonusElement && bonusElementValue && isBaseElement(bonusElement)) {
    elementQueue.push({
      type: bonusElement,
      damage: moddedBaseDamage * bonusElementValue,
    });
  }

  // 2. Innate elements from the weapon itself
  for (const innate of innateElements) {
    if (isBaseElement(innate.type)) {
      // Find existing in queue
      const existing = elementQueue.find(e => e.type === innate.type);
      if (existing) {
        existing.damage += innate.damage;
      } else {
        elementQueue.push({ type: innate.type, damage: innate.damage });
      }
    }
  }

  // 3. Mod elements in slot order
  for (const modElem of modElements) {
    const elemType = modElem.type as string;
    if (isBaseElement(elemType)) {
      // Base element mods add percentage of modded base damage
      const damage = moddedBaseDamage * modElem.value;
      const existing = elementQueue.find(e => e.type === elemType);
      if (existing) {
        existing.damage += damage;
      } else {
        elementQueue.push({ type: elemType, damage });
      }
    } else {
      // Combined element mods (e.g., a mod that directly adds Corrosive)
      elementQueue.push({ type: elemType, damage: moddedBaseDamage * modElem.value });
    }
  }

  // Now combine base elements left-to-right
  const result = combinePairs(elementQueue);

  // Add innate combined elements that weren't part of the combination process
  for (const innate of innateElements) {
    if (!isBaseElement(innate.type)) {
      const existing = result.find(e => e.type === innate.type);
      if (existing) {
        existing.damage += innate.damage;
      } else {
        result.push({ type: innate.type as DamageType, damage: innate.damage });
      }
    }
  }

  return {
    elements: result.map(e => ({
      type: e.type as DamageType,
      damage: Math.round(e.damage * 100) / 100,
    })),
  };
}

/**
 * Combine base elements left-to-right into combined elements.
 * Elements pair with the first available unpaired base element to their left.
 */
function combinePairs(
  queue: { type: string; damage: number }[],
): { type: string; damage: number }[] {
  const result: { type: string; damage: number }[] = [];
  const pending: { type: string; damage: number }[] = [];

  for (const entry of queue) {
    if (!isBaseElement(entry.type)) {
      // Combined element from mod - goes directly to result
      result.push(entry);
      continue;
    }

    // Try to combine with a pending base element
    let combined = false;
    for (let i = 0; i < pending.length; i++) {
      const key = combineKey(pending[i].type, entry.type);
      const combinedType = ELEMENT_COMBINATIONS[key];
      if (combinedType) {
        // Combine!
        result.push({
          type: combinedType,
          damage: pending[i].damage + entry.damage,
        });
        pending.splice(i, 1);
        combined = true;
        break;
      }
    }

    if (!combined) {
      pending.push(entry);
    }
  }

  // Any remaining unpaired base elements go to result
  for (const p of pending) {
    result.push(p);
  }

  return result;
}

// Display colors for elements (used in UI)
export const ELEMENT_COLORS: Record<string, string> = {
  impact: '#8899AA',
  puncture: '#AABB99',
  slash: '#CC9966',
  heat: '#FF6633',
  cold: '#66CCFF',
  electricity: '#99CCFF',
  toxin: '#66FF33',
  blast: '#FFCC00',
  corrosive: '#99FF66',
  gas: '#99CC66',
  magnetic: '#6699FF',
  radiation: '#CC9933',
  viral: '#66FFCC',
  void: '#8866CC',
};

export const ELEMENT_DISPLAY_NAMES: Record<string, string> = {
  impact: 'Impact',
  puncture: 'Puncture',
  slash: 'Slash',
  heat: 'Heat',
  cold: 'Cold',
  electricity: 'Electricity',
  toxin: 'Toxin',
  blast: 'Blast',
  corrosive: 'Corrosive',
  gas: 'Gas',
  magnetic: 'Magnetic',
  radiation: 'Radiation',
  viral: 'Viral',
  void: 'Void',
  true: 'True',
};
