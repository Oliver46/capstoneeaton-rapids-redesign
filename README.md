# Capstone Family Practice: website redesign

A static one-page site for https://www.capstoneeatonrapids.com/ built with semantic HTML5, plain CSS and vanilla JavaScript. It has no frameworks, no build step and no third-party scripts. The only third-party embed is the Google Map.

> **Before launch:** work through `docs/CONFIRM.md` with the practice. Several items on the page (service descriptions, new-patient steps, weekend hours) are drafts or assumptions marked `<!-- CONFIRM: … -->` in `index.html`.

## Project structure

```
index.html            Page markup, meta tags, JSON-LD and the inline SVG icon sprite
styles.css            All styles; design tokens are at the top (:root). EDIT THIS ONE
styles.min.css        What the page loads, built from styles.css (run: python3 tools/minify-css.py)
hours.js              OFFICE HOURS, LUNCH, HOLIDAYS AND ONE-OFF CLOSURES (the only file to edit for hours)
script.js             Mobile menu, hours display, open-now status, menu highlight, footer year (no dependencies)
robots.txt            Allows crawling and points to the sitemap
sitemap.xml           Single-URL sitemap (update <lastmod> when content changes)
site.webmanifest      Icons and theme color for home-screen bookmarks
assets/
  fonts/              Fraunces 600, Playfair Display 500 + 400 italic, Atkinson Hyperlegible 400/700 (Latin subset, WOFF2)
  images/             Generated photos (hero, Services, New Patients, FAQ), provider photo, logo, share image
  images/originals/   Full-quality sources the images are built from (not uploaded)
  icons/              favicon.ico, 32 px PNG, Apple touch icon, 192/512 manifest icons
tools/
  optimize-images.py  Rebuilds every image from assets/images/originals/
  minify-css.py       Rebuilds styles.min.css from styles.css
docs/
  AUDIT.md            Audit of the original site
  REDESIGN-PROMPT.md  The brief this build follows
  CONFIRM.md          Practice details awaiting confirmation (read first)
  CHANGES.md          Layout, visual, accessibility, SEO and performance improvements
  TESTING.md          Tests actually run, with results
  screenshots/        Current full-page screenshots (phone, laptop, desktop)
```

## Run locally

The page works when you open `index.html` directly. To test it the way it will be served (fonts, `./` links, Lighthouse), use any static server from this folder:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```

## Common edits

| Task | Where |
|---|---|
| Add a provider | Duplicate the `<article class="provider-card">` block. Change the heading to "Meet our providers". |
| Colors, fonts, spacing | CSS custom properties at the top of `styles.css`. **After any CSS change, run `python3 tools/minify-css.py`** (the page loads `styles.min.css`). Shared components (section heading, card, panel) are in section 6 of the stylesheet. |
| Hero photo | The practice's original family photo: source `assets/images/originals/family.jpg` → `family-480/640` (AVIF/WebP/JPEG). Drop in a larger original with the same name and rerun the script to make it sharper. Reframe with `object-position` on `.hero-img`. |
| New Patients photo | Your photo, `originals/waiting-room.webp` → `waiting-room.jpeg` (fallback) plus `waiting-room-800/1264` (AVIF/WebP). Reframe with `object-position` on `.np-img`. |
| FAQ background photo | `assets/images/faq-bg*.{avif,webp,jpg}` is a light cream duotone of `originals/contact-care.jpg` (hands photo). Keep any replacement light so the burgundy heading stays readable. |
| Services background photo | `assets/images/services-bg*.{webp,jpg}` is a light cream duotone of `originals/services-field.jpg`. Keep any replacement light so the burgundy heading stays readable. |
| Replace a photo | Export a WebP and a JPG at the same size, keep the `width`/`height` attributes accurate, and keep or update the `alt` text. |

## Office hours and holidays (one file: `hours.js`)

Everything about the hours is in **`hours.js`**. Open it in any text editor, change a value, save, upload that one file. The hours card, the "Open now / Closed" status, the hours table, the footer, the FAQ answer and the data Google reads all update by themselves.

| To… | In `hours.js`, change… | Example |
|---|---|---|
| Change a day's hours | `weekly` | `Friday: '8:00 AM – 4:30 PM',` |
| Close a day every week | `weekly` | `Saturday: 'Closed',` |
| Change or remove the lunch break | `lunch` / `lunchDays` | `lunch: false,` (no lunch break) |
| Close on a holiday every year | `holidays` | `thanksgiving: true,` |
| Shorter hours on a holiday | `holidays` | `christmasEve: '8:00 AM – 12:00 PM',` |
| Close on a single date (training, weather, vacation) | `specialDates` | `{ date: '2026-12-26', label: 'Staff training', hours: 'Closed' },` |
| Change or turn off the "Upcoming: closed…" warning | `announceDaysAhead` | `announceDaysAhead: 0,` |

Holiday dates are calculated automatically every year. If `hours.js` is missing or has a typo, the page simply shows the hours written in `index.html` (the fallback copy), so nothing breaks. If the regular weekly hours change, it's good practice to also update that fallback copy (the `#hours-table`, footer and FAQ text in `index.html`) for visitors without JavaScript.

