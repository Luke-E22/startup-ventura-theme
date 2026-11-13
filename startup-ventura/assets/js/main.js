/* Startup Ventura — main.js (vanilla, deferred, no dependencies). */
(function () {
	'use strict';

	var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
	var $ = function (s, c) { return (c || document).querySelector(s); };
	var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };

	/* ---------------------------------------------------------------------
	 * Candid Seal of Transparency — hide gracefully if the widget image is
	 * not available yet (e.g. the org has not published a seal level), so a
	 * 404 never renders a broken image. It appears automatically once live.
	 * ------------------------------------------------------------------- */
	$$('.candid-seal').forEach(function (seal) {
		var img = seal.querySelector('img');
		if (!img) { return; }
		var hide = function () { seal.style.display = 'none'; };
		if (img.complete && img.naturalWidth === 0) { hide(); }
		img.addEventListener('error', hide);
		img.addEventListener('load', function () { if (img.naturalWidth === 0) { hide(); } });
	});

	/* ---------------------------------------------------------------------
	 * 1. Sticky header scroll state.
	 * ------------------------------------------------------------------- */
	(function header() {
		var hdr = $('.site-header');
		if (!hdr) { return; }
		var bar = $('.status-bar');
		// rAF-throttled so the classList write happens once per frame instead of
		// on every scroll event (PSI flagged this handler for forced reflow).
		var ticking = false;
		var onScroll = function () {
			if (ticking) { return; }
			ticking = true;
			requestAnimationFrame(function () {
				var y = window.pageYOffset;
				hdr.classList.toggle('is-scrolled', y > 40);
				// The status bar above the header is in normal flow; keep the fixed
				// header pinned to its bottom edge until the bar has scrolled away.
				if (bar) { hdr.style.top = Math.max(0, bar.offsetHeight - y) + 'px'; }
				ticking = false;
			});
		};
		onScroll();
		window.addEventListener('scroll', onScroll, { passive: true });
	})();

	/* ---------------------------------------------------------------------
	 * 3. Desktop dropdowns — aria state + Escape to close.
	 * ------------------------------------------------------------------- */
	(function dropdowns() {
		$$('.primary-nav .menu-item-has-children, .primary-nav .has-dropdown').forEach(function (item) {
			var trigger = item.querySelector('a, .nav-toggle');
			var sub = item.querySelector('.sub-menu, .dropdown');
			if (!trigger || !sub) { return; }
			trigger.setAttribute('aria-haspopup', 'true');
			trigger.setAttribute('aria-expanded', 'false');
			function open(v) {
				item.classList.toggle('is-open', v);
				trigger.setAttribute('aria-expanded', v ? 'true' : 'false');
			}
			item.addEventListener('mouseenter', function () { open(true); });
			item.addEventListener('mouseleave', function () { open(false); });
			item.addEventListener('focusin', function () { open(true); });
			item.addEventListener('focusout', function (e) {
				if (!item.contains(e.relatedTarget)) { open(false); }
			});
			item.addEventListener('keydown', function (e) {
				if (e.key === 'Escape') { open(false); trigger.focus(); }
			});
		});
	})();

	/* ---------------------------------------------------------------------
	 * 4. Mobile menu — toggle, accordion, focus trap, Escape, scroll lock.
	 * ------------------------------------------------------------------- */
	(function mobileMenu() {
		var toggle = $('.menu-toggle');
		var menu = $('#sv-mobile-menu');
		if (!toggle || !menu) { return; }
		var closeBtn = $('.mobile-menu__close', menu);
		var lastFocus = null;

		// Inject caret toggles so parent links still navigate.
		$$('.menu-item-has-children, .has-dropdown', menu).forEach(function (item) {
			var sub = item.querySelector('.sub-menu, .dropdown');
			if (!sub) { return; }
			var caret = document.createElement('button');
			caret.type = 'button';
			caret.className = 'mobile-caret';
			caret.setAttribute('aria-label', 'Toggle submenu');
			caret.setAttribute('aria-expanded', 'false');
			caret.innerHTML = '<span aria-hidden="true">+</span>';
			var link = item.querySelector('a');
			if (link) { link.insertAdjacentElement('afterend', caret); }
			caret.addEventListener('click', function () {
				var open = item.classList.toggle('is-open');
				caret.setAttribute('aria-expanded', open ? 'true' : 'false');
				caret.querySelector('span').textContent = open ? '−' : '+';
			});
		});

		function focusables() {
			return $$('a[href], button:not([disabled])', menu).filter(function (el) { return el.offsetParent !== null; });
		}
		function open() {
			lastFocus = document.activeElement;
			menu.classList.add('is-open');
			toggle.setAttribute('aria-expanded', 'true');
			document.body.style.overflow = 'hidden';
			var f = focusables();
			if (f[0]) { f[0].focus(); }
			document.addEventListener('keydown', onKey);
		}
		function close() {
			menu.classList.remove('is-open');
			toggle.setAttribute('aria-expanded', 'false');
			document.body.style.overflow = '';
			document.removeEventListener('keydown', onKey);
			if (lastFocus) { lastFocus.focus(); }
		}
		function onKey(e) {
			if (e.key === 'Escape') { close(); return; }
			if (e.key !== 'Tab') { return; }
			var f = focusables();
			if (!f.length) { return; }
			var first = f[0], last = f[f.length - 1];
			if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
		}
		toggle.setAttribute('aria-expanded', 'false');
		toggle.addEventListener('click', function () {
			menu.classList.contains('is-open') ? close() : open();
		});
		if (closeBtn) { closeBtn.addEventListener('click', close); }
		$$('a', menu).forEach(function (a) { a.addEventListener('click', close); });
	})();

	/* ---------------------------------------------------------------------
	 * 5. Stat count-up (data-count, data-prefix, data-suffix).
	 * ------------------------------------------------------------------- */
	(function countUp() {
		var nums = $$('[data-count]');
		if (!nums.length) { return; }
		function run(el) {
			var target = parseFloat(el.getAttribute('data-count'));
			var prefix = el.getAttribute('data-prefix') || '';
			var suffix = el.getAttribute('data-suffix') || '';
			if (reduce || isNaN(target)) { el.innerHTML = prefix + target + suffix; return; }
			var dur = 1400, start = null;
			function frame(ts) {
				if (!start) { start = ts; }
				var p = Math.min((ts - start) / dur, 1);
				var eased = 1 - Math.pow(1 - p, 3);
				var val = Math.round(target * eased);
				el.innerHTML = prefix + val + (suffix ? '<span class="unit">' + suffix + '</span>' : '');
				if (p < 1) { requestAnimationFrame(frame); }
			}
			requestAnimationFrame(frame);
		}
		if (!('IntersectionObserver' in window)) { nums.forEach(run); return; }
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) { run(en.target); io.unobserve(en.target); }
			});
		}, { threshold: 0.4 });
		nums.forEach(function (el) { io.observe(el); });
	})();

	/* ---------------------------------------------------------------------
	 * 6. Scroll reveals + wave-divider stroke draw.
	 * ------------------------------------------------------------------- */
	(function reveals() {
		var els = $$('.reveal, .wave-divider');
		if (!els.length) { return; }
		if (reduce || !('IntersectionObserver' in window)) {
			els.forEach(function (el) { el.classList.add('is-in'); });
			return;
		}
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) { en.target.classList.add('is-in'); io.unobserve(en.target); }
			});
		}, { threshold: 0.15, rootMargin: '0px 0px -8% 0px' });
		els.forEach(function (el) { io.observe(el); });
	})();

	/* ---------------------------------------------------------------------
	 * 7. Give button — one slow shine the first time it enters view.
	 * ------------------------------------------------------------------- */
	(function giveShine() {
		var give = $('.btn--give');
		if (!give || reduce || !('IntersectionObserver' in window)) { return; }
		var io = new IntersectionObserver(function (entries) {
			entries.forEach(function (en) {
				if (en.isIntersecting) { en.target.classList.add('is-shine'); io.disconnect(); }
			});
		}, { threshold: 0.9 });
		io.observe(give);
	})();

	/* ---------------------------------------------------------------------
	 * 8. Measurement — dataLayer CTA pushes (harmless until GTM loads).
	 * ------------------------------------------------------------------- */
	(function measure() {
		window.dataLayer = window.dataLayer || [];
		$$('[data-cta]').forEach(function (el) {
			el.addEventListener('click', function () {
				// Both sinks: object push feeds GTM triggers, gtag feeds plain GA4.
				// (GTM cannot see gtag-style calls, GA4 ignores object pushes.)
				window.dataLayer.push({
					event: 'cta_click',
					cta_type: el.dataset.cta,
					cta_location: el.dataset.ctaLocation || ''
				});
				if (window.gtag) {
					window.gtag('event', 'cta_click', {
						cta_type: el.dataset.cta,
						cta_location: el.dataset.ctaLocation || ''
					});
				}
			});
		});
	})();

	/* ---------------------------------------------------------------------
	 * 9. Persist inbound UTM params; append to donation + apply links.
	 * ------------------------------------------------------------------- */
	(function utm() {
		var keys = ['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content'];
		var store = {};
		try { store = JSON.parse(sessionStorage.getItem('sv_utm') || '{}'); } catch (e) {}
		var params = new URLSearchParams(window.location.search);
		var changed = false;
		keys.forEach(function (k) {
			if (params.get(k)) { store[k] = params.get(k); changed = true; }
		});
		if (changed) { try { sessionStorage.setItem('sv_utm', JSON.stringify(store)); } catch (e) {} }
		var qs = Object.keys(store).map(function (k) {
			return encodeURIComponent(k) + '=' + encodeURIComponent(store[k]);
		}).join('&');
		if (!qs) { return; }
		function append(url) {
			if (!url || url.indexOf('[') === 0) { return url; }
			return url + (url.indexOf('?') > -1 ? '&' : '?') + qs;
		}
		$$('a[href]').forEach(function (a) {
			if (/zeffy\.com/.test(a.href) || a.dataset.cta === 'apply') { a.href = append(a.href); }
		});
	})();

	/* ---------------------------------------------------------------------
	 * 10. Board bios — compact cards open a native <dialog> popup instead of
	 * expanding inline (which turns a narrow card into a long bar). The wide
	 * About layout keeps its open inline bios. No-JS fallback: <details>
	 * expands inline as before.
	 * ------------------------------------------------------------------- */
	(function bioModal() {
		if (typeof HTMLDialogElement === 'undefined') { return; }
		var cards = $$('.board-grid:not(.board-grid--wide) .board-card');
		if (!cards.length) { return; }
		var dialog = null;

		function build() {
			dialog = document.createElement('dialog');
			dialog.className = 'bio-modal';
			dialog.setAttribute('aria-labelledby', 'bio-modal-name');
			dialog.innerHTML =
				'<div class="bio-modal__inner">' +
				'<button class="bio-modal__close" type="button" aria-label="Close bio">&times;</button>' +
				'<div class="bio-modal__head"><div class="bio-modal__media"></div>' +
				'<div><h3 class="bio-modal__name" id="bio-modal-name"></h3><p class="board-card__role"></p></div></div>' +
				'<p class="bio-modal__bio"></p><p class="board-card__links"></p></div>';
			document.body.appendChild(dialog);
			$('.bio-modal__close', dialog).addEventListener('click', function () { dialog.close(); });
			dialog.addEventListener('click', function (e) {
				if (e.target === dialog) { dialog.close(); } // backdrop
			});
			dialog.addEventListener('close', function () {
				document.body.style.overflow = '';
				if (dialog.svInvoker) { dialog.svInvoker.focus(); dialog.svInvoker = null; }
			});
		}

		function open(card, invoker) {
			if (!dialog) { build(); }
			var photo = $('.board-card__photo', card);
			var media = $('.bio-modal__media', dialog);
			media.innerHTML = '';
			if (photo) { media.appendChild(photo.cloneNode(false)); }
			media.style.display = photo ? '' : 'none';
			$('.bio-modal__name', dialog).textContent = ($('.board-card__name', card) || {}).textContent || '';
			$('.board-card__role', dialog).textContent = ($('.board-card__role', card) || {}).textContent || '';
			$('.bio-modal__bio', dialog).textContent = ($('.board-card__bio', card) || {}).textContent || '';
			var links = $('.board-card__links', card);
			$('.board-card__links', dialog).innerHTML = links ? links.innerHTML : '';
			dialog.svInvoker = invoker;
			dialog.showModal();
			document.body.style.overflow = 'hidden';
		}

		cards.forEach(function (card) {
			var details = $('.board-card__details', card);
			var summary = details && details.querySelector('summary');
			if (!summary) { return; }
			summary.addEventListener('click', function (e) {
				e.preventDefault(); // keep <details> closed; the dialog replaces it
				open(card, summary);
			});
		});
	})();

	/* ---------------------------------------------------------------------
	 * 11. Testimonials carousel — prev/next + dots over the scroll-snap row.
	 * No autoplay (motion + a11y); without JS the row is natively swipeable.
	 * ------------------------------------------------------------------- */
	(function testimonialCarousel() {
		$$('.testimonials').forEach(function (track) {
			var slides = $$('.testimonial', track);
			if (slides.length < 2) { return; }
			track.setAttribute('role', 'region');
			track.setAttribute('aria-roledescription', 'carousel');
			track.setAttribute('aria-label', 'Testimonials');
			track.setAttribute('tabindex', '0');

			var nav = document.createElement('div');
			nav.className = 'carousel-nav';
			var prev = document.createElement('button');
			prev.type = 'button'; prev.className = 'carousel-nav__btn';
			prev.setAttribute('aria-label', 'Previous testimonial');
			prev.innerHTML = '&larr;';
			var dots = document.createElement('div');
			dots.className = 'carousel-nav__dots';
			var next = document.createElement('button');
			next.type = 'button'; next.className = 'carousel-nav__btn';
			next.setAttribute('aria-label', 'Next testimonial');
			next.innerHTML = '&rarr;';
			nav.appendChild(prev); nav.appendChild(dots); nav.appendChild(next);
			track.insertAdjacentElement('afterend', nav);

			slides.forEach(function (s, i) {
				var d = document.createElement('button');
				d.type = 'button'; d.className = 'carousel-nav__dot';
				d.setAttribute('aria-label', 'Go to testimonial ' + (i + 1) + ' of ' + slides.length);
				d.addEventListener('click', function () { go(i); });
				dots.appendChild(d);
			});
			var dotEls = $$('.carousel-nav__dot', dots);

			function index() {
				// At the clamped ends the nearest-center math can stall one short,
				// so pin the first/last slide explicitly.
				if (track.scrollLeft <= 2) { return 0; }
				if (track.scrollLeft >= track.scrollWidth - track.clientWidth - 2) { return slides.length - 1; }
				var mid = track.scrollLeft + track.clientWidth / 2;
				var best = 0, bestDist = Infinity;
				slides.forEach(function (s, i) {
					var c = s.offsetLeft + s.offsetWidth / 2;
					var d = Math.abs(c - mid);
					if (d < bestDist) { bestDist = d; best = i; }
				});
				return best;
			}
			function paint() {
				var i = index();
				dotEls.forEach(function (d, j) { d.classList.toggle('is-active', j === i); });
			}
			function go(i) {
				i = Math.max(0, Math.min(slides.length - 1, i));
				var s = slides[i];
				track.scrollTo({ left: s.offsetLeft - (track.clientWidth - s.offsetWidth) / 2, behavior: reduce ? 'auto' : 'smooth' });
			}
			prev.addEventListener('click', function () { go(index() - 1); });
			next.addEventListener('click', function () { go(index() + 1); });
			track.addEventListener('keydown', function (e) {
				if (e.key === 'ArrowLeft') { e.preventDefault(); go(index() - 1); }
				if (e.key === 'ArrowRight') { e.preventDefault(); go(index() + 1); }
			});
			var t = null;
			track.addEventListener('scroll', function () { clearTimeout(t); t = setTimeout(paint, 80); }, { passive: true });
			paint();
		});
	})();

	/* ---------------------------------------------------------------------
	 * 12. Forms — AJAX submit to admin-ajax, aria-live status, disable on send.
	 * ------------------------------------------------------------------- */
	(function forms() {
		if (typeof window.SV_FORMS === 'undefined') { return; }
		$$('form[data-sv-form]').forEach(function (form) {
			var status = $('.form__status', form);
			var btn = form.querySelector('button[type="submit"], button:not([type])');
			form.addEventListener('submit', function (e) {
				e.preventDefault();
				$$('.is-err', form).forEach(function (f) { f.classList.remove('is-err'); });
				if (status) { status.className = 'form__status'; status.textContent = ''; }
				if (btn) { btn.disabled = true; }
				var data = new FormData(form);
				if (!data.get('nonce') && SV_FORMS.nonce) { data.set('nonce', SV_FORMS.nonce); }
				fetch(SV_FORMS.ajax, { method: 'POST', body: data, credentials: 'same-origin' })
					.then(function (r) { return r.json().catch(function () { return { success: false, data: {} }; }); })
					.then(function (res) {
						if (res && res.success) {
							if (status) { status.className = 'form__status is-ok'; status.textContent = (res.data && res.data.message) || 'Thanks — we\'ll be in touch.'; }
							form.reset();
							if (window.turnstile) { try { window.turnstile.reset(); } catch (e) {} }
						} else {
							var d = (res && res.data) || {};
							if (status) { status.className = 'form__status is-err'; status.textContent = d.message || 'Something went wrong. Please try again.'; }
							(d.fields || []).forEach(function (name) {
								var el = form.querySelector('[name="' + name + '"]');
								if (el) { el.classList.add('is-err'); }
							});
						}
					})
					.catch(function () {
						if (status) { status.className = 'form__status is-err'; status.textContent = 'Network error. Please try again.'; }
					})
					.then(function () { if (btn) { btn.disabled = false; } });
			});
		});
	})();

	/* ---------------------------------------------------------------------
	 * 13. "Get involved" modal — opens only from a [data-gi-open] trigger
	 *     (the hero button), never on page load. gen.mjs ships the markup
	 *     only on pages that carry a trigger.
	 * ------------------------------------------------------------------- */
	(function getInvolved() {
		var modal = document.getElementById('sv-gi-modal');
		var triggers = $$('[data-gi-open]');
		if (!modal || !triggers.length) { return; }
		var closeBtn = modal.querySelector('.gi-modal__close');
		var lastFocus = null;

		function trackGetInvolved(option) {
			window.dataLayer = window.dataLayer || [];
			window.dataLayer.push({ event: 'get_involved', option: option });
			if (window.gtag) { window.gtag('event', 'get_involved', { option: option }); }
		}
		function close() {
			modal.classList.remove('is-open');
			modal.hidden = true;
			document.body.style.overflow = '';
			document.removeEventListener('keydown', onKey);
			if (lastFocus && lastFocus.focus) { try { lastFocus.focus(); } catch (e) {} }
		}
		function onKey(e) {
			if (e.key === 'Escape') { close(); return; }
			if (e.key !== 'Tab') { return; }
			var f = $$('a.gi-card, button', modal);
			var first = f[0], last = f[f.length - 1];
			// Focus parked outside the trap (a click on the card's padding blurs to
			// <body>) would otherwise Tab into the page behind the backdrop.
			if (!modal.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
			else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
			else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
		}
		function open() {
			lastFocus = document.activeElement;
			trackGetInvolved('open');
			modal.hidden = false;
			document.body.style.overflow = 'hidden';
			document.addEventListener('keydown', onKey);
			requestAnimationFrame(function () { requestAnimationFrame(function () { modal.classList.add('is-open'); }); });
			var firstCard = modal.querySelector('a.gi-card');
			if (firstCard) { firstCard.focus(); }
		}
		// Close on backdrop click only when the press also started there, so a
		// text-selection drag that ends on the backdrop does not dismiss.
		var downOnBackdrop = false;
		modal.addEventListener('mousedown', function (e) { downOnBackdrop = e.target === modal; });
		modal.addEventListener('click', function (e) { if (e.target === modal && downOnBackdrop) { close(); } });
		closeBtn.addEventListener('click', close);
		$$('a.gi-card', modal).forEach(function (a) {
			var pick = function () { trackGetInvolved(a.dataset.gi || ''); };
			a.addEventListener('click', pick);
			a.addEventListener('auxclick', function (e) { if (e.button === 1) { pick(); } });
		});
		// A card click navigates without closing; if bfcache restores this page
		// via Back, close the stale open modal instead of showing it scroll-locked.
		window.addEventListener('pageshow', function (e) { if (e.persisted && !modal.hidden) { close(); } });
		triggers.forEach(function (t) {
			t.addEventListener('click', function (e) { e.preventDefault(); open(); });
		});
	})();

	/* ---------------------------------------------------------------------
	 * 14. Ecosystem guide — category filter. Pills are plain #anchors (work
	 *     with no JS); with JS a pill also hides the other categories, and a
	 *     deep link like /ecosystem#capital opens pre-filtered.
	 * ------------------------------------------------------------------- */
	(function ecosystemFilter() {
		var wrap = document.getElementById('eco-directory');
		if (!wrap) { return; }
		var pills = $$('.eco-pill', wrap);
		var cats = $$('.eco-cat', wrap);
		function apply(key) {
			cats.forEach(function (s) { s.hidden = key !== 'all' && s.id !== key; });
			pills.forEach(function (p) {
				p.classList.toggle('is-active', p.dataset.cat === key);
				p.setAttribute('aria-pressed', p.dataset.cat === key ? 'true' : 'false');
			});
		}
		pills.forEach(function (p) {
			p.addEventListener('click', function () { apply(p.dataset.cat); });
		});
		var h = location.hash.replace('#', '');
		if (cats.some(function (s) { return s.id === h; })) { apply(h); }
	})();

})();

