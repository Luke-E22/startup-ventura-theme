<?php
/**
 * Footer: persistent ask + Give, emails, social, nav, legal line, and the
 * mobile bottom Give bar. (The per-page closing CTA band is rendered by each
 * template before get_footer().)
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
$sv_info    = antispambot( SV_EMAIL_INFO );
$sv_sponsor = antispambot( SV_EMAIL_SPONSOR );
?>
</main><!-- #main -->

<footer class="site-footer" role="contentinfo">
	<div class="wave-footer" aria-hidden="true">
		<svg viewBox="0 0 1440 70" preserveAspectRatio="none" width="100%" height="70"><path d="M0,40 C300,5 560,70 840,42 C1080,18 1260,60 1440,38 L1440,0 L0,0 Z" fill="currentColor"></path></svg>
	</div>

	<div class="wrap">
		<div class="footer-grid">
			<div class="footer-brand">
				<img src="<?php echo sv_img( 'logo-white.png' ); ?>" width="280" height="91" alt="<?php echo esc_attr( get_bloginfo( 'name' ) ); ?>">
				<p><?php esc_html_e( 'A 501(c)(3) nonprofit startup accelerator backing local founders in Ventura County.', 'startup-ventura' ); ?></p>
				<?php sv_candid_seal( 'footer-seal' ); ?>
				<?php get_template_part( 'template-parts/chamber-badge' ); ?>
				<div class="footer-social">
					<a href="<?php echo esc_url( SV_LINKEDIN ); ?>" aria-label="LinkedIn" rel="noopener" target="_blank">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M4.98 3.5A2.5 2.5 0 1 1 0 3.5a2.5 2.5 0 0 1 4.98 0zM.3 8h4.4v13H.3V8zm7.5 0h4.2v1.8h.06c.58-1.05 2-2.16 4.12-2.16 4.4 0 5.22 2.9 5.22 6.67V21h-4.4v-5.92c0-1.41-.03-3.23-1.97-3.23-1.97 0-2.27 1.54-2.27 3.13V21h-4.4V8z"/></svg>
					</a>
					<a href="<?php echo esc_url( SV_INSTAGRAM ); ?>" aria-label="Instagram" rel="noopener" target="_blank">
						<svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M12 2.2c3.2 0 3.6 0 4.85.07 1.17.05 1.8.25 2.23.41.56.22.96.48 1.38.9.42.42.68.82.9 1.38.16.42.36 1.06.41 2.23.06 1.27.07 1.65.07 4.85s0 3.58-.07 4.85c-.05 1.17-.25 1.8-.41 2.23-.22.56-.48.96-.9 1.38-.42.42-.82.68-1.38.9-.42.16-1.06.36-2.23.41-1.27.06-1.65.07-4.85.07s-3.58 0-4.85-.07c-1.17-.05-1.8-.25-2.23-.41a3.7 3.7 0 0 1-1.38-.9 3.7 3.7 0 0 1-.9-1.38c-.16-.42-.36-1.06-.41-2.23C2.21 15.58 2.2 15.2 2.2 12s0-3.58.07-4.85c.05-1.17.25-1.8.41-2.23.22-.56.48-.96.9-1.38.42-.42.82-.68 1.38-.9.42-.16 1.06-.36 2.23-.41C8.42 2.21 8.8 2.2 12 2.2zm0 1.98c-3.15 0-3.5.01-4.74.07-1.14.05-1.76.24-2.17.4-.55.22-.94.47-1.35.88-.41.41-.66.8-.88 1.35-.16.41-.35 1.03-.4 2.17-.06 1.24-.07 1.59-.07 4.74s.01 3.5.07 4.74c.05 1.14.24 1.76.4 2.17.22.55.47.94.88 1.35.41.41.8.66 1.35.88.41.16 1.03.35 2.17.4 1.24.06 1.59.07 4.74.07s3.5-.01 4.74-.07c1.14-.05 1.76-.24 2.17-.4.55-.22.94-.47 1.35-.88.41-.41.66-.8.88-1.35.16-.41.35-1.03.4-2.17.06-1.24.07-1.59.07-4.74s-.01-3.5-.07-4.74c-.05-1.14-.24-1.76-.4-2.17a3.6 3.6 0 0 0-.88-1.35 3.6 3.6 0 0 0-1.35-.88c-.41-.16-1.03-.35-2.17-.4-1.24-.06-1.59-.07-4.74-.07zm0 3.37a4.45 4.45 0 1 1 0 8.9 4.45 4.45 0 0 1 0-8.9zm0 7.34a2.89 2.89 0 1 0 0-5.78 2.89 2.89 0 0 0 0 5.78zm5.66-7.57a1.04 1.04 0 1 1-2.08 0 1.04 1.04 0 0 1 2.08 0z"/></svg>
					</a>
				</div>
			</div>

			<div class="footer-col">
				<h4><?php esc_html_e( 'Explore', 'startup-ventura' ); ?></h4>
				<?php if ( has_nav_menu( 'footer' ) ) : ?>
					<?php sv_nav_menu( 'footer', array( 'depth' => 1 ) ); ?>
				<?php else : ?>
					<ul>
						<li><a href="<?php echo esc_url( home_url( '/program/' ) ); ?>"><?php esc_html_e( 'The Program', 'startup-ventura' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/why-ventura-county/' ) ); ?>"><?php esc_html_e( 'Why Ventura County', 'startup-ventura' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/impact/' ) ); ?>"><?php esc_html_e( 'Impact', 'startup-ventura' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/give/' ) ); ?>"><?php esc_html_e( 'Give', 'startup-ventura' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/partner/' ) ); ?>"><?php esc_html_e( 'Partner', 'startup-ventura' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/about/' ) ); ?>"><?php esc_html_e( 'About', 'startup-ventura' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/news/' ) ); ?>"><?php esc_html_e( 'News', 'startup-ventura' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/contact/' ) ); ?>"><?php esc_html_e( 'Contact', 'startup-ventura' ); ?></a></li>
						<li><a href="<?php echo esc_url( home_url( '/donor-wall/' ) ); ?>"><?php esc_html_e( 'Donor Wall', 'startup-ventura' ); ?></a></li>
					</ul>
				<?php endif; ?>
			</div>

			<div class="footer-col">
				<h4><?php esc_html_e( 'Get in touch', 'startup-ventura' ); ?></h4>
				<ul>
					<li><a href="mailto:<?php echo esc_attr( $sv_info ); ?>"><?php echo esc_html( $sv_info ); ?></a><br><span class="muted" style="font-size:13px"><?php esc_html_e( 'General', 'startup-ventura' ); ?></span></li>
					<li><a href="mailto:<?php echo esc_attr( $sv_sponsor ); ?>"><?php echo esc_html( $sv_sponsor ); ?></a><br><span class="muted" style="font-size:13px"><?php esc_html_e( 'Partnerships & corporate giving', 'startup-ventura' ); ?></span></li>
					<li><a href="<?php echo sv_apply_url(); ?>" data-cta="apply" data-cta-location="footer"><?php echo esc_html( sv_apply_pending() ? __( 'Get cohort updates', 'startup-ventura' ) : __( 'Apply to the cohort', 'startup-ventura' ) ); ?></a></li>
					<li><a href="<?php echo esc_url( home_url( '/press/' ) ); ?>"><?php esc_html_e( 'Press & media kit', 'startup-ventura' ); ?></a></li>
				</ul>
			</div>
		</div>

		<div class="footer-legal">
			<span><?php printf(
				/* translators: %s: EIN. */
				esc_html__( 'Startup Ventura is a 501(c)(3) nonprofit. EIN %s. Gifts are tax-deductible to the extent allowed by law.', 'startup-ventura' ),
				esc_html( SV_EIN )
			); ?></span>
			<span>&copy; <?php echo esc_html( wp_date( 'Y' ) ); ?> <?php echo esc_html( get_bloginfo( 'name' ) ); ?></span>
			<span class="footer-legal__links"><a href="<?php echo esc_url( home_url( '/privacy/' ) ); ?>"><?php esc_html_e( 'Privacy', 'startup-ventura' ); ?></a> &middot; <a href="<?php echo esc_url( home_url( '/terms/' ) ); ?>"><?php esc_html_e( 'Terms', 'startup-ventura' ); ?></a></span>
		</div>
	</div>
</footer>

<!-- Mobile bottom Give bar -->
<div class="give-bar" aria-hidden="false">
	<span class="give-bar__label"><?php esc_html_e( 'Fund the inaugural cohort', 'startup-ventura' ); ?></span>
	<?php sv_give_button( 'mobile-bar' ); ?>
</div>

<?php if ( is_front_page() ) : ?>
	<button class="replay" id="sv-intro-replay" type="button"><?php esc_html_e( 'Replay intro', 'startup-ventura' ); ?> &#8635;</button>
<?php endif; ?>

<?php wp_footer(); ?>
</body>
</html>
