<?php
/**
 * Partner logos — one uniform grayscale treatment, color on hover (4.7).
 * Degrades to a styled text name if a logo file is not present yet.
 *
 * @param array $args partners[] (name, logo, desc), variant: 'logos' | 'list'
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$partners = isset( $args['partners'] ) ? $args['partners'] : sv_partners();
$variant  = isset( $args['variant'] ) ? $args['variant'] : 'logos';

/** True if the logo asset exists on disk. */
$sv_has_logo = function ( $rel ) {
	return $rel && file_exists( SV_DIR . '/assets/img/' . ltrim( $rel, '/' ) );
};

if ( 'list' === $variant ) : ?>
	<div class="partner-list">
		<?php foreach ( $partners as $p ) : ?>
			<div class="partner-list__item reveal">
				<?php if ( $sv_has_logo( $p['logo'] ) ) : ?>
					<img src="<?php echo sv_img( $p['logo'] ); ?>" loading="lazy" decoding="async" alt="<?php echo esc_attr( $p['name'] ); ?>">
				<?php else : ?>
					<span class="partner__name"><?php echo esc_html( $p['name'] ); ?></span>
				<?php endif; ?>
				<p class="partner-list__desc"><strong><?php echo esc_html( $p['name'] ); ?></strong><br><?php echo esc_html( $p['desc'] ); ?></p>
			</div>
		<?php endforeach; ?>
	</div>
<?php else : ?>
	<div class="partner-row reveal">
		<?php foreach ( $partners as $p ) : ?>
			<div class="partner">
				<?php if ( $sv_has_logo( $p['logo'] ) ) : ?>
					<img src="<?php echo sv_img( $p['logo'] ); ?>" height="64" loading="lazy" decoding="async" alt="<?php echo esc_attr( $p['name'] ); ?>">
				<?php else : ?>
					<span class="partner__name"><?php echo esc_html( $p['name'] ); ?></span>
				<?php endif; ?>
			</div>
		<?php endforeach; ?>
	</div>
<?php endif; ?>
