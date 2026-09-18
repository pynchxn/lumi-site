# Lumi — dineatlumi.co.uk

Nine pages, no build step, no framework. Open any `.html` file in a browser and it works.

## The files

| File | What it is |
|---|---|
| `index.html` | Homepage |
| `about.html` | About Lumi |
| `pop-ups.html` | Upcoming nights + booking |
| `menus.html` | The five dishes |
| `pantry.html` | The shop, not open yet |
| `contact.html` | Contact form and socials |
| `booking-terms.html` | Diets, cancellations, access |
| `privacy.html` | Privacy notice |
| `404.html` | Shown when a link is wrong |
| `assets/content.js` | **The only file you need to edit** |
| `assets/styles.css` | All the design |
| `assets/site.js` | How it behaves |
| `assets/images/` | Your photographs go here |

## Editing it yourself

Open `assets/content.js` in any text editor. Change the words between the quote
marks and save. That covers dishes, pantry products, image captions, and one
small line about pop-ups — the "Next · 12 Sep · Cardiff" teaser on the
homepage. Keep the commas and the curly brackets where they are.

Saving the file changes it on your computer, not on the live site — send the
edited `content.js` to Chris and he'll put it up.

**Adding or removing a pop-up night doesn't happen in this file any more** —
see "Bookings — what actually happens" below. It happens in Ticket Tailor, and
separately, the JSON-LD block at the bottom of `pop-ups.html` needs updating
to match, since that's what Google reads to show your dates in search results
and it can't read the Ticket Tailor widget reliably either. If that becomes
annoying, it's the point at which a small CMS starts paying for itself.

## Putting it online

Hosting is Fasthosts, and uploads go over FTP. Chris handles this — Josh doesn't
need to read past this line.

