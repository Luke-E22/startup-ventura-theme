<?php
/**
 * 7-Week Accelerator (/program/accelerator) — the flagship program page.
 * Child of /program. Give stays the dominant action; Apply is the secondary.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<?php sv_breadcrumbs(); ?>

<?php // ===== Page head ===== ?>
<section class="section">
	<div class="wrap">
		<header class="page-head">
			<p class="eyebrow">7-Week Accelerator</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">A 7-week accelerator for Ventura County founders.</h1>
			<p class="lede">A focused seven-week accelerator for Ventura County founders. The inaugural <?php echo esc_html( SV_COHORT_LABEL ); ?> cohort.</p>
		</header>
	</div>
</section>

<?php // ===== What you get ===== ?>
<section class="section section--pale grain">
	<div class="wrap">
		<?php sv_section_header( 'What you get', 'Seven weeks built to move you forward.' ); ?>
		<div class="card-grid card-grid--3">
			<div class="card reveal">
				<div class="card__body">
					<h3 class="card__title">Mentorship</h3>
					<p class="card__text">Direct access to operators and founders who have built and scaled real companies.</p>
				</div>
			</div>
			<div class="card reveal" data-delay="1">
				<div class="card__body">
					<h3 class="card__title">Capital connections</h3>
					<p class="card__text">Investor introductions and the warm paths that turn a pitch into a check.</p>
				</div>
			</div>
			<div class="card reveal" data-delay="2">
				<div class="card__body">
					<h3 class="card__title">Hands-on workshops</h3>
					<p class="card__text">Working sessions on the hard parts: building, selling, hiring, and raising.</p>
				</div>
			</div>
			<div class="card reveal">
				<div class="card__body">
					<h3 class="card__title">Community</h3>
					<p class="card__text">A founder cohort that pushes you, plus a board and mentor network behind you.</p>
				</div>
			</div>
			<div class="card reveal" data-delay="1">
				<div class="card__body">
					<h3 class="card__title">A Demo Day</h3>
					<p class="card__text">A stage in front of investors, partners, and the community to launch what you have built.</p>
				</div>
			</div>
		</div>
			</div>
</section>

<?php // ===== How we select startups ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( 'How we select', 'We pick founders, not decks.' ); ?>
		<p class="lede measure reveal">What we care about most: the quality of the founder. A great founder with an early idea beats a polished deck and a mediocre team. Our process is built to find the people who will run through walls.</p>
		<div class="steps">
			<?php foreach ( sv_process_steps() as $s ) {
				sv_process_step( $s );
			} ?>
		</div>
	</div>
</section>

<?php // ===== Timeline (shown only once real dates are set) ===== ?>
<?php if ( SV_APP_OPEN && '[' !== substr( (string) SV_APP_OPEN, 0, 1 ) ) : ?>
<section class="section section--pale section--tight">
	<div class="wrap wrap--narrow">
		<?php sv_section_header( 'Timeline', 'Key dates for the inaugural cohort.' ); ?>
		<dl class="measure reveal">
			<dt class="eyebrow">Applications open</dt>
			<dd class="lede"><span class="fig"><?php echo esc_html( SV_APP_OPEN ); ?></span></dd>
			<dt class="eyebrow" style="margin-top:18px">Applications close</dt>
			<dd class="lede"><span class="fig"><?php echo esc_html( SV_APP_CLOSE ); ?></span></dd>
			<dt class="eyebrow" style="margin-top:18px">Cohort starts</dt>
			<dd class="lede"><span class="fig"><?php echo esc_html( SV_COHORT_START ); ?></span></dd>
			<dt class="eyebrow" style="margin-top:18px">Cohort ends</dt>
			<dd class="lede"><span class="fig"><?php echo esc_html( SV_COHORT_END ); ?></span></dd>
		</dl>
	</div>
</section>
<?php endif; ?>

<?php // ===== Eligibility ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( 'Eligibility', 'Who the cohort is for.' ); ?>
		<p class="lede measure reveal">The accelerator is built for founders building high-growth companies in or for Ventura County. We back early teams and committed solo founders who are ready to work.</p>
	</div>
</section>

<?php // ===== Get notified (shown only while the application is not yet open) ===== ?>
<?php if ( sv_apply_pending() ) : ?>
<section class="section section--pale" id="notify">
	<div class="wrap wrap--narrow">
		<?php sv_section_header( 'Applications', 'Not open yet. Be first to know.', array(
			'intro' => 'The inaugural Spring 2027 cohort opens for applications soon. Leave your email and we will notify you the moment it does.',
		) ); ?>
		<div class="reveal">
			<?php get_template_part( 'template-parts/form', null, array( 'type' => 'notify', 'submit' => 'Notify me' ) ); ?>
		</div>
	</div>
</section>
<?php endif; ?>

<?php // ===== Closing CTA band: Give primary, Apply secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Help us launch Ventura County\'s first founder cohort.',
	'location'  => 'accelerator-close',
	'secondary' => 'apply',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