/* §15 News archive filter (news.html): All / Announcements / Press and media.
   Progressive: without JS every card shows. */
(function () {
	var bar = document.querySelector('.news-filter');
	if (!bar) return;
	var btns = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));
	var cards = Array.prototype.slice.call(document.querySelectorAll('.post-grid--news .post-card[data-kind]'));
	function apply(key) {
		btns.forEach(function (b) {
			var on = b.getAttribute('data-filter') === key;
			b.classList.toggle('is-active', on);
			b.setAttribute('aria-pressed', on ? 'true' : 'false');
		});
		cards.forEach(function (c) {
			c.classList.toggle('is-hidden', key !== 'all' && c.getAttribute('data-kind') !== key);
		});
	}
	btns.forEach(function (b) {
		b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
	});
})();

/* §16 Mentor wall filter (mentors.html): All / Board / Advisors / Mentors / Speakers.
   Progressive: without JS every card shows. */
(function () {
	var bar = document.querySelector('.mentor-filter');
	if (!bar) return;
	var btns = Array.prototype.slice.call(bar.querySelectorAll('[data-filter]'));
	var cards = Array.prototype.slice.call(document.querySelectorAll('.mentor-grid .mentor-card[data-role]'));
	function apply(key) {
		btns.forEach(function (b) {
			var on = b.getAttribute('data-filter') === key;
			b.classList.toggle('is-active', on);
			b.setAttribute('aria-pressed', on ? 'true' : 'false');
		});
		cards.forEach(function (c) {
			c.classList.toggle('is-hidden', key !== 'all' && c.getAttribute('data-role') !== key);
		});
	}
	btns.forEach(function (b) {
		b.addEventListener('click', function () { apply(b.getAttribute('data-filter')); });
	});
})();

