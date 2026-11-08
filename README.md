# FORYOU - Assignment 6: jQuery

Team FORYOU, group SE-2504. Members: Asankhan Shyngys and Shangerey Akerke.
This continues the same clothing-store project, preserving Assignments 4 and 5.
The final-project collection contains 14 distinct garments with local product photos, descriptions and prices.
New image prompts and provenance are recorded in `images/GENERATED_ASSETS.md`.

Live website: https://shanggereyakerke.github.io/FORYOU_Assignment_5/

## Run

Open `index.html`, use VS Code Live Server, or serve this folder with any static HTTP server.
No build or package installation is needed. For clipboard support, use localhost or HTTPS.
Every main page requests jQuery 4.0.0 from the required official CDN in its head.
If the CDN is unavailable, the identical local version in `vendor/` loads instead.
`script.js` uses `$(document).ready()` and prints `jQuery is ready!`.
The separate media-query exercise remains a pure HTML/CSS exercise.

## Requirement map

| Task | Where to demonstrate | Implementation |
| --- | --- | --- |
| 0. Setup | Console on any main page | CDN in head, external `script.js`, ready callback and exact log message |
| 1. Live filter | Collection: type shirt, moss or jacket | jQuery input handler filters rendered product columns by title, description and image alternative text; works with price filters; clear and empty states |
| 2. Autocomplete | Collection: type sh | Accessible listbox, title suggestions, click selection, Up/Down and Enter, Escape, Tab and blur dismissal |
| 3. Highlighting | Collection search; Contact: search size | Every matching occurrence in the search content becomes a mark element; FAQ answers open for matching content; clearing restores text |
| 4. Scroll progress | Scroll any main page | Rose fixed progress track with ink leading marker, scroll/resize/load listeners, clamped 0-100 percentage, ARIA progressbar |
| 5. Number counter | About: Small by design | Real facts 14 pieces, 9 images, 2 members; jQuery animate, once on entering viewport; reduced-motion alternative |
| 6. Submit spinner | Subscribe or Contact registration | Validate first, disable button, show spinner and Please wait, 1.4-second simulated operation, restore button; reset/close cancels pending timer |
| 7. Notifications | Collection: Add to bag; valid form; Copy link | Shared temporary live-region toast with jQuery fadeOut and cancellation of previous timer |
| 8. Clipboard | Contact: Copy link | Clipboard promise, checkmark, visible Copied to clipboard tooltip and toast; truthful failure message |
| 9. Lazy loading | Home lower images; About lookbook; Collection cards | jQuery scroll/resize visibility checks assign data-src to src; carousel loads the next selected slide before transition; noscript fallback for static imagery |
| Deployment | GitHub Pages URL above | Shared repository and existing Pages hosting |

## Source map

- `script.js`: Assignment 6 jQuery behavior with numbered task comments.
- `css/assignment6.css`: additions matching the existing chalk, ink and rose palette.
- `js/site.js`: earlier forms, FAQ, popup, palette and clock; valid submits call the new loading helper.
- `js/common.js`: saved theme/sound, greeting and arrow-key header navigation.
- `js/collection.js`: product data, price filters, rating, bag and size finder; dispatches jQuery events so search and notifications follow rerenders.
- `evidence/`: website screenshots and captured console log; the report and submission ZIP use website screenshots only.
- `output/pdf/FORYOU_Assignment_6_Report.pdf`: illustrated report with steps, results and reflection.

## Verification

Browser checks cover search typing, autocomplete keyboard selection, regex punctuation, no matches,
price-filter/search interaction, FAQ matches, bag toast, actual clipboard contents, valid and invalid
form submissions, cancellation, final counter values, carousel lazy loading, 100% scroll progress,
phone layouts at 390px, and retained arrow navigation. Source syntax and whitespace checks pass.
The design source linter passes. Its separate CDP visual inspector timed out; screenshots were reviewed
using the connected browser instead. No backend is claimed: registration, subscription and bag are demos.

## Defense and submission

Explain how input differs from keyup (it also handles paste and mobile input), why search text is
escaped before regex matching, why highlights use text nodes instead of raw HTML, how autocomplete
preserves input focus, and how filters cooperate after rerendering. Explain the scroll denominator,
one-shot counters, timer cancellation, truthful clipboard success, and the hidden-carousel exception.

Both members must submit the project ZIP and PDF report in LMS before its stated deadline and defend
the work at the practice lesson. Those personal LMS submissions and the oral defense are not automated.
