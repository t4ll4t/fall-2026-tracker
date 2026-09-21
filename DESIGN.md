# Fall ’26 — the next chapter

An image-free personal semester tracker, rebuilt around the oversized typography, dark surfaces, and flowing linework of Sahil’s Spring 2026 tracker.

## Visual system

- Near-black #06080b, bright text #f4f6fb, muted text #a0a8b7, and ice blue #a4c8ff. Course and exam colors distinguish events in the working calendar.
- Self-hosted Manrope provides expressive display type and tabular countdown figures. DM Sans handles supporting text.
- An oversized split Fall ’26 title leads into individual days, hours, minutes, and seconds, total departure hours, and compact attendance cards. Calendar and upcoming events remain immediately useful.
- Finals get three date-led cards, followed by the complete assessment table. The ending becomes a large typographic departure moment.
- All visual artwork is drawn in code. No photographs, generated image assets, or pasted screenshots are used.

## Motion

Locally served GSAP and ScrollTrigger choreograph separating hero text, clipped heading reveals, staggered finals cards, and the outlined departure title. A lightweight canvas draws slowly flowing lines. Card highlights follow the pointer. Native scrolling remains intact.

The Three.js sculpture consists of the 42 actual attendance dates. A circular fan unfolds into a seven-column calendar grid as the reader scrolls. Past dates have darker faces. The scene loads near the viewport and renders on interaction rather than running an idle 3D loop. Pixel density is capped at 1.5. If WebGL or its module fails, a readable HTML date grid remains.

A persistent motion control pauses the choreography and background. The operating system’s reduced-motion preference also produces a static layout. Calendar size changes refresh scroll positions.

## Academic model

All calculations use America/New_York, including the November DST change. Departure is December 17, 2026 at 11 AM EST. The full term has 42 distinct attendance dates and 55 sessions. MGMT 411 meets Wednesday/Friday 11:45–1:15; MIS 445 Monday/Wednesday 1:30–3; ACCT 212 home study adds no regular attendance. September 16 MIS 445 is cancelled per syllabus.

University calendar and scheduling sources were checked September 16, 2026:
- https://www.binghamton.edu/academics/academic-calendar.html
- https://www.binghamton.edu/offices/spase/classroom-scheduling/final-exam-scheduling.html

User-supplied final schedule screenshots and the existing section syllabus establish:
- MIS 445 section 01: December 11, 12:50–3:20 PM, LH 009, Surinder Kahai.
- ACCT 212 section 01: December 14, 8:05–10:05 PM, AA G008, Anthony Meder.
- MGMT 411: Comp XM due December 16 at 5 PM, self-paced.

Other syllabus assessments remain labeled with their current certainty: MIS 445 October 23, 2:30–4:30 PM tentative; ACCT 212 September 22 and October 29 in class, section times unconfirmed; MGMT 411 November 4 quiz. Finals appear in weekly/monthly calendars and next-event summaries while attendance counts remain separate. Private syllabus documents and source screenshots are not distributed with the site.

## Verification

45 Playwright checks across Chromium, Firefox, and WebKit cover calendar interaction, hours and countdown rollover, time zones, completion, 320–1440px layouts, keyboard access, automated WCAG AA checks, no-JavaScript content, actual scroll changes, motion pause/resume, 3D date rendering, and module-failure fallback. Desktop and phone screenshots are reviewed separately for visual quality. Independent date-model tests verify academic totals and final-event timing.
