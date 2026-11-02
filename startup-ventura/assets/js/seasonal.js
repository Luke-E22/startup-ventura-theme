/* Startup Ventura seasonal.js: linked by gen.mjs only while a season is active. Its one
   job today is the December light string: the bulbs breathe only while a string is on
   screen and the tab is visible, never under reduced motion, slow displays, data saver or
   low-power devices, and for at most 60 seconds of visible time per page. Without it the
   bulbs sit still at a steady glow. */
(function () {
	'use strict';
	var lights = Array.prototype.slice.call(document.querySelectorAll('.sv-lights'));
	if (!lights.length || !('IntersectionObserver' in window)) { return; }
	var mm = window.matchMedia;
	if (mm && (mm('(prefers-reduced-motion: reduce)').matches || mm('(update: slow)').matches)) { return; }
	var conn = navigator.connection;
	if ((conn && conn.saveData) || (navigator.deviceMemory && navigator.deviceMemory < 4) || (navigator.hardwareConcurrency && navigator.hardwareConcurrency <= 2)) { return; }
	var BUDGET = 60000, spent = 0, since = 0, visible = 0, done = false, io, guard;
	function stop() {
		done = true;
		io.disconnect();
		window.clearInterval(guard);
		lights.forEach(function (el) { el.classList.remove('is-live'); });
	}
	function update() {
		if (done) { return; }
		if (since) { spent += Date.now() - since; since = 0; }
		if (spent >= BUDGET) { stop(); return; }
		var on = visible > 0 && !document.hidden;
		lights.forEach(function (el) { el.classList.toggle('is-live', on && !!el.svVisible); });
		if (on) { since = Date.now(); }
	}
	io = new IntersectionObserver(function (entries) {
		entries.forEach(function (en) {
			if (!!en.target.svVisible !== en.isIntersecting) { en.target.svVisible = en.isIntersecting; visible += en.isIntersecting ? 1 : -1; }
		});
		update();
	}, { threshold: 0 });
	lights.forEach(function (el) { el.svVisible = false; io.observe(el); });
	document.addEventListener('visibilitychange', update);
	guard = window.setInterval(update, 5000);
})();
