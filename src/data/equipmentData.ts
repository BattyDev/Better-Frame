// Data access layer for Phase 4 equipment types:
// Archwings, Arch-Guns, Arch-Melees, Companions (Pets + Sentinels), Sentinel Weapons, Necramechs
import archwingJson from './Archwing.json';
import archGunJson from './ArchGun.json';
import archMeleeJson from './ArchMelee.json';
import petsJson from './Pets.json';
import sentinelsJson from './Sentinels.json';
import sentinelWeaponsJson from './SentinelWeapons.json';
import warframesJson from './Warframes.json';
import type { ArchwingData, CompanionData, SentinelWeaponData, WarframeData, WeaponData, ModData } from '../types/gameData';
import { getAllMods } from './warframeData';

const archwingItems = archwingJson as unknown as ArchwingData[];
const archGunItems = archGunJson as unknown as WeaponData[];
const archMeleeItems = archMeleeJson as unknown as WeaponData[];
// Filter to actual companions only (exclude MOA components which have productCategory: 'Pistols')
const petsItems = (petsJson as unknown as CompanionData[]).filter(
  p => p.productCategory === 'KubrowPets',
);
const sentinelItems = (sentinelsJson as unknown as CompanionData[]).filter(
  p => p.productCategory === 'Sentinels',
);
const sentinelWeaponItems = sentinelWeaponsJson as unknown as SentinelWeaponData[];
const allWarframeItems = warframesJson as unknown as (WarframeData & { productCategory?: string })[];

// Pre-built indexes
const archwingByUniqueName = new Map<string, ArchwingData>();
const archGunByUniqueName = new Map<string, WeaponData>();
const archMeleeByUniqueName = new Map<string, WeaponData>();
const companionByUniqueName = new Map<string, CompanionData>();
const sentinelWeaponByUniqueName = new Map<string, SentinelWeaponData>();
const necramechByUniqueName = new Map<string, WarframeData>();

for (const item of archwingItems) archwingByUniqueName.set(item.uniqueName, item);
for (const item of archGunItems) archGunByUniqueName.set(item.uniqueName, item);
for (const item of archMeleeItems) archMeleeByUniqueName.set(item.uniqueName, item);
for (const item of [...petsItems, ...sentinelItems]) companionByUniqueName.set(item.uniqueName, item);
for (const item of sentinelWeaponItems) sentinelWeaponByUniqueName.set(item.uniqueName, item);

// Necramechs are in Warframes.json with productCategory === 'MechSuits'
const necramechItems = allWarframeItems.filter(w => (w as any).productCategory === 'MechSuits');
for (const item of necramechItems) necramechByUniqueName.set(item.uniqueName, item as WarframeData);

// ---- Archwing ----

export function getAllArchwings(): ArchwingData[] {
  return archwingItems;
}

export function getArchwingByUniqueName(uniqueName: string): ArchwingData | undefined {
  return archwingByUniqueName.get(uniqueName);
}

export function searchArchwings(query: string): ArchwingData[] {
  const lower = query.toLowerCase();
  return archwingItems.filter(a => a.name.toLowerCase().includes(lower));
}

// ---- Arch-Gun ----

export function getAllArchGuns(): WeaponData[] {
  return archGunItems;
}

export function getArchGunByUniqueName(uniqueName: string): WeaponData | undefined {
  return archGunByUniqueName.get(uniqueName);
}

export function searchArchGuns(query: string): WeaponData[] {
  const lower = query.toLowerCase();
  return archGunItems.filter(w => w.name.toLowerCase().includes(lower));
}

// ---- Arch-Melee ----

export function getAllArchMelees(): WeaponData[] {
  return archMeleeItems;
}

export function getArchMeleeByUniqueName(uniqueName: string): WeaponData | undefined {
  return archMeleeByUniqueName.get(uniqueName);
}

export function searchArchMelees(query: string): WeaponData[] {
  const lower = query.toLowerCase();
  return archMeleeItems.filter(w => w.name.toLowerCase().includes(lower));
}

