<?php
/**
 * Ventura Chamber of Commerce membership badge (footer trust cluster).
 *
 * The live ChamberMaster (MNI) member widget replaces the inner content when its
 * external script loads; until then (or if it is blocked) the on-brand fallback
 * badge shows, so the slot always looks finished. The inline init script carries
 * the CSP nonce, and ventura.chambermaster.com is allowed in script-src/connect-src
 * (see inc/security.php).
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$sv_nonce = function_exists( 'sv_csp_nonce' ) ? sv_csp_nonce() : '';
?>
<div class="chamber-badge">
	<div id="mni-membership-639181057588993752">
		<a class="chamber-badge__fallback" href="https://ventura.chambermaster.com/list/member/startup-ventura-38811" target="_blank" rel="noopener">
			<svg class="chamber-badge__icon" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M5 21V10l7-4 7 4v11M9 21v-5h6v5M9 13h.01M15 13h.01"/></svg>
			<span class="chamber-badge__text"><span class="chamber-badge__eyebrow"><?php esc_html_e( 'Proud Member', 'startup-ventura' ); ?></span><span class="chamber-badge__name"><?php esc_html_e( 'Ventura Chamber of Commerce', 'startup-ventura' ); ?></span></span>
		</a>
	</div>
</div>
<script src="https://ventura.chambermaster.com/Content/Script/Member.js" defer></script>
<script<?php echo $sv_nonce ? ' nonce="' . esc_attr( $sv_nonce ) . '"' : ''; // phpcs:ignore ?>>(function(){function go(){try{if(window.MNI&&MNI.Widgets&&MNI.Widgets.Member){new MNI.Widgets.Member("mni-membership-639181057588993752",{member:38811,styleTemplate:"#@id .mn-widget-member-name{font-weight:700}#@id .mn-widget-member-logo{max-width:100%}"}).create();return true;}}catch(e){}return false;}if(!go()){var n=0,t=setInterval(function(){if(go()||++n>40){clearInterval(t);}},150);}})();</script>
