<?php
/**
 * Render helpers + the reused content library.
 *
 * Page-specific prose lives in each page template. The data that appears on
 * MORE THAN ONE page (stats, Founder's Circle tiers, board, partners,
 * testimonials, the selection process) is centralised here so it can never
 * drift between pages. All output is escaped at render time inside the parts.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/* =========================================================================
 * Component render helpers (thin wrappers around template-parts).
 * ========================================================================= */

/**
 * The Give button (Section 5.2). $location feeds analytics: header, hero,
 * band, footer, mobile-bar, tier-legacy, etc.
 */
function sv_give_button( $location, $args = array() ) {
	$args = wp_parse_args( $args, array(
		'label' => 'Give',
		'class' => '',
		'note'  => '',
	) );
	$args['location'] = $location;
	get_template_part( 'template-parts/give-button', null, $args );
}

/**
 * Apply link target. Until the cohort application ships (SV_APPLICATION_URL is
 * still a [PLACEHOLDER]), Apply degrades gracefully to the notify form on the
 * Contact page so it is never a broken link. Once the real URL is set, it wins.
 */
function sv_apply_url() {
	$url = (string) SV_APPLICATION_URL;
	if ( preg_match( '#^https?://#i', $url ) ) {
		return esc_url( $url );
	}
	return esc_url( home_url( '/contact/#notify' ) );
}

/** True while the cohort application URL is still a placeholder. */
function sv_apply_pending() {
	return ! preg_match( '#^https?://#i', (string) SV_APPLICATION_URL );
}

/**
 * Candid 2026 Platinum Seal of Transparency — a donor and funder trust signal.
 * Uses the official downloaded badge image rather than the live GuideStar widget
 * (the widget's /svg endpoint renders blank when embedded via <img>).
 */
function sv_candid_seal( $class = '' ) {
	if ( ! file_exists( get_template_directory() . '/assets/img/candid-platinum-seal-badge.png' ) ) {
		return;
	}
	printf(
		'<a class="%s" aria-label="%s" href="%s" target="_blank" rel="noopener"><img src="%s" alt="%s" width="150" height="150" loading="lazy"></a>',
		esc_attr( trim( 'candid-seal ' . $class ) ),
		esc_attr__( 'Startup Ventura on Candid: 2026 Platinum Seal of Transparency', 'startup-ventura' ),
		esc_url( 'https://app.candid.org/profile/16385291/startup-ventura-39-2204612/?pkId=266ecad1-f625-40ab-acfb-c736d5b97833' ),
		esc_url( get_template_directory_uri() . '/assets/img/candid-platinum-seal-badge.png' ),
		esc_attr__( 'Candid 2026 Platinum Seal of Transparency', 'startup-ventura' )
	);
}

/** Apply CTA — always visually subordinate to Give. */
function sv_apply_button( $location, $label = 'Apply', $class = 'btn--outline' ) {
	// While the application portal is still a placeholder, Apply routes to the
	// notify form, so label it honestly instead of promising an application.
	if ( sv_apply_pending() ) {
		$label = 'Get notified';
	}
	printf(
		'<a class="btn %1$s" href="%2$s" data-cta="apply" data-cta-location="%3$s">%4$s</a>',
		esc_attr( $class ),
		sv_apply_url(),
		esc_attr( $location ),
		esc_html( $label )
	);
}

/** Partner CTA — subordinate, links to /partner. */
function sv_partner_button( $location, $label = 'Partner with us', $class = 'btn--outline' ) {
	printf(
		'<a class="btn %1$s" href="%2$s" data-cta="partner" data-cta-location="%3$s">%4$s</a>',
		esc_attr( $class ),
		esc_url( home_url( '/partner/' ) ),
		esc_attr( $location ),
		esc_html( $label )
	);
}

/** The recurring signature: a short coral wave rule (decorative). */
function sv_wave_rule() {
	return '<svg class="wave-rule" width="64" height="10" viewBox="0 0 64 10" fill="none" aria-hidden="true" focusable="false"><path d="M1 5C9 1 15 9 23 5C31 1 37 9 45 5C53 1 59 9 63 5" stroke="currentColor" stroke-width="2" stroke-linecap="round"/></svg>';
}

