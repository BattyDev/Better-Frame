// Zustand store for the weapon build editor
import { create } from 'zustand';
import type { Polarity } from '../types';
import type { WeaponData, WeaponCategory, DamageType, ModData } from '../types/gameData';
import { getModByUniqueName } from '../data/warframeData';
import { calculateCapacity, type CapacityResult } from '../lib/math/capacityCalc';
import { calculateWeaponStats, type WeaponCalculatedStats } from '../lib/math/weaponCalc';

export interface SlottedModEntry {
  mod: ModData;
  rank: number;
}

interface WeaponBuilderState {
  // Selected weapon
  weapon: WeaponData | null;
  category: WeaponCategory | null;

  // 8 regular mod slots (index 0-7)
  mods: (SlottedModEntry | null)[];

  // Exilus slot (guns only)
  exilus: SlottedModEntry | null;

  // Stance slot (melee only, adds capacity like auras)
  stance: SlottedModEntry | null;

  // Slot polarities (index 0-7 for regular, can be changed by forma)
  slotPolarities: (Polarity | null)[];
  exilusPolarity: Polarity | null;
  stancePolarity: Polarity | null;

  // Build options
  hasCatalyst: boolean; // Orokin Catalyst (weapon equivalent of Reactor)
  formaCount: number;

  // Kuva/Tenet bonus element
  bonusElement: DamageType | null;
  bonusElementValue: number; // 0.25 to 0.60

  // UI state
  activeModBrowser: 'regular' | 'exilus' | 'stance' | null;
  targetSlotIndex: number | null;

  // Computed values
  capacity: CapacityResult;
  stats: WeaponCalculatedStats;
}

interface WeaponBuilderActions {
  selectWeapon: (weapon: WeaponData) => void;
  clearWeapon: () => void;

  setMod: (slotIndex: number, mod: ModData, rank: number) => void;
  removeMod: (slotIndex: number) => void;
  setModRank: (slotIndex: number, rank: number) => void;
  moveMod: (fromIndex: number, toIndex: number) => void;
  setExilus: (mod: ModData, rank: number) => void;
  removeExilus: () => void;
  setStance: (mod: ModData, rank: number) => void;
  removeStance: () => void;

  setBonusElement: (element: DamageType | null, value?: number) => void;

  setSlotPolarity: (slotIndex: number, polarity: Polarity | null) => void;
  setExilusPolarity: (polarity: Polarity | null) => void;
  setStancePolarity: (polarity: Polarity | null) => void;
  toggleCatalyst: () => void;

  openModBrowser: (type: 'regular' | 'exilus' | 'stance', slotIndex?: number) => void;
  closeModBrowser: () => void;

  exportConfig: () => SerializedWeaponBuildConfig;
  importConfig: (config: SerializedWeaponBuildConfig, weapon: WeaponData) => void;

  resetBuild: () => void;
}

export interface SerializedWeaponBuildConfig {
  mods: ({ uniqueName: string; rank: number } | null)[];
  exilus: { uniqueName: string; rank: number } | null;
  stance: { uniqueName: string; rank: number } | null;
  slotPolarities: (Polarity | null)[];
  exilusPolarity: Polarity | null;
  stancePolarity: Polarity | null;
  formaCount: number;
  hasCatalyst: boolean;
  bonusElement: DamageType | null;
  bonusElementValue: number;
}

const EMPTY_CAPACITY: CapacityResult = {
  totalCapacity: 30,
  usedCapacity: 0,
  remainingCapacity: 30,
  isOverCapacity: false,
};

const EMPTY_STATS: WeaponCalculatedStats = {
  totalDamage: 0,
  damagePerShot: 0,
  physicalDamage: {},
  elementalDamage: [],
  totalElementalDamage: 0,
  critChance: 0,
  critMultiplier: 0,
  statusChance: 0,
  multishot: 1,
  fireRate: 0,
  magazineSize: 0,
  reloadTime: 0,
  avgDamagePerShot: 0,
  burstDps: 0,
  sustainedDps: 0,
  textEffects: [],
};

function createInitialState(): WeaponBuilderState {
  return {
    weapon: null,
    category: null,
    mods: Array(8).fill(null),
    exilus: null,
    stance: null,
    slotPolarities: Array(8).fill(null),
    exilusPolarity: null,
    stancePolarity: null,
    hasCatalyst: false,
    formaCount: 0,
    bonusElement: null,
    bonusElementValue: 0,
    activeModBrowser: null,
    targetSlotIndex: null,
    capacity: EMPTY_CAPACITY,
    stats: EMPTY_STATS,
  };
}

