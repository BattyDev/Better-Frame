// Zustand store for the warframe build editor
import { create } from 'zustand';
import type { Polarity } from '../types';
import type { WarframeData, ModData, ArcaneData } from '../types/gameData';
import { getModByUniqueName, getArcaneByUniqueName } from '../data/warframeData';
import { calculateCapacity, type CapacityResult } from '../lib/math/capacityCalc';
import { calculateWarframeStats, type CalculatedStats } from '../lib/math/warframeCalc';

export interface SlottedModEntry {
  mod: ModData;
  rank: number;
}

export interface SlottedArcaneEntry {
  arcane: ArcaneData;
  rank: number;
}

interface BuilderState {
  // Selected warframe
  warframe: WarframeData | null;

  // 8 regular mod slots (index 0-7)
  mods: (SlottedModEntry | null)[];

  // Aura slot
  aura: SlottedModEntry | null;

  // Exilus slot
  exilus: SlottedModEntry | null;

  // Arcane slots
  arcanes: [SlottedArcaneEntry | null, SlottedArcaneEntry | null];

  // Slot polarities (index 0-7 for regular, can be changed by forma)
  slotPolarities: (Polarity | null)[];

  // Aura slot polarity (from warframe, can be changed by forma)
  auraPolarity: Polarity | null;

  // Exilus slot polarity
  exilusPolarity: Polarity | null;

  // Helminth: infused ability replacing one of the warframe's abilities
  helminthAbility: { source: string; ability: string } | null;

  // Build options
  hasReactor: boolean;
  formaCount: number;

  // UI state
  activeModBrowser: 'regular' | 'aura' | 'exilus' | 'arcane' | null;
  targetSlotIndex: number | null; // which slot the mod browser is filling

  // Computed values (updated on every change)
  capacity: CapacityResult;
  stats: CalculatedStats;
}

interface BuilderActions {
  // Warframe selection
  selectWarframe: (warframe: WarframeData) => void;
  clearWarframe: () => void;

  // Mod management
  setMod: (slotIndex: number, mod: ModData, rank: number) => void;
  removeMod: (slotIndex: number) => void;
  setModRank: (slotIndex: number, rank: number) => void;
  moveMod: (fromIndex: number, toIndex: number) => void;
  setAura: (mod: ModData, rank: number) => void;
  removeAura: () => void;
  setExilus: (mod: ModData, rank: number) => void;
  removeExilus: () => void;

  // Arcane management
  setArcane: (slotIndex: 0 | 1, arcane: ArcaneData, rank: number) => void;
  removeArcane: (slotIndex: 0 | 1) => void;

  // Helminth
  setHelminthAbility: (ability: { source: string; ability: string } | null) => void;

  // Forma / Reactor
  setSlotPolarity: (slotIndex: number, polarity: Polarity | null) => void;
  setAuraPolarity: (polarity: Polarity | null) => void;
  setExilusPolarity: (polarity: Polarity | null) => void;
  toggleReactor: () => void;

  // UI state
  openModBrowser: (type: 'regular' | 'aura' | 'exilus' | 'arcane', slotIndex?: number) => void;
  closeModBrowser: () => void;

  // Serialization
  exportConfig: () => SerializedBuildConfig;
  importConfig: (config: SerializedBuildConfig, warframe: WarframeData) => void;

  // Reset
  resetBuild: () => void;
}

export interface SerializedBuildConfig {
  mods: ({ uniqueName: string; rank: number } | null)[];
  aura: { uniqueName: string; rank: number } | null;
  exilus: { uniqueName: string; rank: number } | null;
  arcanes: [{ uniqueName: string; rank: number } | null, { uniqueName: string; rank: number } | null];
  slotPolarities: (Polarity | null)[];
  auraPolarity: Polarity | null;
  exilusPolarity: Polarity | null;
  formaCount: number;
  hasReactor: boolean;
  helminthAbility: { source: string; ability: string } | null;
}

const EMPTY_CAPACITY: CapacityResult = {
  totalCapacity: 30,
  usedCapacity: 0,
  remainingCapacity: 30,
  isOverCapacity: false,
};

const EMPTY_STATS: CalculatedStats = {
  base: {},
  modded: {},
  textEffects: [],
  setBonuses: [],
  conditionalBuffs: [],
  arcaneEffects: [],
};

