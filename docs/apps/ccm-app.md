# CCM app (Lightcast)

The CCM app is built and published by Lightcast. It carries Wake Up! live and all VOD (video and audio). Podbean holds the Wake Up! archive.

Source: the app configuration embedded in https://catholiccommunity-media.lightcast.com/ (Lightcast web app), read on 2026-11-06. The page renders client-side, so the links were taken from its HTML.

| Platform | Store link |
|---|---|
| iPhone / iPad | https://apps.apple.com/us/app/catholic-community-media/id1218829801 |
| Apple TV | https://apps.apple.com/us/app/catholic-community-radio/id1218829801 (same App Store app id as iOS; older "catholic-community-radio" slug, which Apple redirects) |
| Android | https://play.google.com/store/apps/details?id=com.lightcast.catholiccommunitymedia |
| Roku | https://channelstore.roku.com/en-ca/details/2bc34dde3ec5da38831fe19b6042fee9:74a87143c299b37684a5f97ba428cdf9/catholic-community-media (Lightcast lists the en-ca store; check whether an en-us path is preferred) |
| Fire TV | https://www.amazon.com/gp/product/B0CR32YBM1 |
| Web | https://catholiccommunity-media.lightcast.com/ |

Lightcast's platform list also names Android TV, but there is no published Android TV entry.

## Use on the site

- The "Get the CCM app" home card shows App Store and Google Play badges plus "Also on your TV: Roku · Apple TV · Fire TV".
- Store URLs belong in the `siteSettings` global (fields such as `appIosUrl`, `appAndroidUrl`, `appRokuUrl`, `appAppleTvUrl`, `appFireTvUrl`) so staff can change them without a deploy.
- Use the official Apple and Google badge artwork and follow their guidelines. Don't redraw the badges.
