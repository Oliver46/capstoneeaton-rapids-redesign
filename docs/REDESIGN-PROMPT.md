# Prompt: Rebuild & redesign capstoneeatonrapids.com

You are a senior front-end developer and UI designer. Rebuild the one-page website for **Capstone Family Practice, PLC**, a small family medicine practice in Eaton Rapids, Michigan. Fix every issue listed below and deliver a new layout that is warm, trustworthy, fast, and easy for older patients to use on a phone.

## Deliverables
- `index.html`, `css/styles.css`, `js/main.js` (vanilla, < 3 KB; only for the mobile menu and the "open today" status), `images/` (optimized), `favicon.svg` + `apple-touch-icon.png`.
- **No Bootstrap and no Font Awesome.** Use modern CSS (custom properties, grid, flex, `clamp()`) and inline SVG icons (simple line icons, 1.75px stroke, `aria-hidden="true"`).
- Mark every client-unconfirmed item with an HTML comment `<!-- CONFIRM: ... -->` and list them all in a `CONFIRM.md`.

## Audience & goals
Patients of all ages, many on Medicare. Top tasks, in order: **1) call the office, 2) open the patient portal, 3) check if their insurance is accepted, 4) find hours and address, 5) learn about the provider and services.** Each of these must be reachable within one tap/scroll from the top on mobile.

## Fixed facts (use exactly)
- Name: Capstone Family Practice, PLC
- Phone: 517-836-2178 → `tel:+15178362178`
- Fax: 517-836-2182 (label it "Fax"; NOT a tel link) <!-- CONFIRM it is a fax -->
- Email: office.capstonefp@gmail.com <!-- CONFIRM: switch to an @capstoneeatonrapids.com address? -->
- Address: 2487 S. Michigan Road, Suite E, Eaton Rapids, MI 48827
- Hours: Mon–Thu 8:00 AM–5:00 PM · Fri 8:00 AM–12:00 PM · Sat–Sun closed · Closed for lunch 12:00–1:00 PM (Mon–Thu)
- Patient portal: https://29799.portal.athenahealth.com/ (opens in new tab; add "(opens in new tab)" visually-hidden text)
- Provider: Pam Becker, NP-C — board-certified Family Nurse Practitioner; MSN, Michigan State University; background in emergency nursing; special interest in chronic disease management and prevention.

## Design direction
- Mood: a modern small-town practice — calm, warm, personal. Not a hospital, not a startup.
- Palette (CSS variables): `--maroon: #580D0D` (brand, headings, primary buttons), `--maroon-700: #7A1F1F` (hover), `--cream: #FBF7F2` (page background), `--sand: #F1E8DD` (alternate sections, cards), `--ink: #2B2522` (body text), `--muted: #6B605A`, `--sage: #5E7A68` (small accents, "Open now" badge). All text pairs must meet WCAG AA. Use maroon as an accent and for one dark band max — not for three full-width blocks.
- Type: headings in **Fraunces** (600, slight optical size), body in **Atkinson Hyperlegible** (built for low-vision readers). Self-host WOFF2 or load from Google Fonts with `display=swap` and preconnect. Body 18px (1.125rem), line-height 1.6, max line length ~65ch. Fluid heading scale with `clamp()`. Left-align paragraphs.
- Shape: 14px radius on cards and images, soft shadows (`0 1px 2px rgb(0 0 0 / .06), 0 8px 24px rgb(88 13 13 / .06)`), generous whitespace but no empty icon-only rows.
- Keep the existing logo; ask for an SVG version, meanwhile serve the PNG at 2× with `width`/`height` set and real `alt="Capstone Family Practice"`.

## Page structure (single page, anchored sections)
1. **Skip link** → `#main`.
2. **Top utility bar** (desktop only): "Open today 8:00 AM–5:00 PM" status computed in JS from local time (shows "Closed now · Opens Mon 8:00 AM" etc.), address, phone.
3. **Sticky header** (`<header>` + `<nav aria-label="Primary">`): logo left; links Services · Provider · Insurance · New Patients · Contact; right side a secondary "Patient Portal" button and primary "Call 517-836-2178" button. Mobile: logo + round call button + accessible hamburger (`aria-expanded`, Esc closes, focus trapped while open). Remove the two empty `<li>` items.
4. **Hero** (`<main id="main">` starts here). Two columns on desktop, stacked on mobile.
   - H1: "Family care in Eaton Rapids, for every stage of life"
   - Lead: "Prevention, chronic-condition care, Medicare wellness visits, and same-day sick appointments — with a provider who knows you."
   - Buttons: Call 517-836-2178 (primary) · Patient Portal (secondary).
   - Quick-info card under the buttons: today's hours/status, address with "Get directions" link (Google Maps), "Same-day sick visits available — call first."
   - Image: `family.jpg` in a rounded frame (keep the soft arched shape from the current site as a nod to the old design), `alt=""` since it's decorative, WebP + JPG fallback, `fetchpriority="high"`.