function createInitialState(): BuilderState {
  return {
    warframe: null,
    mods: Array(8).fill(null),
    aura: null,
    exilus: null,
    arcanes: [null, null],
    slotPolarities: Array(8).fill(null),
    auraPolarity: null,
    exilusPolarity: null,
    helminthAbility: null,
    hasReactor: false,
    formaCount: 0,
    activeModBrowser: null,
    targetSlotIndex: null,
    capacity: EMPTY_CAPACITY,
    stats: EMPTY_STATS,
  };
}

/** Recalculate capacity and stats based on current state */
function recalculate(state: BuilderState): Pick<BuilderState, 'capacity' | 'stats'> {
  if (!state.warframe) {
    return { capacity: EMPTY_CAPACITY, stats: EMPTY_STATS };
  }

  // Build mod list for capacity calculation
  const modEntries = state.mods
    .map((entry, i) =>
      entry
        ? { mod: entry.mod, rank: entry.rank, slotPolarity: state.slotPolarities[i] }
        : null,
    )
    .filter((e): e is NonNullable<typeof e> => e !== null);

  const capacity = calculateCapacity({
    hasReactor: state.hasReactor,
    auraMod: state.aura?.mod ?? null,
    auraRank: state.aura?.rank ?? 0,
    auraSlotPolarity: state.auraPolarity,
    mods: modEntries,
    exilusMod: state.exilus?.mod ?? null,
    exilusRank: state.exilus?.rank ?? 0,
    exilusSlotPolarity: state.exilusPolarity,
  });

  // Build all mods list for stat calculation
  const allMods: { mod: ModData; rank: number }[] = [];
  if (state.aura) allMods.push({ mod: state.aura.mod, rank: state.aura.rank });
  if (state.exilus) allMods.push({ mod: state.exilus.mod, rank: state.exilus.rank });
  for (const entry of state.mods) {
    if (entry) allMods.push({ mod: entry.mod, rank: entry.rank });
  }

  // Build arcanes list for arcane effect parsing
  const arcaneEntries = state.arcanes
    .filter((e): e is NonNullable<typeof e> => e !== null)
    .map(e => ({ arcane: e.arcane, rank: e.rank }));

  const stats = calculateWarframeStats(state.warframe, allMods, arcaneEntries);

  return { capacity, stats };
}