/* ---------------------------------------------------------------------
 * 17. Old "get notified" links. contact.html#notify held the founder list until
 * 2026-10-27; links to it in past emails and posts now land on the first-access
 * form on the Apply page instead of the top of the contact form.
 * ------------------------------------------------------------------- */
(function notifyRedirect() {
	if (location.hash !== '#notify' || !/\/contact(\.html)?$/.test(location.pathname)) { return; }
	location.replace('apply.html#first-access');
})();

/* ---------------------------------------------------------------------
 * 18. Annual Benefit 2026: the Zeffy RSVP modal and the site-wide pop-up.
 *
 * RSVP buttons carry Zeffy's linked-button markup (href = campaign page,
 * zeffy-form-link = modal form). Zeffy's own embed-form-script.min.js is not
 * loaded: it creates its iframe on every page load, which pulls Zeffy's whole
 * app (and its third parties) onto every page, and its click handler does not
 * stop the link, so the page also navigates away. This opens the same modal
 * form the same way (same iframe URL, same open and close messages) but only
 * when someone clicks, then moves focus into it and keeps the page behind it
 * inert. With JavaScript off, or once data-benefit-until has passed, the
 * button is a plain link to the campaign page.
 *
 * The pop-up (markup from gen.mjs, absent on the event page) opens about five
 * seconds after load, at most once per 14 days per browser, never after the
 * event, and never on top of another dialog, the mobile menu or a field
 * someone is typing in.
 * ------------------------------------------------------------------- */
