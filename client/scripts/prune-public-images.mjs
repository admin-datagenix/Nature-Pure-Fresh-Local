/**
 * Keep only referenced files under public/; move the rest to unused-public-assets/ (gitignored).
 * Run: node scripts/prune-public-images.mjs [--dry-run]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(CLIENT_ROOT, 'public');
const ARCHIVE_ROOT = path.join(CLIENT_ROOT, 'unused-public-assets');

const DRY_RUN = process.argv.includes('--dry-run');

/** Fruits with live SKUs (chunks + powders) — product view PNGs only for these. */
const STOREFRONT_FRUIT_KEYS = [
  'mango',
  'jamun',
  'jackfruit',
  'pineapple',
  'strawberry',
  'chiku',
  'banana',
  'guava',
];

const PRODUCT_VIEW_FOLDER_BY_KEY = {
  mango: 'Mango',
  jamun: 'jamun',
  jackfruit: 'jackfruit',
  pineapple: 'pineapple',
  strawberry: 'strawberry',
  chiku: 'chiku',
  banana: 'banana',
  guava: 'guava',
};

const CERTIFICATE_HEADER_IDS = [
  'apeda',
  'startup-india',
  'quality-2',
  'fssai',
  'msme',
  'make-in-india',
  'pure-natural',
  'export',
];

const CERTIFICATE_PDFS = [
  'APEDA Certificate.pdf',
  'Startup India certificate.pdf',
  'IEC.pdf',
  'FESSIA.pdf',
  'Udyam Registration Certificate.pdf',
];

function normalizePublicPath(urlPath) {
  if (!urlPath || typeof urlPath !== 'string') return null;
  let p = urlPath.split('?')[0].split('#')[0];
  if (!p.startsWith('/')) return null;
  p = decodeURI(p);
  return p.replace(/^\//, '').replace(/\//g, path.sep);
}

function addUsed(set, urlPath) {
  const rel = normalizePublicPath(urlPath);
  if (rel) set.add(rel);
}

function collectFromSourceScan(set) {
  const roots = [path.join(CLIENT_ROOT, 'src'), path.join(CLIENT_ROOT, 'index.html')];
  const re = /\/(?:[A-Za-z0-9][A-Za-z0-9 _./%-]*)\.(?:png|jpe?g|svg|webp|gif|pdf|ico)(?=['"`\s)>]|$)/gi;

  function scanFile(file) {
    const text = fs.readFileSync(file, 'utf8');
    let m;
    while ((m = re.exec(text)) !== null) {
      addUsed(set, m[0]);
    }
  }

  for (const root of roots) {
    if (!fs.existsSync(root)) continue;
    if (fs.statSync(root).isFile()) {
      scanFile(root);
      continue;
    }
    const walk = (dir) => {
      for (const name of fs.readdirSync(dir)) {
        const full = path.join(dir, name);
        if (fs.statSync(full).isDirectory()) walk(full);
        else if (/\.(jsx?|tsx?|html|css|mjs)$/i.test(name)) scanFile(full);
      }
    };
    walk(root);
  }
}

function addStorefrontProductViews(set) {
  for (const key of STOREFRONT_FRUIT_KEYS) {
    const folder = PRODUCT_VIEW_FOLDER_BY_KEY[key];
    if (!folder) continue;
    for (let i = 1; i <= 4; i += 1) {
      addUsed(
        set,
        `/products/product view/${folder}/png format/${key}-${i}.png`
      );
    }
    addUsed(set, `/products/product view/${folder}/pdf format/${key}-4.pdf`);
  }
}

function addCertificateAssets(set) {
  for (const id of CERTIFICATE_HEADER_IDS) {
    addUsed(set, `/Certificates/headers/${id}.png`);
  }
  for (const pdf of CERTIFICATE_PDFS) {
    addUsed(set, `/Certificates/${pdf}`);
  }
}

function listAllFiles(dir, base = dir) {
  const out = [];
  if (!fs.existsSync(dir)) return out;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) out.push(...listAllFiles(full, base));
    else out.push(path.relative(base, full));
  }
  return out;
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

function moveToArchive(relPath) {
  const from = path.join(PUBLIC, relPath);
  const to = path.join(ARCHIVE_ROOT, relPath);
  if (!fs.existsSync(from)) return;
  ensureDir(path.dirname(to));
  if (DRY_RUN) {
    console.log('[dry-run] archive', relPath);
    return;
  }
  if (fs.existsSync(to)) fs.rmSync(to, { force: true });
  fs.renameSync(from, to);
  console.log('archived', relPath);
}

function pruneEmptyDirs(dir) {
  if (!fs.existsSync(dir)) return;
  for (const name of fs.readdirSync(dir)) {
    const full = path.join(dir, name);
    if (fs.statSync(full).isDirectory()) pruneEmptyDirs(full);
  }
  if (dir !== PUBLIC && fs.existsSync(dir) && fs.readdirSync(dir).length === 0) {
    if (!DRY_RUN) fs.rmdirSync(dir);
  }
}

const used = new Set();
collectFromSourceScan(used);
addStorefrontProductViews(used);
addCertificateAssets(used);

const designDir = path.join(PUBLIC, 'design');
if (fs.existsSync(designDir)) {
  for (const rel of listAllFiles(designDir, designDir)) {
    addUsed(used, `/design/${rel.split(path.sep).join('/')}`);
  }
}

// Homepage hero carousel (brand.js HERO_BANNER_SLIDES)
for (let n = 1; n <= 5; n += 1) {
  addUsed(used, `/hero/Banner-img-${n}.svg`);
}

// Shop / category PNG banners (brand.js)
for (const file of [
  'chunks.png',
  'chunks-transparent.png',
  'chunks-1.png',
  'powder.png',
  'powder-transparent.png',
  'powder-2.png',
]) {
  addUsed(used, `/products/banners/${file}`);
}

// Always keep common static files if present
addUsed(used, '/logo/footer-logo.png');
addUsed(used, '/brand/footer-logo.png');

addUsed(used, '/robots.txt');
addUsed(used, '/catalog/naturepure-snacks.pdf');
addUsed(used, '/catalog/naturepure-powder.pdf');

for (const fruit of ['strawberry', 'pineapple']) {
  addUsed(used, `/products/powder/${fruit}-powder.png`);
  addUsed(used, `/products/powder/${fruit}-powder-card.png`);
}
addUsed(used, '/products/powder/powder-shop-banner.png');
addUsed(used, '/products/powder/powder-banner.svg');

const allPublic = listAllFiles(PUBLIC);
let moved = 0;
let kept = 0;

for (const rel of allPublic.sort()) {
  const norm = rel.split(path.sep).join(path.sep);
  if (used.has(norm)) {
    kept += 1;
    continue;
  }
  moveToArchive(norm);
  moved += 1;
}

if (!DRY_RUN) pruneEmptyDirs(PUBLIC);

console.log(`\n${DRY_RUN ? 'Would archive' : 'Archived'}: ${moved} file(s); kept: ${kept}`);
console.log(`Archive root: ${path.relative(CLIENT_ROOT, ARCHIVE_ROOT)}`);
