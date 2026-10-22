/**
 * Copy images from client/website data → public/ with short names.
 * Run: node scripts/sync-website-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.resolve(__dirname, '..');
const SOURCE = path.join(CLIENT_ROOT, 'website data');
const PUBLIC = path.join(CLIENT_ROOT, 'public');

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function copyFile(from, to) {
  if (!fs.existsSync(from)) {
    console.warn('skip (missing):', from);
    return false;
  }
  ensureDir(path.dirname(to));
  fs.copyFileSync(from, to);
  console.log('→', path.relative(CLIENT_ROOT, to));
  return true;
}

function classifyPngFiles(dir) {
  const files = fs
    .readdirSync(dir)
    .filter((f) => /\.(png|jpe?g)$/i.test(f))
    .map((f) => path.join(dir, f));

  const main = files.find((f) => /watermark-removed/i.test(f)) || files[0];
  const pack = files.find((f) => /pomelli/i.test(f));
  const alt = files.find(
    (f) => f !== main && f !== pack && (/gemini/i.test(f) || /whatsapp/i.test(f))
  );
  return { main, pack, alt };
}

/** {fruit}-1.png (product), {fruit}-2.png (packaging), {fruit}-3.png (detail/infographic) */
function syncProductViewPngs(key, folderName) {
  const pngDir = path.join(SOURCE, 'product view', folderName, 'png format');
  const outDir = path.join(PUBLIC, 'products', 'product view', folderName, 'png format');
  if (!fs.existsSync(pngDir)) {
    console.warn('no product view folder:', folderName);
    return;
  }
  ensureDir(outDir);

  const fromNumbered = [1, 2, 3].map((n) => path.join(pngDir, `${key}-${n}.png`));
  if (fromNumbered.every((p) => fs.existsSync(p))) {
    fromNumbered.forEach((src, i) => copyFile(src, path.join(outDir, `${key}-${i + 1}.png`)));
    return;
  }

  const { main, pack, alt } = classifyPngFiles(pngDir);
  const slot2 = pack || alt;
  const slot3 = alt && alt !== pack ? alt : pack && pack !== main ? pack : null;

  if (main) copyFile(main, path.join(outDir, `${key}-1.png`));
  if (slot2) copyFile(slot2, path.join(outDir, `${key}-2.png`));
  if (slot3) copyFile(slot3, path.join(outDir, `${key}-3.png`));
}

/** Live storefront SKUs only — run prune-public-images.mjs after sync if website data grows. */
const PRODUCT_FOLDERS = {
  banana: 'banana',
  chiku: 'chiku',
  guava: 'guava',
  jackfruit: 'jackfruit',
  jamun: 'jamun',
  mango: 'Mango',
  pineapple: 'pineapple',
  strawberry: 'strawberry',
};

ensureDir(PUBLIC);

// Brand — keep public/brand/logo-3.png as the site logo (not overwritten here)
copyFile(
  path.join(SOURCE, 'logo', 'pomelli_bdna_image_1004 (1).png'),
  path.join(PUBLIC, 'brand', 'footer-logo.png')
);

// Hero & categories
copyFile(path.join(SOURCE, 'front page.png'), path.join(PUBLIC, 'hero', 'home.png'));
copyFile(
  path.join(SOURCE, 'category section', 'slices section.png'),
  path.join(PUBLIC, 'hero', 'category-chunks.png')
);
copyFile(
  path.join(SOURCE, 'category section', 'powder section.png'),
  path.join(PUBLIC, 'hero', 'category-powder.png')
);

// Shop category headers
copyFile(
  path.join(SOURCE, 'category section', 'slices section.png'),
  path.join(PUBLIC, 'products', 'banners', 'chunks.png')
);
copyFile(
  path.join(SOURCE, 'category section', 'powder section.png'),
  path.join(PUBLIC, 'products', 'banners', 'powder.png')
);

// About page header banner
copyFile(
  path.join(SOURCE, 'about us', 'about-us-img.png'),
  path.join(PUBLIC, 'about', 'about-us-img.png')
);

// About cascade: use client/public/about/fruit-cascade.png (uploaded separately); skip sync overwrite.

// Process
copyFile(
  path.join(SOURCE, 'process details', 'Hygienic Freeze-Dried Produce Facility (1).png'),
  path.join(PUBLIC, 'process', 'hero.png')
);
copyFile(
  path.join(SOURCE, 'process details', 'Gemini_Generated_Image_epfy7wepfy7wepfy.png'),
  path.join(PUBLIC, 'process', 'step-1.png')
);
copyFile(
  path.join(SOURCE, 'process details', 'Gemini_Generated_Image_my51fymy51fymy51.png'),
  path.join(PUBLIC, 'process', 'step-2.png')
);
copyFile(
  path.join(SOURCE, 'process details', 'watermark-removed-Gemini_Generated_Image_raeceqraeceqraec (1).png'),
  path.join(PUBLIC, 'process', 'step-3.png')
);
copyFile(
  path.join(SOURCE, 'process details', 'Gemini_Generated_Image_my51fymy51fymy51.png'),
  path.join(PUBLIC, 'process', 'step-4.png')
);
copyFile(
  path.join(SOURCE, 'process details', 'Gemini_Generated_Image_epfy7wepfy7wepfy.png'),
  path.join(PUBLIC, 'process', 'step-5.png')
);

// Product view PNGs (numbered {fruit}-1..3 in public/)
for (const [key, folderName] of Object.entries(PRODUCT_FOLDERS)) {
  syncProductViewPngs(key, folderName);
}

console.log('\nDone. Images are under public/ — run: node scripts/prune-public-images.mjs');
