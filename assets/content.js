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

     2. an input named  b_something_something
        Copy that name into `honeypot` below. It's a spam trap.

   Until `action` is filled in, the form politely says it isn't
   connected yet instead of pretending to work.
------------------------------------------------------------- */
const MAILCHIMP = {
  action: '',
  honeypot: ''
};

/* ---- Upcoming pop-ups -------------------------------------
   date  : year-month-day, always in that order
   seats : how many the room holds
   left  : how many are still available (set to 0 for sold out)
   Delete a whole { ... } block to remove a night.
   ALSO: when you add or remove a night, update the matching
   block at the bottom of pop-ups.html so Google sees it too.
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
    blurb: 'Tomatoes at their loudest, cooked in a Victorian glasshouse as the light goes. Five courses, one long table.'
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

/* ---- Dishes -----------------------------------------------
   course : Bread, Starter, Main or Dessert
   img    : describes the photograph that belongs there
   Five is the right number. Don't add a sixth.
------------------------------------------------------------- */
const DISHES = [
  {
    course: 'Bread',
    name: 'Sourdough, cultured butter, burnt honey',
    desc: 'Slow-fermented sourdough baked the morning of service. Butter cultured in-house for three days, whipped with honey caught just past the point of caramel.',
    story: 'The starter is nine years old and has moved house four times. It is the only ingredient at Lumi older than the brand.',
    img: { src: 'assets/images/dish-1.jpg', alt: 'Torn loaf, steam, butter with a spoon dragged through it. Overhead, hard warm light.' }
  },
  {
    course: 'Starter',
    name: 'Cornish crab, apple, dill',
    desc: 'Hand-picked white crab, a sharp green apple broth poured at the table, dill oil and a little brown crab on toast alongside.',
    story: 'Landed at Newlyn and driven up the same day. If the boats stay in, this dish doesn\'t run — which has happened twice.',
    img: 'Shallow bowl, broth being poured, green oil beading on the surface.'
  },
  {
    course: 'Main',
    name: 'Turbot, brown butter, sea herbs',
    desc: 'Turbot on the bone, basted hard in foaming butter, finished with sea purslane and a spoonful of its own roasting juices.',
    story: 'Cooked in one pan, in the room, in front of everyone. It is the loudest ten minutes of the night and the reason the kitchen sits in the middle.',
    img: 'Fish in the pan mid-baste, butter foaming, spoon in shot.'
  },
  {
    course: 'Main',
    name: 'Ember-roasted lamb, wild garlic, smoked potato',
    desc: 'Shoulder cooked long and slow over embers, wild garlic from the same week, potatoes smoked and then crushed with the lamb fat.',
    story: 'Whole shoulders from a farm forty minutes away. Everything that isn\'t served becomes the sauce for the next night.',
    img: 'Shoulder resting on the board, being pulled apart. Dark background, one light source.'
  },
  {
    course: 'Dessert',
    name: 'Burnt honey custard, oat crumb, sea salt',
    desc: 'Set custard made with the same burnt honey as the bread course, a toasted oat crumb, and enough salt to make you take a second spoonful.',
    story: 'It exists because the first honey I ever burnt was an accident, and it was better than the plan.',
    img: 'Spoon through set custard, crumb scattered, close crop.'
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
  { src: 'assets/images/strip-1.jpg', alt: 'Plated dish, overhead, dark linen' },
  { src: 'assets/images/strip-2.jpg', alt: 'Hands finishing a plate' },
  { src: 'assets/images/strip-3.jpg', alt: 'The room before doors' },
  { src: 'assets/images/strip-4.jpg', alt: 'Bread, torn, on the board' },
  { src: 'assets/images/strip-5.jpg', alt: 'Guests mid-service, candlelight' },
  { src: 'assets/images/strip-6.jpg', alt: 'Market produce, crates' },
  { src: 'assets/images/strip-7.jpg', alt: 'Fish on the pass' },
  { src: 'assets/images/strip-8.jpg', alt: 'Dessert, close crop' }
];
