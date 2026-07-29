# Lumi — build checklist

Working list for Chris. Tick as you go. Not part of the site — delete before
handing the folder over.

---

## 1. Found in review (29 Jul) — unblocked, do these first

### - [ ] Wire the strip photographs in
Eight files (`assets/images/strip-1.jpg` … `strip-8.jpg`) are cropped and sized
and match the eight `STRIP` captions one-for-one, but [site.js:39-42](assets/site.js#L39-L42)
still renders `.ph` placeholder blocks.

- Change `STRIP` in [content.js:119-128](assets/content.js#L119-L128) from strings to
  `{ src: 'assets/images/strip-1.jpg', alt: 'Plated dish, overhead, dark linen' }`
  — the existing captions become the alt text.
- Update the render in `site.js` to emit `<img>` with `loading="lazy"` and
  `decoding="async"`.
- The track prints the array twice for the marquee loop; mark the second copy
  `aria-hidden="true"` so screen readers don't hear all eight captions twice.
- Aspect ratios vary (3:4 up to 1:1 — `strip-5.jpg` is square, `strip-3.jpg` is
  tall). Needs `object-fit: cover; width: 100%; height: 100%` inside the `r-4x5`
  box or they'll letterbox.

### - [ ] Make `og-lumi.jpg`
1200×630, saved to `assets/images/og-lumi.jpg`. Every page already points at it
and so do all three Event JSON-LD blocks — right now every share shows nothing.
No code change once the file exists. The strip shots are all portrait, so this
needs a landscape crop from the WhatsApp set, logo bottom-left.

### - [ ] Tidy the images folder
27 raw WhatsApp exports, 9.2 MB total, all of it currently shipping and none of
it referenced. Split them:
- Keep and rename what's going on the site (lowercase, no spaces or brackets),
  resized to 2000px max and run through squoosh.
- The notebook pages are source material for the real menu, not web assets —
  move them out of the deploy folder.

### - [ ] Fix or remove the dead social links
- Footer Instagram and TikTok are `href="#"` on all nine pages.
- Same for the two buttons in [contact.html:78-79](contact.html#L78-L79).
- `sameAs` in the JSON-LD points at bare `instagram.com` / `tiktok.com` on every
  page, which tells Google the brand's profile is Instagram's homepage.

Real URLs or delete them — `#` is worse than absent.

### - [ ] Stop past events showing
[site.js:74](assets/site.js#L74) picks "next" as the first entry with seats left,
not the first one in the future. When 12 Sep passes, the homepage keeps
advertising it until Josh deletes the block by hand from *both* `content.js` and
the JSON-LD. Filter on date instead.

### - [ ] Correct the November timezone
[pop-ups.html:37](pop-ups.html#L37) has `2026-11-21T19:00:00+01:00`. BST ends
25 Oct 2026, so it should be `+00:00` — the time is an hour out in search results.

### - [ ] Fix the IntersectionObserver guard
[site.js:134](assets/site.js#L134) reveals everything if `IntersectionObserver` is
missing, then line 135 constructs one unconditionally — which throws and takes out
the mobile nav, sunburst, booking modal and forms below it. Academic on current
browsers, but the fallback doesn't currently do what it looks like it does.

### - [ ] Update the docs once the photos are in
`CLAUDE.md` and `README.md` both still say all imagery is placeholder.

---

## 2. Already known — still outstanding

### - [ ] Stripe
Booking form collects details, shows a confirmation, takes no money and holds no
seat. Don't advertise the booking button until this is live.

### - [ ] Booking confirmation emails
Must send **from** `bookings@dineatlumi.co.uk` — the confirmation screen promises
that address, and a mismatched sender lands in spam.

### - [ ] Contact form delivery
Route on the subject dropdown: *A booking I've made* → bookings@, everything else
→ hello@.

### - [ ] Mailchimp
Paste the `list-manage.com` action URL and the `b_…` honeypot field name into
`MAILCHIMP` at the top of [content.js:20-23](assets/content.js#L20-L23). Turn
double opt-in on while you're in there.

### - [ ] Real menu copy
The five dishes in `content.js` are placeholders. Josh's notebook photos have the
actual dishes written out — that's the source.

### - [ ] Remaining image slots
Hero (video or still), Josh's portrait on the homepage and about page, the room
shots, product shots, and the five per-dish photographs. Every slot describes the
shot that belongs there.

### - [ ] Swap in the real logo SVG
Drop it into the marked slot in the hero of `index.html` and drop Yellowtail and
Caveat from the `<link>` in each page's `<head>`. This also makes `centreInk` in
`site.js` unnecessary — delete it then.

---

## 3. Needs Josh or a solicitor — not for me to write

### - [ ] `booking-terms.html` signed off
Cancellation window, refund handling and the arrival grace period are drafted
defaults. Josh confirms each one, and they must match what Stripe is configured
to do.

### - [ ] `privacy.html` finished properly
Plain-English outline, not a finished notice. Mailchimp is named; payment
provider and analytics still need adding, each with a lawful basis and retention
period.

---

## 4. Before launch

- [ ] Refresh `lastmod` in `sitemap.xml` (currently all 2026-07-28)
- [ ] Self-host the fonts — removes the Google IP question and speeds up load
- [ ] Submit `sitemap.xml` in Google Search Console
- [ ] Don't upload this file, `CLAUDE.md`, `README.md`, `.gitignore`, either
      `.DS_Store`, or the unreferenced WhatsApp images

### - [ ] Upload `.htaccess` and confirm it took
It's a hidden file — FileZilla won't show it until *Server → Force showing hidden
files* is on, and if it doesn't go up the failure is quiet. Verify after upload:

- `http://dineatlumi.co.uk` redirects to `https://`
- a bogus address renders the Lumi 404, not the Fasthosts error page
- `dineatlumi.co.uk/assets/` returns 403, not a file listing
- DevTools → Network shows `content-encoding: gzip` on `styles.css`

### - [ ] Clean URLs — optional, and a real change
Rules are written but commented at the top of `.htaccess`. Not a toggle on this
host. Turning them on means all three of:

1. Every internal link across the nine HTML files (`dishes.html` → `dishes`),
   or each click takes a 301 hop.
2. [site.js:32](assets/site.js#L32) — derives the current page from
   `location.pathname` and compares it to the nav `href`s. With clean URLs it
   compares `dishes` to `dishes.html`, never matches, and the underline marking
   the current page silently stops appearing.
3. The canonical tag on each page, or Google sees two addresses for every one.

**No cookie banner is needed** — the site sets no cookies and uses no storage.
That changes the moment analytics or a Meta/TikTok pixel goes in.

---

## Checking your work

No tests. After any change, load the affected page and confirm:
- the mobile menu opens **after scrolling** (the `.head` containing-block trap)
- the mailing list band is visible above the footer (the `.rv` observer trap)
- the booking modal opens and closes on `pop-ups.html` while scrolled down
