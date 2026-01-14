import { test as base, expect } from '@playwright/test';

/**
 * Custom test fixtures for Whitstable.shop E2E tests
 *
 * These fixtures provide reusable setup for common testing scenarios
 */

// Types for test data
interface TestShop {
  name: string;
  slug: string;
  category: string;
}

interface TestUser {
  email: string;
  password: string;
  name: string;
}

// Extend the base test with custom fixtures
export const test = base.extend<{
  // Add custom fixtures here
  testShop: TestShop;
  testUser: TestUser;
  authenticatedPage: typeof base;
}>({
  // Sample test shop data
  testShop: async ({}, use) => {
    await use({
      name: 'Test Coffee Shop',
      slug: 'test-coffee-shop',
      category: 'Cafe',
    });
  },

  // Sample test user data
  testUser: async ({}, use) => {
    await use({
      email: 'test@example.com',
      password: 'TestPassword123!',
      name: 'Test User',
    });
  },

  // Authenticated page fixture (for future use with real auth)
  authenticatedPage: async ({ page }, use) => {
    // TODO: Add real authentication when Supabase is connected
    // For now, this is a placeholder

    // Example of how authentication would work:
    // await page.goto('/auth/login');
    // await page.fill('input[type="email"]', 'test@example.com');
    // await page.fill('input[type="password"]', 'password');
    // await page.click('button[type="submit"]');
    // await page.waitForURL('/');

    await use(page as unknown as typeof base);
  },
});

// Re-export expect for convenience
export { expect };

/**
 * Helper functions for tests
 */

// Wait for page to be fully loaded
export async function waitForPageLoad(page: import('@playwright/test').Page) {
  await page.waitForLoadState('domcontentloaded');
  await page.waitForLoadState('networkidle');
}

// Check if element is in viewport
export async function isInViewport(
  page: import('@playwright/test').Page,
  selector: string
): Promise<boolean> {
  const element = page.locator(selector).first();
  const boundingBox = await element.boundingBox();

  if (!boundingBox) return false;

  const viewport = page.viewportSize();
  if (!viewport) return false;

  return (
    boundingBox.x >= 0 &&
    boundingBox.y >= 0 &&
    boundingBox.x + boundingBox.width <= viewport.width &&
    boundingBox.y + boundingBox.height <= viewport.height
  );
}

// Get all console errors from page
export async function getConsoleErrors(
  page: import('@playwright/test').Page
): Promise<string[]> {
  const errors: string[] = [];

  page.on('console', (msg) => {
    if (msg.type() === 'error') {
      errors.push(msg.text());
    }
  });

  return errors;
}

// Check accessibility basics
export async function checkBasicA11y(
  page: import('@playwright/test').Page
): Promise<{ passed: boolean; issues: string[] }> {
  const issues: string[] = [];

  // Check for main landmark
  const hasMain = await page.locator('main, [role="main"]').count() > 0;
  if (!hasMain) issues.push('Missing main landmark');

  // Check for page title
  const title = await page.title();
  if (!title || title.length < 3) issues.push('Missing or short page title');

  // Check for skip link (may be visually hidden)
  const hasSkipLink = await page.locator('a[href="#main-content"]').count() > 0;
  if (!hasSkipLink) issues.push('Missing skip link');

  // Check images have alt text (allow empty alt for decorative)
  const imagesWithoutAlt = await page.locator('img:not([alt])').count();
  if (imagesWithoutAlt > 0) issues.push(`${imagesWithoutAlt} images without alt text`);

  // Check buttons have accessible names (text content, aria-label, or title)
  const allButtons = await page.locator('button').all();
  let buttonsWithoutName = 0;
  for (const button of allButtons) {
    const ariaLabel = await button.getAttribute('aria-label');
    const title = await button.getAttribute('title');
    const textContent = await button.textContent();
    const ariaLabelledBy = await button.getAttribute('aria-labelledby');

    const hasAccessibleName =
      (ariaLabel && ariaLabel.trim().length > 0) ||
      (title && title.trim().length > 0) ||
      (textContent && textContent.trim().length > 0) ||
      ariaLabelledBy;

    if (!hasAccessibleName) {
      buttonsWithoutName++;
    }
  }
  if (buttonsWithoutName > 0) issues.push(`${buttonsWithoutName} buttons without accessible name`);

  return {
    passed: issues.length === 0,
    issues,
  };
}

// Mock API response helper
export async function mockApiResponse(
  page: import('@playwright/test').Page,
  urlPattern: string | RegExp,
  response: unknown
) {
  await page.route(urlPattern, async (route) => {
    await route.fulfill({
      status: 200,
      contentType: 'application/json',
      body: JSON.stringify(response),
    });
  });
}

// Take screenshot with consistent naming
export async function takeNamedScreenshot(
  page: import('@playwright/test').Page,
  name: string
) {
  await page.screenshot({
    path: `./e2e/screenshots/${name}-${Date.now()}.png`,
    fullPage: true,
  });
}

/**
 * Test data generators
 */

export function generateTestEmail(): string {
  return `test-${Date.now()}-${Math.random().toString(36).slice(2)}@example.com`;
}

export function generateTestShopName(): string {
  const adjectives = ['Cozy', 'Sunny', 'Fresh', 'Artisan', 'Local'];
  const nouns = ['Coffee', 'Bakery', 'Books', 'Gifts', 'Crafts'];
  const adj = adjectives[Math.floor(Math.random() * adjectives.length)];
  const noun = nouns[Math.floor(Math.random() * nouns.length)];
  return `${adj} ${noun} Shop`;
}

/**
 * Common test patterns
 */

// Test that a page is accessible
export async function testPageAccessibility(
  page: import('@playwright/test').Page,
  url: string
) {
  await page.goto(url);
  const a11y = await checkBasicA11y(page);

  if (!a11y.passed) {
    console.log('Accessibility issues:', a11y.issues);
  }

  return a11y;
}

// Test that navigation works
export async function testNavigation(
  page: import('@playwright/test').Page,
  from: string,
  to: string,
  clickSelector: string
) {
  await page.goto(from);
  await page.click(clickSelector);
  await expect(page).toHaveURL(new RegExp(to));
}
