import type { BrowserContext } from '@playwright/test'
import { LAB_COOKIE, passcodeToken } from '../../src/lib/labGate'

// Against a deployed site the real passcode comes from LAB_PASSCODE; locally the dev server uses 'test-pass'.
export function labPasscode(): string {
  return process.env.PLAYWRIGHT_BASE_URL ? (process.env.LAB_PASSCODE ?? '') : 'test-pass'
}

export async function addLabCookie(context: BrowserContext, baseURL: string | undefined) {
  await context.addCookies([{ name: LAB_COOKIE, value: await passcodeToken(labPasscode()), url: baseURL! }])
}
