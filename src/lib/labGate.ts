export const LAB_COOKIE = 'ccm_lab'
export const LAB_COOKIE_MAX_AGE = 60 * 60 * 24 * 30

const normalize = (passcode: string) => passcode.trim().toLowerCase()

export async function passcodeToken(passcode: string): Promise<string> {
  const data = new TextEncoder().encode(`ccm-lab:${normalize(passcode)}`)
  const digest = await crypto.subtle.digest('SHA-256', data)
  return Array.from(new Uint8Array(digest), (b) => b.toString(16).padStart(2, '0')).join('')
}

export async function isLabAuthorized(cookie: string | undefined, passcode: string | undefined): Promise<boolean> {
  if (!passcode) return false
  if (!cookie) return false
  return cookie === (await passcodeToken(passcode))
}

const EXEMPT = [/^\/admin(\/|$)/, /^\/api(\/|$)/, /^\/_next\//, /^\/lab-access(\/|$)/, /^\/robots\.txt$/, /^\/favicon/, /^\/test-fixtures\//]

export function isExemptPath(pathname: string): boolean {
  return EXEMPT.some((re) => re.test(pathname))
}

export function safeNextPath(raw: string | null | undefined): string {
  if (!raw || !raw.startsWith('/') || raw.startsWith('//')) return '/'
  // The WHATWG URL parser strips tab/LF/CR and treats \ as /, so reject both up front.
  if (/[\u0000-\u001f\u007f\\]/.test(raw)) return '/'
  try {
    const u = new URL(raw, 'http://lab.invalid')
    if (u.origin !== 'http://lab.invalid') return '/'
    const out = u.pathname + u.search + u.hash
    return out.startsWith('//') ? '/' : out
  } catch {
    return '/'
  }
}
