<?php
/**
 * Front page (Home) — founders-led; the hero is the thesis (Section 8).
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<?php // ===== Hero (4.5): the intro resolves into this; the wave holds position. ===== ?>
<?php get_template_part( 'template-parts/hero' ); ?>

<?php // ===== Mission strip ===== ?>
<section class="section mission-strip">
	<div class="wrap reveal">
		<p class="eyebrow" style="color:var(--coral-light)">Our mission</p>
		<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
		<p class="mission"><?php echo esc_html( sv_mission() ); ?></p>
	</div>
</section>

<?php // ===== Program teaser ===== ?>
<section class="section section--pale grain">
	<div class="wrap">
		<?php sv_section_header( 'The Program', 'The on-ramp founders need.', array(
			'intro' => 'Everything entrepreneurs would leave town to find: a true accelerator with a pathway to raising venture capital.',
		) ); ?>
		<div class="card-grid card-grid--2">
			<a class="card card--link reveal" href="<?php echo esc_url( home_url( '/program/accelerator/' ) ); ?>">
				<div class="card__body">
					<p class="eyebrow">Spring 2027 · S27</p>
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
		<div class="center" style="margin-top:32px">
			<?php sv_apply_button( 'home-program', 'Apply to the cohort', 'btn--outline btn--lg' ); ?>
		</div>
	</div>
</section>

<?php // ===== Testimonials ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( 'In the room', 'What people are saying.', array( 'align' => 'center' ) ); ?>
		<div class="testimonials">
			<?php
			$tt = sv_testimonials();
			sv_testimonial( $tt['sean'] );
			sv_testimonial( $tt['jeff'] );
			sv_testimonial( $tt['john'] );
			sv_testimonial( $tt['rob'] );
			?>
		</div>
	</div>
</section>

<?php // ===== Partner row ===== ?>
<section class="section section--pale section--tight">
	<div class="wrap">
		<?php sv_section_header( 'Backed by the community', 'Partners & supporters.', array( 'align' => 'center' ) ); ?>
		<?php sv_partner_row(); ?>
	</div>
</section>

<?php // ===== Board teaser ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( 'Who we are', 'A board that has built and scaled here.', array(
			'intro' => 'Operators and community leaders backing Ventura County founders.',
		) ); ?>
		<div class="board-grid">
			<?php foreach ( sv_board() as $member ) {
				sv_board_card( array( 'member' => $member ) );
			} ?>
		</div>
		<div class="center" style="margin-top:32px">
			<a class="btn btn--outline" href="<?php echo esc_url( home_url( '/about/' ) ); ?>">Meet the full board</a>
		</div>
	</div>
</section>

<?php // ===== Why Ventura County (moved below the board) ===== ?>
<?php sv_wave( array( 'variant' => 'divider' ) ); ?>
<section class="section section--pale">
	<div class="wrap">
		<?php sv_section_header( 'Why Ventura County', 'Great talent grows up here. Too much of it leaves.' ); ?>
		<p class="lede reveal">The county raises and educates talent, then watches affordability and a lack of opportunity push it out. Brain drain and the cost of living are the same problem, and high-growth companies are the fix.</p>
		<div style="margin-top:32px">
			<?php sv_stat_strip(); ?>
		</div>
		<div style="margin-top:28px">
			<a class="card__link reveal" href="<?php echo esc_url( home_url( '/why-ventura-county/' ) ); ?>" style="font-size:1.05rem">Read the full case</a>
		</div>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, Apply secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Give Ventura County\'s founders a reason to stay.',
	'location'  => 'home-close',
	'secondary' => 'apply',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