function recalculate(state: WeaponBuilderState): Pick<WeaponBuilderState, 'capacity' | 'stats'> {
  if (!state.weapon) {
    return { capacity: EMPTY_CAPACITY, stats: EMPTY_STATS };
  }

  // Capacity calculation
  // For melee: stance acts like aura (adds capacity)
  // For guns: no aura, just mods + exilus
  const modEntries = state.mods
    .map((entry, i) =>
      entry
        ? { mod: entry.mod, rank: entry.rank, slotPolarity: state.slotPolarities[i] }
        : null,
    )
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const isMelee = state.weapon.category === 'Melee';

  const capacity = calculateCapacity({
    hasReactor: state.hasCatalyst,
    // Melee stance works like aura (negative drain = adds capacity)
    auraMod: isMelee ? (state.stance?.mod ?? null) : null,
    auraRank: isMelee ? (state.stance?.rank ?? 0) : 0,
    auraSlotPolarity: isMelee ? state.stancePolarity : null,
    mods: modEntries,
    exilusMod: !isMelee ? (state.exilus?.mod ?? null) : null,
    exilusRank: !isMelee ? (state.exilus?.rank ?? 0) : 0,
    exilusSlotPolarity: !isMelee ? state.exilusPolarity : null,
  });

  // Stat calculation - mods in slot order for element combining
  const orderedMods: { mod: ModData; rank: number }[] = [];
  if (state.stance) orderedMods.push({ mod: state.stance.mod, rank: state.stance.rank });
  for (const entry of state.mods) {
    if (entry) orderedMods.push({ mod: entry.mod, rank: entry.rank });
  }
  if (state.exilus) orderedMods.push({ mod: state.exilus.mod, rank: state.exilus.rank });

  const stats = calculateWeaponStats(
    state.weapon,
    orderedMods,
    state.bonusElement ?? undefined,
    state.bonusElementValue > 0 ? state.bonusElementValue : undefined,
  );

  return { capacity, stats };
}

