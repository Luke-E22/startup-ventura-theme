<?php
/**
 * For Foundations & Corporate Giving (/partner/foundations) — the grant and
 * sponsorship case, child of Partner. Give stays the dominant action; the
 * sponsor form routes server-side to sponsor@.
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
			<p class="eyebrow">For Foundations &amp; Corporate Giving</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">Fund a local economic engine, and put your name on it.</h1>
			<p class="lede">A grant or sponsorship here is a measurable investment in Ventura County. You back local founders, you create local jobs, and the entire gift stays in the county that earns it.</p>
				<div style="margin-top:24px"><?php sv_candid_seal(); ?></div>
		</header>
	</div>
</section>

<?php // ===== The case in three numbers ===== ?>
<section class="section section--pale section--tight grain">
	<div class="wrap">
		<?php sv_section_header( 'The case', 'A measurable engine, not a line item.', array(
			'intro' => 'Ventura County raises and educates talent, then loses it to affordability and a lack of opportunity. High-growth companies are the fix, and the math is local.',
		) ); ?>
		<div style="margin-top:32px">
			<?php sv_stat_strip(); ?>
		</div>
			</div>
</section>

<?php // ===== Founder's Circle as sponsorship levels ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( 'Sponsorship levels', 'The Founder\'s Circle, built for partners.', array(
			'intro' => 'Each level is a named recognition tier and an annual sponsorship. Every level includes the one below it, and Legacy presents the inaugural Spring 2027 cohort. Every dollar stays in Ventura County.',
		) ); ?>
		<div class="tier-grid">
			<?php
			foreach ( sv_tiers() as $tier ) {
				sv_tier_card( $tier );
			}
			?>
		</div>
		<div class="center" style="margin-top:36px">
			<?php sv_give_button( 'partner-found-tiers', array( 'class' => 'btn--lg', 'note' => 'Or give any amount. EIN ' . SV_EIN . '.' ) ); ?>
		</div>
	</div>
</section>

<?php // ===== Become a sponsor — routes to sponsor@ server-side ===== ?>
<section class="section section--pale">
	<div class="wrap wrap--narrow">
		<?php sv_section_header( 'Become a sponsor', 'Start the conversation.', array(
			'intro' => 'Tell us about your foundation or company and the impact you want to fund. We will follow up with a sponsorship and grant plan tailored to your goals.',
		) ); ?>
		<div class="reveal">
			<?php
			get_template_part( 'template-parts/form', null, array(
				'type'         => 'partner-foundations',
				'submit'       => 'Become a sponsor',
				'organization' => true,
			) );
			?>
		</div>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, Partner secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Put your name behind Ventura County\'s first founder cohort.',
	'location'  => 'partner-found-close',
	'secondary' => 'partner',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
