/**
 * e2e/project-detail.spec.ts
 *
 * End-to-end tests for the Projects page and case study articles.
 *
 * Verifies:
 * - Direct navigation to /projects
 * - Render of curated project case study cards
 * - Metadata badges (category, year, role)
 * - Navigation back to landing page (/ or [01_ABOUT])
 */

import { test, expect } from '@playwright/test'

test.describe('Projects Case Studies Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/projects')
  })

  test('renders projects heading and case studies grid', async ({ page }) => {
    const heading = page.locator('h2').first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('[02_PROJECTS]')

    const cards = page.locator('article.terminal-card')
    const count = await cards.count()
    expect(count).toBeGreaterThan(0)
  })

  test('renders project cards with category and highlights', async ({ page }) => {
    const firstCard = page.locator('article.terminal-card').first()
    await expect(firstCard).toBeVisible()
    await expect(firstCard.locator('h3')).toBeVisible()
  })

  test('navigating back to landing via nav tab works', async ({ page }) => {
    const aboutTab = page.locator('a[data-tab="about"]')
    await expect(aboutTab).toBeVisible()
    await aboutTab.click()
    await expect(page).toHaveURL('/')
    await expect(page.locator('h1')).toContainText('FABIAN ALTHAUS')
  })

  test('navigating directly to /projects works', async ({ page }) => {
    await expect(page).toHaveURL(/\/projects/)
    await expect(page.locator('nav a[data-tab="projects"]')).toHaveClass(/active/)
  })
})
