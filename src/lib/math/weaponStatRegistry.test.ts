import { describe, it, expect } from 'vitest';
import { parseWeaponStatString } from './weaponStatRegistry';

describe('parseWeaponStatString', () => {
  it('parses "+40% Damage"', () => {
    const result = parseWeaponStatString('+40% Damage');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('damage');
    expect(result!.value).toBeCloseTo(0.4);
  });

  it('parses "+60% Critical Chance"', () => {
    const result = parseWeaponStatString('+60% Critical Chance');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('critChance');
    expect(result!.value).toBeCloseTo(0.6);
  });

  it('parses "+60% Critical Damage"', () => {
    const result = parseWeaponStatString('+60% Critical Damage');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('critDamage');
    expect(result!.value).toBeCloseTo(0.6);
  });

  it('parses "+20% Multishot"', () => {
    const result = parseWeaponStatString('+20% Multishot');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('multishot');
    expect(result!.value).toBeCloseTo(0.2);
  });

  it('parses element with color tag: "+40% <DT_FIRE_COLOR>Heat"', () => {
    const result = parseWeaponStatString('+40% <DT_FIRE_COLOR>Heat');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('heat');
    expect(result!.value).toBeCloseTo(0.4);
  });

  it('parses Cold element with color tag', () => {
    const result = parseWeaponStatString('+40% <DT_FREEZE_COLOR>Cold');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('cold');
    expect(result!.value).toBeCloseTo(0.4);
  });

  it('parses Electricity element', () => {
    const result = parseWeaponStatString('+60% <DT_ELECTRICITY_COLOR>Electricity');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('electricity');
    expect(result!.value).toBeCloseTo(0.6);
  });

  it('parses Toxin element', () => {
    const result = parseWeaponStatString('+90% <DT_POISON_COLOR>Toxin');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('toxin');
    expect(result!.value).toBeCloseTo(0.9);
  });

  it('parses "+60% <DT_PUNCTURE_COLOR>Puncture"', () => {
    const result = parseWeaponStatString('+60% <DT_PUNCTURE_COLOR>Puncture');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('puncture');
    expect(result!.value).toBeCloseTo(0.6);
  });

  it('parses "+30% Fire Rate"', () => {
    const result = parseWeaponStatString('+30% Fire Rate');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('fireRate');
    expect(result!.value).toBeCloseTo(0.3);
  });

  it('parses "+30% Reload Speed"', () => {
    const result = parseWeaponStatString('+30% Reload Speed');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('reloadSpeed');
    expect(result!.value).toBeCloseTo(0.3);
  });

  it('parses "+30% Status Chance"', () => {
    const result = parseWeaponStatString('+30% Status Chance');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('statusChance');
    expect(result!.value).toBeCloseTo(0.3);
  });

  it('parses combined element: "+60% <DT_CORROSIVE_COLOR>Corrosive"', () => {
    const result = parseWeaponStatString('+60% <DT_CORROSIVE_COLOR>Corrosive');
    expect(result).not.toBeNull();
    expect(result!.stat).toBe('corrosive');
  });

  it('returns null for unparseable text', () => {
    const result = parseWeaponStatString('Enemies explode on death');
    expect(result).toBeNull();
  });
});
