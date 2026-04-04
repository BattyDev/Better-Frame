// Core domain types for Better Frame

export interface UserProfile {
  id: string;
  username: string;
  displayName: string | null;
  avatarUrl: string | null;
  isPremium: boolean;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface SlottedMod {
  uniqueName: string;
  name: string;
  rank: number;
  slotIndex: number;
}

export interface BuildConfig {
  mods: (SlottedMod | null)[];
  aura: SlottedMod | null;
  exilus: SlottedMod | null;
  arcanes: [SlottedMod | null, SlottedMod | null];
  polarities: string[];
  formaCount: number;
  hasReactor: boolean;
}

export interface Build {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  itemUniqueName: string;
  itemCategory: ItemCategory;
  config: BuildConfig;
  isPublic: boolean;
  voteScore: number;
  viewCount: number;
  gameVersion: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

export interface Loadout {
  id: string;
  userId: string;
  name: string;
  description: string | null;
  warframeBuildId: string | null;
  primaryBuildId: string | null;
  secondaryBuildId: string | null;
  meleeBuildId: string | null;
  exaltedBuildId: string | null;
  focusSchool: FocusSchool | null;
  isPublic: boolean;
  voteScore: number;
  gameVersion: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ItemCategory =
  | 'Warframe'
  | 'Primary'
  | 'Secondary'
  | 'Melee'
  | 'Companion'
  | 'Archwing'
  | 'Archgun'
  | 'Archmelee'
  | 'Necramech'
  | 'KDrive';

export type FocusSchool =
  | 'Madurai'
  | 'Vazarin'
  | 'Naramon'
  | 'Zenurik'
  | 'Unairu';

export type Polarity =
  | 'madurai'
  | 'vazarin'
  | 'naramon'
  | 'zenurik'
  | 'unairu'
  | 'penjaga'
  | 'umbra'
  | 'aura';
