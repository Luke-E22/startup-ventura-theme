<?php
/**
 * Breadcrumbs + BreadcrumbList JSON-LD (Section 3.5 / 15). Sub-pages only.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
if ( is_front_page() ) {
	return;
}

$crumbs = array();
$crumbs[] = array( 'name' => 'Home', 'url' => home_url( '/' ) );

if ( is_page() ) {
	$ancestors = array_reverse( get_post_ancestors( get_the_ID() ) );
	foreach ( $ancestors as $aid ) {
		$crumbs[] = array( 'name' => get_the_title( $aid ), 'url' => get_permalink( $aid ) );
	}
	$crumbs[] = array( 'name' => get_the_title(), 'url' => '' );
} elseif ( is_singular( 'post' ) ) {
	$blog = get_option( 'page_for_posts' );
	if ( $blog ) {
		$crumbs[] = array( 'name' => get_the_title( $blog ), 'url' => get_permalink( $blog ) );
	}
	$crumbs[] = array( 'name' => get_the_title(), 'url' => '' );
} elseif ( is_home() ) {
	$crumbs[] = array( 'name' => single_post_title( '', false ), 'url' => '' );
} elseif ( is_search() ) {
	$crumbs[] = array( 'name' => 'Search results', 'url' => '' );
} elseif ( is_archive() ) {
	$crumbs[] = array( 'name' => wp_strip_all_tags( get_the_archive_title() ), 'url' => '' );
} elseif ( is_404() ) {
	$crumbs[] = array( 'name' => 'Page not found', 'url' => '' );
}

$total = count( $crumbs );
?>
<nav class="breadcrumbs wrap" aria-label="<?php esc_attr_e( 'Breadcrumb', 'startup-ventura' ); ?>">
	<ol>
		<?php foreach ( $crumbs as $i => $crumb ) : ?>
			<li>
				<?php if ( $crumb['url'] && $i < $total - 1 ) : ?>
					<a href="<?php echo esc_url( $crumb['url'] ); ?>"><?php echo esc_html( $crumb['name'] ); ?></a>
				<?php else : ?>
					<span aria-current="page"><?php echo esc_html( $crumb['name'] ); ?></span>
				<?php endif; ?>
			</li>
		<?php endforeach; ?>
	</ol>
</nav>
<?php
$items = array();
foreach ( $crumbs as $i => $crumb ) {
	$entry = array(
		'@type'    => 'ListItem',
		'position' => $i + 1,
		'name'     => $crumb['name'],
	);
	if ( $crumb['url'] ) {
		$entry['item'] = $crumb['url'];
	}
	$items[] = $entry;
}
if ( function_exists( 'sv_jsonld' ) ) {
	sv_jsonld( array(
		'@context'        => 'https://schema.org',
		'@type'           => 'BreadcrumbList',
		'itemListElement' => $items,
	) );
}
