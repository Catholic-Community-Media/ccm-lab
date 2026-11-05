import { NextResponse, type NextRequest } from 'next/server'
import { LAB_COOKIE, isExemptPath, isLabAuthorized } from './lib/labGate'

export async function proxy(req: NextRequest) {
  const { pathname, search } = req.nextUrl
  if (isExemptPath(pathname)) return NextResponse.next()
  if (await isLabAuthorized(req.cookies.get(LAB_COOKIE)?.value, process.env.LAB_PASSCODE)) {
    return NextResponse.next()
  }
  const url = req.nextUrl.clone()
  url.pathname = '/lab-access'
  url.search = `?next=${encodeURIComponent(pathname + search)}`
  return NextResponse.redirect(url)
}

export const config = {
  matcher: ['/((?!_next/static|_next/image).*)'],
}
