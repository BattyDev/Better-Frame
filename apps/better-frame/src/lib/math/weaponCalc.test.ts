import { describe, it, expect } from 'vitest';
import { getWeaponBaseStats, calculateWeaponStats } from './weaponCalc';
import type { WeaponData, ModData } from '../../types/gameData';

// Minimal mock weapon data
function createMockWeapon(overrides?: Partial<WeaponData>): WeaponData {
  return {
    uniqueName: '/test/weapon',
    name: 'Test Rifle',
    description: '',
    imageName: 'test.png',
    category: 'Primary',
    masteryReq: 0,
    attacks: [{
      name: 'Normal Attack',
      speed: 8,
      crit_chance: 20,
      crit_mult: 2.0,
      status_chance: 20,
      damage: { impact: 25, puncture: 25, slash: 50 },
    }],
    fireRate: 8,
    magazineSize: 30,
    reloadTime: 2,
    totalDamage: 100,
    polarities: [],
    isPrime: false,
    ...overrides,
  };
}

function createMockMod(name: string, stats: string[], overrides?: Partial<ModData>): ModData {
  return {
    uniqueName: `/test/mod/${name}`,
    name,
    imageName: 'test.png',
    category: 'Mods',
    type: 'Primary Mod',
    compatName: 'Rifle',
    polarity: 'madurai',
    rarity: 'Rare',
    baseDrain: 4,
    fusionLimit: 3,
    levelStats: [
      { stats }, { stats }, { stats }, { stats },
    ],
    ...overrides,
  };
}

describe('getWeaponBaseStats', () => {
  it('extracts base stats from weapon data', () => {
    const weapon = createMockWeapon();
    const stats = getWeaponBaseStats(weapon);

    expect(stats.totalDamage).toBe(100);
    expect(stats.critChance).toBe(20);
    expect(stats.critMultiplier).toBe(2.0);
    expect(stats.statusChance).toBe(20);
    expect(stats.fireRate).toBe(8);
    expect(stats.magazineSize).toBe(30);
    expect(stats.reloadTime).toBe(2);
    expect(stats.damageDistribution).toEqual({ impact: 25, puncture: 25, slash: 50 });
  });

  it('handles melee weapon with no magazine', () => {
    const weapon = createMockWeapon({
      category: 'Melee',
      magazineSize: undefined,
      reloadTime: undefined,
      range: 2.5,
      comboDuration: 5,
    });
    const stats = getWeaponBaseStats(weapon);
    expect(stats.magazineSize).toBe(0);
    expect(stats.reloadTime).toBe(0);
    expect(stats.range).toBe(2.5);
    expect(stats.comboDuration).toBe(5);
  });
});

