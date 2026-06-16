// Game data access layer for weapons (Primary, Secondary, Melee, Archgun, Archmelee)
import primaryJson from './Primary.json';
import secondaryJson from './Secondary.json';
import meleeJson from './Melee.json';
import archGunJson from './ArchGun.json';
import archMeleeJson from './ArchMelee.json';
import type { WeaponData, WeaponCategory, ModData } from '../types/gameData';
import { getAllMods } from './warframeData';

const primaryItems = primaryJson as unknown as WeaponData[];
const secondaryItems = secondaryJson as unknown as WeaponData[];
const meleeItems = meleeJson as unknown as WeaponData[];
const archGunItems = archGunJson as unknown as WeaponData[];
const archMeleeItems = archMeleeJson as unknown as WeaponData[];

const allWeapons: WeaponData[] = [
  ...primaryItems, ...secondaryItems, ...meleeItems,
  ...archGunItems, ...archMeleeItems,
];

// Pre-built indexes
const weaponByName = new Map<string, WeaponData>();
const weaponByUniqueName = new Map<string, WeaponData>();

for (const w of allWeapons) {
  weaponByName.set(w.name, w);
  weaponByUniqueName.set(w.uniqueName, w);
}

// ---- Weapon accessors ----

export function getAllWeapons(): WeaponData[] {
  return allWeapons;
}

export function getWeaponsByCategory(category: WeaponCategory): WeaponData[] {
  switch (category) {
    case 'Primary': return primaryItems;
    case 'Secondary': return secondaryItems;
    case 'Melee': return meleeItems;
    case 'Archgun': return archGunItems;
    case 'Archmelee': return archMeleeItems;
  }
}

export function getWeaponByName(name: string): WeaponData | undefined {
  return weaponByName.get(name);
}

export function getWeaponByUniqueName(uniqueName: string): WeaponData | undefined {
  return weaponByUniqueName.get(uniqueName);
}

export function searchWeapons(query: string, category?: WeaponCategory): WeaponData[] {
  const lower = query.toLowerCase();
  const pool = category ? getWeaponsByCategory(category) : allWeapons;
  return pool.filter(w => w.name.toLowerCase().includes(lower));
}

// ---- Weapon mod accessors ----

// Compat names that map to weapon categories
const PRIMARY_COMPATS = new Set([
  'Rifle', 'Rifle (No Aoe)', 'Shotgun', 'Bow', 'Sniper', 'Assault Rifle',
  'PRIMARY',
]);
const SECONDARY_COMPATS = new Set([
  'Pistol', 'Pistol (No Aoe)', 'Thrown', 'Tome',
]);
const MELEE_COMPATS = new Set(['Melee']);

// All melee weapon type compat names used by stance mods
const MELEE_WEAPON_TYPES = new Set([
  'Assault Saw', 'Blade And Whip', 'Claws', 'Daggers', 'Dual Daggers',
  'Dual Nikanas', 'Dual Swords', 'Fists', 'Glaives', 'Gunblade', 'Hammers',
  'Heavy Blade', 'Heavy Scythe', 'Machetes', 'Nikanas', 'Nunchaku',
  'Polearms', 'Rapiers', 'Scythes', 'Sparring', 'Staves', 'Sword And Shield',
  'Swords', 'Tonfas', 'Two-Handed Nikana', 'Warfans', 'Whips',
]);

function isWeaponMod(mod: ModData): boolean {
  return (
    mod.type === 'Primary Mod' ||
    mod.type === 'Secondary Mod' ||
    mod.type === 'Melee Mod' ||
    mod.type === 'Shotgun Mod'
  );
}

