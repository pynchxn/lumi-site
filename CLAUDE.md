# Lumi — dineatlumi.co.uk

Static marketing site for **Lumi**, a pop-up dining experience by chef Josh Spear.
Nine HTML pages, one stylesheet, two JS files. No framework, no build step, no
package.json. Open any `.html` in a browser and it runs.

## Client

Josh Spear. Not a developer. He edits the site himself, so keep it editable by
hand and keep content out of markup where possible.

## Structure

```
index.html  about.html  pop-ups.html  dishes.html  pantry.html
contact.html  booking-terms.html  privacy.html  404.html
assets/styles.css      all design
assets/content.js      events, dishes, products, Mailchimp config  ← Josh edits this
assets/site.js         behaviour, guarded so one file serves all pages
assets/images/         photographs (currently placeholders)
sitemap.xml  robots.txt
```

## Design rules — these came from the client, don't undo them

- **Light palette only.** Cream `#FAF3E7`, deeper cream `#F0E6D4`, clay `#8B5D4A`,
  russet `#5D1F0A`, ink `#2E1C15`, muted `#6F5D4D`. All sampled from the logo.
  The hero and footer were originally dark; the client explicitly asked for both
  to be light. **Do not reintroduce dark sections.** The only saturated element
  left is the russet pantry panel on the homepage, and that's on notice.
- **The sunburst is the signature.** Redrawn from the logo as SVG paths, it draws
  outward from the centre ray on load. It appears in the hero and the footer only.
  A third instance dilutes it.
- **Wordmark is a script.** Yellowtail stands in for the real logo, Caveat for the
  "By Josh Spear" byline. Fraunces for headings, Jost for body. The script does
  branding only — never section headings.
- **No dark mode.** Deliberate. A second palette isn't in the brand.
- Restraint over decoration. Reveal animation is one fade-up, used consistently.
- **The hero lockup is optically aligned in JS** (`centreInk` in `site.js`). CSS
  centres a text box by advance width; the logo centres the ink bounding box —
  measured off the original artwork, the two agree to within 1%. The script face
  has lopsided side bearings, so the difference is visible. It uses `left`, not
  `transform`, because the fade-in keyframe ends on `transform:none`. All of this
  becomes unnecessary the moment the real logo SVG replaces the font stand-in.

## Known gotchas — both of these have bitten already

1. **Never put `backdrop-filter`, `filter`, `transform` or `will-change` on
   `.head`.** The mobile menu is `position: fixed` inside it, and those properties
   make the header a containing block for fixed descendants — the full-screen menu
   collapses to the height of the header bar. The frosted background lives on
   `.head::before` for exactly this reason.
2. **`.rv` elements start at `opacity: 0`** and are revealed by an
   IntersectionObserver. The observer must stay document-wide. Scoping it to a
   subtree silently hides anything outside that subtree. There's a fallback that
   reveals everything if IntersectionObserver is unavailable — keep it.

Also: `.head` is `pointer-events: none` with `.head > * { pointer-events: auto }`,
because a full-width transparent fixed bar otherwise swallows clicks on content
scrolling underneath it.

## Not real yet

- **Payment.** Booking form collects details, shows a confirmation, takes no money
  and holds no seat. Needs Stripe.
- **Emails.** No confirmation actually sends. Must send *from*
  `bookings@dineatlumi.co.uk` — the confirmation screen promises that address.
- **Contact form.** Doesn't deliver. When wired, route on the subject dropdown:
  *A booking I've made* → bookings@, everything else → hello@.
- **Mailing list.** Ready — Mailchimp embed, needs the action URL and honeypot
  field name pasted into `MAILCHIMP` in `content.js`. Turn double opt-in on.
- **Copy and imagery.** Menu, event listings and all photographs are placeholders.
  Every image slot describes the shot that belongs there.

## Needs a human, not a model

- `booking-terms.html` — cancellation window and refund rules are drafted defaults.
  Josh must confirm them, and they must match what Stripe is configured to do.
- `privacy.html` — plain-English outline, not a finished notice. Mailchimp is
  named; payment provider and analytics still need adding with lawful basis and
  retention periods. Don't generate final legal wording.

## Open items

- **Fonts load from Google.** No cookies, but visitor IPs go to Google. Self-hosting
  removes the question and speeds up load. Not done yet.
- **No cookie banner, and none needed** — the site sets no cookies and uses no
  storage. This changes the moment analytics or a Meta/TikTok pixel is added.
- **Event data lives in two places** — `content.js` and the JSON-LD block at the
  bottom of `pop-ups.html`, because crawlers won't reliably read the JS version.
  This duplication is the argument for moving to a CMS.

## Emails

- `bookings@dineatlumi.co.uk` — seats, changes, cancellations, diets, access
- `hello@dineatlumi.co.uk` — private nights, press, suppliers, data requests

## Deploying

Drag the folder to Netlify Drop or Cloudflare Pages, point the domain at it,
submit `sitemap.xml` in Google Search Console. Ask the host to serve clean URLs
(`/dishes` rather than `/dishes.html`) if possible.

## Checking work

There are no tests. After any change, load the affected page and check:
mobile menu opens **after scrolling** (see gotcha 1), the mailing list band is
visible above the footer on every page (gotcha 2), and the booking modal opens
and closes on the pop-ups page while scrolled down.
