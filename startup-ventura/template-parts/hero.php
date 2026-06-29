<?php
/**
 * Home hero (Section 4.5, treatment A). Navy gradient scrim over the graded
 * Ventura photo; the four-band wave sits at the bottom so the intro hands off
 * into the hero with the wave holding position.
 *
 * @param array $args eyebrow, h1 (kses HTML, coral keyword via <span class="coral">),
 *                    sub, note, image, image_alt
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$eyebrow = isset( $args['eyebrow'] ) ? $args['eyebrow'] : 'Ventura County · A 501(c)(3) Startup Accelerator';
$h1      = isset( $args['h1'] ) ? $args['h1'] : 'Great founders grow up <span class="coral">here.</span>';
$sub     = isset( $args['sub'] ) ? $args['sub'] : 'Startup Ventura backs local founders with the mentorship, capital connections, and community to build high-growth companies right here in Ventura County.';
$note    = isset( $args['note'] ) ? $args['note'] : 'Funds the inaugural Spring 2027 cohort.';
$img     = isset( $args['image'] ) ? $args['image'] : sv_img( 'hero.jpg' );
$alt     = isset( $args['image_alt'] ) ? $args['image_alt'] : 'Founders and supporters gathered in Ventura, California';
$allowed = array( 'span' => array( 'class' => array() ), 'br' => array(), 'em' => array() );
?>
<section class="hero">
	<img class="hero-bg-img" src="<?php echo esc_url( $img ); ?>" width="1600" height="1060" alt="<?php echo esc_attr( $alt ); ?>" fetchpriority="high" decoding="async">
	<div class="hero-scrim"></div>

	<div class="hero-inner">
		<p class="eyebrow"><?php echo esc_html( $eyebrow ); ?></p>
		<h1 class="display"><?php echo wp_kses( $h1, $allowed ); ?></h1>
		<p class="sub"><?php echo esc_html( $sub ); ?></p>
		<div class="cta-row">
			<?php sv_give_button( 'hero' ); ?>
			<?php sv_apply_button( 'hero', 'Apply', 'btn--ghost' ); ?>
		</div>
		<?php if ( $note ) : ?>
			<p class="cta-note"><?php echo esc_html( $note ); ?></p>
		<?php endif; ?>
	</div>

	<?php sv_wave(); ?>
</section>
