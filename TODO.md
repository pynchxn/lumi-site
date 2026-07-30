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

More pressing now the booking form actually delivers: a past night still shows a
working button, so Josh gets emailed a request for a date that's already been.

### - [ ] JSON-LD contradicts `content.js` on the September night
[pop-ups.html:35](pop-ups.html#L35) says `"The Glasshouse"`, `"Bristol"`;
[content.js:42-43](assets/content.js#L42-L43) says `Hiraeth`, `Cardiff`. Google
is being told a different venue and city from the one on the page — and the
booking email carries the `content.js` values, so they'd disagree with whatever
brought someone to the site. Pick the right one and make both match.

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

### - [x] ~~Stripe~~ — dropped, deliberately
No payment on the site. The booking form emails Josh a request; he confirms and
takes payment himself. The booking button is fine to advertise now — it asks for
seats rather than claiming to hold them.

### - [x] Booking + contact form delivery — done
`send.php` in the web root handles both. From `bookings@`, reply-to the visitor.
Contact routes on the subject dropdown. **The guest gets no automatic email** —
Josh's reply is the confirmation, and the screen says so.

### - [ ] Before this goes live, three things only the live host can answer
1. **Is PHP enabled on the package?** Visit `/send.php` after uploading. JSON
   error object = working. Source code or a download = PHP is off, fix it in the
   Fasthosts control panel.
2. **Check the domain's SPF record** includes whatever Fasthosts sends mail
   through. `send.php` sets the envelope sender to `bookings@` so SPF is checked
   against `dineatlumi.co.uk` — right record and it helps, missing record and it
   can hurt. Can't be determined from the code; needs a DNS lookup.
3. **Send one real test and open its full headers.** `Return-Path:` should be
   `bookings@` — if it's a server system user, the host is overriding the
   envelope sender and there's nothing to be done in PHP about it. Then press
   reply and confirm it addresses the visitor. Check it's not in Junk: if it is,
   it's SPF, or the fact that `From:` and `To:` are both `bookings@`, which some
   providers treat as spoofing. The fix for the latter is a separate real mailbox
   on the domain (`site@`) as the sender — don't invent one before it's needed.

### - [ ] If spam starts arriving
There's a honeypot and length caps, and deliberately no rate limiting — that
needs writable state for a site running a few nights a year. If it's actually
needed, the escalation is Cloudflare Turnstile or a signed-timestamp field.

### - [ ] No focus trap in the booking modal
Tab escapes the dialog into the page behind it. Pre-existing, unrelated to the
form work, still worth fixing.

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
defaults. Josh confirms each one, and they must match how he actually takes
payment — by arrangement after confirming a seat, not through the site. The
fourteen-day paragraph assumes payment in full up front; a deposit or paying on
the night needs different wording.

### - [ ] `privacy.html` finished properly
Plain-English outline, not a finished notice. Mailchimp is named; there's no
payment provider to add now, but analytics still needs it, and every category
needs a lawful basis and a retention period. "As long as required for accounts"
isn't one.

---

## 4. Before launch

- [ ] Upload `send.php` and confirm PHP is enabled — see section 2
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

Touching `send.php` or the form handlers? There's no mail server locally, so run
it with a stub that keeps the message instead of sending it:

```sh
printf '#!/bin/sh\ncat >> /tmp/mail.out\n' > /tmp/fakemail.sh && chmod +x /tmp/fakemail.sh
php -d sendmail_path=/tmp/fakemail.sh -S localhost:8000
```

`mail()` then succeeds and `/tmp/mail.out` has the whole thing, headers and body.
It has to be a script, not a bare `cat >> file` — PHP appends the `-f` envelope
flag to that command and `cat` rejects it. Check both paths: success replaces the
modal, failure leaves the form and everything typed in it alone.
