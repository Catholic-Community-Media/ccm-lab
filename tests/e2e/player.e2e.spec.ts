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

test('a live stream that ends goes to reconnecting, not paused', async ({ page }) => {
  await page.route(
    (url) => url.hostname !== 'localhost' && /streamguys/i.test(url.href),
    (route) => route.fulfill({ path: 'public/test-fixtures/tone-2s.mp3', contentType: 'audio/mpeg' }),
  )
  await page.goto('/')
  await page.getByRole('button', { name: 'Play live radio' }).click()
  await expect(page.getByText('Reconnecting…')).toBeVisible({ timeout: 15_000 })
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
})

test('a stream that fails at startup is retried, not silently paused', async ({ page }) => {
  await page.route((url) => url.hostname !== 'localhost' && /streamguys/i.test(url.href), (route) => route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: 'Play live radio' }).click()
  await expect(page.getByText(/Connecting…|Reconnecting…/)).toBeVisible()
  await expect(page.getByText('Reconnecting…')).toBeVisible()
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
})

test('each failed retry counts once', async ({ page }) => {
  await page.route((url) => url.hostname !== 'localhost' && /streamguys/i.test(url.href), (route) => route.abort())
  await page.goto('/')
  await page.getByRole('button', { name: 'Play live radio' }).click()
  const bar = page.locator('section.player')
  await expect(page.getByText('Reconnecting…')).toBeVisible()
  await expect(bar).toHaveAttribute('data-attempt', '1')
  await page.waitForTimeout(400)
  await expect(bar).toHaveAttribute('data-attempt', '1')
  await expect(bar).toHaveAttribute('data-attempt', '2', { timeout: 5_000 })
  await page.waitForTimeout(800)
  await expect(bar).toHaveAttribute('data-attempt', '2')
})

test('switching market while paused resumes the newly selected market', async ({ page }) => {
  await page.goto('/')
  await page.getByRole('button', { name: 'Play live radio' }).click()
  await expect(page.getByRole('button', { name: 'Pause' })).toBeVisible()
  await page.getByRole('button', { name: 'Pause' }).click()
  await expect(page.getByRole('button', { name: 'Play live radio' })).toBeVisible()
  const nolaName = (await page.locator('select[aria-label="Market"] option[value="nola"]').textContent())!.trim()
  await page.getByLabel('Market').selectOption('nola')
  await page.getByRole('button', { name: 'Play live radio' }).click()
  await expect(page.locator('.player__title')).toHaveText(`Live · ${nolaName}`)
})
