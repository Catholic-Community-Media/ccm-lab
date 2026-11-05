import type { MarketKey } from '@/lib/markets'

export type LiveSource = { kind: 'live'; marketKey: MarketKey; url: string; title: string; backupPlayerUrl: string }
export type EpisodeSource = { kind: 'episode'; id: string; url: string; title: string; artwork?: string; showName?: string }
export type Source = LiveSource | EpisodeSource
export type Status = 'idle' | 'loading' | 'playing' | 'paused' | 'reconnecting' | 'failed'
export type PlayerState = { source: Source | null; status: Status; attempt: number; failingSince: number | null }

export type Action =
  | { type: 'load'; source: Source }
  | { type: 'playing' }
  | { type: 'waiting' }
  | { type: 'mediaPaused' }
  | { type: 'userPause' }
  | { type: 'error'; now: number }
  | { type: 'ended'; now: number }
  | { type: 'stop' }

export const GIVE_UP_MS = 5 * 60 * 1000
export const STALL_TIMEOUT_MS = 10_000
const DELAYS = [1000, 2000, 4000, 8000, 15000]

export const initialState: PlayerState = { source: null, status: 'idle', attempt: 0, failingSince: null }

export function retryDelayMs(attempt: number): number {
  return DELAYS[attempt - 1] ?? 30000
}

function fail(state: PlayerState, now: number): PlayerState {
  if (!state.source || state.status === 'idle' || state.status === 'paused' || state.status === 'failed') return state
  const failingSince = state.failingSince ?? now
  if (now - failingSince >= GIVE_UP_MS) return { ...state, status: 'failed', failingSince }
  return { ...state, status: 'reconnecting', attempt: state.attempt + 1, failingSince }
}

export function reducer(state: PlayerState, action: Action): PlayerState {
  switch (action.type) {
    case 'load':
      return { source: action.source, status: 'loading', attempt: 0, failingSince: null }
    case 'playing':
      return state.source ? { ...state, status: 'playing', attempt: 0, failingSince: null } : state
    case 'waiting':
      return state.status === 'playing' ? { ...state, status: 'loading' } : state
    case 'mediaPaused':
      return state.status === 'playing' || state.status === 'loading' ? { ...state, status: 'paused' } : state
    case 'userPause':
      return state.source ? { ...state, status: 'paused', attempt: 0, failingSince: null } : state
    case 'error':
      return fail(state, action.now)
    case 'ended':
      if (state.source?.kind === 'live') return fail(state, action.now)
      return state.source ? { ...state, status: 'paused' } : state
    case 'stop':
      return initialState
  }
}
