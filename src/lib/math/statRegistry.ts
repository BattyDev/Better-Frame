// Maps human-readable stat names from mod descriptions to normalized internal keys

export type StatKey =
  | 'health'
  | 'shield'
  | 'armor'
  | 'energy'
  | 'sprintSpeed'
  | 'abilityStrength'
  | 'abilityDuration'
  | 'abilityRange'
  | 'abilityEfficiency'
  | 'castSpeed'
  | 'knockdownResistance'
  | 'knockdownRecovery'
  | 'aimGlide'
  | 'wallLatch'
  | 'enemyRadar'
  | 'lootRadar'
  | 'holsterSpeed'
  | 'parkourVelocity'
  | 'friction'
  | 'bulletJump'
  | 'meleeDamage'
  | 'channelEfficiency'
  | 'shieldRecharge'
  | 'healthRegen'
  | 'energyRegen';

// Map from text patterns found in levelStats to stat keys
// Keys are lowercase for matching
const STAT_PATTERNS: [RegExp, StatKey, boolean][] = [
  // [pattern, statKey, isPercentage]
  [/health/i, 'health', true],
  [/shield capacity/i, 'shield', true],
  [/shields?(?! recharge)/i, 'shield', true],
  [/armor/i, 'armor', true],
  [/energy(?! regen)/i, 'energy', true],
  [/sprint speed/i, 'sprintSpeed', true],
  [/ability strength/i, 'abilityStrength', true],
  [/ability duration/i, 'abilityDuration', true],
  [/ability range/i, 'abilityRange', true],
  [/ability efficiency/i, 'abilityEfficiency', true],
  [/cast speed/i, 'castSpeed', true],
  [/knockdown resistance/i, 'knockdownResistance', true],
  [/knockdown recovery/i, 'knockdownRecovery', true],
  [/aim glide/i, 'aimGlide', true],
  [/wall latch/i, 'wallLatch', true],
  [/enemy radar/i, 'enemyRadar', false],
  [/loot radar/i, 'lootRadar', false],
  [/holster speed/i, 'holsterSpeed', true],
  [/parkour velocity/i, 'parkourVelocity', true],
  [/bullet jump/i, 'bulletJump', true],
  [/melee damage/i, 'meleeDamage', true],
  [/shield recharge/i, 'shieldRecharge', true],
  [/friction/i, 'friction', true],
];

export interface ParsedStat {
  stat: StatKey;
  value: number;
  isPercentage: boolean;
}

/**
 * Parse a single stat string like "+40% Health" or "+30m Enemy Radar"
 * Returns null if the string doesn't match any known pattern.
 */
export function parseStatString(text: string): ParsedStat | null {
  // Extract the numeric value: matches patterns like "+40%", "-10%", "+30m", "+5"
  const valueMatch = text.match(/([+-]?\d+(?:\.\d+)?)\s*(%|m\b)?/);
  if (!valueMatch) return null;

  const rawValue = parseFloat(valueMatch[1]);
  const hasPercent = valueMatch[2] === '%';

  for (const [pattern, statKey, defaultIsPercent] of STAT_PATTERNS) {
    if (pattern.test(text)) {
      const isPercentage = hasPercent || defaultIsPercent;
      // Convert percentage to decimal (40% -> 0.40)
      const value = isPercentage ? rawValue / 100 : rawValue;
      return { stat: statKey, value, isPercentage };
    }
  }

  return null;
}

// Human-readable display names for stats
export const STAT_DISPLAY_NAMES: Record<StatKey, string> = {
  health: 'Health',
  shield: 'Shield',
  armor: 'Armor',
  energy: 'Energy',
  sprintSpeed: 'Sprint Speed',
  abilityStrength: 'Ability Strength',
  abilityDuration: 'Ability Duration',
  abilityRange: 'Ability Range',
  abilityEfficiency: 'Ability Efficiency',
  castSpeed: 'Cast Speed',
  knockdownResistance: 'Knockdown Resistance',
  knockdownRecovery: 'Knockdown Recovery',
  aimGlide: 'Aim Glide',
  wallLatch: 'Wall Latch',
  bulletJump: 'Bullet Jump',
  parkourVelocity: 'Parkour Velocity',
  enemyRadar: 'Enemy Radar',
  lootRadar: 'Loot Radar',
  holsterSpeed: 'Holster Speed',
  meleeDamage: 'Melee Damage',
  channelEfficiency: 'Channel Efficiency',
  shieldRecharge: 'Shield Recharge',
  healthRegen: 'Health Regen',
  energyRegen: 'Energy Regen',
  friction: 'Friction',
};
