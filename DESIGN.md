# Fall ’26: Sahil’s semester

An original cinematic personal tracker with a working calendar, not a marketing template. The existing data model and verified academic rules remain unchanged.

## Visual system
- Charcoal #151513, warm white #f4f1e9, copper #f99a68. Sage marks MGMT 411, sand marks MIS 445, blue-gray marks calendar closures.
- Self-hosted Manrope for expressive display type and tabular countdown figures; DM Sans for working text.
- Wide image compositions, asymmetric text, open spacing, small 3–6px corners, and restrained ruled tables. Avoid repeated card grids.
- Original generated conceptual autumn river and departure cloud artwork. These are atmospheric illustrations, not claimed photographs of Binghamton or an actual flight. JPEG exports preserve the original compositions and reduce transfer size.
- Desktop sticky navigation and semester overview. The phone calendar becomes a readable daily list. The monthly view keeps accessible date buttons.

## Motion
Local GSAP + ScrollTrigger (https://gsap.com/docs/v3/Plugins/ScrollTrigger/) links image position, image scale, timeline drawing, and milestone typography to native scrolling. No scroll interception, artificial loader, cursor replacement, or perpetual animation. Content is visible before motion loads. Reduced-motion preference removes all scroll animations, including after an OS preference change. ResizeObserver refreshes scenes after calendar layout changes.

## Verified behavior
All calculations are pinned to America/New_York, including the November DST change. Departure is December 17, 2026 at 11 AM EST. Full-term attendance totals 42 distinct dates and 55 sessions. MGMT 411 meets Wednesday/Friday 11:45–1:15; MIS 445 Monday/Wednesday 1:30–3; ACCT 212 home study adds no regular attendance. September 16 MIS 445 is cancelled per syllabus.

University sources checked September 16, 2026: https://www.binghamton.edu/academics/academic-calendar.html and https://www.binghamton.edu/offices/spase/classroom-scheduling/final-exam-scheduling.html.

Syllabus dates: MIS 445 October 23, 2:30–4:30 PM tentative; ACCT 212 September 22 and October 29 in class, section times unconfirmed; MGMT 411 November 4 quiz and December 16, 5 PM Comp XM deadline. MIS 445 Exam 2 and ACCT 212 final times remain unconfirmed. Do not upload private syllabus documents.

Validation: Playwright across Chromium, Firefox and WebKit; date model tests; keyboard/calendar behavior, 320–1440px layouts, WCAG AA automated checks, real scroll transform changes, reduced motion, no-JavaScript fallback, and visual inspections.
