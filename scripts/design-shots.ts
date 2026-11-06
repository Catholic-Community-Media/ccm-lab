// scripts/design-shots.ts — usage: npx tsx scripts/design-shots.ts <direction-id> (dev server on :3000 with LAB_PASSCODE=test-pass)
import { chromium } from '@playwright/test'
import { LAB_COOKIE, passcodeToken } from '../src/lib/labGate'

const id = process.argv[2]
if (!id) throw new Error('usage: design-shots <direction-id>')
const base = 'http://localhost:3000'
const browser = await chromium.launch()
for (const [name, width, height] of [['phone', 390, 844], ['desktop', 1440, 900]] as const) {
  const context = await browser.newContext({ viewport: { width, height }, deviceScaleFactor: 2 })
  await context.addCookies([{ name: LAB_COOKIE, value: await passcodeToken(process.env.LAB_PASSCODE ?? 'test-pass'), url: base }])
  const page = await context.newPage()
  for (const state of ['normal', 'pledge'] as const) {
    await page.goto(`${base}/design/${id}/index.html`)
    if (state !== 'normal') {
      await page.locator('[data-ui="state-switch"]').getByRole('button', { name: 'Pledge drive', exact: true }).click()
      await page.waitForSelector(`html[data-state="${state}"]`)
    }
    await page.screenshot({ path: `docs/design/${id}-${name}-${state}.png`, fullPage: true })
  }
  await context.close()
}
await browser.close()
console.log(`screenshots written for ${id}`)
