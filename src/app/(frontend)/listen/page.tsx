import { getMarkets } from '@/lib/getMarkets'
import { LiveButton } from '../LiveButton'

export const metadata = { title: 'Listen Live — Catholic Community Radio' }
export const revalidate = 3600

export default async function ListenPage() {
  const markets = await getMarkets()
  return (
    <main className="page">
      <h1>Listen Live</h1>
      <LiveButton />
      <section aria-labelledby="on-your-radio">
        <h2 id="on-your-radio">On your radio</h2>
        {markets.map((m) => (
          <div key={m.key}>
            <h3>{m.name}</h3>
            <ul>
              {m.frequencies.map((f) => (
                <li key={f}>{f}</li>
              ))}
            </ul>
          </div>
        ))}
      </section>
      <details>
        <summary>Having trouble? Use the basic player</summary>
        {markets.map((m) => (
          <figure key={m.key}>
            <figcaption>{m.name}</figcaption>
            <audio controls preload="none" src={m.streamUrl} />
          </figure>
        ))}
        <p>
          Still no sound? <a href={markets[0]?.backupPlayerUrl}>Open the StreamGuys player</a>.
        </p>
      </details>
    </main>
  )
}
