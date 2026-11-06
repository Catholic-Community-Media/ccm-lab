# Zeffy embeds (for the giving implementation)

Supplied by Christopher on 2026-11-06. These are CCM's live Zeffy forms. Use this file to seed the `giving` global (spec §3) and to build the Zeffy embed component (spec §6).

## Forms

| Use | Seed name | Zeffy form type | `data-form-url` | Full embed URL |
|---|---|---|---|---|
| General giving: **Give now** in the hero, header and player bar; Donate page | Become a Mission Partner Today | donation-form | `/embed/donation-form/become-a-mission-partner-today` | https://www.zeffy.com/embed/donation-form/become-a-mission-partner-today |
| Club page `/give/st-carlo-acutis-club` | St. Carlo Acutis Club | ticketing | `/embed/ticketing/catholic-community-medias-saint-carlo-acutis-club` | https://www.zeffy.com/embed/ticketing/catholic-community-medias-saint-carlo-acutis-club |
| Club page `/give/blessed-fulton-sheen-circle` | Blessed Fulton Sheen Circle | ticketing | `/embed/ticketing/catholic-community-medias-blessed-fulton-j-sheen-circle` | https://www.zeffy.com/embed/ticketing/catholic-community-medias-blessed-fulton-j-sheen-circle |
| Club page `/give/coffee-club` | Coffee Club | ? | **not supplied yet** | **not supplied yet** |

Notes:
- The two clubs are Zeffy **ticketing** forms, not donation forms. That's how Zeffy does recurring membership tiers, so the club pages must accept either type.
- Coffee Club's embed is still to come from Christopher.

## Zeffy's embed pattern (verbatim, General form)

```html
<div>
  <div data-zeffy-embed data-form-url="/embed/donation-form/become-a-mission-partner-today"></div>
  <div data-zeffy-embed-fallback style="display:none;">
    <div style="position:relative;overflow:hidden;height:450px;width:100%;"><iframe title='Donation form powered by Zeffy' style='position: absolute; border: 0; top:0;left:0;bottom:0;right:0;width:100%;height:100%' data-zeffy-embed-src='https://www.zeffy.com/embed/donation-form/become-a-mission-partner-today' allowpaymentrequest allowTransparency="true"></iframe></div>
  </div>
  <script
    src="https://www.zeffy.com/embed/v2/zeffy-embed.js"
    onerror="document.querySelectorAll('[data-zeffy-embed-fallback]').forEach(function(el){el.style.display='block';el.querySelectorAll('iframe[data-zeffy-embed-src]').forEach(function(f){f.src=f.getAttribute('data-zeffy-embed-src');});});">
  </script>
</div>
```

The club snippets are identical except for the form URL. Their fallback wrapper also has `padding-top:450px;`.

### Club snippet (St. Carlo Acutis, verbatim)

```html
<div>
  <div data-zeffy-embed data-form-url="/embed/ticketing/catholic-community-medias-saint-carlo-acutis-club"></div>
  <div data-zeffy-embed-fallback style="display:none;">
    <div style="position:relative;overflow:hidden;height:450px;width:100%;padding-top:450px;"><iframe title='Donation form powered by Zeffy' style='position: absolute; border: 0; top:0;left:0;bottom:0;right:0;width:100%;height:100%' data-zeffy-embed-src='https://www.zeffy.com/embed/ticketing/catholic-community-medias-saint-carlo-acutis-club' allowpaymentrequest allowTransparency="true"></iframe></div>
  </div>
  <script
    src="https://www.zeffy.com/embed/v2/zeffy-embed.js"
    onerror="document.querySelectorAll('[data-zeffy-embed-fallback]').forEach(function(el){el.style.display='block';el.querySelectorAll('iframe[data-zeffy-embed-src]').forEach(function(f){f.src=f.getAttribute('data-zeffy-embed-src');});});">
  </script>
</div>
```

### Club snippet (Blessed Fulton Sheen, verbatim)

```html
<div>
  <div data-zeffy-embed data-form-url="/embed/ticketing/catholic-community-medias-blessed-fulton-j-sheen-circle"></div>
  <div data-zeffy-embed-fallback style="display:none;">
    <div style="position:relative;overflow:hidden;height:450px;width:100%;padding-top:450px;"><iframe title='Donation form powered by Zeffy' style='position: absolute; border: 0; top:0;left:0;bottom:0;right:0;width:100%;height:100%' data-zeffy-embed-src='https://www.zeffy.com/embed/ticketing/catholic-community-medias-blessed-fulton-j-sheen-circle' allowpaymentrequest allowTransparency="true"></iframe></div>
  </div>
  <script
    src="https://www.zeffy.com/embed/v2/zeffy-embed.js"
    onerror="document.querySelectorAll('[data-zeffy-embed-fallback]').forEach(function(el){el.style.display='block';el.querySelectorAll('iframe[data-zeffy-embed-src]').forEach(function(f){f.src=f.getAttribute('data-zeffy-embed-src');});});">
  </script>
</div>
```

## How it works

- `https://www.zeffy.com/embed/v2/zeffy-embed.js` scans the page for `[data-zeffy-embed]` elements and mounts the form named by `data-form-url` (a path on www.zeffy.com).
- If the script fails to load, its `onerror` reveals `[data-zeffy-embed-fallback]` and copies `data-zeffy-embed-src` into the iframe's `src` (lazy: the iframe stays empty until then). The result is a plain 450px-tall iframe.
- `allowpaymentrequest` on the fallback iframe is what lets Apple Pay / Google Pay (Payment Request API) work inside it. Keep it.

## Implementation notes (React / Next)

- Build one `<ZeffyEmbed formPath="/embed/…" />` component that renders the two divs and loads the script once per page with `next/script` (`strategy="lazyOnload"`). Store only the `formPath` in Payload. Derive the full fallback URL as `https://www.zeffy.com${formPath}`, and validate it against `^/embed/(donation-form|ticketing)/[a-z0-9-]+$`.
- Script-injected widgets don't re-scan after client-side navigation. When the component mounts after the script is already loaded, re-trigger the mount (check whether `zeffy-embed.js` exposes an init function), or fall back to rendering the iframe directly. Verify in spike 3.
- Render the fallback as JSX, not an inline `onerror` string. Use `<Script onError>` to switch to the iframe, and also switch if nothing has mounted after about 8 seconds (spec §6).
- Drop the clubs' `padding-top:450px`. With the absolutely positioned iframe it only adds an empty band, and the general form's fallback doesn't have it. Use one fallback wrapper for all forms. Tune the height per form type in spike 3; ticketing forms may need more than 450px.
- Content-Security-Policy, if or when we add one: `script-src https://www.zeffy.com` and `frame-src https://www.zeffy.com`.
- Give now in the hero, header and player bar opens the **General** form in the modal / phone sheet, so the persistent player keeps playing. Club pages embed their form inline (spec §4, club page).
