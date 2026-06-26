<?php
/**
 * Board / team card. Bio expands on click via a native <details> (works
 * without JavaScript and is keyboard-accessible by default).
 *
 * @param array $args member (name, role, photo, linkedin, bio)
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$m = isset( $args['member'] ) ? $args['member'] : $args;
if ( empty( $m['name'] ) ) {
	return;
}
$sv_open = ! empty( $args['open'] ); // open bios by default (e.g. on the About page).
// Photo framing: object-position aligns the face; optional zoom scales it (the
// card clips overflow), so faces across the board read at a similar size.
$sv_pos    = ! empty( $m['pos'] ) ? $m['pos'] : '';
$sv_pstyle = $sv_pos ? 'object-position:' . $sv_pos . ';' : '';
if ( ! empty( $m['zoom'] ) ) {
	$sv_pstyle .= 'transform:scale(' . (float) $m['zoom'] . ');transform-origin:' . ( $sv_pos ? $sv_pos : 'center' ) . ';';
}
?>
<article class="board-card reveal">
	<?php if ( ! empty( $m['photo'] ) ) : ?>
		<div class="board-card__media">
			<img class="board-card__photo" src="<?php echo sv_img( $m['photo'] ); ?>" width="600" height="720" loading="lazy" decoding="async"<?php echo $sv_pstyle ? ' style="' . esc_attr( $sv_pstyle ) . '"' : ''; ?> alt="<?php echo esc_attr( $m['name'] . ', ' . $m['role'] ); ?>">
		</div>
	<?php endif; ?>
	<div class="board-card__body">
		<h3 class="board-card__name"><?php echo esc_html( $m['name'] ); ?></h3>
		<p class="board-card__role"><?php echo esc_html( $m['role'] ); ?></p>
		<?php if ( ! empty( $m['bio'] ) ) : ?>
			<details class="board-card__details"<?php echo $sv_open ? ' open' : ''; ?>>
				<summary><?php echo $sv_open ? esc_html__( 'Bio', 'startup-ventura' ) : esc_html__( 'Read bio', 'startup-ventura' ); ?></summary>
				<p class="board-card__bio"><?php echo esc_html( $m['bio'] ); ?></p>
			</details>
		<?php endif; ?>
		<?php if ( ! empty( $m['linkedin'] ) ) : ?>
			<p class="board-card__links">
				<a href="<?php echo esc_url( $m['linkedin'] ); ?>" target="_blank" rel="noopener">
					<?php
					/* translators: %s: person's name. */
					printf( esc_html__( 'LinkedIn', 'startup-ventura' ) . ' &nearr;<span class="sr-only"> — %s, opens in a new tab</span>', esc_html( $m['name'] ) );
					?>
				</a>
			</p>
		<?php endif; ?>
	</div>
</article>
