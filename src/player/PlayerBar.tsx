'use client'
import type { MarketKey } from '@/lib/markets'
import { usePlayer } from './PlayerProvider'

const DONATE_URL = 'https://catholiccommunityradio.org/donate'

export function PlayerBar({ variant = 'bar' }: { variant?: 'bar' | 'full' }) {
  const { state, markets, market, setMarket, toggle, stop } = usePlayer()
  if (!market) return <div className={`player player--${variant}`}>Live radio isn&apos;t configured yet.</div>

  const active = state.status === 'playing' || state.status === 'loading' || state.status === 'reconnecting'
  const label = active ? 'Pause' : !state.source || state.source.kind === 'live' ? 'Play live radio' : 'Play'
  const title = state.source?.title ?? `Live · ${market.name}`
  const backupUrl = state.source?.kind === 'live' ? state.source.backupPlayerUrl : market.backupPlayerUrl

  const popOut = () => {
    const win = window.open('/player', 'ccm-player', 'popup,width=380,height=600')
    if (win) stop()
  }

  return (
    <section className={`player player--${variant}`} aria-label="Radio player">
      <button type="button" className="player__toggle" onClick={toggle} aria-label={label}>
        <span aria-hidden="true">{active ? '❚❚' : '▶'}</span>
      </button>
      <div className="player__info">
        <strong className="player__title">{title}</strong>
        <span className="player__status" aria-live="polite">
          {state.status === 'loading' && 'Connecting…'}
          {state.status === 'reconnecting' && 'Reconnecting…'}
          {state.status === 'failed' && (
            <>
              Can&apos;t reach the stream.{' '}
              <a href={backupUrl} target="_blank" rel="noopener">
                Open backup player
              </a>
            </>
          )}
        </span>
      </div>
      <label className="player__market">
        <span className="visually-hidden">Market</span>
        <select aria-label="Market" value={market.key} onChange={(e) => setMarket(e.target.value as MarketKey)}>
          {markets.map((m) => (
            <option key={m.key} value={m.key}>
              {m.name}
            </option>
          ))}
        </select>
      </label>
      {variant === 'bar' ? (
        <button type="button" className="player__popout" onClick={popOut}>
          Pop out
        </button>
      ) : null}
      <a className="player__donate" href={DONATE_URL} target="_blank" rel="noopener">
        Donate
      </a>
    </section>
  )
}
