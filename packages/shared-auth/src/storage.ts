import type { SupportedStorage } from '@supabase/supabase-js';

// Cookie-backed Supabase session storage for cross-subdomain SSO.
// Pass the apex domain with a leading dot, e.g. '.tennotrove.com'.
// In local dev, browsers don't share cookies across ports on localhost;
// use a hostname like tennotrove.local via a hosts entry to test SSO.
export function createCookieStorage(domain: string): SupportedStorage {
  return {
    getItem(key) {
      if (typeof document === 'undefined') return null;
      const match = document.cookie.match(
        new RegExp(`(?:^|;\\s*)${key}=([^;]*)`)
      );
      return match ? decodeURIComponent(match[1]) : null;
    },
    setItem(key, value) {
      if (typeof document === 'undefined') return;
      document.cookie = `${key}=${encodeURIComponent(value)}; domain=${domain}; path=/; secure; samesite=lax; max-age=31536000`;
    },
    removeItem(key) {
      if (typeof document === 'undefined') return;
      document.cookie = `${key}=; domain=${domain}; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    },
  };
}
