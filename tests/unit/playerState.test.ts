import { describe, expect, it } from 'vitest'
import { GIVE_UP_MS, STALL_TIMEOUT_MS, initialState, reducer, retryDelayMs, type Source } from '@/player/state'

const live: Source = { kind: 'live', marketKey: 'br', url: 'https://s/br', title: 'Live · Baton Rouge', backupPlayerUrl: 'https://p' }
const ep: Source = { kind: 'episode', id: 'e1', url: 'https://a/e1.mp3', title: 'Wake Up! 11/5' }

const loaded = reducer(initialState, { type: 'load', source: live })
const playing = reducer(loaded, { type: 'playing' })

describe('player reducer', () => {
  it('load → loading, playing → playing', () => {
    expect(loaded).toMatchObject({ status: 'loading', source: live, attempt: 0 })
    expect(playing.status).toBe('playing')
  })

  it('user pause always pauses', () => {
    expect(reducer(playing, { type: 'userPause' }).status).toBe('paused')
    const reconnecting = reducer(playing, { type: 'error', now: 0 })
    expect(reducer(reconnecting, { type: 'userPause' }).status).toBe('paused')
  })

  it('media pause events do not cancel a reconnect', () => {
    const reconnecting = reducer(playing, { type: 'error', now: 0 })
    expect(reducer(reconnecting, { type: 'mediaPaused' }).status).toBe('reconnecting')
    expect(reducer(playing, { type: 'mediaPaused' }).status).toBe('paused')
  })

  it('errors move to reconnecting and count attempts', () => {
    const r1 = reducer(playing, { type: 'error', now: 1000 })
    const r2 = reducer(r1, { type: 'error', now: 3000 })
    expect(r1).toMatchObject({ status: 'reconnecting', attempt: 1, failingSince: 1000 })
    expect(r2).toMatchObject({ status: 'reconnecting', attempt: 2, failingSince: 1000 })
  })

  it('gives up after 5 minutes of continuous failure', () => {
    const r1 = reducer(playing, { type: 'error', now: 0 })
    expect(reducer(r1, { type: 'error', now: GIVE_UP_MS }).status).toBe('failed')
  })

  it('recovering resets attempts', () => {
    const r1 = reducer(playing, { type: 'error', now: 0 })
    expect(reducer(r1, { type: 'playing' })).toMatchObject({ status: 'playing', attempt: 0, failingSince: null })
  })

  it('errors while idle or paused are ignored', () => {
    expect(reducer(initialState, { type: 'error', now: 0 })).toBe(initialState)
    const paused = reducer(playing, { type: 'userPause' })
    expect(reducer(paused, { type: 'error', now: 0 })).toBe(paused)
  })

  it('a live stream ending is treated as a drop; an episode ending pauses', () => {
    expect(reducer(playing, { type: 'ended', now: 0 }).status).toBe('reconnecting')
    const epPlaying = reducer(reducer(initialState, { type: 'load', source: ep }), { type: 'playing' })
    expect(reducer(epPlaying, { type: 'ended', now: 0 }).status).toBe('paused')
  })

  it('a stall timeout error while loading moves to reconnecting', () => {
    expect(reducer(loaded, { type: 'error', now: 0 })).toMatchObject({ status: 'reconnecting', attempt: 1 })
    expect(STALL_TIMEOUT_MS).toBe(10_000)
  })

  it('waiting from playing goes back to loading', () => {
    expect(reducer(playing, { type: 'waiting' }).status).toBe('loading')
  })

  it('load after failed resets attempt and failingSince', () => {
    const failed = reducer(reducer(playing, { type: 'error', now: 0 }), { type: 'error', now: GIVE_UP_MS })
    expect(failed.status).toBe('failed')
    expect(reducer(failed, { type: 'load', source: live })).toMatchObject({ status: 'loading', attempt: 0, failingSince: null })
  })

  it('stop clears everything', () => {
    expect(reducer(playing, { type: 'stop' })).toEqual(initialState)
  })
})

describe('retryDelayMs', () => {
  it('follows 1s, 2s, 4s, 8s, 15s, then 30s', () => {
    expect([1, 2, 3, 4, 5, 6, 20].map(retryDelayMs)).toEqual([1000, 2000, 4000, 8000, 15000, 30000, 30000])
  })
})
