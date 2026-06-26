<?php
/**
 * The wave signature (Section 4.3). One geometry reused everywhere.
 *
 * @param array $args variant: 'full' (hero/stat/cta watermark) | 'divider' (section seam)
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$variant = isset( $args['variant'] ) ? $args['variant'] : 'full';

if ( 'divider' === $variant ) : ?>
	<div class="wave-divider" aria-hidden="true">
		<svg viewBox="0 0 1440 70" preserveAspectRatio="none" width="100%" height="64" focusable="false">
			<path d="M0,32 C300,6 560,56 840,33 C1080,14 1260,50 1440,30 L1440,70 L0,70 Z" fill="#78B4D8" opacity=".20"></path>
			<path d="M0,42 C300,16 560,64 840,42 C1080,22 1260,56 1440,38 L1440,70 L0,70 Z" fill="#5484A8" opacity=".18"></path>
			<path class="crest-path" d="M0,32 C300,6 560,56 840,33 C1080,14 1260,50 1440,30" fill="none" stroke="#FF8A80" stroke-width="2.5" vector-effect="non-scaling-stroke"></path>
		</svg>
	</div>
<?php else : ?>
	<div class="wave" aria-hidden="true">
		<div class="band band1"><svg viewBox="0 0 1440 320" preserveAspectRatio="none" focusable="false"><path d="M0,90 C300,45 560,125 840,80 C1080,40 1260,110 1440,75 L1440,320 L0,320 Z" fill="#78B4D8"/></svg></div>
		<div class="band band2"><svg viewBox="0 0 1440 320" preserveAspectRatio="none" focusable="false"><path d="M0,140 C300,95 560,175 840,130 C1080,90 1260,160 1440,125 L1440,320 L0,320 Z" fill="#5484A8"/></svg></div>
		<div class="band band3"><svg viewBox="0 0 1440 320" preserveAspectRatio="none" focusable="false"><path d="M0,190 C300,145 560,225 840,180 C1080,140 1260,210 1440,175 L1440,320 L0,320 Z" fill="#316194"/></svg></div>
		<div class="band band4"><svg viewBox="0 0 1440 320" preserveAspectRatio="none" focusable="false"><path d="M0,240 C300,195 560,275 840,230 C1080,190 1260,260 1440,225 L1440,320 L0,320 Z" fill="#243C48"/></svg></div>
		<div class="crest"><svg viewBox="0 0 1440 320" preserveAspectRatio="none" focusable="false"><path d="M0,90 C300,45 560,125 840,80 C1080,40 1260,110 1440,75" fill="none" stroke="#FF8A80" stroke-width="3" vector-effect="non-scaling-stroke"/></svg></div>
	</div>
<?php endif; ?>