export const useBuilderStore = create<BuilderState & BuilderActions>()((set, get) => ({
  ...createInitialState(),

  selectWarframe: (warframe) =>
    set(() => {
      const newState = {
        ...createInitialState(),
        warframe,
        auraPolarity: (warframe.aura as Polarity) ?? null,
        slotPolarities: Array(8)
          .fill(null)
          .map((_, i) => (warframe.polarities[i] as Polarity) ?? null),
      };
      return { ...newState, ...recalculate(newState) };
    }),

  clearWarframe: () => set(createInitialState()),

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

  setAura: (mod, rank) =>
    set((state) => {
      const aura = { mod, rank };
      const newState = { ...state, aura };
      return { aura, ...recalculate(newState) };
    }),

  removeAura: () =>
    set((state) => {
      const newState = { ...state, aura: null };
      return { aura: null, ...recalculate(newState) };
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

  setArcane: (slotIndex, arcane, rank) =>
    set((state) => {
      const arcanes = [...state.arcanes] as typeof state.arcanes;
      arcanes[slotIndex] = { arcane, rank };
      return { arcanes };
    }),

  removeArcane: (slotIndex) =>
    set((state) => {
      const arcanes = [...state.arcanes] as typeof state.arcanes;
      arcanes[slotIndex] = null;
      return { arcanes };
    }),

  setHelminthAbility: (ability) =>
    set({ helminthAbility: ability }),

  setSlotPolarity: (slotIndex, polarity) =>
    set((state) => {
      const slotPolarities = [...state.slotPolarities];
      const oldPolarity = slotPolarities[slotIndex];
      slotPolarities[slotIndex] = polarity;

      // Track forma: changing from default polarity counts as a forma
      const defaultPolarity = state.warframe?.polarities[slotIndex] ?? null;
      let formaCount = state.formaCount;
      if (polarity !== defaultPolarity && oldPolarity === defaultPolarity) {
        formaCount++;
      } else if (polarity === defaultPolarity && oldPolarity !== defaultPolarity) {
        formaCount = Math.max(0, formaCount - 1);
      }

      const newState = { ...state, slotPolarities, formaCount };
      return { slotPolarities, formaCount, ...recalculate(newState) };
    }),

  setAuraPolarity: (polarity) =>
    set((state) => {
      const defaultPolarity = state.warframe?.aura ?? null;
      let formaCount = state.formaCount;
      if (polarity !== defaultPolarity && state.auraPolarity === defaultPolarity) {
        formaCount++;
      } else if (polarity === defaultPolarity && state.auraPolarity !== defaultPolarity) {
        formaCount = Math.max(0, formaCount - 1);
      }
      const newState = { ...state, auraPolarity: polarity, formaCount };
      return { auraPolarity: polarity, formaCount, ...recalculate(newState) };
    }),

  setExilusPolarity: (polarity) =>
    set((state) => {
      const oldPolarity = state.exilusPolarity;
      let formaCount = state.formaCount;
      // Exilus has no default polarity, so any polarity is a forma
      if (polarity && !oldPolarity) formaCount++;
      else if (!polarity && oldPolarity) formaCount = Math.max(0, formaCount - 1);
      const newState = { ...state, exilusPolarity: polarity, formaCount };
      return { exilusPolarity: polarity, formaCount, ...recalculate(newState) };
    }),

  toggleReactor: () =>
    set((state) => {
      const newState = { ...state, hasReactor: !state.hasReactor };
      return { hasReactor: newState.hasReactor, ...recalculate(newState) };
    }),

  openModBrowser: (type, slotIndex) =>
    set({ activeModBrowser: type, targetSlotIndex: slotIndex ?? null }),

  closeModBrowser: () =>
    set({ activeModBrowser: null, targetSlotIndex: null }),

  exportConfig: (): SerializedBuildConfig => {
    const state = get();
    return {
      mods: state.mods.map((e) =>
        e ? { uniqueName: e.mod.uniqueName, rank: e.rank } : null,
      ),
      aura: state.aura
        ? { uniqueName: state.aura.mod.uniqueName, rank: state.aura.rank }
        : null,
      exilus: state.exilus
        ? { uniqueName: state.exilus.mod.uniqueName, rank: state.exilus.rank }
        : null,
      arcanes: [
        state.arcanes[0]
          ? { uniqueName: state.arcanes[0].arcane.uniqueName, rank: state.arcanes[0].rank }
          : null,
        state.arcanes[1]
          ? { uniqueName: state.arcanes[1].arcane.uniqueName, rank: state.arcanes[1].rank }
          : null,
      ],
      slotPolarities: state.slotPolarities,
      auraPolarity: state.auraPolarity,
      exilusPolarity: state.exilusPolarity,
      formaCount: state.formaCount,
      hasReactor: state.hasReactor,
      helminthAbility: state.helminthAbility,
    };
  },

  importConfig: (config, warframe) =>
    set(() => {
      const mods = config.mods.map((entry) => {
        if (!entry) return null;
        const mod = getModByUniqueName(entry.uniqueName);
        if (!mod) return null;
        return { mod, rank: entry.rank };
      });

      const aura = config.aura
        ? (() => {
            const mod = getModByUniqueName(config.aura!.uniqueName);
            return mod ? { mod, rank: config.aura!.rank } : null;
          })()
        : null;

      const exilus = config.exilus
        ? (() => {
            const mod = getModByUniqueName(config.exilus!.uniqueName);
            return mod ? { mod, rank: config.exilus!.rank } : null;
          })()
        : null;

      const arcanes: [SlottedArcaneEntry | null, SlottedArcaneEntry | null] = [null, null];
      for (let i = 0; i < 2; i++) {
        const entry = config.arcanes[i];
        if (entry) {
          const arcane = getArcaneByUniqueName(entry.uniqueName);
          if (arcane) arcanes[i] = { arcane, rank: entry.rank };
        }
      }

      const newState: BuilderState = {
        warframe,
        mods,
        aura,
        exilus,
        arcanes,
        slotPolarities: config.slotPolarities,
        auraPolarity: config.auraPolarity,
        exilusPolarity: config.exilusPolarity,
        helminthAbility: config.helminthAbility ?? null,
        hasReactor: config.hasReactor,
        formaCount: config.formaCount,
        activeModBrowser: null,
        targetSlotIndex: null,
        capacity: EMPTY_CAPACITY,
        stats: EMPTY_STATS,
      };

      return { ...newState, ...recalculate(newState) };
    }),

  resetBuild: () => set(createInitialState()),
}));
