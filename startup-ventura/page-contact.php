<?php
/**
 * Contact / Apply (/contact) — "Send us a message" form alongside an
 * "Other ways to reach us" panel, plus the S27 notify signup.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
$sv_info    = antispambot( SV_EMAIL_INFO );
$sv_sponsor = antispambot( SV_EMAIL_SPONSOR );
?>

<?php sv_breadcrumbs(); ?>

<section class="section">
	<div class="wrap">
		<div class="contact-layout">

			<?php // ===== Left: the message form ===== ?>
			<div class="reveal">
				<p class="eyebrow">Contact</p>
				<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
				<h1 class="display">Send us a message</h1>
				<p class="lede">Fill out the form below and we will get back to you. Tell us a little about yourself and what you are interested in, whether that is the cohort, partnership, mentoring, or something else.</p>
				<div style="margin-top:28px">
					<?php
					get_template_part( 'template-parts/form', null, array(
						'type'     => 'contact',
						'submit'   => 'Send Message',
						'phone'    => true,
						'two_col'  => true,
						'interest' => array( 'General', 'Press', 'Major Gifts', 'Sponsorship', 'Investor inquiry', 'Mentoring', 'Other' ),
					) );
					?>
				</div>
			</div>

			<?php // ===== Right: other ways to reach us ===== ?>
			<aside class="contact-aside reveal" data-delay="1" aria-label="<?php esc_attr_e( 'Other ways to reach us', 'startup-ventura' ); ?>">
				<h2 class="display">Other ways to reach us</h2>

				<div class="contact-aside__block">
					<h3>Email</h3>
					<a href="mailto:<?php echo esc_attr( $sv_info ); ?>"><?php echo esc_html( $sv_info ); ?></a>
				</div>

				<div class="contact-aside__block">
					<h3><?php esc_html_e( 'Partnerships & sponsorship', 'startup-ventura' ); ?></h3>
					<a href="mailto:<?php echo esc_attr( $sv_sponsor ); ?>"><?php echo esc_html( $sv_sponsor ); ?></a>
				</div>

				<div class="contact-aside__block">
					<h3><?php esc_html_e( 'Follow us', 'startup-ventura' ); ?></h3>
					<p><?php esc_html_e( 'Follow Startup Ventura for events, founders, and announcements.', 'startup-ventura' ); ?></p>
					<span class="contact-aside__social">
						<a href="<?php echo esc_url( SV_LINKEDIN ); ?>" target="_blank" rel="noopener">LinkedIn</a>
						<a href="<?php echo esc_url( SV_INSTAGRAM ); ?>" target="_blank" rel="noopener">Instagram</a>
					</span>
				</div>

				<div class="contact-aside__block">
					<h3><?php esc_html_e( 'Area', 'startup-ventura' ); ?></h3>
					<p><?php esc_html_e( 'Serving all of Ventura County, California.', 'startup-ventura' ); ?></p>
				</div>

				<div class="contact-aside__block">
						<h3><?php esc_html_e( 'Press', 'startup-ventura' ); ?></h3>
						<p><?php esc_html_e( 'Writing about Startup Ventura? Our press and media kit has logos, facts, and a press contact.', 'startup-ventura' ); ?></p>
						<a href="<?php echo esc_url( home_url( '/press/' ) ); ?>"><?php esc_html_e( 'Press & media kit', 'startup-ventura' ); ?></a>
					</div>

					<div class="contact-card">
					<h3><?php esc_html_e( 'What happens next', 'startup-ventura' ); ?></h3>
					<p><?php esc_html_e( 'We read every message. Expect a reply from a real member of the Startup Ventura team, usually within a few days. If you are a founder, we will point you to the next step.', 'startup-ventura' ); ?></p>
				</div>
			</aside>

		</div>
	</div>
</section>

<?php // ===== Notify me when S27 applications open (also the Apply fallback target) ===== ?>
<section class="section section--pale" id="notify">
	<div class="wrap wrap--narrow">
		<?php sv_section_header( 'Applications', 'Get notified when S27 applications open.', array(
			'intro' => 'Drop your email and we will tell you the moment the inaugural Spring 2027 cohort opens for applications.',
		) ); ?>
		<div class="reveal">
			<?php
			get_template_part( 'template-parts/form', null, array(
				'type'   => 'notify',
				'submit' => 'Notify me',
			) );
			?>
		</div>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, Apply secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Give Ventura County\'s founders a reason to stay.',
	'location'  => 'contact-close',
	'secondary' => 'apply',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
