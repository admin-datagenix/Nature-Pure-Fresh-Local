/**
 * Lossy/light-loss re-encode of raster assets under public/ (and optional website data/).
 * Run: node scripts/compress-public-images.mjs [--dry-run] [--website-data]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.resolve(__dirname, '..');
const PUBLIC = path.join(CLIENT_ROOT, 'public');
const WEBSITE_DATA = path.join(CLIENT_ROOT, 'website data');

const DRY_RUN = process.argv.includes('--dry-run');
const INCLUDE_WEBSITE_DATA = process.argv.includes('--website-data');

const RASTER_EXT = new Set(['.png', '.jpg', '.jpeg', '.webp']);
const JPEG_QUALITY = 82;
const WEBP_QUALITY = 82;
const PNG_OPTIONS = { compressionLevel: 9, effort: 10, adaptiveFiltering: true };

/** Longest edge — keeps quality for retina without shipping 4K PNGs */
const MAX_EDGE_BY_REL = [
  { match: /[/\\]products[/\\]product view[/\\]/i, max: 1600 },
  { match: /[/\\]products[/\\]powder[/\\]/i, max: 1200 },
  { match: /[/\\]products[/\\]banners[/\\]/i, max: 1920 },
  { match: /[/\\]hero[/\\]/i, max: 1920 },
  { match: /[/\\]about[/\\]/i, max: 1920 },
  { match: /[/\\]process[/\\]/i, max: 1920 },
  { match: /[/\\]brand[/\\]|[/\\]logo[/\\]/i, max: 2400 },
];

function maxEdgeFor(filePath) {
  const rel = filePath.replace(/\\/g, '/');
  for (const { match, max } of MAX_EDGE_BY_REL) {
    if (match.test(rel)) return max;
  }
  return 2048;
}

function listRasterFiles(root) {
  const out = [];
  if (!fs.existsSync(root)) return out;
  const walk = (dir) => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      const stat = fs.statSync(full);
      if (stat.isDirectory()) walk(full);
      else if (RASTER_EXT.has(path.extname(name).toLowerCase())) out.push(full);
    }
  };
  walk(root);
  return out;
}

async function optimizeFile(absPath) {
  const ext = path.extname(absPath).toLowerCase();
  const before = fs.statSync(absPath).size;
  let meta;
  try {
    meta = await sharp(absPath).metadata();
  } catch {
    return { before, after: before, skipped: true, reason: 'unreadable' };
  }

  const maxEdge = maxEdgeFor(absPath);
  let pipeline = sharp(absPath, { failOn: 'none' }).rotate();
  const w = meta.width || 0;
  const h = meta.height || 0;
  if (w > maxEdge || h > maxEdge) {
    pipeline = pipeline.resize(maxEdge, maxEdge, { fit: 'inside', withoutEnlargement: true });
  }

  let buffer;
  if (ext === '.jpg' || ext === '.jpeg') {
    buffer = await pipeline.jpeg({ quality: JPEG_QUALITY, mozjpeg: true, chromaSubsampling: '4:4:4' }).toBuffer();
  } else if (ext === '.webp') {
    buffer = await pipeline.webp({ quality: WEBP_QUALITY, effort: 6 }).toBuffer();
  } else if (ext === '.png') {
    buffer = await pipeline.png(PNG_OPTIONS).toBuffer();
  } else {
    return { before, after: before, skipped: true, reason: 'ext' };
  }

  if (buffer.length >= before) {
    return { before, after: before, skipped: true, reason: 'no_gain' };
  }

  if (!DRY_RUN) {
    const tmp = `${absPath}.compress-tmp`;
    try {
      fs.writeFileSync(tmp, buffer);
      fs.renameSync(tmp, absPath);
    } catch (err) {
      try {
        fs.unlinkSync(tmp);
      } catch {
        /* ignore */
      }
      return { before, after: before, skipped: true, reason: err.code || 'write_failed' };
    }
  }
  return { before, after: buffer.length, skipped: false };
}

async function runOnRoot(label, root) {
  const files = listRasterFiles(root);
  let saved = 0;
  let optimized = 0;
  let skipped = 0;

  console.log(`\n${label}: ${files.length} files`);
  for (const file of files) {
    const rel = path.relative(CLIENT_ROOT, file);
    const result = await optimizeFile(file);
    if (result.skipped) {
      skipped += 1;
      if (result.reason && result.reason !== 'no_gain') {
        console.warn('  skip', rel, result.reason);
      }
      continue;
    }
    const delta = result.before - result.after;
    saved += delta;
    optimized += 1;
    const pct = Math.round((delta / result.before) * 100);
    console.log(
      `  ${DRY_RUN ? '[dry] ' : ''}${rel}  ${(result.before / 1024).toFixed(0)}KB → ${(result.after / 1024).toFixed(0)}KB (−${pct}%)`
    );
  }
  return { files: files.length, optimized, skipped, saved };
}

async function main() {
  console.log(DRY_RUN ? 'Dry run — no files written' : 'Compressing in place…');

  const publicStats = await runOnRoot('public/', PUBLIC);
  let websiteStats = { files: 0, optimized: 0, skipped: 0, saved: 0 };
  if (INCLUDE_WEBSITE_DATA) {
    websiteStats = await runOnRoot('website data/', WEBSITE_DATA);
  }

  const totalSaved = publicStats.saved + websiteStats.saved;
  const totalOpt = publicStats.optimized + websiteStats.optimized;
  console.log('\nDone.');
  console.log(`  Optimized: ${totalOpt} files`);
  console.log(`  Saved: ${(totalSaved / 1024 / 1024).toFixed(2)} MB`);
  if (!INCLUDE_WEBSITE_DATA) {
    console.log('  Tip: re-run with --website-data to compress sources before sync.');
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
