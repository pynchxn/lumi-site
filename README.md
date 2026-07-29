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

**One catch:** when you add or remove a pop-up night, also update the matching
block at the bottom of `pop-ups.html`. That copy is what Google reads to show
your dates in search results, and it can't read the JavaScript version
reliably. If that becomes annoying, it's the point at which a small CMS starts
paying for itself.

## Putting it online

Drag this whole folder onto [netlify.com/drop](https://app.netlify.com/drop) or
into Cloudflare Pages. Both are free at this size. Then point `dineatlumi.co.uk`
at it — each one walks you through the DNS.

Once it's live, submit `sitemap.xml` in Google Search Console. That's what gets
the pages listed.

If you'd rather the addresses read `dineatlumi.co.uk/dishes` than
`/dishes.html`, both hosts can do that with one setting — worth asking for.

## What isn't real yet

Three things are deliberately placeholders:

1. **Payment.** The booking form collects details and shows a confirmation, but
   takes no money and holds no seat. Needs Stripe.
2. **Emails.** No confirmation actually sends. Needs an email service wired to
   the booking.
3. **Contact form.** Doesn't deliver anywhere yet.

The mailing list is the exception — it's ready, it just needs your Mailchimp
details (below).

Until those are connected, don't advertise the booking button.

## Connecting the mailing list

The signup sits above the footer on every page. To switch it on:

1. In Mailchimp: **Audience > Signup forms > Embedded forms**.
2. In the code it shows you, find two things:
   - the long address in `form action="..."` — it contains `list-manage.com`
   - an input named `b_` followed by a long string
3. Open `assets/content.js` and paste them into `MAILCHIMP` at the top.

That's it — one file, and it works on all nine pages.

While you're in Mailchimp, turn **double opt-in on**. It means people confirm
by email before they're added. It's the safer footing under UK marketing rules,
and it keeps your list clean, which keeps you out of spam folders.

Two things worth knowing: submitting opens Mailchimp's confirmation page in a
new tab, which is normal for this kind of form. And booking a seat does *not*
add anyone to the list — under UK rules they have to ask separately. That's
deliberate, so don't "helpfully" merge the two later.

## Email addresses

Two are used across the site:

- **bookings@dineatlumi.co.uk** — seats, changes, cancellations, dietary
  requirements, access questions. Used on the contact page, throughout the
  booking terms, and named in the booking confirmation.
- **hello@dineatlumi.co.uk** — private nights, press, suppliers, data requests.

Both appear in the footer, and both are in the structured data so Google can
tell them apart.

When the contact form gets connected, route it by the "What's it about"
dropdown: *A booking I've made* goes to bookings@, everything else to hello@.
And make sure booking confirmations actually send **from** bookings@ — the
confirmation screen tells guests to expect that address, and mismatched
senders land in spam.

## Two things only you can finish

- **`booking-terms.html`** — the cancellation window and refund rules are
  sensible defaults I drafted. Confirm each one, and make sure they match
  whatever Stripe is set up to do.
- **`privacy.html`** — a plain-English outline, not a finished notice. Once
  the payment and email tools are chosen it needs completing to UK GDPR
  standards. Worth a solicitor or a reputable template.

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
