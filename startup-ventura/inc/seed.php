<?php
/**
 * One-time seed of the News / Updates posts (Section 8 / 11).
 *
 * Runs once on theme activation (after_switch_theme), guarded by an option flag
 * and a per-post slug check so it can never double-insert and is safe to load on
 * every request. Each post is created with its real publish date, the "News"
 * category, tags, an excerpt, and a featured image sideloaded from the theme's
 * assets. Posts that still contain bracketed placeholders are seeded as drafts.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

add_action( 'after_switch_theme', 'sv_seed_news_posts' );

/**
 * Seed all News posts once.
 */
function sv_seed_news_posts() {
	if ( get_option( 'sv_seeded_news_v4' ) ) {
		return;
	}
	$cat_id = sv_seed_news_category();
	foreach ( sv_seed_posts() as $post ) {
		sv_seed_insert_post( $post, $cat_id );
	}
	update_option( 'sv_seeded_news_v4', 1 );
}

add_action( 'after_switch_theme', 'sv_seed_pages' );

/**
 * Seed the standalone content pages (Privacy, Terms, Press) once, so their
 * page-{slug}.php templates resolve at /privacy/, /terms/, and /press/. The copy
 * lives in the templates; these pages are created empty and idempotently by slug.
 */
function sv_seed_pages() {
	if ( get_option( 'sv_seeded_pages_v4' ) ) {
		return;
	}
	$pages = array(
		array( 'title' => 'Privacy Policy', 'slug' => 'privacy' ),
		array( 'title' => 'Terms of Use', 'slug' => 'terms' ),
		array( 'title' => 'Press & Media Kit', 'slug' => 'press' ),
		array( 'title' => 'Luke Erickson', 'slug' => 'lukeerickson' ),
		array( 'title' => 'Donor Wall', 'slug' => 'donor-wall' ),
		array( 'title' => '83 Palm Street · Coworking Concept', 'slug' => 'explore-83-palm' ),
	);
	foreach ( $pages as $pg ) {
		if ( get_page_by_path( $pg['slug'] ) ) {
			continue;
		}
		wp_insert_post( array(
			'post_title'   => $pg['title'],
			'post_name'    => $pg['slug'],
			'post_status'  => 'publish',
			'post_type'    => 'page',
			'post_content' => '',
		) );
	}
	update_option( 'sv_seeded_pages_v4', 1 );
}

/** Get or create the "News" category. */
function sv_seed_news_category() {
	$term = term_exists( 'News', 'category' );
	if ( ! $term ) {
		$term = wp_insert_term( 'News', 'category' );
	}
	if ( is_wp_error( $term ) || empty( $term['term_id'] ) ) {
		return 0;
	}
	return (int) $term['term_id'];
}

/** Insert one post (idempotent by slug) with category, tags, and featured image. */
function sv_seed_insert_post( $p, $cat_id ) {
	// Guard: a post with this slug already exists.
	if ( get_page_by_path( $p['slug'], OBJECT, 'post' ) ) {
		return;
	}

	$content = '';
	foreach ( $p['paragraphs'] as $text ) {
		$content .= "<!-- wp:paragraph -->\n<p>" . wp_kses_post( $text ) . "</p>\n<!-- /wp:paragraph -->\n\n";
	}
	if ( ! empty( $p['gallery'] ) ) {
		$content .= sv_seed_gallery_blocks();
	}

	$post_id = wp_insert_post(
		array(
			'post_title'   => $p['title'],
			'post_name'    => $p['slug'],
			'post_content' => $content,
			'post_excerpt' => $p['excerpt'],
			'post_status'  => $p['status'],
			'post_type'    => 'post',
			'post_date'    => $p['date'] . ' 09:00:00',
		),
		true
	);
	if ( ! $post_id || is_wp_error( $post_id ) ) {
		return;
	}
	if ( $cat_id ) {
		wp_set_post_categories( $post_id, array( $cat_id ) );
	}
	if ( ! empty( $p['tags'] ) ) {
		wp_set_post_tags( $post_id, $p['tags'] );
	}
	if ( ! empty( $p['image'] ) ) {
		$img_alt = ! empty( $p['image_alt'] ) ? $p['image_alt'] : $p['title'];
		sv_seed_attach_image( $p['image'], $post_id, $p['title'], $img_alt );
	}
}

/**
 * Copy a theme image into the media library and set it as the post's featured image.
 *
 * @param string $rel     Path relative to assets/img/.
 * @param int    $post_id Post to attach to.
 * @param string $title   Attachment title.
 * @param string $alt     Optional alt text; falls back to $title when empty.
 */
