import {
  createClient,
  type SupabaseClient,
  type SupportedStorage,
} from '@supabase/supabase-js';

export interface SupabaseClientConfig {
  url: string;
  anonKey: string;
  storage?: SupportedStorage;
  storageKey?: string;
}

export function createSupabaseClient({
  url,
  anonKey,
  storage,
  storageKey,
}: SupabaseClientConfig): SupabaseClient {
  if (!url || !anonKey) {
    console.warn(
      'Supabase credentials not found. Set VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in your .env file.'
    );
  }

  return createClient(
    url || 'https://placeholder.supabase.co',
    anonKey || 'placeholder-key',
    storage ? { auth: { storage, storageKey } } : undefined
  );
}