Connect with the Fasthosts account credentials and upload the site into the web
root (`htdocs` on their Linux hosting — worth confirming in the control panel;
don't drop it a level above, or nothing is served).

Five things that will catch you out:

0. **`send.php` needs PHP enabled on the package.** It's the one server-side file
   on the site and it's what makes both forms deliver. Upload it into the same
   folder as `index.html`, then visit `dineatlumi.co.uk/send.php` in a browser.
   It reports its own health — you want JSON ending
   `"check":{"php":"8.1","mbstring":true,"mail":true}` or similar. `"mail":false`
   means the host has switched off mail sending. If you get the PHP source as
   text, or a download prompt, PHP isn't switched on for this package — fix that
   in the Fasthosts control panel. Don't try to force it with an `AddHandler` line in
   `.htaccess`; the wrong one takes the whole site down with a 500.
1. **`.htaccess` is a hidden file.** FileZilla and most FTP clients don't show
   dotfiles until you ask them to — in FileZilla it's *Server → Force showing
   hidden files*. If it doesn't upload, none of the config below applies and the
   symptoms are confusing: no HTTPS redirect, the host's own error page instead
   of `404.html`.
2. **Transfer mode must be binary or auto, never ASCII.** ASCII mode silently
   corrupts JPEGs and you won't find out until they're live.
3. **Don't upload the working files.** `TODO.md`, `CLAUDE.md`, `README.md`,
   `.gitignore`, both `.DS_Store` files (one in the root, one in `assets/`), and
   the unreferenced WhatsApp photographs in `assets/images/`. The `.htaccess`
   refuses to serve the `.md` files as a backstop, but they shouldn't be up there
   in the first place.
4. **Re-upload `content.js` after every content change.** There's no build step
   and no sync — the live file is whatever was last put there.

Once it's live, submit `sitemap.xml` in Google Search Console. That's what gets
the pages listed.

### What `.htaccess` is doing

Fasthosts doesn't do any of this by default, so it's all declared in that one
file: routing wrong addresses to `404.html`, forcing HTTPS, an hour of caching on
the CSS and JS (short deliberately — filenames never change, so a long cache
would mean Josh's edits not showing for days), a month on photographs,
compression on text files, no directory listings, and a refusal to serve the
working notes.

Clean addresses — `dineatlumi.co.uk/menus` rather than `/menus.html` — are
written but commented out at the top of that file. They're not a toggle here:
switching them on also means updating every internal link, the canonical tags,
and the current-page logic in `site.js`. The comment in the file explains it.

## What isn't real yet

The forms all work now. What's still placeholder is the **menu copy, the event
listings and every photograph** — each image slot describes the shot that
belongs in it.

## Bookings — what actually happens

**Tickets are sold through Ticket Tailor**, embedded right on the pop-ups page
as a single box — it lists and lets guests search or filter your events
itself, and handles the whole checkout. Someone picks their seats and pays
there and then; Ticket Tailor takes the money and emails their confirmation
automatically. Nothing goes through this site or `send.php` for a ticket sale.

The widget is pasted into `pop-ups.html` as a fixed block — from **Promote >
Website embed code** in your Ticket Tailor dashboard — not built from
`content.js`, so there's nothing in `content.js` you need to touch to add,
change or remove a night any more. **Managing what's on sale now happens
entirely inside Ticket Tailor**: create the event there, set its price, write
its description, and it appears in the widget automatically.

Four things worth knowing:

1. **`content.js`'s event list still exists, but only for one small thing** —
   the "Next · 12 Sep · Cardiff · 5 seats left" line in the homepage hero.
   `date`, `city` and `left` there feed that line; the other fields aren't
   shown anywhere on the site any more. Keep it roughly matched to what's
   actually next in Ticket Tailor, or that line will point at the wrong night.
2. **You don't see or handle a single booking through this website.** No
   email arrives at bookings@dineatlumi.co.uk for a ticket sale any more —
   Ticket Tailor emails the guest directly, and their dashboard is where you
   see who's coming. bookings@ is still worth checking: guests use it for
   allergy questions, changes and anything the contact form routes there.
3. **Cancellation and refund rules live in two places now.** What
   `booking-terms.html` says needs to match what you've set in Ticket Tailor's
   own per-event refund settings — if they disagree, a guest gets told two
   different things.
4. **If you ever want the widget to look or behave differently** — a
   different design, hiding the Ticket Tailor logo, showing fewer events —
   that's changed from inside Ticket Tailor's own "Website embed code" screen,
   which then gives you a new block to paste in. Send the new one to Chris
   rather than editing the pasted code by hand; Ticket Tailor is explicit that
   changing it can stop it working.

The contact form still works exactly as before, unchanged by any of this. It
sorts itself by the "What's it about" dropdown: anything about an existing
booking comes to bookings@, everything else to hello@.

## The mailing list

The signup sits above the footer on every page, and it's connected — the
Mailchimp details live in `MAILCHIMP` at the top of `assets/content.js`.

If you ever need to repoint it at a different audience, take the two values
from **Audience > Signup forms > Embedded forms**: the long address in
`form action="..."` (it contains `list-manage.com`) and the name of the input
that starts `b_`. Paste both into `MAILCHIMP`.

**One trap when you do.** Mailchimp writes the joins in that address as
`&amp;`. Change every one to a plain `&` before saving. Left alone, Mailchimp
never receives the list id and every signup fails — with nothing on the page
to tell you, because the site still says it worked.

Signing up doesn't leave the site: the form submits in the background and the
line under the button changes to confirm it. Nobody gets dropped onto a
Mailchimp-branded page mid-signup.

**The list is single opt-in.** People are added the moment they submit, and no
confirmation email goes out — that's the deliberate choice, and the message
after signup says so plainly.

If you ever switch to double opt-in (**Audience > ⋯ > Audience settings > Form
settings > Email opt-in settings**), two things need doing at the same time:
the success message in `assets/site.js` has to go back to telling people to
check their inbox, and `privacy.html` needs to match. Mailchimp also tends to
switch reCAPTCHA on alongside it, which can break the background signup — so
test the form straight after changing it.

One more thing worth knowing: booking a seat does *not* add anyone to the
list — under UK rules they have to ask separately. That's deliberate, so don't
"helpfully" merge the two later.

## Email addresses

Two are used across the site:

- **bookings@dineatlumi.co.uk** — seats, changes, cancellations, dietary
  requirements, access questions. Used on the contact page, throughout the
  booking terms, and named in the booking confirmation.
- **hello@dineatlumi.co.uk** — private nights, press, suppliers, data requests.

Both appear in the footer, and both are in the structured data so Google can
tell them apart.

Both are wired up. Booking requests go to bookings@. The contact form sorts
itself by the "What's it about" dropdown — anything mentioning a booking goes to
bookings@, everything else to hello@.

Every email the site sends is **from** bookings@, with reply-to set to whoever
filled the form in. That From address matters: the confirmation screen tells
people to expect a reply from it, and a sender that doesn't match the domain
lands in spam.

## Two things only you can finish

- **`booking-terms.html`** — the cancellation window and refund rules are
  sensible defaults I drafted. Confirm each one, and set Ticket Tailor's own
  per-event refund settings to match — payment is now taken in full up front
  at their checkout, so the fourteen-day rule as written fits how the money
  actually moves, but Ticket Tailor's settings are what a guest sees mid-refund,
  not this page.
- **`privacy.html`** — a plain-English outline, not a finished notice. It needs
  completing to UK GDPR standards, in particular how long you keep a booking
  email. Worth a solicitor or a reputable template.

## Photographs

See `assets/images/README.txt`. The single highest-value file is
`og-lumi.jpg` — it's the picture that shows up when anyone shares the site.

The hero images want a calmer frame with some darker area behind the centre —
a dim room, a dark table, deep shadow. Pale busy photographs will fight the
wordmark.

## The logo

The wordmark is currently set in Alex Brush and the byline in Caveat, standing
in for your real logo. When you have it as an SVG, drop it into the marked slot
in the hero of `index.html` and remove those two fonts from the `<link>` tag in
each page's `<head>`. Everything else keeps working.
