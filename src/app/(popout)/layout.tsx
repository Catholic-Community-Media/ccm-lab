import '../(frontend)/styles.css'
import '@/player/player.css'
import { getMarkets } from '@/lib/getMarkets'
import { PlayerProvider } from '@/player/PlayerProvider'

export const metadata = { title: 'CCM Radio Player', robots: { index: false, follow: false } }
export const revalidate = 3600

export default async function PopoutLayout({ children }: { children: React.ReactNode }) {
  const markets = await getMarkets()
  return (
    <html lang="en">
      <body style={{ paddingBottom: 0 }}>
        <PlayerProvider markets={markets}>{children}</PlayerProvider>
      </body>
    </html>
  )
}
