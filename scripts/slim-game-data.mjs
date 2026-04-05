// Slims down warframe-items JSON to only the fields we need
// Reduces ~13MB to ~1-2MB
import { readFileSync, writeFileSync } from 'fs';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const SRC_DATA = resolve(__dirname, '../src/data');
const NODE_DATA = resolve(__dirname, '../node_modules/warframe-items/data/json');

// Warframes: only keep fields we use
const warframes = JSON.parse(readFileSync(resolve(NODE_DATA, 'Warframes.json'), 'utf-8'));
const slimWarframes = warframes.map(wf => ({
  uniqueName: wf.uniqueName,
  name: wf.name,
  description: wf.description,
  imageName: wf.imageName,
  category: wf.category,
  health: wf.health,
  shield: wf.shield,
  armor: wf.armor,
  power: wf.power,
  sprint: wf.sprint,
  abilities: wf.abilities?.map(a => ({
    name: a.name,
    description: a.description,
    imageName: a.imageName,
  })),
  aura: wf.aura,
  polarities: wf.polarities,
  isPrime: wf.isPrime ?? false,
  masteryReq: wf.masteryReq ?? 0,
  passiveDescription: wf.passiveDescription ?? '',
  exalted: wf.exalted,
}));

// Build augment -> ability name mapping using uniqueName patterns
function getAbilityKey(uniqueName) {
  const match = uniqueName.match(/\/([^/]+?)Ability$/i);
  return match ? match[1].toLowerCase() : null;
}
function getAugmentAbilityKey(uniqueName) {
  const match = uniqueName.match(/\/([^/]+?)(?:Augment|PvPAugment)Card$/i);
  return match ? match[1].toLowerCase() : null;
}

// Build ability key -> ability name map from all warframes (base versions only)
const baseWarframes = warframes.filter(wf => !wf.isPrime && wf.name !== 'Excalibur Umbra');
const abilityKeyToName = new Map(); // key: "warframeName|abilityKey" -> ability name
for (const wf of baseWarframes) {
  for (const ability of (wf.abilities || [])) {
    const key = getAbilityKey(ability.uniqueName);
    if (key) abilityKeyToName.set(`${wf.name}|${key}`, ability.name);
  }
}

// Mods: only keep fields we use
const mods = JSON.parse(readFileSync(resolve(NODE_DATA, 'Mods.json'), 'utf-8'));
const slimMods = mods
  .filter(m => m.levelStats && m.levelStats.length > 0) // only mods with stats
  .map(m => {
    const base = {
      uniqueName: m.uniqueName,
      name: m.name,
      imageName: m.imageName,
      type: m.type,
      compatName: m.compatName,
      polarity: m.polarity,
      rarity: m.rarity,
      baseDrain: m.baseDrain,
      fusionLimit: m.fusionLimit,
      levelStats: m.levelStats,
      ...(m.isExilus ? { isExilus: true } : {}),
      ...(m.isAugment ? { isAugment: true } : {}),
      ...(m.modSet ? { modSet: m.modSet } : {}),
    };

    // For augments, resolve which ability they augment
    if (m.isAugment && m.compatName) {
      const augKey = getAugmentAbilityKey(m.uniqueName);
      if (augKey) {
        const abilityName = abilityKeyToName.get(`${m.compatName}|${augKey}`);
        if (abilityName) base.augmentFor = abilityName;
      }
    }

    return base;
  });

// Arcanes: only keep fields we use
const arcanes = JSON.parse(readFileSync(resolve(NODE_DATA, 'Arcanes.json'), 'utf-8'));
const slimArcanes = arcanes
  .filter(a => a.levelStats && a.levelStats.length > 0)
  .map(a => ({
    uniqueName: a.uniqueName,
    name: a.name,
    imageName: a.imageName,
    type: a.type,
    rarity: a.rarity,
    levelStats: a.levelStats,
  }));

