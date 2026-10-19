/* ==========================================================================
   Risco's Shop — catalog loader
   Builds the product cards, section headings, jump buttons and combo price
   tables from the spreadsheet files in the /data folder:
       data/products.csv   (one row per product)
       data/sections.csv   (the headings / jump buttons)
       data/combos.csv     (combo prices)
   You should not need to edit this file to change prices, text or photos.
   ========================================================================== */
(function () {
  'use strict';

  var BUST = Math.floor(Date.now() / 300000);          // refresh the data at most every 5 minutes
  var PHONE = '786-710-0750';

  /* ---------- helpers ---------- */
  function esc(s) { return String(s == null ? '' : s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;'); }
  function attr(s) { return esc(s).replace(/"/g, '&quot;'); }
  function bi(en, es) { return { en: en, es: es || en }; }
  /* attribute that the language switcher will later read back with innerHTML */
  function dataAttrs(en, es) { return ' data-en="' + attr(esc(en)) + '" data-es="' + attr(esc(es || en)) + '"'; }
  function curLang() { return document.documentElement.lang === 'es' ? 'es' : 'en'; }

  function money(v) {
    v = String(v || '').trim();
    if (!v) return '';
    var m = v.match(/^\$?\s*([\d,]+)(\.\d+)?$/);
    if (!m) return v;                                   // text such as "From $1,080" is shown as typed
    var whole = m[1].replace(/,/g, '').replace(/\B(?=(\d{3})+(?!\d))/g, ',');
    var cents = m[2] && parseFloat(m[2]) ? m[2] : '';
    return '$' + whole + cents;
  }

  /* ---------- CSV reader (handles quotes, commas and line breaks inside cells) ---------- */
  function parseCSV(text) {
    text = String(text).replace(/^﻿/, '');
    var rows = [], row = [], cell = '', q = false, i, c;
    for (i = 0; i < text.length; i++) {
      c = text.charAt(i);
      if (q) {
        if (c === '"') { if (text.charAt(i + 1) === '"') { cell += '"'; i++; } else { q = false; } }
        else { cell += c; }
      } else if (c === '"') { q = true; }
      else if (c === ',') { row.push(cell); cell = ''; }
      else if (c === '\n' || c === '\r') {
        if (c === '\r' && text.charAt(i + 1) === '\n') i++;
        row.push(cell); cell = ''; rows.push(row); row = [];
      } else { cell += c; }
    }
    if (cell !== '' || row.length) { row.push(cell); rows.push(row); }
    if (!rows.length) return [];
    var head = rows[0].map(function (h) { return h.trim().toLowerCase(); });
    var out = [];
    for (i = 1; i < rows.length; i++) {
      var r = rows[i], blank = true, o = {};
      for (var k = 0; k < head.length; k++) {
        var val = (r[k] == null ? '' : r[k]).trim();
        if (val !== '') blank = false;
        o[head[k]] = val;
      }
      if (!blank) out.push(o);
    }
    return out;
  }

  function load(name) {
    return fetch('data/' + name + '?v=' + BUST, { cache: 'no-cache' }).then(function (r) {
      if (!r.ok) throw new Error(name + ' → ' + r.status);
      return r.text();
    }).then(parseCSV);
  }

  function isYes(v) { return /^(y|yes|si|sí|true|1|x)$/i.test(String(v || '').trim()); }

  /* ---------- rendering ---------- */
  function cardHTML(p) {
    var photoCls = 'product-photo' + (p.photo_style === 'wood' ? ' finish-wood' : '') + (p.photo_style === 'full' ? ' photo-full' : '');
    var inner = '';
    if (p.badge_en) inner += '<span class="product-badge"' + dataAttrs(p.badge_en, p.badge_es) + '>' + esc(p.badge_en) + '</span>';
    if (isYes(p.out_of_stock)) inner += '<span class="product-oos" data-en="Out of stock" data-es="Agotado">Out of stock</span>';
    if (p.photo) {
      inner += '<img src="images/' + attr(p.photo) + '" alt="' + attr(p.name_en) + '" loading="lazy">';
    } else {
      photoCls += ' photo-pending';
      inner += '<span class="product-photo-note" data-en="Photo coming soon" data-es="Foto próximamente">Photo coming soon</span>';
    }
    var price = money(p.price);
    return '<div class="product-card"><div class="' + photoCls + '">' + inner + '</div><div class="product-info">' +
      '<span class="product-name"' + dataAttrs(p.name_en, p.name_es) + '>' + esc(p.name_en) + '</span>' +
      (p.spec_en ? '<span class="product-spec"' + dataAttrs(p.spec_en, p.spec_es) + '>' + esc(p.spec_en) + '</span>' : '') +
      (p.desc_en ? '<span class="product-desc"' + dataAttrs(p.desc_en, p.desc_es) + '>' + esc(p.desc_en) + '</span>' : '') +
      (price ? '<span class="product-price">' + esc(price) + '<sup> USD</sup></span>' : '') +
      '</div></div>';
  }

  function applyLang(scope) {
    var l = curLang();
    var els = scope.querySelectorAll('[data-en]');
    for (var i = 0; i < els.length; i++) {
      var v = els[i].getAttribute('data-' + l);
      if (v !== null) els[i].innerHTML = v;
    }
  }

  function reveal(scope) {
    var els = scope.querySelectorAll('.reveal, .reveal-stagger');
    if ('IntersectionObserver' in window) {
      var io = new IntersectionObserver(function (entries) {
        entries.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add('in'); io.unobserve(e.target); } });
      }, { threshold: .08, rootMargin: '0px 0px -60px 0px' });
      for (var i = 0; i < els.length; i++) io.observe(els[i]);
    } else {
      for (var j = 0; j < els.length; j++) els[j].classList.add('in');
    }
  }

  function failMessage() {
    return '<p style="padding:40px 0;text-align:center;color:var(--muted)">' +
      'We couldn’t load the catalog right now. Please call us at <a href="tel:+17867100750">' + PHONE + '</a>.</p>';
  }

  /* ---------- product pages ---------- */
  function buildCatalog(mount) {
    var page = mount.getAttribute('data-page');
    return Promise.all([load('sections.csv'), load('products.csv')]).then(function (res) {
      var secs = res[0].filter(function (s) { return s.page === page; });
      var prods = res[1].filter(function (p) { return p.page === page && !isYes(p.hide); });

      /* a product pointing at a section that is not listed gets its own heading, so it never disappears */
      prods.forEach(function (p) {
        if (p.name_en && !secs.some(function (s) { return s.id === p.section; })) {
          secs.push({ page: page, id: p.section || 'sec-other', title_en: p.section || 'More products', title_es: p.section || 'Más productos', chip_en: '', chip_es: '' });
        }
      });

      var html = '', chips = '';
      secs.forEach(function (s) {
        var list = prods.filter(function (p) { return p.section === s.id && p.name_en; });
        if (!list.length) return;
        html += '<div class="catalog-divider reveal" id="' + attr(s.id) + '"><span' + dataAttrs(s.title_en, s.title_es) + '>' + esc(s.title_en) + '</span></div>' +
                '<div class="product-grid reveal reveal-stagger">' + list.map(cardHTML).join('') + '</div>';
        if (s.chip_en) chips += '<a href="#' + attr(s.id) + '"' + dataAttrs(s.chip_en, s.chip_es) + '>' + esc(s.chip_en) + '</a>';
      });
      if (!html) throw new Error('no products for page ' + page);

      mount.innerHTML = html;
      mount.addEventListener('error', function (e) {          // a photo file that is missing → tidy placeholder instead of a broken icon
        var t = e.target;
        if (t && t.tagName === 'IMG' && t.parentNode) {
          t.parentNode.classList.add('photo-pending');
          var note = document.createElement('span');
          note.className = 'product-photo-note';
          note.setAttribute('data-en', 'Photo coming soon'); note.setAttribute('data-es', 'Foto próximamente');
          note.textContent = curLang() === 'es' ? 'Foto próximamente' : 'Photo coming soon';
          t.parentNode.replaceChild(note, t);
        }
      }, true);
      applyLang(mount);
      reveal(mount);

      var nav = document.getElementById('jumpChips');
      if (nav) { nav.innerHTML = chips; applyLang(nav); }

      if (location.hash.length > 1) {                          // arriving from a link like products-3.html#sec-mirrors
        var target = document.getElementById(decodeURIComponent(location.hash.slice(1)));
        if (target) setTimeout(function () { target.scrollIntoView(); }, 50);
      }
    }).catch(function (err) {
      if (window.console) console.error('Catalog error:', err);
      mount.innerHTML = failMessage();
    });
  }

  /* ---------- combo price tables ---------- */
  function buildCombos(bodies) {
    return load('combos.csv').then(function (rows) {
      for (var i = 0; i < bodies.length; i++) {
        var id = bodies[i].getAttribute('data-combo');
        var html = rows.filter(function (r) { return r.combo === id && r.size_en; }).map(function (r) {
          return '<tr><td' + dataAttrs(r.size_en, r.size_es) + '>' + esc(r.size_en) + '</td><td>' + esc(money(r.price)) + '</td></tr>';
        }).join('');
        bodies[i].innerHTML = html || '<tr><td colspan="2">Call ' + PHONE + ' for pricing</td></tr>';
        applyLang(bodies[i]);
      }
    }).catch(function (err) {
      if (window.console) console.error('Combo prices error:', err);
      for (var i = 0; i < bodies.length; i++) bodies[i].innerHTML = '<tr><td colspan="2">Call ' + PHONE + ' for pricing</td></tr>';
    });
  }

  function init() {
    var mount = document.getElementById('catalogMount');
    if (mount) buildCatalog(mount);
    var bodies = document.querySelectorAll('[data-combo]');
    if (bodies.length) buildCombos(bodies);
  }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
})();
