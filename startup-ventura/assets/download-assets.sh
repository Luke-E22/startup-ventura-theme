#!/usr/bin/env bash
# Downloads every remote asset referenced by the Startup Ventura theme into assets/.
# Run from the theme root: bash assets/download-assets.sh
# Re-runnable (skips files that already exist). Convert JPG/PNG -> WebP/AVIF at deploy time.
set -u
cd "$(dirname "$0")/.." || exit 1
IMG=assets/img
UA="Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124 Safari/537.36"

get () { # url  dest
  local url="$1" dest="$2"
  if [ -s "$dest" ]; then echo "skip  $dest"; return; fi
  if curl -fsSL -m 40 -A "$UA" -o "$dest" "$url"; then echo "ok    $dest"
  else echo "FAIL  $dest  ($url)"; rm -f "$dest"; fi
}

# --- logos / favicon ---
get "https://startupventura.com/wp-content/uploads/2025/07/White_StartupVentura_final-main-1024x333.png" "$IMG/logo-white.png"
get "https://startupventura.com/wp-content/uploads/2025/09/cropped-favicon.png" "$IMG/favicon.png"

# --- hero (try full-res first, fall back to the 1024 crop) ---
if ! curl -fsSL -m 40 -A "$UA" -o "$IMG/hero.jpg" "https://startupventura.com/wp-content/uploads/2025/09/Photo-Sep-13-2025-5-26-35-PM-2.jpg"; then
  get "https://startupventura.com/wp-content/uploads/2025/09/Photo-Sep-13-2025-5-26-35-PM-2-1024x678.jpg" "$IMG/hero.jpg"
else echo "ok    $IMG/hero.jpg (full-res)"; fi

# --- team ---
get "https://startupventura.com/wp-content/uploads/2026/03/Luke-Erickson.jpg"   "$IMG/team/luke-erickson.jpg"
get "https://startupventura.com/wp-content/uploads/2025/09/brent-headshot.jpg"  "$IMG/team/brent-stig-kraus.jpg"
get "https://startupventura.com/wp-content/uploads/2025/09/brian-headshot.jpg"  "$IMG/team/brian-gonzalez.jpg"
get "https://startupventura.com/wp-content/uploads/2026/03/Stephanie-Caldwel.jpeg" "$IMG/team/stephanie-caldwell.jpg"

# --- partners (Chamber logo is provided separately -> assets/img/partners/ventura-chamber.png) ---
get "https://startupventura.com/wp-content/uploads/2025/09/city-of-ventura-1.png" "$IMG/partners/city-of-ventura.png"
get "https://startupventura.com/wp-content/uploads/2025/09/ventura-community-college-distrct-1.png" "$IMG/partners/ventura-community-college.png"
get "https://startupventura.com/wp-content/uploads/2025/09/ventura-country-credit-union.png" "$IMG/partners/ventura-county-credit-union.png"

# --- event gallery ---
get "https://startupventura.com/wp-content/uploads/2025/11/IMG_6247.jpg"  "$IMG/event/benefit-01.jpg"
get "https://startupventura.com/wp-content/uploads/2025/11/IMG_6232.jpeg" "$IMG/event/benefit-02.jpg"
get "https://startupventura.com/wp-content/uploads/2025/11/IMG_4976.jpg"  "$IMG/event/benefit-03.jpg"
get "https://startupventura.com/wp-content/uploads/2025/11/IMG_4971.jpg"  "$IMG/event/benefit-04.jpg"
get "https://startupventura.com/wp-content/uploads/2025/11/IMG_2919.jpg"  "$IMG/event/benefit-05.jpg"
get "https://startupventura.com/wp-content/uploads/2025/11/IMG_2925.jpg"  "$IMG/event/benefit-06.jpg"

# --- self-hosted fonts: pull the woff2 that Google serves to modern browsers ---
FONTS=assets/fonts
CSS_URL="https://fonts.googleapis.com/css2?family=Archivo:wght@800;900&family=Hanken+Grotesk:wght@400;500;600&family=Space+Mono:wght@400;700&display=swap"
css="$(curl -fsSL -A "$UA" "$CSS_URL" 2>/dev/null)"
if [ -n "$css" ]; then
  echo "$css" | grep -oE "https://fonts.gstatic.com/[^)]+\.woff2" | sort -u | while read -r u; do
    # name files by family+weight when derivable, else by tail
    base="$(basename "$u")"
    get "$u" "$FONTS/$base"
  done
  echo "$css" > "$FONTS/google-css2-source.css"
  echo "NOTE: review $FONTS for the woff2 files; @font-face in main.css expects archivo-800/900, hanken-400/500/600, spacemono-400/700."
else
  echo "FAIL  could not fetch Google CSS for fonts; download Archivo/Hanken Grotesk/Space Mono woff2 manually into $FONTS"
fi

echo "--- done ---"
