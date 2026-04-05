// Zustand store for the Loadout entity
// A loadout references saved builds (by ID) for warframe + weapons
import { create } from 'zustand';
import type { FocusSchool } from '../types';
import { supabase } from '../lib/supabase';

export interface LoadoutSlots {
  warframeBuildId: string | null;
  primaryBuildId: string | null;
  secondaryBuildId: string | null;
  meleeBuildId: string | null;
  exaltedBuildId: string | null;
  // Phase 4
  archwingBuildId: string | null;
  archgunBuildId: string | null;
  archmeleeBuildId: string | null;
  companionBuildId: string | null;
  companionWeaponBuildId: string | null;
  necramechBuildId: string | null;
  parazonBuildId: string | null;
}

export interface LoadoutBuildSummary {
  id: string;
  name: string;
  itemCategory: string;
  itemUniqueName: string;
}

interface LoadoutState {
  // Loadout metadata
  id: string | null;
  name: string;
  description: string;

  // Build references
  slots: LoadoutSlots;

  // Resolved build summaries (for display)
  buildSummaries: Record<string, LoadoutBuildSummary>;

  // Focus school
  focusSchool: FocusSchool | null;

  // Status
  isPublic: boolean;
  isSaving: boolean;
  isLoading: boolean;

  // User's saved builds for selection
  userBuilds: LoadoutBuildSummary[];
}

interface LoadoutActions {
  setName: (name: string) => void;
  setDescription: (description: string) => void;
  setFocusSchool: (school: FocusSchool | null) => void;
  setSlot: (slot: keyof LoadoutSlots, buildId: string | null) => void;
  clearSlot: (slot: keyof LoadoutSlots) => void;
  setPublic: (isPublic: boolean) => void;

  // Data fetching
  loadUserBuilds: (userId: string) => Promise<void>;
  loadLoadout: (loadoutId: string) => Promise<void>;

  // Persistence
  saveLoadout: (userId: string) => Promise<string | null>;

  // Reset
  resetLoadout: () => void;
}

function createInitialState(): LoadoutState {
  return {
    id: null,
    name: '',
    description: '',
    slots: {
      warframeBuildId: null,
      primaryBuildId: null,
      secondaryBuildId: null,
      meleeBuildId: null,
      exaltedBuildId: null,
      archwingBuildId: null,
      archgunBuildId: null,
      archmeleeBuildId: null,
      companionBuildId: null,
      companionWeaponBuildId: null,
      necramechBuildId: null,
      parazonBuildId: null,
    },
    buildSummaries: {},
    focusSchool: null,
    isPublic: false,
    isSaving: false,
    isLoading: false,
    userBuilds: [],
  };
}

export const useLoadoutStore = create<LoadoutState & LoadoutActions>()((set, get) => ({
  ...createInitialState(),

  setName: (name) => set({ name }),
  setDescription: (description) => set({ description }),
  setFocusSchool: (school) => set({ focusSchool: school }),

  setSlot: (slot, buildId) =>
    set((state) => {
      const slots = { ...state.slots, [slot]: buildId };
      // Update summary
      const buildSummaries = { ...state.buildSummaries };
      if (buildId) {
        const build = state.userBuilds.find(b => b.id === buildId);
        if (build) buildSummaries[slot] = build;
      } else {
        delete buildSummaries[slot];
      }
      return { slots, buildSummaries };
    }),

  clearSlot: (slot) =>
    set((state) => {
      const slots = { ...state.slots, [slot]: null };
      const buildSummaries = { ...state.buildSummaries };
      delete buildSummaries[slot];
      return { slots, buildSummaries };
    }),

  setPublic: (isPublic) => set({ isPublic }),

  loadUserBuilds: async (userId) => {
    const { data, error } = await supabase
      .from('builds')
      .select('id, name, item_category, item_unique_name')
      .eq('user_id', userId)
      .order('updated_at', { ascending: false });

    if (error) {
      console.error('Failed to load builds:', error);
      return;
    }

    const userBuilds: LoadoutBuildSummary[] = (data ?? []).map(b => ({
      id: b.id,
      name: b.name,
      itemCategory: b.item_category,
      itemUniqueName: b.item_unique_name,
    }));

    set({ userBuilds });
  },

  loadLoadout: async (loadoutId) => {
    set({ isLoading: true });

    const { data, error } = await supabase
      .from('loadouts')
      .select('*')
      .eq('id', loadoutId)
      .single();

    if (error || !data) {
      console.error('Failed to load loadout:', error);
      set({ isLoading: false });
      return;
    }

    set({
      id: data.id,
      name: data.name,
      description: data.description ?? '',
      slots: {
        warframeBuildId: data.warframe_build_id,
        primaryBuildId: data.primary_build_id,
        secondaryBuildId: data.secondary_build_id,
        meleeBuildId: data.melee_build_id,
        exaltedBuildId: data.exalted_build_id,
        archwingBuildId: data.archwing_build_id ?? null,
        archgunBuildId: data.archgun_build_id ?? null,
        archmeleeBuildId: data.archmelee_build_id ?? null,
        companionBuildId: data.companion_build_id ?? null,
        companionWeaponBuildId: data.companion_weapon_build_id ?? null,
        necramechBuildId: data.necramech_build_id ?? null,
        parazonBuildId: data.parazon_build_id ?? null,
      },
      focusSchool: data.focus_school,
      isPublic: data.is_public,
      isLoading: false,
    });
  },

  saveLoadout: async (userId) => {
    const state = get();
    if (!state.name.trim()) return null;

    set({ isSaving: true });

    const loadoutData = {
      user_id: userId,
      name: state.name,
      description: state.description || null,
      warframe_build_id: state.slots.warframeBuildId,
      primary_build_id: state.slots.primaryBuildId,
      secondary_build_id: state.slots.secondaryBuildId,
      melee_build_id: state.slots.meleeBuildId,
      exalted_build_id: state.slots.exaltedBuildId,
      archwing_build_id: state.slots.archwingBuildId,
      archgun_build_id: state.slots.archgunBuildId,
      archmelee_build_id: state.slots.archmeleeBuildId,
      companion_build_id: state.slots.companionBuildId,
      companion_weapon_build_id: state.slots.companionWeaponBuildId,
      necramech_build_id: state.slots.necramechBuildId,
      parazon_build_id: state.slots.parazonBuildId,
      focus_school: state.focusSchool,
      is_public: state.isPublic,
    };

    let result;
    if (state.id) {
      // Update existing
      result = await supabase
        .from('loadouts')
        .update(loadoutData)
        .eq('id', state.id)
        .select('id')
        .single();
    } else {
      // Insert new
      result = await supabase
        .from('loadouts')
        .insert(loadoutData)
        .select('id')
        .single();
    }

    set({ isSaving: false });

    if (result.error) {
      console.error('Failed to save loadout:', result.error);
      return null;
    }

    const id = result.data?.id ?? null;
    if (id) set({ id });
    return id;
  },

  resetLoadout: () => set(createInitialState()),
}));
