<?php
/**
 * SEO meta tags (description, canonical, Open Graph, Twitter) and JSON-LD.
 *
 * A page template may override the description or share image BEFORE calling
 * get_header() by setting:
 *   $GLOBALS['sv_meta']['description'] = '...';
 *   $GLOBALS['sv_meta']['image']       = 'https://.../custom.jpg';
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Resolve the meta description for the current view. */
function sv_meta_description() {
	if ( ! empty( $GLOBALS['sv_meta']['description'] ) ) {
		return $GLOBALS['sv_meta']['description'];
	}

	// Hand-written per-page descriptions: intent plus local plus audience keywords.
	if ( is_front_page() ) {
		return 'Startup Ventura is a 501(c)(3) nonprofit startup accelerator in Ventura County. Donate to fund the inaugural Spring 2027 founder cohort, apply, or partner with us.';
	}
	if ( is_page() ) {
		$sv_q     = get_queried_object();
		$sv_pages = array(
			'give'                => 'Donate to fund Ventura County\'s first startup accelerator cohort, launching Spring 2027. Startup Ventura is a 501(c)(3), so your gift is tax-deductible.',
			'impact'              => 'See Startup Ventura\'s traction and where your gift goes, from jobs to founder revenue, and model your own impact with the Ventura County cohort calculator.',
			'partner'             => 'Partner with Startup Ventura. Cities, the county, foundations, and corporate sponsors backing high-growth founders across Ventura County.',
			'partner-foundations' => 'Foundation and corporate giving for Startup Ventura, a 501(c)(3) accelerator in Ventura County. Sponsorship levels, grants, and partner recognition.',
			'foundations'         => 'Foundation and corporate giving for Startup Ventura, a 501(c)(3) accelerator in Ventura County. Sponsorship levels, grants, and partner recognition.',
			'partner-government'  => 'A public-private economic development partner for Ventura County cities and the county. Keep founders, jobs, and the tax base local.',
			'cities-county'       => 'A public-private economic development partner for Ventura County cities and the county. Keep founders, jobs, and the tax base local.',
			'why-ventura-county'  => 'Why Ventura County loses its best founders, and how Startup Ventura keeps high-growth companies and the jobs they create at home.',
			'accelerator'         => 'A 7-week accelerator for Ventura County founders. Mentorship, capital connections, workshops, and a Demo Day. Join the Spring 2027 notify list.',
			'program'             => 'The Startup Ventura program: a 7-week accelerator plus a workshop series for Ventura County founders, ending in a Demo Day.',
			'workshops'           => 'Startup Ventura\'s founder workshop series, the on-ramp to the accelerator for early-stage founders in Ventura County.',
			'about'               => 'Startup Ventura is a 501(c)(3) nonprofit keeping Ventura County the best place to build, led by operators behind Curri, SevenRooms, and the Ventura Chamber.',
			'lukeerickson'        => 'Luke Erickson is the founder and Executive Director of Startup Ventura, the 501(c)(3) startup accelerator backing founders in Ventura County, California.',
			'donor-wall'          => 'The donors and community partners funding Startup Ventura\'s inaugural Spring 2027 cohort. Founder\'s Circle recognition and founding supporters.',
			'contact'             => 'Contact Startup Ventura for general questions, press, major gifts, sponsorship, mentoring, and investor inquiries. Based in Ventura County, California.',
			'press'               => 'Press and media kit for Startup Ventura, the Ventura County nonprofit startup accelerator. Logos, boilerplate, EIN, board bios, and a press contact.',
			'privacy'             => 'How Startup Ventura collects, uses, and protects the information you share through donations and forms on this site.',
			'terms'               => 'The terms that govern your use of the Startup Ventura website.',
		);
		if ( $sv_q && isset( $sv_pages[ $sv_q->post_name ] ) ) {
			return $sv_pages[ $sv_q->post_name ];
		}
	}

	$desc = '';
	if ( is_singular() ) {
		$post = get_queried_object();
		if ( $post && has_excerpt( $post ) ) {
			$desc = get_the_excerpt( $post );
		} elseif ( $post ) {
			$desc = wp_strip_all_tags( $post->post_content );
		}
	} elseif ( is_category() || is_tag() || is_tax() ) {
		$desc = term_description();
	}
	if ( ! $desc ) {
		$desc = get_bloginfo( 'description' );
	}
	if ( ! $desc ) {
		$desc = 'Startup Ventura backs local founders with the mentorship, capital connections, and community to build high-growth companies right here in Ventura County.';
	}
	$desc = wp_strip_all_tags( $desc );
	return trim( mb_substr( $desc, 0, 200 ) );
}

