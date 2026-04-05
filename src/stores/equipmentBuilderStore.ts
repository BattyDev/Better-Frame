// Zustand store for the generic equipment builder (Archwing, Companion, CompanionWeapon, Necramech, Parazon)
// These builders share a simpler mod slot model:
//   - Archwing:       8 mod slots, reactor/catalyst toggle
//   - Companion:      8 mod slots, reactor/catalyst toggle
//   - CompanionWeapon: 8 mod slots, catalyst toggle
//   - Necramech:      8 mod slots, reactor toggle
//   - Parazon:        3 mod slots, no reactor
import { create } from 'zustand';
import type { Polarity } from '../types';
import type { ModData } from '../types/gameData';
import { getModByUniqueName } from '../data/warframeData';
import { calculateCapacity, type CapacityResult } from '../lib/math/capacityCalc';

export type EquipmentCategory =
  | 'Archwing'
  | 'Companion'
  | 'CompanionWeapon'
  | 'Necramech'
  | 'Parazon';

/** How many regular mod slots each equipment type gets */
export const EQUIPMENT_SLOT_COUNT: Record<EquipmentCategory, number> = {
  Archwing: 8,
  Companion: 8,
  CompanionWeapon: 8,
  Necramech: 8,
  Parazon: 3,
};

/** Whether a category uses a Reactor (frame) or Catalyst (weapon) for capacity doubling */
export const EQUIPMENT_USES_REACTOR: Record<EquipmentCategory, boolean> = {
  Archwing: true,
  Companion: true,
  CompanionWeapon: false,
  Necramech: true,
  Parazon: false,
};

export interface SlottedModEntry {
  mod: ModData;
  rank: number;
}

// Generic item reference (we don't need the full typed data in the store)
export interface EquipmentItem {
  uniqueName: string;
  name: string;
  imageName: string;
  polarities?: string[];
}

interface EquipmentBuilderState {
  category: EquipmentCategory | null;
  item: EquipmentItem | null;

  // Mod slots (length depends on EQUIPMENT_SLOT_COUNT for the category)
  mods: (SlottedModEntry | null)[];
  slotPolarities: (Polarity | null)[];

  // Build options
  hasReactor: boolean; // Orokin Reactor / Catalyst doubles capacity
  formaCount: number;

  // UI
  activeModBrowserSlot: number | null; // null = closed

  // Computed
  capacity: CapacityResult;
}

interface EquipmentBuilderActions {
  initCategory: (category: EquipmentCategory) => void;
  selectItem: (item: EquipmentItem) => void;
  clearItem: () => void;

  setMod: (slotIndex: number, mod: ModData, rank: number) => void;
  removeMod: (slotIndex: number) => void;
  setModRank: (slotIndex: number, rank: number) => void;
  moveMod: (fromIndex: number, toIndex: number) => void;

  setSlotPolarity: (slotIndex: number, polarity: Polarity | null) => void;
  toggleReactor: () => void;

  openModBrowser: (slotIndex: number) => void;
  closeModBrowser: () => void;

  exportConfig: () => SerializedEquipmentConfig;
  importConfig: (config: SerializedEquipmentConfig, item: EquipmentItem) => void;

  resetBuild: () => void;
}

export interface SerializedEquipmentConfig {
  mods: ({ uniqueName: string; rank: number } | null)[];
  slotPolarities: (Polarity | null)[];
  hasReactor: boolean;
  formaCount: number;
}

const EMPTY_CAPACITY: CapacityResult = {
  totalCapacity: 30,
  usedCapacity: 0,
  remainingCapacity: 30,
  isOverCapacity: false,
};

function buildInitialState(category: EquipmentCategory | null): EquipmentBuilderState {
  const slotCount = category ? EQUIPMENT_SLOT_COUNT[category] : 8;
  return {
    category,
    item: null,
    mods: Array(slotCount).fill(null),
    slotPolarities: Array(slotCount).fill(null),
    hasReactor: false,
    formaCount: 0,
    activeModBrowserSlot: null,
    capacity: EMPTY_CAPACITY,
  };
}

function recalcCapacity(state: EquipmentBuilderState): CapacityResult {
  const modEntries = state.mods
    .map((entry, i) =>
      entry
        ? { mod: entry.mod, rank: entry.rank, slotPolarity: state.slotPolarities[i] }
        : null,
    )
    .filter((e): e is NonNullable<typeof e> => e !== null);

  return calculateCapacity({
    hasReactor: state.hasReactor,
    auraMod: null,
    auraRank: 0,
    auraSlotPolarity: null,
    mods: modEntries,
    exilusMod: null,
    exilusRank: 0,
    exilusSlotPolarity: null,
  });
}

