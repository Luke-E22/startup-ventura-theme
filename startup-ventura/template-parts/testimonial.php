<?php
/**
 * Testimonial card with an oversized coral quote mark and a mono attribution (4.8).
 *
 * @param array $args quote, author, feature (bool)
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$quote   = isset( $args['quote'] ) ? $args['quote'] : '';
$author  = isset( $args['author'] ) ? $args['author'] : '';
$feature = ! empty( $args['feature'] );
if ( ! $quote ) {
	return;
}
?>
<figure class="testimonial reveal<?php echo $feature ? ' testimonial--feature' : ''; ?>">
	<span class="testimonial__mark" aria-hidden="true">&ldquo;</span>
	<blockquote class="testimonial__quote"><?php echo esc_html( $quote ); ?></blockquote>
	<?php if ( $author ) : ?>
		<figcaption class="testimonial__attr"><?php echo esc_html( $author ); ?></figcaption>
	<?php endif; ?>
</figure>
