/**
 * Generates the placeholder product artwork and Shop hero banner as SVG.
 * Real catalogue imagery would come from the CDN; keeping these as generated
 * vectors means the repo has no binary assets and nothing to fetch at runtime.
 *
 * Run with: node scripts/generate-artwork.mjs
 */
import { mkdirSync, writeFileSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { fileURLToPath } from "node:url";

const root = resolve(dirname(fileURLToPath(import.meta.url)), "..");

const BRAND = "#712CDC";

/** Rounded-rect helper. */
const rr = (x, y, w, h, r, fill, extra = "") =>
  `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${r}" fill="${fill}" ${extra}/>`;

function frame(id, from, to, body) {
  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 600" width="800" height="600" role="img">
  <defs>
    <linearGradient id="${id}" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="${from}"/>
      <stop offset="100%" stop-color="${to}"/>
    </linearGradient>
  </defs>
  <rect width="800" height="600" fill="url(#${id})"/>
  <circle cx="660" cy="110" r="150" fill="#ffffff" opacity="0.28"/>
  <circle cx="120" cy="520" r="120" fill="#ffffff" opacity="0.18"/>
${body}
</svg>
`;
}

const artwork = {
  smartphone: frame(
    "g1",
    "#EFE8FF",
    "#DCD0FB",
    `  ${rr(320, 110, 160, 380, 26, "#2A2A30")}
  ${rr(330, 122, 140, 356, 20, "#F5F3FF")}
  ${rr(366, 130, 68, 12, 6, "#2A2A30")}
  ${rr(348, 160, 104, 150, 12, BRAND, 'opacity="0.14"')}
  <circle cx="392" cy="200" r="22" fill="${BRAND}" opacity="0.35"/>
  ${rr(348, 330, 104, 10, 5, "#CFC3F2")}
  ${rr(348, 352, 74, 10, 5, "#CFC3F2")}`,
  ),

  laptop: frame(
    "g2",
    "#E9F0FF",
    "#D4DDF8",
    `  ${rr(200, 140, 400, 250, 16, "#2A2A30")}
  ${rr(214, 154, 372, 222, 8, "#F5F7FF")}
  ${rr(250, 190, 180, 14, 7, BRAND, 'opacity="0.25"')}
  ${rr(250, 220, 300, 10, 5, "#D6DCF0")}
  ${rr(250, 244, 250, 10, 5, "#D6DCF0")}
  ${rr(150, 390, 500, 26, 12, "#3A3A42")}
  ${rr(340, 396, 120, 8, 4, "#5A5A66")}`,
  ),

  tablet: frame(
    "g3",
    "#E8FBF4",
    "#CFEFE3",
    `  ${rr(250, 110, 300, 380, 24, "#2A2A30")}
  ${rr(264, 124, 272, 352, 14, "#F4FFFB")}
  ${rr(300, 170, 200, 120, 12, BRAND, 'opacity="0.16"')}
  ${rr(300, 312, 200, 12, 6, "#C9E7DC")}
  ${rr(300, 340, 140, 12, 6, "#C9E7DC")}
  <circle cx="400" cy="452" r="10" fill="#C9CDD6"/>`,
  ),

  audio: frame(
    "g4",
    "#FFF0E8",
    "#FBD9C8",
    `  <path d="M240 340 v-40 a160 160 0 0 1 320 0 v40" fill="none" stroke="#2A2A30" stroke-width="26" stroke-linecap="round"/>
  ${rr(196, 320, 92, 150, 34, "#2A2A30")}
  ${rr(512, 320, 92, 150, 34, "#2A2A30")}
  ${rr(210, 336, 64, 118, 26, BRAND, 'opacity="0.3"')}
  ${rr(526, 336, 64, 118, 26, BRAND, 'opacity="0.3"')}`,
  ),

  wearable: frame(
    "g5",
    "#F3E8FF",
    "#E0CFFB",
    `  ${rr(346, 90, 108, 110, 26, "#3A3A42")}
  ${rr(346, 400, 108, 110, 26, "#3A3A42")}
  ${rr(316, 180, 168, 240, 46, "#2A2A30")}
  ${rr(332, 196, 136, 208, 34, "#0E0E12")}
  <circle cx="400" cy="284" r="52" fill="none" stroke="${BRAND}" stroke-width="12" opacity="0.85"/>
  <circle cx="400" cy="284" r="32" fill="none" stroke="#3ED598" stroke-width="10" opacity="0.85"/>
  ${rr(486, 250, 12, 44, 6, "#8A8A95")}`,
  ),

  television: frame(
    "g6",
    "#EAEAF5",
    "#D3D3E8",
    `  ${rr(120, 120, 560, 320, 14, "#1F1F26")}
  ${rr(132, 132, 536, 296, 8, "#0C0C11")}
  ${rr(180, 180, 220, 110, 10, BRAND, 'opacity="0.5"')}
  ${rr(180, 306, 320, 14, 7, "#2E2E3A")}
  ${rr(180, 336, 240, 14, 7, "#2E2E3A")}
  ${rr(370, 440, 60, 40, 6, "#3A3A46")}
  ${rr(280, 480, 240, 20, 10, "#2A2A34")}`,
  ),
};

mkdirSync(resolve(root, "public/products"), { recursive: true });
for (const [name, svg] of Object.entries(artwork)) {
  writeFileSync(resolve(root, `public/products/${name}.svg`), svg);
}

const hero = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 800 400" width="800" height="400" role="img">
  <defs>
    <linearGradient id="hero" x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%" stop-color="#5A20B4"/>
      <stop offset="55%" stop-color="${BRAND}"/>
      <stop offset="100%" stop-color="#9A6BF0"/>
    </linearGradient>
  </defs>
  <rect width="800" height="400" fill="url(#hero)"/>
  <circle cx="690" cy="70" r="170" fill="#ffffff" opacity="0.10"/>
  <circle cx="90" cy="330" r="140" fill="#ffffff" opacity="0.08"/>
  <text x="48" y="150" font-family="Geist, Segoe UI, sans-serif" font-size="44" font-weight="700" fill="#ffffff">Shop today,</text>
  <text x="48" y="204" font-family="Geist, Segoe UI, sans-serif" font-size="44" font-weight="700" fill="#ffffff">pay later</text>
  <text x="48" y="252" font-family="Geist, Segoe UI, sans-serif" font-size="22" font-weight="500" fill="#ffffff" opacity="0.88">using your mutual funds</text>
  <rect x="48" y="286" width="228" height="46" rx="23" fill="#ffffff" opacity="0.16"/>
  <text x="72" y="316" font-family="Geist, Segoe UI, sans-serif" font-size="17" font-weight="600" fill="#ffffff">0% interest EMIs</text>
</svg>
`;

mkdirSync(resolve(root, "public/banners"), { recursive: true });
writeFileSync(resolve(root, "public/banners/shop-hero.svg"), hero);

console.log("Artwork written to public/products and public/banners.");
