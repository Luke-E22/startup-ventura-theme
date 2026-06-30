<?php
/**
 * Ventura Chamber of Commerce membership badge (footer trust cluster).
 *
 * A static "Proud member of" lockup: the Chamber logo (self-hosted) linking to
 * Startup Ventura's verified listing on the Chamber directory. Replaced the live
 * ChamberMaster (MNI) widget, which rendered a boxed, white-padded card.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
?>
<a class="chamber-badge" href="https://ventura.chambermaster.com/list/member/startup-ventura-38811" target="_blank" rel="noopener">
	<span class="chamber-badge__label"><?php esc_html_e( 'Proud member of the', 'startup-ventura' ); ?></span>
	<img class="chamber-badge__logo" src="<?php echo sv_img( 'partners/ventura-chamber.png' ); ?>" width="800" height="266" alt="<?php esc_attr_e( 'Ventura Chamber of Commerce', 'startup-ventura' ); ?>" loading="lazy" decoding="async">
</a>
