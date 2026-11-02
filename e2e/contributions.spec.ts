import { test, expect } from '@playwright/test';

test.describe('CLI Tools and Upstream Contributions', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('crt-booted', 'true');
    });
  });

  test('cli-tools page renders real released tools with github links', async ({ page }) => {
    await page.goto('/cli-tools');
    await expect(page).toHaveURL('/cli-tools');

    const heading = page.locator('h2').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('[03_CLI_TOOLS]');

    // Check that cards are rendered
    const cards = page.locator('article.terminal-card');
    const count = await cards.count();
    expect(count).toBe(8);

    // Verify key real tools exist
    await expect(page.locator('article:has-text("agency-agents-sdk")')).toBeVisible();
    await expect(page.locator('article:has-text("google-sheet-translations")')).toBeVisible();
    await expect(page.locator('article:has-text("run-zero")')).toBeVisible();
    await expect(page.locator('article:has-text("nexus-orchestrator")')).toBeVisible();

    // Verify all github links point to real github repositories under el-j
    const githubLinks = page.locator('article.terminal-card a:has-text("[GITHUB]")');
    const linkCount = await githubLinks.count();
    expect(linkCount).toBeGreaterThan(0);
    for (let i = 0; i < linkCount; i++) {
      const href = await githubLinks.nth(i).getAttribute('href');
      expect(href).toMatch(/^https:\/\/github\.com\/el-j\//);
    }
  });

  test('contributions page renders upstream open-source repositories and verified PRs', async ({ page }) => {
    await page.goto('/contributions');
    await expect(page).toHaveURL('/contributions');

    const heading = page.locator('h2').first();
    await expect(heading).toBeVisible();
    await expect(heading).toContainText('[04_CONTRIBUTIONS]');

    // Check upstream repository cards
    const cards = page.locator('article.terminal-card');
    const count = await cards.count();
    expect(count).toBeGreaterThanOrEqual(10);

    // Verify key real upstream contributions are rendered
    await expect(page.locator('article:has-text("storytold/vectorcraft")')).toBeVisible();
    await expect(page.locator('article:has-text("microsoft/TypeScript")')).toBeVisible();
    await expect(page.locator('article:has-text("fritzing/fritzing-parts")')).toBeVisible();
    await expect(page.locator('article:has-text("paulvollmer/cyberrover")')).toBeVisible();

    // Verify status badges exist
    const mergedBadges = page.locator('span:has-text("[MERGED]")');
    expect(await mergedBadges.count()).toBeGreaterThan(5);
  });

  test('navigating between cli-tools and contributions via menu tabs works', async ({ page }) => {
    await page.goto('/cli-tools');
    const contribTab = page.locator('a[data-tab="contributions"]');
    await expect(contribTab).toBeVisible();
    await contribTab.click();

    await expect(page).toHaveURL('/contributions');
    await expect(page.locator('nav a[data-tab="contributions"]')).toHaveClass(/active/);

    const cliTab = page.locator('a[data-tab="cli_tools"]');
    await cliTab.click();
    await expect(page).toHaveURL('/cli-tools');
    await expect(page.locator('nav a[data-tab="cli_tools"]')).toHaveClass(/active/);
  });
});
