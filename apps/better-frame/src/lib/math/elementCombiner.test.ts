import { describe, it, expect } from 'vitest';
import { combineElements, type ElementEntry } from './elementCombiner';

describe('combineElements', () => {
  const baseDmg = 100;

  it('returns empty when no elements', () => {
    const result = combineElements(baseDmg, [], []);
    expect(result.elements).toEqual([]);
  });

  it('returns single base element from mod', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'heat', value: 0.9 },
    ]);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('heat');
    expect(result.elements[0].damage).toBe(90);
  });

  it('combines Heat + Cold = Blast', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'heat', value: 0.9 },
      { type: 'cold', value: 0.6 },
    ]);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('blast');
    expect(result.elements[0].damage).toBe(150);
  });

  it('combines Electricity + Toxin = Corrosive', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'electricity', value: 0.9 },
      { type: 'toxin', value: 0.9 },
    ]);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('corrosive');
    expect(result.elements[0].damage).toBe(180);
  });

  it('combines Heat + Toxin = Gas', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'heat', value: 0.5 },
      { type: 'toxin', value: 0.5 },
    ]);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('gas');
  });

  it('combines Cold + Electricity = Magnetic', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'cold', value: 0.5 },
      { type: 'electricity', value: 0.5 },
    ]);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('magnetic');
  });

  it('combines Heat + Electricity = Radiation', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'heat', value: 0.5 },
      { type: 'electricity', value: 0.5 },
    ]);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('radiation');
  });

  it('combines Cold + Toxin = Viral', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'cold', value: 0.5 },
      { type: 'toxin', value: 0.5 },
    ]);
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('viral');
  });

  it('respects mod slot order: Heat+Cold+Toxin = Blast + Toxin', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'heat', value: 0.9 },
      { type: 'cold', value: 0.6 },
      { type: 'toxin', value: 0.6 },
    ]);
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0].type).toBe('blast');
    expect(result.elements[1].type).toBe('toxin');
  });

  it('respects mod slot order: Heat+Toxin+Cold = Gas + Cold', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'heat', value: 0.9 },
      { type: 'toxin', value: 0.6 },
      { type: 'cold', value: 0.6 },
    ]);
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0].type).toBe('gas');
    expect(result.elements[1].type).toBe('cold');
  });

  it('handles 4 elements = 2 combined', () => {
    const result = combineElements(baseDmg, [], [
      { type: 'heat', value: 0.5 },
      { type: 'cold', value: 0.5 },
      { type: 'electricity', value: 0.5 },
      { type: 'toxin', value: 0.5 },
    ]);
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0].type).toBe('blast');
    expect(result.elements[1].type).toBe('corrosive');
  });

  it('adds innate weapon elements', () => {
    const innate: ElementEntry[] = [{ type: 'toxin', damage: 43 }];
    const result = combineElements(baseDmg, innate, []);
    // Toxin is a base element in the queue, no combining happens
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('toxin');
    expect(result.elements[0].damage).toBe(43);
  });

  it('innate element combines with mod element', () => {
    const innate: ElementEntry[] = [{ type: 'toxin', damage: 43 }];
    const result = combineElements(baseDmg, innate, [
      { type: 'heat', value: 0.9 },
    ]);
    // Toxin is queued first (innate), then Heat from mod
    // Toxin + Heat = Gas
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('gas');
    expect(result.elements[0].damage).toBe(43 + 90);
  });

  it('Kuva/Tenet bonus element combines first', () => {
    const result = combineElements(
      baseDmg, [], [{ type: 'cold', value: 0.6 }],
      'heat', 0.60, // 60% heat bonus
    );
    // Bonus Heat is first, then Cold from mod -> Blast
    expect(result.elements).toHaveLength(1);
    expect(result.elements[0].type).toBe('blast');
    expect(result.elements[0].damage).toBe(60 + 60);
  });

  it('Kuva bonus + mod elements: bonus combines first', () => {
    const result = combineElements(
      baseDmg, [], [
        { type: 'electricity', value: 0.9 },
        { type: 'toxin', value: 0.9 },
      ],
      'heat', 0.60,
    );
    // Queue: Heat(bonus) -> Electricity(mod) -> Toxin(mod)
    // Heat + Electricity = Radiation, then Toxin is leftover
    expect(result.elements).toHaveLength(2);
    expect(result.elements[0].type).toBe('radiation');
    expect(result.elements[1].type).toBe('toxin');
  });

  it('handles innate combined elements (not re-combined)', () => {
    const innate: ElementEntry[] = [{ type: 'radiation', damage: 50 }];
    const result = combineElements(baseDmg, innate, [
      { type: 'heat', value: 0.5 },
    ]);
    // Radiation is innate combined, Heat is standalone
    expect(result.elements).toHaveLength(2);
    const types = result.elements.map(e => e.type);
    expect(types).toContain('heat');
    expect(types).toContain('radiation');
  });
});
