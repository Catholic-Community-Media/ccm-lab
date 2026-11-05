import { NextResponse } from 'next/server'
import { LAB_COOKIE, LAB_COOKIE_MAX_AGE, passcodeToken, safeNextPath } from '@/lib/labGate'

export async function POST(req: Request) {
  const form = await req.formData()
  const given = String(form.get('passcode') ?? '')
  const next = safeNextPath(String(form.get('next') ?? '/'))
  const expected = process.env.LAB_PASSCODE
  const base = new URL(req.url)

  if (!expected || (await passcodeToken(given)) !== (await passcodeToken(expected))) {
    return NextResponse.redirect(new URL(`/lab-access?error=1&next=${encodeURIComponent(next)}`, base), 303)
  }

  const res = NextResponse.redirect(new URL(next, base), 303)
  res.cookies.set(LAB_COOKIE, await passcodeToken(expected), {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: LAB_COOKIE_MAX_AGE,
  })
  return res
}
