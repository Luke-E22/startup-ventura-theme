<?php
/**
 * Compact three-number stat strip (Section 11). Reused on the home Why teaser
 * and both Partner pages. Three scannable numbers, nothing more.
 *
 * @param array $args stats[] (num, label)
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$stats = isset( $args['stats'] ) ? $args['stats'] : sv_stat_strip_data();
?>
<ul class="stat-strip reveal">
	<?php foreach ( $stats as $stat ) : ?>
		<li class="stat-strip__item">
			<div class="stat-strip__num"><?php echo esc_html( $stat['num'] ); ?></div>
			<div class="stat-strip__label"><?php echo esc_html( $stat['label'] ); ?></div>
		</li>
	<?php endforeach; ?>
</ul>
