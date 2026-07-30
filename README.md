# Lumi — dineatlumi.co.uk

Nine pages, no build step, no framework. Open any `.html` file in a browser and it works.

## The files

| File | What it is |
|---|---|
| `index.html` | Homepage |
| `about.html` | About Lumi |
| `pop-ups.html` | Upcoming nights + booking |
| `dishes.html` | The five dishes |
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
marks and save. That covers pop-up nights, dishes, pantry products and the
image captions. Keep the commas and the curly brackets where they are.

Saving the file changes it on your computer, not on the live site — send the
edited `content.js` to Chris and he'll put it up.

**One catch:** when you add or remove a pop-up night, also update the matching
block at the bottom of `pop-ups.html`. That copy is what Google reads to show
your dates in search results, and it can't read the JavaScript version
reliably. If that becomes annoying, it's the point at which a small CMS starts
paying for itself.

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
   You want a short JSON error object. If you get the PHP source as text, or a
   download prompt, PHP isn't switched on for this package — fix that in the
   Fasthosts control panel. Don't try to force it with an `AddHandler` line in
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

Clean addresses — `dineatlumi.co.uk/dishes` rather than `/dishes.html` — are
written but commented out at the top of that file. They're not a toggle here:
switching them on also means updating every internal link, the canonical tags,
and the current-page logic in `site.js`. The comment in the file explains it.

## What isn't real yet

The forms all work now. What's still placeholder is the **menu copy, the event
listings and every photograph** — each image slot describes the shot that
belongs in it.

**The site takes no money.** That's a decision, not an unfinished bit. Someone
asking for seats sends you a request; you confirm it and sort payment yourself.
See below.

## Bookings — what actually happens

Someone fills in the form on the pop-ups page and it emails you at
**bookings@dineatlumi.co.uk**. That's it. No money changes hands, no seat is
held, and **they don't get an automatic email** — the screen tells them you'll
reply, and your reply *is* the confirmation.

The email has the night, the number of seats, their name and address, and any
allergies. **Press reply and it goes straight to them**, so you never have to
copy an address out.

Three things worth knowing:

1. **It isn't a booking until you answer.** Until then it's a request sitting in
   your inbox. If you don't reply, nobody has a seat and nobody has been charged.
2. **Update the seat count yourself.** `left` in `assets/content.js` only changes
   when you edit it. Confirm two seats, drop `left` by two, and send the file to
   Chris — otherwise the site keeps advertising seats you've already given away.
3. **Requests can arrive for a night that's just filled**, because of the above.
   The booking terms page says so, and you just offer them the next one.

The contact form works the same way, and sorts itself by the "What's it about"
dropdown: anything about an existing booking comes to bookings@, everything else
to hello@.

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
  sensible defaults I drafted. Confirm each one, and make sure they match how you
  actually take the money. The fourteen-day rule as written assumes you've been
  paid in full up front; if you take a deposit, or settle on the night, that
  paragraph needs saying so.
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

The wordmark is currently set in Yellowtail and the byline in Caveat, standing
in for your real logo. When you have it as an SVG, drop it into the marked slot
in the hero of `index.html` and remove those two fonts from the `<link>` tag in
each page's `<head>`. Everything else keeps working.
