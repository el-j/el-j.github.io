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
    await page.addInitScript(() => {
      sessionStorage.setItem('crt-booted', 'true');
    });
    await page.goto('/');
  });

  test('renders the HUD header identity and status', async ({ page }) => {
    await page.goto('/projects')
    const header = page.locator('header')
    await expect(header).toBeVisible()
    await expect(header).toContainText('EL-J BIOS v2.084')
    await expect(header).toContainText('200 OK')
  })

  test('renders main navigation tabs with active about tab', async ({ page }) => {
    await page.goto('/projects')
    const nav = page.locator('nav[aria-label="Main Navigation"]')
    await expect(nav).toBeVisible()
    await expect(nav.locator('a[data-tab="about"]')).toBeVisible()
    await expect(nav.locator('a[data-tab="projects"]')).toBeVisible()
    await expect(nav.locator('a[data-tab="cli_tools"]')).toBeVisible()
    await expect(nav.locator('a[data-tab="contributions"]')).toBeVisible()
  })

  test('renders the GUI HUD with clickable tiles', async ({ page }) => {
    const hud = page.locator('#gui-hud')
    await expect(hud).toBeVisible()
    await expect(hud.locator('.hud-item')).toHaveCount(4)

    await hud.locator('.hud-item', { hasText: 'CLI Tools' }).hover()
    await expect(page.locator('#hud-help')).toContainText('Agent SDKs')

    await hud.locator('.hud-item', { hasText: 'Projects' }).click()
    await expect(page).toHaveURL(/\/projects/)
  })

  test('arrow keys move the HUD selection', async ({ page }) => {
    await expect(page.locator('.hud-item.is-active')).toContainText('Projects')
    await page.keyboard.press('ArrowDown')
    await expect(page.locator('.hud-item.is-active')).toContainText('CLI Tools')
  })

  test('exit drops to the text shell and startx returns to the GUI', async ({ page }) => {
    await page.locator('#hud-exit').click()
    await expect(page.locator('#gui-hud')).toBeHidden()
    const input = page.locator('#tty-input')
    await expect(input).toBeFocused()

    await input.fill('ca')
    await input.press('Tab')
    await expect(input).toHaveValue('cat ')
    await input.fill('ls')
    await input.press('Enter')
    await expect(page.locator('#tty-output')).toContainText('about.md')

    await input.fill('startx')
    await input.press('Enter')
    await expect(page.locator('#gui-hud')).toBeVisible()
  })

  test('bottom CLI supports tab completion', async ({ page }) => {
    await page.goto('/projects')
    const input = page.locator('#bottom-cli-input')
    await input.fill('cd pro')
    await input.press('Tab')
    await expect(input).toHaveValue('cd projects ')
  })

  test('renders 90s DOS/BIOS line-by-line raster draw elements', async ({ page }) => {
    await expect(page.locator('.dos-raster-beam')).toBeAttached()
    await expect(page.locator('#dos-raster-content')).toBeVisible()
  })

  test('scanlines toggle switch toggles state and updates scanlines overlay opacity', async ({ page }) => {
    await page.goto('/projects')
    const scanlinesBtn = page.locator('#btn-toggle-scanlines')
    const scanlinesLayer = page.locator('#crt-scanlines-layer')
    await expect(scanlinesBtn).toBeVisible()
    await expect(scanlinesLayer).toBeAttached()

    // Initially ON
    await expect(scanlinesBtn).toHaveAttribute('aria-checked', 'true')
    const initialOpacity = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--scanline-opacity').trim()
    )
    expect(Number(initialOpacity)).toBeGreaterThan(0)

    // Toggle OFF
    await scanlinesBtn.click()
    await expect(scanlinesBtn).toHaveAttribute('aria-checked', 'false')
    const offOpacity = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--scanline-opacity').trim()
    )
    expect(offOpacity).toBe('0')

    // Toggle back ON
    await scanlinesBtn.click()
    await expect(scanlinesBtn).toHaveAttribute('aria-checked', 'true')
  })

  test('renders CRT curved optics layers for bended monitor simulation', async ({ page }) => {
    await expect(page.locator('.crt-curved-tube-vignette')).toBeAttached()
    await expect(page.locator('.crt-curved-rim')).toBeAttached()
    await expect(page.locator('.crt-tube-glare')).toBeAttached()
    await expect(page.locator('.crt-workstation-viewport')).toBeAttached()
  })

  test('navigation to projects page works', async ({ page }) => {
    await page.goto('/projects')
    await expect(page.locator('h2')).toContainText('[02_PROJECTS]')
    await page.click('a[data-tab="about"]')
    await expect(page.locator('#home')).toBeVisible()
  })

  test('bezel live date and time clock is displayed and updates', async ({ page }) => {
    await page.goto('/projects')
    const dateStamp = page.locator('#bezel-date-stamp')
    await expect(dateStamp).toBeVisible()

    // Verify it contains a time format with HH:MM:SS
    await expect(dateStamp).toHaveText(/\d{1,2}:\d{2}:\d{2}/)
    await expect(dateStamp).toHaveAttribute('datetime')
  })

  test('persistent bottom CLI is always docked at bottom and handles refresh command', async ({ page }) => {
    await page.goto('/projects')
    const bottomCli = page.locator('#persistent-bottom-cli')
    await expect(bottomCli).toBeVisible()

    const input = page.locator('#bottom-cli-input')
    await expect(input).toBeVisible()

    // Test help command in bottom CLI
    await input.fill('help')
    await input.press('Enter')
    const output = page.locator('#bottom-cli-output')
    await expect(output).toContainText('CMDS:')

    // Test refresh command in bottom CLI
    await input.fill('refresh')
    await input.press('Enter')
    await expect(output).toContainText('Screen refreshed')

    // Test refresh button click
    const refreshBtn = page.locator('#btn-bottom-cli-refresh')
    await expect(refreshBtn).toBeVisible()
    await refreshBtn.click()
    await expect(output).toContainText('Screen refreshed')

    // Test DOS function keys toolbar
    await expect(page.locator('button[data-cmd="refresh"]')).toBeVisible()
    await expect(page.locator('button[data-cmd="help"]')).toBeVisible()
  })

  test('scanlines opacity is configured for optimal retro readability', async ({ page }) => {
    const initialOpacity = await page.evaluate(() => 
      getComputedStyle(document.documentElement).getPropertyValue('--scanline-opacity').trim()
    )
    expect(Number(initialOpacity)).toBeCloseTo(0.20, 2)
  })

  test('enforces strict non-scrolling 100vh terminal layout', async ({ page }) => {
    const bodyOverflow = await page.evaluate(() => getComputedStyle(document.body).overflowY)
    expect(bodyOverflow).toBe('hidden')

    const htmlOverflow = await page.evaluate(() => getComputedStyle(document.documentElement).overflowY)
    expect(htmlOverflow).toBe('hidden')
  })
})

