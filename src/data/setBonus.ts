// Mod Set Bonus data — curated from the Warframe wiki.
// Each set grants cumulative bonuses as more mods from the set are equipped.
// The bonus tier = (number of set mods equipped - 1), so 2 mods = tier 1, 3 mods = tier 2, etc.

export interface SetBonusTier {
  /** Number of set mods needed (minimum 2) */
  count: number;
  description: string;
  /** Calculable stat bonus, if any */
  statBonus?: { stat: string; value: number; isPercentage: boolean };
}

export interface SetBonusData {
  name: string;
  /** The modSet path prefix used in mod data (e.g. "/Lotus/Upgrades/Mods/Sets/Umbra/") */
  setKey: string;
  tiers: SetBonusTier[];
}

// Set key is the middle segment from the modSet path: /Lotus/Upgrades/Mods/Sets/{SetKey}/{SetKey}SetMod
export const MOD_SET_BONUSES: Record<string, SetBonusData> = {
  Umbra: {
    name: 'Umbral',
    setKey: 'Umbra',
    tiers: [
      { count: 2, description: '+25% set bonus to Umbral mod values', statBonus: { stat: 'umbralSetMultiplier', value: 0.25, isPercentage: true } },
      { count: 3, description: '+75% set bonus to Umbral mod values', statBonus: { stat: 'umbralSetMultiplier', value: 0.75, isPercentage: true } },
    ],
  },
  Sacrifice: {
    name: 'Sacrificial',
    setKey: 'Sacrifice',
    tiers: [
      { count: 2, description: '+25% set bonus to Sacrificial mod values', statBonus: { stat: 'sacrificialSetMultiplier', value: 0.25, isPercentage: true } },
    ],
  },
  Gladiator: {
    name: 'Gladiator',
    setKey: 'Gladiator',
    tiers: [
      { count: 2, description: '+10% Melee Crit per Combo Multiplier' },
      { count: 3, description: '+20% Melee Crit per Combo Multiplier' },
      { count: 4, description: '+30% Melee Crit per Combo Multiplier' },
      { count: 5, description: '+40% Melee Crit per Combo Multiplier' },
      { count: 6, description: '+60% Melee Crit per Combo Multiplier' },
    ],
  },
  Vigilante: {
    name: 'Vigilante',
    setKey: 'Vigilante',
    tiers: [
      { count: 2, description: '5% chance to enhance Critical Hits by one tier' },
      { count: 3, description: '10% chance to enhance Critical Hits by one tier' },
      { count: 4, description: '15% chance to enhance Critical Hits by one tier' },
      { count: 5, description: '20% chance to enhance Critical Hits by one tier' },
      { count: 6, description: '30% chance to enhance Critical Hits by one tier' },
    ],
  },
  Augur: {
    name: 'Augur',
    setKey: 'Augur',
    tiers: [
      { count: 2, description: '40% Energy spent on abilities converted to Shields' },
      { count: 3, description: '80% Energy spent on abilities converted to Shields' },
      { count: 4, description: '120% Energy spent on abilities converted to Shields' },
      { count: 5, description: '160% Energy spent on abilities converted to Shields' },
      { count: 6, description: '240% Energy spent on abilities converted to Shields' },
    ],
  },
  Hunter: {
    name: 'Hunter',
    setKey: 'Hunter',
    tiers: [
      { count: 2, description: 'Companions gain +25% Damage to enemies affected by Bleed' },
      { count: 3, description: 'Companions gain +50% Damage to enemies affected by Bleed' },
      { count: 4, description: 'Companions gain +75% Damage to enemies affected by Bleed' },
      { count: 5, description: 'Companions gain +100% Damage to enemies affected by Bleed' },
      { count: 6, description: 'Companions gain +150% Damage to enemies affected by Bleed' },
    ],
  },
  Synth: {
    name: 'Synth',
    setKey: 'Synth',
    tiers: [
      { count: 2, description: 'Holstered weapons reload 5% of magazine per second' },
      { count: 3, description: 'Holstered weapons reload 10% of magazine per second' },
      { count: 4, description: 'Holstered weapons reload 20% of magazine per second' },
    ],
  },
  Tek: {
    name: 'Tek',
    setKey: 'Tek',
    tiers: [
      { count: 2, description: 'Kavat gains +30% chance to ignore lethal damage' },
      { count: 3, description: 'Kavat gains +60% chance to ignore lethal damage' },
      { count: 4, description: 'Kavat gains +90% chance to ignore lethal damage' },
    ],
  },
  Mecha: {
    name: 'Mecha',
    setKey: 'Mecha',
    tiers: [
      { count: 2, description: 'Kubrow marks an enemy every 60s; killing it spreads status to nearby enemies' },
      { count: 3, description: '+50% Damage to marked target' },
      { count: 4, description: '+100% Damage to marked target' },
    ],
  },
  Strain: {
    name: 'Strain',
    setKey: 'Strain',
    tiers: [
      { count: 2, description: 'Maggots gain +20% Damage and explode on death' },
      { count: 3, description: 'Maggots gain +50% Damage and explode on death' },
      { count: 4, description: 'Maggots gain +100% Damage and explode on death' },
    ],
  },
  Hawk: {
    name: 'Aero',
    setKey: 'Hawk',
    tiers: [
      { count: 2, description: '+100% chance to resist staggers while airborne' },
      { count: 3, description: 'Landing from Aim Glide creates 5m shockwave (100 Damage)' },
    ],
  },
  Raptor: {
    name: 'Motus',
    setKey: 'Raptor',
    tiers: [
      { count: 2, description: '+100% Double Jump strength' },
      { count: 3, description: 'Landing from midair creates 5m shockwave (100 Damage)' },
    ],
  },
  Spider: {
    name: 'Proton',
    setKey: 'Spider',
    tiers: [
      { count: 2, description: '+100% Shield Recharge during Aim Glide' },
      { count: 3, description: 'Landing from Aim Glide restores 50 Shields' },
    ],
  },
  Amar: {
    name: 'Amar',
    setKey: 'Amar',
    tiers: [
      { count: 2, description: '+4% Damage on Finisher Kill for 20s. Stacks up to 3x.' },
      { count: 3, description: '+8% Damage on Finisher Kill for 20s. Stacks up to 3x.' },
    ],
  },
  Boreal: {
    name: 'Boreal',
    setKey: 'Boreal',
    tiers: [
      { count: 2, description: '+4% Ability Duration on Headshot Kill for 20s. Stacks up to 3x.' },
      { count: 3, description: '+8% Ability Duration on Headshot Kill for 20s. Stacks up to 3x.' },
    ],
  },
  Nira: {
    name: 'Nira',
    setKey: 'Nira',
    tiers: [
      { count: 2, description: '+1% Health Regen/s on Melee Kill for 20s. Stacks up to 3x.' },
      { count: 3, description: '+2% Health Regen/s on Melee Kill for 20s. Stacks up to 3x.' },
    ],
  },
  Ashen: {
    name: 'Carnis',
    setKey: 'Ashen',
    tiers: [
      { count: 2, description: '+25% Evasion for 3s on taking damage' },
      { count: 3, description: '+50% Evasion for 3s on taking damage' },
    ],
  },
  Boneblade: {
    name: 'Jugulus',
    setKey: 'Boneblade',
    tiers: [
      { count: 2, description: '+25% Status Chance for 3s on taking damage' },
      { count: 3, description: '+50% Status Chance for 3s on taking damage' },
    ],
  },
  Femur: {
    name: 'Saxum',
    setKey: 'Femur',
    tiers: [
      { count: 2, description: '+25% Knockdown on enemies in 5m when landing from 3m fall' },
      { count: 3, description: '+50% Knockdown on enemies in 5m when landing from 3m fall' },
    ],
  },
};