// ---- Companions (Pets + Sentinels) ----

export function getAllCompanions(): CompanionData[] {
  return [...petsItems, ...sentinelItems];
}

export function getPets(): CompanionData[] {
  return petsItems;
}

export function getSentinels(): CompanionData[] {
  return sentinelItems;
}

export function getCompanionByUniqueName(uniqueName: string): CompanionData | undefined {
  return companionByUniqueName.get(uniqueName);
}

export function searchCompanions(query: string): CompanionData[] {
  const lower = query.toLowerCase();
  return getAllCompanions().filter(c => c.name.toLowerCase().includes(lower));
}

// ---- Sentinel Weapons ----

export function getAllSentinelWeapons(): SentinelWeaponData[] {
  return sentinelWeaponItems;
}

export function getSentinelWeaponByUniqueName(uniqueName: string): SentinelWeaponData | undefined {
  return sentinelWeaponByUniqueName.get(uniqueName);
}

export function searchSentinelWeapons(query: string): SentinelWeaponData[] {
  const lower = query.toLowerCase();
  return sentinelWeaponItems.filter(w => w.name.toLowerCase().includes(lower));
}

// ---- Necramechs ----

export function getAllNecramechs(): WarframeData[] {
  return necramechItems as WarframeData[];
}

export function getNecramechByUniqueName(uniqueName: string): WarframeData | undefined {
  return necramechByUniqueName.get(uniqueName);
}

// ---- Mod filtering for each equipment type ----

export function getArchwingMods(archwingName?: string): ModData[] {
  const allMods = getAllMods();
  const baseName = archwingName?.replace(/ Prime$/, '') ?? null;
  return allMods.filter(m => {
    if (m.type !== 'Archwing Mod') return false;
    if (m.isAugment) {
      // Augments have compatName like ' Elytron' (with leading space in some cases)
      return baseName !== null && m.compatName.trim() === baseName;
    }
    return m.compatName === 'Archwing';
  });
}

export function getArchGunMods(): ModData[] {
  return getAllMods().filter(m => m.type === 'Arch-Gun Mod' && m.compatName === 'Archgun');
}

export function getArchMeleeMods(): ModData[] {
  return getAllMods().filter(m => m.type === 'Arch-Melee Mod' && m.compatName === 'Archmelee');
}

/** General companion mods (works for all companion types) */
export function getCompanionMods(companionName?: string): ModData[] {
  const allMods = getAllMods();
  const baseName = companionName ?? null;
  return allMods.filter(m => {
    if (m.type !== 'Companion Mod') return false;
    if (m.isAugment) {
      return baseName !== null && m.compatName === baseName;
    }
    // Include broadly-compatible companion mods
    return (
      m.compatName === 'COMPANION' ||
      m.compatName === 'BEAST' ||
      m.compatName === 'ROBOTIC' ||
      m.compatName === 'Sentinel' ||
      m.compatName === 'Kubrow' ||
      m.compatName === 'Kavat' ||
      m.compatName === 'VULPAPHYLA' ||
      m.compatName === 'PREDASITE' ||
      m.compatName === 'Moa' ||
      m.compatName === 'Hound'
    );
  });
}

/** Sentinel weapon mods (ROBOTIC compat) */
export function getSentinelWeaponMods(): ModData[] {
  return getAllMods().filter(
    m => m.type === 'Companion Mod' && (m.compatName === 'ROBOTIC' || m.compatName === 'Sentinel'),
  );
}

export function getNecramechMods(necramechName?: string): ModData[] {
  const allMods = getAllMods();
  const baseName = necramechName ?? null;
  return allMods.filter(m => {
    if (m.type !== 'Necramech Mod') return false;
    if (m.isAugment) {
      return baseName !== null && m.compatName === baseName;
    }
    return true;
  });
}

export function getParazonMods(): ModData[] {
  return getAllMods().filter(m => m.type === 'Parazon Mod');
}

export function getKDriveMods(): ModData[] {
  return getAllMods().filter(m => m.type === 'K-Drive Mod');
}
