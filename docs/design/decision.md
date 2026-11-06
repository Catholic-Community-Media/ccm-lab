# Visual direction decision

- Date: 2026-11-06
- Chosen direction: c-signal
- Fonts: heading = Barlow (700, 800), body = Nunito Sans (400, 600)
- Tweaks requested:
  - None to the mockup. Signal is taken as it stands, including the bento "Today", "Today in the Church" and micro-interactions added after the first build.
  - Before Phase B, Signal's phone and desktop Home layouts are laid out in Penpot (file "Website 2027", token set `ccm-signal-tokens`, source `design/penpot/ccm-signal-tokens.json`) for adjustment there. Any changes made in Penpot are folded back into the mockup before Task 6.
  - "Today in the Church" card (Penpot, 2026-11-06): the liturgical color is a full-width header band on the card, built like the Give header (icon, eyebrow "Living the liturgical calendar" + date, day name as title, "Color · Season · Rank · Year" subtitle). The separate color/season chips are removed.
- **Liturgical color exception (Christopher, 2026-11-06):** liturgical colors are data, not brand color. On liturgy elements only (the day band, calendar cells, season accents), green, gold, cream (liturgical white), red, rose and violet may be used as large fills. This overrides the "green sparingly" rule and the brand text rule for those elements alone. Text on them uses the paired contrast color:

  | Liturgical color | Fill | Text | Ratio |
  |---|---|---|---|
  | green | #74aa21 | #0b1220 | 6.70 |
  | violet | #5b2a86 | #ffffff | 9.90 |
  | rose | #e9a6bd | #0b1220 | 9.50 |
  | red | #d13239 | #ffffff | 4.97 |
  | white (cream tint) | #f1ede4 | #0b1220 | 16.03 |
  | gold | #ffbd00 | #0b1220 | 11.17 |
  | black | #1f1f24 | #ffffff | 16.41 |

  White days use the cream tint `#f1ede4` from the Ordo sacristy screens, never pure white. White and rose bands also get a 1px `#78716c` hairline (inset), as in Ordo's day band. Penpot token set: `liturgical`.
- Final token values: see the `:root` block of `public/design/c-signal/index.html` at commit ffb2bca.
