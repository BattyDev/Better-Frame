import { test, expect, type ConsoleMessage, type Request, type Response } from '@playwright/test';

test.describe('Save build (warframe)', () => {
  test('clicking Save on a warframe build inserts into builds table', async ({ page }) => {
    const consoleErrors: string[] = [];
    page.on('console', (msg: ConsoleMessage) => {
      if (msg.type() === 'error') consoleErrors.push(msg.text());
    });

    const buildRequests: { req: Request; res: Response | null; body: string | null }[] = [];
    page.on('response', async (res) => {
      const url = res.url();
      if (url.includes('/rest/v1/builds')) {
        let body: string | null = null;
        try {
          body = await res.text();
        } catch {
          body = null;
        }
        buildRequests.push({ req: res.request(), res, body });
      }
    });

    await page.goto('/builder');

    // Ensure we got to the Builder page as an authenticated user.
    await expect(page.getByRole('heading', { name: /build editor/i })).toBeVisible();

    // Search for a specific warframe to make the click target predictable,
    // then click its tile. Each tile is a <button> containing an <img alt={name}>.
    await page.getByPlaceholder(/search warframes/i).fill('Excalibur');
    await page.locator('button:has(img[alt="Excalibur"])').first().click();

    // After selection, the selector swaps to a header — confirm it rendered.
    await expect(page.getByRole('heading', { name: /excalibur/i })).toBeVisible();

    // Save button only renders once a warframe is selected
    const saveButton = page.getByRole('button', { name: /^save$/i });
    await expect(saveButton).toBeVisible({ timeout: 10_000 });

    // Trigger save and capture the supabase request
    const [buildsResponse] = await Promise.all([
      page.waitForResponse(
        (r) => r.url().includes('/rest/v1/builds') && r.request().method() === 'POST',
        { timeout: 15_000 }
      ),
      saveButton.click(),
    ]);

    const status = buildsResponse.status();
    const body = await buildsResponse.text().catch(() => '');

    // Attach diagnostics so a failing run tells us exactly what Supabase said.
    // eslint-disable-next-line no-console
    console.log('[save-build] POST /rest/v1/builds status=', status, 'body=', body);
    if (consoleErrors.length) {
      // eslint-disable-next-line no-console
      console.log('[save-build] console errors:\n' + consoleErrors.join('\n'));
    }

    expect(
      status,
      `Supabase returned ${status}. Body: ${body}. Console: ${consoleErrors.join(' | ')}`
    ).toBe(201);
  });
});
