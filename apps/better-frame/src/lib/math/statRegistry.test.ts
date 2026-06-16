import { describe, it, expect } from 'vitest';
import { parseStatString } from './statRegistry';

describe('parseStatString', () => {
  it('parses percentage health bonus', () => {
    const result = parseStatString('+100% Health');
    expect(result).toEqual({ stat: 'health', value: 1.0, isPercentage: true });
  });

  it('parses percentage armor bonus', () => {
    const result = parseStatString('+110% Armor');
    expect(result).toEqual({ stat: 'armor', value: 1.1, isPercentage: true });
  });

  it('parses ability strength', () => {
    const result = parseStatString('+30% Ability Strength');
    expect(result).toEqual({ stat: 'abilityStrength', value: 0.3, isPercentage: true });
  });

  it('parses ability duration', () => {
    const result = parseStatString('+27% Ability Duration');
    expect(result).toEqual({ stat: 'abilityDuration', value: 0.27, isPercentage: true });
  });

  it('parses ability efficiency', () => {
    const result = parseStatString('+30% Ability Efficiency');
    expect(result).toEqual({ stat: 'abilityEfficiency', value: 0.3, isPercentage: true });
  });

  it('parses ability range', () => {
    const result = parseStatString('+45% Ability Range');
    expect(result).toEqual({ stat: 'abilityRange', value: 0.45, isPercentage: true });
  });

  it('parses sprint speed', () => {
    const result = parseStatString('+10% Sprint Speed');
    expect(result).toEqual({ stat: 'sprintSpeed', value: 0.1, isPercentage: true });
  });

  it('parses energy bonus', () => {
    const result = parseStatString('+50% Energy');
    expect(result).toEqual({ stat: 'energy', value: 0.5, isPercentage: true });
  });

  it('parses shield capacity', () => {
    const result = parseStatString('+40% Shield Capacity');
    expect(result).toEqual({ stat: 'shield', value: 0.4, isPercentage: true });
  });

  it('parses negative values', () => {
    const result = parseStatString('-50% Ability Duration');
    expect(result).toEqual({ stat: 'abilityDuration', value: -0.5, isPercentage: true });
  });

  it('returns null for unparseable strings', () => {
    expect(parseStatString('Some random effect text')).toBeNull();
  });

  it('returns null for empty string', () => {
    expect(parseStatString('')).toBeNull();
  });
});
