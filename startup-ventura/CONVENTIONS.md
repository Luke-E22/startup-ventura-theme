# Startup Ventura theme — build conventions (contract)

Every page template MUST use the helpers and CSS classes below. Do not invent
new class names or re-style components; reuse what exists. All dynamic output is
escaped (`esc_html`, `esc_attr`, `esc_url`); `wp_kses_post`/`wp_kses` only for
intentional inline HTML. Guard every file with `if ( ! defined( 'ABSPATH' ) ) { exit; }`.

## Page template skeleton

```php
<?php
/** Template Name: ... (only if needed) */
if ( ! defined( 'ABSPATH' ) ) { exit; }
get_header();
?>
<?php sv_breadcrumbs(); ?>

<section class="section">
  <div class="wrap">
    <header class="page-head">
      <p class="eyebrow">EYEBROW</p>
      <?php echo sv_wave_rule(); // phpcs:ignore WordPress.Security.EscapeOutput ?>
      <h1 class="display">H1</h1>
      <p class="lede">Intro sentence.</p>
    </header>
    <!-- page body: more <section class="section ..."> blocks as needed -->
  </div>
</section>

<?php sv_cta_band( array(
  'heading'   => '...',
  'location'  => 'PAGE-close',
  'secondary' => 'apply', // none | apply | partner
) ); ?>
<?php get_footer(); ?>
```

Sub-page templates start with `sv_breadcrumbs()`. The closing band is ALWAYS
`sv_cta_band()` (Give is the coral primary; pass the relevant `secondary`).

## Hard design rules

- **Coral is for Give only.** Never put a non-Give button in coral. The Give
  button is `sv_give_button()`. Apply uses `sv_apply_button()` (outline/ghost),
  Partner uses `sv_partner_button()`. Form submit buttons use `btn--blue`.
- **Give is the dominant action on every page** (Section 2). On the closing CTA
  band Give is always primary; the page's relevant secondary is Apply or Partner.
- Every section opens with the rhythm: mono eyebrow → coral wave rule → Archivo
  heading. Use `sv_section_header( $eyebrow, $heading, $opts )` for this.
- No em dashes in copy.

## Helper API (inc/helpers.php)

| Helper | Purpose |
|---|---|
| `sv_give_button( $location, [ 'label','class','note' ] )` | Zeffy Give button. `$location` feeds analytics. |
| `sv_apply_button( $location, $label='Apply', $class='btn--outline' )` | Apply CTA (subordinate). |
| `sv_partner_button( $location, $label='Partner with us', $class='btn--outline' )` | Partner CTA. |
| `sv_section_header( $eyebrow, $heading, [ 'align'=>'left|center','tag'=>'h2','intro'=>'','light'=>false,'id'=>'' ] )` | Section rhythm. |
| `sv_wave_rule()` | Returns the small coral wave-rule SVG (echo it). |
| `sv_wave( [ 'variant'=>'full|divider' ] )` | Wave; `divider` draws on scroll. |
| `sv_stat_band( [ 'stats'=>sv_stats(),'eyebrow'=>'','heading'=>'' ] )` | Navy count-up band. |
| `sv_stat_strip( [ 'stats'=>sv_stat_strip_data() ] )` | Compact 3-number strip. |
| `sv_breadcrumbs()` | Breadcrumbs + JSON-LD. |
| `sv_cta_band( [ 'eyebrow','heading','location','secondary'=>'none|apply|partner','give_note' ] )` | Closing band. |
| `sv_tier_card( $tier )` | One Founder's Circle tier card. |
| `sv_board_card( [ 'member'=>$m ] )` | Board card (details bio). |
| `sv_partner_row( [ 'partners'=>sv_partners(),'variant'=>'logos|list' ] )` | Partner logos or list. |
| `sv_testimonial( [ 'quote','author','feature'=>false ] )` | Testimonial card. |
| `sv_process_step( [ 'num','title','body' ] )` | Numbered step. |
| `sv_img( 'rel/path.jpg' )` | Escaped theme image URL. |

## Content library accessors (verbatim data — use these, do not retype)

`sv_mission()`, `sv_stats()`, `sv_stat_strip_data()`, `sv_tiers()`, `sv_board()`,
`sv_partners()`, `sv_testimonials()` (keys: sean, jeff, john, rob),
`sv_process_steps()`, `sv_apply_url()`. Config: `SV_EIN`, `SV_COHORT_LABEL`,
`SV_COHORT_START/END`, `SV_APP_OPEN/CLOSE`, `SV_EMAIL_INFO`, `SV_EMAIL_SPONSOR`,
`SV_APPLICATION_URL`.

## CSS vocabulary (assets/css/main.css)

- Layout: `.section` (+ `--pale` `--navy` `--paper` `--tight` `grain`), `.wrap`
  (+ `--narrow`), `.page-head`, `.center`, `.lede`, `.measure`, `.muted`, `.eyebrow`.
- Buttons: `.btn` + `--give` `--ghost` `--outline` `--blue` `--lg` `--full`.
- Grids: `.card-grid` + `--2/--3/--4`; `.card` (`.card--link`, `.card__body`,
  `__title`, `__text`, `__link`); `.gift-grid`/`.gift` (`__amount`,`__text`).
- Stats: `.stat-band`/`.stat`(`__num`,`__label`); `.stat-strip`(`__item`,`__num`,`__label`).
- Tiers: `.tier-grid`/`.tier`(`--legacy`,`__name`,`__price`,`__list`,`__incl`,`__ribbon`,`__cta`).
- Steps: `.steps`/`.step`(`__num`,`__title`,`__body`).
- Board: `.board-grid`/`.board-card`(`__photo`,`__body`,`__name`,`__role`,`__details`,`__bio`,`__links`).
- Partners: `.partner-row`/`.partner`; `.partner-list`/`.partner-list__item`/`__desc`.
- Testimonials: `.testimonials`/`.testimonial`(`__mark`,`__quote`,`__attr`,`--feature`).
- Stakes (Why VC): `.stakes`/`.stakes__beat`(`__index` auto-numbers,`__sub` italic,`__text`); `.fig` = mono inline number.
- Forms: render via `get_template_part( 'template-parts/form', null, [...] )`.
- Reveal on scroll: add class `reveal` (optional `data-delay="1..4"`) to any block.

## Forms

Render with: `get_template_part( 'template-parts/form', null, array(
  'type' => 'contact|partner-government|partner-foundations|notify',
  'submit' => 'Send message',
  'organization' => true|false,
) );`
Recipient is mapped server-side (contact + gov → info@, foundations → sponsor@).
