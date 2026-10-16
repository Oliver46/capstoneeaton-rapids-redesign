# Testing report

Run on **Oct 15, 2026** (re-run after the speed, image and SEO optimization) against a local static server (`python3 -m http.server`) in headless Chromium 141 (Playwright), with the time zone set to America/Detroit.
**The Google Maps embed was blocked in the test environment**, so the map itself was not rendered or measured. All other assets were served locally.

## Tests performed

| Test | Tool | Result |
|---|---|---|
| Lighthouse, mobile | Lighthouse (default mobile throttling), served with gzip + caching (`http-server -g`, production-like) | **Performance 99 · Accessibility 100 · Best Practices 100 · SEO 100**. FCP 1.3 s, LCP 1.9 s, CLS 0.001, TBT 0 ms, 160 KB (was 97, 2.4 s, 254 KB before optimization) |
| Lighthouse, desktop | Lighthouse `--preset=desktop`, gzip | **Performance 100 · Accessibility 100 · Best Practices 100 · SEO 100**. FCP 0.4 s, LCP 0.5 s, CLS 0.002, TBT 0 ms, 177 KB |
| Automated accessibility | axe-core 4 (WCAG 2.0/2.1/2.2 A and AA, plus best practices) at 375 px and 1280 px | **0 violations**. axe marked color contrast as "needs review", so it was checked by hand (below) |
| Color contrast | Manual calculation of every text/background token pair | All text 6.65:1 or higher (AA requires 4.5:1). Secondary-button border 3.87:1 (3:1 required) |
| HTML validation | html-validate (recommended rules) | 0 errors. Four stylistic rules were turned off on purpose: lowercase doctype; tel numbers kept readable (wrapping is prevented with CSS instead); explicit `role="list"` (needed because Safari removes list semantics when bullets are hidden) |
| JSON-LD | JSON parse + manual review against Schema.org `MedicalClinic` | Parses; values match the visible page. **Not yet run through Google's Rich Results Test** (needs the live URL) |
| Horizontal overflow | Playwright at 320, 375, 768, 1024, 1152, 1279, 1280, 1440 px | No horizontal scroll at any width (a 320 px header overflow was found and fixed) |
| Console errors | Playwright | None at any width |
| Fonts | `document.fonts` + visual check | Subset static fonts all load (Fraunces 600, Atkinson 400/700, Playfair 500 + 400 italic); every character on the page renders (incl. ’ – · © ‑) |
| Today's hours | Playwright, Thursday in Eastern Time | Hero shows "Thursday: 8:00 AM – 5:00 PM" with the lunch note; the Thursday table row has a "Today" badge |
| Mobile menu, keyboard | Playwright: focus the Menu button, press Enter, then Escape | Opens (`aria-expanded="true"`), closes on Escape, focus returns to the button |
| Skip link | Playwright: Tab, then Enter | First tab stop is "Skip to main content"; focus moves to `<main>` |
| Tab order (desktop) | Playwright, 14 Tab presses | Skip link → logo → 5 nav links → Patient Portal → Call → hero CTAs → directions… (logical, matches visual order) |
| Focus visibility on the maroon band | Screenshot | Gold ring clearly visible |
| JavaScript disabled | Playwright | Page fully usable; nav shows as links; hero shows the full weekly hours; no overflow |
| Heading alignment | Playwright at 375, 768, 1280, 1440 px | All six section H1/H2s and eyebrows start at the same x position and share one size per breakpoint |
| Refactor (Oct 15) | Before/after comparison: Playwright screenshots (fixed clock, reduced motion) + behavior dumps | Pixel-identical at 320, 390, 768, 1024, 1280, 1366, 1440, 1920 px, mobile menu open, all FAQs open, focus rings on 7 surfaces, print. 16 hours/holiday scenarios identical (incl. typo in hours.js and JavaScript off) |
| hours.js (Oct 15) | Playwright, fixed clock, browser in Pacific time, hours.js edited on the fly | Default file: table, hero, lunch note, footer, FAQ text and both JSON-LD blocks match. Thanksgiving switched on: "Upcoming: closed Thursday, Nov 26" shown the Monday before; on the day the status, hero and table show the closure. Changed week (Fri 8–4:30, Sat 9–12, no lunch): every display and the structured data update. A typo in hours.js: page falls back to the HTML hours, menu and status still work. Lighthouse mobile 99 / desktop 100; axe 0; HTML valid; no overflow |
| Audit fixes (Oct 15, re-run) | Playwright with a fixed clock (browser in Pacific time) + a test holiday list | Status correct at 7:30, 12:20 and 17:30 Thu, 12:30 Fri, Sat and Sun, and on a test Thanksgiving (closed) and day after (9–12): "opens tomorrow / Friday / Monday at…" skips closed days; table row shows the holiday. Minified CSS pixel-identical to source at 390/1024/1440 px. Lighthouse mobile 99 (LCP 1.9 s, 164 KB; 99–100 across runs) and desktop 100; accessibility, best practices and SEO 100; axe 0 violations (all FAQs open); HTML valid; no unused CSS; no overflow 320–1920 px |
| UX/SEO fixes (Oct 15, re-run) | Playwright with a fixed clock, browser set to Pacific time | Open-now status correct at 7:30, 9:10, 12:20, 15:00, 17:30 Thu, 10:00 and 12:30 Fri, and Sat (all Eastern). Lighthouse mobile 100 (LCP 1.7 s, 166 KB), desktop 100; axe 0 violations; HTML valid; both JSON-LD blocks parse; no overflow 320–1440 px |
| Text over the new real photos (Oct 15, re-run) | Same method | Lowest: Contact eyebrow 5.3:1, Services eyebrow 5.5:1; every other text 8.7:1 or higher. Lighthouse after the swap: mobile 99 (LCP 1.9 s, 175 KB), desktop 100 (204 KB); axe 0 violations; HTML valid; no overflow 320–1440 px |
| Text over photos (Hero, Services, New Patients, Contact) | Text made transparent, screenshot, then the worst background pixel under every text box, 6 widths × up to 4 scroll positions | Hero 7.2:1, Services 5.5:1, New Patients 7.2:1, Contact 4.8:1 (eyebrow at 768 px; headings 10.4:1+). Contact first measured 2.4–3.7:1 on tablet/phone/1024 px; fixed by darkening the photo fade behind the heading. AA needs 4.5:1 |
| Provider card colors | Manual contrast calculation | Cream on espresso 13.6:1, gold on espresso 9.0:1, bio text 10.4:1 |
| Insurance card colors | Manual contrast calculation | Cream on espresso 13.6:1, gold on espresso 9.0:1, brown on ivory 11.3:1, muted brown on tan 5.5:1 (lowest) |
| New Patients photo (waiting-room) | Playwright at 320–1440 px | Loads at every width (WebP 800/1264, JPEG fallback), no failed requests, `alt=""`, no edge seam |
| New Patients photo fails to load | Playwright with the image request blocked | Section falls back to solid burgundy; all text and buttons stay readable |
| Section order | Playwright | Services > Provider > New Patients > Insurance > Contact; header and footer nav match; tab order follows |
| Hero height | Playwright at 2560×1440, 1920×1080, 1440×900, 1366×768, 1280×800, 1024×768, 1024×1366, 768×1024, 414×896, 375×667, 320×568 | Hero equals the screen height below the header on every desktop/laptop/tablet-landscape size, with all content visible. On phones and portrait tablets the content is taller than the screen, so the hero grows past it instead of clipping |
| Services parallax | Playwright at 320–1440 px | Background moves with scroll (e.g. −40 px → +1 px over 300 px of scroll at 1280); `prefers-reduced-motion: reduce` turns it off (transform `none`); no overflow; axe 0 violations in the section |
| Images | Playwright + file check | Chromium loads the AVIF version of every photo at both 375 and 1440 px; 44 referenced files all exist on the deployed folder and every image's content matches its extension; provider photo never upscaled past its 298 px source |
| Share image | Render + pixel check | 1200 × 630 JPEG, 120 KB; identical pixels after transfer to the project folder |

Current full-page screenshots are in `docs/screenshots/` (`home-390.jpg`, `home-1024.jpg`, `home-1440.jpg`).

## Not yet tested (do these after deployment)
- Lighthouse and Core Web Vitals on the **live** server with the real map. Field data (CrUX/Search Console) is needed for INP.
- Google Rich Results Test and validator.schema.org on the live URL.
- Real-device checks: iPhone Safari with VoiceOver, Android Chrome with TalkBack, and Windows with NVDA.
- 200% and 400% browser zoom by hand (the layout is fluid and uses rem units, but this was not checked manually).
- Tapping the `tel:` links on a real phone, and the Patient Portal and directions links (external sites were blocked here).
- The holiday `SPECIAL_DATES` path (the logic is in place, but no confirmed dates exist yet).

## Remaining Lighthouse suggestions (server-side, not code)
- Cache lifetimes and text compression. The test server sends neither; see the `.htaccess` sample in the README.
- Minification of CSS and JS (saves about 7 KB; optional).