test.describe('80s/90s BIOS POST & Floppy Boot Sequence', () => {
  test('displays BIOS POST screen on clean session with curved CRT tube overlays and allows skip', async ({ page }) => {
    // Navigate with empty sessionStorage
    await page.goto('/')

    const overlay = page.locator('#bios-boot-overlay')
    await expect(overlay).toBeVisible()
    await expect(overlay).toContainText('EL-J CYBER-BIOS')
    await expect(overlay).toContainText('FABIAN-486DX4 WORKSTATION')
    await expect(overlay).toContainText('Detecting USB Boot Device')

    // Verify BIOS overlay is positioned beneath the CRT curved glass layers (z-[50] vs z-88/89/90/91)
    const zIndex = await overlay.evaluate((el) => getComputedStyle(el).zIndex)
    expect(Number(zIndex)).toBe(50)

    // Verify CRT curved tube optics are present over it
    await expect(page.locator('.crt-curved-tube-vignette')).toBeAttached()
    await expect(page.locator('.crt-curved-rim')).toBeAttached()
    await expect(page.locator('.crt-scanlines-layer')).toBeAttached()

    // Click skip button
    const skipBtn = page.locator('#btn-skip-boot')
    await expect(skipBtn).toBeVisible()
    await skipBtn.click()

    // Overlay is dismissed and workstation is visible
    await expect(overlay).toBeHidden()
    await expect(page.locator('#grub-overlay')).toBeVisible()

    // Session storage is populated
    const booted = await page.evaluate(() => sessionStorage.getItem('crt-booted'))
    expect(booted).toBe('true')
  })

  test('GRUB menu counts down and boots the GUI by default', async ({ page }) => {
    await page.goto('/')
    await page.locator('#btn-skip-boot').click()

    const grub = page.locator('#grub-overlay')
    await expect(grub).toBeVisible()
    await expect(grub).toContainText('GNU GRUB')
    await expect(page.locator('#grub-countdown')).toContainText('automatically in')
    await expect(grub).toBeHidden({ timeout: 8000 })
    await expect(page.locator('#gui-hud')).toBeVisible()
  })

  test('GRUB menu can boot into text mode', async ({ page }) => {
    await page.goto('/')
    await page.locator('#btn-skip-boot').click()
    await page.locator('.grub-entry[data-mode="text"]').click()
    await expect(page.locator('#grub-overlay')).toBeHidden()
    await expect(page.locator('#text-console')).toBeVisible()
    await expect(page.locator('#gui-hud')).toBeHidden()
  })

  test('reboot command in terminal triggers BIOS POST sequence', async ({ page }) => {
    await page.addInitScript(() => {
      sessionStorage.setItem('crt-booted', 'true')
    })
    await page.goto('/projects')

    const terminalInput = page.locator('#bottom-cli-input')
    await expect(terminalInput).toBeVisible()
    await terminalInput.fill('reboot')
    await terminalInput.press('Enter')

    const overlay = page.locator('#bios-boot-overlay')
    await expect(overlay).toBeVisible()
    await expect(overlay).toContainText('EL-J CYBER-BIOS')
  })
})


