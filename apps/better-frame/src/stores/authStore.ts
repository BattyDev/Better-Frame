import { create } from 'zustand';
import type { User, Session } from '@supabase/supabase-js';
import { supabase } from '../lib/supabase';
import type { UserProfile } from '../types';

function getSiteBaseUrl(): string | undefined {
  const configuredSiteUrl = import.meta.env.VITE_SITE_URL as string | undefined;
  const baseUrl = configuredSiteUrl || (typeof window !== 'undefined' ? window.location.origin : undefined);

  if (!baseUrl) return undefined;

  return baseUrl.endsWith('/') ? baseUrl.slice(0, -1) : baseUrl;
}

function getEmailRedirectTo(): string | undefined {
  const baseUrl = getSiteBaseUrl();
  return baseUrl ? `${baseUrl}/login` : undefined;
}

function getOAuthRedirectTo(): string | undefined {
  const baseUrl = getSiteBaseUrl();
  return baseUrl ? `${baseUrl}/auth/callback` : undefined;
}

export type OAuthProvider = 'google' | 'discord' | 'apple';

interface AuthState {
  user: User | null;
  session: Session | null;
  profile: UserProfile | null;
  loading: boolean;
  initialized: boolean;
  signUp: (email: string, password: string, username: string) => Promise<{ error: string | null }>;
  signIn: (email: string, password: string) => Promise<{ error: string | null }>;
  signInWithOAuth: (provider: OAuthProvider) => Promise<{ error: string | null }>;
  signOut: () => Promise<void>;
  resendConfirmation: (email: string) => Promise<{ error: string | null }>;
  updateProfile: (updates: { username?: string }) => Promise<{ error: string | null }>;
  initialize: () => Promise<void>;
}

export const useAuthStore = create<AuthState>((set, get) => ({
  user: null,
  session: null,
  profile: null,
  loading: false,
  initialized: false,

  initialize: async () => {
    try {
      const { data: { session } } = await supabase.auth.getSession();

      if (session?.user) {
        const { data: profile } = await supabase
          .from('profiles')
          .select('*')
          .eq('id', session.user.id)
          .single();

        set({
          user: session.user,
          session,
          profile: profile as UserProfile | null,
          initialized: true,
        });
      } else {
        set({ initialized: true });
      }

      supabase.auth.onAuthStateChange(async (_event, session) => {
        if (session?.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', session.user.id)
            .single();

          set({
            user: session.user,
            session,
            profile: profile as UserProfile | null,
          });
        } else {
          set({ user: null, session: null, profile: null });
        }
      });
    } catch {
      set({ initialized: true });
    }
  },

  signUp: async (email: string, password: string, username: string) => {
    set({ loading: true });
    const emailRedirectTo = getEmailRedirectTo();

    const { error } = await supabase.auth.signUp({
      email,
      password,
      options: {
        data: { username },
        emailRedirectTo,
      },
    });

    if (error) {
      set({ loading: false });
      return { error: error.message };
    }

    set({ loading: false });
    return { error: null };
  },

  signIn: async (email: string, password: string) => {
    set({ loading: true });
    const { error } = await supabase.auth.signInWithPassword({ email, password });
    set({ loading: false });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  signInWithOAuth: async (provider) => {
    const redirectTo = getOAuthRedirectTo();
    const { error } = await supabase.auth.signInWithOAuth({
      provider,
      options: redirectTo ? { redirectTo } : undefined,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  signOut: async () => {
    await supabase.auth.signOut();
    set({ user: null, session: null, profile: null });
  },

  resendConfirmation: async (email: string) => {
    const { error } = await supabase.auth.resend({
      type: 'signup',
      email,
    });

    if (error) {
      return { error: error.message };
    }

    return { error: null };
  },

  updateProfile: async (updates: { username?: string }): Promise<{ error: string | null }> => {
    const state = get();
    if (!state.user) {
      return { error: 'Not authenticated' };
    }

    const { data, error: dbError } = await supabase
      .from('profiles')
      .upsert({ id: state.user.id, ...updates })
      .select()
      .single();

    if (dbError) {
      return { error: dbError.message };
    }

    if (!data) {
      return { error: 'Failed to update profile' };
    }

    set({
      profile: {
        id: data.id,
        username: data.username,
        avatarUrl: data.avatar_url,
        isPremium: data.is_premium,
        role: data.role,
        createdAt: data.created_at,
        updatedAt: data.updated_at,
      },
    });

    return { error: null };
  },
}));
