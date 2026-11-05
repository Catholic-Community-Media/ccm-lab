# Plan 1 device matrix (2026-11-05)

| Device / browser | Gate + passcode | Play live | Navigate, keeps playing | Lock screen controls + artwork | Background 5 min | Market switch | Reconnect after network drop | Pop out |
|---|---|---|---|---|---|---|---|---|
| iPhone Safari (iOS ver) | | | | | | | | n/a |
| Android Chrome | | | | | | | | n/a |
| macOS Safari | | | | | | | | |
| macOS Chrome | | | | | | | | |
| Windows Edge | | | | | | | | |
| Firefox (desktop) | | | | | | | | |
| VoiceOver (iOS) | | | | | | | | |
| Keyboard only (desktop) | | | | | | | | |

## How to test
1. Open https://ccm-lab.netlify.app and enter the lab passcode.
2. Press Play on the player.
3. Navigate Home <-> Listen Live; audio should keep playing without a gap.
4. Lock the phone; check lock-screen controls and artwork (the artwork is a placeholder logo).
5. Background the browser/app for 5 minutes; audio should continue.
6. Switch market; the new market's stream should play.
7. Toggle airplane mode for 20 s; expect "Reconnecting..." then playback resumes.
8. Desktop only: use Pop out and confirm audio continues in the pop-out window.

Issues found:
