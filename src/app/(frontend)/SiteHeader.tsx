import Link from 'next/link'

export function SiteHeader() {
  return (
    <header className="site-header">
      <nav aria-label="Main">
        <Link href="/">Home</Link>
        <Link href="/listen">Listen Live</Link>
      </nav>
    </header>
  )
}
