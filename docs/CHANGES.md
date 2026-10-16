# What changed

## Layout and visual design
| Before | After |
|---|---|
| Maroon header bar, then a large hospital icon and "About Us" as the first thing on the page | Sticky cream header with logo, navigation, **Patient Portal** and **Call** buttons; hero with a clear H1, intro, two large calls to action and a **Today's hours** card |
| Single centered column, about 6,000 px tall, with large decorative icons above every heading | Two-column hero on desktop; card grids for services, insurance and steps; decorative icons removed |
| 5 service headings with no descriptions, one per row (about 1,150 px) | Full-width parallax photo section (Kona-style) with a translucent maroon panel: intro + "Call to schedule" in the first cell, the 7 services as an editorial 2 × 4 list with the original 64 px Font Awesome icons; stacks to one column on phones. Parallax is off when the visitor prefers reduced motion |
| Provider photo stretched from 320 px to about 741 × 780 px (blurry and distorted) | Provider card with a square photo capped at 260 px (never upscaled), role, bio and labeled facts |
| Insurance as a centered bullet list plus about 150 words in one block of text | Two clearly labeled columns, **Accepted** (check marks) and **Not accepted** (crosses); Medicaid explanation in an expandable "Why…?" panel; separate self-pay callout |
| No new-patient guidance | Four numbered "Becoming a patient" steps (draft) |
| Three full-width maroon blocks, an unlabeled fax number, a 600 px map at the bottom | One maroon contact band: labeled phone, fax, email and address; directions link; weekly hours table with today highlighted; 911 notice; map card |
| 790 px footer, mostly map, © 2024 | Compact footer with name, address, phone, links, Patient Portal and an automatic copyright year |
| Montserrat/Open Sans requested but never loaded (Arial was shown) | Fraunces headings + Atkinson Hyperlegible body text at 18 px, self-hosted |
| White background, maroon blocks | Warm cream background, sand alternate sections, maroon reserved for brand, buttons, headings and one band |
| White logo on a maroon bar | Logo recolored to maroon on transparent for the cream header; arched hero photo echoes the arc in the logo |

## Accessibility (aiming for WCAG 2.2 AA)
- Skip link, `<header>`, `<nav aria-label>`, `<main>`, `<footer>` landmarks, and one H1 with a logical H2/H3 order.
- Body text 18 px; smallest text 16 px; line length limited to about 65 characters; left-aligned paragraphs.
- All text colors pass AA (most are 7:1 or higher; see TESTING.md). The secondary-button border is 3.87:1 against its background.
- Thick 3 px focus ring with a contrasting halo. It switches to gold on the maroon band.
- Every phone number is a `tel:` link; the fax is labeled with text, not just an icon.
- Buttons and navigation links are at least 48 px tall. Header Call and Menu buttons have visible text labels, not icons alone.
- Accessible mobile menu: a real `<button>` with `aria-expanded`/`aria-controls`; closes with Escape (focus returns to the button), by clicking outside, or by choosing a link.
- New-tab links announce "(opens in a new tab)" to screen-reader users.
- Logo alt text added; decorative images use empty alt; provider photo has descriptive alt; the map iframe has a title, and the address and directions are also available as text.
- Insurance status uses icons, headings and text, not color alone. Today's row in the hours table carries a "Today" text badge.
- `prefers-reduced-motion` respected; print stylesheet keeps contact details.
- Works without JavaScript: the menu shows as a link row, and the hero shows the full weekly hours.
- `scroll-padding-top` stops the sticky header from covering headings reached by anchor links or by keyboard focus.

## SEO and local search
- Descriptive `<title>` and meta description; canonical URL; Open Graph and Twitter card tags with a 1200 × 630 share image; favicon set and web manifest.
- `MedicalClinic` JSON-LD with name, address, phone, fax, email, opening hours (lunch break encoded) and logo. Only facts visible on the page are included.
- Real section text (services, insurance, location) instead of bare headings, so the page can match local searches such as "Medicare wellness visit Eaton Rapids".
- New `robots.txt` and `sitemap.xml` (the old site returned 404 for both). The Search Console verification tag is kept.