function sv_seed_attach_image( $rel, $post_id, $title, $alt = '' ) {
	$src = SV_DIR . '/assets/img/' . ltrim( $rel, '/' );
	if ( ! file_exists( $src ) ) {
		return;
	}
	require_once ABSPATH . 'wp-admin/includes/image.php';
	require_once ABSPATH . 'wp-admin/includes/file.php';
	require_once ABSPATH . 'wp-admin/includes/media.php';

	$upload = wp_upload_bits( basename( $src ), null, file_get_contents( $src ) ); // phpcs:ignore WordPress.WP.AlternativeFunctions
	if ( ! empty( $upload['error'] ) ) {
		return;
	}
	$filetype = wp_check_filetype( $upload['file'] );
	$attach_id = wp_insert_attachment(
		array(
			'post_mime_type' => $filetype['type'],
			'post_title'     => sanitize_text_field( $title ),
			'post_content'   => '',
			'post_status'    => 'inherit',
		),
		$upload['file'],
		$post_id
	);
	if ( is_wp_error( $attach_id ) || ! $attach_id ) {
		return;
	}
	wp_update_attachment_metadata( $attach_id, wp_generate_attachment_metadata( $attach_id, $upload['file'] ) );
	update_post_meta( $attach_id, '_wp_attachment_image_alt', sanitize_text_field( $alt ? $alt : $title ) );
	set_post_thumbnail( $post_id, $attach_id );
}

/** The six Annual Benefit photos as a core gallery block. */
function sv_seed_gallery_blocks() {
	$figures = '';
	for ( $n = 1; $n <= 6; $n++ ) {
		$src = sv_img( 'event/benefit-0' . $n . '.jpg' );
		$alt = sprintf( 'Startup Ventura Annual Benefit, photo %d of 6', $n );
		$figures .= sprintf(
			"<!-- wp:image {\"sizeSlug\":\"large\",\"linkDestination\":\"none\"} -->\n" .
			'<figure class="wp-block-image size-large"><img src="%1$s" alt="%2$s"/></figure>' .
			"\n<!-- /wp:image -->\n",
			$src,
			esc_attr( $alt )
		);
	}
	return "<!-- wp:gallery {\"columns\":3,\"linkTo\":\"none\",\"className\":\"entry-gallery\"} -->\n"
		. '<figure class="wp-block-gallery has-nested-images columns-3 is-cropped entry-gallery">'
		. $figures
		. "</figure>\n<!-- /wp:gallery -->\n";
}

/**
 * The News posts, oldest to newest. WordPress sorts by date on its own.
 */
