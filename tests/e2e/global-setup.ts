import { chromium, type FullConfig } from '@playwright/test';
import { config as loadEnv } from 'dotenv';
import path from 'node:path';
import fs from 'node:fs';

loadEnv({ path: path.resolve(process.cwd(), '.env.test') });

const STORAGE_STATE = path.resolve('tests/e2e/.auth/user.json');
const BASE_URL = 'http://localhost:5173';

export default async function globalSetup(_config: FullConfig) {
  const email = process.env.E2E_TEST_EMAIL;
  const password = process.env.E2E_TEST_PASSWORD;
  const username = process.env.E2E_TEST_USERNAME;

  if (!email || !password || !username) {
    throw new Error(
      'Missing E2E_TEST_EMAIL / E2E_TEST_PASSWORD / E2E_TEST_USERNAME in .env.test'
    );
  }

  fs.mkdirSync(path.dirname(STORAGE_STATE), { recursive: true });

  const browser = await chromium.launch();
  const context = await browser.newContext();
  const page = await context.newPage();

  // Try sign-in first
  await page.goto(`${BASE_URL}/login`);
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  await page.click('button[type="submit"]');

  const signedIn = await page
    .waitForURL('**/profile', { timeout: 8_000 })
    .then(() => true)
    .catch(() => false);

  if (signedIn) {
    await context.storageState({ path: STORAGE_STATE });
    await browser.close();
    // eslint-disable-next-line no-console
    console.log('[e2e] signed in as existing user');
    return;
  }

  // Sign-in failed. Try sign-up.
  // eslint-disable-next-line no-console
  console.log('[e2e] sign-in failed, attempting sign-up…');
  await page.goto(`${BASE_URL}/signup`);
  await page.fill('input#username', username);
  await page.fill('input#email', email);
  await page.fill('input#password', password);
  await page.click('button[type="submit"]');

  // Either we see "Check your email" (confirmation required) or we auto-login.
  const confirmationShown = await page
    .getByText(/check your email/i)
    .waitFor({ timeout: 8_000 })
    .then(() => true)
    .catch(() => false);

  if (confirmationShown) {
    await browser.close();
    throw new Error(
      `[e2e] Signed up ${email}. Supabase requires email confirmation — ` +
        `click the link in your inbox, then re-run the tests. ` +
        `Subsequent runs will reuse the account.`
    );
  }

  // Auto-login path — confirm we landed on /profile
  await page.waitForURL('**/profile', { timeout: 8_000 }).catch(() => {
    throw new Error(
      '[e2e] Sign-up submitted but did not land on /profile and no confirmation message shown. Check Supabase auth settings.'
    );
  });

  await context.storageState({ path: STORAGE_STATE });
  await browser.close();
  // eslint-disable-next-line no-console
  console.log('[e2e] signed up and logged in');
}
