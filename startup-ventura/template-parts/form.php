<?php
/**
 * Reusable form (Section 13): contact + partner enquiries + "notify me".
 * Submits to admin-ajax via main.js with a nonce; honeypot + optional Turnstile.
 *
 * @param array $args
 *   type         contact|partner-government|partner-foundations|notify
 *   submit       button label
 *   organization bool — show Organization field
 *   message      bool — show Message field (default: true unless notify)
 *   phone        bool — show Phone field (optional)
 *   interest     array — options for an "Area of interest" select
 *   two_col      bool — lay name/email and phone/interest out side by side
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}
static $sv_form_n = 0;
$sv_form_n++;
$uid       = 'svf' . $sv_form_n;
$type      = isset( $args['type'] ) ? $args['type'] : 'contact';
$submit    = isset( $args['submit'] ) ? $args['submit'] : 'Send message';
$has_org   = ! empty( $args['organization'] );
$has_phone = ! empty( $args['phone'] );
$interest  = ( ! empty( $args['interest'] ) && is_array( $args['interest'] ) ) ? $args['interest'] : array();
$has_msg   = isset( $args['message'] ) ? (bool) $args['message'] : ! in_array( $type, array( 'notify', 'newsletter' ), true );
$two_col   = ! empty( $args['two_col'] );
$full      = $two_col ? ' field--full' : ''; // span both columns in the grid layout
?>
<form class="form<?php echo $two_col ? ' form--grid' : ''; ?>" data-sv-form novalidate>
	<input type="hidden" name="action" value="sv_form">
	<input type="hidden" name="form_type" value="<?php echo esc_attr( $type ); ?>">
	<input type="hidden" name="nonce" value="<?php echo esc_attr( wp_create_nonce( 'sv_form' ) ); ?>">
	<div class="hp" aria-hidden="true">
		<label for="<?php echo esc_attr( $uid ); ?>-hp">Company URL</label>
		<input id="<?php echo esc_attr( $uid ); ?>-hp" type="text" name="sv_hp" tabindex="-1" autocomplete="off">
	</div>

	<?php if ( ! in_array( $type, array( 'notify', 'newsletter' ), true ) ) : ?>
		<div class="field">
			<label for="<?php echo esc_attr( $uid ); ?>-name"><?php esc_html_e( 'Name', 'startup-ventura' ); ?> <span class="req" aria-hidden="true">*</span></label>
			<input id="<?php echo esc_attr( $uid ); ?>-name" type="text" name="name" autocomplete="name" required>
		</div>
	<?php endif; ?>

	<?php if ( $has_org ) : ?>
		<div class="field<?php echo esc_attr( $full ); ?>">
			<label for="<?php echo esc_attr( $uid ); ?>-org"><?php esc_html_e( 'Organization', 'startup-ventura' ); ?> <span class="req" aria-hidden="true">*</span></label>
			<input id="<?php echo esc_attr( $uid ); ?>-org" type="text" name="organization" autocomplete="organization" required>
		</div>
	<?php endif; ?>

	<div class="field">
		<label for="<?php echo esc_attr( $uid ); ?>-email"><?php esc_html_e( 'Email', 'startup-ventura' ); ?> <span class="req" aria-hidden="true">*</span></label>
		<input id="<?php echo esc_attr( $uid ); ?>-email" type="email" name="email" autocomplete="email" required>
	</div>

	<?php if ( $has_phone ) : ?>
		<div class="field">
			<label for="<?php echo esc_attr( $uid ); ?>-phone"><?php esc_html_e( 'Phone', 'startup-ventura' ); ?></label>
			<input id="<?php echo esc_attr( $uid ); ?>-phone" type="tel" name="phone" autocomplete="tel">
		</div>
	<?php endif; ?>

	<?php if ( $interest ) : ?>
		<div class="field">
			<label for="<?php echo esc_attr( $uid ); ?>-interest"><?php esc_html_e( 'Area of interest', 'startup-ventura' ); ?></label>
			<select id="<?php echo esc_attr( $uid ); ?>-interest" name="interest">
				<?php foreach ( $interest as $opt ) : ?>
					<option value="<?php echo esc_attr( $opt ); ?>"><?php echo esc_html( $opt ); ?></option>
				<?php endforeach; ?>
			</select>
		</div>
	<?php endif; ?>

	<?php if ( $has_msg ) : ?>
		<div class="field<?php echo esc_attr( $full ); ?>">
			<label for="<?php echo esc_attr( $uid ); ?>-msg"><?php esc_html_e( 'Message', 'startup-ventura' ); ?> <span class="req" aria-hidden="true">*</span></label>
			<textarea id="<?php echo esc_attr( $uid ); ?>-msg" name="message" rows="6" required></textarea>
		</div>
	<?php endif; ?>

	<?php if ( SV_TURNSTILE_SITEKEY ) : ?>
		<div class="cf-turnstile<?php echo esc_attr( $full ); ?>" data-sitekey="<?php echo esc_attr( SV_TURNSTILE_SITEKEY ); ?>"></div>
	<?php endif; ?>

	<div class="<?php echo trim( 'form__submit' . $full ); ?>">
		<button class="btn btn--blue" type="submit"><?php echo esc_html( $submit ); ?></button>
	</div>
	<p class="form__status<?php echo esc_attr( $full ); ?>" role="status" aria-live="polite"></p>
</form>
