<?php
/**
 * Terms of Use (/terms). Plain-language starting draft; have counsel review
 * before launch. Copy is hardcoded per the theme's no-page-builder approach.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
$sv_info = antispambot( SV_EMAIL_INFO );
?>

<?php sv_breadcrumbs(); ?>

<section class="section">
	<div class="wrap wrap--narrow">
		<header class="page-head">
			<p class="eyebrow">Legal</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">Terms of use</h1>
			<p class="lede">The terms that govern your use of the Startup Ventura website.</p>
		</header>

		<div class="entry-content reveal">
			<p><em>Last updated June 2026.</em></p>

			<p>By using the Startup Ventura website you agree to these terms. If you do not agree, please do not use the site.</p>

			<h2>Use of the site</h2>
			<p>You agree to use the site lawfully and not to interfere with its operation, its security, or other people's use of it.</p>

			<h2>Donations</h2>
			<p>Donations are processed by our payment partner, Zeffy. Startup Ventura is a 501(c)(3) nonprofit, EIN <?php echo esc_html( SV_EIN ); ?>, and gifts are tax-deductible to the extent allowed by law. You will receive an acknowledgment for your records.</p>

			<h2>Impact calculator and projections</h2>
			<p>Any figures shown in our impact calculator or elsewhere on the site are illustrative estimates based on assumptions we choose. They are not a promise or guarantee of any outcome, and they are not investment, financial, tax, or legal advice. Please consult your own advisors before making any decision.</p>

			<h2>Intellectual property</h2>
			<p>The content, logos, and marks on this site belong to Startup Ventura or its licensors. Please do not reuse them without permission, except for the press materials we provide for media use.</p>

			<h2>Third-party links and services</h2>
			<p>The site links to third-party services, such as our donation platform. We are not responsible for the content or practices of those services, which have their own terms and privacy policies.</p>

			<h2>Disclaimer</h2>
			<p>The site is provided as is, without warranties of any kind. We work to keep information accurate and current but do not guarantee it.</p>

			<h2>Limitation of liability</h2>
			<p>To the fullest extent allowed by law, Startup Ventura is not liable for any indirect or consequential damages arising from your use of the site.</p>

			<h2>Changes</h2>
			<p>We may update these terms from time to time. Continued use of the site means you accept the current version.</p>

			<h2>Contact</h2>
			<p>Questions about these terms? Email <a href="mailto:<?php echo esc_attr( $sv_info ); ?>"><?php echo esc_html( $sv_info ); ?></a>.</p>
		</div>
	</div>
</section>

<?php get_footer(); ?>
