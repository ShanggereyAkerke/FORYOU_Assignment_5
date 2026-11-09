# FORYOU design study

## Scope and assumptions

Brand: FORYOU. Audience: students and young adults in Kazakhstan, approximately 18-30 (assumption for review). Products: 14 neutral everyday basics. Stack: existing HTML, CSS, Bootstrap, JavaScript and jQuery. First review: homepage only. Catalog, product detail, cart, checkout, About and Contact are the roadmap; their redesigns require approval after the homepage.

## Reference analysis before coding

References: the seven user-provided Uniqlo screenshots and https://www.uniqlo.com/us/en/ (reviewed 9 November 2026). Visual dimensions are estimates from screenshots, not measurements of Uniqlo source CSS. Reasons below are UX interpretations, not claims about Uniqlo's internal research. Screenshots establish desktop states; exact mobile behavior, hover effects and timings are not established by still images.

| Area | Observed principle and UX reason | FORYOU adaptation |
| --- | --- | --- |
| Layout | Broad campaigns alternate with contained shopping sections. Aligned edges and repeated four-column product rows make visual comparison easier. White space separates browsing tasks. | A 1280px maximum container, 20-48px gutters, four product columns on desktop and two on phones. A photo mosaic introduces the palette; compact category links shorten browsing. |
| Typography | Neutral sans-serif labels, larger campaign titles and clear prices put the product ahead of long text. Few weights keep emphasis meaningful. | Georgia display headings and Arial UI/body. Product names and KZT prices remain easy to scan. Keep descriptions outside images. |
| Color | Large neutral areas let clothing colors lead. Red appears in identity and commercial emphasis; the campaign screenshot also shows that promotion can occupy a large red field. | White, black and charcoal interface surfaces keep clothing colors central. No copied red campaign, fake discounts or urgency. |
| Imagery | Lifestyle images communicate use and feeling; uniform studio views support product comparison. Product rows appear portrait-oriented, while campaigns are broad. | Existing FORYOU lifestyle and generated catalog images only. Preserve full garments, use consistent 4:5 product frames and square small outfit tiles. No Uniqlo assets. |
| Navigation | Search and category entry points reduce the effort of finding an item. Persistent access helps people change direction. Very large menus serve a large catalog. | Four departments, one visible search field and a compact mobile disclosure. Keep existing bag access; do not pretend an unbuilt checkout exists. |
| Components | Repeated names, prices, swatches and selected-state borders make comparison and selection predictable. Filters and result counts clarify what is being shown. | Reusable previews from one product data source. Plain KZT prices. Category buttons announce selection and results. No fake color variants, bestseller badges or stock claims. |
| Microinteractions | Selected and focused states communicate location; progress and success feedback reduce uncertainty. Still images do not establish exact hover/loading behavior. | 160-240ms control feedback, restrained image motion, reduced-motion support, native focus, and the existing validated submit/spinner/toast behavior. No automatic promotion carousel. |

## Page map

| Page | Apply and why | Skip or adapt | Original identity |
| --- | --- | --- | --- |
| Home | Image-led introduction, simple categories, a short selection with prices. People can understand and enter the range quickly. | A huge mega menu or sale wall is excessive for 14 items. | Photo mosaic with a monochrome interface, browsing by layer, own wording and palette. |
| Catalog | Repeatable images and facts, filters, counts and clear empty states make comparison easy. | Avoid many empty filters and unsupported color variants. | Four groups, useful KZT price bands and existing live text search. |
| Product detail | Big garment photos, explicit size selection, useful fit information and one main action. | Do not add swatches without variant photos or manufacture inventory information. | Plain fit notes and real demo size-table measurements. |
| Cart | Clear items, quantities, totals and reversible removal reduce mistakes. | Skip editorial campaigns and distracting upsells. | Compact bag with KZT totals and straightforward language. |
| Checkout | A clear sequence and visible order summary reduce uncertainty. | No fake payment processing or invented delivery promises. | Clearly identified university demo with locally relevant field labels. |
| About | Lifestyle imagery and readable narrative build context. | A global retail corporation's story does not fit a two-person project. | Actual team, purpose and student concept. |
| Contact | Searchable help, clear labels, validation and success feedback support recovery. | No unnecessary chatbot or store finder. | Existing sizing FAQ, copy link and local form demo. |

