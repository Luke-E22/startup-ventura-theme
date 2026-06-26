<?php
/**
 * Numbered process step (01–05) — a real sequence (Section 10).
 *
 * @param array $args num, title, body
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$num   = isset( $args['num'] ) ? $args['num'] : '';
$title = isset( $args['title'] ) ? $args['title'] : '';
$body  = isset( $args['body'] ) ? $args['body'] : '';
?>
<div class="step reveal">
	<div class="step__num" aria-hidden="true"><?php echo esc_html( $num ); ?></div>
	<div class="step__content">
		<h3 class="step__title"><?php echo esc_html( $title ); ?></h3>
		<p class="step__body"><?php echo esc_html( $body ); ?></p>
	</div>
</div>
