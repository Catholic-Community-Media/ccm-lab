import { safeNextPath } from '@/lib/labGate'

export const metadata = { title: 'Lab access — Catholic Community Media' }

export default async function LabAccessPage({
  searchParams,
}: {
  searchParams: Promise<{ next?: string; error?: string }>
}) {
  const { next, error } = await searchParams
  return (
    <main className="page narrow">
      <h1>Catholic Community Media — Lab</h1>
      <p>This is a preview site for staff. Enter the lab passcode to continue.</p>
      {error ? (
        <p role="alert" data-testid="lab-access-error" className="error">
          That passcode didn&apos;t match. Please try again.
        </p>
      ) : null}
      <form method="post" action="/lab-access/submit">
        <input type="hidden" name="next" value={safeNextPath(next)} />
        <label htmlFor="passcode">Lab passcode</label>
        <input id="passcode" name="passcode" type="password" autoComplete="current-password" required autoFocus />
        <button type="submit">Enter</button>
      </form>
    </main>
  )
}
