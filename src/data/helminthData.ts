// Helminth system: subsumed abilities and augment-to-ability mapping
// Each warframe donates one specific ability to the Helminth system.
// When that ability is infused onto another warframe, the augments for
// that ability become equippable on the receiving warframe.

/** Map of base warframe name -> ability name donated to Helminth */
export const HELMINTH_SUBSUMED: Record<string, string> = {
  Ash: 'Shuriken',
  Atlas: 'Petrify',
  Banshee: 'Silence',
  Baruuk: 'Lull',
  Chroma: 'Elemental Ward',
  Citrine: 'Preserving Shell',
  Dagath: 'Rending Talons',
  Ember: 'Fire Blast',
  Equinox: 'Rest & Rage',
  Excalibur: 'Radial Blind',
  Frost: 'Ice Wave',
  Gara: 'Spectrorage',
  Garuda: 'Blood Altar',
  Gauss: 'Thermal Sunder',
  Grendel: 'Nourish',
  Gyre: 'Cathode Grace',
  Harrow: 'Condemn',
  Hildryn: 'Pillage',
  Hydroid: 'Tempest Barrage',
  Inaros: 'Desiccation',
  Ivara: 'Quiver',
  Khora: 'Ensnare',
  Koumei: 'Edification',
  Kullervo: 'Wrathful Advance',
  Lavos: 'Vial Rush',
  Limbo: 'Banish',
  Loki: 'Decoy',
  Mag: 'Pull',
  Mesa: 'Shooting Gallery',
  Mirage: 'Eclipse',
  Nekros: 'Terrify',
  Nezha: 'Fire Walker',
  Nidus: 'Larva',
  Nova: 'Null Star',
  Nyx: 'Mind Control',
  Oberon: 'Smite',
  Octavia: 'Resonator',
  Protea: 'Dispensary',
  Qorvex: 'Containment Wall',
  Revenant: 'Reave',
  Rhino: 'Roar',
  Saryn: 'Molt',
  Sevagoth: 'Gloom',
  Styanax: 'Rally Point',
  Titania: 'Tribute',
  Trinity: 'Well of Life',
  Valkyr: 'Warcry',
  Vauban: 'Tesla Nervos',
  Volt: 'Shock',
  Voruna: 'Shroud of Dynar',
  Wisp: 'Breach Surge',
  Wukong: 'Defy',
  Xaku: "Xata's Whisper",
  Yareli: 'Aquablade',
  Zephyr: 'Airburst',
};

/** Helminth's own abilities (not subsumed from warframes) */
export const HELMINTH_ABILITIES: string[] = [
  'Empower',
  'Energy Munitions',
  'Expedite Suffering',
  'Golden Instinct',
  'Hardened Claws',
  'Hideous Resistance',
  'Infested Mobility',
  'Jury Rigging',
  'Master\'s Summons',
  'Marked for Death',
  'Nourish',
  'Parasitic Armor',
  'Perspicacity',
  'Rebuild Shields',
  'Sickening Pulse',
  'Voracious Metastasis',
];

/** Get all available Helminth abilities (subsumed + Helminth's own) */
export function getHelminthAbilities(): { source: string; ability: string }[] {
  const abilities: { source: string; ability: string }[] = [];

  // Helminth's own abilities
  for (const ability of HELMINTH_ABILITIES) {
    abilities.push({ source: 'Helminth', ability });
  }

  // Subsumed abilities from warframes
  for (const [warframe, ability] of Object.entries(HELMINTH_SUBSUMED)) {
    abilities.push({ source: warframe, ability });
  }

  return abilities.sort((a, b) => a.ability.localeCompare(b.ability));
}
