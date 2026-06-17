export interface UserProfile {
  id: string;
  username: string;
  avatarUrl: string | null;
  isPremium: boolean;
  role: 'user' | 'moderator' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export type OAuthProvider = 'google' | 'discord' | 'apple';
