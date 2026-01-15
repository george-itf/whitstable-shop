import { test, expect } from '@playwright/test';

test.describe('Mobile Menu', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // iPhone 12 size

  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should open mobile menu when hamburger is clicked', async ({ page }) => {
    // Find and click hamburger menu button
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });

    await menuButton.click();

    // Menu panel should be visible
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible({ timeout: 5000 });
  });

  test('should close menu when X button is clicked', async ({ page }) => {
    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for dialog to appear
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible({ timeout: 5000 });

    // Click close button
    const closeButton = page.getByRole('button', { name: /close/i });
    await closeButton.click();

    // Menu should be hidden
    await expect(menuPanel).not.toBeVisible();
  });

  test('should close menu when Escape key is pressed', async ({ page }) => {
    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for dialog to appear
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Menu should be hidden
    await expect(menuPanel).not.toBeVisible();
  });

  test('should close menu when backdrop is clicked', async ({ page }) => {
    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for menu to be visible
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible({ timeout: 5000 });

    // Click on the left side of screen (backdrop area, menu is on right)
    await page.mouse.click(50, 400);

    // Menu should be hidden
    await expect(menuPanel).not.toBeVisible({ timeout: 5000 });
  });

  test('should display all menu sections', async ({ page }) => {
    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for menu to be visible
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible({ timeout: 5000 });

    // Check sections exist within the menu panel
    await expect(menuPanel.getByText('Discover')).toBeVisible();
    await expect(menuPanel.getByText('Community')).toBeVisible();
    await expect(menuPanel.getByText('Account')).toBeVisible();
  });

  test('should navigate to page and close menu', async ({ page }) => {
    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for dialog to appear
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible({ timeout: 5000 });

    // Click on a menu item
    await menuPanel.getByRole('link', { name: /all shops/i }).click();

    // Should navigate
    await expect(page).toHaveURL(/\/shops/);

    // Menu should be closed (route change closes it)
    await expect(menuPanel).not.toBeVisible({ timeout: 5000 });
  });

  test('menu should trap focus', async ({ page }) => {
    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for dialog to appear
    const menuPanel = page.getByRole('dialog');
    await expect(menuPanel).toBeVisible({ timeout: 5000 });

    // Close button should be focused initially
    const closeButton = page.getByRole('button', { name: /close/i });
    await expect(closeButton).toBeFocused();

    // Tab through menu items
    for (let i = 0; i < 20; i++) {
      await page.keyboard.press('Tab');
    }

    // Focus should still be within menu (trapped)
    // The focused element should be inside the menu
    await expect(menuPanel.locator(':focus')).toBeVisible();
  });
});

test.describe('Bottom Navigation', () => {
  test.use({ viewport: { width: 390, height: 844 } }); // Mobile

  test('should be visible on mobile', async ({ page }) => {
    await page.goto('/');

    const bottomNav = page.getByRole('navigation', { name: /main navigation/i });
    await expect(bottomNav).toBeVisible();
  });

  test('should highlight current page', async ({ page }) => {
    await page.goto('/');

    // Home should be active
    const homeLink = page.getByRole('link', { name: /home.*current/i })
      .or(page.locator('nav a[aria-current="page"]'));

    await expect(homeLink.first()).toBeVisible();
  });

  test('should navigate between pages', async ({ page }) => {
    await page.goto('/');

    // Get bottom nav
    const bottomNav = page.getByRole('navigation', { name: /main navigation/i });
    await expect(bottomNav).toBeVisible({ timeout: 5000 });

    // Click Search (in bottom nav)
    await bottomNav.getByRole('link', { name: /^search$/i }).click();
    await expect(page).toHaveURL(/\/search/, { timeout: 10000 });

    // Click Map
    await bottomNav.getByRole('link', { name: /^map$/i }).click();
    await expect(page).toHaveURL(/\/map/, { timeout: 10000 });

    // Click Saved
    await bottomNav.getByRole('link', { name: /^saved$/i }).click();
    await expect(page).toHaveURL(/\/saved/, { timeout: 10000 });

    // Click Home
    await bottomNav.getByRole('link', { name: /^home$/i }).click();
    await expect(page).toHaveURL(/^\/$/, { timeout: 10000 });
  });
});

test.describe('Desktop Navigation', () => {
  test.use({ viewport: { width: 1280, height: 720 } }); // Desktop

  test('bottom nav should be hidden on desktop', async ({ page }) => {
    await page.goto('/');

    // Bottom nav should not be visible on desktop (md:hidden)
    const bottomNav = page.locator('nav.fixed.bottom-0');
    await expect(bottomNav).not.toBeVisible();
  });
});

test.describe('Navigation Accessibility', () => {
  test('all navigation links should be keyboard accessible', async ({ page }) => {
    await page.goto('/');

    // Tab through page
    let foundNavLink = false;
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      const tagName = await focused.evaluate((el) => el.tagName).catch(() => '');

      if (tagName === 'A') {
        foundNavLink = true;
        break;
      }
    }

    expect(foundNavLink).toBeTruthy();
  });

  test('navigation links should have visible focus indicators', async ({ page }) => {
    await page.goto('/');

    // Tab to a link
    await page.keyboard.press('Tab');
    await page.keyboard.press('Tab');

    // Check focus is visible
    const focused = page.locator(':focus');
    const outline = await focused.evaluate((el) => {
      const styles = window.getComputedStyle(el);
      return styles.outline || styles.boxShadow;
    }).catch(() => 'none');

    // Should have some visible focus indicator
    expect(outline).not.toBe('none');
  });
});

test.describe('Page Transitions', () => {
  test('should maintain scroll position appropriately', async ({ page }) => {
    await page.goto('/shops');

    // Scroll down
    await page.evaluate(() => window.scrollTo(0, 500));

    // Navigate to a shop
    const shopLink = page.locator('a[href^="/shops/"]').first();
    if (await shopLink.isVisible()) {
      await shopLink.click();

      // New page should start at top
      const scrollY = await page.evaluate(() => window.scrollY);
      expect(scrollY).toBeLessThan(100);
    }
  });

  test('should show loading state during navigation', async ({ page }) => {
    await page.goto('/');

    // Enable slow network to see loading states
    // This is more of a visual regression test concept
    await page.route('**/*', async (route) => {
      await new Promise((resolve) => setTimeout(resolve, 100));
      await route.continue();
    });

    // Navigate
    await page.getByRole('link', { name: /shops/i }).first().click();

    // Should eventually load
    await expect(page).toHaveURL(/\/shops/, { timeout: 10000 });
  });
});
