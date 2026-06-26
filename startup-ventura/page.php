<?php
/**
 * Generic Page fallback — any Page without a more specific template.
 *
 * Breadcrumbs, the page title as the display heading, then the WordPress loop
 * rendering the_content(), and the standard closing CTA band (Give primary).
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
	<div class="wrap wrap--narrow">
		<header class="page-head">
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput -- static SVG. ?>
			<h1 class="display"><?php the_title(); ?></h1>
		</header>

		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<div class="entry-content reveal">
				<?php the_content(); ?>
			</div>
			<?php
		endwhile;
		?>
	</div>
</section>

<?php sv_cta_band( array(
	'location'  => 'page-close',
	'secondary' => 'none',
) ); ?>

<?php get_footer(); ?>
