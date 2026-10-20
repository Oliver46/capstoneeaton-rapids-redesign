/* ==========================================================================
   Capstone Family Practice: script.js
   Vanilla JS, no dependencies. Everything here is progressive enhancement:
   the page is fully usable with JavaScript turned off.

   Office hours, lunch, holidays and one-off closures are NOT edited here.
   They all live in hours.js.

   1. Settings and helpers
   2. Schedule (hours.js, or the HTML hours table as a fallback)
   3. Weekly hours on the page (table, lunch note, footer, FAQ, JSON-LD)
   4. Today's hours card and "Open now" status
   5. Mobile menu
   6. Current section in the menu
   7. Parallax background
   8. Footer year
   ========================================================================== */
(function () {
  'use strict';

  /* ------------------------------------------------------------------
     1. Settings and helpers
     ------------------------------------------------------------------ */
  var TIME_ZONE = 'America/Detroit';                      // Eaton Rapids, MI (Eastern Time)
  var WEEK = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'];
  var DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  var MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  var DEFAULT_LUNCH = { start: 12 * 60, end: 13 * 60 };   // used only without hours.js
  var PHONE = '517-836-2178';

  var CONFIG = window.CAPSTONE_HOURS || {};
  var $ = function (id) { return document.getElementById(id); };

  function pad(n) { return ('0' + n).slice(-2); }

  // '8:00 AM' -> 480 (minutes after midnight), or null
  function toMinutes(text) {
    var m = /(\d{1,2}):(\d{2})\s*(AM|PM)/i.exec(text);
    if (!m) return null;
    return (parseInt(m[1], 10) % 12 + (/pm/i.test(m[3]) ? 12 : 0)) * 60 + parseInt(m[2], 10);
  }

  // 780 -> '1:00 PM'
  function clock(min) {
    var h = Math.floor(min / 60);
    return (h % 12 || 12) + ':' + pad(min % 60) + (h < 12 ? ' AM' : ' PM');
  }

  // 780 -> '13:00' (for structured data)
  function clock24(min) { return pad(Math.floor(min / 60)) + ':' + pad(min % 60); }

  // '8:00 AM – 5:00 PM' (en dash, em dash or hyphen) -> { start: 480, end: 1020 }, or null
  function parseRange(text) {
    var parts = String(text).split(/\s*[–—-]\s*/);
    var start = toMinutes(parts[0] || ''), end = toMinutes(parts[1] || '');
    return start === null || end === null ? null : { start: start, end: end };
  }

  function isClosedText(text) { return /closed/i.test(text); }

  // '8:00 AM – 5:00 PM'
  function rangeText(r) { return clock(r.start) + ' – ' + clock(r.end); }

  // Lunch break, short form: '12:00–1:00 PM' (the first AM/PM is dropped when both match)
  function compactRange(r) {
    var a = clock(r.start), b = clock(r.end);
    return (a.slice(-2) === b.slice(-2) ? a.slice(0, -3) : a) + '–' + b;
  }

  // ['Monday', …, 'Thursday'] -> 'Monday–Thursday' (short: 'Mon–Thu'; joiner: ' through ')
  function dayRange(days, short, joiner) {
    var name = function (d) { return short ? d.slice(0, 3) : d; };
    return days.length === 1 ? name(days[0]) : name(days[0]) + (joiner || '–') + name(days[days.length - 1]);
  }

  // ['Saturday', 'Sunday'] -> 'Saturday and Sunday'; 3+ items: 'a, b and c'
  function listAnd(items, lastJoiner) {
    return items.length > 1 ? items.slice(0, -1).join(', ') + (lastJoiner || ' and ') + items[items.length - 1] : items.join('');
  }

  function el(tag, className, text) {
    var node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  }

  // Append text to a node, setting times ("8:00 AM", "12:00–1:00 PM") in the serif .time style
  var TIME_RE = /\d{1,2}:\d{2}(?:\s?[AP]M)?(?:\s?[–-]\s?\d{1,2}:\d{2}(?:\s?[AP]M)?)?/g;
  function appendWithTimes(node, text) {
    var last = 0;
    text.replace(TIME_RE, function (match, offset) {
      if (offset > last) node.appendChild(document.createTextNode(text.slice(last, offset)));
      node.appendChild(el('span', 'time', match));
      last = offset + match.length;
    });
    if (last < text.length) node.appendChild(document.createTextNode(text.slice(last)));
    return node;
  }

  // Today in Eastern Time: { weekday, iso: 'YYYY-MM-DD', minutes }, or null on very old browsers
  function practiceNow() {
    var parts = {};
    try {
      new Intl.DateTimeFormat('en-US', {
        timeZone: TIME_ZONE, weekday: 'long', year: 'numeric', month: '2-digit', day: '2-digit',
        hour: '2-digit', minute: '2-digit', hourCycle: 'h23'
      }).formatToParts(new Date()).forEach(function (p) { parts[p.type] = p.value; });
    } catch (e) {
      return null;
    }
    return {
      weekday: parts.weekday,
      iso: parts.year + '-' + parts.month + '-' + parts.day,
      minutes: (parseInt(parts.hour, 10) % 24) * 60 + parseInt(parts.minute, 10)
    };
  }

  // The day `offset` days after `day`: { weekday, iso }
  function dayAfter(day, offset) {
    var p = day.iso.split('-');
    var d = new Date(Date.UTC(+p[0], +p[1] - 1, +p[2] + offset));
    return { weekday: DAY_NAMES[d.getUTCDay()], iso: d.getUTCFullYear() + '-' + pad(d.getUTCMonth() + 1) + '-' + pad(d.getUTCDate()) };
  }

  /* ------------------------------------------------------------------
     2. Schedule
     WEEKLY[day] = { day, text, range, closed, lunch }  (Monday to Sunday)
     LUNCH       = { start, end } or null
     SPECIALS    = [{ date: 'YYYY-MM-DD', label, hours }]  (holidays + one-off days)
     ------------------------------------------------------------------ */
  var table = $('hours-table');
  var LUNCH = null;
  var WEEKLY = {};

  function describeDay(day, raw, lunchDays) {
    var closed = isClosedText(raw);
    var range = closed ? null : parseRange(raw);
    return {
      day: day,
      text: range ? rangeText(range) : (closed ? 'Closed' : String(raw)),
      range: range,
      closed: closed,
      lunch: !!(range && LUNCH && lunchDays.indexOf(day) > -1 && range.start < LUNCH.start && range.end > LUNCH.end)
    };
  }

  if (CONFIG.weekly) {
    // hours.js is the source
    LUNCH = CONFIG.lunch ? parseRange(CONFIG.lunch) : null;
    WEEK.forEach(function (day) {
      var raw = CONFIG.weekly[day] === undefined ? 'Closed' : CONFIG.weekly[day];
      WEEKLY[day] = describeDay(day, raw, LUNCH ? (CONFIG.lunchDays || []) : []);
    });
  } else if (table) {
    // Fallback: hours.js missing or broken, read the hours written in the HTML table
    LUNCH = DEFAULT_LUNCH;
    WEEK.forEach(function (day) {
      var row = table.querySelector('tr[data-day="' + day + '"]');
      if (!row) return;
      var info = describeDay(day, row.querySelector('td').textContent.trim(), row.hasAttribute('data-no-lunch') ? [] : [day]);
      info.text = row.querySelector('td').textContent.trim();
      WEEKLY[day] = info;
    });
  }

  var SPECIALS = buildSpecials(CONFIG);

  /* hours.js holidays + one-off dates -> SPECIALS, for last, this and next year.
     One-off dates win over holidays on the same day. */
  function buildSpecials(config) {
    // Day of the month of the nth `weekday` (0 = Sunday) in a month; n = -1 means the last one
    function nthWeekday(y, m, weekday, n) {
      if (n > 0) {
        var first = new Date(Date.UTC(y, m - 1, 1)).getUTCDay();
        return 1 + ((weekday - first + 7) % 7) + (n - 1) * 7;
      }
      var last = new Date(Date.UTC(y, m, 0)).getUTCDate();
      var lastDay = new Date(Date.UTC(y, m - 1, last)).getUTCDay();
      return last - ((lastDay - weekday + 7) % 7);
    }
    function iso(y, m, d) { return y + '-' + pad(m) + '-' + pad(d); }

    var HOLIDAYS = {
      newYearsDay:          ["New Year's Day",         function (y) { return iso(y, 1, 1); }],
      memorialDay:          ['Memorial Day',           function (y) { return iso(y, 5, nthWeekday(y, 5, 1, -1)); }],
      independenceDay:      ['Independence Day',       function (y) { return iso(y, 7, 4); }],
      laborDay:             ['Labor Day',              function (y) { return iso(y, 9, nthWeekday(y, 9, 1, 1)); }],
      thanksgiving:         ['Thanksgiving Day',       function (y) { return iso(y, 11, nthWeekday(y, 11, 4, 4)); }],
      dayAfterThanksgiving: ['Day after Thanksgiving', function (y) { return iso(y, 11, nthWeekday(y, 11, 4, 4) + 1); }],
      christmasEve:         ['Christmas Eve',          function (y) { return iso(y, 12, 24); }],
      christmasDay:         ['Christmas Day',          function (y) { return iso(y, 12, 25); }],
      newYearsEve:          ["New Year's Eve",         function (y) { return iso(y, 12, 31); }]
    };

    var list = [], taken = {};
    function add(item) { if (!taken[item.date]) { list.push(item); taken[item.date] = true; } }

    (config.specialDates || []).forEach(function (d) {
      if (d && /^\d{4}-\d{2}-\d{2}$/.test(d.date)) add(d);
    });
    var settings = config.holidays || {};
    var year = new Date().getFullYear();
    Object.keys(HOLIDAYS).forEach(function (key) {
      var value = settings[key];
      if (value === false || value === undefined || value === null || value === '') return;   // open as usual
      for (var y = year - 1; y <= year + 1; y++) {
        add({ date: HOLIDAYS[key][1](y), label: HOLIDAYS[key][0], hours: value === true ? 'Closed' : String(value) });
      }
    });
    return list;
  }

  function specialOn(iso) {
    for (var i = 0; i < SPECIALS.length; i++) if (SPECIALS[i].date === iso) return SPECIALS[i];
    return null;
  }

  // Opening hours on one date: { closed, start, end, lunch, special }, or null if unknown
  function hoursOn(day) {
    var special = specialOn(day.iso);
    if (special) {
      if (isClosedText(special.hours)) return { closed: true, special: special };
      var r = parseRange(special.hours);
      return r ? { start: r.start, end: r.end, lunch: false, special: special } : null;
    }
    var w = WEEKLY[day.weekday];
    if (!w) return null;
    if (w.closed) return { closed: true };
    return w.range ? { start: w.range.start, end: w.range.end, lunch: w.lunch } : null;
  }

  /* ------------------------------------------------------------------
     3. Weekly hours on the page (only when hours.js is present;
        otherwise the HTML already shows them)
     ------------------------------------------------------------------ */
  function renderWeeklyHours() {
    if (!CONFIG.weekly) return;
    var days = WEEK.map(function (d) { return WEEKLY[d]; });
    var lunchText = LUNCH ? compactRange(LUNCH) : '';
    var lunchDays = days.filter(function (d) { return d.lunch; }).map(function (d) { return d.day; });

    // Consecutive days with the same hours (and the same lunch) form one group
    var groups = [];
    days.forEach(function (d) {
      var last = groups[groups.length - 1];
      if (last && last.text === d.text && last.lunch === d.lunch) last.days.push(d.day);
      else groups.push({ text: d.text, lunch: d.lunch, closed: d.closed, days: [d.day] });
    });

    // Hours table
    if (table) days.forEach(function (d) {
      var row = table.querySelector('tr[data-day="' + d.day + '"]');
      if (!row) return;
      row.querySelector('td').textContent = d.text;
      row.toggleAttribute('data-closed', d.closed);
      row.toggleAttribute('data-no-lunch', !d.lunch);
    });

    // Lunch note under the table
    var lunchNote = $('lunch-note');
    if (lunchNote) {
      lunchNote.hidden = !lunchDays.length;
      if (lunchDays.length) {
        lunchNote.textContent = 'Closed for lunch ';
        lunchNote.appendChild(el('span', 'time', lunchText));
        lunchNote.appendChild(document.createTextNode(', ' + dayRange(lunchDays) + '.'));
      }
    }

    // Footer summary
    var footer = $('footer-hours-list');
    if (footer) {
      footer.textContent = '';
      groups.forEach(function (g) {
        var p = el('p');
        p.appendChild(document.createTextNode(dayRange(g.days, true) + ': '));
        p.appendChild(el('span', g.closed ? '' : 'time', g.text));
        if (g.lunch) {
          p.appendChild(el('br'));
          p.appendChild(appendWithTimes(el('span', 'footer-muted'), 'Lunch ' + lunchText));
        }
        footer.appendChild(p);
      });
    }

    // One sentence for the FAQ answer and for Google
    var openParts = groups.filter(function (g) { return !g.closed; }).map(function (g) {
      return dayRange(g.days, false, ' through ') + ', ' + g.text.replace(' – ', ' to ') +
        (g.lunch ? ' (closed ' + lunchText.replace('–', ' to ') + ' for lunch)' : '');
    });
    var closedDays = days.filter(function (d) { return d.closed; }).map(function (d) { return d.day; });
    var sentence = listAnd(openParts, ', and ') + '.' + (closedDays.length ? ' We are closed ' + listAnd(closedDays) + '.' : '');

    var faq = $('faq-hours-answer');
    if (faq) {
      var note = faq.querySelector('.holiday-note'), link = faq.querySelector('a');
      faq.textContent = sentence + ' ';
      if (note) faq.appendChild(note);
      if (link) {
        faq.appendChild(document.createTextNode(' See the '));
        faq.appendChild(link);
        faq.appendChild(document.createTextNode('.'));
      }
    }

    // Structured data (JSON-LD) read by search engines
    try {
      var clinicEl = $('clinic-data');
      if (clinicEl) {
        var clinic = JSON.parse(clinicEl.textContent);
        var spec = [];
        days.forEach(function (d) {
          if (!d.range) return;
          var slots = d.lunch ? [[d.range.start, LUNCH.start], [LUNCH.end, d.range.end]] : [[d.range.start, d.range.end]];
          slots.forEach(function (s) {
            var opens = clock24(s[0]), closes = clock24(s[1]);
            var same = spec.filter(function (x) { return x.opens === opens && x.closes === closes; })[0];
            if (same) same.dayOfWeek.push(d.day);
            else spec.push({ '@type': 'OpeningHoursSpecification', dayOfWeek: [d.day], opens: opens, closes: closes });
          });
        });
        clinic.openingHoursSpecification = spec;
        clinicEl.textContent = JSON.stringify(clinic);
      }
      var faqEl = $('faq-data');
      if (faqEl) {
        var faqData = JSON.parse(faqEl.textContent);
        faqData.mainEntity[0].acceptedAnswer.text = sentence + ' Holiday hours may differ, so please call ' + PHONE + ' to confirm.';
        faqEl.textContent = JSON.stringify(faqData);
      }
    } catch (e) { /* keep the data written in the HTML */ }
  }

  /* ------------------------------------------------------------------
     4. Today's hours card (hero), today's row in the table, and the
        "Open now" status (updated every minute)
     ------------------------------------------------------------------ */
  function renderToday() {
    var today = practiceNow();
    var target = $('today-hours'), note = $('hours-note');
    if (!today || !target || !table) return;
    var row = table.querySelector('tr[data-day="' + today.weekday + '"]');
    var week = WEEKLY[today.weekday];
    if (!row || !week) return;
    var special = specialOn(today.iso);

    // Today's row in the table (a text badge, not color alone)
    row.classList.add('is-today');
    if (special) {
      var cell = row.querySelector('td');
      cell.textContent = special.hours;
      cell.appendChild(el('span', 'special-label', special.label));
      row.classList.add('is-special');
    }
    row.querySelector('th').appendChild(el('span', 'today-badge', 'Today'));

    // Hero card
    $('today-title').textContent = 'Today’s hours';
    target.textContent = '';
    var line = el('p', 'today-line');
    line.appendChild(el('strong', '', today.weekday + ': '));
    line.appendChild(document.createTextNode(special ? special.hours : week.text));
    target.appendChild(line);

    if (special) {
      target.appendChild(el('p', '', 'Special schedule: ' + special.label + '.'));
      note.textContent = 'Times shown are Eastern Time.';
    } else {
      note.textContent = '';
      appendWithTimes(note, 'Regular weekly hours (Eastern Time)' +
        (week.lunch ? '; closed ' + compactRange(LUNCH) + ' for lunch' : '') + '. ');
      note.appendChild(el('span', 'holiday-note', 'Holiday hours may differ, so please call to confirm.'));
    }

    // Advance warning for the next closure or special hours
    var ahead = CONFIG.announceDaysAhead === undefined ? 7 : +CONFIG.announceDaysAhead;
    for (var i = 1; i <= ahead; i++) {
      var day = dayAfter(today, i), upcoming = specialOn(day.iso);
      if (!upcoming) continue;
      var p = day.iso.split('-');
      var when = (i === 1 ? 'tomorrow, ' : '') + day.weekday + ', ' + MONTHS[+p[1] - 1] + ' ' + (+p[2]);
      target.appendChild(el('p', 'upcoming-note', isClosedText(upcoming.hours)
        ? 'Upcoming: closed ' + when + ' (' + upcoming.label + ').'
        : 'Upcoming: ' + when + ', ' + upcoming.hours + ' (' + upcoming.label + ').'));
      break;
    }
  }

  // 'opens tomorrow at 8:00 AM' / 'opens Monday at 8:00 AM' (looks up to a week ahead)
  function nextOpening(today) {
    for (var i = 1; i <= 7; i++) {
      var day = dayAfter(today, i), h = hoursOn(day);
      if (h && !h.closed) return 'opens ' + (i === 1 ? 'tomorrow' : day.weekday) + ' at ' + clock(h.start);
    }
    return '';
  }

  function renderStatus() {
    var status = $('open-status'), now = practiceNow();
    if (!status || !now) return;
    var h = hoursOn(now);
    if (!h) { status.hidden = true; return; }

    var t = now.minutes, open = false, text, next;
    var atLunch = h.lunch && t >= LUNCH.start && t < LUNCH.end;
    if (h.closed) {
      next = nextOpening(now);
      text = 'Closed today' + (h.special ? ' (' + h.special.label + ')' : '') + (next ? ' · ' + next : '');
    } else if (t < h.start) {
      text = 'Closed now · opens at ' + clock(h.start);
    } else if (t >= h.end) {
      next = nextOpening(now);
      text = 'Closed now' + (next ? ' · ' + next : '');
    } else if (atLunch) {
      text = 'Closed for lunch · reopens at ' + clock(LUNCH.end);
    } else {
      open = true;
      text = 'Open now · ' + (h.lunch && t < LUNCH.start ? 'closes for lunch at ' + clock(LUNCH.start) : 'closes at ' + clock(h.end));
    }
    status.textContent = '';
    status.appendChild(appendWithTimes(el('span'), text));   // one flex item next to the dot
    status.classList.toggle('is-open', open);
    status.hidden = false;
  }

  renderWeeklyHours();
  renderToday();
  renderStatus();
  setInterval(renderStatus, 60000);

  /* ------------------------------------------------------------------
     5. Mobile menu (disclosure pattern)
     ------------------------------------------------------------------ */
  var toggle = document.querySelector('.nav-toggle');
  var navList = $('nav-list');

  if (toggle && navList) {
    var isOpen = function () { return toggle.getAttribute('aria-expanded') === 'true'; };
    var setMenu = function (open, returnFocus) {
      toggle.setAttribute('aria-expanded', String(open));
      navList.classList.toggle('is-open', open);
      if (!open && returnFocus) toggle.focus();
    };

    toggle.addEventListener('click', function () { setMenu(!isOpen(), false); });
    // Choosing a link closes the menu
    navList.addEventListener('click', function (e) { if (e.target.closest('a')) setMenu(false, false); });
    // Escape closes it and returns focus to the button
    document.addEventListener('keydown', function (e) { if (e.key === 'Escape' && isOpen()) setMenu(false, true); });
    // A click outside closes it
    document.addEventListener('click', function (e) {
      if (isOpen() && !navList.contains(e.target) && !toggle.contains(e.target)) setMenu(false, false);
    });
    // Moving keyboard focus out of the menu closes it
    navList.addEventListener('focusout', function (e) {
      var next = e.relatedTarget;
      if (next && !navList.contains(next) && next !== toggle) setMenu(false, false);
    });
    // Reset when the desktop layout takes over
    var desktop = window.matchMedia('(min-width: 80em)');
    if (desktop.addEventListener) desktop.addEventListener('change', function (mq) { if (mq.matches) setMenu(false, false); });
  }

  /* ------------------------------------------------------------------
     6. Current section in the menu (aria-current) while scrolling.
        Sections without a menu link clear the highlight.
     ------------------------------------------------------------------ */
  var navLinks = Array.prototype.slice.call(document.querySelectorAll('.nav-list a[href^="#"]'));
  var sections = Array.prototype.slice.call(document.querySelectorAll('main > section[id]'));
  if (navLinks.length && 'IntersectionObserver' in window) {
    var visible = {};
    var spy = new IntersectionObserver(function (entries) {
      entries.forEach(function (e) { visible[e.target.id] = e.isIntersecting; });
      var current = null;
      sections.forEach(function (s) { if (!current && visible[s.id]) current = s.id; });
      navLinks.forEach(function (a) {
        if (a.getAttribute('href').slice(1) === current) a.setAttribute('aria-current', 'true');
        else a.removeAttribute('aria-current');
      });
    }, { rootMargin: '-35% 0px -60% 0px' });   // a thin band a third of the way down the screen
    sections.forEach(function (s) { spy.observe(s); });
  }

  /* ------------------------------------------------------------------
     7. Parallax background (Services). The image is taller than its
        section and drifts by up to ±(data-parallax × section height).
        Off when the visitor prefers reduced motion.
     ------------------------------------------------------------------ */
  var parallaxImgs = Array.prototype.slice.call(document.querySelectorAll('[data-parallax]'));
  var reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)');

  if (parallaxImgs.length && 'requestAnimationFrame' in window) {
    var ticking = false;
    var update = function () {
      ticking = false;
      var vh = window.innerHeight;
      parallaxImgs.forEach(function (img) {
        if (reduceMotion.matches) { img.style.transform = ''; return; }
        var section = img.closest('section');
        var box = section.getBoundingClientRect();
        if (box.bottom < 0 || box.top > vh) return;   // off screen
        // -1 when the section enters at the bottom, +1 when it leaves at the top
        var progress = (vh / 2 - (box.top + box.height / 2)) / (vh / 2 + box.height / 2);
        var shift = progress * section.offsetHeight * (parseFloat(img.getAttribute('data-parallax')) || 0.12);
        img.style.transform = 'translate3d(0,' + shift.toFixed(1) + 'px,0)';
      });
    };
    var request = function () {
      if (!ticking) { ticking = true; window.requestAnimationFrame(update); }
    };
    window.addEventListener('scroll', request, { passive: true });
    window.addEventListener('resize', request);
    if (reduceMotion.addEventListener) reduceMotion.addEventListener('change', request);
    update();
  }

  /* ------------------------------------------------------------------
     8. Footer year
     ------------------------------------------------------------------ */
  var year = $('year');
  if (year) year.textContent = String(new Date().getFullYear());
})();
