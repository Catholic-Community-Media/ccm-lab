# Visual directions

Each direction is a static mockup at `public/design/<id>/index.html`. Screenshots live beside this file in `docs/design/`.

## A. Studio (dark broadcast)

**Intent:** a broadcast studio at night. The live signal is the hero: big confident type, an on-air red LIVE lamp that pulses (not under reduced motion), sky blue as the "signal" accent. Gold is reserved for giving.

**Fonts:** Barlow Condensed 700/800 for headings (uppercase, slight letter-spacing, like on-air lower thirds); Barlow 400/500/600 for body. One Google Fonts link.

**Tokens**

| Token | Value |
|---|---|
| --color-bg | #0e1014 |
| --color-surface | #181b22 |
| --color-surface-2 | #22262f |
| --color-text | #f3f4f6 |
| --color-text-muted | #a7adb8 |
| --color-border | #2e333d |
| --color-brand / -contrast | #d13239 / #ffffff |
| --color-accent / -contrast | #6cc7fe / #0b1220 |
| --color-live / -contrast | #d13239 / #ffffff |
| --color-give / -contrast | #ffbd00 / #0b1220 |
| --color-success / -contrast | #74aa21 / #0b1220 |
| --color-focus | #6cc7fe |
| --color-player-bg / -text / -focus | #0b0d12 / #f3f4f6 / #6cc7fe |
| --font-heading / --font-body | Barlow Condensed stack / Barlow stack |
| --radius-sm / -md / -lg | 0.375rem / 0.75rem / 1.25rem |
| --space-1..6 | 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2.5 rem |
| --step--1..4 | clamp() scale, step-0 minimum 1rem |
| --shadow-1 | 0 0.75rem 2rem rgb(0 0 0 / 0.45) |
| --header-h / --player-h | 4rem / 4.5rem |