/** Resolve the share image. */
function sv_meta_image() {
	if ( ! empty( $GLOBALS['sv_meta']['image'] ) ) {
		return $GLOBALS['sv_meta']['image'];
	}
	if ( is_singular() && has_post_thumbnail() ) {
		$src = wp_get_attachment_image_url( get_post_thumbnail_id(), 'full' );
		if ( $src ) {
			return $src;
		}
	}
	foreach ( array( 'og/og-default.jpg', 'og/og-default.png', 'hero.jpg' ) as $cand ) {
		if ( file_exists( SV_DIR . '/assets/img/' . $cand ) ) {
			return SV_URI . '/assets/img/' . $cand;
		}
	}
	return '';
}

add_action( 'wp_head', 'sv_seo_meta', 5 );
function sv_seo_meta() {
	$desc  = sv_meta_description();
	$image = sv_meta_image();
	$url   = is_singular() ? get_permalink() : home_url( add_query_arg( array(), $GLOBALS['wp']->request ?? '' ) );
	if ( is_front_page() ) {
		$url = home_url( '/' );
	}
	$title = wp_get_document_title();

	echo "\n<!-- SEO -->\n";
	printf( '<meta name="description" content="%s">' . "\n", esc_attr( $desc ) );
	printf( '<link rel="canonical" href="%s">' . "\n", esc_url( $url ) );

	// Open Graph.
	printf( '<meta property="og:type" content="%s">' . "\n", is_singular( 'post' ) ? 'article' : 'website' );
	printf( '<meta property="og:site_name" content="%s">' . "\n", esc_attr( get_bloginfo( 'name' ) ) );
	printf( '<meta property="og:title" content="%s">' . "\n", esc_attr( $title ) );
	printf( '<meta property="og:description" content="%s">' . "\n", esc_attr( $desc ) );
	printf( '<meta property="og:url" content="%s">' . "\n", esc_url( $url ) );
	printf( '<meta property="og:locale" content="%s">' . "\n", esc_attr( get_locale() ) );
	if ( $image ) {
		// Default to the 1200x630 OG card; use the real dimensions for a post's
		// featured image (e.g. the square headshot) so social crops are correct.
		$img_w = 1200;
		$img_h = 630;
		if ( is_singular() && has_post_thumbnail() && empty( $GLOBALS['sv_meta']['image'] ) ) {
			$thumb_meta = wp_get_attachment_metadata( get_post_thumbnail_id() );
			if ( ! empty( $thumb_meta['width'] ) && ! empty( $thumb_meta['height'] ) ) {
				$img_w = (int) $thumb_meta['width'];
				$img_h = (int) $thumb_meta['height'];
			}
		}
		printf( '<meta property="og:image" content="%s">' . "\n", esc_url( $image ) );
		printf( '<meta property="og:image:width" content="%d">' . "\n", $img_w );
		printf( '<meta property="og:image:height" content="%d">' . "\n", $img_h );
	}

	// Twitter / X.
	echo '<meta name="twitter:card" content="summary_large_image">' . "\n";
	printf( '<meta name="twitter:title" content="%s">' . "\n", esc_attr( $title ) );
	printf( '<meta name="twitter:description" content="%s">' . "\n", esc_attr( $desc ) );
	if ( $image ) {
		printf( '<meta name="twitter:image" content="%s">' . "\n", esc_url( $image ) );
	}
}

/** Front-page title: brand plus category plus location, the highest-value title tag. */
add_filter( 'document_title_parts', 'sv_document_title_parts' );
function sv_document_title_parts( $parts ) {
	if ( is_front_page() ) {
		$parts['title']   = get_bloginfo( 'name' );
		$parts['tagline'] = 'Nonprofit Startup Accelerator in Ventura County';
	}
	return $parts;
}

/** Keep the unlisted 83 Palm concept page out of the native WP sitemap (it is noindexed). */
add_filter( 'wp_sitemaps_posts_query_args', 'sv_sitemap_exclude_unlisted', 10, 2 );
function sv_sitemap_exclude_unlisted( $args, $post_type ) {
	if ( 'page' !== $post_type ) {
		return $args;
	}
	$sv_pg = get_page_by_path( 'explore-83-palm' );
	if ( $sv_pg ) {
		$args['post__not_in'] = array_merge( isset( $args['post__not_in'] ) ? (array) $args['post__not_in'] : array(), array( $sv_pg->ID ) );
	}
	return $args;
}

