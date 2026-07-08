<?php
/**
 * Header: <head>, skip link, the play-once intro overlay, the sticky site
 * header (transparent over the home hero), and the mobile menu.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$sv_nonce = function_exists( 'sv_csp_nonce' ) ? sv_csp_nonce() : '';
?>
<!DOCTYPE html>
<html <?php language_attributes(); ?>>
<head>
	<meta charset="<?php bloginfo( 'charset' ); ?>">
	<meta name="viewport" content="width=device-width, initial-scale=1, viewport-fit=cover">
	<?php wp_head(); ?>
</head>
<body <?php body_class(); ?>>
<?php wp_body_open(); ?>
<?php
// Enable JS-gated progressive enhancements (scroll reveals) before first paint.
printf(
	'<script%s>document.documentElement.classList.add("js");</script>' . "\n",
	$sv_nonce ? ' nonce="' . esc_attr( $sv_nonce ) . '"' : '' // phpcs:ignore WordPress.Security.EscapeOutput
);
?>

<a class="skip-link" href="#main"><?php esc_html_e( 'Skip to content', 'startup-ventura' ); ?></a>

<header class="site-header<?php echo is_front_page() ? ' site-header--over-hero' : ''; ?>">
	<div class="wrap site-header__inner">
		<?php sv_site_brand(); ?>

		<nav class="primary-nav" aria-label="<?php esc_attr_e( 'Primary', 'startup-ventura' ); ?>">
			<?php sv_nav_menu( 'primary' ); ?>
		</nav>

		<div class="header-cta">
			<?php sv_give_button( 'header' ); ?>
			<button class="menu-toggle" type="button" aria-controls="sv-mobile-menu" aria-expanded="false">
				<span class="sr-only"><?php esc_html_e( 'Menu', 'startup-ventura' ); ?></span>
				<span class="bar" aria-hidden="true"></span>
				<span class="bar" aria-hidden="true"></span>
				<span class="bar" aria-hidden="true"></span>
			</button>
		</div>
	</div>
</header>

<div class="mobile-menu" id="sv-mobile-menu">
	<button class="mobile-menu__close" type="button" aria-label="<?php esc_attr_e( 'Close menu', 'startup-ventura' ); ?>">&times;</button>
	<nav aria-label="<?php esc_attr_e( 'Mobile', 'startup-ventura' ); ?>">
		<?php sv_nav_menu( 'primary', array( 'menu_class' => 'sv-menu mobile-menu__list' ) ); ?>
	</nav>
	<?php sv_give_button( 'mobile-menu', array( 'class' => 'btn--lg btn--full' ) ); ?>
</div>

<main id="main" class="site-main">
