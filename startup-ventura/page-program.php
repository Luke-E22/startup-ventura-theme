<?php
/**
 * The Program (/program) — frame the program as the product (Section 8).
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<?php sv_breadcrumbs(); ?>

<section class="section">
	<div class="wrap">
		<header class="page-head">
			<p class="eyebrow">The Program</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">The program is the product.</h1>
			<p class="lede">A focused accelerator and a pre-accelerator workshop series, built for Ventura County founders who would rather build here than leave.</p>
		</header>

		<div class="card-grid card-grid--2">
			<a class="card card--link reveal" href="<?php echo esc_url( home_url( '/program/accelerator/' ) ); ?>">
				<div class="card__body">
					<p class="eyebrow">Spring 2027 &middot; S27</p>
					<h3 class="card__title">7-Week Accelerator</h3>
					<p class="card__text">Mentorship from operators and founders, capital connections, hands-on workshops, community, and a Demo Day.</p>
					<span class="card__link">Explore the accelerator</span>
				</div>
			</a>
			<a class="card card--link reveal" data-delay="1" href="<?php echo esc_url( home_url( '/program/workshops/' ) ); ?>">
				<div class="card__body">
					<p class="eyebrow">Pre-accelerator</p>
					<h3 class="card__title">Workshop Series</h3>
					<p class="card__text">A workshop series that readies earlier-stage founders and feeds the accelerator pipeline.</p>
					<span class="card__link">Explore the workshops</span>
				</div>
			</a>
		</div>
	</div>
</section>

<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Help us launch Ventura County\'s first founder cohort.',
	'location'  => 'program-close',
	'secondary' => 'apply',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