/** Emit a JSON-LD block with the CSP nonce attached. */
function sv_jsonld( $data ) {
	$json  = wp_json_encode( $data, JSON_UNESCAPED_SLASHES | JSON_UNESCAPED_UNICODE );
	$nonce = function_exists( 'sv_csp_nonce' ) ? sv_csp_nonce() : '';
	$attr  = $nonce ? ' nonce="' . esc_attr( $nonce ) . '"' : '';
	echo '<script type="application/ld+json"' . $attr . '>' . $json . '</script>' . "\n"; // phpcs:ignore WordPress.Security.EscapeOutput -- wp_json_encode output.
}

add_action( 'wp_head', 'sv_schema_org', 20 );
function sv_schema_org() {
	// NonprofitOrganization — sitewide (Section 15).
	$org = array(
		'@context'    => 'https://schema.org',
		'@type'       => 'NGO',
		'name'        => get_bloginfo( 'name' ),
		'url'         => home_url( '/' ),
		'description' => 'A 501(c)(3) nonprofit startup accelerator in Ventura County, California.',
		'taxID'       => SV_EIN,
		'sameAs'      => array( SV_LINKEDIN, SV_INSTAGRAM, SV_FACEBOOK ),
		'address'     => array(
			'@type'           => 'PostalAddress',
			'addressLocality' => 'Ventura',
			'addressRegion'   => 'CA',
			'addressCountry'  => 'US',
		),
		'contactPoint' => array(
			'@type'       => 'ContactPoint',
			'contactType' => 'general',
			'email'       => SV_EMAIL_INFO,
		),
	);
	$logo = SV_URI . '/assets/img/logo.png';
	if ( file_exists( SV_DIR . '/assets/img/logo.png' ) ) {
		$org['logo'] = $logo;
	}
	sv_jsonld( $org );

	// Article — on single posts (Section 15).
	if ( is_singular( 'post' ) ) {
		$post    = get_queried_object();
		$article = array(
			'@context'      => 'https://schema.org',
			'@type'         => 'Article',
			'headline'      => get_the_title( $post ),
			'datePublished' => get_the_date( 'c', $post ),
			'dateModified'  => get_the_modified_date( 'c', $post ),
			'author'        => array(
				'@type' => 'Organization',
				'name'  => get_bloginfo( 'name' ),
			),
			'publisher'     => array(
				'@type' => 'Organization',
				'name'  => get_bloginfo( 'name' ),
				'logo'  => array( '@type' => 'ImageObject', 'url' => $logo ),
			),
			'mainEntityOfPage' => get_permalink( $post ),
		);
		if ( has_post_thumbnail( $post ) ) {
			$img = wp_get_attachment_image_url( get_post_thumbnail_id( $post ), 'full' );
			if ( $img ) {
				$article['image'] = $img;
			}
		}
		sv_jsonld( $article );

		// Person — the announcement references the canonical Luke Erickson entity
		// (shared @id with the /lukeerickson profile page so they don't compete).
		if ( 'luke-erickson-executive-director' === $post->post_name ) {
			sv_jsonld( sv_luke_person( ! empty( $article['image'] ) ? $article['image'] : '' ) );
		}
	}

	// Person — canonical Luke Erickson entity on the Leadership profile page.
	if ( is_page( 'lukeerickson' ) ) {
		sv_jsonld( sv_luke_person() );
	}
}

/**
 * The canonical "Luke Erickson" Person node, built to rank for searches of his
 * name. Shared by the /lukeerickson profile page (the person's canonical URL) and
 * the announcement post via a common @id, so search engines treat them as one
 * entity. Keep sameAs in sync with any public profiles he adds.
 *
 * @param string $image Optional image URL; defaults to the headshot.
 */
function sv_luke_person( $image = '' ) {
	if ( ! $image ) {
		$image = SV_URI . '/assets/img/team/luke-erickson.jpg';
	}
	return array(
		'@context'    => 'https://schema.org',
		'@type'       => 'Person',
		'@id'         => home_url( '/lukeerickson/#luke' ),
		'name'        => 'Luke Erickson',
		'jobTitle'    => 'Founder and Executive Director',
		'worksFor'    => array(
			'@type' => 'NonprofitOrganization',
			'name'  => get_bloginfo( 'name' ),
			'taxID' => SV_EIN,
			'url'   => home_url( '/' ),
		),
		'description' => 'Founder and Executive Director of Startup Ventura, a 501(c)(3) startup accelerator in Ventura County, California.',
		'image'       => $image,
		'url'         => home_url( '/lukeerickson/' ),
		'sameAs'      => array(
			'https://www.linkedin.com/in/luke-erickson/',
			'https://www.instagram.com/luke_erickson/',
			'https://lukeerickson.com',
		),
	);
}
