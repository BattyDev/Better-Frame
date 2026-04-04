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

// Mods: only keep fields we use
const mods = JSON.parse(readFileSync(resolve(NODE_DATA, 'Mods.json'), 'utf-8'));
const slimMods = mods
  .filter(m => m.levelStats && m.levelStats.length > 0) // only mods with stats
  .map(m => ({
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
  }));

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

writeFileSync(resolve(SRC_DATA, 'Warframes.json'), JSON.stringify(slimWarframes));
writeFileSync(resolve(SRC_DATA, 'Mods.json'), JSON.stringify(slimMods));
writeFileSync(resolve(SRC_DATA, 'Arcanes.json'), JSON.stringify(slimArcanes));

console.log(`Warframes: ${warframes.length} -> ${slimWarframes.length} entries`);
console.log(`Mods: ${mods.length} -> ${slimMods.length} entries`);
console.log(`Arcanes: ${arcanes.length} -> ${slimArcanes.length} entries`);
console.log(`Total size: ${((
  Buffer.byteLength(JSON.stringify(slimWarframes)) +
  Buffer.byteLength(JSON.stringify(slimMods)) +
  Buffer.byteLength(JSON.stringify(slimArcanes))
) / 1024 / 1024).toFixed(2)} MB`);
