<?php
/**
 * Full-width closing CTA band (Section 7). Give primary; an optional subordinate
 * secondary (Apply on program pages, Partner on case pages).
 *
 * @param array $args eyebrow, heading, location, secondary (none|apply|partner), give_note
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$eyebrow   = isset( $args['eyebrow'] ) ? $args['eyebrow'] : 'The Ask';
$heading   = isset( $args['heading'] ) ? $args['heading'] : 'Help us launch Ventura County\'s first founder cohort.';
$location  = isset( $args['location'] ) ? $args['location'] : 'band';
$secondary = isset( $args['secondary'] ) ? $args['secondary'] : 'none';
$give_note = isset( $args['give_note'] ) ? $args['give_note'] : '';
?>
<section class="section cta-band">
	<?php sv_wave(); ?>
	<div class="wrap cta-band__inner reveal">
		<p class="eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
		<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
		<h2 class="cta-band__title"><?php echo esc_html( $heading ); ?></h2>
		<div class="cta-band__actions">
			<?php sv_give_button( $location, array( 'class' => 'btn--lg' ) ); ?>
			<?php
			if ( 'apply' === $secondary ) {
				sv_apply_button( $location, 'Apply to the cohort', 'btn--ghost' );
			} elseif ( 'partner' === $secondary ) {
				sv_partner_button( $location, 'Partner with us', 'btn--ghost' );
			}
			?>
		</div>
		<?php if ( $give_note ) : ?>
			<p class="cta-band__note"><?php echo esc_html( $give_note ); ?></p>
		<?php endif; ?>
	</div>
</section>
