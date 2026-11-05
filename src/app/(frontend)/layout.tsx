import './styles.css'
import '@/player/player.css'
import { getMarkets } from '@/lib/getMarkets'
import { PlayerProvider } from '@/player/PlayerProvider'
import { PlayerBar } from '@/player/PlayerBar'
import { SiteHeader } from './SiteHeader'

export const metadata = {
  title: 'Catholic Community Media — Lab',
  robots: { index: false, follow: false },
}

export const revalidate = 3600

export default async function FrontendLayout({ children }: { children: React.ReactNode }) {
  const markets = await getMarkets()
  return (
    <html lang="en">
      <body>
        <PlayerProvider markets={markets}>
          <SiteHeader />
          {children}
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  )
}
