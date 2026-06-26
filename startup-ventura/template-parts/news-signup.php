<?php
/**
 * Newsletter signup band for the News listing (index.php / archive.php).
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<div class="news-signup reveal">
	<div class="news-signup__copy">
		<h2 class="news-signup__title"><?php esc_html_e( 'Stay up to date with events and announcements', 'startup-ventura' ); ?></h2>
		<p class="muted"><?php esc_html_e( 'Get Startup Ventura news, events, and cohort updates in your inbox.', 'startup-ventura' ); ?></p>
	</div>
	<div class="news-signup__form">
		<?php
		get_template_part( 'template-parts/form', null, array(
			'type'   => 'newsletter',
			'submit' => 'Subscribe',
		) );
		?>
	</div>
</div>