function sv_seed_posts() {
	return array(

		// Sean Herwaldt joins the board (latest).
		array(
			'title'      => 'Welcoming Sean Herwaldt to the Startup Ventura Board',
			'slug'       => 'sean-herwaldt-joins-board',
			'date'       => '2026-07-08',
			'status'     => 'publish',
			'excerpt'    => 'Sean Herwaldt, a SpaceX supply chain veteran who now leads supply chain at Novos in Ventura, has joined the Startup Ventura Board of Directors.',
			'image'      => 'team/sean-herwaldt.jpg',
			'image_alt'  => 'Sean Herwaldt',
			'tags'       => array( 'announcements', 'board', 'team' ),
			'paragraphs' => array(
				'Startup Ventura is honored to welcome Sean Herwaldt to our Board of Directors.',
				'Sean spent six years at SpaceX, rising to global supply chain manager at one of the most demanding engineering companies in the world, now publicly traded after the largest IPO in history this past June. Keeping a rocket company supplied means solving hard problems under constant pressure and building the planning systems and supplier relationships that let ambitious teams actually ship. That is exactly the kind of operating experience early founders need in their corner.',
				'His path reflects the kind of hands-on background our board is built on. Before SpaceX, Sean worked in supply chain and operations for major manufacturers including Owens Corning and Progress Rail, learning how real things get built and moved at scale. Today he leads supply chain at Novos, right here in Ventura. He knows what it takes to build something and see it through, from the ground floor up.',
				'What Sean brings to Startup Ventura is more than a resume. He feels strongly about building a strong entrepreneurial ecosystem in Ventura, so founders with big ideas can build them at home instead of leaving to do it somewhere else. That belief is the entire reason we exist.',
				'We could not be more excited to have him help guide what comes next. Welcome, Sean.',
			),
		),

		// Luke Erickson named Executive Director (latest).
		array(
			'title'      => 'Luke Erickson Steps Into the Role of Executive Director at Startup Ventura',
			'slug'       => 'luke-erickson-executive-director',
			'date'       => '2026-07-01',
			'status'     => 'publish',
			'excerpt'    => 'Luke Erickson, founder of Startup Ventura, steps into the role of Executive Director, leading the Ventura County accelerator he built to keep local talent home.',
			'image'      => 'team/luke-erickson.jpg',
			'image_alt'  => 'Luke Erickson, Founder and Executive Director of Startup Ventura.',
			'tags'       => array( 'announcements', 'leadership', 'founder', 'Luke Erickson' ),
			'paragraphs' => array(
				'Luke Erickson has stepped into the role of Executive Director of <a href="' . esc_url( home_url( '/' ) ) . '">Startup Ventura</a>, the nonprofit startup accelerator he founded to transform Ventura County into a hub for innovation. He assumes day-to-day <a href="' . esc_url( home_url( '/about/' ) ) . '">leadership of the organization</a> effective July 1, 2026, having served as its founder and chairman since its inception.',
				'The move formalizes what has been true from the beginning. Startup Ventura is Luke Erickson\'s vision, built on a conviction that the region he calls home has everything it needs to compete with the country\'s great startup ecosystems, and that no one was yet doing the work to make it happen. So he decided to do it himself.',
				'That conviction came from a problem he watched play out for years. Ventura County raises ambitious, talented people, educates them at strong local universities, and then loses them to San Francisco, Los Angeles, and beyond, because there is nowhere here to build. The shortage runs both directions. Even high-growth companies already rooted here, like Curri, the logistics startup headquartered in downtown Ventura, have to work hard to find the local talent they need to grow. He saw a region exporting its own future while the employers who stayed competed over too small a pool. Rather than accept it, he founded Startup Ventura to give local founders the mentorship, capital connections, and community to build high-growth companies without leaving, and to deepen the talent pool that every local company depends on. The idea is simple and ambitious at once: keep the talent, build the companies, and let the jobs and investment follow.',
				'Under his leadership, the organization has moved quickly from idea to institution. Startup Ventura earned its 501(c)(3) status, secured a founding investment from the City of Ventura, and was awarded Candid\'s Platinum Seal of Transparency, the highest level, held by fewer than one percent of U.S. nonprofits. Its first annual benefit drew 75 supporters and raised funds toward an inaugural cohort of founders launching in Spring 2027. What began as one person\'s argument about his hometown has become a coalition of city government, universities, investors, and business leaders.',
				'Luke Erickson brings a background in technology and business development to the civic sector, having built and exited his own company before turning his focus to building institutions. He pairs an ambitious long-term vision with the patience to assemble the partnerships that make it real, the kind of leadership that gets a city, a college district, and a room full of investors pulling in the same direction.',
				'His commitment to Ventura County reaches well beyond Startup Ventura. He serves on the board of directors of the New West Symphony, mentors students at CSU Channel Islands, and works closely with local civic and economic development organizations to strengthen the region\'s future. A former collegiate lacrosse player, he brings the same competitiveness and discipline to building institutions that he once brought to the field.',
				'"After I exited my first business, I made a conscious decision that I was going to have an outsized impact on this city and county, and turn it into a place that ambitious, innovative people want to call home," Erickson said. "That is the whole reason Startup Ventura exists. We are just getting started."',
				'As Executive Director, he will lead Startup Ventura into its first full program year, with the inaugural cohort set to begin in Spring 2027. For Luke Erickson, it is less a new title than a deeper commitment to a mission he has carried from the start: making Ventura County the best place in the world to build something that lasts.',
			),
		),

		// 0 — Candid Platinum Seal of Transparency (latest).
		array(
			'title'      => 'Startup Ventura Earns Candid\'s Platinum Seal of Transparency',
			'slug'       => 'candid-platinum-seal-of-transparency',
			'date'       => '2026-06-24',
			'status'     => 'publish',
			'excerpt'    => 'Startup Ventura has earned the 2026 Platinum Seal of Transparency, the highest level Candid awards, giving donors and funders a complete, verified view of how we operate.',
			'image'      => 'news/candid-platinum-seal.jpg',
			'tags'       => array( 'announcements', 'transparency', 'nonprofit', 'milestones' ),
			'paragraphs' => array(
				'<strong>Fewer than 1% of U.S. nonprofits hold Candid\'s Platinum Seal of Transparency. Startup Ventura is now one of them.</strong>',
				'We earned the 2026 Platinum Seal from Candid, the organization formed by the merger of GuideStar and Foundation Center, whose database funders, foundations, and donors across the country use to research nonprofits. Platinum is the highest of four levels. Earning it means we have published our financials, our governance and board, our mission and programs, and the specific goals and impact metrics we hold ourselves to.',
				'For a young organization asking the community to invest in its first cohort of founders, this matters. We are asking people and institutions to put real money behind local entrepreneurs. They deserve complete visibility into how that money is managed and what it produces. The Platinum Seal is independent, third-party proof that we operate that way.',
				'It also pairs with our 501(c)(3) status to give funders confidence at a glance. Many foundations and corporate and institutional funders now look for a Candid Seal, often at the Gold or Platinum level, before they give. We are starting at the top.',
				'Transparency is how we intend to run this organization, starting now. You can see <a href="https://app.candid.org/profile/16385291/startup-ventura/?pkId=266ecad1-f625-40ab-acfb-c736d5b97833&amp;isActive=true" target="_blank" rel="noopener">our full profile on Candid</a>.',
			),
		),

		// 1 — 501(c)(3) status.
		array(
			'title'      => 'Startup Ventura Is Now a 501(c)(3) Nonprofit',
			'slug'       => 'startup-ventura-501c3-status',
			'date'       => '2025-05-14',
			'status'     => 'publish',
			'excerpt'    => 'The IRS has granted Startup Ventura 501(c)(3) status, making every gift tax-deductible and laying the legal foundation for our work across Ventura County.',
			'image'      => 'hero.jpg',
			'tags'       => array( 'announcements', 'milestones', 'nonprofit' ),
			'paragraphs' => array(
				'Startup Ventura is officially a 501(c)(3) nonprofit. The IRS granted our tax-exempt status on May 14, 2025, a foundational step for everything we are building in Ventura County.',
				'Here is what that means in practical terms. Every gift to Startup Ventura is now tax-deductible to the extent allowed by law. We can pursue grants, accept foundation and corporate support, and operate with the governance and transparency that serious philanthropy requires. Our EIN is 39-2204612.',
				'What it means for the mission is bigger. Startup Ventura exists to keep Ventura County the best place in the world to live by helping local founders build high-growth companies here, instead of leaving to build them somewhere else. 501(c)(3) status turns that mission into an organization that people and institutions can invest in with confidence.',
				'This is the starting line, not the finish. With the legal foundation in place, our focus turns to the work itself: the partnerships, the funding, and the program that will put Ventura County founders in a position to succeed. Thank you to everyone who helped us get here. The best is ahead.',
			),
		),

		// 2 — Gonzalez & Kraus join the board.
		array(
			'title'      => 'Brian Gonzalez and Brent Kraus Join the Startup Ventura Board',
			'slug'       => 'gonzalez-kraus-join-board',
			'date'       => '2025-07-10',
			'status'     => 'publish',
			'excerpt'    => 'Two proven operators, Curri co-founder Brian Gonzalez and SaaS revenue leader Brent Kraus, have joined the Startup Ventura Board of Directors.',
			'image'      => 'news/board-gonzalez-kraus.jpg',
			'tags'       => array( 'announcements', 'board', 'team' ),
			'paragraphs' => array(
				'Startup Ventura is proud to welcome two accomplished operators to our Board of Directors: Brian Gonzalez and Brent-Stig Kraus.',
				'Brian Gonzalez is the co-founder and CTO of Curri, the nationwide delivery and logistics platform he launched in downtown Ventura. He has been building in startups since 2010, when he started his career at Dollar Shave Club, and Curri has since raised capital from leading investors including Y Combinator and Bessemer Venture Partners. Brian is proof of exactly what we are trying to make ordinary in Ventura County: a high-growth company, founded and headquartered right here.',
				'Brent Kraus brings two decades of experience scaling SaaS companies through hypergrowth and major exits. He most recently served as Chief Revenue Officer at SevenRooms, acquired by DoorDash in a $1.2 billion deal, and previously held leadership roles at MINDBODY and Lynda.com through their respective billion-dollar acquisitions. His expertise in go-to-market strategy and building high-performing teams is exactly the kind of guidance our founders need.',
				'Together, Brian and Brent strengthen a board built around people who have actually done the work: founded companies, scaled them, and created jobs. Their experience will directly shape how we prepare Ventura County founders to do the same. Welcome to the team.',
			),
		),

		// 3 — City of Ventura investment.
		array(
			'title'      => 'The City of Ventura Invests $49,500 in Startup Ventura',
			'slug'       => 'city-of-ventura-investment',
			'date'       => '2025-11-01',
			'status'     => 'publish',
			'excerpt'    => 'The City of Ventura\'s Economic Development department has committed $49,500 to Startup Ventura, backing local founders and the companies they will build here.',
			'image'      => 'ventura-pier.jpg',
			'tags'       => array( 'announcements', 'partnerships', 'city of ventura', 'funding' ),
			'paragraphs' => array(
				'The City of Ventura has invested $49,500 in Startup Ventura through its Economic Development department, a significant vote of confidence in our mission and our model.',
				'This is what a real public-private partnership looks like. The city is not simply endorsing the idea of a stronger entrepreneurial economy. It is funding it. The investment directly supports our accelerator and the founders who come through it. As part of our partnership, seats in each cohort are reserved for entrepreneurs based in the City of Ventura, which ensures this investment comes home to local founders.',
				'The logic is straightforward. High-growth companies create jobs, payroll, and economic activity that ripple across the entire community. By investing early in the founders who build those companies, the City of Ventura is investing in its own future tax base, its own job market, and its own long-term resilience.',
				'We are grateful to the City of Ventura\'s Economic Development team for their leadership and their belief in what Ventura County founders can build. This is a model we intend to grow.',
			),
		),

		// 4 — Annual Benefit recap (with photo gallery).
		array(
			'title'      => 'Startup Ventura Annual Benefit: A Night to Remember',
			'slug'       => 'startup-ventura-annual-benefit',
			'date'       => '2025-11-17',
			'status'     => 'publish',
			'excerpt'    => 'Inside our first-ever Startup Ventura Annual Benefit: founders, officials, and supporters braved the storm and helped raise $17,000 to fuel entrepreneurship in Ventura.',
			'image'      => 'event/annual-benefit-venue.jpg',
			'tags'       => array( 'events', 'annual benefit', 'community' ),
			'gallery'    => true,
			'paragraphs' => array(
				'On Friday, November 14th, we hosted our first-ever Startup Ventura Annual Benefit, bringing together an incredible cross-section of our community. Founders, Ventura Community College leadership, Chamber board members, city and county officials, and supporters all showed up despite the stormy weather to rally behind the future of entrepreneurship in Ventura.',
				'With signature cocktails crafted by the Ventura Chamber of Commerce, a full buffet from Santa Cruz Market, and keynote remarks from Startup Ventura leadership and local officials, the evening carried a sense of purpose and momentum. Most importantly, our community helped raise $17,000 to fuel Startup Ventura\'s mission.',
				'We heard from Luke Erickson, Deputy Mayor Doug Halter, Brent Kraus, Brian Gonzalez, and John Will III, each helping spotlight the vision for an incubator launching in early 2026.',
				'Conversations throughout the night centered on Ventura\'s entrepreneurial potential, and the role local leaders will play in shaping a thriving startup ecosystem.',
				'A massive thank-you to our sponsors: Ventura Chamber of Commerce, Ventura County Credit Union, and Santa Cruz Market.',
				'And we\'re grateful to Doug and Randy for opening their beautiful space for the evening.',
			),
		),

		// 5 — Stephanie Caldwell joins the board.
		array(
			'title'      => 'Stephanie Caldwell Joins the Startup Ventura Board of Directors',
			'slug'       => 'stephanie-caldwell-joins-board',
			'date'       => '2026-02-28',
			'status'     => 'publish',
			'excerpt'    => 'Stephanie Caldwell, a longtime champion of Ventura business and a leader at the Ventura Chamber of Commerce, has joined our Board of Directors.',
			'image'      => 'team/stephanie-caldwell.jpg',
			'tags'       => array( 'announcements', 'board', 'team', 'partnerships' ),
			'paragraphs' => array(
				'Startup Ventura is honored to welcome Stephanie Caldwell to our Board of Directors.',
				'Few people have spent more of their career advocating for Ventura business than Stephanie. As President and CEO at the Ventura Chamber of Commerce since 2015, she has built a reputation as a tireless champion for local employers, workforce development, and economic opportunity across the region. She also serves as a director for the California Chamber of Commerce, which gives her a statewide view of what helps businesses grow and what holds them back.',
				'Her path here reflects the kind of operating experience our board is built on. Before Ventura, Stephanie led contingent staffing operations in Silicon Valley supporting major technology companies, and served as Chief Operations Officer of the San Jose Silicon Valley Chamber of Commerce. Her career spans sales, operations, workforce management, public service, and industry associations. She knows how businesses actually get built and supported, from the ground floor up.',
				'What she brings to Startup Ventura is more than a resume. It is a genuine, long-running commitment to seeing Ventura County businesses thrive. That is the entire reason we exist, and Stephanie has been living it for years.',
				'We could not be more excited to have her help guide what comes next. Welcome, Stephanie.',
			),
		),

	);
}
