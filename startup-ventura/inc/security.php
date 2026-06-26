<?php
/**
 * Security + trust headers, including a Stripe/Zeffy-aware Content-Security-Policy.
 *
 * Ships as Content-Security-Policy-Report-Only until SV_CSP_ENFORCE is true, so a
 * real test donation (incl. Apple/Google Pay) can be verified before enforcement.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/**
 * One CSP nonce per request, shared by every inline <script> we emit
 * (GTM + JSON-LD). Lets us avoid 'unsafe-inline' in script-src.
 */
function sv_csp_nonce() {
	static $nonce = null;
	if ( null === $nonce ) {
		$nonce = wp_generate_password( 24, false, false );
	}
	return $nonce;
}

add_action( 'send_headers', 'sv_security_headers' );
function sv_security_headers() {
	if ( is_admin() ) {
		return;
	}

	header( 'X-Content-Type-Options: nosniff' );
	header( 'Referrer-Policy: strict-origin-when-cross-origin' );
	header( 'X-Frame-Options: SAMEORIGIN' );
	header( 'Permissions-Policy: geolocation=(), microphone=(), camera=(), payment=(self "https://www.zeffy.com" "https://js.stripe.com"), interest-cohort=()' );

	// HSTS only over HTTPS (2 years, preload-ready).
	if ( is_ssl() ) {
		header( 'Strict-Transport-Security: max-age=63072000; includeSubDomains; preload' );
	}

	$nonce = sv_csp_nonce();
	$csp   = implode( '; ', array(
		"default-src 'self'",
		"base-uri 'self'",
		"object-src 'none'",
		"frame-ancestors 'self'",
		"form-action 'self' https://www.zeffy.com",
		"script-src 'self' 'nonce-{$nonce}' https://zeffy-scripts.s3.ca-central-1.amazonaws.com https://js.stripe.com https://www.googletagmanager.com",
		"frame-src https://www.zeffy.com https://js.stripe.com https://hooks.stripe.com",
		"connect-src 'self' https://www.zeffy.com https://*.stripe.com https://www.google-analytics.com https://www.googletagmanager.com",
		"img-src 'self' data: https:",
		"style-src 'self' 'unsafe-inline'",
		"font-src 'self'",
	) );

	$header = SV_CSP_ENFORCE ? 'Content-Security-Policy' : 'Content-Security-Policy-Report-Only';
	header( $header . ': ' . $csp );
}
