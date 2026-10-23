/**
 * e2e/visual.spec.ts
 *
 * Visual regression tests using Playwright screenshot comparisons.
 *
 * Baseline screenshots are stored in e2e/screenshots/ and committed to the repo.
 * On each PR run:
 *   - If screenshots match → pass
 *   - If screenshots differ → fail (diffs are uploaded as artifacts)
 *
 * To update baselines:
 *   npm run e2e:update
 */

import { test, expect } from '@playwright/test'
import projectGroups from '../src/data/project-groups-generated.json' with { type: 'json' }

const firstGroup = projectGroups[0] as { slug: string } | undefined

test.describe('Visual regression', () => {
  test('landing page screenshot', async ({ page }) => {
    await page.goto('/')
    // Wait for the page to settle (lazy-loaded images, transitions)
    await page.waitForLoadState('networkidle')
    // Scroll to top to ensure consistent viewport
    await page.evaluate(() => window.scrollTo(0, 0))
    await expect(page).toHaveScreenshot('landing.png', {
      fullPage: false,
      // Allow small pixel differences (anti-aliasing, subpixel rendering)
      maxDiffPixelRatio: 0.02,
    })
  })

  test('landing page projects section screenshot', async ({ page }) => {
    await page.goto('/')
    await page.waitForLoadState('networkidle')
    // Scroll to projects section
    await page.locator('#projects').scrollIntoViewIfNeeded()
    await expect(page.locator('#projects')).toHaveScreenshot('projects-section.png', {
      maxDiffPixelRatio: 0.02,
    })
  })

  test('project detail page screenshot', async ({ page }) => {
    if (!firstGroup) {
      test.skip()
      return
    }
    await page.goto(`/projects/${firstGroup.slug}`)
    await page.waitForLoadState('networkidle')
    await expect(page).toHaveScreenshot('project-detail.png', {
      fullPage: false,
      maxDiffPixelRatio: 0.02,
    })
  })
})
