<?php
/**
 * Privacy Policy (/privacy). Plain-language starting draft; have counsel review
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
			<h1 class="display">Privacy policy</h1>
			<p class="lede">How Startup Ventura collects, uses, and protects the information you share with us.</p>
		</header>

		<div class="entry-content reveal">
			<p><em>Last updated June 2026.</em></p>

			<p>Startup Ventura is a 501(c)(3) nonprofit based in Ventura County, California. We respect your privacy and collect only what we need to do our work. This policy explains what we collect, how we use it, and the choices you have.</p>

			<h2>Information we collect</h2>
			<p>We collect information you give us directly:</p>
			<ul>
				<li><strong>Forms.</strong> When you contact us, request partnership information, sign up for cohort updates, or subscribe to our newsletter, we collect the details you submit, such as your name, email, phone number, organization, area of interest, and message.</li>
				<li><strong>Donations.</strong> Gifts are processed by our payment partner, Zeffy. We receive the information needed to acknowledge your gift, such as your name, email, and donation amount. We do not collect or store full payment card numbers; Zeffy handles payment processing under its own privacy policy.</li>
			</ul>

			<h2>How we use information</h2>
			<ul>
				<li>To respond to your message and follow up with you.</li>
				<li>To process and acknowledge donations and send tax receipts.</li>
				<li>To send the updates you asked for, such as cohort notifications or our newsletter.</li>
				<li>To understand how the site is used so we can improve it.</li>
			</ul>

			<h2>Analytics and cookies</h2>
			<p>We may use privacy-conscious analytics, such as Google Tag Manager and Google Analytics, to understand site traffic and which pages help people take action. These tools may set cookies or similar identifiers. We may also use Cloudflare Turnstile to protect our forms from spam. You can control cookies through your browser settings.</p>

			<h2>How we share information</h2>
			<p>We do not sell your personal information. We share it only with the service providers that help us operate, such as our donation processor (Zeffy), our email tools, and our analytics providers, and only as needed to provide those services. We may also disclose information if required by law.</p>

			<h2>Data retention</h2>
			<p>We keep information for as long as needed to fulfill the purposes described here, to comply with our legal and accounting obligations, and to maintain our records as a nonprofit.</p>

			<h2>Your choices</h2>
			<p>You can unsubscribe from our emails at any time using the link in any message. You may also ask us to access, correct, or delete the personal information we hold about you by emailing <a href="mailto:<?php echo esc_attr( $sv_info ); ?>"><?php echo esc_html( $sv_info ); ?></a>.</p>

			<h2>Children</h2>
			<p>Our site is intended for adults. We do not knowingly collect personal information from children under 13.</p>

			<h2>Changes to this policy</h2>
			<p>We may update this policy from time to time. We will post the revised version here with a new last-updated date.</p>

			<h2>Contact</h2>
			<p>Questions about this policy? Email <a href="mailto:<?php echo esc_attr( $sv_info ); ?>"><?php echo esc_html( $sv_info ); ?></a>. Startup Ventura is a 501(c)(3) nonprofit, EIN <?php echo esc_html( SV_EIN ); ?>.</p>
		</div>
	</div>
</section>

<?php get_footer(); ?>
