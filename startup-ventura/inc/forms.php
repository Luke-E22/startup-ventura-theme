<?php
/**
 * Contact + partner form handling (Section 13).
 *
 * - Submitted to admin-ajax with a nonce.
 * - Validated and sanitised server-side; recipient is mapped server-side from
 *   the form type (never trusted from the client).
 * - Honeypot + optional Cloudflare Turnstile.
 * - From a domain address with the visitor as Reply-To.
 *
 * @package StartupVentura
 */

if ( ! defined( 'ABSPATH' ) ) {
	exit;
}

/** Expose ajax url, nonce, and Turnstile site key to main.js. */
add_action( 'wp_enqueue_scripts', 'sv_forms_localize', 20 );
function sv_forms_localize() {
	if ( ! wp_script_is( 'sv-main', 'enqueued' ) ) {
		return;
	}
	wp_localize_script( 'sv-main', 'SV_FORMS', array(
		'ajax'      => admin_url( 'admin-ajax.php' ),
		'nonce'     => wp_create_nonce( 'sv_form' ),
		'turnstile' => SV_TURNSTILE_SITEKEY,
	) );
}

/** Enqueue the Turnstile widget script only when a site key is configured. */
add_action( 'wp_enqueue_scripts', 'sv_turnstile_script' );
function sv_turnstile_script() {
	if ( SV_TURNSTILE_SITEKEY ) {
		wp_enqueue_script( 'cf-turnstile', 'https://challenges.cloudflare.com/turnstile/v0/api.js', array(), null, array( 'strategy' => 'defer' ) );
	}
}

add_action( 'wp_ajax_sv_form', 'sv_handle_form' );
add_action( 'wp_ajax_nopriv_sv_form', 'sv_handle_form' );
function sv_handle_form() {
	if ( ! check_ajax_referer( 'sv_form', 'nonce', false ) ) {
		wp_send_json_error( array( 'message' => 'Your session expired. Please refresh and try again.' ), 403 );
	}

	// Honeypot: a bot filled the hidden field. Pretend success, send nothing.
	if ( ! empty( $_POST['sv_hp'] ) ) {
		wp_send_json_success( array( 'message' => 'Thanks — we\'ll be in touch.' ) );
	}

	$type = isset( $_POST['form_type'] ) ? sanitize_key( wp_unslash( $_POST['form_type'] ) ) : 'contact';

	// Turnstile (only enforced when configured).
	if ( SV_TURNSTILE_SECRET ) {
		$token  = isset( $_POST['cf-turnstile-response'] ) ? sanitize_text_field( wp_unslash( $_POST['cf-turnstile-response'] ) ) : '';
		$verify = wp_remote_post( 'https://challenges.cloudflare.com/turnstile/v0/siteverify', array(
			'timeout' => 8,
			'body'    => array(
				'secret'   => SV_TURNSTILE_SECRET,
				'response' => $token,
				'remoteip' => isset( $_SERVER['REMOTE_ADDR'] ) ? sanitize_text_field( wp_unslash( $_SERVER['REMOTE_ADDR'] ) ) : '',
			),
		) );
		$ok = ! is_wp_error( $verify ) && ! empty( json_decode( wp_remote_retrieve_body( $verify ), true )['success'] );
		if ( ! $ok ) {
			wp_send_json_error( array( 'message' => 'Spam check failed. Please try again.' ), 400 );
		}
	}

	$name    = isset( $_POST['name'] ) ? sanitize_text_field( wp_unslash( $_POST['name'] ) ) : '';
	$email   = isset( $_POST['email'] ) ? sanitize_email( wp_unslash( $_POST['email'] ) ) : '';
	$org      = isset( $_POST['organization'] ) ? sanitize_text_field( wp_unslash( $_POST['organization'] ) ) : '';
	$phone    = isset( $_POST['phone'] ) ? sanitize_text_field( wp_unslash( $_POST['phone'] ) ) : '';
	$interest = isset( $_POST['interest'] ) ? sanitize_text_field( wp_unslash( $_POST['interest'] ) ) : '';
	$message  = isset( $_POST['message'] ) ? sanitize_textarea_field( wp_unslash( $_POST['message'] ) ) : '';

	$errors = array();
	if ( ! in_array( $type, array( 'notify', 'newsletter' ), true ) && '' === $name ) {
		$errors[] = 'name';
	}
	if ( '' === $email || ! is_email( $email ) ) {
		$errors[] = 'email';
	}
	// "Notify me" only needs an email; every other form needs a message.
	if ( ! in_array( $type, array( 'notify', 'newsletter' ), true ) && '' === $message ) {
		$errors[] = 'message';
	}
	if ( $errors ) {
		wp_send_json_error( array(
			'message' => 'Please complete the required fields.',
			'fields'  => $errors,
		), 422 );
	}

	// Recipient mapped server-side from the form type.
	switch ( $type ) {
		case 'partner-foundations':
			$to = SV_EMAIL_SPONSOR;
			break;
		case 'notify':
		case 'newsletter':
			$to = SV_NOTIFY_EMAIL;
			break;
		case 'partner-government':
		case 'contact':
		default:
			$to = SV_EMAIL_INFO;
			break;
	}

	$labels  = array(
		'contact'            => 'Contact form',
		'partner-government' => 'Partner enquiry — Cities & County',
		'partner-foundations'=> 'Partner enquiry — Foundations & Corporate',
		'notify'             => 'Notify me — S27 applications',
			'newsletter'         => 'Newsletter signup',
	);
	$label   = isset( $labels[ $type ] ) ? $labels[ $type ] : 'Website form';
	$subject = sprintf( '[%s] %s', get_bloginfo( 'name' ), $label );
	if ( $interest ) {
		$subject .= ' (' . $interest . ')';
	}

	$body  = "New submission: {$label}\n\n";
	$body .= "Name: {$name}\n";
	$body .= "Email: {$email}\n";
	if ( $phone ) {
		$body .= "Phone: {$phone}\n";
	}
	if ( $interest ) {
		$body .= "Area of interest: {$interest}\n";
	}
	if ( $org ) {
		$body .= "Organization: {$org}\n";
	}
	if ( $message ) {
		$body .= "\nMessage:\n{$message}\n";
	}
	$body .= "\n---\nSent from " . home_url( '/' );

	$domain   = wp_parse_url( home_url(), PHP_URL_HOST );
	$from     = 'no-reply@' . preg_replace( '/^www\./', '', (string) $domain );
	$headers  = array(
		'From: ' . get_bloginfo( 'name' ) . ' <' . $from . '>',
		'Reply-To: ' . $name . ' <' . $email . '>',
	);

	$sent = wp_mail( $to, $subject, $body, $headers );
	if ( ! $sent ) {
		wp_send_json_error( array( 'message' => 'Something went wrong sending your message. Please email us directly at ' . SV_EMAIL_INFO . '.' ), 500 );
	}

	if ( 'newsletter' === $type ) {
		$thanks = 'Thanks for subscribing. We will keep you posted on events and announcements.';
	} elseif ( 'notify' === $type ) {
		$thanks = 'Thanks — we\'ll email you when S27 applications open.';
	} else {
		$thanks = 'Thanks — we\'ve received your message and will be in touch soon.';
	}
	wp_send_json_success( array( 'message' => $thanks ) );
}