export function getWeaponMods(category: WeaponCategory): ModData[] {
  const allMods = getAllMods();
  return allMods.filter(m => {
    if (m.type === 'Stance Mod') return false;
    if (m.isExilus) return false;

    if (category === 'Primary') {
      return (
        (m.type === 'Primary Mod' || m.type === 'Shotgun Mod' || m.type === 'Mod Set Mod') &&
        PRIMARY_COMPATS.has(m.compatName)
      );
    }
    if (category === 'Secondary') {
      return (
        (m.type === 'Secondary Mod' || m.type === 'Mod Set Mod') &&
        SECONDARY_COMPATS.has(m.compatName)
      );
    }
    if (category === 'Melee') {
      return (
        (m.type === 'Melee Mod' || m.type === 'Mod Set Mod') &&
        MELEE_COMPATS.has(m.compatName)
      );
    }
    if (category === 'Archgun') {
      return m.type === 'Arch-Gun Mod' && m.compatName === 'Archgun';
    }
    if (category === 'Archmelee') {
      return m.type === 'Arch-Melee Mod' && m.compatName === 'Archmelee';
    }
    return false;
  });
}

export function getWeaponExilusMods(category: WeaponCategory): ModData[] {
  const allMods = getAllMods();
  return allMods.filter(m => {
    if (!m.isExilus) return false;
    if (category === 'Primary') {
      return m.type === 'Primary Mod' || m.type === 'Shotgun Mod';
    }
    if (category === 'Secondary') {
      return m.type === 'Secondary Mod';
    }
    if (category === 'Melee') {
      return m.type === 'Melee Mod';
    }
    // Arch-weapons don't have exilus slots
    return false;
  });
}

export function getStanceMods(weaponType?: string): ModData[] {
  const allMods = getAllMods();
  return allMods.filter(m => {
    if (m.type !== 'Stance Mod') return false;
    if (weaponType && m.compatName !== weaponType) return false;
    return true;
  });
}

/** Get all mods compatible with a specific weapon, including weapon-specific augments. */
export function getWeaponCompatibleMods(
  category: WeaponCategory,
  weaponName?: string,
): ModData[] {
  const allMods = getAllMods();
  const baseName = weaponName?.replace(/ Prime$/, '').replace(/ Wraith$/, '')
    .replace(/ Vandal$/, '').replace(/^Kuva /, '').replace(/^Tenet /, '') ?? null;

  // Arch-weapons: just return the category mods (no augments in warframe-items data)
  if (category === 'Archgun') {
    return allMods.filter(m => m.type === 'Arch-Gun Mod' && m.compatName === 'Archgun');
  }
  if (category === 'Archmelee') {
    return allMods.filter(m => m.type === 'Arch-Melee Mod' && m.compatName === 'Archmelee');
  }

  return allMods.filter(m => {
    if (m.type === 'Stance Mod') return false;

    // Weapon-specific augments
    if (isWeaponMod(m) && !PRIMARY_COMPATS.has(m.compatName) &&
        !SECONDARY_COMPATS.has(m.compatName) && !MELEE_COMPATS.has(m.compatName) &&
        !MELEE_WEAPON_TYPES.has(m.compatName)) {
      return baseName !== null && m.compatName === baseName;
    }

    if (m.type === 'Mod Set Mod' || m.type === 'Peculiar Mod') {
      // These are category-agnostic in some cases; include if they have weapon-relevant stats
      return isWeaponMod(m) || m.type === 'Mod Set Mod';
    }

    if (category === 'Primary') {
      return (m.type === 'Primary Mod' || m.type === 'Shotgun Mod') &&
        m.compatName !== 'AURA';
    }
    if (category === 'Secondary') {
      return m.type === 'Secondary Mod';
    }
    if (category === 'Melee') {
      return m.type === 'Melee Mod';
    }
    return false;
  });
}

/** Detect melee weapon type from its uniqueName or attacks for stance matching. */
export function getMeleeWeaponType(_weapon: WeaponData): string | undefined {
  // Stance mods use compatName matching to weapon types
  // We can infer the weapon type from the stancePolarity and matching stance mods
  // For now, return undefined - the user picks the stance from compatible ones
  return undefined;
}
