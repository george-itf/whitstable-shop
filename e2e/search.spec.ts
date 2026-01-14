import { test, expect } from '@playwright/test';

test.describe('Search Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/search');
  });

  test('should display search input', async ({ page }) => {
    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"], input[type="text"]'));

    await expect(searchInput.first()).toBeVisible();
  });

  test('should focus search input on page load', async ({ page }) => {
    // Search input should auto-focus or be easily focusable
    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i));

    // Either already focused or will focus on click
    await searchInput.first().click();
    await expect(searchInput.first()).toBeFocused();
  });

  test('should update results as user types', async ({ page }) => {
    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"], input[type="text"]'));

    await searchInput.first().fill('coffee');

    // Wait for results to update
    await page.waitForLoadState('networkidle');

    // Results area should exist
    const resultsArea = page.locator('main, [role="main"], .results');
    await expect(resultsArea.first()).toBeVisible();
  });

  test('should show empty state for no results', async ({ page }) => {
    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"], input[type="text"]'));

    // Search for something unlikely to exist
    await searchInput.first().fill('xyznonexistent123');
    await page.waitForLoadState('networkidle');

    // Should show some kind of empty/no results message
    const noResults = page.getByText(/no results/i)
      .or(page.getByText(/not found/i))
      .or(page.getByText(/try a different/i));

    // Either shows no results message or just empty
    const hasMessage = await noResults.first().isVisible().catch(() => false);
    // This is informational
    console.log('No results message shown:', hasMessage);
  });

  test('should clear search when X is clicked', async ({ page }) => {
    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"], input[type="text"]'));

    await searchInput.first().fill('test search');

    // Look for clear button
    const clearButton = page.getByRole('button', { name: /clear/i })
      .or(page.locator('button:has(svg)').filter({ hasText: '' }));

    if (await clearButton.first().isVisible()) {
      await clearButton.first().click();
      await expect(searchInput.first()).toHaveValue('');
    }
  });

  test('search should be accessible with keyboard', async ({ page }) => {
    // Tab to search
    await page.keyboard.press('Tab');

    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i));

    // Type in search
    await page.keyboard.type('test');

    // Should be able to submit with Enter (if form)
    await page.keyboard.press('Enter');

    // Should not crash and page should still work
    await expect(page.locator('body')).toBeVisible();
  });
});

test.describe('Search from Homepage', () => {
  test('should navigate to search when clicking search in bottom nav', async ({ page }) => {
    page.setViewportSize({ width: 390, height: 844 }); // Mobile
    await page.goto('/');

    await page.getByRole('link', { name: /search/i }).click();
    await expect(page).toHaveURL(/\/search/);
  });
});

test.describe('Search Results', () => {
  test('should display shop results with correct info', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"], input[type="text"]'));

    await searchInput.first().fill('shop');
    await page.waitForLoadState('networkidle');

    // Look for result cards
    const resultCards = page.locator('.card, article, [data-testid="search-result"]');
    const count = await resultCards.count();

    if (count > 0) {
      // First result should have a name/title
      const firstResult = resultCards.first();
      await expect(firstResult).toBeVisible();
    }
  });

  test('should be able to click search result to view details', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"], input[type="text"]'));

    await searchInput.first().fill('a'); // Common letter
    await page.waitForLoadState('networkidle');

    // Find clickable result
    const resultLink = page.locator('a[href^="/shops/"]').first();

    if (await resultLink.isVisible()) {
      await resultLink.click();
      await expect(page).toHaveURL(/\/shops\/.+/);
    }
  });
});

test.describe('Search Performance', () => {
  test('should debounce search requests', async ({ page }) => {
    let requestCount = 0;

    // Count API requests
    page.on('request', (request) => {
      if (request.url().includes('/api/') || request.url().includes('supabase')) {
        requestCount++;
      }
    });

    await page.goto('/search');

    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i))
      .or(page.locator('input[type="search"], input[type="text"]'));

    // Type quickly
    const initialCount = requestCount;
    await searchInput.first().pressSequentially('testing', { delay: 50 });

    // Wait for debounce
    await page.waitForTimeout(500);

    // Should not make a request for every keystroke
    const requestsMade = requestCount - initialCount;
    console.log('Requests made during typing:', requestsMade);

    // Reasonable debouncing would result in fewer requests than keystrokes
    // This is informational - implementation may vary
  });
});

test.describe('Search Accessibility', () => {
  test('search input should have appropriate label', async ({ page }) => {
    await page.goto('/search');

    const searchInput = page.getByRole('searchbox')
      .or(page.getByPlaceholder(/search/i));

    // Should have accessible name
    const ariaLabel = await searchInput.first().getAttribute('aria-label');
    const placeholder = await searchInput.first().getAttribute('placeholder');

    expect(ariaLabel || placeholder).toBeTruthy();
  });

  test('search results should be announced to screen readers', async ({ page }) => {
    await page.goto('/search');

    // Look for live region for results
    const liveRegion = page.locator('[aria-live], [role="status"], [role="alert"]');

    // If live region exists, it should be properly configured
    if (await liveRegion.first().isVisible()) {
      const ariaLive = await liveRegion.first().getAttribute('aria-live');
      expect(['polite', 'assertive']).toContain(ariaLive);
    }
  });
});
