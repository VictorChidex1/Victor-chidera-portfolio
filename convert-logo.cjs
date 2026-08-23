const sharp = require('sharp');
const fs = require('fs');

async function convert() {
  try {
    await sharp('./public/vc-logo.svg')
      .webp({ quality: 90 })
      .toFile('./public/vc-logo.webp');
    console.log('Successfully converted logo to WebP!');
  } catch (err) {
    console.error('Error converting logo:', err);
  }
}

convert();
