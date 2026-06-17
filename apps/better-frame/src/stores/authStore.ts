import { createAuthStore, type OAuthProvider } from '@better-frame/auth';
import { supabase } from '../lib/supabase';

export type { OAuthProvider };

export const useAuthStore = createAuthStore({
  supabase,
  siteUrl: import.meta.env.VITE_SITE_URL as string | undefined,
});
