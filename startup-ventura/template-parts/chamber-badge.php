<?php
/**
 * Ventura Chamber of Commerce membership badge (footer trust cluster).
 *
 * The live ChamberMaster (MNI) member widget renders the official "Proud Member of
 * the Ventura Chamber of Commerce" badge (with the Chamber logo) into the empty
 * container below. The inline init script carries the CSP nonce, and
 * ventura.chambermaster.com is allowed in script-src/connect-src (see inc/security.php).
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$sv_nonce = function_exists( 'sv_csp_nonce' ) ? sv_csp_nonce() : '';
?>
<div class="chamber-badge">
	<div id="mni-membership-639181057588993752"></div>
</div>
<script src="https://ventura.chambermaster.com/Content/Script/Member.js" defer></script>
<script<?php echo $sv_nonce ? ' nonce="' . esc_attr( $sv_nonce ) . '"' : ''; // phpcs:ignore ?>>(function(){function go(){try{if(window.MNI&&MNI.Widgets&&MNI.Widgets.Member){new MNI.Widgets.Member("mni-membership-639181057588993752",{member:38811,styleTemplate:"#@id .mn-widget-member-name{font-weight:700}#@id .mn-widget-member-logo{max-width:100%}"}).create();return true;}}catch(e){}return false;}if(!go()){var n=0,t=setInterval(function(){if(go()||++n>40){clearInterval(t);}},150);}})();</script>
