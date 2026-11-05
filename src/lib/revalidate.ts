import { revalidatePath } from 'next/cache'

/** revalidatePath throws outside a Next.js request (e.g. `payload run` scripts); never let that break a save. */
export function safeRevalidate(path = '/'): void {
  try {
    revalidatePath(path, 'layout')
  } catch (err) {
    console.warn('[revalidate] skipped:', (err as Error).message)
  }
}
