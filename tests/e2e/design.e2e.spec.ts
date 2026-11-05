import AxeBuilder from '@axe-core/playwright'
import { expect, test, type Page } from '@playwright/test'
import { contrastRatio } from '../../src/styles/contrast'
import { CONTRAST_PAIRS, TOKEN_NAMES } from '../../src/styles/tokenContract'
import { addLabCookie } from './helpers'

const ALLOWED = ['a-studio', 'b-parish', 'c-signal']
const DIRECTIONS = (process.env.DESIGN_DIRECTIONS ?? ALLOWED.join(',')).split(',').filter(Boolean)
const unknown = DIRECTIONS.filter((d) => !ALLOWED.includes(d))
if (unknown.length) throw new Error(`Unknown DESIGN_DIRECTIONS: ${unknown.join(', ')} (allowed: ${ALLOWED.join(', ')})`)
const STATES = [
  { button: 'Normal', attr: 'normal' },
  { button: 'Live', attr: 'live' },
  { button: 'Pledge drive', attr: 'pledge' },
]
const AXE_TAGS = ['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa', 'wcag22aa']
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

    async function setState(page: Page, s: (typeof STATES)[number]) {
      await page.locator('[data-ui="state-switch"]').getByRole('button', { name: s.button, exact: true }).click()
      await expect(page.locator('html')).toHaveAttribute('data-state', s.attr)
    }

    test('defines every contract token and meets every contrast pair in every state', async ({ page }) => {
      await page.goto(url)
      for (const s of STATES) {
        await setState(page, s)
        const tokens = await page.evaluate((names) => {
          const cs = getComputedStyle(document.documentElement)
          return Object.fromEntries(names.map((n) => [n, cs.getPropertyValue(n).trim()]))
        }, [...TOKEN_NAMES])
        for (const n of TOKEN_NAMES) expect(tokens[n], `[${s.attr}] ${n} must be defined`).not.toBe('')
        for (const n of TOKEN_NAMES.filter((t) => t.startsWith('--color-'))) {
          expect(tokens[n], `[${s.attr}] ${n} must be #rrggbb`).toMatch(/^#[0-9a-f]{6}$/i)
        }
        for (const p of CONTRAST_PAIRS) {
          expect(contrastRatio(tokens[p.fg], tokens[p.bg]), `[${s.attr}] ${p.fg} on ${p.bg}`).toBeGreaterThanOrEqual(p.min)
        }
      }
    })

    test('has no serious or critical accessibility violations in every state', async ({ page }) => {
      await page.goto(url)
      for (const s of STATES) {
        await setState(page, s)
        const results = await new AxeBuilder({ page }).withTags(AXE_TAGS).analyze()
        const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
        expect(bad.map((v) => `[${s.attr}] ${v.id}: ${v.help}`)).toEqual([])
      }
    })

    for (const [sheet, opener] of [['menu-sheet', 'menu-open'], ['player-sheet', 'player-open']]) {
      test(`${sheet} opens as a dialog, is accessible, and closes with Escape`, async ({ page }) => {
        await page.setViewportSize({ width: 390, height: 844 })
        await page.goto(url)
        const el = page.locator(`[data-ui="${sheet}"]`)
        await page.locator(`[data-ui="${opener}"]`).click()
        await expect(el).toBeVisible()
        await expect(el).toHaveAttribute('role', 'dialog')
        const results = await new AxeBuilder({ page }).include(`[data-ui="${sheet}"]`).withTags(AXE_TAGS).analyze()
        const bad = results.violations.filter((v) => v.impact === 'serious' || v.impact === 'critical')
        expect(bad.map((v) => `${v.id}: ${v.help}`)).toEqual([])
        await page.keyboard.press('Escape')
        await expect(el).toBeHidden()
      })
    }

    test('phone width: no horizontal scroll and AV-first visual section order', async ({ page }) => {
      for (const width of [375, 390]) {
        await page.setViewportSize({ width, height: 844 })
        await page.goto(url)
        const overflow = await page.evaluate(() => document.documentElement.scrollWidth - window.innerWidth)
        expect(overflow, `horizontal overflow at ${width}px`).toBeLessThanOrEqual(0)
      }
      await page.setViewportSize({ width: 390, height: 844 })
      await page.goto(url)
      const found: { name: string; y: number }[] = []
      for (const el of await page.locator('main > [data-section]').all()) {
        const box = await el.boundingBox()
        found.push({ name: (await el.getAttribute('data-section'))!, y: box?.y ?? Number.NaN })
      }
      const order = found.sort((a, b) => a.y - b.y).map((f) => f.name)
      expect(order.slice(0, AV_FIRST.length)).toEqual(AV_FIRST)
    })

    test('has the required UI parts and state switch', async ({ page }) => {
      await page.goto(url)
      for (const part of ['player-bar', 'player-sheet', 'menu-sheet', 'state-switch', 'listen']) {
        await expect(page.locator(`[data-ui="${part}"]`), part).toHaveCount(1)
      }
      for (const s of STATES) await setState(page, s)
    })
  })
}
