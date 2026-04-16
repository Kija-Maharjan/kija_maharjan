const sharp = require('sharp');
const path = require('path');

const inputPath = path.join(__dirname, '..', 'public', 'favicon.png');
const outputPath = path.join(__dirname, '..', 'public', 'favicon.ico');

sharp(inputPath)
  .resize(256, 256, {
    fit: 'contain',
    background: { r: 17, g: 16, b: 16, alpha: 1 } // dark bg matching your site
  })
  .toFile(outputPath)
  .then(info => {
    console.log('✓ Favicon ICO created:', info);
  })
  .catch(err => {
    console.error('Error creating favicon:', err);
    process.exit(1);
  });
