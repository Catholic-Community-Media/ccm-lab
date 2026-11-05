import AxeBuilder from '@axe-core/playwright'
import { expect, test } from '@playwright/test'
import { contrastRatio } from '../../src/styles/contrast'
import { CONTRAST_PAIRS, TOKEN_NAMES } from '../../src/styles/tokenContract'
import { addLabCookie } from './helpers'

const DIRECTIONS = (process.env.DESIGN_DIRECTIONS ?? 'a-studio,b-parish,c-signal').split(',').filter(Boolean)
const AV_FIRST = ['live', 'give', 'on-now', 'events', 'news']

test.beforeEach(async ({ context, baseURL }) => addLabCookie(context, baseURL))

test('design index links to every direction', async ({ page }) => {
  await page.goto('/design/index.html')
  for (const d of ['a-studio', 'b-parish', 'c-signal']) {
    await expect(page.locator(`a[href="./${d}/index.html"]`)).toBeVisible()
  }
})

for (const d of DIRECTIONS) {
  test.describe(`direction ${d}`, () => {
    const url = `/design/${d}/index.html`

    test('defines every contract token and meets every contrast pair', async ({ page }) => {
      await page.goto(url)
      const tokens = await page.evaluate((names) => {
        const cs = getComputedStyle(document.documentElement)
        return Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()]))
      }, [...TOKEN_NAMES])
      for (const n of TOKEN_NAMES) expect(tokens[n], `${n} must be defined`).not.toBe('')
      for (const p of CONTRAST_PAIRS) {
        expect(contrastRatio(tokens[p.fg], tokens[p.bg]), `${p.fg} on ${p.bg}`).toBeGreaterThanOrEqual(p.min)
      }
    })

    test('has no serious or critical accessibility violations', async ({ page }) => {
      await page.goto(url)
      const results = await new AxeBuilder({ page }).withTags(['wcag2a', 'wcag2aa', 'wcag21aa']).analyze()
      const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
      expect(bad.map((v) => `${v.id}: ${v.help}`)).toEqual([])
    })

    test('phone width: no horizontal scroll and AV-first section order', async ({ page }) => {
      for (const width of [375, 390]) {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(url)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0)
        const order = await page.$$eval('[data-section]', (els) => els.map((e) => e.getAttribute('data-section')))
        expect(order.slice(0, AV_FIRST.length)).toEqual(AV_FIRST)
      }
    })

    test('has the required UI parts and state switch', async ({ page }) => {
      await page.goto(url)
      for (const part of ['player-bar', 'player-sheet', 'menu-sheet', 'state-switch', 'listen']) {
        await expect(page.locator(`[data-ui="${part}"]`), part).toHaveCount(1)
      }
      for (const state of ['Normal', 'Live', 'Pledge drive']) {
        await page.locator('[data-ui="state-switch"]').getByRole('button', { name: state }).click()
        await expect(page.locator('html')).toHaveAttribute('data-state', state === 'Pledge drive' ? 'pledge' : state.toLowerCase())
      }
    })
  })
}