/**
 * Section header rhythm (4.8): mono eyebrow, short wave rule, Archivo heading.
 *
 * @param string $eyebrow Mono eyebrow text (rendered uppercase by CSS).
 * @param string $heading Section heading.
 * @param array  $opts    align (left|center), tag (h2|h3), id, class, intro (lede paragraph), light (bool for dark sections).
 */
function sv_section_header( $eyebrow, $heading, $opts = array() ) {
	$opts = wp_parse_args( $opts, array(
		'align' => 'left',
		'tag'   => 'h2',
		'id'    => '',
		'class' => '',
		'intro' => '',
		'light' => false,
	) );
	$tag     = preg_match( '/^h[1-6]$/', $opts['tag'] ) ? $opts['tag'] : 'h2';
	$classes = 'section-head section-head--' . sanitize_html_class( $opts['align'] );
	if ( $opts['light'] ) {
		$classes .= ' section-head--light';
	}
	if ( $opts['class'] ) {
		$classes .= ' ' . sanitize_html_class( $opts['class'] );
	}
	$id = $opts['id'] ? ' id="' . esc_attr( $opts['id'] ) . '"' : '';

	echo '<header class="' . esc_attr( $classes ) . '"' . $id . '>'; // phpcs:ignore WordPress.Security.EscapeOutput
	if ( $eyebrow ) {
		echo '<p class="eyebrow">' . esc_html( $eyebrow ) . '</p>';
		echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG.
	}
	echo '<' . $tag . ' class="section-head__title display">' . esc_html( $heading ) . '</' . $tag . '>'; // phpcs:ignore
	if ( $opts['intro'] ) {
		echo '<p class="section-head__intro lede">' . wp_kses_post( $opts['intro'] ) . '</p>';
	}
	echo '</header>';
}

/** Wave (four bands + coral crest). $args: variant (divider|footer|section), flip. */
function sv_wave( $args = array() ) {
	get_template_part( 'template-parts/wave', null, wp_parse_args( $args, array( 'variant' => 'full' ) ) );
}

/** Navy stat band with mono count-up numerals (defaults to the org stats). */
function sv_stat_band( $args = array() ) {
	$args = wp_parse_args( $args, array(
		'stats'   => sv_stats(),
		'heading' => '',
		'eyebrow' => '',
	) );
	get_template_part( 'template-parts/stat-band', null, $args );
}

/** Compact 3-number stat strip (home Why teaser + both Partner pages). */
function sv_stat_strip( $args = array() ) {
	get_template_part( 'template-parts/stat-strip', null, wp_parse_args( $args, array( 'stats' => sv_stat_strip_data() ) ) );
}

/** Breadcrumbs + BreadcrumbList JSON-LD (all sub-pages). */
function sv_breadcrumbs() {
	get_template_part( 'template-parts/breadcrumbs' );
}

/** Full-width closing CTA band (Section 7). */
function sv_cta_band( $args = array() ) {
	$args = wp_parse_args( $args, array(
		'eyebrow'   => 'The Ask',
		'heading'   => 'Help us launch Ventura County\'s first founder cohort.',
		'location'  => 'band',
		'secondary' => 'none', // none | apply | partner.
		'give_note' => '',
	) );
	get_template_part( 'template-parts/cta-band', null, $args );
}

function sv_tier_card( $args ) {
	get_template_part( 'template-parts/tier-card', null, $args );
}
function sv_board_card( $args ) {
	get_template_part( 'template-parts/board-card', null, $args );
}
function sv_partner_row( $args = array() ) {
	get_template_part( 'template-parts/partner-row', null, wp_parse_args( $args, array( 'partners' => sv_partners() ) ) );
}
function sv_testimonial( $args ) {
	get_template_part( 'template-parts/testimonial', null, $args );
}
function sv_process_step( $args ) {
	get_template_part( 'template-parts/process-step', null, $args );
}

/* =========================================================================
 * The reused content library (single source of truth).
 * ========================================================================= */

/** The four traction stats (home + impact stat bands). */
function sv_stats() {
	return array(
		array( 'count' => 75, 'label' => 'Attended the first annual benefit' ),
		array( 'count' => 17, 'prefix' => '$', 'suffix' => 'K', 'label' => 'Raised in one night' ),
		array( 'count' => 5, 'label' => 'Keynote speakers' ),
	);
}

