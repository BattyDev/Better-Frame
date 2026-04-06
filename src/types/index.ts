// Core domain types for Tenno Trove

export interface UserProfile {
  id: string;
  username: string;
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
  slotPolarities?: (Polarity | null)[];
  auraPolarity?: Polarity | null;
  exilusPolarity?: Polarity | null;
  formaCount: number;
  hasReactor: boolean;
  helminthAbility?: { source: string; ability: string } | null;
  // Weapon-specific fields (stance, catalyst, etc.)
  stance?: SlottedMod | null;
  stancePolarity?: string | null;
  hasCatalyst?: boolean;
  bonusElement?: string | null;
  bonusElementValue?: number;
  comboDuration?: number;
  heavyAttack?: number;
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
  // Phase 4 slots
  archwingBuildId: string | null;
  archgunBuildId: string | null;
  archmeleeBuildId: string | null;
  companionBuildId: string | null;
  companionWeaponBuildId: string | null;
  necramechBuildId: string | null;
  parazonBuildId: string | null;
  kdriveBuildId: string | null;
  focusSchool: FocusSchool | null;
  isPublic: boolean;
  voteScore: number;
  viewCount: number;
  gameVersion: string | null;
  createdAt: string;
  updatedAt: string;
}

export type ItemCategory =
  | 'Warframe'
  | 'Primary'
  | 'Secondary'
  | 'Melee'
  | 'Archwing'
  | 'Archgun'
  | 'Archmelee'
  | 'Companion'
  | 'CompanionWeapon'
  | 'Necramech'
  | 'Parazon'
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

// --- Phase 3: Social ---

export interface PublicBuildSummary {
  id: string;
  name: string;
  description: string | null;
  itemUniqueName: string;
  itemCategory: ItemCategory;
  isPublic: boolean;
  voteScore: number;
  viewCount: number;
  gameVersion: string | null;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
}

export interface PublicBuild extends PublicBuildSummary {
  config: BuildConfig;
}

export interface PublicLoadoutSummary {
  id: string;
  name: string;
  description: string | null;
  focusSchool: FocusSchool | null;
  isPublic: boolean;
  voteScore: number;
  viewCount: number;
  gameVersion: string | null;
  filledSlots: string[];
  slotCount: number;
  createdAt: string;
  updatedAt: string;
  author: { id: string; username: string };
}

export interface Vote {
  userId: string;
  targetId: string;
  targetType: 'build' | 'loadout';
  value: 1 | -1;
}

export interface Comment {
  id: string;
  userId: string;
  targetId: string;
  targetType: 'build' | 'loadout';
  parentCommentId: string | null;
  body: string;
  isHidden: boolean;
  createdAt: string;
  updatedAt: string;
  author: {
    id: string;
    username: string;
  };
  replies?: Comment[];
}

export type ReportReason =
  | 'incorrect_stats'
  | 'outdated'
  | 'spam'
  | 'inappropriate'
  | 'other';

export interface Report {
  id: string;
  reporterId: string;
  targetType: 'build' | 'loadout' | 'comment';
  targetId: string;
  reason: ReportReason;
  notes: string | null;
  status: 'pending' | 'reviewed' | 'dismissed';
  createdAt: string;
}
