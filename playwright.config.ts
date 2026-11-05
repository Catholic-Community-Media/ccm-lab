import { defineConfig, devices } from '@playwright/test'

// PLAYWRIGHT_BASE_URL set → test a deployed site (no local server); LAB_PASSCODE must then be the real passcode.
const remote = process.env.PLAYWRIGHT_BASE_URL

export default defineConfig({
  testDir: './tests/e2e',
  testMatch: '**/*.e2e.spec.ts',
  timeout: 60_000,
  use: { baseURL: remote ?? 'http://localhost:3000' },
  projects: [
    { name: 'chromium', use: { ...devices['Desktop Chrome'] }, testIgnore: '**/*.mobile.e2e.spec.ts' },
    { name: 'webkit', use: { ...devices['Desktop Safari'] }, testIgnore: '**/*.mobile.e2e.spec.ts' },
    { name: 'mobile-chrome', use: { ...devices['Pixel 7'] }, testMatch: '**/*.mobile.e2e.spec.ts' },
    { name: 'mobile-safari', use: { ...devices['iPhone 14'] }, testMatch: '**/*.mobile.e2e.spec.ts' },
  ],
  webServer: remote
    ? undefined
    : {
        command: 'npm run dev',
        url: 'http://localhost:3000/admin',
        reuseExistingServer: true,
        timeout: 180_000,
        env: { LAB_PASSCODE: 'test-pass' },
      },
})
