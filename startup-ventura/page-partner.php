<?php
/**
 * Partner hub (/partner) — routes the two partner audiences to their pages.
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
			<p class="eyebrow">Partner</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			<h1 class="display">Partner with us to grow talent here.</h1>
			<p class="lede">Cities, county offices, foundations, and companies all have a stake in keeping Ventura County&rsquo;s founders building here. Pick the path that fits how you want to invest in the region.</p>
		</header>

		<div class="card-grid card-grid--2">
			<a class="card card--link reveal" href="<?php echo esc_url( home_url( '/partner/cities-county/' ) ); ?>">
				<div class="card__body">
					<p class="eyebrow">Public sector</p>
					<h2 class="card__title">For Cities &amp; County</h2>
					<p class="card__text">Back local entrepreneurship as economic development that grows the tax base and the jobs that come with it.</p>
					<span class="card__link">See how cities and county partner</span>
				</div>
			</a>
			<a class="card card--link reveal" data-delay="1" href="<?php echo esc_url( home_url( '/partner/foundations/' ) ); ?>">
				<div class="card__body">
					<p class="eyebrow">Philanthropy &amp; corporate</p>
					<h2 class="card__title">For Foundations &amp; Corporate Giving</h2>
					<p class="card__text">Fund founders and the program that backs them, with recognition and impact that stays in the county.</p>
					<span class="card__link">See foundation and corporate giving</span>
				</div>
			</a>
		</div>
	</div>
</section>

<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Invest in the founders who will keep Ventura County strong.',
	'location'  => 'partner-close',
	'secondary' => 'partner',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
