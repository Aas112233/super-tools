import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import { mkdirSync } from 'fs';

// Get the directory name
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Define source and destination directories
const srcDir = join(__dirname, 'src', 'assets');
const destDir = join(__dirname, 'src', 'assets', 'optimized');

// Create destination directory if it doesn't exist
mkdirSync(destDir, { recursive: true });

// Optimize images
const files = await imagemin([join(srcDir, '*.{jpg,jpeg,png}')], {
  destination: destDir,
  plugins: [
    imageminJpegtran(),
    imageminPngquant({
      quality: [0.6, 0.8]
    })
  ]
});

console.log('Images optimized:', files.map(file => file.destinationPath));