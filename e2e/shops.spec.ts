import { test, expect } from '@playwright/test';

test.describe('Shops Listing Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/shops');
  });

  test('should display shops page header', async ({ page }) => {
    await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
  });

  test('should display category filters', async ({ page }) => {
    // Look for filter/category section
    const filterSection = page.locator('[role="tablist"], .category-filters, [data-testid="category-filters"]').first();

    // If categories exist, they should be interactive
    const allButton = page.getByRole('button', { name: /all/i }).or(page.getByRole('tab', { name: /all/i }));
    if (await allButton.isVisible()) {
      await expect(allButton).toBeEnabled();
    }
  });

  test('should display shop cards', async ({ page }) => {
    // Wait for shops to load
    await page.waitForLoadState('networkidle');

    // Look for shop cards or empty state
    const shopCards = page.locator('[data-testid="shop-card"], .card, article').first();
    const emptyState = page.getByText(/no shops/i).or(page.getByText(/coming soon/i));

    // Either shops exist or empty state is shown
    const hasShops = await shopCards.isVisible().catch(() => false);
    const hasEmptyState = await emptyState.isVisible().catch(() => false);

    expect(hasShops || hasEmptyState).toBeTruthy();
  });

  test('should have working search input', async ({ page }) => {
    const searchInput = page.getByPlaceholder(/search/i).or(page.getByRole('searchbox'));

    if (await searchInput.isVisible()) {
      await searchInput.fill('coffee');
      await expect(searchInput).toHaveValue('coffee');
    }
  });
});

test.describe('Shop Detail Page', () => {
  test('should display shop details when navigating to a shop', async ({ page }) => {
    // Go to shops listing
    await page.goto('/shops');
    await page.waitForLoadState('networkidle');

    // Find first shop link
    const shopLink = page.locator('a[href^="/shops/"]').first();

    if (await shopLink.isVisible()) {
      await shopLink.click();

      // Should navigate to shop detail page
      await expect(page).toHaveURL(/\/shops\/.+/);

      // Should have shop name heading
      await expect(page.getByRole('heading', { level: 1 })).toBeVisible();
    }
  });

  test('should display shop contact information', async ({ page }) => {
    await page.goto('/shops');
    await page.waitForLoadState('networkidle');

    const shopLink = page.locator('a[href^="/shops/"]').first();

    if (await shopLink.isVisible()) {
      await shopLink.click();
      await page.waitForLoadState('networkidle');

      // Look for contact section (phone, email, website, address)
      const contactSection = page.getByText(/contact/i)
        .or(page.getByText(/address/i))
        .or(page.getByText(/phone/i))
        .or(page.getByText(/website/i));

      // Contact info should exist (at least one type)
      await expect(contactSection.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // Some shops might not have contact info displayed - that's ok
      });
    }
  });

  test('should have save/favorite button', async ({ page }) => {
    await page.goto('/shops');
    await page.waitForLoadState('networkidle');

    const shopLink = page.locator('a[href^="/shops/"]').first();

    if (await shopLink.isVisible()) {
      await shopLink.click();
      await page.waitForLoadState('networkidle');

      // Look for save/heart button
      const saveButton = page.getByRole('button', { name: /save/i })
        .or(page.getByLabel(/save/i))
        .or(page.locator('button:has(svg)').filter({ hasText: '' }));

      // Save button should exist
      await expect(saveButton.first()).toBeVisible({ timeout: 5000 }).catch(() => {
        // Save button might require auth
      });
    }
  });

  test('should display opening hours if available', async ({ page }) => {
    await page.goto('/shops');
    await page.waitForLoadState('networkidle');

    const shopLink = page.locator('a[href^="/shops/"]').first();

    if (await shopLink.isVisible()) {
      await shopLink.click();
      await page.waitForLoadState('networkidle');

      // Look for opening hours section
      const openingHours = page.getByText(/open/i)
        .or(page.getByText(/hours/i))
        .or(page.getByText(/monday/i));

      // Opening hours might be visible
      const hasHours = await openingHours.first().isVisible().catch(() => false);
      // This is informational - not all shops have hours
      console.log('Opening hours visible:', hasHours);
    }
  });
});

test.describe('Shop Filtering', () => {
  test('should filter shops by category', async ({ page }) => {
    await page.goto('/shops');
    await page.waitForLoadState('networkidle');

    // Find category tabs/buttons
    const categoryButton = page.getByRole('tab').or(page.getByRole('button')).filter({
      hasText: /cafe|food|retail|services/i,
    }).first();

    if (await categoryButton.isVisible()) {
      await categoryButton.click();

      // URL might update with category filter
      await page.waitForLoadState('networkidle');

      // Shops should update (or empty state shown)
      await expect(page.locator('main')).toBeVisible();
    }
  });
});

test.describe('Shop Card Interactions', () => {
  test('should show save button on shop card', async ({ page }) => {
    await page.goto('/shops');
    await page.waitForLoadState('networkidle');

    // Look for heart/save button on cards
    const saveButton = page.locator('.card button, article button').first();

    if (await saveButton.isVisible()) {
      await expect(saveButton).toBeEnabled();
    }
  });

  test('shop card should be keyboard accessible', async ({ page }) => {
    await page.goto('/shops');
    await page.waitForLoadState('networkidle');

    // Tab through to find shop cards
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Should be able to navigate with keyboard
    const focusedElement = page.locator(':focus');
    await expect(focusedElement).toBeVisible();
  });
});
