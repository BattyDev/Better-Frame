// Curated Focus School data — abilities and passive bonuses
// These are not available in warframe-items, so they're maintained manually.

import type { FocusSchool } from '../types';

export interface FocusAbility {
  name: string;
  description: string;
  isPassive: boolean;
  /** Stat bonuses at max rank (applied to warframe or operator) */
  statBonuses?: { stat: string; value: string }[];
}

export interface FocusSchoolData {
  name: FocusSchool;
  description: string;
  theme: string;
  abilities: FocusAbility[];
}

export const FOCUS_SCHOOL_DATA: Record<FocusSchool, FocusSchoolData> = {
  Madurai: {
    name: 'Madurai',
    description: 'Offensive focus school. Boosts damage output.',
    theme: 'Offense',
    abilities: [
      { name: 'Void Strike', description: 'Void damage bonus after exiting Operator', isPassive: false, statBonuses: [{ stat: 'Void Damage', value: '+12x multiplier' }] },
      { name: 'Phoenix Talons', description: 'Increases physical damage', isPassive: true, statBonuses: [{ stat: 'Physical Damage', value: '+25%' }] },
      { name: 'Phoenix Spirit', description: 'Increases elemental damage', isPassive: true, statBonuses: [{ stat: 'Elemental Damage', value: '+25%' }] },
      { name: 'Inner Gaze', description: 'Increases Operator energy pool', isPassive: true, statBonuses: [{ stat: 'Operator Energy', value: '+60' }] },
      { name: 'Eternal Gaze', description: 'Increases Operator energy regen', isPassive: true, statBonuses: [{ stat: 'Operator Energy Regen', value: '+2/s' }] },
      { name: 'Contamination Wave', description: 'Void Dash leaves damage trail', isPassive: false },
    ],
  },
  Vazarin: {
    name: 'Vazarin',
    description: 'Defensive focus school. Boosts survivability and healing.',
    theme: 'Defense',
    abilities: [
      { name: 'Protective Dash', description: 'Void Dash heals allies and grants invulnerability', isPassive: false, statBonuses: [{ stat: 'Heal on Dash', value: '60% HP over 5s' }] },
      { name: 'Rejuvenating Tides', description: 'Increases health regen', isPassive: true, statBonuses: [{ stat: 'Health Regen', value: '+20/s' }] },
      { name: 'Enduring Tides', description: 'Increases Operator health', isPassive: true, statBonuses: [{ stat: 'Operator Health', value: '+200' }] },
      { name: 'Guardian Shell', description: 'Instant revive with invulnerability', isPassive: false, statBonuses: [{ stat: 'Instant Revives', value: '4' }] },
      { name: 'Guardian Blast', description: 'Void Blast repels enemies', isPassive: false },
      { name: 'Sonic Dash', description: 'Void Dash stuns enemies', isPassive: false },
    ],
  },
  Naramon: {
    name: 'Naramon',
    description: 'Tactical focus school. Boosts melee and combo.',
    theme: 'Tactics',
    abilities: [
      { name: 'Power Spike', description: 'Combo counter decays slower', isPassive: true, statBonuses: [{ stat: 'Combo Duration', value: '+12s' }] },
      { name: 'Affinity Spike', description: 'Melee kills grant bonus affinity', isPassive: true, statBonuses: [{ stat: 'Melee Affinity', value: '+45%' }] },
      { name: 'Mind Step', description: 'Increases movement speed', isPassive: true, statBonuses: [{ stat: 'Movement Speed', value: '+20%' }] },
      { name: 'Mind Sprint', description: 'Increases Void Dash speed', isPassive: true, statBonuses: [{ stat: 'Void Dash Speed', value: '+50%' }] },
      { name: 'Executing Dash', description: 'Void Dash opens enemies to finishers', isPassive: false },
      { name: 'Surging Dash', description: 'Void Dash hits multiple enemies', isPassive: false },
    ],
  },
  Zenurik: {
    name: 'Zenurik',
    description: 'Support focus school. Boosts energy economy.',
    theme: 'Energy',
    abilities: [
      { name: 'Wellspring', description: 'Creates energy pulse on Void Dash', isPassive: false, statBonuses: [{ stat: 'Energy per Pulse', value: '+5/s for 22s' }] },
      { name: 'Energizing Dash', description: 'Void Dash creates energy zone', isPassive: false, statBonuses: [{ stat: 'Energy Regen Zone', value: '+5/s' }] },
      { name: 'Energy Pulse', description: 'Increases energy orb effectiveness', isPassive: true, statBonuses: [{ stat: 'Energy Orb Bonus', value: '+50%' }] },
      { name: 'Inner Might', description: 'Reduces ability cost on next cast', isPassive: true, statBonuses: [{ stat: 'Ability Cost Reduction', value: '-50% next cast' }] },
      { name: 'Void Siphon', description: 'Increases Operator energy regen', isPassive: true, statBonuses: [{ stat: 'Operator Energy Regen', value: '+4/s' }] },
      { name: 'Void Flow', description: 'Increases Operator energy pool', isPassive: true, statBonuses: [{ stat: 'Operator Energy', value: '+90' }] },
    ],
  },
  Unairu: {
    name: 'Unairu',
    description: 'Utility focus school. Boosts armor and survivability.',
    theme: 'Utility',
    abilities: [
      { name: 'Unairu Wisp', description: 'Void Blast creates wisps that buff allies', isPassive: false, statBonuses: [{ stat: 'Operator Damage', value: '+100%' }] },
      { name: 'Basilisk Scales', description: 'Increases armor in Operator', isPassive: true, statBonuses: [{ stat: 'Operator Armor', value: '+200' }] },
      { name: 'Basilisk Gaze', description: 'Void Blast radius increase', isPassive: true, statBonuses: [{ stat: 'Void Blast Range', value: '+80%' }] },
      { name: 'Stone Skin', description: 'Increases warframe armor', isPassive: true, statBonuses: [{ stat: 'Warframe Armor', value: '+60' }] },
      { name: 'Magnetic Blast', description: 'Void Blast strips armor', isPassive: false, statBonuses: [{ stat: 'Armor Strip', value: '75%' }] },
      { name: 'Void Spines', description: 'Reflect damage in Void Mode', isPassive: false },
    ],
  },
};

export function getFocusSchoolData(school: FocusSchool): FocusSchoolData {
  return FOCUS_SCHOOL_DATA[school];
}
