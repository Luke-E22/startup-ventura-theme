<?php
/**
 * Leadership profile — Luke Erickson (/lukeerickson).
 *
 * The canonical "Luke Erickson" page (the Leadership nav points here). The Person
 * JSON-LD is emitted for this page by inc/schema.php; the headshot is set as the
 * share image before get_header() so Open Graph/Twitter use it.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

$GLOBALS['sv_meta']['image'] = SV_URI . '/assets/img/team/luke-erickson.jpg';
get_header();

// Photo comes from the board record so it stays in one place.
$sv_photo = 'team/luke-erickson.jpg';
foreach ( sv_board() as $sv_m ) {
	if ( isset( $sv_m['name'] ) && 'Luke Erickson' === $sv_m['name'] && ! empty( $sv_m['photo'] ) ) {
		$sv_photo = $sv_m['photo'];
		break;
	}
}
?>

<?php sv_breadcrumbs(); ?>

<section class="section">
	<div class="wrap">
		<div class="profile reveal">
			<div class="profile__media">
				<img src="<?php echo sv_img( $sv_photo ); ?>" width="1000" height="1000" alt="Luke Erickson, Founder and Executive Director of Startup Ventura.">
			</div>
			<div class="profile__intro">
				<p class="eyebrow">Leadership</p>
				<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
				<h1 class="display">Luke Erickson</h1>
				<p class="profile__role">Founder &amp; Executive Director, Startup Ventura</p>
				<p class="profile__links">
					<a href="https://www.linkedin.com/in/luke-erickson/" target="_blank" rel="noopener">LinkedIn &nearr;</a>
					<a href="https://www.instagram.com/luke_erickson/" target="_blank" rel="noopener">Instagram &nearr;</a>
					<a href="https://lukeerickson.com" target="_blank" rel="noopener">lukeerickson.com &nearr;</a>
				</p>
			</div>
		</div>
	</div>
</section>

<section class="section section--pale">
	<div class="wrap wrap--narrow">
		<div class="entry-content reveal">
			<p>Luke Erickson is the founder and Executive Director of <a href="<?php echo esc_url( home_url( '/' ) ); ?>">Startup Ventura</a>, the 501(c)(3) nonprofit startup accelerator backing founders across Ventura County, California. He started the organization in 2025 to keep the region&rsquo;s ambitious, talented people building here rather than leaving for San Francisco or Los Angeles.</p>
			<p>Luke brings a background in technology and business development to the civic sector, having built and exited his own company before turning his focus to building institutions. He launched Startup Ventura to bring nationally recognized accelerator programming to Ventura County, giving local founders the mentorship, capital connections, and community to build high-growth companies at home.</p>
			<p>Under his leadership, Startup Ventura earned its 501(c)(3) status, secured a founding investment from the City of Ventura, and was awarded Candid&rsquo;s Platinum Seal of Transparency, held by fewer than one percent of U.S. nonprofits. The inaugural cohort of founders launches in Spring 2027.</p>
			<p>His commitment to Ventura County reaches beyond Startup Ventura. He serves on the board of directors of the New West Symphony, mentors students at CSU Channel Islands, and works closely with local civic and economic development organizations. A former collegiate lacrosse player, he brings the same competitiveness and discipline to building institutions that he once brought to the field.</p>
			<?php
			$sv_ann = get_page_by_path( 'luke-erickson-executive-director', OBJECT, 'post' );
			if ( $sv_ann && 'publish' === $sv_ann->post_status ) :
				?>
				<p style="margin-top:8px"><a class="card__link" href="<?php echo esc_url( get_permalink( $sv_ann ) ); ?>">Read the announcement: Luke Erickson named Executive Director &rarr;</a></p>
			<?php endif; ?>
		</div>
	</div>
</section>

<?php
sv_cta_band( array(
	'heading'   => 'Help keep Ventura County\'s founders building here.',
	'location'  => 'lukeerickson-close',
	'secondary' => 'partner',
) );
?>

<?php get_footer(); ?>
