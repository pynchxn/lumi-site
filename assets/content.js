/* ============================================================
   LUMI — CONTENT
   This is the only file you need to edit day to day.
   Change the text between the quote marks. Keep the commas.
   ============================================================ */

/* ---- Mailing list (Mailchimp) ------------------------------
   In Mailchimp go to: Audience > Signup forms > Embedded forms.
   In the code it shows you, find these two things:

     1. form action="https://....list-manage.com/subscribe/post?u=...&id=..."
        Copy the whole address inside the quotes into `action` below.

        IMPORTANT: Mailchimp writes the joins between the parts as
        "&amp;". Change every "&amp;" to a plain "&" after pasting.
        Left as-is, Mailchimp never sees the list id and every
        signup fails — with no error on the page to tell you.

     2. an input named  b_something_something
        Copy that name into `honeypot` below. It's a spam trap.

   Until `action` is filled in, the form politely says it isn't
   connected yet instead of pretending to work.
------------------------------------------------------------- */
const MAILCHIMP = {
  action: 'https://dineatlumi.us7.list-manage.com/subscribe/post?u=ee05de7d5272a1ee6e94cc746&id=ed676e7556&f_id=003545e4f0',
  honeypot: 'b_ee05de7d5272a1ee6e94cc746_ed676e7556'
};

/* ---- Upcoming pop-ups -------------------------------------
   Tickets are sold on Ticket Tailor now — see the widget pasted into
   pop-ups.html — so this list is no longer what puts a "Book this night"
   card on the page. Only date, city and left still do anything: they
   feed the small "Next · 12 Sep · Cardiff · 5 seats left" line in the
   homepage hero. title, venue, price, seats and blurb aren't rendered
   anywhere any more — keep them updated here if you still want one place
   that lists what's on, but the real listing, pricing and descriptions
   now live in Ticket Tailor, and the JSON-LD block at the bottom of
   pop-ups.html is what Google reads.

   date : year-month-day, always in that order
   left : how many are still available (set to 0 to stop the homepage
          teaser picking this night as "next"). Kept by hand, so it can
          drift from Ticket Tailor's own count — that's fine, it's only
          a teaser, not what stops a night being oversold.
   Delete a whole { ... } block to remove a night.
------------------------------------------------------------- */
const EVENTS = [
  {
    date: '2026-09-12',
    title: 'Late summer, under glass',
    venue: 'Hiraeth',
    city: 'Cardiff',
    price: '£85',
    seats: 24,
    left: 5,
    blurb: 'Tomatoes at their loudest, cooked in a Victorian glasshouse as the light goes. Six courses, one long table.'
  },
  {
    date: '2026-10-03',
    title: 'Harbourside, first fires',
    venue: 'Warehouse Nine',
    city: 'Bristol Harbourside',
    price: '£85',
    seats: 30,
    left: 30,
    blurb: 'The first proper cold night of the year. Ember cooking, brown butter, and something quietly rich to finish.'
  },
  {
    date: '2026-11-21',
    title: 'A house in the hills',
    venue: 'Private residence',
    city: 'Bath',
    price: '£110',
    seats: 16,
    left: 0,
    blurb: 'Sixteen seats, a wood-fired range and no menu until you sit down.'
  }
];

/* ---- The pantry (shop) ------------------------------------ */
const PRODUCTS = [
  { name: 'Burnt honey',            meta: '200g jar · £12', img: 'The jar, lid off, spoon lifting a thread of honey.' },
  { name: 'Fermented chilli sauce', meta: '150ml · £9',     img: 'Bottle on linen, label facing, one shadow.' },
  { name: 'Smoked sea salt',        meta: '80g · £7',       img: 'Salt in a small dish, flakes catching the light.' },
  { name: 'Linen apron',            meta: 'One size · £45', img: 'Apron hung on a hook, worn-in, natural light.' },
  { name: 'Gift a seat',            meta: 'From £85',       img: 'A printed card in an envelope, sealed.' }
];

/* ---- The image strip under the homepage hero -------------- */
const STRIP = [
  { src: 'assets/images/1.jpg', alt: 'Plated dish, overhead, dark linen' },
  { src: 'assets/images/2.jpg', alt: 'Hands finishing a plate' },
  { src: 'assets/images/3.jpg', alt: 'The room before doors' },
  { src: 'assets/images/4.jpg', alt: 'Bread, torn, on the board' },
  { src: 'assets/images/5.jpg', alt: 'Guests mid-service, candlelight' },
  { src: 'assets/images/6.jpg', alt: 'Market produce, crates' },
  { src: 'assets/images/7.jpg', alt: 'Fish on the pass' },
  { src: 'assets/images/8.jpg', alt: 'Dessert, close crop' },
  { src: 'assets/images/9.jpg', alt: 'Dessert, close crop' },
  { src: 'assets/images/10.jpg', alt: 'Dessert, close crop' },
  { src: 'assets/images/11.jpg', alt: 'Dessert, close crop' },
  { src: 'assets/images/12.jpg', alt: 'Dessert, close crop' },
  { src: 'assets/images/13.jpg', alt: 'Dessert, close crop' }
];