## Design system

| Token | Value | Purpose |
| --- | --- | --- |
| Ground | #FFFFFF | White page surface |
| Ink | #242424 | Body text and dark fields |
| Accent | #202020 | Black primary actions and selection |
| Accent hover | #444444 | Stronger action feedback |
| Soft surface | #F3F3F3 | Search and secondary fields |
| Olive | #526247 | Supporting field and palette reference |
| Muted ink | #606060 | Secondary facts, never primary body copy |
| Success | #315D3E | Confirmed successful action |
| Error | #9C2638 | Validation messages |
| Focus | #202020, 3px outline + 4px offset | Keyboard visibility |
| Type | Georgia headings; Arial body/UI | Warm editorial identity and familiar controls |
| Type scale | 14 / 16 / 20 / 36 / fluid 54-92px | Secondary text / body / product / section / hero |
| Spacing | 4 / 8 / 12 / 16 / 24 / 32 / 48 / 64 / 96 / 128px | Consistent grouping and section rhythm |
| Corners | 0px images/buttons; 2px input surfaces | Clear, restrained geometry |
| Shadows | None at rest | Product photos supply depth |
| Images | 4:5 previews, square outfit tiles, broad lifestyle image | Compare products while showing real use |
| Buttons | 48px minimum height, one solid action, underlined secondary links | Clear priority and touch targets |

Keep the existing dark theme through the existing palette variables. Text/focus contrast and layout are checked in the browser. Layout changes start from the phone arrangement; enhancement breakpoints are 640px and 960px.

## Homepage argument and copy

1. These are coordinated everyday basics: 'Made for your days.' Show one real FORYOU outfit and three garment specimens. CTA: 'Explore 14 pieces'. Supporting line: 'Comfortable layers, easy colors. Fourteen pieces to make getting dressed a little simpler.'
2. Find the part of the wardrobe you need: four compact category entries, with actual counts.
3. Choose a starting piece: a live category selector above four product previews, showing real prices and a link to the full filtered collection.
4. The colors belong together: an asymmetric knitwear/outerwear photo field and a short explanation. CTA: 'The story behind FORYOU'.
5. Keep in touch or get help: existing subscription dialog and simple footer links. Keep earlier course features available in Display & sound preferences.

Inventory: the name FORYOU; 14 garments; chalk/moss/sand/charcoal; KZT prices from 8,900; the two-member SE-2504 team; warm beige catalog photographs; the existing studio outfit scene; the size guide; the student-concept context; the everyday layering idea.

Idea: On this page, FORYOU's 14-piece chalk/moss/sand/charcoal wardrobe becomes a small visual field guide to getting dressed. The live element is the category selector that changes the actual preview pieces and their KZT prices.

Direction: specimen-catalogue, selected because the project has 14 isolated garment photos. Retain the brand's typography; revise interface colors to white, black and charcoal following user feedback. Use the direction's photo cluster, flat fields and outside labels. The generic mountain photographs and the plinth sub-blueprint do not fit these existing clothing assets; the direction's own mosaic composition takes precedence. No borrowed images, logos, product names or promotional copy.

Implementation boundary: catalog styling stays unchanged. Shared product data and query-link support are small compatibility changes so home links reach working existing catalog results. All next-page design work waits for approval.

## Review notes

