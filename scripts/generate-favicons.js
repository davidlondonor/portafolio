const sharp = require('sharp');
const path = require('path');
const fs = require('fs');

const PUBLIC = path.join(__dirname, '..', 'public');
const SVG = path.join(PUBLIC, 'favicon.svg');

const TARGETS = [
  { name: 'favicon-16x16.png', size: 16 },
  { name: 'favicon-32x32.png', size: 32 },
  { name: 'apple-touch-icon.png', size: 180 },
  { name: 'android-chrome-192x192.png', size: 192 },
  { name: 'android-chrome-512x512.png', size: 512 },
];

(async () => {
  const svg = fs.readFileSync(SVG);
  for (const { name, size } of TARGETS) {
    const out = path.join(PUBLIC, name);
    await sharp(svg, { density: 512 })
      .resize(size, size, { fit: 'contain', background: { r: 0, g: 0, b: 0, alpha: 0 } })
      .png({ compressionLevel: 9 })
      .toFile(out);
    console.log(`✓ ${name} (${size}×${size})`);
  }
  console.log('\nDone. favicon.ico sigue siendo el viejo — si lo quieres regenerar, usa https://realfavicongenerator.net con el SVG.');
})();
