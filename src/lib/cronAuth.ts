export const ALLOWED_TASKS = ['heartbeat'] as const

export function isCronAuthorized(header: string | null, secret: string | undefined): boolean {
  if (!secret) return false
  if (!header) return false
  return header === `Bearer ${secret}`
}
