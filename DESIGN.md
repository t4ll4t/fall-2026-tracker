# Fall 2026 tracker

A personal working dashboard for Sahil at Binghamton. The time until departure and remaining attendance are the primary results.

References: the existing Spring tracker, https://github.com/VoltAgent/awesome-design-md/blob/main/design-md/linear.app/DESIGN.md, and the context-appropriate principles in https://github.com/Leonxlnx/taste-skill. This is an original application of those principles, not an official Linear implementation. Taste's current marketing-only rules do not apply to this dashboard.

- Graphite canvas and lime countdown. Muted purple distinguishes MGMT 411; green distinguishes MIS 445; amber identifies breaks and exams.
- DM Sans for working text, Manrope for large numbers. Self-hosted fonts. 16px paragraphs, 14px working controls, 12px supporting metadata.
- Base spacing 4px. Main panels 24px padding, 12px radius. Controls 8px radius. Calendar cells divide real dates and sessions.
- No decorative imagery, 3D objects, animation loops, or scroll interception. Short entrance motion respects reduced-motion preferences.
- Static HTML, CSS, and modules: all class calculations execute locally. No account, database, or tracking required by the page.
- All time logic is pinned to America/New_York. The departure instant is December 17, 2026, at 11:00 AM EST. ACCT 212 adds no attendance.
- Official university source: https://www.binghamton.edu/academics/academic-calendar.html (checked September 16, 2026).
- Exam source: https://www.binghamton.edu/offices/spase/classroom-scheduling/final-exam-scheduling.html. Course-specific times are unconfirmed, not inferred from ordinary meeting times.

Syllabus refinement: MIS 445 cancellation on Sep 16 reduces full-term sessions to 55 (42 dates). MIS 445 syllabus p. 6 specifies Oct 23 at 2:30-4:30 PM, tentative. ACCT 212 syllabus p. 4 confirms Sep 22 and Oct 29 in-class exams; section time not assumed. MGMT 411 schedule gives Nov 4 quiz and Dec 16 5 PM hard Comp XM deadline (university last exam day); window start tentative. Do not upload the full syllabi as public assets.
