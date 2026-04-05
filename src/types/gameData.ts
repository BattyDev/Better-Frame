// TypeScript interfaces for warframe-items game data

export interface WarframeData {
  uniqueName: string;
  name: string;
  description: string;
  imageName: string;
  category: 'Warframes';
  health: number;
  shield: number;
  armor: number;
  power: number; // energy
  sprint: number;
  sprintSpeed: number;
  abilities: WarframeAbility[];
  aura: string; // polarity of aura slot
  polarities: string[]; // default slot polarities
  isPrime: boolean;
  masteryReq: number;
  passiveDescription: string;
  exalted?: string[]; // unique names of exalted weapons
  sex: string;
  introduced: { name: string; date: string };
  wikiaThumbnail?: string;
  wikiaUrl?: string;
}

export interface WarframeAbility {
  uniqueName: string;
  name: string;
  description: string;
  imageName: string;
}

export interface ModData {
  uniqueName: string;
  name: string;
  description?: string;
  imageName: string;
  category: 'Mods';
  type: string; // 'Warframe Mod', 'Primary Mod', etc.
  compatName: string; // 'WARFRAME', 'AURA', 'Rifle', etc.
  polarity: string;
  rarity: ModRarity;
  baseDrain: number; // negative for auras (they grant capacity)
  fusionLimit: number; // max rank
  levelStats: ModLevelStat[];
  isExilus?: boolean;
  isAugment?: boolean;
  wikiaThumbnail?: string;
  wikiaUrl?: string;
  // Set mod info
  modSet?: string;
  // For augments: which ability this mod augments (e.g., "Molt", "Shock")
  augmentFor?: string;
}

export interface ModLevelStat {
  stats: string[];
}

export type ModRarity = 'Common' | 'Uncommon' | 'Rare' | 'Legendary' | 'Riven' | 'Peculiar';

export interface ArcaneData {
  uniqueName: string;
  name: string;
  imageName: string;
  category: string;
  type: string;
  rarity: string;
  levelStats: ModLevelStat[];
  tradable: boolean;
}

// ---- Weapon data ----

export type WeaponCategory = 'Primary' | 'Secondary' | 'Melee';

export type DamageType =
  | 'impact' | 'puncture' | 'slash'
  | 'heat' | 'cold' | 'electricity' | 'toxin'
  | 'blast' | 'corrosive' | 'gas' | 'magnetic' | 'radiation' | 'viral'
  | 'void' | 'true';

export interface WeaponAttack {
  name: string;
  speed: number;
  crit_chance: number;
  crit_mult: number;
  status_chance: number;
  damage: Partial<Record<DamageType, number>>;
  shot_type?: string;
  falloff?: { start: number; end: number; reduction: number };
}

export interface WeaponData {
  uniqueName: string;
  name: string;
  description: string;
  imageName: string;
  category: WeaponCategory;
  masteryReq: number;
  attacks: WeaponAttack[];
  fireRate: number;
  magazineSize?: number;
  reloadTime?: number;
  totalDamage: number;
  polarities: string[];
  isPrime: boolean;
  noise?: string;
  trigger?: string;
  accuracy?: number;
  // Melee-specific
  stancePolarity?: string;
  comboDuration?: number;
  followThrough?: number;
  range?: number;
  slamAttack?: number;
  heavySlamAttack?: number;
  heavyAttack?: number;
  // Variant info
  vaulted?: boolean;
  omegaAttenuation?: number;
}

// Parsed stat modifier from levelStats strings
export interface StatModifier {
  stat: string; // normalized stat key e.g. 'health', 'abilityStrength'
  value: number; // e.g. 0.40 for +40%
  isPercentage: boolean;
  isNegative: boolean;
  rawText: string; // original string for display
}
