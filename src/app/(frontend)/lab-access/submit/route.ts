import { NextResponse } from 'next/server'
import { LAB_COOKIE, LAB_COOKIE_MAX_AGE, passcodeToken, safeNextPath } from '@/lib/labGate'

// Relative Location so the visitor stays on the host they used: behind Netlify, req.url carries the
// internal branch-deploy host (main--ccm-lab.netlify.app), which would move them off the canonical URL.
function relativeRedirect(location: string) {
  return new NextResponse(null, { status: 303, headers: { Location: location } })
}

export async function POST(req: Request) {
  const form = await req.formData()
  const given = String(form.get('passcode') ?? '')
  const next = safeNextPath(String(form.get('next') ?? '/'))
  const expected = process.env.LAB_PASSCODE

  if (!expected || (await passcodeToken(given)) !== (await passcodeToken(expected))) {
    return relativeRedirect(`/lab-access?error=1&next=${encodeURIComponent(next)}`)
  }

  const res = relativeRedirect(next)
  res.cookies.set(LAB_COOKIE, await passcodeToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: LAB_COOKIE_MAX_AGE,
  })
  return res
}
