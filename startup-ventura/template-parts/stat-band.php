<?php
/**
 * Navy stat band with mono numerals that count up on scroll, over a faint
 * wave watermark (Section 4.11).
 *
 * @param array $args stats[], eyebrow, heading
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$stats   = isset( $args['stats'] ) ? $args['stats'] : sv_stats();
$eyebrow = isset( $args['eyebrow'] ) ? $args['eyebrow'] : '';
$heading = isset( $args['heading'] ) ? $args['heading'] : '';
?>
<section class="section stat-band">
	<?php sv_wave(); ?>
	<div class="wrap" style="position:relative;z-index:2">
		<?php if ( $eyebrow || $heading ) : ?>
			<?php sv_section_header( $eyebrow, $heading, array( 'align' => 'center', 'light' => true ) ); ?>
		<?php endif; ?>
		<div class="stat-band__grid">
			<?php foreach ( $stats as $stat ) : ?>
				<div class="stat reveal">
					<?php if ( isset( $stat['count'] ) ) :
						$prefix = isset( $stat['prefix'] ) ? $stat['prefix'] : '';
						$suffix = isset( $stat['suffix'] ) ? $stat['suffix'] : '';
						?>
						<div class="stat__num" data-count="<?php echo esc_attr( $stat['count'] ); ?>" data-prefix="<?php echo esc_attr( $prefix ); ?>" data-suffix="<?php echo esc_attr( $suffix ); ?>"><?php
							echo esc_html( $prefix . $stat['count'] );
							if ( $suffix ) {
								echo '<span class="unit">' . esc_html( $suffix ) . '</span>';
							}
						?></div>
					<?php else : ?>
						<div class="stat__num"><?php echo esc_html( isset( $stat['text'] ) ? $stat['text'] : '' ); ?></div>
					<?php endif; ?>
					<div class="stat__label"><?php echo esc_html( $stat['label'] ); ?></div>
				</div>
			<?php endforeach; ?>
		</div>
	</div>
</section>
