<?php
/**
 * About (/about) — who we are, the model, the board, and the ecosystem (Section 11).
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
			<p class="eyebrow">About</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">Built to keep Ventura County the best place to live.</h1>
			<p class="lede">We are a local nonprofit backing local founders. We fuel entrepreneurship, build high-growth companies here, and turn Ventura County into a recognized hub of innovation.</p>
		</header>
	</div>
</section>

<?php // ===== Mission & Model ===== ?>
<section class="section section--pale grain">
	<div class="wrap">
		<?php sv_section_header( 'Mission & Model', 'Why we exist, and how we do the work.' ); ?>
		<div class="measure reveal">
			<p class="lede"><?php echo esc_html( sv_mission() ); ?></p>
			<p>The model is simple. We run a nonprofit accelerator paired with a pre-accelerator workshop series that readies earlier-stage founders. Founders get mentorship from operators who have built and scaled here, connections to capital, and a community that wants them to win. Every dollar stays local, funding Ventura County founders and the program that backs them.</p>
		</div>
	</div>
</section>

<?php // ===== Board & Team ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( 'Board & Team', 'A board that has built and scaled here.', array(
			'intro' => 'Operators and community leaders backing Ventura County founders.',
		) ); ?>
		<div class="board-grid">
			<?php foreach ( sv_board() as $member ) {
				sv_board_card( array( 'member' => $member, 'open' => true ) );
			} ?>
		</div>
	</div>
</section>

<?php // ===== Partners & Ecosystem ===== ?>
<section class="section section--pale section--tight">
	<div class="wrap">
		<?php sv_section_header( 'Partners & Ecosystem', 'Backed by the community we build for.' ); ?>
		<?php sv_partner_row( array( 'variant' => 'list' ) ); ?>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, Partner secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Help us keep Ventura County the best place to live.',
	'location'  => 'about-close',
	'secondary' => 'partner',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