## Performance
- Removed Bootstrap CSS and JS and Font Awesome (several hundred KB, render-blocking) in favor of about 23 KB of CSS (unminified), about 5.5 KB of JS and an inline SVG icon sprite. Service cards keep the original Font Awesome icons (inlined SVG, 64 px).
- Images in WebP with JPG/PNG fallback, responsive `srcset`/`sizes`, explicit `width`/`height` (no layout shift), lazy loading below the fold, and `fetchpriority="high"` on the hero photo.
- Fonts self-hosted, subset to Latin, preloaded, `font-display: swap`. No third-party font requests.
- Map iframe lazy-loaded.
- Total transfer about 190 KB on mobile, excluding the map (Lighthouse).

## Design-system refinement (Oct 15, 2026)
- **One heading system:** every section uses the same eyebrow (rule + uppercase label), H2 and intro, starting on the same left edge. The services heading moved out of the panel and now sits over the photo in the shared position.
- **Services panel:** balanced 4 × 2 grid (7 services + a "Ready to schedule?" call tile); 2 × 4 on tablets, one column on phones. Original 64 px Font Awesome icons kept.
- **Background photo:** heavy blur replaced with a burgundy duotone of the photo, so it stays recognizable and the low resolution reads as an intentional style. Lighter, directional overlay (darkest behind the heading). Measured text contrast over the photo: 6.3:1 or higher.
- **Burgundy used deliberately:** Services is the only full-bleed dark section. Contact moved to a sand section with a solid burgundy panel built from the same panel component; the footer is now cream.
- **Tokens consolidated:** one palette (burgundy, cream, sand, muted rose), two radii (16 px cards, 24 px panels), two shadows (card, panel), one accent style (4 px top bar), shared card/panel padding and grid gaps, one section padding.
- **Icons:** all UI icons now use the same Font Awesome solid set as the services icons.
- **Hierarchy:** provider name reduced to a card-title size so it no longer competes with section headings.

