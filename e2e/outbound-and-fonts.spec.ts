import { test, expect } from '@playwright/test'

test.describe('Outbound links and self-hosted fonts', () => {
  test.beforeEach(async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('crt-booted', 'true'))
  })

  for (const path of ['/', '/projects/', '/cli-tools/', '/contributions/']) {
    test(`external and mailto links open in a new tab on ${path}`, async ({ page }) => {
      await page.goto(path)
      await page.waitForLoadState('networkidle')
      const bad = await page.evaluate(() =>
        Array.from(document.querySelectorAll<HTMLAnchorElement>('a[href]'))
          .filter((a) => /^mailto:/i.test(a.getAttribute('href') || '') || (/^https?:$/.test(a.protocol) && a.origin !== location.origin))
          .filter((a) => a.target !== '_blank' || !/noopener/.test(a.rel))
          .map((a) => a.href),
      )
      expect(bad).toEqual([])
    })
  }

  test('contact tile opens mailto in a new tab', async ({ page }) => {
    await page.goto('/')
    const contact = page.locator('a.hud-tile[href^="mailto:"]')
    await expect(contact).toHaveAttribute('target', '_blank')
    await expect(contact).toHaveAttribute('rel', /noopener/)
  })

  test('text-mode shell links open in a new tab', async ({ page }) => {
    await page.addInitScript(() => sessionStorage.setItem('el-j-mode', 'text'))
    await page.goto('/')
    const link = page.locator('#tty-output a[href^="https://github.com/el-j"]')
    await expect(link).toHaveAttribute('target', '_blank')
  })

  test('loads fonts from our own origin only', async ({ page }) => {
    const external: string[] = []
    page.on('request', (r) => {
      if (!r.url().startsWith('http://localhost')) external.push(r.url())
    })
    await page.goto('/projects/')
    await page.waitForLoadState('networkidle')
    expect(external).toEqual([])
    const families = await page.evaluate(async () => {
      await document.fonts.ready
      return Array.from(document.fonts).filter((f) => f.status === 'loaded').map((f) => f.family.replace(/"/g, ''))
    })
    expect(families).toContain('DotGothic16')
  })

  test('landing shows ASCII art logo and neofetch in text mode', async ({ page }) => {
    await page.goto('/')
    await expect(page.locator('#gui-hud .ascii-art').first()).toBeVisible()
    await page.keyboard.press('q')
    await expect(page.locator('#tty-output')).toContainText('OS: Arch Linux')
    await expect(page.locator('#tty-output')).toContainText('|o_o |')
  })
})
