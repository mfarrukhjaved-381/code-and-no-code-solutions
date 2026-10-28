#!/usr/bin/env bash
#
# Converts the source photos into the small WebP files the site serves.
#
# Run once whenever a source image in images/ or project-pictures/ changes, then commit the
# output in public/images/. Conversion happens here, not in the Vercel build, so deploys stay
# fast and need no native image tooling. Requires ImageMagick 7 (`magick`).
#
#   Team portraits: cropped to 3:4, converted to monochrome so the two studio headshots and the
#   two editorial posters read as one set, at most 600x800.
#   Project screenshots: resized to 960px wide, enough for a 2x card on desktop.

set -euo pipefail

root="$(cd "$(dirname "$0")/.." && pwd)"
team_out="$root/public/images/team"
work_out="$root/public/images/work"
mkdir -p "$team_out" "$work_out"

# Source file name -> output slug. Explicit, because the source names are inconsistently cased.
declare -A team=(
  [mateen.jpg]=mateen-ikhtiar
  [Tayyab.png]=muhammad-tayyab
  [Rizwan.jpg]=rizwan-ahmed
  [farrukh.png]=muhammad-farrukh-javed
)

for source in "${!team[@]}"; do
  input="$root/images/$source"
  # The trailing newline matters: without it `read` returns non-zero and `set -e` aborts.
  read -r width height < <(magick identify -format '%w %h\n' "$input")
  # Largest centred 3:4 window that fits the image (posters already are 3:4; squares lose sides).
  if (( width * 4 > height * 3 )); then
    crop_w=$(( height * 3 / 4 )); crop_h=$height
  else
    crop_w=$width; crop_h=$(( width * 4 / 3 ))
  fi
  magick "$input" -gravity center -crop "${crop_w}x${crop_h}+0+0" +repage \
    -colorspace Gray -resize '600x800>' -strip -quality 74 "$team_out/${team[$source]}.webp"
done

for input in "$root"/project-pictures/*.png; do
  slug="$(basename "$input" .png)"
  magick "$input" -resize '960x>' -strip -quality 72 "$work_out/$slug.webp"
done

du -h "$team_out"/*.webp "$work_out"/*.webp