/** Compact stat strip — three scannable numbers, nothing more (Section 11). */
function sv_stat_strip_data() {
	return array(
		array( 'num' => '54%', 'label' => 'above the U.S. cost of living' ),
		array( 'num' => '1 in 7', 'label' => 'households can afford a median home (down from 1 in 2 a decade ago)' ),
		array( 'num' => '5', 'label' => 'local jobs created by every tech job' ),
	);
}

/** Mission statement (Section 11, verbatim). */
function sv_mission() {
	return 'To keep Ventura County the best place in the world to live by fueling entrepreneurship, building high-growth companies, and transforming our region into a recognized hub of innovation that creates lasting economic success.';
}

/** Founder's Circle recognition tiers (Section 9, verbatim). Each includes the one below. */
function sv_tiers() {
	return array(
		array(
			'name'     => 'Catalyst',
			'amount'   => '$5,000',
			'price'    => 5000,
			'legacy'   => false,
			'benefits' => array(
				'Name on the website donor wall',
				'Recognition at the annual benefit',
				'Listing in the annual impact report',
			),
		),
		array(
			'name'     => 'Principal',
			'amount'   => '$10,000',
			'price'    => 10000,
			'legacy'   => false,
			'benefits' => array(
				'Everything in Catalyst, plus:',
				'Name and logo on the donor wall',
				'Invitation to Demo Day',
			),
		),
		array(
			'name'     => 'Visionary',
			'amount'   => '$25,000',
			'price'    => 25000,
			'legacy'   => false,
			'benefits' => array(
				'Everything in Principal, plus:',
				'Logo on Demo Day signage',
				'Reserved seating and recognition at the annual benefit',
				'Quarterly program updates',
				'Invitation to the founder and mentor mixer',
			),
		),
		array(
			'name'     => 'Legacy',
			'amount'   => '$50,000',
			'price'    => 50000,
			'legacy'   => true,
			'ribbon'   => 'Presents the inaugural cohort',
			'benefits' => array(
				'Everything in Visionary, plus:',
				'Presenting recognition: the inaugural Spring 2027 cohort presented in your name',
				'Premier logo placement on the homepage and donor wall',
				'A recognition moment and reserved table at the annual benefit',
				'A private dinner with the founder cohort and board',
				'First look at Demo Day and warm introductions to founders',
			),
		),
	);
}

/** Board of Directors (Section 11, verbatim bios). */
function sv_board() {
	return array(
		array(
			'name'     => 'Luke Erickson',
			'role'     => 'Board Member, Executive Director',
			'photo'    => 'team/luke-erickson.jpg',
			'pos'      => 'center 22%', // square studio headshot; framed like the other board photos.
			'linkedin' => 'https://www.linkedin.com/in/luke-erickson/',
			'instagram'=> 'https://www.instagram.com/luke_erickson/',
			'website'  => 'https://lukeerickson.com',
			'bio'      => 'Luke Erickson is the founder of Startup Ventura and serves as Executive Director of the organization. With a background in business development and entrepreneurship, Luke launched Startup Ventura in 2025 to bring nationally recognized accelerator programming to Ventura County. Driven by a passion for empowering founders and strengthening the local economy, he leads the organization\'s programming, partnerships, and community impact initiatives. Luke\'s vision is to position Ventura as a hub of innovation and entrepreneurial growth.',
		),
		array(
			'name'     => 'Brent-Stig Kraus',
			'role'     => 'Board Member, Senior Revenue Executive',
			'photo'    => 'team/brent-stig-kraus.jpg',
			'pos'      => '42% 22%',
			'zoom'     => 1.5, // wide head-and-torso shot; zoom in so his face matches the others.
			'linkedin' => 'https://www.linkedin.com/in/brent-stig-kraus-7958125/',
			'bio'      => 'Brent Stig Kraus is a senior revenue executive with extensive experience scaling SaaS companies through hypergrowth and strategic exits. He most recently served as CRO at SevenRooms, acquired by DoorDash in a $1.2B transaction, and previously held leadership roles at ChowNow and MINDBODY during its $1.9B acquisition by Vista Equity Partners. Earlier in his career, Brent helped drive Lynda.com\'s growth leading to its $1.5B acquisition by LinkedIn. With a track record of building high-performing teams and driving transformative growth across multiple SaaS verticals, Brent brings deep expertise in enterprise sales, go-to-market strategy, and operational excellence.',
		),
		array(
			'name'     => 'Brian Gonzalez',
			'role'     => 'Board Member, Co-Founder & CTO of Curri',
			'photo'    => 'team/brian-gonzalez.jpg',
			'pos'      => 'center 30%',
			'linkedin' => 'https://www.linkedin.com/in/brianmatthewgonzalez/',
			'bio'      => 'Brian Gonzalez is the CTO and co-founder of Curri, a nationwide delivery and logistics platform built for construction wholesalers and distributors. He began his career in startups in 2010 at Dollar Shave Club and has been immersed in the entrepreneurial world ever since. After earning his master\'s degree in data science, Brian launched Curri in the heart of downtown Ventura, where he continues to lead technology and innovation today. Under his leadership, Curri has raised capital from leading investors including Y Combinator and Bessemer Venture Partners.',
		),
		array(
			'name'     => 'Stephanie Caldwell',
			'role'     => 'Board Member, CEO of Ventura Chamber of Commerce',
			'photo'    => 'team/stephanie-caldwell.jpg',
			'pos'      => 'center 22%',
			'linkedin' => 'https://www.linkedin.com/in/stephanie-caldwell-1b02b39/',
			'bio'      => 'Stephanie Caldwell has held a senior leadership role at the Ventura Chamber of Commerce since April 2015 and currently serves as a director for the California Chamber of Commerce. With a career spanning sales, operations, and workforce management, she began in the hospitality industry before transitioning into the staffing sector, where she led branch and on-site contingent staffing operations in Silicon Valley supporting major technology companies including Novell and Compaq (now HP). Previously, she served as Chief Operations Officer of the San Jose Silicon Valley Chamber of Commerce and has additional experience in both public service and industry associations, including roles in the district office of a California State Assembly member and as Director of Education and Events for the California Apartment Association\'s Tri-County Division.',
		),
	);
}

