# Visual direction decision

- Date: 2026-11-06
- Chosen direction: c-signal
- Fonts: heading = Barlow (700, 800), body = Nunito Sans (400, 600)
- Tweaks requested:
  - None to the mockup. Signal is taken as it stands, including the bento "Today", "Today in the Church" and micro-interactions added after the first build.
  - Before Phase B, Signal's phone and desktop Home layouts are laid out in Penpot (file "Website 2027", token set `ccm-signal-tokens`, source `design/penpot/ccm-signal-tokens.json`) for adjustment there. Any changes made in Penpot are folded back into the mockup before Task 6.
  - "Today in the Church" card (Penpot, 2026-11-06): the liturgical color is a full-width header band on the card, built like the Give header (icon, eyebrow "Living the liturgical calendar" + date, day name as title, "Color · Season · Rank · Year" subtitle). The separate color/season chips are removed.
  - Home hero = Option B (2026-11-06): the Live now card spans the hero; **Give now** (gold, opens the Zeffy modal / phone sheet) sits right beside **Play live radio**. Under them, "Join a club:" pills (Coffee Club, St. Carlo Acutis Club, Blessed Fulton Sheen Circle; each to `/give/<club>` with its own Zeffy embed), then Give monthly and the pledge phone. The separate Give card and the $25/$50/$100 buttons are removed (Zeffy can't take a preset amount). Live version: the Wake Up! video takes the artwork slot. On phones the hero gradient stays navy to 80% so white text never sits on blue.
- **Liturgical color exception (Christopher, 2026-11-06):** liturgical colors are data, not brand color. On liturgy elements only (the day band, calendar cells, season accents), green, gold, cream (liturgical white), red, rose and violet may be used as large fills. This overrides the "green sparingly" rule and the brand text rule for those elements alone. Text on them uses the paired contrast color:

  | Liturgical color | Derived from | Fill | Text | Ratio |
  |---|---|---|---|---|
  | green | brand green | #74aa21 | #0b1220 | 6.70 |
  | red | brand red | #d13239 | #ffffff | 4.97 |
  | gold | brand gold | #ffbd00 | #0b1220 | 11.17 |
  | violet | 55% navy + 35% red + 10% ink | #6a4272 | #ffffff | 7.97 |
  | rose | 40% red + 10% navy + 50% white | #d99ca7 | #0b1220 | 8.26 |
  | white (cream tint) | 10% gold + 3% ink + 87% white | #f8f1df | #0b1220 | 16.62 |
  | black | 85% ink + 15% navy | #121c34 | #ffffff | 16.92 |

  The liturgical colors are developed from the CCM palette, not copied from the Ordo engine's sacristy colors (Christopher's call). Liturgical white is always a cream tint, never pure white, as on the Ordo sacristy screens. White and rose bands get a 1px inset hairline in a navy tint, `#9caad2`. Penpot token set: `liturgical`; swatch board "Liturgical colors (brand-derived)" on the Home page.
- Final token values: see the `:root` block of `public/design/c-signal/index.html` at commit ffb2bca.
