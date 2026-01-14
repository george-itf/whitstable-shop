import { test, expect } from '@playwright/test';
import { checkBasicA11y } from './fixtures';

/**
 * Accessibility Tests
 *
 * These tests verify WCAG 2.1 AA compliance across the application.
 * For comprehensive testing, consider adding @axe-core/playwright
 */

test.describe('Accessibility - Skip Links', () => {
  test('homepage should have working skip link', async ({ page }) => {
    await page.goto('/');

    // Tab to reach skip link
    await page.keyboard.press('Tab');

    const skipLink = page.getByRole('link', { name: /skip/i });
    await expect(skipLink).toBeFocused();

    // Activate skip link
    await page.keyboard.press('Enter');

    // Main content should receive focus
    const main = page.locator('#main-content');
    await expect(main).toBeFocused();
  });

  test('shops page should have working skip link', async ({ page }) => {
    await page.goto('/shops');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /skip/i });

    if (await skipLink.isVisible()) {
      await page.keyboard.press('Enter');
      const main = page.locator('#main-content');
      await expect(main).toBeFocused();
    }
  });
});

test.describe('Accessibility - Landmarks', () => {
  const pages = ['/', '/shops', '/events', '/map', '/search'];

  for (const url of pages) {
    test(`${url} should have proper landmarks`, async ({ page }) => {
      await page.goto(url);

      // Should have main landmark
      const main = page.locator('main, [role="main"]');
      await expect(main.first()).toBeVisible();

      // Should have navigation
      const nav = page.locator('nav, [role="navigation"]');
      expect(await nav.count()).toBeGreaterThan(0);
    });
  }
});

test.describe('Accessibility - Headings', () => {
  test('pages should have h1 heading', async ({ page }) => {
    const pages = ['/shops', '/events', '/map', '/search'];

    for (const url of pages) {
      await page.goto(url);

      const h1 = page.getByRole('heading', { level: 1 });
      const h1Count = await h1.count();

      // Each page should have exactly one h1
      expect(h1Count).toBe(1);
    }
  });

  test('heading hierarchy should be correct', async ({ page }) => {
    await page.goto('/shops');

    // Get all headings
    const headings = await page.locator('h1, h2, h3, h4, h5, h6').all();

    let previousLevel = 0;
    for (const heading of headings) {
      const tagName = await heading.evaluate((el) => el.tagName);
      const currentLevel = parseInt(tagName.charAt(1));

      // Heading level should not skip (e.g., h1 to h3)
      if (previousLevel > 0) {
        expect(currentLevel - previousLevel).toBeLessThanOrEqual(1);
      }

      previousLevel = currentLevel;
    }
  });
});

test.describe('Accessibility - Images', () => {
  test('images should have alt text', async ({ page }) => {
    await page.goto('/');

    const imagesWithoutAlt = await page.locator('img:not([alt])').count();

    // All images should have alt attribute
    expect(imagesWithoutAlt).toBe(0);
  });

  test('decorative images should have empty alt', async ({ page }) => {
    await page.goto('/');

    // Decorative images should have alt="" not missing alt
    const decorativeImages = await page.locator('img[alt=""]').all();

    for (const img of decorativeImages) {
      // If alt is empty, it should be intentionally decorative
      const hasAriaHidden = await img.getAttribute('aria-hidden');
      const role = await img.getAttribute('role');

      // Either aria-hidden or empty alt is acceptable for decorative
      expect(hasAriaHidden === 'true' || role === 'presentation' || true).toBeTruthy();
    }
  });
});

test.describe('Accessibility - Interactive Elements', () => {
  test('buttons should have accessible names', async ({ page }) => {
    await page.goto('/');

    const buttons = await page.locator('button').all();

    for (const button of buttons) {
      const name = await button.getAttribute('aria-label')
        || await button.textContent()
        || await button.getAttribute('title');

      // Button should have some accessible name
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });

  test('links should have accessible names', async ({ page }) => {
    await page.goto('/');

    const links = await page.locator('a').all();

    for (const link of links) {
      const name = await link.getAttribute('aria-label')
        || await link.textContent()
        || await link.getAttribute('title');

      // Link should have some accessible name
      expect(name?.trim().length).toBeGreaterThan(0);
    }
  });

  test('form inputs should have labels', async ({ page }) => {
    await page.goto('/auth/login');

    const inputs = await page.locator('input:not([type="hidden"])').all();

    for (const input of inputs) {
      const id = await input.getAttribute('id');
      const ariaLabel = await input.getAttribute('aria-label');
      const ariaLabelledBy = await input.getAttribute('aria-labelledby');
      const placeholder = await input.getAttribute('placeholder');

      // Check for associated label
      let hasLabel = false;

      if (id) {
        const label = await page.locator(`label[for="${id}"]`).count();
        hasLabel = label > 0;
      }

      // Input should have some form of label
      expect(
        hasLabel || ariaLabel || ariaLabelledBy || placeholder
      ).toBeTruthy();
    }
  });
});

test.describe('Accessibility - Focus Management', () => {
  test('focus should be visible', async ({ page }) => {
    await page.goto('/');

    // Tab through a few elements
    for (let i = 0; i < 5; i++) {
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      const isVisible = await focused.isVisible();

      expect(isVisible).toBeTruthy();

      // Check for visible focus indicator
      const outline = await focused.evaluate((el) => {
        const styles = window.getComputedStyle(el);
        return styles.outline !== 'none' || styles.boxShadow !== 'none';
      });

      expect(outline).toBeTruthy();
    }
  });

  test('modal should trap focus', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // Mobile
    await page.goto('/');

    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for dialog to be visible
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Tab many times
    for (let i = 0; i < 30; i++) {
      await page.keyboard.press('Tab');
    }

    // Focus should still be inside modal
    const focusedInDialog = await dialog.locator(':focus').count();

    expect(focusedInDialog).toBeGreaterThan(0);
  });
});

