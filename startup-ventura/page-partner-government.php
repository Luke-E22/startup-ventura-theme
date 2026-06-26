<?php
/**
 * For Cities & County (/partner/cities-county) — the economic-development case
 * for partnering with Startup Ventura. Child of /partner.
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

		<?php // ===== Page head ===== ?>
		<header class="page-head">
			<p class="eyebrow">For Cities &amp; County</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			<h1 class="display">Keep the talent, and the tax base, in Ventura County.</h1>
			<p class="lede">Your economic-development goals and ours are the same goal. Startup Ventura is the execution partner that turns local ambition into local companies, local jobs, and revenue that stays here. You set the priorities. We run the program that delivers them.</p>
		</header>

		<?php // ===== Stat strip: the case for keeping talent and the tax base local ===== ?>
		<div class="measure reveal" style="margin-top:8px">
			<p>Every founder who leaves takes a future employer, a payroll, and a tax base with them. Keeping them here is the highest-leverage economic-development move the county can make.</p>
		</div>
		<div style="margin-top:28px">
			<?php sv_stat_strip(); ?>
		</div>

	</div>
</section>

<?php // ===== What partnership looks like ===== ?>
<section class="section section--pale grain">
	<div class="wrap">
		<?php sv_section_header( 'The partnership', 'What partnership looks like.', array(
			'intro' => 'A focused, accountable relationship built around outcomes your residents can feel.',
		) ); ?>
		<div class="card-grid card-grid--3">
			<div class="card reveal">
				<div class="card__body">
					<h3 class="card__title">Local founders, local jobs</h3>
					<p class="card__text">We recruit, train, and back Ventura County founders so the companies they build, and the jobs they create, take root here instead of in another city.</p>
				</div>
			</div>
			<div class="card reveal" data-delay="1">
				<div class="card__body">
					<h3 class="card__title">A program you can point to</h3>
					<p class="card__text">An accelerator and workshop series with a clear cohort, a Demo Day, and reporting. Public dollars map to a visible pipeline of founders and outcomes.</p>
				</div>
			</div>
			<div class="card reveal" data-delay="2">
				<div class="card__body">
					<h3 class="card__title">Shared recognition</h3>
					<p class="card__text">Cities and the county are credited as founding partners across the program, the annual benefit, and Demo Day. Your investment is seen by the residents it serves.</p>
				</div>
			</div>
		</div>
		<p class="muted reveal" style="margin-top:24px">Partnership structure, term, and contribution levels are tailored to each city and the county.</p>
	</div>
</section>

<?php // ===== Request a meeting ===== ?>
<section class="section">
	<div class="wrap wrap--narrow">
		<?php sv_section_header( 'Let\'s talk', 'Request a meeting.', array(
			'intro' => 'Tell us your priorities and we will bring a plan to keep your talent and tax base local. We will follow up to schedule a working session.',
		) ); ?>
		<div class="reveal">
			<?php
			get_template_part( 'template-parts/form', null, array(
				'type'         => 'partner-government',
				'submit'       => 'Request a meeting',
				'organization' => true,
			) );
			?>
		</div>
		<p class="muted reveal" style="margin-top:20px">Ready to move now? A gift is always welcome and every dollar stays in Ventura County. <?php sv_give_button( 'partner-gov-form', array( 'class' => 'btn--ghost', 'label' => 'Give' ) ); ?></p>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, Partner secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Invest where the return stays in Ventura County.',
	'location'  => 'partner-gov-close',
	'secondary' => 'partner',
	'give_note' => 'Every dollar funds local founders. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
