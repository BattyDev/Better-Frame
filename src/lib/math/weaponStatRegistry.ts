// Maps weapon mod stat strings to normalized keys for calculation
// Handles damage, crit, status, multishot, fire rate, reload, etc.

export type WeaponStatKey =
  | 'damage'
  | 'multishot'
  | 'critChance'
  | 'critDamage'
  | 'statusChance'
  | 'statusDuration'
  | 'fireRate'
  | 'reloadSpeed'
  | 'magazineCapacity'
  | 'punchThrough'
  | 'projectileSpeed'
  | 'accuracy'
  // Physical damage types
  | 'impact'
  | 'puncture'
  | 'slash'
  // Elemental damage types
  | 'heat'
  | 'cold'
  | 'electricity'
  | 'toxin'
  // Combined elements (from mods directly)
  | 'blast'
  | 'corrosive'
  | 'gas'
  | 'magnetic'
  | 'radiation'
  | 'viral'
  // Melee-specific
  | 'attackSpeed'
  | 'range'
  | 'comboDuration'
  | 'channelDamage'
  | 'channelEfficiency'
  | 'slamRadius'
  | 'heavyAttack'
  | 'heavyAttackWindUp';

export interface ParsedWeaponStat {
  stat: WeaponStatKey;
  value: number;
  isPercentage: boolean;
}

// Stat strings in warframe-items use color tags like <DT_FIRE_COLOR>Heat
// We need to strip these and match the element name
const ELEMENT_TAG_MAP: Record<string, WeaponStatKey> = {
  'DT_FIRE_COLOR': 'heat',
  'DT_FREEZE_COLOR': 'cold',
  'DT_ELECTRICITY_COLOR': 'electricity',
  'DT_POISON_COLOR': 'toxin',
  'DT_EXPLOSION_COLOR': 'blast',
  'DT_CORROSIVE_COLOR': 'corrosive',
  'DT_GAS_COLOR': 'gas',
  'DT_MAGNETIC_COLOR': 'magnetic',
  'DT_RADIATION_COLOR': 'radiation',
  'DT_VIRAL_COLOR': 'viral',
  'DT_IMPACT_COLOR': 'impact',
  'DT_PUNCTURE_COLOR': 'puncture',
  'DT_SLASH_COLOR': 'slash',
};

const WEAPON_STAT_PATTERNS: [RegExp, WeaponStatKey, boolean][] = [
  // Critical stats must come before generic "damage" pattern
  [/critical chance/i, 'critChance', true],
  [/critical damage/i, 'critDamage', true],
  // General weapon stats
  [/(?<!base )damage(?! to)/i, 'damage', true],
  [/multishot/i, 'multishot', true],
  [/status chance/i, 'statusChance', true],
  [/status duration/i, 'statusDuration', true],
  [/fire rate/i, 'fireRate', true],
  [/attack speed/i, 'attackSpeed', true],
  [/reload speed/i, 'reloadSpeed', true],
  [/magazine capacity/i, 'magazineCapacity', true],
  [/punch through/i, 'punchThrough', false],
  [/projectile.*speed/i, 'projectileSpeed', true],
  [/accuracy/i, 'accuracy', true],
  // Melee-specific
  [/melee range/i, 'range', true],
  [/range/i, 'range', true],
  [/combo duration/i, 'comboDuration', false],
  [/heavy attack/i, 'heavyAttack', true],
  [/slam radius/i, 'slamRadius', true],
  [/wind up/i, 'heavyAttackWindUp', true],
  // Physical damage types
  [/impact/i, 'impact', true],
  [/puncture/i, 'puncture', true],
  [/slash/i, 'slash', true],
];

/**
 * Parse a single weapon mod stat string.
 * Handles both plain text and color-tagged element stats like "+40% <DT_FIRE_COLOR>Heat"
 */
export function parseWeaponStatString(text: string): ParsedWeaponStat | null {
  // Extract numeric value
  const valueMatch = text.match(/([+-]?\d+(?:\.\d+)?)\s*(%|m\b|s\b)?/);
  if (!valueMatch) return null;

  const rawValue = parseFloat(valueMatch[1]);
  const hasPercent = valueMatch[2] === '%';

  // Check for element color tags first
  const elementMatch = text.match(/<(\w+)>/);
  if (elementMatch) {
    const tag = elementMatch[1];
    const statKey = ELEMENT_TAG_MAP[tag];
    if (statKey) {
      const value = hasPercent ? rawValue / 100 : rawValue;
      return { stat: statKey, value, isPercentage: hasPercent };
    }
  }

  // Fall back to pattern matching
  for (const [pattern, statKey, defaultIsPercent] of WEAPON_STAT_PATTERNS) {
    if (pattern.test(text)) {
      const isPercentage = hasPercent || defaultIsPercent;
      const value = isPercentage ? rawValue / 100 : rawValue;
      return { stat: statKey, value, isPercentage };
    }
  }

  return null;
}

// Human-readable display names for weapon stats
export const WEAPON_STAT_DISPLAY_NAMES: Record<WeaponStatKey, string> = {
  damage: 'Base Damage',
  multishot: 'Multishot',
  critChance: 'Critical Chance',
  critDamage: 'Critical Multiplier',
  statusChance: 'Status Chance',
  statusDuration: 'Status Duration',
  fireRate: 'Fire Rate',
  reloadSpeed: 'Reload Speed',
  magazineCapacity: 'Magazine',
  punchThrough: 'Punch Through',
  projectileSpeed: 'Projectile Speed',
  accuracy: 'Accuracy',
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
  attackSpeed: 'Attack Speed',
  range: 'Range',
  comboDuration: 'Combo Duration',
  channelDamage: 'Channel Damage',
  channelEfficiency: 'Channel Efficiency',
  slamRadius: 'Slam Radius',
  heavyAttack: 'Heavy Attack',
  heavyAttackWindUp: 'Heavy Attack Wind Up',
};

/** Check if a stat key is an elemental or physical damage type */
export function isDamageType(stat: WeaponStatKey): boolean {
  return [
    'impact', 'puncture', 'slash',
    'heat', 'cold', 'electricity', 'toxin',
    'blast', 'corrosive', 'gas', 'magnetic', 'radiation', 'viral',
  ].includes(stat);
}

/** Check if a stat key is a base physical damage type (IPS) */
export function isPhysicalDamage(stat: WeaponStatKey): boolean {
  return stat === 'impact' || stat === 'puncture' || stat === 'slash';
}

/** Check if a stat key is a base element (not combined) */
export function isBaseElement(stat: WeaponStatKey): boolean {
  return stat === 'heat' || stat === 'cold' || stat === 'electricity' || stat === 'toxin';
}

/** Check if a stat key is a combined element */
export function isCombinedElement(stat: WeaponStatKey): boolean {
  return [
    'blast', 'corrosive', 'gas', 'magnetic', 'radiation', 'viral',
  ].includes(stat);
}