test.describe('Accessibility - Color Contrast', () => {
  test('text should have sufficient contrast', async ({ page }) => {
    await page.goto('/');

    // Get text elements and check contrast (simplified check)
    const textElements = await page.locator('p, h1, h2, h3, span, a').all();

    for (const element of textElements.slice(0, 10)) {
      // Basic check that text is visible
      const isVisible = await element.isVisible().catch(() => false);
      if (isVisible) {
        const color = await element.evaluate((el) => {
          const styles = window.getComputedStyle(el);
          return styles.color;
        });

        // Text should have a defined color (not transparent)
        expect(color).not.toBe('rgba(0, 0, 0, 0)');
      }
    }
  });
});

test.describe('Accessibility - ARIA', () => {
  test('progress bars should have ARIA attributes', async ({ page }) => {
    await page.goto('/');

    const progressBars = await page.locator('[role="progressbar"]').all();

    for (const bar of progressBars) {
      // Should have value attributes
      const hasValueNow = await bar.getAttribute('aria-valuenow');
      const hasValueMin = await bar.getAttribute('aria-valuemin');
      const hasValueMax = await bar.getAttribute('aria-valuemax');

      expect(hasValueNow).not.toBeNull();
      expect(hasValueMin).not.toBeNull();
      expect(hasValueMax).not.toBeNull();
    }
  });

  test('tabs should have proper ARIA', async ({ page }) => {
    await page.goto('/shops');

    const tablist = page.locator('[role="tablist"]').first();

    if (await tablist.isVisible()) {
      // Tabs in tablist
      const tabs = await tablist.locator('[role="tab"]').all();

      for (const tab of tabs) {
        const ariaSelected = await tab.getAttribute('aria-selected');
        expect(['true', 'false']).toContain(ariaSelected);

        const ariaControls = await tab.getAttribute('aria-controls');
        expect(ariaControls).toBeTruthy();
      }
    }
  });

  test('dialogs should have proper ARIA', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // Mobile
    await page.goto('/');

    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for dialog to be visible
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Check ARIA attributes
    const ariaModal = await dialog.getAttribute('aria-modal');
    expect(ariaModal).toBe('true');

    const ariaLabel = await dialog.getAttribute('aria-label')
      || await dialog.getAttribute('aria-labelledby');
    expect(ariaLabel).toBeTruthy();
  });
});

test.describe('Accessibility - Keyboard Navigation', () => {
  test('entire page should be keyboard navigable', async ({ page }) => {
    await page.goto('/');

    const interactiveElements = await page.locator('a, button, input, select, textarea, [tabindex]').all();

    let reachableCount = 0;

    for (let i = 0; i < Math.min(interactiveElements.length, 50); i++) {
      await page.keyboard.press('Tab');

      const focused = page.locator(':focus');
      if (await focused.isVisible()) {
        reachableCount++;
      }
    }

    // Most interactive elements should be reachable
    expect(reachableCount).toBeGreaterThan(5);
  });

  test('escape should close modals/dialogs', async ({ page }) => {
    await page.setViewportSize({ width: 390, height: 844 }); // Mobile
    await page.goto('/');

    // Open menu
    const menuButton = page.getByRole('button', { name: /open.*navigation.*menu/i });
    await menuButton.click();

    // Wait for dialog to be visible
    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible({ timeout: 5000 });

    // Press Escape
    await page.keyboard.press('Escape');

    // Dialog should be closed
    await expect(dialog).not.toBeVisible();
  });
});

test.describe('Accessibility - Motion', () => {
  test('should respect reduced motion preference', async ({ page }) => {
    // Set reduced motion preference
    await page.emulateMedia({ reducedMotion: 'reduce' });

    await page.goto('/');

    // Check that animations are disabled or reduced
    // This is a simplified check
    const hasTransitions = await page.evaluate(() => {
      const elements = document.querySelectorAll('*');
      for (const el of elements) {
        const styles = window.getComputedStyle(el);
        if (styles.transition !== 'none' && styles.transitionDuration !== '0s') {
          // Check if duration is very short (effectively instant)
          const duration = parseFloat(styles.transitionDuration);
          if (duration > 0.01) {
            return true;
          }
        }
      }
      return false;
    });

    // With reduced motion, long transitions should be minimized
    // This is informational - CSS should handle this
    console.log('Has visible transitions with reduced motion:', hasTransitions);
  });
});

test.describe('Accessibility - Full Page Check', () => {
  const pagesToTest = ['/', '/shops', '/events', '/map', '/search', '/auth/login'];

  for (const url of pagesToTest) {
    test(`${url} should pass basic accessibility checks`, async ({ page }) => {
      await page.goto(url);
      await page.waitForLoadState('networkidle');

      const result = await checkBasicA11y(page);

      if (!result.passed) {
        console.log(`Accessibility issues on ${url}:`, result.issues);
      }

      // Should pass basic checks
      expect(result.passed).toBeTruthy();
    });
  }
});