- Reusable product previews and category counts read the same 14-item data source as the existing catalog. Category totals are 6 tops, 2 knitwear, 3 bottoms and 3 outerwear.
- Connected-browser checks: All shows four selected pieces; Knitwear shows two; Outerwear shows three. Their controls retain focus and announce a result count. Homepage search opens the matching existing catalog query. Header arrow navigation works, while arrows inside search remain text-editing keys.
- Mobile check: 390px viewport, 375px document width (the browser reserves a scrollbar), two-line 54px headline and a working disclosure menu. Desktop and tablet screenshots are reviewed separately.
- Existing subscription dialog opens/closes; dark theme toggles; local file links and IDs validate; custom JavaScript parses. No product variant, shipping, discount or stock claims were added.
- Source design lint passes with zero failures/warnings. The standalone CDP inspector timed out at Page.enable, so visual QA uses the connected browser and its DOM measurements rather than claiming a passed automatic visual inspection.
- Visual review, first pass: warm photography and the large two-line title establish the subject; compact categories and a 2/4-column selection make shopping legible; the palette story has a different composition. Corrected a sizing defect where HTML image dimensions overrode the intended image frames. Shortened the header search hint to prevent clipping.
- Originality tweak for review: replace the studio lifestyle scene with your own campus outfit photograph while retaining the product grid and rose/chalk palette.

This is a local homepage review. The live site is not replaced while the first page is awaiting feedback; no next-page redesign has been started.

## Palette revision

User selected white, black and charcoal. The homepage uses white surfaces, charcoal text, black actions and light-gray secondary fields. Garment photographs retain their natural colors. Night mode uses neutral charcoal surfaces and light text. Other pages remain for their own review.

## Banner and navigation revision

Home now opens with a full-width lifestyle banner and legible overlaid text. Rounded, lighter-weight action buttons replace square blocks. Display and sound controls sit directly in the navigation, wrapping on mobile. Background cycling uses White, Mist and Silver; night mode remains independent.

## Simplified campaign layout

Removed the hero description and price, shortened its action to Explore, removed the three outfit thumbnails and category subtitle. Replaced the palette story with a newly generated original full-width campaign photograph. Navigation overlays the hero with a translucent blurred background and turns solid after scrolling for readable controls. Checked desktop and 390px mobile layout, banner loading and category filtering.

## Greeting search and clear overlay

The search placeholder uses the existing switch-based local-time greeting and refreshes every minute without altering input values. Removed the separate greeting section. Removed header blur and tint; a continuous hero shading and text shadows support white navigation, with a solid header after scrolling and during an expanded mobile menu. Verified search submission and mobile overflow. Reference: https://www.uniqlo.com/us/en/ and supplied screenshots.

## Catalog redesign review

Catalog uses the homepage monochrome tokens and a solid shared navigation. Extracted the header and image shopping menu into js/navigation.js so both pages use one implementation. Added category photo shortcuts linked to live search, four-column desktop/two-column phone products, and rounded actions. Product descriptions and interactive ratings remain in expandable Details & rating. Existing search autocomplete/highlighting, price filtering, lazy images, bag notifications, size table and multi-step size finder remain functional.

Verified: outerwear search gives 3, outerwear + under 20,000 gives 0, hoodie search gives 1, empty search state, bag adds 18,900 KZT, rating 4/5, size recommendation M for 96/80/98 regular, menu has 14 links, night mode, no horizontal page overflow at 390/1440, and homepage shared-navigation regression. Personalization option: photograph your own garments in the same crop for a more distinctive catalog. Catalog awaits review before the next page.

## About and Contact redesign

Both pages now reuse the monochrome shared navigation, shopping menu and homepage footer. About gives the store image and brand story more room, simplifies team content and keeps the three animated counters plus nine-slide lookbook. Contact uses a clear introduction, sizing shortcut, searchable FAQ and a separate registration demonstration surface. Existing IDs and behavior hooks remain intact.

Verified About at 1440px and 390px: active navigation, counters 14/9/2, nine carousel slides, Next loads Easy knit, no horizontal overflow. Verified Contact: FAQ search returns one match for size, FAQ disclosure toggles, empty registration validation and successful sample registration, reset, day/night mode, 14-link shopping menu, copy-link click and 390px layout. Optional personal touches: own team photo for About and own clothing-display photo for Contact.

## Dedicated bag

