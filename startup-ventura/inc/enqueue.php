<?php
/**
 * Styles, scripts, self-hosted fonts, the Zeffy modal script, and optional GTM.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'wp_enqueue_scripts', 'sv_assets' );
function sv_assets() {
	$css = SV_DIR . '/assets/css/main.css';
	$js  = SV_DIR . '/assets/js/main.js';

	wp_enqueue_style(
		'sv-main',
		SV_URI . '/assets/css/main.css',
		array(),
		file_exists( $css ) ? filemtime( $css ) : SV_VERSION
	);

	wp_enqueue_script(
		'sv-main',
		SV_URI . '/assets/js/main.js',
		array(),
		file_exists( $js ) ? filemtime( $js ) : SV_VERSION,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	// Zeffy donation modal — bound to any element carrying zeffy-form-link (5.1).
	wp_enqueue_script(
		'zeffy-embed',
		SV_ZEFFY_SCRIPT,
		array(),
		null,
		array(
			'strategy'  => 'defer',
			'in_footer' => true,
		)
	);

	if ( is_singular() && comments_open() && get_option( 'thread_comments' ) ) {
		wp_enqueue_script( 'comment-reply' );
	}
}

/**
 * Preload the critical self-hosted font weights and emit the favicon.
 * Printed at the very top of <head> so they win the LCP race.
 */
add_action( 'wp_head', 'sv_head_preloads', 1 );
function sv_head_preloads() {
	$fonts = array(
		'assets/fonts/archivo-latin.woff2',      // Display (hero H1 / headers).
		'assets/fonts/hanken-latin.woff2',       // Body.
		'assets/fonts/spacemono-700-latin.woff2', // Eyebrows / data.
	);
	foreach ( $fonts as $rel ) {
		if ( file_exists( SV_DIR . '/' . $rel ) ) {
			printf(
				'<link rel="preload" href="%s" as="font" type="font/woff2" crossorigin>' . "\n",
				esc_url( SV_URI . '/' . $rel )
			);
		}
	}

	$favicon = SV_URI . '/assets/img/favicon.png';
	if ( file_exists( SV_DIR . '/assets/img/favicon.png' ) ) {
		printf( '<link rel="icon" href="%s" sizes="any">' . "\n", esc_url( $favicon ) );
		printf( '<link rel="apple-touch-icon" href="%s">' . "\n", esc_url( $favicon ) );
	}

	// Preload the front-page hero so it fetches in parallel with CSS (improves LCP).
	if ( is_front_page() && file_exists( SV_DIR . '/assets/img/hero.jpg' ) ) {
		printf(
			'<link rel="preload" href="%s" as="image" fetchpriority="high">' . "\n",
			esc_url( SV_URI . '/assets/img/hero.jpg' )
		);
	}
}

/* -------------------------------------------------------------------------
 * Google Tag Manager — output ONLY when SV_GTM_ID is non-empty (Section 6).
 * Inline snippets carry the CSP nonce so we never need 'unsafe-inline'.
 * ---------------------------------------------------------------------- */
add_action( 'wp_head', 'sv_gtm_head', 2 );
function sv_gtm_head() {
	if ( ! SV_GTM_ID ) {
		return;
	}
	$id    = sanitize_text_field( SV_GTM_ID );
	$nonce = function_exists( 'sv_csp_nonce' ) ? sv_csp_nonce() : '';
	$attr  = $nonce ? ' nonce="' . esc_attr( $nonce ) . '"' : '';
	echo "<!-- Google Tag Manager -->\n";
	echo '<script' . $attr . ">(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src='https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);})(window,document,'script','dataLayer','" . esc_js( $id ) . "');</script>\n"; // phpcs:ignore
	echo "<!-- End Google Tag Manager -->\n";
}

add_action( 'wp_body_open', 'sv_gtm_body' );
function sv_gtm_body() {
	if ( ! SV_GTM_ID ) {
		return;
	}
	$id = rawurlencode( SV_GTM_ID );
	printf(
		'<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=%s" height="0" width="0" style="display:none;visibility:hidden" title="Google Tag Manager"></iframe></noscript>' . "\n",
		esc_attr( $id )
	);
}
