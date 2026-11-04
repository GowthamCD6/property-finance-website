import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const clientDir = path.resolve(__dirname, '..');
const publicDir = path.resolve(clientDir, 'public');
const assetsDir = path.resolve(clientDir, 'src/assets/images');

if (!fs.existsSync(publicDir)) {
  fs.mkdirSync(publicDir, { recursive: true });
}

// Bolder, enlarged icon SVG where the house, chimney, and 'P' fill the rounded navy badge cleanly
const enlargedSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 64 64" fill="none">
  <!-- Background rounded square with deep brand navy -->
  <rect width="64" height="64" rx="14" fill="#002B70"/>
  
  <!-- Chimney (scaled & bolder) -->
  <path d="M12 25V11H19V17" stroke="#FF7A00" stroke-width="4.5" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- House Roof & Outline (enlarged to fill canvas prominently) -->
  <path d="M5 28L32 6L59 28" stroke="#FF7A00" stroke-width="5.5" stroke-linecap="round" stroke-linejoin="round"/>
  <path d="M12 27V55H52V50" stroke="#FF7A00" stroke-width="5" stroke-linecap="round" stroke-linejoin="round"/>
  
  <!-- Bold Stylized 'P' for Prime (larger & centered) -->
  <path d="M23 21H35.5C39.6 21 43 24.4 43 28.5C43 32.6 39.6 36 35.5 36H29.5V47H23V21Z" fill="#FFFFFF"/>
  
  <!-- Orange Inner Accent inside P -->
  <path d="M29.5 26.5H34.5C35.9 26.5 37 27.6 37 28.5C37 29.4 35.9 30.5 34.5 30.5H29.5V26.5Z" fill="#FF7A00"/>
</svg>`;

// Save enlarged SVG to both public/favicon.svg and src/assets/images/favicon.svg
fs.writeFileSync(path.join(publicDir, 'favicon.svg'), enlargedSvg.trim());
fs.writeFileSync(path.join(assetsDir, 'favicon.svg'), enlargedSvg.trim());
console.log('Saved favicon.svg to public and assets');

const svgBuffer = Buffer.from(enlargedSvg);

// Generate standard PNG sizes
const sizes = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'favicon-48x48.png', size: 48 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

for (const { name, size } of sizes) {
  await sharp(svgBuffer)
    .resize(size, size)
    .png()
    .toFile(path.join(publicDir, name));
  console.log(`Generated ${name} (${size}x${size})`);
}

// Generate multi-resolution favicon.ico containing 16x16, 32x32, 48x48 PNGs
// Simple standard ICO format builder:
// ICO header (6 bytes) + directory entries (16 bytes each) + image data
const icoSizes = [16, 32, 48];
const pngBuffers = [];
for (const s of icoSizes) {
  const buf = await sharp(svgBuffer).resize(s, s).png().toBuffer();
  pngBuffers.push({ size: s, buffer: buf });
}

function createIco(images) {
  const count = images.length;
  const header = Buffer.alloc(6);
  header.writeUInt16LE(0, 0); // reserved
  header.writeUInt16LE(1, 2); // type 1 = icon
  header.writeUInt16LE(count, 4); // count

  let offset = 6 + count * 16;
  const dirEntries = [];
  for (const img of images) {
    const entry = Buffer.alloc(16);
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 0); // width
    entry.writeUInt8(img.size >= 256 ? 0 : img.size, 1); // height
    entry.writeUInt8(0, 2); // color count
    entry.writeUInt8(0, 3); // reserved
    entry.writeUInt16LE(1, 4); // color planes
    entry.writeUInt16LE(32, 6); // bpp
    entry.writeUInt32LE(img.buffer.length, 8); // size
    entry.writeUInt32LE(offset, 12); // offset
    dirEntries.push(entry);
    offset += img.buffer.length;
  }

  return Buffer.concat([header, ...dirEntries, ...images.map((img) => img.buffer)]);
}

const icoBuffer = createIco(pngBuffers);
fs.writeFileSync(path.join(publicDir, 'favicon.ico'), icoBuffer);
console.log('Generated favicon.ico with multi-resolution bitmaps');

// Also copy logo.png and logo-dark.png to public/ for direct access
fs.copyFileSync(path.join(assetsDir, 'logo.png'), path.join(publicDir, 'logo.png'));
fs.copyFileSync(path.join(assetsDir, 'logo-dark.png'), path.join(publicDir, 'logo-dark.png'));
console.log('Copied logo.png and logo-dark.png to public/');

// Create site.webmanifest for PWA & mobile app bookmarking
const webManifest = {
  name: "Prime Associates — Loans & Constructions",
  short_name: "Prime Associates",
  description: "Institutional Property Finance Advisory & Lowest Interest Rate Mortgage Solutions",
  start_url: "/",
  display: "standalone",
  background_color: "#002B70",
  theme_color: "#002B70",
  icons: [
    {
      src: "/android-chrome-192x192.png",
      sizes: "192x192",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/android-chrome-512x512.png",
      sizes: "512x512",
      type: "image/png",
      purpose: "any maskable"
    },
    {
      src: "/favicon.svg",
      sizes: "any",
      type: "image/svg+xml"
    }
  ]
};

fs.writeFileSync(path.join(publicDir, 'site.webmanifest'), JSON.stringify(webManifest, null, 2));
console.log('Generated site.webmanifest');