// Weapons: Primary, Secondary, Melee — only keep fields we use
function slimWeapon(w) {
  return {
    uniqueName: w.uniqueName,
    name: w.name,
    description: w.description ?? '',
    imageName: w.imageName,
    category: w.category,
    masteryReq: w.masteryReq ?? 0,
    attacks: (w.attacks || []).map(a => ({
      name: a.name,
      speed: a.speed,
      crit_chance: a.crit_chance,
      crit_mult: a.crit_mult,
      status_chance: a.status_chance,
      damage: a.damage,
      ...(a.shot_type ? { shot_type: a.shot_type } : {}),
      ...(a.falloff ? { falloff: a.falloff } : {}),
    })),
    fireRate: w.fireRate,
    ...(w.magazineSize != null ? { magazineSize: w.magazineSize } : {}),
    ...(w.magazine != null ? { magazineSize: w.magazine } : {}),
    ...(w.reloadTime != null ? { reloadTime: w.reloadTime } : {}),
    ...(w.reload != null ? { reloadTime: w.reload } : {}),
    totalDamage: w.totalDamage,
    polarities: w.polarities || [],
    isPrime: w.isPrime ?? false,
    ...(w.noise ? { noise: w.noise } : {}),
    ...(w.trigger ? { trigger: w.trigger } : {}),
    ...(w.accuracy != null ? { accuracy: w.accuracy } : {}),
    // Melee-specific
    ...(w.stancePolarity ? { stancePolarity: w.stancePolarity } : {}),
    ...(w.comboDuration != null ? { comboDuration: w.comboDuration } : {}),
    ...(w.followThrough != null ? { followThrough: w.followThrough } : {}),
    ...(w.range != null ? { range: w.range } : {}),
    ...(w.slamAttack != null ? { slamAttack: w.slamAttack } : {}),
    ...(w.heavySlamAttack != null ? { heavySlamAttack: w.heavySlamAttack } : {}),
    ...(w.heavyAttack != null ? { heavyAttack: w.heavyAttack } : {}),
    // Variant info
    ...(w.vaulted != null ? { vaulted: w.vaulted } : {}),
    ...(w.omegaAttenuation != null ? { omegaAttenuation: w.omegaAttenuation } : {}),
  };
}

const primaryWeapons = JSON.parse(readFileSync(resolve(NODE_DATA, 'Primary.json'), 'utf-8'));
const secondaryWeapons = JSON.parse(readFileSync(resolve(NODE_DATA, 'Secondary.json'), 'utf-8'));
const meleeWeapons = JSON.parse(readFileSync(resolve(NODE_DATA, 'Melee.json'), 'utf-8'));

const slimPrimary = primaryWeapons.map(slimWeapon);
const slimSecondary = secondaryWeapons.map(slimWeapon);
const slimMelee = meleeWeapons.map(slimWeapon);

writeFileSync(resolve(SRC_DATA, 'Warframes.json'), JSON.stringify(slimWarframes));
writeFileSync(resolve(SRC_DATA, 'Mods.json'), JSON.stringify(slimMods));
writeFileSync(resolve(SRC_DATA, 'Arcanes.json'), JSON.stringify(slimArcanes));
writeFileSync(resolve(SRC_DATA, 'Primary.json'), JSON.stringify(slimPrimary));
writeFileSync(resolve(SRC_DATA, 'Secondary.json'), JSON.stringify(slimSecondary));
writeFileSync(resolve(SRC_DATA, 'Melee.json'), JSON.stringify(slimMelee));

console.log(`Warframes: ${warframes.length} -> ${slimWarframes.length} entries`);
console.log(`Mods: ${mods.length} -> ${slimMods.length} entries`);
console.log(`Arcanes: ${arcanes.length} -> ${slimArcanes.length} entries`);
console.log(`Primary: ${primaryWeapons.length} -> ${slimPrimary.length} entries`);
console.log(`Secondary: ${secondaryWeapons.length} -> ${slimSecondary.length} entries`);
console.log(`Melee: ${meleeWeapons.length} -> ${slimMelee.length} entries`);
const totalSize = (
  Buffer.byteLength(JSON.stringify(slimWarframes)) +
  Buffer.byteLength(JSON.stringify(slimMods)) +
  Buffer.byteLength(JSON.stringify(slimArcanes)) +
  Buffer.byteLength(JSON.stringify(slimPrimary)) +
  Buffer.byteLength(JSON.stringify(slimSecondary)) +
  Buffer.byteLength(JSON.stringify(slimMelee))
);
console.log(`Total size: ${(totalSize / 1024 / 1024).toFixed(2)} MB`);