(function benefit() {
	var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
	// Event page: Zeffy's inline embed adds its iframe without a title, so screen
	// readers announce an unnamed frame. Name it as soon as it appears.
	var embed = document.querySelector('[data-zeffy-embed]');
	if (embed && window.MutationObserver) {
		var nameFrames = function () {
			$$('iframe:not([title])', embed).forEach(function (f) { f.title = 'RSVP form, powered and secured by Zeffy'; });
		};
		nameFrames();
		new MutationObserver(nameFrames).observe(embed, { childList: true, subtree: true });
	}

	var links = $$('a[zeffy-form-link]');
	var pop = document.getElementById('sv-benefit-pop');
	if (!links.length && !pop) { return; }

	var X_ICON = '<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" aria-hidden="true"><path d="M6 6l12 12M18 6L6 18"/></svg>';
	function track(name, params) {
		window.dataLayer = window.dataLayer || [];
		var o = { event: name };
		for (var k in params) { if (Object.prototype.hasOwnProperty.call(params, k)) { o[k] = params[k]; } }
		window.dataLayer.push(o);
		if (window.gtag) { window.gtag('event', name, params); }
	}
	function live(el) { var u = +el.getAttribute('data-benefit-until'); return !u || Date.now() < u; }
	function show(el) { requestAnimationFrame(function () { requestAnimationFrame(function () { el.classList.add('is-open'); }); }); }
	function refocus(el) { if (el && el.focus && document.contains(el)) { try { el.focus(); } catch (e) {} } }

	/* --- a. Zeffy modal ------------------------------------------------ */
	var zModal = null, zFrame = null, zLastFocus = null, zInert = [];
	function zPost() { try { zFrame.contentWindow.postMessage({ id: 'zeffy-iframe', open: true }, '*'); } catch (e) {} }
	function zKey(e) { if (e.key === 'Escape') { zClose(); } }
	function zBuild(src, title) {
		zModal = document.createElement('div');
		zModal.className = 'zeffy-modal';
		zModal.hidden = true;
		zModal.setAttribute('role', 'dialog');
		zModal.setAttribute('aria-modal', 'true');
		zModal.setAttribute('aria-labelledby', 'sv-zeffy-title');
		zModal.innerHTML = '<div class="zeffy-modal__box"><div class="zeffy-modal__bar"><p class="zeffy-modal__title" id="sv-zeffy-title"></p><button class="zeffy-modal__close" type="button" aria-label="Close">' + X_ICON + '</button></div><div class="zeffy-modal__stage"><p class="zeffy-modal__loading">Loading the RSVP form</p></div></div>';
		zModal.querySelector('.zeffy-modal__title').textContent = title || 'RSVP';
		zFrame = document.createElement('iframe');
		zFrame.className = 'zeffy-modal__frame';
		zFrame.title = 'RSVP form, powered and secured by Zeffy';
		zFrame.setAttribute('allow', 'payment');
		zFrame.src = src + (src.indexOf('?') < 0 ? '?' : '&') + 'cachebust=' + Date.now();
		zFrame.addEventListener('load', zPost);
		zModal.querySelector('.zeffy-modal__stage').appendChild(zFrame);
		document.body.appendChild(zModal);
		zModal.querySelector('.zeffy-modal__close').addEventListener('click', zClose);
		var down = false;
		zModal.addEventListener('mousedown', function (e) { down = e.target === zModal; });
		zModal.addEventListener('click', function (e) { if (e.target === zModal && down) { zClose(); } });
		// Zeffy's form asks to be closed with the same message its own script listens for.
		window.addEventListener('message', function (e) {
			if (zModal.hidden || e.source !== zFrame.contentWindow) { return; }
			if (e.data && e.data.id === 'zeffy-iframe' && e.data.close) { zClose(); }
		});
	}
	function zOpen(src, title, returnTo) {
		if (!zModal) { zBuild(src, title); }
		zLastFocus = returnTo || document.activeElement;
		zModal.hidden = false;
		document.body.style.overflow = 'hidden';
		// Everything behind the dialog is inert, so Tab stays in the form and the close button.
		zInert = $$('body > *').filter(function (el) { return el !== zModal && !el.inert && el.tagName !== 'SCRIPT'; });
		zInert.forEach(function (el) { el.inert = true; });
		show(zModal);
		document.addEventListener('keydown', zKey);
		try { zFrame.focus(); } catch (e) {}
		zPost();
	}
	function zClose() {
		if (!zModal || zModal.hidden) { return; }
		zModal.classList.remove('is-open');
		zModal.hidden = true;
		document.body.style.overflow = '';
		zInert.forEach(function (el) { el.inert = false; });
		zInert = [];
		document.removeEventListener('keydown', zKey);
		refocus(zLastFocus);
	}

	/* --- b. Pop-up ----------------------------------------------------- */
	var KEY = 'sv_benefit_pop_dismissed', QUIET_MS = 14 * 864e5, DELAY_MS = 5000;
	var popLastFocus = null, store = null;
	function popKey(e) {
		if (e.key === 'Escape') { popClose('esc'); return; }
		if (e.key !== 'Tab') { return; }
		var f = $$('a[href], button', pop);
		var first = f[0], last = f[f.length - 1];
		if (!pop.contains(document.activeElement)) { e.preventDefault(); first.focus(); }
		else if (e.shiftKey && document.activeElement === first) { e.preventDefault(); last.focus(); }
		else if (!e.shiftKey && document.activeElement === last) { e.preventDefault(); first.focus(); }
	}
	function popOpen() {
		popLastFocus = document.activeElement;
		// The photo is fetched only now, so pages where the pop-up never opens never load it.
		var img = pop.querySelector('img[data-src]');
		if (img) {
			img.srcset = img.getAttribute('data-srcset') || '';
			img.src = img.getAttribute('data-src');
			img.removeAttribute('data-src');
		}
		pop.hidden = false;
		document.body.style.overflow = 'hidden';
		show(pop);
		document.addEventListener('keydown', popKey);
		pop.querySelector('.benefit-pop__close').focus();
		track('benefit_popup', { action: 'view' });
	}
	// Every way out counts as a dismissal and starts the 14 quiet days.
	function popClose(how, restore) {
		if (pop.hidden) { return; }
		try { store.setItem(KEY, String(Date.now())); } catch (e) {}
		pop.classList.remove('is-open');
		pop.hidden = true;
		document.body.style.overflow = '';
		document.removeEventListener('keydown', popKey);
		if (restore !== false) { refocus(popLastFocus); }
		track('benefit_popup', { action: how });
	}
	if (pop) {
		var until = +pop.getAttribute('data-benefit-until') || 0;
		var seen = 0;
		// No working localStorage means the dismissal could not be remembered, so stay quiet.
		try { localStorage.setItem(KEY + '_probe', '1'); localStorage.removeItem(KEY + '_probe'); store = localStorage; seen = +store.getItem(KEY) || 0; } catch (e) { store = null; }
		var tries = 0;
		var busy = function () {
			var a = document.activeElement;
			return document.hidden || document.body.style.overflow === 'hidden' ||
				(a && (/^(INPUT|TEXTAREA|SELECT|IFRAME)$/.test(a.tagName) || a.isContentEditable));
		};
		var tryOpen = function () {
			if (Date.now() >= until) { return; }
			if (busy()) { if (++tries < 40) { setTimeout(tryOpen, 3000); } return; }
			popOpen();
		};
		if (store && Date.now() < until && !(seen && Date.now() - seen < QUIET_MS)) { setTimeout(tryOpen, DELAY_MS); }
		$$('[data-benefit-pop-close]', pop).forEach(function (b) {
			b.addEventListener('click', function () { popClose(b.getAttribute('data-benefit-pop-close')); });
		});
		var downOnBackdrop = false;
		pop.addEventListener('mousedown', function (e) { downOnBackdrop = e.target === pop; });
		pop.addEventListener('click', function (e) { if (e.target === pop && downOnBackdrop) { popClose('backdrop'); } });
	}

	/* --- c. RSVP buttons ------------------------------------------------ */
	links.forEach(function (a) {
		a.addEventListener('click', function (e) {
			if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) { return; }
			if (!live(a)) { return; }
			e.preventDefault();
			var returnTo = a;
			// From the pop-up: close it first (a dismissal), so the two never stack.
			if (pop && pop.contains(a)) { returnTo = popLastFocus; popClose('rsvp', false); }
			try { zOpen(a.getAttribute('zeffy-form-link'), a.getAttribute('data-zeffy-title'), returnTo); }
			catch (err) { window.location.href = a.href; }
		});
	});
})();