/**
 * Extract the set key from a mod's modSet path.
 * e.g. "/Lotus/Upgrades/Mods/Sets/Umbra/UmbraSetMod" -> "Umbra"
 */
export function getSetKeyFromPath(modSetPath: string): string | null {
  const match = modSetPath.match(/Sets\/([^/]+)\//);
  return match ? match[1] : null;
}

export interface ActiveSetBonus {
  data: SetBonusData;
  equippedCount: number;
  /** The highest tier achieved (tiers are cumulative) */
  activeTier: SetBonusTier | null;
  modNames: string[];
}

/**
 * Detect active set bonuses from a list of equipped mods.
 */
export function detectSetBonuses(
  mods: { modSet?: string; name: string }[],
): ActiveSetBonus[] {
  // Count mods per set
  const setGroups = new Map<string, string[]>();
  for (const mod of mods) {
    if (!mod.modSet) continue;
    const setKey = getSetKeyFromPath(mod.modSet);
    if (!setKey) continue;
    const group = setGroups.get(setKey) ?? [];
    group.push(mod.name);
    setGroups.set(setKey, group);
  }

  const activeBonuses: ActiveSetBonus[] = [];

  for (const [setKey, modNames] of setGroups) {
    const data = MOD_SET_BONUSES[setKey];
    if (!data || modNames.length < 2) continue;

    // Find the highest tier reached
    const activeTiers = data.tiers.filter(t => modNames.length >= t.count);
    const activeTier = activeTiers.length > 0 ? activeTiers[activeTiers.length - 1] : null;

    activeBonuses.push({
      data,
      equippedCount: modNames.length,
      activeTier,
      modNames,
    });
  }

  return activeBonuses;
}