export const useEquipmentBuilderStore = create<EquipmentBuilderState & EquipmentBuilderActions>()(
  (set, get) => ({
    ...buildInitialState(null),

    initCategory: (category) =>
      set(buildInitialState(category)),

    selectItem: (item) =>
      set((state) => {
        const slotCount = state.category ? EQUIPMENT_SLOT_COUNT[state.category] : 8;
        const newState = {
          ...state,
          item,
          mods: Array(slotCount).fill(null),
          slotPolarities: (item.polarities ?? []).slice(0, slotCount).map(
            (p) => (p as Polarity) ?? null,
          ),
          hasReactor: false,
          formaCount: 0,
        };
        return { ...newState, capacity: recalcCapacity(newState) };
      }),

    clearItem: () =>
      set((state) => {
        const slotCount = state.category ? EQUIPMENT_SLOT_COUNT[state.category] : 8;
        const newState = {
          ...state,
          item: null,
          mods: Array(slotCount).fill(null),
          slotPolarities: Array(slotCount).fill(null),
          hasReactor: false,
          formaCount: 0,
        };
        return { ...newState, capacity: EMPTY_CAPACITY };
      }),

    setMod: (slotIndex, mod, rank) =>
      set((state) => {
        const mods = [...state.mods];
        mods[slotIndex] = { mod, rank };
        const newState = { ...state, mods };
        return { mods, capacity: recalcCapacity(newState) };
      }),

    removeMod: (slotIndex) =>
      set((state) => {
        const mods = [...state.mods];
        mods[slotIndex] = null;
        const newState = { ...state, mods };
        return { mods, capacity: recalcCapacity(newState) };
      }),

    setModRank: (slotIndex, rank) =>
      set((state) => {
        const entry = state.mods[slotIndex];
        if (!entry) return {};
        const mods = [...state.mods];
        mods[slotIndex] = { ...entry, rank };
        const newState = { ...state, mods };
        return { mods, capacity: recalcCapacity(newState) };
      }),

    moveMod: (fromIndex, toIndex) =>
      set((state) => {
        const mods = [...state.mods];
        const temp = mods[fromIndex];
        mods[fromIndex] = mods[toIndex];
        mods[toIndex] = temp;
        const newState = { ...state, mods };
        return { mods, capacity: recalcCapacity(newState) };
      }),

    setSlotPolarity: (slotIndex, polarity) =>
      set((state) => {
        const slotPolarities = [...state.slotPolarities];
        const defaultPolarity = (state.item?.polarities?.[slotIndex] as Polarity) ?? null;
        const oldPolarity = slotPolarities[slotIndex];
        slotPolarities[slotIndex] = polarity;

        let formaCount = state.formaCount;
        if (polarity !== defaultPolarity && oldPolarity === defaultPolarity) formaCount++;
        else if (polarity === defaultPolarity && oldPolarity !== defaultPolarity)
          formaCount = Math.max(0, formaCount - 1);

        const newState = { ...state, slotPolarities, formaCount };
        return { slotPolarities, formaCount, capacity: recalcCapacity(newState) };
      }),

    toggleReactor: () =>
      set((state) => {
        const newState = { ...state, hasReactor: !state.hasReactor };
        return { hasReactor: newState.hasReactor, capacity: recalcCapacity(newState) };
      }),

    openModBrowser: (slotIndex) => set({ activeModBrowserSlot: slotIndex }),
    closeModBrowser: () => set({ activeModBrowserSlot: null }),

    exportConfig: (): SerializedEquipmentConfig => {
      const state = get();
      return {
        mods: state.mods.map((e) =>
          e ? { uniqueName: e.mod.uniqueName, rank: e.rank } : null,
        ),
        slotPolarities: state.slotPolarities,
        hasReactor: state.hasReactor,
        formaCount: state.formaCount,
      };
    },

    importConfig: (config, item) =>
      set((state) => {
        const slotCount = state.category ? EQUIPMENT_SLOT_COUNT[state.category] : 8;
        const mods = config.mods.map((entry) => {
          if (!entry) return null;
          const mod = getModByUniqueName(entry.uniqueName);
          if (!mod) return null;
          return { mod, rank: entry.rank };
        });

        const newState: EquipmentBuilderState = {
          ...state,
          item,
          mods: mods.slice(0, slotCount),
          slotPolarities: config.slotPolarities.slice(0, slotCount),
          hasReactor: config.hasReactor,
          formaCount: config.formaCount,
          activeModBrowserSlot: null,
          capacity: EMPTY_CAPACITY,
        };

        return { ...newState, capacity: recalcCapacity(newState) };
      }),

    resetBuild: () =>
      set((state) => buildInitialState(state.category)),
  }),
);
