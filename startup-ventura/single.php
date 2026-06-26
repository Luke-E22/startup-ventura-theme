<?php
/**
 * Single post (News). Centered header, optional hero, the_content, optional
 * terms and prev/next navigation. Article JSON-LD is emitted globally by
 * inc/schema.php — do not duplicate it here.
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
		<?php
		while ( have_posts() ) :
			the_post();
			?>
			<article <?php post_class( 'single-post' ); ?>>
				<header class="entry-header reveal">
					<p class="entry-meta"><?php echo esc_html( get_the_date() ); ?></p>
					<h1 class="display"><?php the_title(); ?></h1>
				</header>

				<?php if ( has_post_thumbnail() ) : ?>
					<figure class="entry-hero reveal">
						<?php the_post_thumbnail( 'full', array( 'loading' => 'eager' ) ); ?>
					</figure>
				<?php endif; ?>

				<div class="entry-content reveal">
					<?php the_content(); ?>
					<?php
					wp_link_pages( array(
						'before' => '<nav class="page-links" aria-label="' . esc_attr__( 'Post pages', 'startup-ventura' ) . '">',
						'after'  => '</nav>',
					) );
					?>
				</div>

				<?php
				$cats = get_the_category_list( ', ' );
				$tags = get_the_tag_list( '', ', ' );
				if ( $cats || $tags ) :
					?>
					<footer class="entry-terms wrap--narrow reveal">
						<?php if ( $cats ) : ?>
							<p class="muted"><span class="eyebrow">Filed under</span> <?php echo wp_kses_post( $cats ); ?></p>
						<?php endif; ?>
						<?php if ( $tags ) : ?>
							<p class="muted"><span class="eyebrow">Tagged</span> <?php echo wp_kses_post( $tags ); ?></p>
						<?php endif; ?>
					</footer>
				<?php endif; ?>
			</article>

			<?php
			$prev = get_previous_post();
			$next = get_next_post();
			if ( $prev || $next ) :
				?>
				<nav class="post-nav wrap--narrow reveal" aria-label="<?php esc_attr_e( 'More news', 'startup-ventura' ); ?>">
					<?php if ( $prev ) : ?>
						<a class="card__link" href="<?php echo esc_url( get_permalink( $prev ) ); ?>" rel="prev">&larr; <?php echo esc_html( get_the_title( $prev ) ); ?></a>
					<?php endif; ?>
					<?php if ( $next ) : ?>
						<a class="card__link" href="<?php echo esc_url( get_permalink( $next ) ); ?>" rel="next"><?php echo esc_html( get_the_title( $next ) ); ?> &rarr;</a>
					<?php endif; ?>
				</nav>
				<?php
			endif;
		endwhile;
		?>
	</div>
</section>

<?php sv_cta_band( array(
	'location'  => 'post-close',
	'secondary' => 'none',
) ); ?>

<?php get_footer(); ?>
