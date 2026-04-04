// Game data access layer - imports pre-copied JSON from warframe-items
// To update: run `npm run update-game-data` (copies from node_modules/warframe-items/data/json/)
import warframeJson from './Warframes.json';
import modsJson from './Mods.json';
import arcanesJson from './Arcanes.json';
import type { WarframeData, ModData, ArcaneData } from '../types/gameData';

// Cast imported JSON arrays to typed arrays
const warframeItems = warframeJson as unknown as WarframeData[];
const modItems = modsJson as unknown as ModData[];
const arcaneItems = arcanesJson as unknown as ArcaneData[];

// Pre-built indexes for fast lookups
const warframeByName = new Map<string, WarframeData>();
const warframeByUniqueName = new Map<string, WarframeData>();
const modByName = new Map<string, ModData>();
const modByUniqueName = new Map<string, ModData>();
const arcaneByName = new Map<string, ArcaneData>();
const arcaneByUniqueName = new Map<string, ArcaneData>();

for (const wf of warframeItems) {
  warframeByName.set(wf.name, wf);
  warframeByUniqueName.set(wf.uniqueName, wf);
}

for (const mod of modItems) {
  modByName.set(mod.name, mod);
  modByUniqueName.set(mod.uniqueName, mod);
}

for (const arcane of arcaneItems) {
  arcaneByName.set(arcane.name, arcane);
  arcaneByUniqueName.set(arcane.uniqueName, arcane);
}

// ---- Warframe accessors ----

export function getAllWarframes(): WarframeData[] {
  return warframeItems;
}

export function getWarframeByName(name: string): WarframeData | undefined {
  return warframeByName.get(name);
}

export function getWarframeByUniqueName(uniqueName: string): WarframeData | undefined {
  return warframeByUniqueName.get(uniqueName);
}

export function searchWarframes(query: string): WarframeData[] {
  const lower = query.toLowerCase();
  return warframeItems.filter(wf => wf.name.toLowerCase().includes(lower));
}

// ---- Mod accessors ----

export function getAllMods(): ModData[] {
  return modItems;
}

export function getModByName(name: string): ModData | undefined {
  return modByName.get(name);
}

export function getModByUniqueName(uniqueName: string): ModData | undefined {
  return modByUniqueName.get(uniqueName);
}

/** Get mods compatible with warframes (regular slots) */
export function getWarframeMods(): ModData[] {
  return modItems.filter(
    m =>
      (m.compatName === 'WARFRAME' || m.type === 'Warframe Mod' || m.type === 'Peculiar Mod') &&
      m.compatName !== 'AURA' &&
      !m.isExilus
  );
}

/** Get aura mods (compatName === 'AURA') */
export function getAuraMods(): ModData[] {
  return modItems.filter(m => m.compatName === 'AURA');
}

/** Get warframe exilus mods */
export function getExilusMods(): ModData[] {
  return modItems.filter(
    m => m.isExilus === true && (m.type === 'Warframe Mod' || m.type === 'Peculiar Mod')
  );
}

/** Get all mods that can go in warframe mod slots (regular + exilus) */
export function getWarframeCompatibleMods(): ModData[] {
  return modItems.filter(
    m =>
      (m.compatName === 'WARFRAME' ||
        m.type === 'Warframe Mod' ||
        m.type === 'Peculiar Mod' ||
        m.type === 'Mod Set Mod') &&
      m.compatName !== 'AURA'
  );
}

export function searchMods(query: string, compatFilter?: string): ModData[] {
  const lower = query.toLowerCase();
  return modItems.filter(m => {
    if (compatFilter && m.compatName !== compatFilter && m.type !== compatFilter) return false;
    return m.name.toLowerCase().includes(lower);
  });
}

// ---- Arcane accessors ----

export function getAllArcanes(): ArcaneData[] {
  return arcaneItems;
}

export function getWarframeArcanes(): ArcaneData[] {
  return arcaneItems.filter(a => a.type === 'Arcane Enhancement');
}

export function getArcaneByName(name: string): ArcaneData | undefined {
  return arcaneByName.get(name);
}

export function getArcaneByUniqueName(uniqueName: string): ArcaneData | undefined {
  return arcaneByUniqueName.get(uniqueName);
}

export function searchArcanes(query: string): ArcaneData[] {
  const lower = query.toLowerCase();
  return arcaneItems.filter(a => a.name.toLowerCase().includes(lower));
}

// ---- Image URL helpers ----

const CDN_BASE = 'https://cdn.warframestat.us/img';

export function getItemImageUrl(imageName: string): string {
  return `${CDN_BASE}/${imageName}`;
}
