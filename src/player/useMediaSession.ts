'use client'
import { useEffect } from 'react'
import type { PlayerState } from './state'

export function useMediaSession(state: PlayerState, handlers: { toggle(): void; stop(): void }) {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !state.source) return
    const src = state.source
    navigator.mediaSession.metadata = new MediaMetadata({
      title: src.title,
      artist: src.kind === 'episode' ? (src.showName ?? 'Catholic Community Radio') : 'Catholic Community Radio',
      album: 'Catholic Community Media',
      artwork: [{ src: (src.kind === 'episode' && src.artwork) || '/icons/ccm-512.png', sizes: '512x512', type: 'image/png' }],
    })
    navigator.mediaSession.playbackState = state.status === 'playing' ? 'playing' : 'paused'
  }, [state.source, state.status])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    ms.setActionHandler('play', handlers.toggle)
    ms.setActionHandler('pause', handlers.toggle)
    ms.setActionHandler('stop', handlers.stop)
    return () => {
      ms.setActionHandler('play', null)
      ms.setActionHandler('pause', null)
      ms.setActionHandler('stop', null)
    }
  }, [handlers.toggle, handlers.stop])
}