## Hero typography and New Patients redesign (Oct 15, 2026)
- **Hero headline:** now Cormorant Garamond 600, a refined high-contrast serif, set larger (up to 80 px) with tighter leading. The phrase "for every stage of life" is set in italic on its own line in a lighter burgundy (#7a1f1a, 9.6:1 on cream). Supporting text stays in Atkinson Hyperlegible for readability. The rest of the site keeps Fraunces headings.
- **Section order:** Our Provider → New Patients → Insurance & Payment (navigation updated to match).
- **New Patients:** rebuilt in the Services design language: dark burgundy section, rose-accent eyebrow, glass panel, numbered steps with rose number discs, and Call / Patient Portal buttons. Your photo (`capstoneeatonrapids.webp`) is shown in full on desktop (right side, 3:2) and vignetted into the burgundy, so no text sits over faces. On tablets and phones it becomes a photo band that fades into the section. Gentle parallax (off for reduced motion). The photo is decorative (`alt=""`) and optimized to 110 KB / 62 KB WebP plus a JPG fallback (from 795 KB).

## Premium hero and Contact redesign (Oct 15, 2026)
- **Hero:** now a deep-burgundy section in the New Patients style. The family photo sits on the right and is vignetted into the burgundy; on phones and tablets it becomes a photo band that fades into the section. The today's-hours card became a glass panel floating over the photo's lower edge, so the headline, photo and hours are all in the first screen on desktop. Buttons switched to the light/ghost pair used in the other dark sections.
- **Hero headline font:** Playfair Display (replacing Cormorant Garamond), weight 500 in cream, with "for every stage of life" in italic rose (#f3c9bd).
- **Services background:** rebuilt as a burgundy duotone of the new family photo, so it no longer repeats the hero photo directly below it, and it's sharper (1264 px source).
- **Contact & location:** one light card with **Get in touch** (phone, fax, email, address, icons in rose circles) on the left and **Office hours** on the right, divided by a hairline; today's row highlighted in rose with a "Today" badge; 911 note as a rose strip at the bottom of the card; the map now spans the full width below, with the address and a directions link under it.
- **Full-screen hero:** `min-height: calc(100svh - header height)` (with a `100vh` fallback). Desktop only (1024 px and wider): it fills the screen below the sticky header and can still grow if its content is taller (e.g. large text zoom). Phones and tablets keep their natural height. Short laptop screens (≤ 820 px tall) get a slightly smaller headline so everything fits.

## Lighter Services, premium Insurance, waiting-room photo (Oct 15, 2026)
- **Services vs. hero contrast:** the dark `.services-parallax::before` overlay was removed. Services now uses a light cream duotone of the family photo, with only a soft cream veil behind the heading, so it reads clearly apart from the dark hero. The heading switched to the burgundy light-section style, and the burgundy services panel was made slightly more opaque (95%) so it stays rich over the light photo. Parallax is unchanged.
- **Insurance & payment:** three distinct cards in the New Patients card language (24 px radius, kicker label + serif heading, hairline rows):
  - *Accepted* in espresso brown (`--color-brown`) with cream text and gold check discs, full width, list in 3 columns on desktop (2 on tablet, 1 on phone).
  - *Not accepted* in ivory with brown text and muted cross discs, including the Medicaid explainer.
  - *Self-pay* in warm tan with a wallet icon, so payment reads separately from plan lists.
  - New tokens: `--color-brown`, `--color-brown-text`, `--color-brown-muted`, `--color-gold`, `--color-ivory`, `--color-tan`, `--color-tan-line`.
- **New Patients photo:** now `assets/images/waiting-room.jpeg` (used as the fallback source), with WebP copies of the same image (`waiting-room-800.webp`, `waiting-room-1264.webp`) for faster loading. Decorative (`alt=""`). The gentle parallax on this photo was removed: it caused a 1 px seam at the photo's edge, and the still photo with an extended fade overlay is seamless.

## Provider card and Contact photo (Oct 15, 2026)
- **Our provider:** the card is now espresso brown (`--color-brown`, the same brown as the accepted-insurance card) with cream text, a gold role line and gold fact labels, a soft warm glow, and an arched portrait with a thin gold outline (echoing the arc in the logo). Added "Call to schedule" and "Patient Portal" buttons. Card spans the full content width.
- **Contact & location:** deep espresso section (`#2e1d14`) with `doctor-becker.webp` as a wide photo band across the top, fading into the brown; the heading sits on the fade; the ivory details/hours card overlaps the photo and the map card sits below. Decorative image (`alt=""`), served as optimized WebP copies (`doctor-becker-640.webp` 29 KB, `doctor-becker-1024.webp` 56 KB; original kept as fallback). Solid espresso fallback if the photo fails.
- **Phones:** office hours stay on one line (they only wrap on 320 px screens), and the email address no longer breaks mid-word.

## Speed, image and SEO optimization + share image (Oct 15, 2026)
**Images**
- Every photo now ships as **AVIF** (smallest), then WebP, then JPEG/PNG fallback; browsers pick the best they support. AVIF is 25–45% smaller than WebP at the same visual quality.
- All images are rebuilt from full-quality sources in `assets/images/originals/` by `tools/optimize-images.py` (run `python3 tools/optimize-images.py` after replacing a photo).
- The contact photo's fallback is now a 102 KB JPEG instead of the 717 KB original. Icons are 256-color PNGs (e.g. icon-512 95 KB → 53 KB).
- Fixed: several image files in the folder had JPEG content behind a `.webp` name (e.g. `doctor-becker-1024.webp`, 611 KB). Every file's content now matches its extension.

**Fonts** (148 KB → 85 KB)
- Subset to the Latin characters the site uses, and the variable fonts were frozen to the single weight each one uses (Fraunces 600, Playfair Display 500 and 400 italic). New file names: `atkinson-hyperlegible-400/700`, `fraunces-600`, `playfair-display-500`, `playfair-display-400-italic`.

**Results (Lighthouse, mobile, with compression):** performance 97 → 99, main content 2.4 s → 1.9 s, page weight 254 KB → 160 KB.

**SEO and sharing**
- New 1200 × 630 **share image** (`assets/images/og-image.jpg`) for link previews in Messages, WhatsApp, Facebook, LinkedIn, X, Slack: logo, headline, phone and web address beside the family photo.
- Added `og:image:type`, a descriptive `og:image:alt`, `og:locale`, full Twitter/X card tags, `robots: max-image-preview:large`, `apple-mobile-web-app-title`.
- JSON-LD: added the share image and waiting-room photo, `hasMap` (directions link) and the provider (`employee`: name, credential, title, Michigan State University), all matching what's visible on the page.
- `sitemap.xml` now lists the page's key images.
- New `.htaccess` (Apache): HTTPS + www redirect matching the canonical URL, Brotli/gzip compression, caching (fonts 1 year, images 1 month, CSS/JS 1 week, HTML always fresh), AVIF/WebP/WOFF2 types, basic security headers, and blocks public access to `docs/`, `tools/`, `originals/` and `README.md`.

**Cleanup:** removed the unused old font files, the old New Patients images and an empty `docs/headers.txt`.

## Real photos instead of AI-made images (Oct 15, 2026)
- **Hero:** kept the practice's original family photo (briefly swapped, then restored at the owner's request). It is a 640 px image, so a larger original would make it sharper.
- **New Patients:** real photo of a clinic waiting room (smallbox, Unsplash), cropped to remove a "Happy New Year" banner. Same file names as before (`waiting-room.jpeg`, `waiting-room-800/1264`).
- **Contact:** real photo of two people holding hands, with no faces (Nani Chavez, Unsplash), so no one mistakes a stranger for Pam Becker. New file names `contact-care-*`; the old `doctor-becker-*` sizes were removed (your uploaded `doctor-becker.webp` and `capstoneeatonrapids.webp` were left in place, unused).
- **Services background:** light duotone of a real photo of a family walking in a field (Jessica Rockowitz, Unsplash).
- **Share image** uses the original family photo, matching the hero.
- Results: Lighthouse mobile 99 (LCP 1.9 s, 175 KB), desktop 100; axe 0 violations; HTML valid; text over photos 5.3:1 or better everywhere.
- **New Patients photo replaced** with the owner's `waiting-room.webp` (reception desk and waiting chairs). The file has JPEG data under a .webp name and is 700 KB, so it is used as the source: the page loads optimized AVIF/WebP copies (800/1264 px) and `waiting-room.jpeg` as the fallback.

## UX, UI and SEO fixes (Oct 15, 2026)
**UX**
- **Open-now status** in the hero hours panel ("Open now · closes at 5:00 PM", "Closed for lunch · reopens at 1:00 PM", "Closed today"…), always in Eastern Time even for visitors in other time zones. It reads the hours table, updates every minute and stays hidden on special dates. Announced politely to screen readers (`role="status"`), and the meaning is in the text, not the dot color.
- **Current section highlighted in the menu** while scrolling (`aria-current`), so visitors always know where they are.
- **New FAQ section** (between Insurance and Contact): seven questions answered only with facts already on the page (hours, same-day visits, insurance, Medicaid, self-pay, provider, emergencies), with links back to the full sections. Native `<details>`, keyboard accessible, works without JavaScript.
- **Footer** now has the full name, address, phone and email (in an `<address>`), a weekly hours summary, Get directions and an FAQ link.

**UI**
- Hero photo capped at 736 px wide on desktop. The only source is 640 px, so it was being stretched to about 835 px; it's now noticeably less soft. A larger original would still be better.
- FAQ cards follow the site's ivory card style with a maroon chevron; on desktop the heading stays visible beside the questions.

**SEO**
- Title now leads with the main search phrase and stays under 60 characters: "Primary Care in Eaton Rapids, MI | Capstone Family Practice". Meta description rewritten (146 characters) with provider, services and phone.
- `FAQPage` structured data matching the visible FAQ.
- `MedicalClinic` structured data: added `availableService` (the seven services on the page), `areaServed` (Eaton Rapids) and `paymentAccepted`. The stock waiting-room photo was removed from the structured data and the image sitemap (search engines treat those as photos of the business); the family photo is listed instead.
- Results: Lighthouse mobile 100 (LCP 1.7 s, 166 KB) and desktop 100; accessibility, best practices and SEO 100; axe 0 violations; HTML valid; no sideways scrolling from 320 to 1440 px.

## Visual polish (Oct 15, 2026)
- **Light/dark rhythm:** the provider card is now ivory with a maroon top edge instead of espresso, so the page alternates light and dark (hero dark → services light → provider light → New Patients dark → insurance light → FAQ light → contact dark).
- **New Patients photo:** shown as a framed, rounded photo with a soft shadow on desktop instead of a second oval vignette (the oval stays only in the hero).
- **Hero:** shorter eyebrow ("Eaton Rapids, Michigan"; the logo already names the practice) so it fits on one line; the hours card sits a little lower so the family stays the focus.
- **Fewer repeated buttons:** the provider card has one quiet link ("Schedule with Pam: 517-836-2178") and the Services tile shows the phone number as a link instead of another button. Button pairs remain in the hero and New Patients.
- **Shorter on phones (about 1,000 px less):** services use a compact two-column grid with 40 px icons; the provider card uses a smaller portrait and hides the bio paragraph on phones (the Education / Background / Focus list below says the same thing).
- **Insurance:** accepted plans in two even columns of five (no orphan on the last row).
- **Footer:** menu links in a tidy two-column list, underlined only on hover.
- **Hours:** times use the serif (Fraunces) figures in the hours table and the hero, which read warmer than the body font's slashed zeros.
- Results: Lighthouse mobile 99 (LCP 1.8 s) and desktop 100; accessibility, best practices and SEO 100; axe 0 violations; HTML valid; no sideways scrolling 320–1440 px; text over photos 5.5:1 or better.

## Consistency pass (Oct 15, 2026)
- **One dark color for dark sections:** Contact is now the same burgundy as New Patients (`--np-bg`, #4a0b0b) instead of espresso. Espresso is used only for the accepted-insurance card.
- **Two photo styles instead of four:** faded background for the hero and Services; a framed photo (rounded corners, soft shadow, thin offset outline) for New Patients and Contact, on every screen size. The shared style is section 11b of `styles.css`. Contact's text no longer sits on the photo, so its heading contrast went from 4.8:1 to 10.4:1.
- **Small details matched:** the footer hours and the lunch note use the same serif figures as the hours table; the provider card uses the same plain border as the other cards; FAQ cards have the same inner spacing as the other cards.
- Results: Lighthouse mobile 99 / desktop 100 (accessibility, best practices, SEO 100); axe 0 violations; HTML valid; no sideways scrolling 320–1440 px.
- **Contact photo moved (owner's request):** the hands photo no longer appears in Contact & Location, which now starts straight with the heading and the details card. The photo is now a light cream background behind the FAQ, in the same faded style (and gentle parallax) as Services. FAQ text over it: 5.2:1 or better. `contact-care-*` images were replaced by `faq-bg*`.
- **FAQ background made more visible:** stronger duotone of the hands photo; on desktop the heading and questions stack on the left and the photo is placed so the clasped hands show in the open space on the right (no parallax here, so they stay in view). The question cards are frosted (semi-transparent with a light blur) so the photo shows through them, and a cream veil sits only behind the heading. Text contrast over the photo: 5.4:1 or better.
- **New Patients photo (owner's request):** now on the LEFT and styled like the hero: on desktop it's vignetted into the burgundy with the steps on the right; on phones and tablets it's a band at the top fading into the burgundy. Hero, New Patients, Services and FAQ now all use the faded-photo style.
- **Holiday reminder highlighted:** "Holiday hours may differ, so please call to confirm." is now bold gold on the dark hours card in the hero (9.1:1 contrast) and bold maroon in the FAQ answer (`.holiday-note`). The open-now pill keeps tidy corners when its text wraps.

## Audit fixes (Oct 15, 2026)
- **Holidays now change everything for that day:** an entry in `SPECIAL_DATES` (top of `script.js`) updates the hero card, the open-now status ("Closed today (Thanksgiving Day) · opens tomorrow at 9:00 AM") and the hours table (today's row shows the special hours and the holiday name). Special hours like "9:00 AM – 12:00 PM" are handled too. Before, the status disappeared and the table kept the regular hours. **The practice still needs to supply its holiday dates.**
- **"Closed now" says when the office reopens:** "Closed now · opens tomorrow at 8:00 AM", "Closed today · opens Monday at 8:00 AM"; it skips weekends and holiday closures.
- **FAQ added to the main menu** (desktop and mobile). Desktop menu spacing tightened slightly between 1280 and 1440 px so all six items fit.
- **Map:** visible gold focus ring when it receives keyboard focus.
- **CSS minified:** the page loads `styles.min.css` (32 KB vs 47 KB, rendering verified pixel-identical at 390, 1024 and 1440 px). Keep editing `styles.css`, then run `python3 tools/minify-css.py`.
- **Share titles** (Open Graph / X) now match the page title.
- **Cleanup:** removed one unused CSS rule; the owner's source photos (`capstoneeatonrapids.webp`, `doctor-becker.webp`, `waiting-room.webp`) moved from `assets/images/` to `assets/images/originals/` so they are no longer uploaded (about 2.2 MB); retired source photos moved to `originals/unused/`; `.DS_Store` removed; README brought up to date.
- Not done, on purpose: inlining the above-the-fold CSS. It would need a build step for every HTML change and the page already scores 100 with the main content showing in 1.7 s on a throttled phone.

## Office hours in one file (Oct 15, 2026)
- New **`hours.js`**: weekly hours, lunch break, holidays (simple `true` / `false` / shorter-hours switches, dates calculated automatically every year), one-off dates and the advance warning, with plain-English instructions inside the file.
- Editing `hours.js` updates everything: hero hours card, open-now status, hours table, lunch note, footer, FAQ answer, and the opening hours and FAQ answer Google reads (structured data).
- New **advance warning** in the hero card, e.g. "Upcoming: closed Thursday, Nov 26 (Thanksgiving Day)." (7 days ahead by default).
- Safe by design: if `hours.js` is missing or has a typo, the page falls back to the hours written in `index.html`.
- All holidays start as `false` (open) until the practice confirms its closures (CONFIRM item 7).

## Code refactor and cleanup (Oct 15, 2026)
Behavior and appearance are unchanged: before/after screenshots are pixel-identical at 320, 390, 768, 1024, 1280, 1366, 1440 and 1920 px, with the mobile menu open, with all FAQs open, for keyboard focus on seven different surfaces and in print; 16 hours/holiday scenarios (including a broken hours.js and JavaScript off) give identical results.
- **CSS** (`styles.css`): reorganized into 15 numbered sections in page order with a table of contents; new tokens (`--color-burgundy`, `--color-oat`, `--color-focus-light`, `--shadow-brown`); one `.on-dark` rule for focus rings on dark surfaces instead of five copies; shared components for the two photo styles: `.fade-photo` (hero, New Patients) and `.photo-section` (Services, FAQ); `.panel` merged with its only variant; shared button-row rules; duplicate and dead rules removed (`.panel--solid`, `.nowrap`, duplicate footer/caption rules). 47 KB → 45 KB (32 KB minified).
- **JavaScript** (`script.js`): 8 numbered sections; one schedule model (hours.js, or the HTML table as a fallback) that the table, footer, FAQ, structured data, hours card and open-now status all read; small helpers replace repeated DOM and time-formatting code; unused `data-parallax-box` support removed.
- **HTML** (`index.html`): class names match the new CSS components, unused classes removed (`np-panel`, `faq-layout`, `panel--glass`), list indentation fixed, section comments updated.
- **Image script** (`tools/optimize-images.py`): source list documented at the top, repeated code folded into helpers; builds the New Patients photo straight from `originals/waiting-room.webp` (all other outputs byte-identical).
- **Removed:** `assets/images/originals/unused/` (two exact duplicates of your own images and an unused stock photo), `originals/waiting-room.jpg` (a converted copy of `waiting-room.webp`), and the outdated `docs/screenshots/` from earlier designs (9.7 MB), replaced by three current full-page screenshots.
