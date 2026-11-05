# Spike 1: StreamGuys stream discovery (2026-11-05)

Method: curl only (no browser).

## Player and config
- Player: `https://player.streamguys.com/ccr/sgplayer3/player.php?l=layout-standard` (SGPlayer v3, loads `config.json`).
- Config: `https://player.streamguys.com/ccr/sgplayer3/config.json` lists three streams, all MP3 (`audio/mpeg`), Icecast 2.4.0-kh22 host `ccr.streamguys1.com`.

| Station | Config src | Verified |
|---|---|---|
| Baton Rouge | `//ccr.streamguys1.com/batonrouge` | YES: HTTP 200, audio/mpeg, `MPEG ADTS, layer III, v1, 96 kbps, 44.1 kHz, Monaural` (header icy-br 120, name "WPYR 1380AM") |
| New Orleans | `//ccr.streamguys1.com/neworleans` | NO: HTTP 404 (https, http, .mp3 variants all 404). Mount not in Icecast `status-json.xsl` source list, i.e. source encoder not connected at test time |
| Overflow | `//ccr.streamguys1.com/overflow` | YES: 200, MPEG ADTS 128 kbps stereo (not a market) |

Icecast `https://ccr.streamguys1.com/status-json.xsl` currently lists only `/batonrouge` and `/overflow` as live.

## Metadata
Not a plain URL. Player uses socket.io via `https://jetio.streamguys.com` (key `a7d60d58625f4af79e21e504459d361e5d67e055`; scraperId BR `895356e0-50a8-440d-93a2-1cd5374e29f1`, NOLA `d3ea7923-5ba7-49c3-9824-76bc9946b20b`). Socket.io handshake responds (EIO=3 polling). Event protocol not yet reverse-engineered. Fallback: Icecast `status-json.xsl` `title` field (absent on batonrouge currently), or ICY in-stream metadata.

## Backup player
Only the shared player URL found; per-market selection is by `activeStreamIndex` (server-side), no market-specific URL discovered.

## Open
New Orleans mount `/neworleans` unreachable. Need Christopher/StreamGuys to confirm the mount name and that the NOLA encoder is live.

**Open item:** NOLA mount `/neworleans` returns 404 and is absent from Icecast status as of 2026-11-05 13:54 CT; awaiting Christopher/StreamGuys confirmation. Seeded from StreamGuys' own config.json per controller ruling. `/overflow` exists (128k stereo) but isn't a market.