describe('calculateWeaponStats', () => {
  it('returns base stats with no mods', () => {
    const weapon = createMockWeapon();
    const result = calculateWeaponStats(weapon, []);

    expect(result.totalDamage).toBe(100);
    expect(result.critChance).toBe(20);
    expect(result.critMultiplier).toBe(2.0);
    expect(result.statusChance).toBe(20);
    expect(result.multishot).toBe(1);
    expect(result.fireRate).toBe(8);
  });

  it('applies base damage mod (Serration-like)', () => {
    const weapon = createMockWeapon();
    const serration = createMockMod('Serration', ['+165% Damage']);
    const result = calculateWeaponStats(weapon, [{ mod: serration, rank: 3 }]);

    // 100 * (1 + 1.65) = 265
    expect(result.totalDamage).toBeCloseTo(265, 0);
  });

  it('applies critical chance mod', () => {
    const weapon = createMockWeapon();
    const pointStrike = createMockMod('Point Strike', ['+150% Critical Chance']);
    const result = calculateWeaponStats(weapon, [{ mod: pointStrike, rank: 3 }]);

    // 20% * (1 + 1.50) = 50%
    expect(result.critChance).toBeCloseTo(50, 0);
  });

  it('applies critical damage mod', () => {
    const weapon = createMockWeapon();
    const vitalSense = createMockMod('Vital Sense', ['+120% Critical Damage']);
    const result = calculateWeaponStats(weapon, [{ mod: vitalSense, rank: 3 }]);

    // 2.0 * (1 + 1.20) = 4.4
    expect(result.critMultiplier).toBeCloseTo(4.4);
  });

  it('applies multishot mod', () => {
    const weapon = createMockWeapon();
    const splitChamber = createMockMod('Split Chamber', ['+90% Multishot']);
    const result = calculateWeaponStats(weapon, [{ mod: splitChamber, rank: 3 }]);

    // 1 * (1 + 0.90) = 1.9
    expect(result.multishot).toBeCloseTo(1.9);
  });

  it('applies elemental damage mod', () => {
    const weapon = createMockWeapon();
    const hellfire = createMockMod('Hellfire', ['+90% <DT_FIRE_COLOR>Heat']);
    const result = calculateWeaponStats(weapon, [{ mod: hellfire, rank: 3 }]);

    expect(result.elementalDamage).toHaveLength(1);
    expect(result.elementalDamage[0].type).toBe('heat');
    // 100 * 0.90 = 90
    expect(result.elementalDamage[0].damage).toBeCloseTo(90, 0);
  });

  it('combines two elemental mods', () => {
    const weapon = createMockWeapon();
    const hellfire = createMockMod('Hellfire', ['+90% <DT_FIRE_COLOR>Heat']);
    const cryoRounds = createMockMod('Cryo Rounds', ['+90% <DT_FREEZE_COLOR>Cold']);
    const result = calculateWeaponStats(weapon, [
      { mod: hellfire, rank: 3 },
      { mod: cryoRounds, rank: 3 },
    ]);

    expect(result.elementalDamage).toHaveLength(1);
    expect(result.elementalDamage[0].type).toBe('blast');
    // 90 + 90 = 180
    expect(result.elementalDamage[0].damage).toBeCloseTo(180, 0);
  });

  it('calculates burst DPS', () => {
    const weapon = createMockWeapon();
    const result = calculateWeaponStats(weapon, []);

    // base damage = 100, multishot = 1, fire rate = 8
    // avg crit mult = 1 + (20/100) * (2.0 - 1) = 1.2
    // avg damage per shot = 100 * 1 * 1.2 = 120
    // burst DPS = 120 * 8 = 960
    expect(result.avgDamagePerShot).toBeCloseTo(120, 0);
    expect(result.burstDps).toBeCloseTo(960, 0);
  });

  it('calculates sustained DPS', () => {
    const weapon = createMockWeapon();
    const result = calculateWeaponStats(weapon, []);

    // magazine = 30, fire rate = 8, reload = 2
    // time to empty = 30/8 = 3.75s
    // sustained DPS = (120 * 30) / (3.75 + 2) = 3600 / 5.75 ≈ 626
    expect(result.sustainedDps).toBeCloseTo(626, 0);
  });

  it('applies fire rate mod', () => {
    const weapon = createMockWeapon();
    const speedTrigger = createMockMod('Speed Trigger', ['+60% Fire Rate']);
    const result = calculateWeaponStats(weapon, [{ mod: speedTrigger, rank: 3 }]);

    // 8 * (1 + 0.60) = 12.8
    expect(result.fireRate).toBeCloseTo(12.8);
  });

  it('applies reload speed mod', () => {
    const weapon = createMockWeapon();
    const fastHands = createMockMod('Fast Hands', ['+30% Reload Speed']);
    const result = calculateWeaponStats(weapon, [{ mod: fastHands, rank: 3 }]);

    // 2 / (1 + 0.30) ≈ 1.538
    expect(result.reloadTime).toBeCloseTo(1.538, 2);
  });

  it('applies physical damage mod (IPS)', () => {
    const weapon = createMockWeapon();
    const sawtoothClip = createMockMod('Sawtooth Clip', ['+120% <DT_SLASH_COLOR>Slash']);
    const result = calculateWeaponStats(weapon, [{ mod: sawtoothClip, rank: 3 }]);

    // Slash base: 50, modded: 50 * (1 + 0) * (1 + 1.20) = 110
    // Impact and Puncture unchanged: 25 each
    expect(result.physicalDamage['slash']).toBeCloseTo(110, 0);
    expect(result.physicalDamage['impact']).toBeCloseTo(25, 0);
    expect(result.physicalDamage['puncture']).toBeCloseTo(25, 0);
  });

  it('handles Kuva/Tenet bonus element', () => {
    const weapon = createMockWeapon();
    const result = calculateWeaponStats(
      weapon, [],
      'heat', 0.60,
    );

    expect(result.elementalDamage).toHaveLength(1);
    expect(result.elementalDamage[0].type).toBe('heat');
    // 100 * 0.60 = 60
    expect(result.elementalDamage[0].damage).toBeCloseTo(60, 0);
  });

  it('collects text effects from unparseable stats', () => {
    const weapon = createMockWeapon();
    const mod = createMockMod('Special', ['Enemies explode on death']);
    const result = calculateWeaponStats(weapon, [{ mod, rank: 3 }]);

    expect(result.textEffects).toContain('Enemies explode on death');
  });
});
