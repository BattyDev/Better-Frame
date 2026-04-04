import { describe, it, expect } from 'vitest';
import { calculateWarframeStats, getWarframeBaseStats } from './warframeCalc';
import type { WarframeData, ModData } from '../../types/gameData';

function mockWarframe(overrides: Partial<WarframeData> = {}): WarframeData {
  return {
    uniqueName: '/test/warframe',
    name: 'Test Frame',
    description: '',
    imageName: 'test.png',
    category: 'Warframes',
    health: 300,
    shield: 300,
    armor: 300,
    power: 150,
    sprint: 1.0,
    sprintSpeed: 1.0,
    abilities: [],
    aura: 'madurai',
    polarities: [],
    isPrime: false,
    masteryReq: 0,
    passiveDescription: '',
    sex: 'Male',
    introduced: { name: 'Update 1', date: '2020-01-01' },
    ...overrides,
  };
}

function mockMod(
  name: string,
  levelStats: { stats: string[] }[],
  overrides: Partial<ModData> = {},
): ModData {
  return {
    uniqueName: `/test/mod/${name}`,
    name,
    imageName: `${name}.png`,
    category: 'Mods',
    type: 'Warframe Mod',
    compatName: 'WARFRAME',
    polarity: 'madurai',
    rarity: 'Rare',
    baseDrain: 4,
    fusionLimit: levelStats.length - 1,
    levelStats,
    ...overrides,
  };
}

describe('getWarframeBaseStats', () => {
  it('extracts base stats correctly', () => {
    const wf = mockWarframe({ health: 370, shield: 150, armor: 225, power: 188 });
    const stats = getWarframeBaseStats(wf);
    expect(stats.health).toBe(370);
    expect(stats.shield).toBe(150);
    expect(stats.armor).toBe(225);
    expect(stats.energy).toBe(188);
    expect(stats.abilityStrength).toBe(1.0);
    expect(stats.abilityDuration).toBe(1.0);
    expect(stats.abilityRange).toBe(1.0);
    expect(stats.abilityEfficiency).toBe(1.0);
  });
});

describe('calculateWarframeStats', () => {
  it('returns base stats with no mods', () => {
    const wf = mockWarframe({ health: 300 });
    const result = calculateWarframeStats(wf, []);
    expect(result.modded['health']).toBe(300);
    expect(result.base['health']).toBe(300);
  });

  it('applies Vitality (+100% Health at max rank)', () => {
    const wf = mockWarframe({ health: 300 });
    const vitality = mockMod('Vitality', [
      { stats: ['+9% Health'] },
      { stats: ['+18% Health'] },
      { stats: ['+27% Health'] },
      { stats: ['+36% Health'] },
      { stats: ['+45% Health'] },
      { stats: ['+55% Health'] },
      { stats: ['+64% Health'] },
      { stats: ['+73% Health'] },
      { stats: ['+82% Health'] },
      { stats: ['+91% Health'] },
      { stats: ['+100% Health'] },
    ]);
    const result = calculateWarframeStats(wf, [{ mod: vitality, rank: 10 }]);
    // 300 * (1 + 1.0) = 600
    expect(result.modded['health']).toBe(600);
  });

  it('stacks additive mods correctly', () => {
    const wf = mockWarframe({ health: 300 });
    const vitality = mockMod('Vitality', [{ stats: ['+100% Health'] }]);
    const redirection = mockMod('Redirection', [{ stats: ['+40% Health'] }]);
    const result = calculateWarframeStats(wf, [
      { mod: vitality, rank: 0 },
      { mod: redirection, rank: 0 },
    ]);
    // 300 * (1 + 1.0 + 0.4) = 300 * 2.4 = 720
    expect(result.modded['health']).toBe(720);
  });

  it('caps Ability Efficiency at 175%', () => {
    const wf = mockWarframe();
    const streamline = mockMod('Streamline', [{ stats: ['+30% Ability Efficiency'] }]);
    const fleeting = mockMod('Fleeting Expertise', [{ stats: ['+60% Ability Efficiency'] }]);
    const blindRage = mockMod('Blind Rage', [{ stats: ['+30% Ability Efficiency'] }]);
    const result = calculateWarframeStats(wf, [
      { mod: streamline, rank: 0 },
      { mod: fleeting, rank: 0 },
      { mod: blindRage, rank: 0 },
    ]);
    // 1.0 + 0.3 + 0.6 + 0.3 = 2.2, capped at 1.75
    expect(result.modded['abilityEfficiency']).toBe(1.75);
  });

  it('calculates Ability Strength correctly', () => {
    const wf = mockWarframe();
    const intensify = mockMod('Intensify', [{ stats: ['+30% Ability Strength'] }]);
    const result = calculateWarframeStats(wf, [{ mod: intensify, rank: 0 }]);
    // 1.0 + 0.3 = 1.3
    expect(result.modded['abilityStrength']).toBe(1.3);
  });

  it('collects text-only effects', () => {
    const wf = mockWarframe();
    const mod = mockMod('Rolling Guard', [
      { stats: ['Gain 3s of invulnerability after Dodging'] },
    ]);
    const result = calculateWarframeStats(wf, [{ mod, rank: 0 }]);
    expect(result.textEffects).toContain('Gain 3s of invulnerability after Dodging');
  });
});
