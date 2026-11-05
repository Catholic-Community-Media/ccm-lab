import { expect, test } from '@playwright/test'
import { addLabCookie } from './helpers'

test.beforeEach(async ({ context, baseURL }) => {
  await addLabCookie(context, baseURL)
})

test('listen page lists frequencies and offers a basic player', async ({ page }) => {
  await page.goto('/listen')
  await expect(page.getByRole('heading', { name: 'Listen Live' })).toBeVisible()
  await expect(page.getByText('WPYR 1380 AM')).toBeVisible()
  await page.getByText('Having trouble? Use the basic player').click()
  await expect(page.locator('audio[controls]').first()).toBeVisible()
})

test('pop-out page renders a full player without site chrome', async ({ page }) => {
  await page.goto('/player')
  await expect(page.getByRole('button', { name: 'Play live radio' })).toBeVisible()
  await expect(page.getByRole('navigation', { name: 'Main' })).toHaveCount(0)
})
