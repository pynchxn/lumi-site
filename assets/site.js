/* ============================================================
   LUMI — site behaviour
   One file, runs on every page. Each block checks whether the
   thing it needs is on the page before doing anything.
   You shouldn't need to edit this. Content lives in content.js.
   ============================================================ */
(function () {
  'use strict';

  const $  = (s, r = document) => r.querySelector(s);
  const $$ = (s, r = document) => [...r.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  const fmt = iso => {
    const d = new Date(iso + 'T00:00:00');
    return {
      day: d.toLocaleDateString('en-GB', { day: 'numeric' }),
      mon: d.toLocaleDateString('en-GB', { month: 'short' }).replace('.', ''),
      yr: d.getFullYear(),
      full: d.toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })
    };
  };

  const hasEvents = typeof EVENTS !== 'undefined';

  /* ---- image slot ----
     `img` in content.js is either a real file path or a sentence describing
     the shot that belongs there. A path gets the photograph; anything else
     gets an empty box — the description stays in content.js as the note of
     what to shoot, but it is no longer printed onto the page. The static
     slots in the HTML were emptied the same way. */
  const isPath = s => /^assets\/.+\.(jpe?g|png|webp|avif|svg)$/i.test(s || '');

  const media = (ratio, img, alt) => isPath(img)
    ? `<div class="ph ${ratio}"><img src="${img}" alt="${alt || ''}" loading="lazy" decoding="async"></div>`
    : `<div class="ph ${ratio}"></div>`;

  /* ---- mark the current page in the nav ----
     Skips .btn: the CTA points at pop-ups.html too, so without this both it
     and the Pop-ups link get marked, and a screen reader announces two
     current pages. */
  const here = location.pathname.split('/').pop() || 'index.html';
  $$('.nav a:not(.btn)').forEach(a => {
    if (a.getAttribute('href') === here) a.setAttribute('aria-current', 'page');
  });

  /* ---- food strip ---- */
  const track = $('#track');
if (track && STRIP?.length) {
  const tile = ({ src, alt }, dupe = false) => `
    <div class="ph r-4x5"${dupe ? ' aria-hidden="true"' : ''}>
      <img src="${src}" alt="${dupe ? '' : alt}" loading="lazy" decoding="async">
    </div>`;

  track.innerHTML = [
    ...STRIP.map(item => tile(item)),
    ...STRIP.map(item => tile(item, true))
  ].join('');
}

  /* ---- events ---- */
  function eventCard(e, i) {
    const d = fmt(e.date);
    const out = e.left === 0;
    const pct = Math.round(((e.seats - e.left) / e.seats) * 100);
    return `
    <article class="ev rv">
      <div class="ev__date"><b>${d.day}</b>${d.mon} ${d.yr}</div>
      <div class="ev__body">
        <p class="ev__where">${e.venue} · ${e.city}</p>
        <h3 class="h-sm" style="margin:0 0 12px">${e.title}</h3>
        <p>${e.blurb}</p>
        <div class="ev__meta"><span>${e.price} per seat</span><span>Doors 7pm</span><span>Single sitting</span></div>
      </div>
      <div class="ev__act">
        <div class="seats" style="width:100%">
          <span class="ev__meta">${out ? 'Fully booked' : e.left + ' of ' + e.seats + ' seats left'}</span>
          <span class="seats__bar"><i style="width:${out ? 100 : pct}%"></i></span>
        </div>
        ${out ? '<span class="sold">Sold out</span>'
              : `<button class="btn btn--solid" data-book="${i}"><span>Book this night</span></button>`}
      </div>
    </article>`;
  }

  if (hasEvents) {
    const all = $('#all-events'), home = $('#home-events');
    if (all)  all.innerHTML  = EVENTS.map(eventCard).join('');
    if (home) home.innerHTML = EVENTS.slice(0, 2).map(eventCard).join('');

    const line = $('#nextline'), next = EVENTS.find(e => e.left > 0);
    if (line && next) {
      const d = fmt(next.date);
      line.innerHTML = `Next · <b>${d.day} ${d.mon}</b> · ${next.city} · ${next.left} seats left`;
    }
  }

  /* ---- dishes ---- */
  const dishes = $('#dishes');
  if (dishes && typeof DISHES !== 'undefined') {
    dishes.innerHTML = DISHES.map(x => `
      <article class="dish rv">
        <div class="dish__media">
          ${media('r-4x5', x.img, x.alt)}
        </div>
        <div>
          <p class="course">${x.course}</p>
          <h3 class="h-md dish__name">${x.name}</h3>
          <p class="p">${x.desc}</p>
          <p class="dish__note">${x.story}</p>
        </div>
      </article>`).join('');
  }

  /* ---- pantry ---- */
  const prods = $('#prods');
  if (prods && typeof PRODUCTS !== 'undefined') {
    prods.innerHTML = PRODUCTS.map(x => `
      <article class="rv">
        ${media('r-1x1', x.img, x.alt)}
        <h3 class="prod__name">${x.name}</h3>
        <p class="prod__meta">${x.meta}</p>
        <span class="prod__soon">Coming soon</span>
      </article>`).join('');
  }

  const yr = $('#yr');
  if (yr) yr.textContent = new Date().getFullYear();

  /* ---- header state + the glow, which lives with the hero ---- */
  let ticking = false;
  function onScroll() {
    const hero = $('.hero');
    const past = hero ? scrollY > hero.offsetHeight * 0.85 : true;
    $('#head').classList.toggle('stuck', scrollY > 40);
    $('#glow').classList.toggle('on', !past);
    ticking = false;
  }
  addEventListener('scroll', () => {
    if (!ticking) { ticking = true; requestAnimationFrame(onScroll); }
  }, { passive: true });
  onScroll();

  if (!reduce && matchMedia('(pointer:fine)').matches) {
    addEventListener('pointermove', e => {
      $('#glow').style.transform = `translate(${e.clientX}px, ${e.clientY}px) translate(-50%,-50%)`;
    }, { passive: true });
  }

  /* ---- reveal on scroll ---- */
  if (!('IntersectionObserver' in window)) $$('.rv').forEach(el => el.classList.add('in'));
  const io = new IntersectionObserver(es => {
    es.forEach(e => { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
  }, { rootMargin: '0px 0px -8% 0px' });
  $$('.rv').forEach(el => io.observe(el));

  /* ---- mobile nav ---- */
  const navBtn = $('#navbtn'), nav = $('#nav');
  function closeNav() { nav.classList.remove('open'); navBtn.setAttribute('aria-expanded', 'false'); }
  $$('.nav a').forEach(a => a.addEventListener('click', closeNav));
  navBtn.addEventListener('click', () => {
    navBtn.setAttribute('aria-expanded', String(nav.classList.toggle('open')));
  });

  /* ---- the sunburst draws from the centre outward ---- */
  $$('.sun').forEach(svg => {
    const paths = [...svg.querySelectorAll('path')];
    const mid = (paths.length - 1) / 2;
    paths.forEach((path, i) => {
      path.style.setProperty('--len', path.getTotalLength().toFixed(1));
      if (!svg.classList.contains('sun--static')) {
        path.style.animationDelay = (0.2 + Math.abs(i - mid) * 0.075).toFixed(2) + 's';
      }
    });
  });

  /* ---- form delivery ----
     The booking form and the contact form both post to send.php on
     this same host, so a plain fetch works. The mailing list further
     down needs the JSONP dance instead, because Mailchimp's endpoint
     is on another domain and sends no CORS headers — that's the
     difference between the two, not a change of mind.
     Resolves to the server's message on failure so the caller can
     show it; falls back to its own wording if the reply is unusable
     (PHP not enabled, endpoint missing, an error page instead of JSON). */
  const postForm = (data, fallback) =>
    fetch('send.php', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8' },
      body: new URLSearchParams(data)
    })
      /* Second handler catches the fetch itself rejecting — offline, DNS,
         connection dropped — which would otherwise surface the browser's
         own "Failed to fetch" to the visitor. Both that and an unparseable
         body collapse to null, and null means show the fallback. */
      .then(r => r.json().catch(() => null), () => null)
      .then(r => {
        if (r && r.ok) return r;
        throw new Error((r && r.msg) || fallback);
      });

  /* ---- booking ----
     No payment is taken here. The form emails the request to
     bookings@dineatlumi.co.uk and Josh confirms the seats himself,
     so nothing is held at the point of submitting. The copy below
     says so — don't soften it without changing what actually happens. */
  const modal = $('#modal');
  if (modal && hasEvents) {
    const modalBody = $('#modalbody');
    let lastFocus = null;

    function openModal(html) {
      /* Only when the modal is actually opening. The second call — swapping
         the form for the confirmation — would otherwise overwrite this with
         something inside the form that's about to be destroyed, and closing
         would drop focus at the top of the page instead of back on the
         button that opened it. Disabling the submit button while sending
         blurs it first, which makes that reliably <body>. */
      if (!modal.classList.contains('open')) lastFocus = document.activeElement;
      modalBody.innerHTML = html;
      modal.classList.add('open');
      document.body.style.overflow = 'hidden';
      modal.querySelector('input, button, select')?.focus();
    }
    function closeModal() {
      modal.classList.remove('open');
      document.body.style.overflow = '';
      lastFocus?.focus();
    }
    /* closest, not hasAttribute: the Close button on the confirmation wraps
       its label in a <span>, so a click lands on the span and the attribute
       is one level up. The × and the veil have no children and worked either
       way, which is why this went unnoticed. */
    modal.addEventListener('click', e => { if (e.target.closest('[data-close]')) closeModal(); });
    addEventListener('keydown', e => { if (e.key === 'Escape' && modal.classList.contains('open')) closeModal(); });

    document.addEventListener('click', e => {
      const btn = e.target.closest('[data-book]');
      if (!btn) return;
      const ev = EVENTS[+btn.dataset.book], d = fmt(ev.date);
      const unit = parseInt(ev.price.replace(/[^0-9]/g, ''), 10);
      const opts = Array.from({ length: Math.min(6, ev.left) }, (_, i) =>
        `<option value="${i + 1}">${i + 1} ${i ? 'seats' : 'seat'} — £${unit * (i + 1)}</option>`).join('');

      openModal(`
        <p class="eyebrow" style="margin-bottom:.8em">${d.full}</p>
        <h2 class="h-md" id="modaltitle" style="margin:0 0 6px">${ev.title}</h2>
        <p class="note" style="margin-bottom:26px">${ev.venue}, ${ev.city} · doors 7pm · ${ev.left} seats left</p>
        <form class="form" id="bookform" style="max-width:none">
          <div class="field"><label for="b-name">Name</label><input id="b-name" type="text" autocomplete="name" required></div>
          <div class="field"><label for="b-email">Email</label><input id="b-email" type="email" autocomplete="email" required></div>
          <div class="field"><label for="b-seats">Seats</label><select id="b-seats">${opts}</select></div>
          <div class="field"><label for="b-diet">Allergies or dietary requirements</label><input id="b-diet" type="text" placeholder="Optional"></div>
          <div class="hp" aria-hidden="true"><input id="b-co" type="text" tabindex="-1" autocomplete="off"></div>
          <div><button class="btn btn--solid" type="submit"><span>Request these seats</span></button></div>
          <p class="note">By requesting seats you're agreeing to the <a href="booking-terms.html">booking terms</a>.</p>
          <p class="note">No payment is taken here. I'll email you back to confirm the seats and sort payment — they're not held until I do.</p>
          <p class="note" id="bookstatus" role="status"></p>
        </form>`);

      const bookBtn = $('#bookform [type="submit"]'), bookStatus = $('#bookstatus');

      $('#bookform').addEventListener('submit', ev2 => {
        ev2.preventDefault();
        const name = $('#b-name').value.trim(), email = $('#b-email').value.trim();
        if (!name || !email) return;
        const seats = $('#b-seats').value;

        bookBtn.disabled = true;
        bookStatus.textContent = 'One moment…';

        postForm({
          form: 'booking',
          name, email, seats,
          diet: $('#b-diet').value.trim(),
          /* No id on the events in content.js, and no backend to match one
             against — the person reading the email needs the night named,
             and this names it. */
          event: `${ev.title} — ${d.full}, ${ev.venue}, ${ev.city}`,
          company: $('#b-co').value
        }, 'Couldn\'t send that just now. Email bookings@dineatlumi.co.uk and I\'ll sort it.')
          .then(() => {
            openModal(`
              <h2 class="h-md" id="modaltitle" style="margin:0 0 16px">Request sent</h2>
              <p class="note" style="margin-bottom:24px">I'll email you back from bookings@dineatlumi.co.uk to confirm. Nothing's held until then.</p>
              <button class="btn" data-close><span>Close</span></button>`);
          })
          .catch(err => { bookStatus.textContent = err.message; })
          .finally(() => { bookBtn.disabled = false; });
      });
    });
  }

  /* ---- contact form ----
     Same endpoint as the booking form. Which address it lands at is
     decided server-side from the subject dropdown: a question about a
     seat already booked goes to bookings@, everything else to hello@. */
  const cf = $('#contactform');
  if (cf) {
    const cStatus = $('#contactstatus'), cBtn = cf.querySelector('[type="submit"]');

    cf.addEventListener('submit', e => {
      e.preventDefault();
      if (!$('#c-name').value.trim() || !$('#c-email').value.trim()) {
        cStatus.textContent = 'Add your name and email and I\'ll get back to you.';
        return;
      }

      cBtn.disabled = true;
      cStatus.textContent = 'One moment…';

      /* This form is real markup with name attributes on it, so FormData
         reads it directly — the booking form is built in JS and read by id. */
      postForm(
        { ...Object.fromEntries(new FormData(cf)), form: 'contact' },
        'Couldn\'t send that just now. Email hello@dineatlumi.co.uk and it\'ll reach me.'
      )
        .then(() => {
          cStatus.textContent = 'Sent. I\'ll come back to you within a day or two.';
          cf.reset();
        })
        .catch(err => { cStatus.textContent = err.message; })
        .finally(() => { cBtn.disabled = false; });
    });
  }

  /* ---- mailing list (Mailchimp) ----
     Submits in the background so nobody is thrown onto a Mailchimp-branded
     page mid-signup. Their endpoint sends no CORS headers, so fetch() can't
     read the reply — JSONP (a <script> tag naming a callback) is the way
     Mailchimp documents for this, and the only one that works from a
     static site. The reply lands in #mailstatus, which is role="status",
     so screen readers announce it without moving focus. */
  const mf = $('#mailform');
  if (mf) {
    const status = $('#mailstatus');
    const cfg = (typeof MAILCHIMP !== 'undefined') ? MAILCHIMP : { action: '', honeypot: '' };
    const ready = /list-manage\.com/.test(cfg.action || '');
    const btn = mf.querySelector('[type="submit"]');

    if (ready) {
      // Kept in sync for the no-JS case and so the form is valid on its own.
      mf.setAttribute('action', cfg.action);
      if (cfg.honeypot) $('#m-hp').setAttribute('name', cfg.honeypot);
    }

    /* Mailchimp answers in prose with markup in it, prefixed on validation
       errors with "0 - ". Rewrite the three people actually hit; pass
       anything else through rather than swallowing it. */
    const humanise = msg => {
      const t = String(msg || '').replace(/<[^>]*>/g, '').replace(/^\d+\s*-\s*/, '').trim();
      if (/already subscribed/i.test(t)) return 'You\'re already on the list.';
      if (/too many recent/i.test(t))    return 'That\'s a few too many tries — give it a minute and try again.';
      // Their wording for a bad address varies: "must contain a single @",
      // "enter a valid email address", "0 - Please enter a value".
      if (/must contain|valid email|enter a value|invalid/i.test(t))
        return 'That email doesn\'t look right — check it and try again.';
      return t || 'Something went wrong. Try again, or email hello@dineatlumi.co.uk.';
    };

    let seq = 0;
    const jsonp = url => new Promise((resolve, reject) => {
      const cb = 'mc_cb_' + (++seq) + '_' + Date.now();
      const s = document.createElement('script');
      const timer = setTimeout(() => { cleanup(); reject(); }, 10000);
      function cleanup() {
        clearTimeout(timer);
        delete window[cb];
        s.remove();
      }
      window[cb] = data => { cleanup(); resolve(data); };
      s.onerror = () => { cleanup(); reject(); };
      s.src = url + '&c=' + cb;
      document.body.appendChild(s);
    });

    mf.addEventListener('submit', e => {
      e.preventDefault();

      if (!ready) {
        status.textContent = 'Not connected yet — add the Mailchimp details in assets/content.js.';
        return;
      }
      const email = $('#m-email').value.trim();
      if (!email) {
        status.textContent = 'Pop your email in and you\'re on.';
        return;
      }

      const q = new URLSearchParams({ EMAIL: email });
      const fname = $('#m-fname').value.trim();
      if (fname) q.set('FNAME', fname);
      if (cfg.honeypot) q.set(cfg.honeypot, $('#m-hp').value);   // must go up empty

      if (btn) btn.disabled = true;
      status.textContent = 'One moment…';

      jsonp(cfg.action.replace('/post?', '/post-json?') + '&' + q)
        .then(r => {
          const ok = r && r.result === 'success';
          status.textContent = ok
            ? 'You\'re on the list. New dates go out a few days before they\'re public.'
            : humanise(r && r.msg);
          if (ok) mf.reset();
        })
        .catch(() => {
          status.textContent = 'Couldn\'t reach the list just now. Try again, or email hello@dineatlumi.co.uk.';
        })
        .finally(() => { if (btn) btn.disabled = false; });
    });
  }

  /* ---- centre the script wordmark's ink under the sunburst ----
     CSS centres a text box by its advance width, which on a script face
     includes lopsided side bearings for the connecting strokes. The logo
     centres the ink itself, so measure that and correct the difference.
     Uses `left`, not `transform` — the fade-in keyframe ends on
     `transform:none` and would wipe a transform out. */
  function centreInk(el) {
    if (!el) return;
    const cs = getComputedStyle(el);
    const ctx = centreInk.c || (centreInk.c = document.createElement('canvas').getContext('2d'));
    ctx.font = `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`;
    const m = ctx.measureText(el.textContent.trim());
    if (typeof m.actualBoundingBoxRight !== 'number') return;   // older browsers: leave it alone
    const ink = m.actualBoundingBoxRight - m.actualBoundingBoxLeft;
    const shift = (m.width - ink) / 2;
    if (isFinite(shift)) el.style.setProperty('--nudge', shift.toFixed(2) + 'px');
  }
  /* The footer wordmark is in here too: CSS centres it in a box the width of
     the sunburst above it, and this corrects that centring from advance width
     to ink, which is what actually lines up with the centre ray. The footer is
     identical on every page, so this one selector covers all of them. */
  function alignLockup() {
    document.querySelectorAll('.hero .mark, .hero .byline, .foot .brand').forEach(centreInk);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignLockup);
  else addEventListener('load', alignLockup);
  addEventListener('resize', alignLockup, { passive: true });

})();
