/**
 * e2e/landing.spec.ts
 *
 * End-to-end tests for the Cyber-Tactile CRT Workstation landing page.
 *
 * Verifies:
 * - HUD Header identity and status indicator
 * - Navigation links and active state
 * - Workstation CRT monitor structure and 2x2 matrix
 * - Project Schematics Deck switching
 * - Live Terminal CLI REPL interaction
 * - Hardware bezel switches (Scanlines, Sound FX)
 * - Phosphor theme switching
 */

import { test, expect } from '@playwright/test'

test.describe('CRT Workstation Landing page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/')
  })

  test('renders the HUD header identity and status', async ({ page }) => {
    const h1 = page.locator('h1').first()
    await expect(h1).toBeVisible()
    await expect(h1).toContainText('FABIAN ALTHAUS (el-j)')
    await expect(page.locator('header')).toContainText('ONLINE [200 OK]')
  })

  test('renders main navigation tabs with active about tab', async ({ page }) => {
    const nav = page.locator('nav[aria-label="Main Navigation"]')
    await expect(nav).toBeVisible()
    await expect(nav.locator('a[data-tab="about"]')).toHaveClass(/active/)
    await expect(nav.locator('a[data-tab="projects"]')).toBeVisible()
    await expect(nav.locator('a[data-tab="cli_tools"]')).toBeVisible()
    await expect(nav.locator('a[data-tab="dotfiles"]')).toBeVisible()
  })

  test('renders the 2x2 workstation matrix components', async ({ page }) => {
    // 1. Schematics Deck
    await expect(page.locator('#schematics-deck')).toBeVisible()
    // 2. Live Terminal
    await expect(page.locator('#terminal-island')).toBeVisible()
    // 3. Token AST visualizer
    await expect(page.locator('#ast-visualizer-card')).toBeVisible()
  })

  test('project schematics deck switches active project', async ({ page }) => {
    const deck = page.locator('#schematics-deck')
    await expect(deck).toBeVisible()

    const tabButtons = deck.locator('button.project-tab-btn')
    const count = await tabButtons.count()
    expect(count).toBeGreaterThan(1)

    // Click the second schematic button
    const secondBtn = tabButtons.nth(1)
    await secondBtn.click()

    await expect(secondBtn).toHaveClass(/active-project/)
  })

  test('live terminal REPL accepts input and executes help command', async ({ page }) => {
    const input = page.locator('#terminal-input')
    await expect(input).toBeVisible()

    await input.fill('help')
    await input.press('Enter')

    const output = page.locator('#terminal-output')
    await expect(output).toContainText('AVAILABLE WORKSTATION COMMANDS')
  })

  test('phosphor theme buttons switch data-theme on html', async ({ page }) => {
    const greenBtn = page.locator('button[data-set-theme="green"]')
    await expect(greenBtn).toBeVisible()
    await greenBtn.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'green')

    const amberBtn = page.locator('button[data-set-theme="amber"]')
    await expect(amberBtn).toBeVisible()
    await amberBtn.click()
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'amber')
  })

  test('scanlines toggle switch toggles state', async ({ page }) => {
    const scanlinesBtn = page.locator('#btn-toggle-scanlines')
    await expect(scanlinesBtn).toBeVisible()
    const initialChecked = await scanlinesBtn.getAttribute('aria-checked')

    await scanlinesBtn.click()
    const newChecked = await scanlinesBtn.getAttribute('aria-checked')
    expect(newChecked).not.toBe(initialChecked)
  })

  test('navigation to projects page works', async ({ page }) => {
    await page.click('a[data-tab="projects"]')
    await expect(page).toHaveURL(/\/projects/)
    await expect(page.locator('h2')).toContainText('[02_PROJECTS]')
  })
})
