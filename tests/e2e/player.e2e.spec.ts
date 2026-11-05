import { expect, test } from '@playwright/test'
import { LAB_COOKIE, passcodeToken } from '../../src/lib/labGate'

test.beforeEach(async ({ context, page, baseURL }) => {
  await context.addCookies([{ name: LAB_COOKIE, value: await passcodeToken('test-pass'), url: baseURL! }])
  // Serve the local tone for whatever stream URL the Markets global points at.
  await page.route(
    (url) => url.hostname !== 'localhost' && /\.(mp3|aac)$|stream|icecast|streamguys/i.test(url.href),
    (route) => route.fulfill({ path: 'public/test-fixtures/tone.mp3', contentType: 'audio/mpeg' }),
  )
})

test('live audio keeps playing across client-side navigation', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Play live radio' }).click()

  const audio = page.locator('audio[data-ccm-audio]')
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => !a.paused && a.currentTime > 0.5)).toBe(true)
  const instance = await audio.getAttribute('data-instance')

  await page.getByRole('link', { name: 'Listen Live' }).click()
  await expect(page).toHaveURL(/\/listen$/)

  expect(await audio.getAttribute('data-instance')).toBe(instance)
  const t1 = await audio.evaluate((a: HTMLAudioElement) => a.currentTime)
  await expect.poll(() => audio.evaluate((a: HTMLAudioElement) => a.currentTime)).toBeGreaterThan(t1 + 0.5)
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
})

test('market choice is remembered', async ({ page }) => {
  await page.goto('/')
  await page.getByLabel('Market').selectOption('nola')
  await page.reload()
  await expect(page.getByLabel('Market')).toHaveValue('nola')
})
