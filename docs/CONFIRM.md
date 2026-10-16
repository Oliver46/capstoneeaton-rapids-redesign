# Practice details awaiting confirmation

Every item below must be confirmed by Capstone Family Practice before launch. Items in `index.html` are marked with `<!-- CONFIRM: … -->` comments. Remove those comments once the practice approves the content.

**Source key**
- **Live site:** copied from https://www.capstoneeatonrapids.com/ on Oct 15, 2026.
- **Draft:** written for this redesign; not yet approved.
- **Assumption:** inferred, not stated anywhere.

| # | Item | What the page shows now | Source | Action needed |
|---|---|---|---|---|
| 1 | Accepting new patients? | Not stated anywhere | n/a | Confirm. If yes, add "Now accepting new patients" to the hero. If no, change the New Patients section. |
| 2 | Fax number | 517-836-2182, labeled "Fax" | Live site (shown there with a fax icon only) | Confirm it is a fax line, not a second phone line. |
| 3 | Email address | office.capstonefp@gmail.com | Live site | Confirm it is still monitored. Consider an @capstoneeatonrapids.com address. Update the page and the JSON-LD `email` if it changes. |
| 4 | Weekly hours | Mon–Thu 8:00 AM–5:00 PM, Fri 8:00 AM–12:00 PM, lunch 12:00–1:00 PM | Live site | Re-confirm. |
| 5 | Weekend hours | Saturday and Sunday shown as **Closed** | Assumption (the live site lists no weekend hours) | Confirm. |
| 6 | Lunch closure days | Applied to Mon–Thu only | Assumption (Friday closes at noon) | Confirm. |
| 7 | Holiday schedule | All holidays in `hours.js` are set to open (`false`). The page says "Holiday hours may differ, so please call to confirm." | n/a | Ask which holidays the office closes (or has shorter hours) and switch them on in `hours.js` (`true` or the hours). |
| 8 | Patient portal URL | https://29799.portal.athenahealth.com/ | Live site | Confirm this is still the practice's portal. |
| 9 | Accepted insurance | 10 plans. "Aetna" and "Aetna (Most Plans)" were merged into **"Aetna (most plans)"**. | Live site | Re-verify the full list, including whether plain "Aetna" meant all Aetna plans. |
| 10 | Not-accepted insurance | Medicaid (primary or secondary), HAP, McLaren, Meridian, new auto and workers' compensation cases | Live site | Re-verify. |
| 11 | Medicaid self-pay statement | "Self-pay is not available for Medicaid-covered services, per CMS guidelines and federal law." | Live site (reworded) | Confirm the wording with the practice or its compliance contact. |
| 12 | Service descriptions (7 cards) | One-sentence descriptions | **Draft**, based on the live site's service names and About text | Approve or edit each one. "Same-day sick visits" and "Minor in-office procedures" come from the About paragraph, not the original services list. |
| 13 | New-patient steps (4 steps) | Call → check insurance → complete registration → first visit | **Draft** (proposed process) | Replace with the real process. If there are new-patient forms (the old site had a commented-out link to `pdf/NewPtScreeners.pdf`), provide the current file. |
| 14 | After-hours instructions | Not published. Only "If you have a medical emergency, call 911 or go to the nearest emergency room." | n/a | Provide the after-hours line or instructions. |
| 15 | Provider name, credentials and bio | Pam Becker, NP-C. Board-certified Family Practice Nurse Practitioner; MSN, Michigan State University; emergency nursing background | Live site (lightly edited) | Confirm wording and credentials. |
| 16 | Provider headshot | The original 320 × 298 px photo, cropped square and shown at a maximum of 260 px | Live site | Provide a professional headshot of at least 800 × 1000 px. |
| 17 | Other providers | The old site's source contains commented-out bios for Dr. Ivan Morris, D.O. and Julie Teceno, FNP-C | Live site (hidden content) | Confirm whether they still practice here. Not published. |
| 18 | Address and map pin | 2487 S. Michigan Road, Suite E, Eaton Rapids, MI 48827. The map reuses the old site's Google embed. | Live site | Confirm the pin lands on the correct building or suite. Geo coordinates were left out of the JSON-LD until verified. |
| 19 | Privacy policy | No link in the footer | n/a | Provide the Notice of Privacy Practices (page or PDF) and any other required notices, then add the link to the footer. |
| 20 | Hero photo | The practice's original family photo (mother and two children among blossoms), `family.jpg`, 640 px | Live site | Kept at the practice's request. Only a 640 px version exists, so it looks slightly soft on large screens; a larger original (≥ 1600 px) would make it sharp. |
| 22 | Services background photo | Light duotone of a real photo: family walking in a field, by Jessica Rockowitz, Unsplash (Unsplash License) | Stock | ✅ Licensed. Replace with a photo of the office or building when you have one (≥ 1920 px wide). |
| 23 | New Patients photo | `waiting-room.webp`, the site designer's own photo (reception desk and waiting chairs) | Site designer | ✅ Resolved: owned by the designer. Optional: a photo of Capstone's own waiting room would help patients recognize the office. |
| 24 | FAQ background photo | Light duotone of two people holding hands, no faces, by Nani Chavez, Unsplash (Unsplash License). Moved here from Contact at the owner's request | Stock | ✅ Licensed. |
| 25 | FAQ answers | Seven answers written only from facts already on the page (hours, same-day visits, insurance, Medicaid, self-pay, provider, emergencies) | Draft | Approve the wording. If the office has after-hours instructions or is or isn't accepting new patients, add those as questions. |
| 21 | Logo | Recolored from the white PNG to maroon on a transparent background | Live site asset | Provide the original vector logo (SVG/AI/EPS) if available. |

## Structured data (JSON-LD) notes
- Included only facts that appear on the page: name, URL, logo, phone, fax, email, address, opening hours and `medicalSpecialty: PrimaryCare`.
- **Not included on purpose:** geo coordinates, insurance, services, provider credentials, ratings and reviews. Add them only after verification.
- `openingHoursSpecification` encodes the lunch break as two time ranges. If items 4–6 change, update it.
- Schema markup doesn't guarantee rich results or better rankings.
