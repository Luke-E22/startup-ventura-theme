<?php
/**
 * Startup Ventura theme bootstrap.
 *
 * The client edits ONLY the CONFIG block below. Everything else lives in inc/.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit; // No direct access.
}

/* =========================================================================
 * CONFIG — the only block the client needs to edit.
 * Replace every [BRACKETED] placeholder before launch (see section 20).
 * ========================================================================= */
define( 'SV_APPLICATION_URL', '[APPLICATION_URL]' ); // Cohort application; built separately in Claude Code.
define( 'SV_ZEFFY_MODAL',  'https://www.zeffy.com/embed/donation-form/donate-to-startup-ventura?modal=true' );
define( 'SV_ZEFFY_PAGE',   'https://www.zeffy.com/en-US/donation-form/donate-to-startup-ventura' );
define( 'SV_ZEFFY_SCRIPT', 'https://zeffy-scripts.s3.ca-central-1.amazonaws.com/embed-form-script.min.js' );
define( 'SV_EMAIL_INFO',    'info@startupventura.com' );
define( 'SV_EMAIL_SPONSOR', 'sponsor@startupventura.com' );
define( 'SV_LINKEDIN',  'https://www.linkedin.com/company/startup-ventura' );
define( 'SV_INSTAGRAM', 'https://www.instagram.com/startup_ventura/' );
define( 'SV_GTM_ID',    '' );            // Add later; when blank, all GTM output is suppressed.
define( 'SV_EIN',       '39-2204612' );

// Cloudflare Turnstile spam protection (free). Leave blank to fall back to the
// honeypot only; add both keys to enable the widget + server verification.
define( 'SV_TURNSTILE_SITEKEY', '' );
define( 'SV_TURNSTILE_SECRET',  '' );
// Optional "notify me when S27 applications open" list endpoint (else info@).
define( 'SV_NOTIFY_EMAIL', SV_EMAIL_INFO );
define( 'SV_COHORT_LABEL', 'Spring 2027 (S27)' );
define( 'SV_COHORT_START', '[COHORT_START]' );
define( 'SV_COHORT_END',   '[COHORT_END]' );
define( 'SV_APP_OPEN',     '[APPLICATIONS_OPEN]' );
define( 'SV_APP_CLOSE',    '[APPLICATIONS_CLOSE]' );

/* CSP enforcement toggle. Ship FALSE (Report-Only) until a real test donation
 * — including Apple/Google Pay — passes, then set TRUE to enforce. (Section 16) */
define( 'SV_CSP_ENFORCE', false );

/* =========================================================================
 * Bootstrap — load the theme modules. (Do not edit below.)
 * ========================================================================= */
define( 'SV_DIR', get_template_directory() );
define( 'SV_URI', get_template_directory_uri() );
define( 'SV_VERSION', '1.0.0' );

require_once SV_DIR . '/inc/helpers.php';  // Render helpers used everywhere.
require_once SV_DIR . '/inc/setup.php';    // Theme supports, menus, performance hygiene.
require_once SV_DIR . '/inc/enqueue.php';  // Styles, scripts, fonts, Zeffy, GTM.
require_once SV_DIR . '/inc/security.php';  // Security headers + CSP.
require_once SV_DIR . '/inc/schema.php';   // SEO meta + JSON-LD structured data.
require_once SV_DIR . '/inc/forms.php';    // Contact + partner form handlers.
if ( file_exists( SV_DIR . '/inc/seed.php' ) ) {
	require_once SV_DIR . '/inc/seed.php';  // One-time seed of the Annual Benefit recap post.
}
