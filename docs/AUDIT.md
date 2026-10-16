# Capstone Family Practice — Site Audit
URL: https://www.capstoneeatonrapids.com/ · Audited: Oct 15, 2026
Stack found: one static `index.html`, Bootstrap 5.3.2 (CSS + JS bundle), Font Awesome 6.5.1, `css/style.css`. Page is ~6,070px tall at desktop width.

## 1. Critical — costs the practice calls and patients
| # | Issue | Evidence | Fix |
|---|---|---|---|
| 1 | **Phone numbers aren't tappable** | 0 `tel:` links on the page; numbers are plain `<p>`/`<span>` text | Wrap every number in `<a href="tel:+15178362178">` |
| 2 | **Fax number shown as if it were a phone line** | 517-836-2182 is labeled only by a fax icon; no text says "Fax" | Label it "Fax", don't make it a `tel:` link |
| 3 | **No hero / no key info above the fold** | First screen = logo, a large hospital icon, "About Us" paragraph | Hero with value prop, Call + Patient Portal buttons, today's hours, address |
| 4 | **Provider photo is stretched and blurry** | `CKE-Pam.jpg` is 320×298 natural, rendered ~741×780 (2.3× upscale, aspect distorted). Section is 1,454px tall | Get a higher-res photo; render ≤ 320px wide with `object-fit: cover`, correct ratio |
| 5 | **Navigation is broken/empty** | Menu = Home, Patient Portal, plus **two empty `<li>`**; no `<nav>` element; no links to page sections | Real nav: Services, Provider, Insurance, New Patients, Contact + Portal button |

## 2. Content problems
- **Services are headings only** — five H3s with icons and zero description. "Same-day acute care" and "minor in-office procedures" (mentioned in About) are missing from the list.
- **"Meet Our Providers"** (plural) with one provider.
- **Aetna listed twice** ("Aetna" and "Aetna (Most Plans)").
- **"Insurances We Don't Work With"** is a ~150-word wall of centered text, negative in tone, mixing Medicaid policy, HAP/McLaren/Meridian, auto/workers' comp and self-pay rules.
- Typos/style: "Workman's Comp" → "workers' compensation"; "options, if desired, please inquire" (comma splice); "Medicare Wellness visits" casing; "Preventative" → "Preventive"; "12:00–1pm" vs "8:00 AM" formatting; odd gap in "Suite E Eaton Rapids,      Michigan 48827" (missing comma, extra spacing).
- Footer says **© 2024**.
- Clinic email is a **Gmail address** while the practice owns capstoneeatonrapids.com.
- Missing patient essentials: accepting new patients?, what to bring / new-patient forms, after-hours & emergency guidance ("call 911"), holiday closures, Notice of Privacy Practices link.

## 3. Visual / layout
- Everything is a single centered column; desktop width is wasted.
- Services section is 1,146px tall for five short labels (one icon + label per row, huge gaps).
- Decorative icons (hospital, hands, shield badge) sit above headings and add height without meaning.
- Big alternating maroon blocks (providers, mission, footer) feel heavy; footer is ~790px, mostly map.
- **Brand fonts don't load**: CSS asks for Montserrat / Open Sans but no font file or Google Fonts link exists — the site falls back to Arial/Helvetica.
- Logo PNG is 1200×300 shown at 400×100 (no `srcset`, no SVG).

## 4. Accessibility (WCAG 2.2)
- Logo `alt=""` — the only element naming the practice in the header.
- No `<main>` landmark, no `<nav>`, no skip link.
- Map `<iframe>` has no `title`.
- Heading order: the insurance H3s sit under "Meet Our Providers" H2; H1 is "About Us" instead of the practice/value prop.
- Body text is 16px — small for a Medicare-heavy audience; centered paragraphs hurt readability.
- Colors are fine: maroon `#580D0D` on white and white on maroon both pass AA.

## 5. SEO / local search
- No meta description, no Open Graph tags, no favicon.
- No `MedicalClinic` / `LocalBusiness` JSON-LD (name, address, phone, hours, geo).
- Title is just "Capstone Family Practice" — no "Family Doctor in Eaton Rapids, MI".
- Single page, so no page targets "Medicare wellness visit Eaton Rapids" etc. (fine to keep one page, but sections need real text).

## 6. Performance
- Full Bootstrap CSS + JS bundle and full Font Awesome (several hundred KB) to render a handful of icons and a basic grid.
- Images: no WebP/AVIF, no `width`/`height`, no `loading="lazy"` on below-fold photos, no `srcset`.

## Not checked
- Mobile rendering (browser access ended before the mobile pass). Re-test at 375px after the rebuild.

## Confirm with the client before launch
Accepting new patients? · Is 517-836-2182 definitely the fax? · Move to an @capstoneeatonrapids.com email? · Additional providers/staff? · Service descriptions (drafts in the prompt) · After-hours instructions · Holiday hours · Updated provider headshot (≥ 800px) · Current insurance list.
