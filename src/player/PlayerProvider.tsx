'use client'
import { createContext, useCallback, useContext, useEffect, useMemo, useReducer, useRef, useState } from 'react'
import { pickMarket, type Market, type MarketKey } from '@/lib/markets'
import { initialState, reducer, retryDelayMs, type EpisodeSource, type LiveSource, type PlayerState, type Source } from './state'
import { readStoredMarket, storeMarket } from './storage'
import { useMediaSession } from './useMediaSession'

export type PlayerApi = {
  state: PlayerState
  markets: Market[]
  market: Market | undefined
  setMarket(key: MarketKey): void
  playLive(): void
  playEpisode(source: EpisodeSource): void
  toggle(): void
  resume(): void
  pause(): void
  stop(): void
}

const PlayerContext = createContext<PlayerApi | null>(null)

export function usePlayer(): PlayerApi {
  const ctx = useContext(PlayerContext)
  if (!ctx) throw new Error('usePlayer must be used inside <PlayerProvider>')
  return ctx
}

const liveSourceFor = (m: Market): LiveSource => ({
  kind: 'live',
  marketKey: m.key,
  url: m.streamUrl,
  title: `Live · ${m.name}`,
  backupPlayerUrl: m.backupPlayerUrl,
})

export function PlayerProvider({ markets, children }: { markets: Market[]; children: React.ReactNode }) {
  const audioRef = useRef<HTMLAudioElement>(null)
  const [state, dispatch] = useReducer(reducer, initialState)
  const [marketKey, setMarketKey] = useState<MarketKey | null>(null)
  const market = pickMarket(markets, marketKey)

  useEffect(() => {
    setMarketKey(readStoredMarket())
    const a = audioRef.current
    if (a && !a.dataset.instance) a.dataset.instance = crypto.randomUUID()
  }, [])

  // Only an autoplay block is a user-level pause. Other rejections (AbortError when the
  // src is swapped, network failures) are handled by the element's own events.
  const onPlayRejected = useCallback((err: unknown) => {
    if ((err as { name?: string } | null)?.name === 'NotAllowedError') dispatch({ type: 'userPause' })
  }, [])

  const start = useCallback((source: Source) => {
    const a = audioRef.current
    if (!a) return
    dispatch({ type: 'load', source })
    a.src = source.url
    a.load()
    a.play().catch(onPlayRejected)
  }, [onPlayRejected])

  const playLive = useCallback(() => {
    if (market) start(liveSourceFor(market))
  }, [market, start])

  const playEpisode = useCallback((source: EpisodeSource) => start(source), [start])

  const isActive = state.status === 'playing' || state.status === 'loading' || state.status === 'reconnecting'

  const resume = useCallback(() => {
    const a = audioRef.current
    if (!a || isActive) return
    if (!state.source) return playLive()
    // Live streams rejoin the live edge of the CURRENTLY selected market.
    if (state.source.kind === 'live') return playLive()
    a.play().catch(onPlayRejected)
  }, [isActive, state.source, playLive, onPlayRejected])

  const pause = useCallback(() => {
    const a = audioRef.current
    if (!a || !isActive) return
    a.pause()
    dispatch({ type: 'userPause' })
  }, [isActive])

  const toggle = useCallback(() => (isActive ? pause() : resume()), [isActive, pause, resume])

  const stop = useCallback(() => {
    const a = audioRef.current
    if (a) {
      a.pause()
      a.removeAttribute('src')
      a.load()
    }
    dispatch({ type: 'stop' })
  }, [])

  const setMarket = useCallback(
    (key: MarketKey) => {
      setMarketKey(key)
      storeMarket(key)
      const next = pickMarket(markets, key)
      const active = state.status === 'playing' || state.status === 'loading' || state.status === 'reconnecting'
      if (next && state.source?.kind === 'live' && active) start(liveSourceFor(next))
    },
    [markets, state.source, state.status, start],
  )

  // Media element → reducer
  useEffect(() => {
    const a = audioRef.current
    if (!a) return
    const handlers: Array<[string, () => void]> = [
      ['playing', () => dispatch({ type: 'playing' })],
      ['waiting', () => dispatch({ type: 'waiting' })],
      ['pause', () => {
        // `pause` fires before `ended`; let `ended` drive that case.
        if (!a.ended) dispatch({ type: 'mediaPaused' })
      }],
      ['error', () => dispatch({ type: 'error', now: Date.now() })],
      ['ended', () => dispatch({ type: 'ended', now: Date.now() })],
    ]
    handlers.forEach(([t, fn]) => a.addEventListener(t, fn))
    return () => handlers.forEach(([t, fn]) => a.removeEventListener(t, fn))
  }, [])

  // Reconnect loop
  useEffect(() => {
    if (state.status !== 'reconnecting' || !state.source) return
    const src = state.source
    const timer = setTimeout(() => {
      const a = audioRef.current
      if (!a) return
      a.src = src.url
      a.load()
      a.play().catch(onPlayRejected)
    }, retryDelayMs(state.attempt))
    return () => clearTimeout(timer)
  }, [state.status, state.attempt, state.source, onPlayRejected])

  useMediaSession(state, { resume, pause, stop })

  const api = useMemo<PlayerApi>(
    () => ({ state, markets, market, setMarket, playLive, playEpisode, toggle, resume, pause, stop }),
    [state, markets, market, setMarket, playLive, playEpisode, toggle, resume, pause, stop],
  )

  return (
    <PlayerContext.Provider value={api}>
      {children}
      <audio ref={audioRef} preload="none" data-ccm-audio />
    </PlayerContext.Provider>
  )
}
