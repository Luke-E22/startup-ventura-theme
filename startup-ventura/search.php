<?php
/**
 * Search results — mirrors the News archive layout (.post-grid / .post-card).
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
			<p class="eyebrow">Search</p>
			<?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
			<h1 class="display">Search results for &ldquo;<?php echo esc_html( get_search_query() ); ?>&rdquo;</h1>
		</header>

		<?php if ( have_posts() ) : ?>
			<div class="post-grid">
				<?php while ( have_posts() ) : the_post(); ?>
					<article <?php post_class( 'post-card reveal' ); ?>>
						<?php if ( has_post_thumbnail() ) : ?>
							<a href="<?php the_permalink(); ?>" tabindex="-1" aria-hidden="true">
								<?php the_post_thumbnail( 'sv-card', array( 'class' => 'post-card__thumb', 'loading' => 'lazy' ) ); ?>
							</a>
						<?php endif; ?>
						<div class="post-card__body">
							<p class="post-card__date"><?php echo esc_html( get_the_date() ); ?></p>
							<h2 class="post-card__title"><a href="<?php the_permalink(); ?>"><?php the_title(); ?></a></h2>
							<p class="post-card__excerpt"><?php echo esc_html( wp_trim_words( get_the_excerpt(), 26 ) ); ?></p>
							<a class="post-card__more" href="<?php the_permalink(); ?>">Read more &rarr;</a>
						</div>
					</article>
				<?php endwhile; ?>
			</div>

			<?php
			the_posts_pagination( array(
				'mid_size'  => 1,
				'prev_text' => '&larr; Newer',
				'next_text' => 'Older &rarr;',
			) );
			?>
		<?php else : ?>
			<p class="lede measure">No results matched your search. Try different keywords, or search again below.</p>
			<div class="search-again reveal" style="margin-top:24px">
				<?php get_search_form(); ?>
			</div>
		<?php endif; ?>
	</div>
</section>

<?php sv_cta_band( array(
	'heading'   => 'Help fund the inaugural cohort.',
	'location'  => 'search-close',
	'secondary' => 'none',
) ); ?>

<?php get_footer(); ?>
