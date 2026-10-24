/**
 * Copy images from client/website data → public/ with short names.
 * Run: node scripts/sync-website-images.mjs
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { PDFParse } from 'pdf-parse';

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

/** {fruit}-1..3 product views; optional {fruit}-4.png (info sheet) */
function syncProductViewPngs(key, folderName) {
  const pngDir = path.join(SOURCE, 'product view', folderName, 'png format');
  const outDir = path.join(PUBLIC, 'products', 'product view', folderName, 'png format');
  if (!fs.existsSync(pngDir)) {
    console.warn('no product view folder:', folderName);
    return;
  }
  ensureDir(outDir);

  for (const n of [1, 2, 3, 4]) {
    const numbered = path.join(pngDir, `${key}-${n}.png`);
    if (fs.existsSync(numbered)) {
      copyFile(numbered, path.join(outDir, `${key}-${n}.png`));
    }
  }

  const fromNumbered = [1, 2, 3].map((n) => path.join(pngDir, `${key}-${n}.png`));
  if (fromNumbered.every((p) => fs.existsSync(p))) {
    return;
  }

  const { main, pack, alt } = classifyPngFiles(pngDir);
  const slot2 = pack || alt;
  const slot3 = alt && alt !== pack ? alt : pack && pack !== main ? pack : null;

  if (main) copyFile(main, path.join(outDir, `${key}-1.png`));
  if (slot2) copyFile(slot2, path.join(outDir, `${key}-2.png`));
  if (slot3) copyFile(slot3, path.join(outDir, `${key}-3.png`));
}

/** One PDF per product view folder → public …/pdf format/{key}-4.pdf (downloads; not in PDP gallery). */
function syncProductViewPdf(key, folderName) {
  const productDir = path.join(SOURCE, 'product view', folderName);
  if (!fs.existsSync(productDir)) return;

  const pdfName = fs
    .readdirSync(productDir)
    .find((f) => f.toLowerCase().endsWith('.pdf'));
  if (!pdfName) return;

  const outDir = path.join(PUBLIC, 'products', 'product view', folderName, 'pdf format');
  copyFile(path.join(productDir, pdfName), path.join(outDir, `${key}-4.pdf`));
}

/** When {key}-4.png is missing but {key}-4.pdf exists, rasterize page 1 for the PDP gallery. */
async function syncProductViewPng4FromPdf(key, folderName) {
  const pngDir = path.join(PUBLIC, 'products', 'product view', folderName, 'png format');
  const outPath = path.join(pngDir, `${key}-4.png`);
  if (fs.existsSync(outPath)) return;

  const pdfPath = path.join(
    PUBLIC,
    'products',
    'product view',
    folderName,
    'pdf format',
    `${key}-4.pdf`
  );
  if (!fs.existsSync(pdfPath)) return;

  try {
    const parser = new PDFParse({ data: fs.readFileSync(pdfPath) });
    const result = await parser.getImage({ first: 1, last: 1 });
    const img = result.pages?.[0]?.images?.[0];
    if (!img?.data) {
      console.warn('skip png4 (no raster in PDF):', key);
      return;
    }
    ensureDir(pngDir);
    fs.writeFileSync(outPath, img.data);
    console.log('→ generated', path.relative(CLIENT_ROOT, outPath), 'from PDF');
  } catch (err) {
    console.warn('png4 from pdf failed:', key, err?.message || err);
  }
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
function resolveFooterLogoSource() {
  const candidates = [
    path.join(SOURCE, 'logo', 'footer-logo.png'),
    path.join(SOURCE, 'logo', 'watermark-removed-Gemini_Generated_Image_u3y7t9u3y7t9u3y7.png'),
    path.join(SOURCE, 'logo', 'pomelli_bdna_image_1004 (1).png'),
  ];
  return candidates.find((p) => fs.existsSync(p));
}

const footerLogoSrc = resolveFooterLogoSource();
if (footerLogoSrc) {
  const footerPublic = path.join(PUBLIC, 'logo', 'footer-logo.png');
  const footerBrand = path.join(PUBLIC, 'brand', 'footer-logo.png');
  copyFile(footerLogoSrc, footerPublic);
  copyFile(footerLogoSrc, footerBrand);
}

// Hero & categories
copyFile(path.join(SOURCE, 'front page.png'), path.join(PUBLIC, 'hero', 'home.png'));
// Homepage category strip (legacy hero paths — optional if banners exist)
const chunksBanner = path.join(PUBLIC, 'products', 'banners', 'chunks.png');
const powderBanner = path.join(PUBLIC, 'products', 'banners', 'powder.png');
if (fs.existsSync(chunksBanner)) {
  copyFile(chunksBanner, path.join(PUBLIC, 'hero', 'category-chunks.png'));
} else {
  copyFile(
    path.join(SOURCE, 'category section', 'slices section.png'),
    path.join(PUBLIC, 'hero', 'category-chunks.png')
  );
}
if (fs.existsSync(powderBanner)) {
  copyFile(powderBanner, path.join(PUBLIC, 'hero', 'category-powder.png'));
} else {
  copyFile(
    path.join(SOURCE, 'category section', 'powder section.png'),
    path.join(PUBLIC, 'hero', 'category-powder.png')
  );
}

// Shop banners: keep files in public/products/banners/ (chunks.png, powder.png, etc.) — not overwritten here.

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

const ALL_PRODUCT_VIEW_FOLDERS = {
  apple: 'apple',
  banana: 'banana',
  chiku: 'chiku',
  coconut: 'coconut',
  guava: 'guava',
  'ice-cream': 'ice cream',
  jackfruit: 'jackfruit',
  jamun: 'jamun',
  mango: 'Mango',
  pineapple: 'pineapple',
  strawberry: 'strawberry',
};

// Product view PNGs (numbered {fruit}-1..4 in public/)
for (const [key, folderName] of Object.entries(ALL_PRODUCT_VIEW_FOLDERS)) {
  syncProductViewPngs(key, folderName);
}

for (const [key, folderName] of Object.entries(ALL_PRODUCT_VIEW_FOLDERS)) {
  syncProductViewPdf(key, folderName);
}

for (const [key, folderName] of Object.entries(ALL_PRODUCT_VIEW_FOLDERS)) {
  await syncProductViewPng4FromPdf(key, folderName);
}

console.log('\nDone. Images are under public/ — run: node scripts/prune-public-images.mjs');
