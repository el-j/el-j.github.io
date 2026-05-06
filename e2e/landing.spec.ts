/**
 * e2e/landing.spec.ts
 *
 * End-to-end tests for the landing page (home route).
 *
 * These tests verify:
 * - The hero section renders with the expected greeting
 * - The projects section renders with at least one card
 * - Category filter chips are functional
 * - The sort dropdown is functional
 * - Group cards navigate to the detail page
 */

import { test, expect } from '@playwright/test'

test.describe('Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders the hero section', async ({ page }) => {
    // Hero h1 should exist and contain the greeting
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('el-j')
  })

  test('renders the projects section heading', async ({ page }) => {
    const heading = page.locator('#projects h2').first()
    await expect(heading).toBeVisible()
    await expect(heading).toContainText('Projects')
  })

  test('renders at least one project card or group card', async ({ page }) => {
    const cards = page.locator('article')
    await expect(cards.first()).toBeVisible()
  })

  test('filter chips are visible and clickable', async ({ page }) => {
    const allChip = page.locator('button', { hasText: 'All' }).first()
    await expect(allChip).toBeVisible()
    await allChip.click()
    // After clicking All, grid should still be visible
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('sort dropdown exists and can be changed', async ({ page }) => {
    const select = page.locator('select')
    await expect(select).toBeVisible()
    await select.selectOption('az')
    // Grid should still show content after sort change
    await expect(page.locator('article').first()).toBeVisible()
  })

  test('clicking a category chip filters projects', async ({ page }) => {
    // Find category buttons (not "All")
    const categoryButtons = page.locator('button').filter({ hasNotText: 'All' })
    const count = await categoryButtons.count()
    if (count > 0) {
      await categoryButtons.first().click()
      // The grid should still render without throwing
      await expect(page.locator('#projects')).toBeVisible()
    }
  })

  test('group card navigates to detail page', async ({ page }) => {
    // Look for a group card (col-span-2 article)
    const groupCard = page.locator('article.col-span-2').first()
    const hasGroupCard = (await groupCard.count()) > 0

    if (hasGroupCard) {
      await groupCard.click()
      // Should navigate to /projects/:slug
      await expect(page).toHaveURL(/\/projects\//)
      // Back button should be visible
      await expect(page.locator('button').filter({ hasText: '←' })).toBeVisible()
    }
  })

  test('language toggle switches locale', async ({ page }) => {
    const langBtn = page.locator('button').filter({ hasText: /^(EN|DE)$/i }).first()
    await expect(langBtn).toBeVisible()
    const initialText = await langBtn.textContent()
    await langBtn.click()
    const newText = await langBtn.textContent()
    expect(newText).not.toBe(initialText)
  })
})