/* ---------------------------------------------------------------------
 * 19. Home hero carousel.
 *
 * gen.mjs builds the hero with one slide per tab when there are two or
 * more, and marks it data-hero-slides. A slide is a background (.hero-bg)
 * and a panel of copy; changing slides moves both sideways together, the
 * old one out and the new one in. Only transforms are animated.
 *
 * Controls: the labelled tab list (arrow keys, Home and End, one tab
 * stop), previous and next arrows on wide screens, a swipe on touch, and
 * a pause button.
 *
 * Later slides' photos load after the page has loaded. A slide never
 * shows before its photo has decoded: a click waits for it, the automatic
 * advance skips it. Those photos are drawn on a <canvas>, not shown as
 * <img>: an image that first appears seconds after load can be taken by
 * the browser as the page's largest contentful paint, and a canvas cannot.
 *
 * It advances by itself every few seconds and loops. It holds while the
 * pointer is over the copy or the controls, while keyboard focus is in
 * the hero, while the hero is scrolled away, while the browser tab is
 * hidden and while a dialog is open (dialogs are detected the way section
 * 18 does it, by the scroll lock they put on <body>). Choosing a slide,
 * or the pause button, stops it until the button is pressed again.
 *
 * With prefers-reduced-motion nothing moves by itself and slides change
 * at once. A slide with data-benefit-until is removed once that time has
 * passed; with one slide left the hero goes back to the plain hero.
 * ------------------------------------------------------------------- */
