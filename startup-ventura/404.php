<?php
/**
 * 404 — page not found (spec 4.9). Wave-themed, navy, striking and short.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<section class="error404-hero">
	<?php sv_wave( array( 'variant' => 'full' ) ); ?>
	<div class="wrap reveal">
		<p class="eyebrow" style="color:var(--coral-light)">404</p>
		<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
		<h1 class="display">This page drifted out to sea.</h1>
		<p class="lede measure center">The link is broken or the page has moved. Let&rsquo;s get you back to dry land.</p>

		<div class="error404-actions center" style="margin-top:32px">
			<a class="btn btn--ghost btn--lg" href="<?php echo esc_url( home_url( '/' ) ); ?>">Back to home</a>
			<?php sv_give_button( '404', array( 'class' => 'btn--lg' ) ); ?>
		</div>

		<nav class="error404-links" aria-label="<?php esc_attr_e( 'Helpful links', 'startup-ventura' ); ?>" style="margin-top:28px">
			<a href="<?php echo esc_url( home_url( '/program/' ) ); ?>">Program</a>
			<a href="<?php echo esc_url( home_url( '/give/' ) ); ?>">Give</a>
			<a href="<?php echo esc_url( home_url( '/why-ventura-county/' ) ); ?>">Why Ventura County</a>
			<a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">Contact</a>
		</nav>

		<div class="error404-search" style="margin-top:24px">
			<?php get_search_form(); ?>
		</div>
	</div>
</section>

<?php sv_cta_band( array(
	'heading'   => 'While you are here, help fund the inaugural cohort.',
	'location'  => '404-close',
	'secondary' => 'none',
) ); ?>

<?php get_footer(); ?>