export const useWeaponBuilderStore = create<WeaponBuilderState & WeaponBuilderActions>()(
  (set, get) => ({
    ...createInitialState(),

    selectWeapon: (weapon) =>
      set(() => {
        const newState: WeaponBuilderState = {
          ...createInitialState(),
          weapon,
          category: weapon.category,
          stancePolarity: (weapon.stancePolarity as Polarity) ?? null,
          slotPolarities: Array(8)
            .fill(null)
            .map((_, i) => (weapon.polarities[i] as Polarity) ?? null),
        };
        return { ...newState, ...recalculate(newState) };
      }),

    clearWeapon: () => set(createInitialState()),

    setMod: (slotIndex, mod, rank) =>
      set((state) => {
        const mods = [...state.mods];
        mods[slotIndex] = { mod, rank };
        const newState = { ...state, mods };
        return { mods, ...recalculate(newState) };
      }),

    removeMod: (slotIndex) =>
      set((state) => {
        const mods = [...state.mods];
        mods[slotIndex] = null;
        const newState = { ...state, mods };
        return { mods, ...recalculate(newState) };
      }),

    setModRank: (slotIndex, rank) =>
      set((state) => {
        const entry = state.mods[slotIndex];
        if (!entry) return {};
        const mods = [...state.mods];
        mods[slotIndex] = { ...entry, rank };
        const newState = { ...state, mods };
        return { mods, ...recalculate(newState) };
      }),

    moveMod: (fromIndex, toIndex) =>
      set((state) => {
        const mods = [...state.mods];
        const temp = mods[fromIndex];
        mods[fromIndex] = mods[toIndex];
        mods[toIndex] = temp;
        const newState = { ...state, mods };
        return { mods, ...recalculate(newState) };
      }),

    setExilus: (mod, rank) =>
      set((state) => {
        const exilus = { mod, rank };
        const newState = { ...state, exilus };
        return { exilus, ...recalculate(newState) };
      }),

    removeExilus: () =>
      set((state) => {
        const newState = { ...state, exilus: null };
        return { exilus: null, ...recalculate(newState) };
      }),

    setStance: (mod, rank) =>
      set((state) => {
        const stance = { mod, rank };
        const newState = { ...state, stance };
        return { stance, ...recalculate(newState) };
      }),

    removeStance: () =>
      set((state) => {
        const newState = { ...state, stance: null };
        return { stance: null, ...recalculate(newState) };
      }),

    setBonusElement: (element, value) =>
      set((state) => {
        const newState = {
          ...state,
          bonusElement: element,
          bonusElementValue: value ?? 0,
        };
        return {
          bonusElement: element,
          bonusElementValue: value ?? 0,
          ...recalculate(newState),
        };
      }),

    setSlotPolarity: (slotIndex, polarity) =>
      set((state) => {
        const slotPolarities = [...state.slotPolarities];
        const oldPolarity = slotPolarities[slotIndex];
        slotPolarities[slotIndex] = polarity;

        const defaultPolarity = state.weapon?.polarities[slotIndex] ?? null;
        let formaCount = state.formaCount;
        if (polarity !== defaultPolarity && oldPolarity === defaultPolarity) {
          formaCount++;
        } else if (polarity === defaultPolarity && oldPolarity !== defaultPolarity) {
          formaCount = Math.max(0, formaCount - 1);
        }

        const newState = { ...state, slotPolarities, formaCount };
        return { slotPolarities, formaCount, ...recalculate(newState) };
      }),

    setExilusPolarity: (polarity) =>
      set((state) => {
        const oldPolarity = state.exilusPolarity;
        let formaCount = state.formaCount;
        if (polarity && !oldPolarity) formaCount++;
        else if (!polarity && oldPolarity) formaCount = Math.max(0, formaCount - 1);
        const newState = { ...state, exilusPolarity: polarity, formaCount };
        return { exilusPolarity: polarity, formaCount, ...recalculate(newState) };
      }),

    setStancePolarity: (polarity) =>
      set((state) => {
        const defaultPolarity = state.weapon?.stancePolarity ?? null;
        let formaCount = state.formaCount;
        if (polarity !== defaultPolarity && state.stancePolarity === (defaultPolarity as Polarity)) {
          formaCount++;
        } else if (polarity === defaultPolarity && state.stancePolarity !== (defaultPolarity as Polarity)) {
          formaCount = Math.max(0, formaCount - 1);
        }
        const newState = { ...state, stancePolarity: polarity, formaCount };
        return { stancePolarity: polarity, formaCount, ...recalculate(newState) };
      }),

    toggleCatalyst: () =>
      set((state) => {
        const newState = { ...state, hasCatalyst: !state.hasCatalyst };
        return { hasCatalyst: newState.hasCatalyst, ...recalculate(newState) };
      }),

    openModBrowser: (type, slotIndex) =>
      set({ activeModBrowser: type, targetSlotIndex: slotIndex ?? null }),

    closeModBrowser: () =>
      set({ activeModBrowser: null, targetSlotIndex: null }),

    exportConfig: (): SerializedWeaponBuildConfig => {
      const state = get();
      return {
        mods: state.mods.map((e) =>
          e ? { uniqueName: e.mod.uniqueName, rank: e.rank } : null,
        ),
        exilus: state.exilus
          ? { uniqueName: state.exilus.mod.uniqueName, rank: state.exilus.rank }
          : null,
        stance: state.stance
          ? { uniqueName: state.stance.mod.uniqueName, rank: state.stance.rank }
          : null,
        slotPolarities: state.slotPolarities,
        exilusPolarity: state.exilusPolarity,
        stancePolarity: state.stancePolarity,
        formaCount: state.formaCount,
        hasCatalyst: state.hasCatalyst,
        bonusElement: state.bonusElement,
        bonusElementValue: state.bonusElementValue,
      };
    },

    importConfig: (config, weapon) =>
      set(() => {
        const mods = config.mods.map((entry) => {
          if (!entry) return null;
          const mod = getModByUniqueName(entry.uniqueName);
          if (!mod) return null;
          return { mod, rank: entry.rank };
        });

        const exilus = config.exilus
          ? (() => {
              const mod = getModByUniqueName(config.exilus!.uniqueName);
              return mod ? { mod, rank: config.exilus!.rank } : null;
            })()
          : null;

        const stance = config.stance
          ? (() => {
              const mod = getModByUniqueName(config.stance!.uniqueName);
              return mod ? { mod, rank: config.stance!.rank } : null;
            })()
          : null;

        const newState: WeaponBuilderState = {
          weapon,
          category: weapon.category,
          mods,
          exilus,
          stance,
          slotPolarities: config.slotPolarities,
          exilusPolarity: config.exilusPolarity,
          stancePolarity: config.stancePolarity,
          hasCatalyst: config.hasCatalyst,
          formaCount: config.formaCount,
          bonusElement: config.bonusElement,
          bonusElementValue: config.bonusElementValue,
          activeModBrowser: null,
          targetSlotIndex: null,
          capacity: EMPTY_CAPACITY,
          stats: EMPTY_STATS,
        };

        return { ...newState, ...recalculate(newState) };
      }),

    resetBuild: () => set(createInitialState()),
  }),
);
