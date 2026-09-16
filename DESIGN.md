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

Syllabus dates: MIS 445 October 23, 2:30–4:30 PM tentative; ACCT 212 September 22 and October 29 in class, section times unconfirmed; MGMT 411 November 4 quiz and December 16, 5 PM Comp XM deadline. The supplied university final schedule now confirms MIS 445 section 01 on December 11, 12:50–3:20 PM, LH 009, and ACCT 212 section 01 on December 14, 8:05–10:05 PM, AA G008. Do not upload private syllabus documents.

Validation: Playwright across Chromium, Firefox and WebKit; date model tests; keyboard/calendar behavior, 320–1440px layouts, WCAG AA automated checks, real scroll transform changes, reduced motion, no-JavaScript fallback, and visual inspections.

## Spring countdown and Montfort motion refinement

Reference inspection on September 16, 2026:
- Spring 2026 source at https://github.com/t4ll4t/spring-2026-counter: its hero exposes days, hours, minutes, seconds individually; the stats also show floor(total milliseconds / 3,600,000). Fall now exposes both remaining hours within the current day and total hours to the user's December 17 departure. These are separate from scheduled class hours.
- https://mont-fort.com/ was inspected in a browser at its opening scene and successive scroll positions. The useful visual principle is a continuous spatial scene and camera movement with staged typography. This implementation uses an original paper plane rather than Montfort assets, branding, or mountains.
- Primary implementation references: https://threejs.org/docs/ and https://gsap.com/docs/v3/Plugins/ScrollTrigger/ and https://gsap.com/docs/v3/GSAP/gsap.matchMedia()/.

The flight chapter uses locally served Three.js 0.186.0: articulated original paper geometry, personalized texture, physical materials, studio reflection panels, cast shadows, and a scroll-controlled camera. Four rotations follow the semester chapters. Rendering occurs on scroll/resize updates, without an idle rendering loop. The library loads as the chapter approaches; device pixel ratio is capped at 1.6. Reduced-motion preference collapses the chapter into static readable content, and a failed module or WebGL context retains the full semester text. The cloud ending expands from a framed composition as it enters view.

45 Playwright checks pass across Chromium, Firefox, and WebKit, including WebGL rendering, actual scroll-controlled rotations, changing motion preferences, blocked module fallback, hour rollover, departure clamping, all previous calendar interactions, and automated AA checks. The six independent date-model tests remain unchanged.

## Final schedule integration

User-supplied university schedule screenshots confirm MIS 445 section 01 (Surinder Kahai) and ACCT 212 section 01 (Anthony Meder). The ACCT section is grounded in the existing ACCT-212-01 syllabus. Section 02 shares the same final slot; section 03 does not. Finals and the December 16 5 PM Comp XM deadline appear in the week and month calendars, upcoming milestones, and next-event summary. Regular attendance counts remain separate. Screenshots are source evidence and are not uploaded as site assets. Validated with seven model tests and 48 browser checks across three engines.
