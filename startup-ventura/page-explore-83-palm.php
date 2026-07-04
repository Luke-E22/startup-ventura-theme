<?php
/**
 * 83 Palm Street · Coworking Concept (/explore-83-palm) — unlisted.
 *
 * Hosts the self-contained interactive 3D render (assets/explore/83-palm/
 * render.html, served byte-for-byte) in an iframe inside the site chrome.
 * noindex/nofollow, excluded from the WP sitemap (inc/schema.php), and linked
 * only from the tiny note at the bottom of the footer Explore list.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_head', function () {
	echo '<meta name="robots" content="noindex, nofollow">' . "\n";
}, 1 );

get_header();
?>

<?php sv_breadcrumbs(); ?>

<section class="section">
	<div class="wrap">
		<header class="page-head">
			<p class="eyebrow">Concept Study</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">83 Palm Street &middot; Coworking Concept</h1>
			<p class="lede">An interactive concept study for Startup Ventura&rsquo;s future coworking and accelerator home in the former American Legion hall, modeled from the original 1948 Kenneth H. Hess drawings. Drag to orbit, scroll to zoom, keys 1 to 8 for saved views.</p>
		</header>
		<iframe src="<?php echo esc_url( SV_URI . '/assets/explore/83-palm/render.html' ); ?>" title="83 Palm 3D concept" style="width:100%; height:85vh; border:0; border-radius:12px;" allowfullscreen loading="lazy"></iframe>
		<p class="muted" style="margin-top:14px;font-size:14px">Concept only. Dimensions approximate from the 1948 drawings. Best experienced on desktop.</p>
	</div>
</section>

<?php get_footer(); ?>
