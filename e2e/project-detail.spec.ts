/**
 * e2e/project-detail.spec.ts
 *
 * End-to-end tests for the project detail page.
 *
 * These tests verify:
 * - The detail page renders when navigating to /projects/:slug
 * - The group title, description, and repo list are shown
 * - The back link returns to the landing page
 * - Unknown slugs show the not-found fallback
 */

import { test, expect } from '@playwright/test'
import projectGroups from '../src/data/project-groups-generated.json'

test.describe('Project Detail Page', () => {
  // Use the first available group from generated data, or skip if none exist
  const firstGroup = projectGroups[0] as { slug: string; title: string } | undefined

  test('navigating to a valid group slug shows the group title', async ({ page }) => {
    if (!firstGroup) {
      test.skip()
      return
    }
    await page.goto(`/projects/${firstGroup.slug}`)
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    await expect(h1).toContainText(firstGroup.title)
  })

  test('detail page shows the group badge', async ({ page }) => {
    if (!firstGroup) {
      test.skip()
      return
    }
    await page.goto(`/projects/${firstGroup.slug}`)
    // Group badge text
    await expect(page.locator('body')).toContainText('Project Group')
  })

  test('detail page shows constituent repo links', async ({ page }) => {
    if (!firstGroup) {
      test.skip()
      return
    }
    await page.goto(`/projects/${firstGroup.slug}`)
    // At least one repo link should exist
    const repoLinks = page.locator('a[target="_blank"]')
    await expect(repoLinks.first()).toBeVisible()
  })

  test('back button returns to the landing page', async ({ page }) => {
    if (!firstGroup) {
      test.skip()
      return
    }
    await page.goto(`/projects/${firstGroup.slug}`)
    const backBtn = page.locator('button').filter({ hasText: '←' })
    await expect(backBtn).toBeVisible()
    await backBtn.click()
    await expect(page).toHaveURL('/')
    // Landing page hero should be visible
    await expect(page.locator('h1').first()).toBeVisible()
  })

  test('unknown slug shows the no-projects fallback', async ({ page }) => {
    await page.goto('/projects/this-group-does-not-exist-xyz123')
    // Should show empty state, not crash
    await expect(page.locator('body')).not.toContainText('Error')
    // The back button should still be present
    await expect(page.locator('button').filter({ hasText: '←' })).toBeVisible()
  })

  test('navigating directly to detail page works', async ({ page }) => {
    if (!firstGroup) {
      test.skip()
      return
    }
    await page.goto(`/projects/${firstGroup.slug}`)
    await expect(page).toHaveURL(`/projects/${firstGroup.slug}`)
  })
})