All shared navigation bag links now open bag.html. Product additions use a shared browser-local cart store with validated IDs and quantities (1-99); saved items survive page navigation/reload. Bag shows actual product photos, unit prices, quantities, line totals and total, with remove and empty states. No checkout or payment is claimed. Collection and shared stylesheet versions were updated, and the exact collection.html URL was reloaded and confirmed to use the redesigned catalog.

Browser checks: add from catalog, follow bag link, change 18,900 KZT item to quantity 2 = 37,800 KZT, reload retains quantity, remove produces empty state, phone populated/empty layouts have no horizontal overflow. Test item removed after verification.

## Public copy cleanup

Removed student/demo messaging throughout public HTML, footers, metadata, FAQs, sizing help, bag and subscription/registration forms. Removed the demonstration acknowledgment checkbox and its validation. Form completion feedback now describes validation accurately without claiming account creation or subscription. Verified empty-field errors and successful email-format feedback.

## Dark background and link audit

Enabled background cycling in dark mode with Charcoal, Graphite and Midnight, separately persisted from light mode. Removed the responsive study page and all public links to it. Versioned internal navigation and assets to avoid older cached HTML/styles. Checked 104 static internal destinations/anchors across five pages with no missing targets; followed footer story/help, size guide and Bag links in-browser and verified current layouts. Corrected search contrast on dark inner pages.

## Public country API

Added profile.html, linked from every footer and the visual shopping menu. js/profile.js uses async/await and fetch to request https://countriesnow.space/api/v0.1/countries/iso. The API supplies country names/ISO codes for the profile preference selector. Loading, 12-second timeout, HTTP/schema failure, retry, required-selection validation and localStorage saving are implemented. Only the selected ISO code is saved under foryou-profile-country.

Browser verification: 222 country options plus placeholder loaded; empty save validation; Kazakhstan saved and restored on reload; 390px layout has no horizontal overflow. Mocked source checks verify loading, failed HTTP response, retry success, malformed entry filtering and save. Earlier candidate endpoints failed in the browser; CountriesNow is the final working provider. This completes the public API feature and adds the sixth page. Account registration/login/profile identity are still separate pending requirements.

## Login and registration

Added login.html with Log In and Register views. Registration validates name, email, phone (7-15 digits), password complexity (8-128, upper/lowercase, number, symbol, no spaces) and matching confirmation through JavaScript with novalidate; inputs do not rely on HTML validation attributes. Browser-local accounts use salted PBKDF2 SHA-256 password hashes (100,000 iterations), never plaintext passwords. Login checks the stored hash and opens Profile. Profile displays the stored name/email/phone and requires a local session; logout clears the session. Country preferences are now stored per account.

Added a navbar account icon. Verified empty fields, phone/weak-password/mismatch errors, registration, duplicate email, incorrect password, valid login, saved profile details after reload, logout, logged-out Profile redirect, 390px layout and dark mode. Source checks also verify hashes, duplicate rejection and session handling. The site now has seven pages; final hosting and final submission materials remain separate work.

## Expanded clothing collection

Added 22 original catalog garments and matching generated photographs; shared catalog now contains 36 pieces: 12 tops, 7 knitwear, 9 bottoms, 8 outerwear. Removed visible search-count and price-filter-count lines while retaining screen-reader status updates. Updated homepage links, About counter and no-JavaScript catalog markup. New assets and prompts are listed in images/CATALOG_EXPANSION.md. Verified category/price search and adding/removing new Cropped bomber (39,900 KZT). All 36 product names, images and image file hashes are unique.

## Category navigation simplification

Replaced the 36-product shopping menu and its filter tabs with five large category links in one row. Catalog category photos are now text-only pill filters alongside price filters; category, price and keyword search combine independently. Verified direct Outerwear link gives 8 results, Outerwear under 20,000 gives 0, Tops under 20,000 gives 7, and five menu links remain in one row at 390px and 1440px. Removed leftover updateProgress calls after the earlier progress-bar removal.