(function heroCarousel() {
	var hero = document.querySelector('[data-hero-slides]');
	if (!hero || !window.Promise) { return; }
	var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
	var nav = hero.querySelector('.hero-nav');
	var list = hero.querySelector('.hero-tabs');
	var status = hero.querySelector('[data-hero-status]');
	var pauseBtn = hero.querySelector('[data-hero-pause]');
	var arrows = $$('[data-hero-step]', hero);
	if (!nav || !list) { return; }

	var SLIDE_MS = 700, EASE = 'cubic-bezier(.65,0,.35,1)', AUTO_MS = 7000;
	var motionQuery = window.matchMedia ? window.matchMedia('(prefers-reduced-motion: reduce)') : null;

	var slides = $$('[role="tab"]', list).map(function (btn) {
		var key = btn.getAttribute('data-hero-key');
		var img = hero.querySelector('img[data-hero-photo="' + key + '"][data-src]');
		return {
			key: key, btn: btn, img: img,
			panel: document.getElementById('hero-panel-' + key),
			bg: hero.querySelector('[data-hero-bg="' + key + '"]'),
			until: +btn.getAttribute('data-benefit-until') || 0,
			card: !!img && img.getAttribute('data-hero-fit') === 'card',   // a picture beside the copy, not the backdrop
			ready: null,      // promise, once the photo has been asked for
			done: !img,       // photo decoded (or there is none to wait for)
			noPhoto: false    // the photo failed to load: the copy still shows
		};
	}).filter(function (s) { return s.panel && s.bg; });

	var cur = 0, want = 0;                 // slide on screen, slide asked for
	var wantHow = '', wantDir = 1;         // 'click' | 'arrow' | 'keyboard' | 'swipe' | 'auto'; 1 = forward
	var phase = 'idle';                    // idle | slide
	var gen = 0, anims = [], dead = false;
	var auto = { on: false, timer: 0, hover: false, focus: false, away: false };
	var lockWatch = null, scrollWatch = null, statusTimer = 0;

	function still() { return !!(motionQuery && motionQuery.matches) || !hero.animate; }
	function locked() { return document.body.style.overflow === 'hidden'; }
	function track(name, params) {
		window.dataLayer = window.dataLayer || [];
		var o = { event: name };
		for (var k in params) { if (Object.prototype.hasOwnProperty.call(params, k)) { o[k] = params[k]; } }
		window.dataLayer.push(o);
		if (window.gtag) { window.gtag('event', name, params); }
	}

	/* --- photos ---------------------------------------------------------- */
	function paint(s) {
		var img = s.img, c = document.createElement('canvas');
		if (s.noPhoto || !c.getContext) {
			s.noPhoto = true;
			if (s.card) { img.parentNode.hidden = true; }
			return;
		}
		c.className = s.card ? 'hero-news__img' : 'hero-bg-img';
		c.setAttribute('aria-hidden', 'true');
		c.width = img.naturalWidth;
		c.height = img.naturalHeight;
		c.getContext('2d').drawImage(img, 0, 0);
		img.parentNode.insertBefore(c, img);
	}
	function load(s) {
		if (s.ready) { return s.ready; }
		if (!s.img) { s.done = true; s.ready = Promise.resolve(); return s.ready; }
		var img = s.img;
		// The smallest file that still fills its box (what srcset with sizes would choose).
		var need = (s.card ? 440 : window.innerWidth) * (window.devicePixelRatio || 1), src = '', srcW = Infinity, big = '', bigW = 0;
		(img.getAttribute('data-srcset') || '').split(',').forEach(function (c) {
			var m = c.trim().match(/^(\S+)\s+(\d+)w$/);
			if (!m) { return; }
			if (+m[2] >= need && +m[2] < srcW) { srcW = +m[2]; src = m[1]; }
			if (+m[2] > bigW) { bigW = +m[2]; big = m[1]; }
		});
		s.ready = new Promise(function (resolve) {
			var settle = function () {
				s.noPhoto = !(img.complete && img.naturalWidth > 0);
				try { paint(s); } catch (e) { s.noPhoto = true; }
				s.done = true;
				resolve();
			};
			img.src = src || big || img.getAttribute('data-src');
			if (img.decode) { img.decode().then(settle, settle); }
			else { img.addEventListener('load', settle); img.addEventListener('error', settle); }
		});
		return s.ready;
	}

	/* --- what is on screen ----------------------------------------------- */
	function select(i) {
		slides.forEach(function (s, k) {
			s.btn.setAttribute('aria-selected', k === i ? 'true' : 'false');
			if (k === i) { s.btn.removeAttribute('tabindex'); } else { s.btn.setAttribute('tabindex', '-1'); }
		});
	}
	// Narrow screens: the shade over the brighter photos is full strength from the copy down
	// (.hero-shade in main.css), so each of those slides needs to know where its copy starts.
	function placeShade() {
		var top = hero.getBoundingClientRect().top;
		slides.forEach(function (s) {
			if (!s.bg.querySelector('.hero-shade')) { return; }
			var r = s.panel.getBoundingClientRect();
			// A panel in mid-slide is off to one side but at its usual height, which is all this needs.
			s.bg.style.setProperty('--hero-copy-top', Math.round(r.top - top) + 'px');
		});
	}
	// Makes slide i the one on screen.
	function show(i, quiet) {
		var from = cur;
		slides.forEach(function (s, k) {
			s.panel.classList.toggle('is-active', k === i);
			s.bg.classList.toggle('is-active', k === i);
		});
		hero.setAttribute('data-hero-slide', slides[i].key);
		cur = i;
		if (from === i || quiet || wantHow === 'auto') { return; }
		// Chosen changes are counted and announced politely; automatic ones are neither.
		track('hero_slide', { hero_slide: slides[i].key, hero_slide_from: slides[from].key, hero_slide_method: wantHow });
		if (status) {
			var h = slides[i].panel.querySelector('h1, h2');
			status.textContent = slides[i].btn.textContent + (h ? ': ' + h.textContent.replace(/\s+/g, ' ') : '');
			clearTimeout(statusTimer);
			statusTimer = setTimeout(function () { status.textContent = ''; }, 4000);
		}
	}
	// Back to rest: no animations, the panel on screen usable, the rest inert.
	function rest() {
		anims.forEach(function (a) { try { a.cancel(); } catch (e) {} });
		anims = [];
		phase = 'idle';
		slides.forEach(function (s, k) {
			s.panel.classList.remove('is-moving');
			s.bg.classList.remove('is-moving');
			if (k === cur) { s.panel.removeAttribute('inert'); } else { s.panel.setAttribute('inert', ''); }
		});
	}
	function finish() {
		rest();
		if (want !== cur) { pump(); } else { autoTick(); }
	}
	// Jump straight to the end state (a dialog opened, the browser tab was hidden, the hero was resized).
	function settle() {
		if (phase === 'idle') { return; }
		gen++;
		if (want !== cur) {
			if (slides[want].done) { show(want); } else { want = cur; select(cur); }
		}
		rest();
	}

	/* --- the change ------------------------------------------------------ */
	function slideTo(i) {
		var g = ++gen, from = slides[cur], to = slides[i];
		var x = wantDir * hero.offsetWidth;
		// Focus inside the panel that is leaving moves to the tab that was asked for.
		var a = document.activeElement;
		if (a && from.panel.contains(a)) { try { to.btn.focus(); } catch (e) {} }
		phase = 'slide';
		[from, to].forEach(function (s) { s.panel.classList.add('is-moving'); s.bg.classList.add('is-moving'); });
		from.panel.setAttribute('inert', '');
		var out = [{ transform: 'translate3d(0,0,0)' }, { transform: 'translate3d(' + (-x) + 'px,0,0)' }];
		var into = [{ transform: 'translate3d(' + x + 'px,0,0)' }, { transform: 'translate3d(0,0,0)' }];
		var opts = { duration: SLIDE_MS, easing: EASE, fill: 'both' };
		anims = [from.bg.animate(out, opts), from.panel.animate(out, opts), to.bg.animate(into, opts), to.panel.animate(into, opts)];
		show(i);
		Promise.all(anims.map(function (an) { return an.finished; })).then(function () { if (g === gen) { finish(); } }, function () {});
	}
	// Moves toward the slide that was asked for, once its photo is ready.
	function pump() {
		if (dead || want === cur || phase !== 'idle') { return; }
		var s = slides[want], w = want;
		if (!s.done) {
			s.btn.setAttribute('aria-busy', 'true');
			load(s).then(function () {
				s.btn.removeAttribute('aria-busy');
				if (!dead && want === w && slides[w] === s) { pump(); }
			});
			return;
		}
		if (still()) { show(want); finish(); } else { slideTo(want); }
	}
	// dir: 1 comes in from the right, -1 from the left. Left out, it follows the tab order.
	function go(s, how, dir) {
		if (dead || prune()) { return; }
		var i = slides.indexOf(s);
		if (i < 0) { return; }
		if (how !== 'auto') { autoStop(); }
		if (locked() || i === want) { return; }
		wantDir = dir || (i > want ? 1 : -1);
		want = i;
		wantHow = how;
		select(i);
		pump();
	}
	function step(d, how) {
		var n = slides.length;
		go(slides[(want + d + n) % n], how, d);
	}

	/* --- advancing by itself --------------------------------------------- */
	function held() { return document.hidden || locked() || auto.hover || auto.focus || auto.away || phase !== 'idle'; }
	// (Re)starts the wait for the next automatic change, or drops it while something holds the carousel.
	function autoTick() {
		clearTimeout(auto.timer);
		auto.timer = 0;
		if (!auto.on || dead || held()) { return; }
		auto.timer = setTimeout(autoFire, AUTO_MS);
	}
	function autoFire() {
		auto.timer = 0;
		if (!auto.on || dead || held() || prune()) { return; }
		// The next slide whose picture is in; one whose backdrop never loaded is passed over.
		var n = slides.length, k, s;
		for (k = 1; k < n; k++) {
			s = slides[(cur + k) % n];
			if (s.done && (!s.noPhoto || s.card)) { go(s, 'auto', 1); return; }
		}
		autoTick();
	}
	function paintPause() {
		if (!pauseBtn) { return; }
		pauseBtn.classList.toggle('is-paused', !auto.on);
		pauseBtn.setAttribute('aria-label', auto.on ? 'Pause the slides' : 'Play the slides');
	}
	function autoStart() { auto.on = true; paintPause(); autoTick(); }
	function autoStop() { auto.on = false; clearTimeout(auto.timer); auto.timer = 0; paintPause(); }

	/* --- slides that end (the Annual Benefit) ----------------------------- */
	function teardown() {
		dead = true;
		autoStop();
		rest();
		[nav, status].concat(arrows).forEach(function (el) { if (el && el.parentNode) { el.parentNode.removeChild(el); } });
		hero.classList.remove('hero--slides');
		hero.removeAttribute('data-hero-slides');
		hero.removeAttribute('data-hero-slide');
		hero.removeAttribute('aria-roledescription');
		hero.removeAttribute('aria-label');
		var p = slides[0].panel;
		p.removeAttribute('role');
		p.removeAttribute('aria-labelledby');
		if (lockWatch) { lockWatch.disconnect(); }
		if (scrollWatch) { scrollWatch.disconnect(); }
	}
	// Removes slides whose time has passed. True when the hero is back to the plain hero.
	function prune() {
		if (dead) { return true; }
		var gone = slides.filter(function (s) { return (s.until && Date.now() >= s.until) || !document.contains(s.btn); });
		if (!gone.length) { return false; }
		if (locked()) { return false; }   // a dialog is open (it may be this slide's own RSVP form): wait for it to close
		settle();
		var a = document.activeElement;
		var hadFocus = gone.some(function (s) { return s.btn === a || s.panel.contains(a); });
		var keep = slides.filter(function (s) { return gone.indexOf(s) < 0; });
		if (!keep.length) { return false; }
		// The slide on screen stays if it can; otherwise the first one left takes over.
		var next = gone.indexOf(slides[cur]) > -1 ? keep[0] : slides[cur];
		want = slides.indexOf(next);
		show(want, true);
		gone.forEach(function (s) {
			[s.btn, s.panel, s.bg].forEach(function (el) { if (el && el.parentNode) { el.parentNode.removeChild(el); } });
		});
		slides = keep;
		cur = want = slides.indexOf(next);
		select(cur);
		rest();
		load(next);
		if (slides.length < 2) { teardown(); return true; }
		placeShade();
		if (hadFocus) { try { slides[cur].btn.focus(); } catch (e) {} }
		return false;
	}

	/* --- start ------------------------------------------------------------ */
	// The slide the page was built with (or the one the inline script promoted) is the one on screen.
	slides.forEach(function (s, k) { if (s.panel.classList.contains('is-active')) { cur = want = k; } });
	if (prune()) { return; }
	if (slides.length < 2) { teardown(); return; }
	slides.forEach(function (s, k) {
		s.panel.setAttribute('role', 'tabpanel');
		s.panel.setAttribute('aria-labelledby', s.btn.id);
		if (k !== cur) { s.panel.setAttribute('inert', ''); }
		s.btn.addEventListener('click', function (e) { go(s, e.detail === 0 ? 'keyboard' : 'click'); });
		if (s.until && s.until - Date.now() < 2147483647) { setTimeout(prune, s.until - Date.now() + 50); }
	});
	hero.setAttribute('data-hero-slide', slides[cur].key);
	select(cur);
	placeShade();
	nav.hidden = false;
	arrows.forEach(function (b) {
		b.hidden = false;
		b.addEventListener('click', function (e) { step(+b.getAttribute('data-hero-step'), e.detail === 0 ? 'keyboard' : 'arrow'); });
	});
	if (pauseBtn) {
		pauseBtn.addEventListener('click', function () {
			if (auto.on) { autoStop(); } else { autoStart(); }
			track('hero_slide_autoplay', { hero_autoplay: auto.on ? 'on' : 'off' });
		});
	}

	list.addEventListener('keydown', function (e) {
		var i = slides.map(function (s) { return s.btn; }).indexOf(document.activeElement);
		var n = slides.length, to = -1;
		if (i < 0) { return; }
		if (e.key === 'ArrowRight') { to = (i + 1) % n; }
		else if (e.key === 'ArrowLeft') { to = (i - 1 + n) % n; }
		else if (e.key === 'Home') { to = 0; }
		else if (e.key === 'End') { to = n - 1; }
		if (to < 0) { return; }
		e.preventDefault();
		slides[to].btn.focus();
		go(slides[to], 'keyboard', e.key === 'ArrowRight' ? 1 : e.key === 'ArrowLeft' ? -1 : 0);
	});

	// Swipe left or right on touch. Vertical scrolling is left to the browser (touch-action in main.css).
	var swipe = null;
	hero.addEventListener('pointerdown', function (e) {
		swipe = null;
		if (e.pointerType !== 'touch' || !e.isPrimary) { return; }
		if (e.clientX < 24 || e.clientX > window.innerWidth - 24) { return; }   // leave the edge to the browser's back gesture
		swipe = { x: e.clientX, y: e.clientY, at: e.timeStamp, id: e.pointerId };
	}, { passive: true });
	hero.addEventListener('pointercancel', function () { swipe = null; }, { passive: true });
	hero.addEventListener('pointerup', function (e) {
		var s = swipe;
		swipe = null;
		if (!s || e.pointerId !== s.id) { return; }
		var dx = e.clientX - s.x, dy = e.clientY - s.y;
		if (Math.abs(dx) < 48 || Math.abs(dx) < 1.5 * Math.abs(dy) || e.timeStamp - s.at > 600) { return; }
		step(dx < 0 ? 1 : -1, 'swipe');
	}, { passive: true });

	// It holds while a mouse is over the copy or the controls...
	[hero.querySelector('.hero-panels'), nav].forEach(function (el) {
		if (!el) { return; }
		el.addEventListener('pointerenter', function (e) { if (e.pointerType === 'mouse') { auto.hover = true; autoTick(); } });
		el.addEventListener('pointerleave', function (e) { if (e.pointerType === 'mouse') { auto.hover = false; autoTick(); } });
	});
	// ...while keyboard focus is anywhere in the hero...
	hero.addEventListener('focusin', function (e) {
		var keyboard = true;
		try { keyboard = e.target.matches(':focus-visible'); } catch (err) {}
		if (keyboard && !auto.focus) { auto.focus = true; autoTick(); }
	});
	hero.addEventListener('focusout', function (e) {
		if (auto.focus && !(e.relatedTarget && hero.contains(e.relatedTarget))) { auto.focus = false; autoTick(); }
	});
	// ...and while the hero is scrolled away (it no longer reaches the lower half of the screen).
	if (window.IntersectionObserver) {
		scrollWatch = new IntersectionObserver(function (entries) {
			auto.away = !entries[entries.length - 1].isIntersecting;
			autoTick();
		}, { rootMargin: '-50% 0px 0px 0px' });
		scrollWatch.observe(hero);
	}
	// Dialogs lock scrolling on <body>: nothing moves behind one, and the wait starts again when it closes.
	if (window.MutationObserver) {
		lockWatch = new MutationObserver(function () {
			if (dead) { return; }
			if (locked()) { settle(); autoTick(); }
			else if (!prune()) { autoTick(); }
		});
		lockWatch.observe(document.body, { attributes: true, attributeFilter: ['style'] });
	}
	document.addEventListener('visibilitychange', function () {
		if (dead) { return; }
		if (document.hidden) { settle(); autoTick(); }
		else if (!prune()) { autoTick(); }
	});
	window.addEventListener('resize', function () {
		if (dead) { return; }
		if (phase !== 'idle') { settle(); autoTick(); }
		placeShade();
	});
	window.addEventListener('pagehide', function () { if (!dead) { settle(); } });
	window.addEventListener('pageshow', function (e) { if (e.persisted && !dead && !prune()) { autoTick(); } });
	if (motionQuery) {
		var onMotion = function () { if (!dead && still()) { autoStop(); settle(); } };
		if (motionQuery.addEventListener) { motionQuery.addEventListener('change', onMotion); }
		else if (motionQuery.addListener) { motionQuery.addListener(onMotion); }
	}

	// After the page has loaded: fetch the other photos, then start advancing.
	var afterLoad = function () {
		var idle = window.requestIdleCallback || function (fn) { setTimeout(fn, 200); };
		idle(function () { if (!dead) { slides.forEach(load); } }, { timeout: 2000 });
		if (dead) { return; }
		if (still()) { paintPause(); } else { autoStart(); }
	};
	if (document.readyState === 'complete') { afterLoad(); } else { window.addEventListener('load', afterLoad); }
})();
