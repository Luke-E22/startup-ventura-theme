<?php
/**
 * Workshop Series (/program/workshops) — the pre-accelerator track that readies
 * earlier-stage founders and feeds the accelerator pipeline. Child of Program.
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
			<p class="eyebrow">Workshop Series</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			<h1 class="display">A pre-accelerator workshop series.</h1>
			<p class="lede">A pre-accelerator workshop series that readies earlier-stage founders and feeds the accelerator pipeline.</p>
		</header>
	</div>
</section>

<?php // ===== Intent: what the series is for ===== ?>
<section class="section section--pale grain">
	<div class="wrap wrap--narrow">
		<?php sv_section_header( 'The intent', 'Get founders ready before the cohort.', array(
			'intro' => 'The workshops meet founders earlier. They sharpen the problem, build the habits, and get strong founders ready to apply and earn a place in the accelerator.',
		) ); ?>
		<div class="measure reveal">
			<p>This is the on-ramp to the 7-Week Accelerator. Earlier-stage founders come to work in the open, pressure-test ideas with operators, and meet the community before applications open. The strongest move straight into the cohort pipeline.</p>
		</div>
	</div>
</section>

<?php // ===== Example topics (placeholders for the client to confirm) ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( 'Example topics', 'A sense of what we cover.', array(
			'intro' => 'These are examples to show the shape of the series. The final lineup is set with our mentors.',
		) ); ?>
		<div class="card-grid card-grid--3">
			<div class="card reveal">
				<div class="card__body">
					<p class="eyebrow">Example topic</p>
					<h3 class="card__title">Find the real problem</h3>
					<p class="card__text">Talk to customers, name the problem worth solving, and pick the wedge to start with.</p>
									</div>
			</div>
			<div class="card reveal" data-delay="1">
				<div class="card__body">
					<p class="eyebrow">Example topic</p>
					<h3 class="card__title">Build and ship fast</h3>
					<p class="card__text">Turn the idea into something real, put it in front of users, and learn from what they do.</p>
									</div>
			</div>
			<div class="card reveal" data-delay="2">
				<div class="card__body">
					<p class="eyebrow">Example topic</p>
					<h3 class="card__title">Pitch and tell the story</h3>
					<p class="card__text">Sharpen the narrative, get the numbers right, and prepare to apply to the accelerator.</p>
									</div>
			</div>
		</div>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, Apply secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Underwrite a workshop and ready the next founders.',
	'location'  => 'workshops-close',
	'secondary' => 'apply',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
