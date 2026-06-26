<?php
/**
 * Theme setup: supports, menus, image sizes, and performance hygiene (3.6).
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'after_setup_theme', 'sv_setup' );
function sv_setup() {
	add_theme_support( 'title-tag' );
	add_theme_support( 'post-thumbnails' );
	add_theme_support( 'custom-logo', array(
		'height'      => 64,
		'width'       => 220,
		'flex-height' => true,
		'flex-width'  => true,
	) );
	add_theme_support( 'html5', array(
		'search-form', 'comment-form', 'comment-list', 'gallery', 'caption', 'style', 'script', 'navigation-widgets',
	) );
	add_theme_support( 'responsive-embeds' );
	add_theme_support( 'automatic-feed-links' );
	add_theme_support( 'editor-styles' );
	add_editor_style( 'assets/css/main.css' );

	register_nav_menus( array(
		'primary' => __( 'Primary Menu', 'startup-ventura' ),
		'footer'  => __( 'Footer Menu', 'startup-ventura' ),
	) );

	// Focal-point crops used by the theme (Section 4.6 — lock aspect ratios).
	add_image_size( 'sv-hero', 2000, 1100, true );
	add_image_size( 'sv-card', 800, 600, true );
	add_image_size( 'sv-team', 600, 720, true );
	add_image_size( 'sv-event', 1000, 750, true );
}

// Content width for embeds.
if ( ! isset( $content_width ) ) {
	$content_width = 1120;
}

/* -------------------------------------------------------------------------
 * Performance hygiene (3.6): trim WordPress bloat.
 * ---------------------------------------------------------------------- */
add_action( 'init', 'sv_trim_bloat' );
function sv_trim_bloat() {
	// Emoji detection script + styles.
	remove_action( 'wp_head', 'print_emoji_detection_script', 7 );
	remove_action( 'wp_print_styles', 'print_emoji_styles' );
	remove_action( 'admin_print_scripts', 'print_emoji_detection_script' );
	remove_action( 'admin_print_styles', 'print_emoji_styles' );
	remove_filter( 'the_content_feed', 'wp_staticize_emoji' );
	remove_filter( 'comment_text_rss', 'wp_staticize_emoji' );
	remove_filter( 'wp_mail', 'wp_staticize_emoji_for_email' );
	add_filter( 'tiny_mce_plugins', 'sv_disable_emojis_tinymce' );
	add_filter( 'wp_resource_hints', 'sv_remove_emoji_dns_prefetch', 10, 2 );

	// oEmbed discovery + host JS (we embed nothing that needs it).
	remove_action( 'wp_head', 'wp_oembed_add_discovery_links' );
	remove_action( 'wp_head', 'wp_oembed_add_host_js' );

	// Generator tag, shortlink, RSD, wlwmanifest, adjacent-post rels.
	remove_action( 'wp_head', 'wp_generator' );
	remove_action( 'wp_head', 'wp_shortlink_wp_head' );
	remove_action( 'wp_head', 'rsd_link' );
	remove_action( 'wp_head', 'wlwmanifest_link' );
	remove_action( 'wp_head', 'adjacent_posts_rel_link_wp_head' );

	// Disable XML-RPC (unused).
	add_filter( 'xmlrpc_enabled', '__return_false' );
}

function sv_disable_emojis_tinymce( $plugins ) {
	return is_array( $plugins ) ? array_diff( $plugins, array( 'wpemoji' ) ) : array();
}

function sv_remove_emoji_dns_prefetch( $urls, $relation_type ) {
	if ( 'dns-prefetch' === $relation_type ) {
		$urls = array_filter( $urls, function ( $url ) {
			return false === strpos( (string) $url, 's.w.org' );
		} );
	}
	return $urls;
}

/* Dequeue the global block-library CSS on pages that contain no blocks
 * (our hand-coded page templates), keeping it for the News posts that use it. */
add_action( 'wp_enqueue_scripts', 'sv_conditional_block_css', 100 );
function sv_conditional_block_css() {
	if ( is_admin() ) {
		return;
	}
	$keep = is_singular( 'post' ) || is_home() || is_archive() || is_search();
	if ( ! $keep ) {
		wp_dequeue_style( 'wp-block-library' );
		wp_dequeue_style( 'wp-block-library-theme' );
		wp_dequeue_style( 'global-styles' );
		wp_dequeue_style( 'classic-theme-styles' );
	}
}