/** Partners & Community (Section 11). Chamber logo is supplied separately. */
function sv_partners() {
	return array(
		array(
			'name' => 'City of Ventura',
			'logo' => 'partners/city-of-ventura.png',
			'desc' => 'Supporting innovation at the heart of our community.',
		),
		array(
			'name' => 'Ventura Community College District',
			'logo' => 'partners/ventura-community-college.png',
			'desc' => 'Providing educational pathways and resources for the next generation of founders.',
		),
		array(
			'name' => 'Ventura County Credit Union',
			'logo' => 'partners/ventura-county-credit-union.png',
			'desc' => 'Empowering financial growth and community investment in local entrepreneurship.',
		),
		array(
			'name' => 'Ventura Chamber of Commerce',
			'logo' => 'partners/ventura-chamber.png',
			'desc' => 'A catalyst for business growth, a convener of leaders and influencers, and a champion for a stronger Ventura.',
		),
	);
}

/** Testimonials (Section 11, verbatim). */
function sv_testimonials() {
	return array(
		'sean' => array(
			'author' => 'Sean H.',
			'quote'  => 'I was fortunate to attend the first annual Startup Ventura benefit dinner, and the energy in the room was contagious. Operators, founders, and policy makers all came together with one shared mission: expand opportunity in Ventura, attract top talent, and strengthen the community. I firmly believe that building an entrepreneurial culture here will create economic growth and open doors for generations to come. This is only the beginning, and I am excited to play a part in it.',
		),
		'jeff' => array(
			'author' => 'Jeff',
			'quote'  => 'Throughout my career I have worked with many of the premier venture and private equity firms. Last week I had the privilege to attend an inaugural event for Startup Ventura, meeting an impressive team led by Luke Erickson. It was a pleasure to see a group so focused on benefiting the community, creating new opportunities to support emerging businesses, support entrepreneurs and create jobs in Ventura County.',
		),
		'john' => array(
			'author' => 'John Will',
			'quote'  => 'Startup Ventura is building something special. Their remarkable team is not only helping entrepreneurs launch and grow, but also creating the kind of opportunities that allow people to plant real roots here in Ventura. Because of their work, more people can build a life in this community and play an active role in shaping its future.',
		),
		'rob' => array(
			'author' => 'Rob Russel',
			'quote'  => 'Ventura County has an affordability problem that is also a brain drain problem. People grow up here, get educated here, and then have to leave because there are not enough opportunities to stay. Luke and the team are building something from the ground up by bringing together education, capital, entrepreneurs, and government to create the kind of community where founders can actually succeed, where local innovation drives local jobs and we stop losing our best people to other cities.',
		),
	);
}

