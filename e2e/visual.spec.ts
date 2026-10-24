/**
 * e2e/visual.spec.ts
 *
 * Visual regression tests using Playwright screenshot comparisons.
 *
 * Baseline screenshots are stored in e2e/visual.spec.ts-snapshots/ and committed to the repo.
 * On each PR run:
 *   - If screenshots match → pass
 *   - If screenshots differ → fail (diffs are uploaded as artifacts)
 *
 * To update baselines:
 *   npm run e2e:update
 */

import { test, expect } from '@playwright/test'

test.describe('Visual regression', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('crt-booted', 'true');
    });
  });

  test('landing page screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(page).toHaveScreenshot('landing.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    })
  })

  test('landing page projects section screenshot', async ({ page }) => {
    await page.goto('/projects')
    await page.waitForLoadState('networkidle')
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(page).toHaveScreenshot('projects-section.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.05,
    })
  })
})
