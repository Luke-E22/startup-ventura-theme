<?php
/**
 * Why Ventura County (/why-ventura-county) — the case for the work (Section 11).
 *
 * Affordability and brain drain are the same problem. High-growth companies are
 * the fix. Three beats carry every figure on the page; no stat wall.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
get_header();
?>

<?php sv_breadcrumbs(); ?>

<section class="section">
	<div class="wrap">
		<header class="page-head">
			<p class="eyebrow">Why Ventura County</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			<h1 class="display">We raise and educate great people. Then we lose them.</h1>
			<p class="lede">Ventura County has an affordability problem that is also a brain drain problem. People grow up here, get educated here, and then leave because there are not enough opportunities to stay. They are the same problem, and high-growth companies are the fix.</p>
		</header>
	</div>
</section>

<?php // ===== The Stakes: three beats carry every figure on the page. ===== ?>
<section class="section section--pale grain">
	<div class="wrap">
		<?php sv_section_header( 'The Stakes', 'Three numbers tell the whole story.' ); ?>
		<div class="stakes reveal">
			<div class="stakes__beat">
				<div class="stakes__index" aria-hidden="true"></div>
				<div>
					<p class="stakes__sub">It&rsquo;s getting too expensive to stay.</p>
					<p class="stakes__text"><?php echo wp_kses(
						'The median home hit a record <span class="fig">$975,000</span> last year. A decade ago, about half of local households could afford the median home. Today it&rsquo;s about <span class="fig">one in seven</span>.',
						array( 'span' => array( 'class' => array() ) )
					); ?></p>
				</div>
			</div>
			<div class="stakes__beat">
				<div class="stakes__index" aria-hidden="true"></div>
				<div>
					<p class="stakes__sub">So we&rsquo;re losing people, and getting older.</p>
					<p class="stakes__text"><?php echo wp_kses(
						'The population has declined since <span class="fig">2017</span>, even as California grew. The average resident is now nearly <span class="fig">40</span>, up from 34 in 2000. We educate talent at schools like CSU Channel Islands, then watch much of it leave.',
						array( 'span' => array( 'class' => array() ) )
					); ?></p>
				</div>
			</div>
			<div class="stakes__beat">
				<div class="stakes__index" aria-hidden="true"></div>
				<div>
					<p class="stakes__sub">High-growth companies are the fix.</p>
					<p class="stakes__text"><?php echo wp_kses(
						'And they don&rsquo;t just help founders. Widely cited research finds that every tech job creates about <span class="fig">five</span> more local jobs, most for workers without a college degree. The Trade Desk proves it can happen here: founded in Ventura in 2009, today a public company worth billions, still headquartered downtown and employing thousands. One founder. Thousands of jobs.',
						array( 'span' => array( 'class' => array() ) )
					); ?></p>
				</div>
			</div>
		</div>
	</div>
</section>

<?php sv_wave( array( 'variant' => 'divider' ) ); ?>

<?php // ===== The opportunity + the proof: the mission, and the night that proved the appetite. ===== ?>
<section class="section">
	<div class="wrap">
		<?php sv_section_header( 'The Opportunity', 'We can keep our best people here.', array(
			'intro' => sv_mission(),
		) ); ?>
		<p class="lede measure reveal">The appetite is already here. Our first Annual Benefit filled a room with operators, founders, and elected officials who all want the same thing, and the community rallied to fund what comes next. Partner support is growing, and the room keeps getting bigger.</p>
		<div class="testimonials reveal" data-delay="1" style="margin-top:40px">
			<?php
			$t = sv_testimonials();
			sv_testimonial( array_merge( $t['rob'], array( 'feature' => true ) ) );
			?>
		</div>
	</div>
</section>

<?php // ===== Closing CTA band: Give primary, Partner secondary. ===== ?>
<?php sv_cta_band( array(
	'eyebrow'   => 'The Ask',
	'heading'   => 'Give Ventura County\'s founders a reason to stay.',
	'location'  => 'why-close',
	'secondary' => 'partner',
	'give_note' => 'Funds the inaugural Spring 2027 cohort. EIN ' . SV_EIN . '.',
) ); ?>

<?php get_footer(); ?>
