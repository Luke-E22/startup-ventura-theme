<?php
/**
 * Intro overlay (Section 4.4). Builds the four-band wave, draws the coral crest,
 * sets the wordmark, then lifts to reveal the hero whose wave holds position.
 * Plays once per session (gated in main.js). Skip control + reduced-motion safe.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="intro" id="sv-intro">
	<div class="intro-center">
		<div class="wordmark display">STARTUP<br>VENTURA</div>
		<p class="intro-tag">Ventura County &middot; Est. 2025</p>
	</div>
	<?php sv_wave(); ?>
	<button class="skip" id="sv-intro-skip" type="button"><?php esc_html_e( 'Skip', 'startup-ventura' ); ?> &rarr;</button>
</div>
