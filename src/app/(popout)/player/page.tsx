import { PlayerBar } from '@/player/PlayerBar'

export default function PopoutPlayerPage() {
  return (
    <main className="page narrow" style={{ paddingBottom: '1.5rem' }}>
      <h1 className="visually-hidden">Catholic Community Radio player</h1>
      <PlayerBar variant="full" />
    </main>
  )
}
