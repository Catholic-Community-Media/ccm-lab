import { expect, test } from '@playwright/test'

test('admin login screen loads', async ({ page }) => {
  await page.goto('/admin')
  await expect(page).toHaveURL(/\/admin/)
  await expect(page.locator('form')).toBeVisible()
})