## Images

All images are generated from the full-quality files in `assets/images/originals/`:

```bash
python3 tools/optimize-images.py     # needs Pillow 11+:  pip install pillow
```

It writes AVIF + WebP (+ JPEG/PNG fallback) at the sizes the page uses, and the app icons. To replace a photo, put the new file in `originals/` with the same name and rerun the script. `og-image.jpg` (the link-preview image) is designed separately and is not touched by the script.

## Photo credits

The hero photo is the practice's original family photo. The other photos are real photographs from Unsplash, under the Unsplash License (free for commercial use, edits allowed, no attribution required; credited here anyway): FAQ background, Nani Chavez; Services background, Jessica Rockowitz. The New Patients waiting-room photo is the owner's `waiting-room.webp`. The provider headshot is from the practice's current site.

## Deploy

1. Back up the current site (`index.html`, `css/`, `images/`).
2. Upload everything in this folder **except `.git/`, `docs/`, `tools/`, `assets/images/originals/`, `styles.css` and `README.md`** to the web root (include the hidden `.htaccess`), so `index.html` replaces the old one.
3. The old `css/style.css` and `images/` folder are no longer used. Remove them once the new site is confirmed working.
4. After launch:
   - In Google Search Console (the existing `google-site-verification` tag is kept), submit `https://www.capstoneeatonrapids.com/sitemap.xml`.
   - Check the link preview with Facebook's Sharing Debugger and LinkedIn's Post Inspector (they also refresh cached previews).
   - Test the page with Google's Rich Results Test and the Schema.org validator.
   - Run Lighthouse against the live URL. See `docs/TESTING.md` for the local baseline.
   - Make sure the Google Business Profile shows exactly the same name, address, phone and hours as the page.
5. **Server settings.** If the host runs Apache, upload the included `.htaccess`: it forces HTTPS on www, turns on compression and caching, and hides `.git/`, `docs/`, `tools/` and `originals/`. On other hosts, set up the equivalent. For reference, the core of it is:

```apache
<IfModule mod_deflate.c>
  AddOutputFilterByType DEFLATE text/html text/css application/javascript image/svg+xml application/manifest+json
</IfModule>
<IfModule mod_expires.c>
  ExpiresActive On
  ExpiresByType font/woff2 "access plus 1 year"
  ExpiresByType image/webp "access plus 1 month"
  ExpiresByType image/jpeg "access plus 1 month"
  ExpiresByType image/png  "access plus 1 month"
  ExpiresByType text/css   "access plus 1 week"
  ExpiresByType application/javascript "access plus 1 week"
</IfModule>
```

   Also force HTTPS, and redirect `capstoneeatonrapids.com` to `www.capstoneeatonrapids.com` to match the canonical URL.

## Fonts

Playfair Display (hero headline only), Fraunces and Atkinson Hyperlegible are self-hosted, subset to the Latin characters the site uses and frozen to the single weight each one needs from the open-source Fontsource packages (SIL Open Font License), so the page makes no requests to Google Fonts. Fallbacks: Georgia for headings, and Segoe UI / Verdana / system UI for body text.

## Icons

Service-card icons are the same Font Awesome Free 6.5.1 solid icons the original site used (heart-pulse, stethoscope, capsules, bandage, heart-pulse for home care), plus temperature-half and kit-medical for the two new cards. They're inlined as SVG at 64 px tall (the original `fa-4x` size), so the Font Awesome CSS and font files aren't needed. License: CC BY 4.0, https://fontawesome.com/license/free (attribution is in an HTML comment). All other UI icons use the same Font Awesome solid set, stored as symbols in the sprite at the top of `index.html`.