/** Selection process — five stages (Section 10, verbatim; client may edit). */
function sv_process_steps() {
	return array(
		array(
			'num'   => '01',
			'title' => 'Application',
			'body'  => 'A short written application. Who you are, the problem you are attacking, and why you are the one to solve it. We weight the founder over the idea.',
		),
		array(
			'num'   => '02',
			'title' => 'Screening Call',
			'body'  => 'A brief intro with our team. We listen for clarity, drive, and commitment.',
		),
		array(
			'num'   => '03',
			'title' => 'Founder Deep-Dive',
			'body'  => 'The core interview. Your story, your insight into the problem, how you think, and how you handle being pushed. This is where founder quality shows.',
		),
		array(
			'num'   => '04',
			'title' => 'Selection Panel',
			'body'  => 'You meet our mentors and selection committee. We pressure-test the business and your ability to execute and adapt.',
		),
		array(
			'num'   => '05',
			'title' => 'Offer & Onboarding',
			'body'  => 'The committee decides, and selected founders receive a cohort offer and onboarding into S27.',
		),
	);
}

/** Theme image URL helper. */
function sv_img( $rel ) {
	return esc_url( SV_URI . '/assets/img/' . ltrim( $rel, '/' ) );
}

/* =========================================================================
 * Navigation.
 * ========================================================================= */

/** Render a nav menu with a sensible hardcoded fallback (works pre-launch). */
function sv_nav_menu( $location = 'primary', $extra = array() ) {
	wp_nav_menu( array_merge( array(
		'theme_location' => $location,
		'container'      => false,
		'menu_class'     => 'sv-menu',
		'depth'          => 2,
		'fallback_cb'    => 'sv_fallback_menu',
	), $extra ) );
}

/**
 * Fallback menu matching the spec nav (3.5) with Program + Partner dropdowns.
 * Used until the client assigns a menu to the "primary" location.
 */
function sv_fallback_menu() {
	// Note: "Give" is intentionally NOT a nav item — the persistent coral Give
	// button covers it. The About dropdown holds Leadership + Why Ventura County;
	// Contact is its own top-level item.
	$items = array(
		array( 'Program', '/program/', array(
			array( '7-Week Accelerator', '/program/accelerator/' ),
			array( 'Workshop Series', '/program/workshops/' ),
		) ),
		array( 'Impact', '/impact/' ),
		array( 'Partner', '/partner/', array(
			array( 'For Cities & County', '/partner/cities-county/' ),
			array( 'For Foundations & Corporate Giving', '/partner/foundations/' ),
		) ),
		array( 'About', '/about/', array(
			array( 'Leadership', '/lukeerickson/' ),
			array( 'Why Ventura County', '/why-ventura-county/' ),
		) ),
		array( 'Contact', '/contact/' ),
		array( 'News', '/news/' ),
	);

	echo '<ul class="sv-menu">';
	foreach ( $items as $item ) {
		$has_children = isset( $item[2] ) && is_array( $item[2] );
		$li_class     = 'menu-item' . ( $has_children ? ' menu-item-has-children' : '' );
		printf( '<li class="%s"><a href="%s">%s</a>', esc_attr( $li_class ), esc_url( home_url( $item[1] ) ), esc_html( $item[0] ) );
		if ( $has_children ) {
			echo '<ul class="sub-menu">';
			foreach ( $item[2] as $child ) {
				printf( '<li class="menu-item"><a href="%s">%s</a></li>', esc_url( home_url( $child[1] ) ), esc_html( $child[0] ) );
			}
			echo '</ul>';
		}
		echo '</li>';
	}
	echo '</ul>';
}

/** Output the site brand (custom logo if set, else the bundled dark/white pair). */
function sv_site_brand() {
	// Header brand is the Archivo wordmark (echoes the intro overlay). The full
	// logo lockup lives in the footer; the wave-mark is the favicon.
	printf(
		'<a class="site-brand" href="%s" rel="home"><span class="brand-text">%s</span></a>',
		esc_url( home_url( '/' ) ),
		esc_html( get_bloginfo( 'name' ) )
	);
}
