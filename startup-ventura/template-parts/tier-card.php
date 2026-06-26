<?php
/**
 * Founder's Circle tier card (Section 9). Legacy is visually elevated (4.8).
 * Each card's button opens the same Zeffy modal.
 *
 * @param array $args tier (name, amount, benefits[], legacy, ribbon)
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$tier = isset( $args['tier'] ) ? $args['tier'] : $args;
if ( empty( $tier['name'] ) ) {
	return;
}
$is_legacy = ! empty( $tier['legacy'] );
$loc       = 'tier-' . sanitize_title( $tier['name'] );
?>
<article class="tier<?php echo $is_legacy ? ' tier--legacy' : ''; ?> reveal">
	<?php if ( $is_legacy && ! empty( $tier['ribbon'] ) ) : ?>
		<span class="tier__ribbon"><?php echo esc_html( $tier['ribbon'] ); ?></span>
	<?php endif; ?>
	<h3 class="tier__name"><?php echo esc_html( $tier['name'] ); ?></h3>
	<p class="tier__price"><?php echo esc_html( $tier['amount'] ); ?></p>
	<ul class="tier__list">
		<?php foreach ( (array) $tier['benefits'] as $benefit ) :
			$incl = ( 0 === strpos( $benefit, 'Everything' ) );
			?>
			<li class="<?php echo $incl ? 'tier__incl' : ''; ?>"><?php echo esc_html( $benefit ); ?></li>
		<?php endforeach; ?>
	</ul>
	<div class="tier__cta">
		<?php sv_give_button( $loc, array( 'label' => 'Give ' . $tier['amount'], 'class' => 'btn--full' . ( $is_legacy ? ' btn--lg' : '' ) ) ); ?>
	</div>
</article>
