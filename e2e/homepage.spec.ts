import { test, expect } from '@playwright/test';

test.describe('Homepage', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display the hero section with greeting', async ({ page }) => {
    // Check hero is visible
    const hero = page.locator('.bg-sky').first();
    await expect(hero).toBeVisible();

    // Check logo
    await expect(page.getByRole('link', { name: /whitstable\.shop/i })).toBeVisible();

    // Check tide widget
    await expect(page.getByText(/the tide's/i)).toBeVisible();
  });

  test('should display hub buttons', async ({ page }) => {
    // Check all 6 hub buttons are present (matching actual labels)
    const hubButtons = [
      /map/i,        // "town map"
      /what's on/i,  // "what's on" (events)
      /shops/i,      // "browse shops"
      /info/i,       // "local info"
      /deals/i,      // "deals"
      /ask/i,        // "ask a local"
    ];

    for (const buttonPattern of hubButtons) {
      await expect(page.getByRole('link', { name: buttonPattern })).toBeVisible();
    }
  });

  test('should have working skip link for accessibility', async ({ page }) => {
    // Tab to skip link
    await page.keyboard.press('Tab');

    // Skip link should be visible when focused
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();

    // Click skip link
    await skipLink.click();

    // Main content should now be focused
    const main = page.locator('#main-content');
    await expect(main).toBeFocused();
  });

  test('should display bottom navigation on mobile', async ({ page, isMobile }) => {
    test.skip(!isMobile, 'This test is for mobile only');

    const bottomNav = page.getByRole('navigation', { name: /main navigation/i });
    await expect(bottomNav).toBeVisible();

    // Check nav items
    await expect(page.getByRole('link', { name: /home/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /search/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /map/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /saved/i })).toBeVisible();
  });

  test('should have correct meta title', async ({ page }) => {
    await expect(page).toHaveTitle(/whitstable\.shop/i);
  });

  test('should navigate to shops page from hub button', async ({ page }) => {
    await page.getByRole('link', { name: /shops/i }).first().click();
    await expect(page).toHaveURL(/\/shops/);
  });

  test('should navigate to events page from hub button', async ({ page }) => {
    await page.getByRole('link', { name: /what's on/i }).first().click();
    await expect(page).toHaveURL(/\/events/);
  });

  test('should navigate to map page from hub button', async ({ page }) => {
    await page.getByRole('link', { name: /map/i }).first().click();
    await expect(page).toHaveURL(/\/map/);
  });
});

test.describe('Homepage Performance', () => {
  test('should load within acceptable time', async ({ page }) => {
    const startTime = Date.now();
    await page.goto('/');
    await page.waitForLoadState('domcontentloaded');
    const loadTime = Date.now() - startTime;

    // Should load in under 3 seconds
    expect(loadTime).toBeLessThan(3000);
  });

  test('should have no console errors', async ({ page }) => {
    const errors: string[] = [];
    page.on('console', (msg) => {
      if (msg.type() === 'error') {
        errors.push(msg.text());
      }
    });

    await page.goto('/');
    await page.waitForLoadState('networkidle');

    // Filter out known acceptable errors (like missing env vars in dev, Supabase config)
    const criticalErrors = errors.filter(
      (e) => !e.includes('NEXT_PUBLIC') &&
             !e.includes('Mapbox') &&
             !e.includes('supabase') &&
             !e.includes('Supabase') &&
             !e.includes('Failed to fetch') &&
             !e.includes('trending') &&
             !e.includes('events')
    );

    expect(criticalErrors).toHaveLength(0);
  });
});
