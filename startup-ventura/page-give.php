<?php
/**
 * Give (/give) — the strongest page (Section 5.3). Donation runs through the
 * Zeffy modal (no inline iframe); every Give button opens it.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<?php sv_breadcrumbs(); ?>

<?php // ===== Hero (navy): the ask, with trust signals alongside ===== ?>
<section class="section section--navy">
	<div class="wrap">
		<div class="give-hero">
			<div class="give-hero__copy reveal">
				<h1 class="display">Fund Ventura County's first founder cohort.</h1>
				<p class="lede">A gift funds local founders and the program that backs them. It stays in Ventura County.</p>
				<?php sv_give_button( 'give-hero', array( 'class' => 'btn--lg', 'note' => 'Secure payment via Zeffy.' ) ); ?>
			</div>
			<ul class="trust reveal" data-delay="1">
				<li>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="4" y="11" width="16" height="9" rx="2"/><path d="M8 11V7a4 4 0 0 1 8 0v4"/></svg>
					<span>Secure payment</span>
				</li>
				<li>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>
					<span>501(c)(3) nonprofit</span>
				</li>
				<li>
					<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><path d="M20 6 9 17l-5-5"/></svg>
					<span>EIN <?php echo esc_html( SV_EIN ); ?></span>
				</li>
			</ul>
		</div>
	</div>
</section>

<?php // ===== Founder's Circle tiers ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( "Founder's Circle", 'Lead the inaugural cohort.', array(
			'intro' => 'Recognition tiers for the founders and partners who launch Spring 2027. Each tier includes everything below it.',
		) ); ?>
		<div class="tier-grid">
			<?php foreach ( sv_tiers() as $tier ) {
				sv_tier_card( $tier );
			} ?>
		</div>
		<?php $sv_sponsor = antispambot( SV_EMAIL_SPONSOR ); ?>
		<p class="center muted reveal" style="margin-top:32px">
			To discuss a Founder's Circle or corporate gift, email
			<a href="mailto:<?php echo esc_attr( $sv_sponsor ); ?>"><?php echo esc_html( $sv_sponsor ); ?></a>.
		</p>
	</div>
</section>

<?php // ===== Other ways to give ===== ?>
<section class="section section--pale">
	<div class="wrap">
		<?php sv_section_header( 'Other ways to give', 'More ways to back local founders.' ); ?>
		<div class="card-grid card-grid--3">
			<div class="card reveal">
				<div class="card__body">
					<h3 class="card__title">Gifts of stock</h3>
					<p class="card__text">Give appreciated securities and put the full value to work for Ventura County founders.</p>
					<a class="card__link" href="mailto:<?php echo esc_attr( $sv_sponsor ); ?>">Email to arrange a stock gift</a>
				</div>
			</div>
			<div class="card reveal" data-delay="1">
				<div class="card__body">
					<h3 class="card__title">Donor-advised funds</h3>
					<p class="card__text">Recommend a grant to Startup Ventura from your DAF. We will send the details your sponsor needs.</p>
					<a class="card__link" href="mailto:<?php echo esc_attr( $sv_sponsor ); ?>">Email to give through a DAF</a>
				</div>
			</div>
			<div class="card reveal" data-delay="2">
				<div class="card__body">
					<h3 class="card__title">Corporate &amp; foundation support</h3>
					<p class="card__text">Sponsor the cohort or fund a program through your company or foundation. We will tailor the recognition.</p>
					<a class="card__link" href="mailto:<?php echo esc_attr( $sv_sponsor ); ?>">Email to partner with us</a>
				</div>
			</div>
		</div>
		<p class="center muted reveal" style="margin-top:24px">
			<em>To arrange a gift of stock or a donor-advised fund grant, email us and we will share transfer details.</em>
		</p>
	</div>
</section>

<?php // ===== Tax line ===== ?>
<section class="section section--tight">
	<div class="wrap">
		<?php sv_candid_seal( 'give-seal' ); ?>
		<p class="muted measure">Gifts are tax-deductible to the extent allowed by law. EIN <?php echo esc_html( SV_EIN ); ?>.</p>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, no secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Back the founders who will build the Spring 2027 cohort.',
	'location'  => 'give-close',
	'secondary' => 'none',
	'give_note' => 'Every dollar stays in Ventura County. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
