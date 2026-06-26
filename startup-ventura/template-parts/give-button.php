<?php
/**
 * Give button (Section 5.2). Zeffy binds to [zeffy-form-link] and opens the
 * modal on click. <noscript> falls back to the hosted Zeffy page.
 *
 * @param array $args location, label, class, note
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$loc   = isset( $args['location'] ) ? $args['location'] : 'page';
$label = isset( $args['label'] ) ? $args['label'] : 'Give';
$class = isset( $args['class'] ) ? $args['class'] : '';
$note  = isset( $args['note'] ) ? $args['note'] : '';
?>
<button class="btn btn--give<?php echo $class ? ' ' . esc_attr( $class ) : ''; ?>"
        zeffy-form-link="<?php echo esc_attr( SV_ZEFFY_MODAL ); ?>"
        data-cta="give" data-cta-location="<?php echo esc_attr( $loc ); ?>"><?php echo esc_html( $label ); ?></button>
<noscript><a class="btn btn--give<?php echo $class ? ' ' . esc_attr( $class ) : ''; ?>" href="<?php echo esc_url( SV_ZEFFY_PAGE ); ?>"><?php echo esc_html( $label ); ?></a></noscript>
<?php if ( $note ) : ?>
	<p class="cta-note give-note"><?php echo esc_html( $note ); ?></p>
<?php endif; ?>
