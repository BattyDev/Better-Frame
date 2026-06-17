import { createAuthStore } from '@better-frame/auth';
import { supabase } from '../lib/supabase';

export const useAuthStore = createAuthStore({
  supabase,
  siteUrl: import.meta.env.VITE_SITE_URL as string | undefined,
});
