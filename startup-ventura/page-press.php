<?php
/**
 * Press & Media Kit (/press). Hardcoded; linked from the Contact page and footer.
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
			<p class="eyebrow">Press</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">Press &amp; media kit</h1>
			<p class="lede">Everything you need to cover Startup Ventura. For interviews or more information, contact us any time.</p>
		</header>

		<div class="entry-content reveal">
			<h2>About Startup Ventura</h2>
			<p>Startup Ventura is a 501(c)(3) nonprofit startup accelerator in Ventura County, California. We back local founders with the mentorship, capital connections, and community to build high-growth companies, and to keep that talent and those jobs in Ventura County. Our inaugural Spring 2027 cohort is now being funded.</p>

			<h2>Quick facts</h2>
			<ul>
				<li><strong>Type:</strong> 501(c)(3) nonprofit startup accelerator</li>
				<li><strong>EIN:</strong> <?php echo esc_html( SV_EIN ); ?></li>
				<li><strong>Location:</strong> Ventura County, California</li>
				<li><strong>Programs:</strong> a 7-week accelerator, a founder workshop series, and a Demo Day</li>
				<li><strong>Inaugural cohort:</strong> Spring 2027</li>
			</ul>

			<h2>Logos</h2>
			<p>Please use our logo as provided and do not alter it.</p>
			<p>
				<a href="<?php echo esc_url( SV_URI . '/assets/img/logo.png' ); ?>" download>Download logo (color)</a><br>
				<a href="<?php echo esc_url( SV_URI . '/assets/img/logo-white.png' ); ?>" download>Download logo (white, for dark backgrounds)</a>
			</p>

			<h2>Leadership</h2>
			<p>Startup Ventura is led by a board of operators who have built and scaled companies, including leaders behind Curri, SevenRooms, and the Ventura Chamber of Commerce. Read more on our <a href="<?php echo esc_url( home_url( '/about/' ) ); ?>">About page</a>.</p>

			<h2>Press contact</h2>
			<p>For interviews, quotes, or media inquiries, email <a href="mailto:<?php echo esc_attr( $sv_info ); ?>"><?php echo esc_html( $sv_info ); ?></a>, or use our <a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>">contact form</a> and choose "Press." You can also follow us on <a href="<?php echo esc_url( SV_LINKEDIN ); ?>" target="_blank" rel="noopener">LinkedIn</a> and <a href="<?php echo esc_url( SV_INSTAGRAM ); ?>" target="_blank" rel="noopener">Instagram</a>.</p>
		</div>
	</div>
</section>

<?php get_footer(); ?>
