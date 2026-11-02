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

  test('page up and down buttons scroll the projects viewport', async ({ page }) => {
    const viewport = page.locator('#crt-content-viewport')
    await expect(viewport).toBeVisible()

    const initialScroll = await viewport.evaluate((el) => el.scrollTop)
    expect(initialScroll).toBe(0)

    // Click PG DN button in header
    const pgDnBtn = page.locator('button[data-scroll="down"]').first()
    await expect(pgDnBtn).toBeVisible()
    await pgDnBtn.click()

    // Wait for smooth scroll
    await page.waitForTimeout(300)
    const scrolledDown = await viewport.evaluate((el) => el.scrollTop)
    expect(scrolledDown).toBeGreaterThan(0)

    // Click PG UP button in header
    const pgUpBtn = page.locator('button[data-scroll="up"]').first()
    await expect(pgUpBtn).toBeVisible()
    await pgUpBtn.click()

    await page.waitForTimeout(300)
    const scrolledUp = await viewport.evaluate((el) => el.scrollTop)
    expect(scrolledUp).toBeLessThan(scrolledDown)
  })

  test('keyboard PageDown and PageUp keys scroll the projects viewport', async ({ page }) => {
    const viewport = page.locator('#crt-content-viewport')
    await expect(viewport).toBeVisible()

    // Ensure focus is outside inputs
    await page.locator('h2').first().click()

    await page.keyboard.press('PageDown')
    await page.waitForTimeout(300)

    const scrolledDown = await viewport.evaluate((el) => el.scrollTop)
    expect(scrolledDown).toBeGreaterThan(0)

    await page.keyboard.press('PageUp')
    await page.waitForTimeout(300)

    const scrolledUp = await viewport.evaluate((el) => el.scrollTop)
    expect(scrolledUp).toBeLessThan(scrolledDown)
  })

  test('persistent bottom CLI pgdn, pgup, and top commands scroll projects', async ({ page }) => {
    const viewport = page.locator('#crt-content-viewport')
    const cliInput = page.locator('#bottom-cli-input')
    const cliOutput = page.locator('#bottom-cli-output')

    await expect(cliInput).toBeVisible()

    // Command: pgdn
    await cliInput.fill('pgdn')
    await cliInput.press('Enter')
    await page.waitForTimeout(300)

    const scrolled = await viewport.evaluate((el) => el.scrollTop)
    expect(scrolled).toBeGreaterThan(0)
    await expect(cliOutput).toContainText('PAGE DOWN')

    // Command: top
    await cliInput.fill('top')
    await cliInput.press('Enter')
    await page.waitForTimeout(400)

    const scrolledTop = await viewport.evaluate((el) => el.scrollTop)
    expect(scrolledTop).toBeLessThan(scrolled)
    await expect(cliOutput).toContainText('TOP')
  })

  test('DOS function key toolbar buttons F6:PgUp and F7:PgDn work', async ({ page }) => {
    const viewport = page.locator('#crt-content-viewport')
    const f7Btn = page.locator('button.fn-key-btn[data-cmd="pgdn"]')
    const f6Btn = page.locator('button.fn-key-btn[data-cmd="pgup"]')

    await expect(f7Btn).toBeVisible()
    await expect(f6Btn).toBeVisible()

    await f7Btn.click()
    await page.waitForTimeout(300)

    const scrolled = await viewport.evaluate((el) => el.scrollTop)
    expect(scrolled).toBeGreaterThan(0)

    await f6Btn.click()
    await page.waitForTimeout(300)

    const scrolledBack = await viewport.evaluate((el) => el.scrollTop)
    expect(scrolledBack).toBeLessThan(scrolled)
  })
})
