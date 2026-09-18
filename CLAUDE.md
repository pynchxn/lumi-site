# Lumi — dineatlumi.co.uk

Static marketing site for **Lumi**, a pop-up dining experience by chef Josh Spear.
Nine HTML pages, one stylesheet, two JS files. No framework, no build step, no
package.json. Open any `.html` in a browser and it runs.

## Client

Josh Spear. Not a developer. He edits the site himself, so keep it editable by
hand and keep content out of markup where possible.

## Structure

```
index.html  about.html  pop-ups.html  menus.html  pantry.html
contact.html  booking-terms.html  privacy.html  404.html
send.php               contact form delivery — the only server-side file
assets/styles.css      all design
assets/content.js      events, dishes, products, Mailchimp config  ← Josh edits this
assets/site.js         behaviour, guarded so one file serves all pages
assets/images/         photographs (currently placeholders)
sitemap.xml  robots.txt
```

## Design rules — these came from the client, don't undo them

- **Light palette only.** Cream `#F9F1E0`, deeper cream `#F0E6D4`, clay `#8B5D4A`,
  russet `#64220C`, ink `#2E1C15`, muted `#6F5D4D`. All sampled from the logo.
  The hero and footer were originally dark; the client explicitly asked for both
  to be light. **Do not reintroduce dark sections.** The only saturated element
  left is the russet pantry panel on the homepage, and that's on notice.
- **The sunburst is the signature.** Redrawn from the logo as SVG paths, it draws
  outward from the centre ray on load in the hero. That rule — "a third instance
  dilutes it" — used to mean it only appeared in the hero and the footer. **It's
  now in three places, on purpose, at the client's explicit request**: the live
  animated hero SVG, plus `assets/images/lumi-cropped.png` (the full logo
  lockup — sunburst, script wordmark and byline, flattened into one raster
  image), which appears a second time in the footer and a third time as the nav
  `.brand` logo. Don't "fix" this back down to two without asking first — it
  was a deliberate tradeoff, not an oversight.
- **Wordmark is a script, except where the real logo image already stands in
  for it.** Alex Brush is the font stand-in, Caveat for the "By Josh Spear"
  byline. Fraunces for headings, Jost for body. The script does branding
  only — never section headings. `--script` in `styles.css` now feeds only the
  hero `.mark`/`.byline` — the nav `.brand` and the footer lockup both use
  `assets/images/lumi-cropped.png` directly (an `<img>`, sized with
  `.brand img`/`.foot__mark`) instead of rendering the font. The hero is the
  one spot still waiting on the real logo SVG; when that lands, `.mark`,
  `.byline` and `centreInk` in `site.js` all go, and the hero can use the same
  image the nav and footer already do.
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

## Ticket sales — Ticket Tailor

Stripe was the original plan and was dropped; a request-only booking form (no
payment, Josh confirms by email and arranges payment himself) replaced it, and
that in turn has now been replaced by Ticket Tailor. Pop-up tickets are sold
and paid for at the point of booking, on Ticket Tailor's checkout — **this is
a deliberate reversal of the old "no payment on this site" decision, not a
gap to close**. Don't reintroduce the request-only flow, and don't let copy
drift back into saying nothing is charged at the point of booking.

- **The widget is one static block, pasted whole into `pop-ups.html`, not
  built by JS.** It's Josh's account-level "Box Office" widget (Ticket Tailor
  dashboard: **Promote > Website embed code**) — it lists and lets guests
  search/filter *all* his events itself, with its own checkout. Ticket
  Tailor's own comment on the snippet says "Do not change the code or the
  widget may not work properly," so it's pasted verbatim, `&` left
  un-escaped and all — resist the urge to run it through Prettier or unify
  it with the site's own markup style.
- **This replaced a per-event design that turned out to be wrong — worth
  knowing so it isn't reinvented.** The first attempt gave each event in
  `content.js` its own `ticketUrl` and reconstructed a per-event embed via
  `data-event-page-widget="true"`, reverse-engineered from Ticket Tailor's
  `widget.js` source (their help-centre docs sit behind bot protection that
  blocks fetches). Real embed code pasted from Josh's dashboard proved that
  guess wrong on two counts: `data-event-page-widget` only renames the
  iframe internally, it doesn't scope to one event, and the URL that
  actually matters is a full **checkout** URL
  (`tickettailor.com/checkout/new-session/id/…`), not a plain event page
  address — with no confirmed way to generate a single-event version of it.
  So `ticketUrl`, `eventCard()` and `mountTicketWidgets()` are gone again;
  don't re-add them without a real single-event snippet in hand to build
  against, the same way this one was verified.
- **The Ticket Tailor API was considered and rejected for this.** It's a
  single secret key over Basic Auth with no publishable/public variant, so
  it can never live in client-side JS — using it would mean storing that
  secret server-side and building a proxy endpoint, which is a real
  architecture change for a site whose one server-side file, `send.php`, is
  explicitly documented as carrying no secrets, ever. Revisit only if the
  content.js/Ticket-Tailor data duplication below becomes a real problem,
  as its own deliberate decision, not a drive-by upgrade.