5. **Services** (`#services`, sand background): H2 "How we care for you". Responsive grid (3 cols desktop / 2 tablet / 1 mobile) of 7 cards, each icon + H3 + one-sentence description. Drafts to confirm:
   - Preventive care — Annual physicals, screenings and vaccines to catch problems early.
   - Medicare wellness visits — Yearly Annual Wellness Visits and personalized prevention plans.
   - Chronic disease & care management — Ongoing support for diabetes, high blood pressure, COPD, heart disease and more.
   - Same-day sick visits — Colds, infections, minor injuries; call in the morning for a same-day appointment.
   - Skin care — Acne treatment and removal of warts and skin lesions.
   - Minor in-office procedures — Simple procedures done right here, no hospital trip.
   - Home care & hospice coordination — We coordinate home health and hospice services with your family.
6. **Provider** (`#provider`): H2 "Meet your provider" (plural only if more are added). Card layout: photo left (max 320px wide, `aspect-ratio: 4/5`, `object-fit: cover` — never upscale beyond the source's natural size; request a ≥ 800px headshot), name + credentials, 3–4 sentence bio rewritten in warm first-person-friendly tone, small credential chips ("MSN · Michigan State University", "Board-certified FNP"). Build it as a reusable card so more providers drop in.
7. **Insurance** (`#insurance`): H2 "Insurance & payment". Lead: "Coverage changes often — call us to confirm your plan before your visit."
   - Two columns: **Accepted** (check icon, sage) as chip/pill list: BCBS / BCN · Medicare · Aetna (most plans) · Humana (most plans) · Priority Health · Cigna (network allowing) · Multiplan network · TRICARE (certified out-of-network provider) · U of M Health Plan / PHP · Most TPAs (Allied, IAS, Unified, etc.). Remove the duplicate Aetna.
   - **Not accepted** (x icon, muted, neutral wording): Medicaid plans (primary or secondary) · Health Alliance Plan (HAP) · McLaren · Meridian · New auto or workers' compensation cases.
   - Callout: "Paying yourself? Self-pay options are available — ask the front desk." + footnote: "Per CMS rules we can't accept self-pay for Medicaid-covered services."
   - Put the long policy explanation (credentialing, yearly network changes) in a `<details>` "Why don't you accept Medicaid?" disclosure.
8. **New patients** (`#new-patients`): H2 "Becoming a patient". 3 numbered steps: Call to check insurance & schedule → Bring photo ID, insurance card, medication list, prior records → Activate the patient portal. <!-- CONFIRM: currently accepting new patients? any forms to download? -->
9. **Visit us** (`#contact`, the one maroon band): H2 "Visit or call us". Left: phone (tel link, large), fax (labeled), email (mailto), address + directions link, hours as a real `<table>` or `<dl>` with lunch closure noted. Right: Google Maps iframe with `title="Map to Capstone Family Practice"`, `loading="lazy"`, rounded, ~360px tall (no raw map URL printed as text). Below: note box "Medical emergency? Call 911. After hours: [instructions]" <!-- CONFIRM after-hours -->.
10. **Footer** (compact, < 250px): logo, NAP repeated, Portal link, "Notice of Privacy Practices" link <!-- CONFIRM URL/PDF -->, © with current year via JS (`new Date().getFullYear()`), fallback text "2026".

## Technical requirements
- Semantic HTML5 landmarks; one H1; logical H2/H3 order; `lang="en"`.
- `<head>`: title "Capstone Family Practice | Family Doctor in Eaton Rapids, MI"; meta description (~150 chars); canonical; Open Graph + Twitter tags with a 1200×630 share image; favicon set; theme-color `#580D0D`; keep the existing `google-site-verification` meta.
- JSON-LD `MedicalClinic` with name, url, telephone, faxNumber, email, address, geo, `openingHoursSpecification`, `medicalSpecialty: "PrimaryCare"`, and an `employee`/`member` Person for the provider.
- Images: WebP/AVIF via `<picture>`, explicit `width`/`height`, `loading="lazy"` below the fold, `srcset` for hero and logo. No image larger than its displayed size × 2.
- Accessibility: WCAG 2.2 AA; visible 3px focus rings; tap targets ≥ 44×44px; respects `prefers-reduced-motion`; no information conveyed by icon alone (e.g., fax); all icons `aria-hidden`; nav works by keyboard.
- Responsive from 320px to 1440px+, container max-width 1180px, 20px side gutters on mobile, no horizontal scroll. Sticky mobile header must not exceed 64px.
- Performance targets: Lighthouse ≥ 95 on Performance, Accessibility, Best Practices, SEO (mobile). Total page weight < 600 KB excluding the map. Lazy-load the map iframe.
- Smooth-scroll anchor links with `scroll-margin-top` equal to header height.

## Content fixes checklist
- [ ] Remove empty nav items
- [ ] All phone numbers are `tel:` links; fax labeled
- [ ] Single "Aetna (most plans)"
- [ ] "Workers' compensation", "Preventive", "Medicare Wellness Visits" consistency
- [ ] Consistent time format "8:00 AM – 5:00 PM"
- [ ] Address with comma: "Suite E, Eaton Rapids, MI 48827"
- [ ] Logo has alt text; map iframe has title
- [ ] Footer year is current
- [ ] Provider photo not stretched

## Acceptance
Before finishing: run Lighthouse (mobile) and axe; test at 375px, 768px, 1280px; tab through the whole page; confirm every `tel:`/`mailto:`/portal link; list remaining `CONFIRM` items in `CONFIRM.md`.
