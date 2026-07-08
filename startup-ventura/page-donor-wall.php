<?php
/**
 * Donor Wall (/donor-wall) — the recognition page promised by the Founder's
 * Circle tiers ("Name on the website donor wall"). Data-driven: names come from
 * sv_donors() in inc/helpers.php, so adding a donor is a one-line edit there.
 * Linked from the footer Explore list only (intentionally not in the top nav).
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();

$sv_donors = sv_donors();
$sv_partners = isset( $sv_donors['partners'] ) ? $sv_donors['partners'] : array();
?>

<?php sv_breadcrumbs(); ?>

<section class="section">
	<div class="wrap">
		<header class="page-head">
			<p class="eyebrow">Donor Wall</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">The people funding what founders build here.</h1>
			<p class="lede">Startup Ventura is powered by donors and partners who back Ventura County founders. This wall recognizes the Founder&rsquo;s Circle and the community partners behind the inaugural Spring 2027 cohort.</p>
		</header>
	</div>
</section>

<?php // ===== Founder's Circle: vertical recognition ladder, highest gift first ===== ?>
<section class="section section--pale">
	<div class="wrap">
		<?php sv_section_header( "Founder's Circle", 'The donors launching the first cohort.', array(
			'intro' => 'Recognition scales with the gift, highest tier first. Each tier includes everything below it.',
		) ); ?>
		<div class="donor-ladder">
			<?php
			$sv_ranks = array_reverse( sv_tiers() ); // Legacy (grandest) first … Catalyst last
			$sv_total = count( $sv_ranks );
			foreach ( $sv_ranks as $sv_i => $sv_tier ) :
				$sv_names = isset( $sv_donors[ $sv_tier['name'] ] ) ? $sv_donors[ $sv_tier['name'] ] : array();
				$sv_lvl   = $sv_total - $sv_i; // 4 = Legacy (top) … 1 = Catalyst
				?>
				<div class="donor-rank donor-rank--l<?php echo (int) $sv_lvl; ?> reveal">
					<p class="donor-rank__tier"><span class="donor-rank__label"><?php echo esc_html( $sv_tier['name'] ); ?></span> <span class="donor-rank__amount"><?php echo esc_html( $sv_tier['amount'] ); ?>+</span></p>
					<?php if ( $sv_names ) : ?>
						<ul class="donor-rank__donors">
							<?php foreach ( $sv_names as $sv_name ) : ?>
								<li><?php echo esc_html( $sv_name ); ?></li>
							<?php endforeach; ?>
						</ul>
					<?php else : ?>
						<p class="donor-rank__invite"><a href="<?php echo esc_url( home_url( '/give/' ) ); ?>">Be the first at this level &rarr;</a></p>
					<?php endif; ?>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>

<?php // ===== Founding supporters & community partners ===== ?>
<?php if ( $sv_partners ) : ?>
	<section class="section">
		<div class="wrap">
			<?php sv_section_header( 'Founding Supporters', 'The partners who got this started.', array(
				'intro' => 'Public and community partners whose early support launched Startup Ventura.',
			) ); ?>
			<ul class="donor-partners reveal">
				<?php foreach ( $sv_partners as $sv_partner ) : ?>
					<li><?php echo esc_html( $sv_partner ); ?></li>
				<?php endforeach; ?>
			</ul>
		</div>
	</section>
<?php endif; ?>

<?php // ===== Thank you: every donor, any amount, dot-separated name wall ===== ?>
<section class="section section--pale section--tight">
	<div class="wrap">
		<?php sv_section_header( 'Thank You', 'To every donor who backs Ventura County\'s founders.' ); ?>
		<?php $sv_all = isset( $sv_donors['all'] ) ? $sv_donors['all'] : array(); ?>
		<?php if ( $sv_all ) : ?>
			<ul class="donor-all reveal">
				<?php foreach ( $sv_all as $sv_name ) : ?>
					<li><?php echo esc_html( $sv_name ); ?></li>
				<?php endforeach; ?>
			</ul>
		<?php else : ?>
			<p class="donor-all__empty reveal">Every donor&rsquo;s name is listed here, at every level. <a href="<?php echo esc_url( home_url( '/give/' ) ); ?>">Yours belongs on this wall &rarr;</a></p>
		<?php endif; ?>
	</div>
</section>

<?php sv_cta_band( array(
	'eyebrow'   => 'Join the wall',
	'heading'   => 'Put your name behind Ventura County\'s founders.',
	'location'  => 'donor-wall-close',
	'secondary' => 'none',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
