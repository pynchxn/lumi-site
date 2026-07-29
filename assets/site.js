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

  const ord = n => {
    const s = ['th', 'st', 'nd', 'rd'], v = n % 100;
    return n + (s[(v - 20) % 10] || s[v] || s[0]);
  };

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
          <div class="ph r-4x5"><span class="ph__label">Image<i>${x.img}</i></span></div>
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
        <div class="ph r-1x1"><span class="ph__label">Image<i>${x.img}</i></span></div>
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

  /* ---- booking (placeholder — no payment is taken) ---- */
  const modal = $('#modal');
  if (modal && hasEvents) {
    const modalBody = $('#modalbody');
    let lastFocus = null;

    function openModal(html) {
      lastFocus = document.activeElement;
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
    modal.addEventListener('click', e => { if (e.target.hasAttribute('data-close')) closeModal(); });
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
          <div><button class="btn btn--solid" type="submit"><span>Reserve &amp; pay</span></button></div>
          <p class="note">By reserving you're agreeing to the <a href="booking-terms.html">booking terms</a>.</p>
          <p class="note">Demo checkout — no payment is taken and no seat is held.</p>
        </form>`);

      $('#bookform').addEventListener('submit', ev2 => {
        ev2.preventDefault();
        const name = $('#b-name').value.trim(), email = $('#b-email').value.trim();
        if (!name || !email) return;
        openModal(`
          <p class="eyebrow">You're in</p>
          <h2 class="h-md" id="modaltitle" style="margin:0 0 16px">See you on the ${ord(+d.day)}, ${name.split(' ')[0]}.</h2>
          <p class="p">A confirmation is on its way to <b>${email}</b> from bookings@dineatlumi.co.uk, with the address, parking notes and the menu for the night. Worth checking spam if it hasn't landed.</p>
          <p class="note" style="margin-bottom:24px">Placeholder confirmation — connect Stripe and an email service to make this real.</p>
          <button class="btn" data-close><span>Close</span></button>`);
      });
    });
  }

  /* ---- contact form (placeholder) ---- */
  const cf = $('#contactform');
  if (cf) cf.addEventListener('submit', e => {
    e.preventDefault();
    const ok = $('#c-name').value.trim() && $('#c-email').value.trim();
    $('#contactstatus').textContent = ok
      ? 'Sent. I\'ll come back to you within a day or two. (Demo form — not yet connected.)'
      : 'Add your name and email and I\'ll get back to you.';
    if (ok) e.target.reset();
  });

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
  function alignLockup() {
    document.querySelectorAll('.hero .mark, .hero .byline').forEach(centreInk);
  }
  if (document.fonts && document.fonts.ready) document.fonts.ready.then(alignLockup);
  else addEventListener('load', alignLockup);
  addEventListener('resize', alignLockup, { passive: true });

})();