- `EVENTS` in `content.js` no longer drives anything sold — it only feeds
  the small "Next · 12 Sep · Cardiff · 5 seats left" line in the homepage
  hero (`date`, `city`, `left`). `title`, `venue`, `price`, `seats` and
  `blurb` aren't rendered anywhere any more; the real listing, pricing and
  descriptions live in Ticket Tailor now, a **third** place event data
  exists alongside `content.js` and the pop-ups.html JSON-LD (see "Event
  data lives in two places" below, now stale by one).
- The old booking modal (`#modal`, `openModal`/`closeModal`, the `data-book`
  buttons, `#all-events`/`#home-events`/`eventCard()`) is gone from
  `site.js`, `index.html` and `pop-ups.html`, and `send.php` no longer
  accepts `form=booking` — only `form=contact`. Don't re-add a
  `to = BOOKINGS` branch there for ticket sales; Ticket Tailor owns that
  now. `bookings@` still exists for allergy questions, changes and anything
  the contact form routes there.
- `booking-terms.html` and `privacy.html` both describe Ticket Tailor's role
  now. `booking-terms.html`'s cancellation wording assumes payment in full up
  front — true again now — but only if Ticket Tailor's own per-event refund
  settings are set to match; that's what a guest actually sees mid-refund.

## Not real yet

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

The contact form posts to `send.php` in the web root. It's the only
server-side file on the site; everything else is static. It used to also
handle the booking modal's request emails — that branch (`form=booking`) is
gone now that Ticket Tailor sells tickets directly; `send.php` only accepts
`form=contact`.

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
  (strips CR/LF/NUL) and the `Reply-To` display name goes through `reply_to`,
  which quotes plain ASCII and RFC 2047-encodes anything else. Headers are
  joined into one CRLF string, **not** passed to `mail()` as an array — the
  array form makes PHP re-check them for newlines, but it needs PHP 7.2 and
  this file is written to 5.4 (see below). Don't "upgrade" it: the protection
  is `header_safe` plus `FILTER_VALIDATE_EMAIL`, and neither depends on the
  array form.
- **Every value read from `$_POST` must be cast before use.** `header_safe` and
  `body_safe` both do `(string) $v` first; anything that skips them has to guard
  itself. `company[]=x` makes an unguarded `trim()` a fatal on PHP 8 and a
  silent discard on PHP 7 — the honeypot check carries an `is_string()` for
  exactly that reason.
- **`ini_set('display_errors','0')` is the first executable line and must stay
  there.** One PHP notice printed ahead of the JSON makes `r.json()` reject in the
  browser, and every submission then looks like a network failure.
- **Assume no optional extensions.** This shipped broken once because `mb_substr`
  was called unguarded: mbstring is optional, absent on some hosts, and a call to
  a missing function is a fatal — which, with `display_errors` off, is a blank
  response the browser can't parse and a visitor sees as "couldn't send". Every
  `mb_*` call is now behind `function_exists`, and truncation uses `clip()`, which
  needs only PCRE. Don't add a call to anything outside core PHP without a guard
  and a fallback.
- **Written to PHP 5.4** — no `??`, no array-form `mail()` headers, no arrow
  functions. Not because the host is known to be old, but because nobody here can
  test what it actually runs, and every incompatibility fails as the same blank
  response. Keep new code to that floor.
- **A GET returns a health check** — `{"ok":false,"msg":…,"check":{php,mbstring,
  mail}}`. This is how you tell "extension missing" from "PHP off" from "wrong
  version", all of which otherwise look identical from the browser. Visiting
  `/send.php` is the first diagnostic step, not the last.
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
- **Event data lives in three places now** — `content.js` (just the date/city/
  left that feed the homepage teaser), the JSON-LD block at the bottom of
  `pop-ups.html` (because crawlers won't reliably read the JS version), and
  Ticket Tailor itself, which now owns the real listing, pricing and
  descriptions. This duplication is the argument for moving to a CMS, or —
  now there's an API in the mix — for eventually reading event data from
  Ticket Tailor server-side instead of hand-keeping it (see the API note
  above on why that's a bigger change than it sounds).

## Emails

- `bookings@dineatlumi.co.uk` — seats, changes, cancellations, diets, access
- `hello@dineatlumi.co.uk` — private nights, press, suppliers, data requests

## Deploying

Fasthosts shared Linux, uploaded over FTP. Chris deploys; Josh never touches the
server. No build step, no sync — the live file is whatever was last uploaded.

**`send.php` must go up with everything else, into the same folder as
`index.html`, and PHP has to be enabled on the hosting package.** Check it after
uploading by visiting `/send.php` directly. It answers with a health check:

```json
{"ok":false,"msg":"…","check":{"php":"8.1","mbstring":true,"mail":true}}
```

`"mail":false` means the host has disabled `mail()`. A `php` below `5.4` is too
old for this file. PHP source or a download prompt means PHP isn't enabled at all
— that's a control-panel setting; don't try to fix it with an `AddHandler` line
in `.htaccess`, because a wrong one 500s every request on the site. If the check
looks healthy but no mail arrives, the problem has moved to delivery — SPF, or
`From:`==`To:` — and `error_log` will have a line for the failed `mail()`.

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
`location.pathname` and compares it to the nav `href`s, so `/menus` vs
`menus.html` silently kills the current-page underline.

Don't upload: `TODO.md`, `CLAUDE.md`, `README.md`, `.gitignore`, `.DS_Store`
(root and `assets/`), or the unreferenced WhatsApp images. Submit `sitemap.xml`
in Search Console once it's live.

## Checking work

There are no tests. After any change, load the affected page and check:
mobile menu opens **after scrolling** (see gotcha 1), the mailing list band is
visible above the footer on every page (gotcha 2), and the Ticket Tailor
widget on the pop-ups page loads and opens a checkout.

If `send.php` or the contact form changed, also submit it and confirm the
email arrives. Locally there's no mail server, so run the site with
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