(Mockup-local, set on the `html` selector and not in `:root`: `--color-navy` #3954a5 and `--switch-h` 2.75rem for the mockup-state bar.)

**Where each brand color is used**

- **Red #d13239:** LIVE lamp, the large Play live radio button, "On now" card edge, heart bullets in the donor ticker, the video LIVE tag.
- **Sky #6cc7fe:** the "signal" accent: eyebrows, links, active nav underline, segmented control, episode Play buttons and progress lines, player-bar play button, focus ring.
- **Gold #ffbd00:** giving only: Give buttons, amount presets, give panel top rule, pledge thermometer, matching-gift countdown, phone number.
- **Navy #3954a5:** decoration only: a gradient wash behind the live card, poster and player artwork. No text sits directly on pure navy.
- **Green #74aa21:** only the small "On air now" chips.
- **Blue #299cd9:** not used.

Screenshots: `a-studio-phone-normal.png`, `a-studio-phone-pledge.png`, `a-studio-desktop-normal.png`, `a-studio-desktop-pledge.png`.

## B. Parish (warm editorial)

**Intent:** a well-loved parish bulletin made modern. Warm paper background, hairline borders, generous whitespace. Ministry and community (events, news, giving) are as visible as the media. The player bar is navy. Section labels are small caps with a heart motif from the logo as a divider.

**Fonts:** Barlow 700 for headings (sentence case); Source Serif 4 (400/600) for body and story text, the serif used on the on-air World News graphics. One Google Fonts link.

**Tokens**

| Token | Value |
|---|---|
| --color-bg | #fbf7f0 |
| --color-surface | #ffffff |
| --color-surface-2 | #f3ece0 |
| --color-text | #2a2420 |
| --color-text-muted | #6b5f55 |
| --color-border | #e2d8c8 |
| --color-brand / -contrast | #d13239 / #ffffff |
| --color-accent / -contrast | #3954a5 / #ffffff |
| --color-live / -contrast | #d13239 / #ffffff |
| --color-give / -contrast | #ffbd00 / #2a2420 |
| --color-success / -contrast | #74aa21 / #2a2420 |
| --color-focus | #3954a5 |
| --color-player-bg / -text / -focus | #3954a5 / #ffffff / #ffbd00 |
| --font-heading / --font-body | Barlow stack / Source Serif 4 stack |
| --radius-sm / -md / -lg | 0.375rem / 0.75rem / 1.25rem |
| --space-1..6 | 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2.5 rem |
| --step--1..4 | clamp() scale, step-0 minimum 1rem |
| --shadow-1 | 0 0.5rem 1.5rem rgb(74 52 24 / 0.12) |
| --header-h / --player-h | 4rem / 4.5rem |

**Where each brand color is used**

- **Red #d13239:** the large Play live radio button, live lamp, top rule of the live card, the italic "on air now" headline, heart dividers and ticker hearts, the video LIVE tag, Watch quick action.
- **Navy #3954a5:** the accent: small-caps section labels, links, active nav, date badges, segmented control, episode Play buttons, challenge banner, and the player bar.
- **Gold #ffbd00:** giving only: Give buttons, amount presets, give panel top rule, pledge thermometer, and the player-bar top edge and focus ring.
- **Sky #6cc7fe:** only as a soft translucent highlight behind the "On now" card.
- **Green #74aa21:** only the small "On air now" chips.
- **Blue #299cd9:** not used.

Screenshots: `b-parish-phone-normal.png`, `b-parish-phone-pledge.png`, `b-parish-desktop-normal.png`, `b-parish-desktop-pledge.png`.

## C. Signal (bright, app-like)

**Intent:** feels like a great listening app, built from the blue logo. Rounded cards, bold color blocks, a navy player bar, and the blue-background logo as player artwork. Optimistic and clear. In the Pledge drive state the live column carries the Wake Up! poster and a "Live pledge segments today" list (Sample) so it balances the tall give panel.

**Fonts:** Barlow 800 for headings (sentence case); Nunito Sans (400/600) for body, a Google stand-in for the Avenir feel CCM has used. One Google Fonts link.

**Tokens**

| Token | Value |
|---|---|
| --color-bg | #f5f9ff |
| --color-surface | #ffffff |
| --color-surface-2 | #e6f4ff |
| --color-text | #0b1220 |
| --color-text-muted | #4a5a73 |
| --color-border | #d3e2f3 |
| --color-brand / -contrast | #3954a5 / #ffffff |
| --color-accent / -contrast | #299cd9 / #0b1220 |
| --color-live / -contrast | #d13239 / #ffffff |
| --color-give / -contrast | #ffbd00 / #0b1220 |
| --color-success / -contrast | #74aa21 / #0b1220 |
| --color-focus | #d13239 |
| --color-player-bg / -text / -focus | #3954a5 / #ffffff / #ffbd00 |
| --font-heading / --font-body | Barlow stack / Nunito Sans stack |
| --radius-sm / -md / -lg | 0.375rem / 0.75rem / 1.25rem |
| --space-1..6 | 0.25 / 0.5 / 0.75 / 1 / 1.5 / 2.5 rem |
| --step--1..4 | clamp() scale, step-0 minimum 1rem |
| --shadow-1 | 0 0.375rem 1.25rem rgb(57 84 165 / 0.14) |
| --header-h / --player-h | 4rem / 4.5rem |

**Where each brand color is used**

- **Navy #3954a5:** the main color block: live card (navy-to-blue gradient, text kept over the navy end), player bar, menu and player sheets, About block, Listen player, footer, date tiles, challenge banner, thermometer fill, links, selected segment.
- **Blue #299cd9:** the gradient end of the live card only (no text over it); the contract accent token.
- **Red #d13239:** the large Play live radio button, "Live now" chips, On now edge, Watch quick action, focus ring on light surfaces, heart bullets.
- **Gold #ffbd00:** giving only: Give buttons, amount presets, give panel header, thermometer knob, countdown chip, player-bar focus ring.
- **Sky #6cc7fe:** chips and tags (Sample, market chip), episode Play buttons, player-bar play button, state switch, with ink text.
- **Green #74aa21:** only the small "On air now" chips.

Screenshots: `c-signal-phone-normal.png`, `c-signal-phone-pledge.png`, `c-signal-desktop-normal.png`, `c-signal-desktop-pledge.png`.

**2027 trends added (Direction C)**

- **Bento "Today":** at 768px and up the home is a grid of bounded tiles (main is a 12-column grid; the `on-now` section holds an inner bento with named areas). Each tile answers one question or offers one action: On now, Up next, Today in the Church, Continue listening, Recent episodes, Ask for prayer. On phones the tiles stack in the AV-first order the tests check (live, give, on-now, events, news).
- **Today in the Church:** day name, a small liturgical-color chip (green stays a small chip; white is a light chip with a border; red is the brand red), season and rank, a link to the USCCB readings (no reading text reproduced), a "This week" `<details>` list, and a disabled "Today's reflection (audio)" hook marked Coming soon. Data is real romcal 1.3.0 (US calendar) for Fri Nov 6 2026 and the days after; credit line "Liturgical calendar: romcal · Readings: USCCB".
- **Honest micro-interactions:** the play button morphs between play and pause and the signal bars animate only while the mockup is in its playing state. "Give $X" shows a heart pulse and "Thank you!" (stands in for a completed Zeffy gift) and calls `navigator.vibrate?.(30)`. "Ask for prayer" shows a soft check. All motion is transform/opacity only and is off under `prefers-reduced-motion: reduce`.
