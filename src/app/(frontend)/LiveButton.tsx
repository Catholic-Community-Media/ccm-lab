'use client'
import { usePlayer } from '@/player/PlayerProvider'

export function LiveButton() {
  const { playLive, market } = usePlayer()
  if (!market) return null
  return (
    <button type="button" className="cta" onClick={playLive}>
      Listen live — {market.name}
    </button>
  )
}
