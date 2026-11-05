import { expect, test } from '@playwright/test'

import { labPasscode } from './helpers'

const PASSCODE = labPasscode()

test('visitors must enter the passcode, then return to their page', async ({ page }) => {
  await page.goto('/')
  await expect(page).toHaveURL(/\/lab-access\?next=%2F$/)

  await page.getByLabel('Lab passcode').fill('wrong')
  await page.getByRole('button', { name: 'Enter' }).click()
  await expect(page.getByTestId('lab-access-error')).toContainText("didn't match")

  await page.getByLabel('Lab passcode').fill(`  ${PASSCODE.toUpperCase()} `)
  await page.getByRole('button', { name: 'Enter' }).click()
  await expect.poll(() => new URL(page.url()).pathname).toBe('/')
  await expect(page.getByTestId('lab-message')).toBeVisible()
})

test('admin is not behind the lab gate', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin/)
})

test('responses carry noindex', async ({ request }) => {
  const res = await request.get('/lab-access')
  expect(res.headers()['x-robots-tag']).toContain('noindex')
})
