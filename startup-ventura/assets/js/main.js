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
	 * 1. Intro overlay — play once per session, honor reduced motion.
	 * ------------------------------------------------------------------- */
	(function intro() {
		var el = $('#sv-intro');
		if (!el) { return; }
		var skip = $('#sv-intro-skip');
		var replay = $('#sv-intro-replay');
		var timers = [];
		function clear() { timers.forEach(clearTimeout); timers = []; }
		function endIntro() {
			el.classList.add('intro--resolve');
			timers.push(setTimeout(function () { el.classList.add('intro--hidden'); }, 850));
		}
		function play() {
			clear();
			el.classList.remove('intro--hidden', 'intro--resolve', 'intro--play');
			void el.offsetWidth; // reflow
			el.classList.add('intro--play');
			timers.push(setTimeout(endIntro, 2600));
		}
		var seen = false;
		try { seen = !!sessionStorage.getItem('sv_intro_seen'); } catch (e) {}

		if (reduce || seen) {
			el.classList.add('intro--hidden');
		} else {
			try { sessionStorage.setItem('sv_intro_seen', '1'); } catch (e) {}
			play();
		}
		if (skip) { skip.addEventListener('click', function () { clear(); endIntro(); }); }
		if (replay) { replay.addEventListener('click', play); }
	})();

	/* ---------------------------------------------------------------------
	 * 2. Sticky header scroll state.
	 * ------------------------------------------------------------------- */
	(function header() {
		var hdr = $('.site-header');
		if (!hdr) { return; }
		var onScroll = function () {
			if (window.pageYOffset > 40) { hdr.classList.add('is-scrolled'); }
			else { hdr.classList.remove('is-scrolled'); }
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
				window.dataLayer.push({
					event: 'cta_click',
					cta_type: el.dataset.cta,
					cta_location: el.dataset.ctaLocation || ''
				});
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
		$$('[zeffy-form-link]').forEach(function (el) {
			el.setAttribute('zeffy-form-link', append(el.getAttribute('zeffy-form-link')));
		});
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
	 * 11. Forms — AJAX submit to admin-ajax, aria-live status, disable on send.
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

})();
