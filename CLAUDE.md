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
send.php               booking + contact form delivery — the only server-side file
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

- **Payment. Deliberately none, not a gap.** Stripe was the plan and was dropped.
  The booking form sends Josh a *request*; he confirms by email and arranges
  payment himself, off the site. Don't reintroduce a checkout, and don't let the
  copy drift back into implying a seat is held or paid for on submit — that
  wording was the whole reason for the change.
- **Mailing list.** Done. Connected to Mailchimp and submitting over JSONP
  (`/subscribe/post-json`) so the visitor never leaves the page — their endpoint
  sends no CORS headers, so `fetch` can't read the reply and JSONP is the only
  option from a static site. Config is `MAILCHIMP` in `content.js`; the action
  URL must use plain `&`, not the `&amp;` Mailchimp's embed code hands you, or
  the list id never arrives and every signup fails silently.
  **Single opt-in, deliberately** — contacts land as Subscribed immediately and
  no confirmation email is sent. The success message says so. `privacy.html`
  still claims people confirm by email first and needs correcting to match.
- **Copy and imagery.** Menu, event listings and all photographs are placeholders.
  Every image slot describes the shot that belongs there.

## Forms — `send.php`

Both the booking modal and the contact form post to `send.php` in the web root.
It's the only server-side file on the site; everything else is static.

- Same origin, so `postForm` in `site.js` uses a plain `fetch` with
  `x-www-form-urlencoded` and reads a JSON `{ok, msg}` reply. **This is why the
  mailing list still uses JSONP and these don't** — Mailchimp is cross-origin and
  sends no CORS headers. Not an inconsistency; don't "unify" them.
- `From:` is fixed to `bookings@dineatlumi.co.uk`. `Reply-To:` is the visitor, so
  Josh hits reply and reaches them. **The guest gets no automatic email** — mail
  from a shared host out to arbitrary domains is what lands in spam, and there's
  nothing to confirm anyway until Josh answers.
- **The recipient is chosen server-side and must never come from the request** —
  that's the difference between a contact form and an open relay. Contact routing
  matches the word "booking" in the subject → bookings@, everything else →
  hello@. Substring, not exact match, so rewording the dropdown option in
  `contact.html` doesn't silently misroute.
- **Header injection:** everything reaching a header goes through `header_safe`
  (strips CR/LF/NUL) and display names go through `quoted_name`. Headers are
  passed to `mail()` as an array so PHP validates them too.
- **`ini_set('display_errors','0')` is the first executable line and must stay
  there.** One PHP notice printed ahead of the JSON makes `r.json()` reject in the
  browser, and every submission then looks like a network failure.
- **No secrets in this file, ever.** If PHP is misconfigured the server hands out
  the source as plain text. The only sensitive strings are two addresses already
  on every page. Don't put SMTP credentials in here — if it ever needs
  authenticated sending, that's a different design.
- **No IP address or user agent is logged.** `privacy.html` says so. Adding them
  creates a personal-data category that needs a lawful basis and retention period.
- `mail()`'s 5th argument sets the envelope sender, so SPF is checked against
  `dineatlumi.co.uk` rather than the Fasthosts box. Some hosts refuse it, hence
  the retry without. If mail lands in Junk, that's SPF or the fact that
  `From:` and `To:` are both `bookings@` — see TODO.md.
- Spam protection is a honeypot (`company`, hidden by `.hp`) plus length caps.
  A filled honeypot gets `{"ok":true}` and sends nothing, so bots can't tell.
  No rate limiting, deliberately — it needs writable state for a site running a
  few nights a year.

## Needs a human, not a model

- `booking-terms.html` — cancellation window and refund rules are drafted defaults.
  Josh must confirm them, and they must match how he actually takes payment —
  which is now by arrangement after he confirms a seat, not through the site. The
  fourteen-day paragraph assumes payment in full up front; a deposit or paying on
  the night needs different wording.
- `privacy.html` — plain-English outline, not a finished notice. Mailchimp is
  named; analytics still needs adding, and every category needs a lawful basis and
  a retention period. Don't generate final legal wording.

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

Fasthosts shared Linux, uploaded over FTP. Chris deploys; Josh never touches the
server. No build step, no sync — the live file is whatever was last uploaded.

**`send.php` must go up with everything else, into the same folder as
`index.html`, and PHP has to be enabled on the hosting package.** Check it after
uploading by visiting `/send.php` directly — a JSON error object means it's
working; PHP source or a download prompt means PHP is off. That's a control-panel
setting; don't try to fix it with an `AddHandler` line in `.htaccess`, because a
wrong one 500s every request on the site.

`.htaccess` in the root carries everything Netlify would have done for free:
`ErrorDocument` to `404.html`, forced HTTPS (SSL is live — if the cert ever
lapses, comment that block out first or the whole site reads as down), one hour
of cache on CSS/JS and a month on images, gzip on text, `Options -Indexes`, and
a refusal to serve `.md` files and dotfiles.

**Cache times are short on purpose.** Filenames carry no hash, so there's no way
to bust a cache except waiting it out, and Josh edits `content.js` — a long TTL
means a new pop-up date invisible for days.

**Clean URLs are deliberately off.** The rewrite rules are written but commented
in `.htaccess`. Enabling them is a three-part change, not a toggle: every
internal link across the nine pages, the canonical tags, and `centreInk`'s
neighbour at `site.js:32` — which derives the current page from
`location.pathname` and compares it to the nav `href`s, so `/dishes` vs
`dishes.html` silently kills the current-page underline.

Don't upload: `TODO.md`, `CLAUDE.md`, `README.md`, `.gitignore`, `.DS_Store`
(root and `assets/`), or the unreferenced WhatsApp images. Submit `sitemap.xml`
in Search Console once it's live.

## Checking work

There are no tests. After any change, load the affected page and check:
mobile menu opens **after scrolling** (see gotcha 1), the mailing list band is
visible above the footer on every page (gotcha 2), and the booking modal opens
and closes on the pop-ups page while scrolled down.

If `send.php` or the form handlers changed, also submit a booking request and
confirm the email arrives. Locally there's no mail server, so run the site with
PHP's built-in one and point `sendmail_path` at a stub that keeps the message:

```sh
printf '#!/bin/sh\ncat >> /tmp/mail.out\n' > /tmp/fakemail.sh && chmod +x /tmp/fakemail.sh
php -d sendmail_path=/tmp/fakemail.sh -S localhost:8000
```

`mail()` then returns true and `/tmp/mail.out` holds the whole message. A bare
`cat >> file` won't do — PHP appends the `-f` envelope flag to that command and
`cat` chokes on it, which is why it needs to be a script that ignores arguments.
Worth checking on the way past: the failure path leaves the form and everything
typed into it intact, and only the success path replaces the modal.
