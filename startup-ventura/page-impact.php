<?php
/**
 * Impact (/impact) — the impact calculator up top, then where every dollar goes.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<?php sv_breadcrumbs(); ?>

<?php // ===== Page head + Impact Calculator (embedded, sandboxed, auto-resizing) ===== ?>
<section class="section" style="padding-top:0">
	<div class="wrap">
		<header class="page-head">
			<p class="eyebrow">Impact</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display">Model your impact</h1>
			<p class="lede">See what your support builds in Ventura County: program longevity, jobs, and startup revenue. Adjust the inputs to explore the numbers.</p>
		</header>
		<iframe id="sv-impact-calc"
			src="<?php echo esc_url( SV_URI . '/assets/impact-calculator.html' ); ?>"
			title="Startup Ventura Impact Calculator"
			loading="lazy"
			style="width:100%;border:0;min-height:1200px;display:block"></iframe>
	</div>
</section>
<script<?php echo function_exists( 'sv_csp_nonce' ) && sv_csp_nonce() ? ' nonce="' . esc_attr( sv_csp_nonce() ) . '"' : ''; ?>>
(function(){
	window.addEventListener('message', function(e){
		if ( e.origin !== window.location.origin ) { return; }
		if ( e && e.data && e.data.type === 'sv-impact-calc-height' ) {
			var f = document.getElementById('sv-impact-calc');
			if ( f ) { f.style.height = e.data.height + 'px'; }
		}
	});
})();
</script>

<?php // ===== Where it goes ===== ?>
<section class="section section--pale">
	<div class="wrap wrap--narrow">
		<?php sv_section_header( 'Where it goes', 'Every dollar stays in Ventura County.' ); ?>
		<p class="lede reveal">Your gift backs Ventura County founders and the program that supports them. It does not leave the county. Local innovation drives local jobs, and that is how we keep our best people here.</p>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, no secondary ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Give Ventura County\'s founders a reason to stay.',
	'location'  => 'impact-close',
	'secondary' => 'none',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
