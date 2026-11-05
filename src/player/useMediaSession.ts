'use client'
import { useEffect } from 'react'
import type { PlayerState } from './state'

export function useMediaSession(state: PlayerState, handlers: { resume(): void; pause(): void; stop(): void }) {
  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator) || !state.source) return
    const src = state.source
    navigator.mediaSession.metadata = new MediaMetadata({
      title: src.title,
      artist: src.kind === 'episode' ? (src.showName ?? 'Catholic Community Radio') : 'Catholic Community Radio',
      album: 'Catholic Community Media',
      artwork: [{ src: (src.kind === 'episode' && src.artwork) || '/icons/ccr-logo-blue-bg-512x512.png', sizes: '512x512', type: 'image/png' }],
    })
    navigator.mediaSession.playbackState = state.status === 'playing' || state.status === 'loading' || state.status === 'reconnecting' ? 'playing' : 'paused'
  }, [state.source, state.status])

  useEffect(() => {
    if (typeof navigator === 'undefined' || !('mediaSession' in navigator)) return
    const ms = navigator.mediaSession
    ms.setActionHandler('play', handlers.resume)
    ms.setActionHandler('pause', handlers.pause)
    ms.setActionHandler('stop', handlers.stop)
    return () => {
      ms.setActionHandler('play', null)
      ms.setActionHandler('pause', null)
      ms.setActionHandler('stop', null)
    }
  }, [handlers.resume, handlers.pause, handlers.stop])
}
