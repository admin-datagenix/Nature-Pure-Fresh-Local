/**
 * Remove studio background from pouch art in public/products/powder → {fruit}-powder.png
 * Run: node scripts/process-powder-pack-png.mjs [strawberry|pineapple|all]
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.resolve(__dirname, '..');
const POWDER_PUBLIC = path.join(CLIENT_ROOT, 'public', 'products', 'powder');

/** Must match productLayout.js CARD_TONES for seamless card background */
const CARD_TONES = {
  strawberry: '#F3D8D4',
  pineapple: '#F0E6C8',
};

const CARD_SIZE = 600;
/** Same visual weight as chunk `-2` shots in the square card */
const POUCH_MAX_HEIGHT = 500;
const POUCH_MAX_WIDTH = 468;

function hexToRgb(hex) {
  const h = hex.replace('#', '');
  return {
    r: parseInt(h.slice(0, 2), 16),
    g: parseInt(h.slice(2, 4), 16),
    b: parseInt(h.slice(4, 6), 16),
  };
}

async function buildCardImage(cutoutBuffer, toneHex) {
  const { r, g, b } = hexToRgb(toneHex);
  const resized = await sharp(cutoutBuffer)
    .resize({
      width: POUCH_MAX_WIDTH,
      height: POUCH_MAX_HEIGHT,
      fit: 'inside',
      withoutEnlargement: false,
    })
    .toBuffer();
  const { width: pw, height: ph } = await sharp(resized).metadata();
  const left = Math.round((CARD_SIZE - pw) / 2);
  const top = Math.round((CARD_SIZE - ph) / 2);

  return sharp({
    create: {
      width: CARD_SIZE,
      height: CARD_SIZE,
      channels: 3,
      background: { r, g, b },
    },
  })
    .composite([{ input: resized, left, top }])
    .png({ compressionLevel: 9, effort: 10 })
    .toBuffer();
}

/** Source files the user placed in public/products/powder */
const ALL_SOURCES = [
  {
    fruit: 'strawberry',
    folder: 'strawberry',
    source: 'pomelli_bdna_image_0915 (3).png',
  },
  {
    fruit: 'pineapple',
    folder: 'pineapple',
    source: 'pomelli_bdna_image_0915 (20).png',
  },
];

function sampleEdgeBackground(pixels, width, height, channels) {
  const samples = [];
  const step = Math.max(1, Math.floor(Math.min(width, height) / 40));

  for (let x = 0; x < width; x += step) {
    samples.push(px(pixels, x, 0, width, channels));
    samples.push(px(pixels, x, height - 1, width, channels));
  }
  for (let y = 0; y < height; y += step) {
    samples.push(px(pixels, 0, y, width, channels));
    samples.push(px(pixels, width - 1, y, width, channels));
  }

  const rs = samples.map((s) => s.r).sort((a, b) => a - b);
  const gs = samples.map((s) => s.g).sort((a, b) => a - b);
  const bs = samples.map((s) => s.b).sort((a, b) => a - b);
  const mid = Math.floor(rs.length / 2);
  return { r: rs[mid], g: gs[mid], b: bs[mid] };
}

function px(pixels, x, y, width, channels) {
  const i = (y * width + x) * channels;
  return { r: pixels[i], g: pixels[i + 1], b: pixels[i + 2] };
}

function colorDist(r, g, b, bg) {
  return Math.hypot(r - bg.r, g - bg.g, b - bg.b);
}

function isBackdrop(r, g, b, bg) {
  const d = colorDist(r, g, b, bg);
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const avg = (r + g + b) / 3;
  if (d <= 38) return true;
  if (diff <= 28 && avg >= 200 && d <= 52) return true;
  if (diff <= 34 && avg >= 88 && avg <= 248 && d <= 44) return true;
  if (diff <= 20 && avg >= 248) return true;
  return false;
}

function removeBackdropFloodFill(pixels, width, height, channels, bg) {
  const visited = new Uint8Array(width * height);
  const queue = [];

  const trySeed = (x, y) => {
    const i = (y * width + x) * channels;
    if (!isBackdrop(pixels[i], pixels[i + 1], pixels[i + 2], bg)) return;
    const p = y * width + x;
    if (visited[p]) return;
    visited[p] = 1;
    queue.push(p);
  };

  for (let x = 0; x < width; x += 1) {
    trySeed(x, 0);
    trySeed(x, height - 1);
  }
  for (let y = 0; y < height; y += 1) {
    trySeed(0, y);
    trySeed(width - 1, y);
  }

  while (queue.length) {
    const p = queue.pop();
    const x = p % width;
    const y = Math.floor(p / width);
    const i = p * channels;
    pixels[i + 3] = 0;

    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (visited[np]) continue;
      const ni = np * channels;
      if (!isBackdrop(pixels[ni], pixels[ni + 1], pixels[ni + 2], bg)) continue;
      visited[np] = 1;
      queue.push(np);
    }
  }
}

/** Studio floor shadow (grey, low saturation) left under pouch on mockup photos */
function isStudioShadowPixel(r, g, b) {
  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const diff = max - min;
  const avg = (r + g + b) / 3;
  return diff <= 32 && avg >= 42 && avg <= 195;
}

function removeStudioShadow(pixels, width, height, channels) {
  const alpha = new Uint8Array(width * height);
  for (let p = 0; p < width * height; p += 1) {
    alpha[p] = pixels[p * channels + 3];
  }

  const queue = [];
  for (let p = 0; p < width * height; p += 1) {
    if (alpha[p] === 0) queue.push(p);
  }

  while (queue.length) {
    const p = queue.pop();
    const x = p % width;
    const y = Math.floor(p / width);
    for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
      if (nx < 0 || ny < 0 || nx >= width || ny >= height) continue;
      const np = ny * width + nx;
      if (alpha[np] === 0) continue;
      const ni = np * channels;
      const r = pixels[ni];
      const g = pixels[ni + 1];
      const b = pixels[ni + 2];
      if (!isStudioShadowPixel(r, g, b)) continue;
      pixels[ni + 3] = 0;
      alpha[np] = 0;
      queue.push(np);
    }
  }
}

function featherAlphaEdges(pixels, width, height, channels, bg) {
  const alpha = new Uint8Array(width * height);
  for (let p = 0; p < width * height; p += 1) {
    alpha[p] = pixels[p * channels + 3];
  }

  for (let y = 1; y < height - 1; y += 1) {
    for (let x = 1; x < width - 1; x += 1) {
      const p = y * width + x;
      const i = p * channels;
      if (alpha[p] === 0) continue;

      let transparentNeighbors = 0;
      for (const [nx, ny] of [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]]) {
        if (alpha[ny * width + nx] === 0) transparentNeighbors += 1;
      }
      if (transparentNeighbors === 0) continue;

      const d = colorDist(pixels[i], pixels[i + 1], pixels[i + 2], bg);
      if (d < 58) {
        const t = Math.min(1, Math.max(0, (d - 18) / 40));
        pixels[i + 3] = Math.round(255 * t);
      }
    }
  }
}

async function removeStudioBackground(inputPath) {
  const { data, info } = await sharp(inputPath)
    .ensureAlpha()
    .raw()
    .toBuffer({ resolveWithObject: true });

  const { width, height, channels } = info;
  const pixels = Buffer.from(data);
  const bg = sampleEdgeBackground(pixels, width, height, channels);
  removeBackdropFloodFill(pixels, width, height, channels, bg);
  removeStudioShadow(pixels, width, height, channels);
  featherAlphaEdges(pixels, width, height, channels, bg);

  return sharp(pixels, { raw: { width, height, channels: 4 } })
    .trim({ threshold: 8 })
    .extend({
      top: 12,
      bottom: 12,
      left: 12,
      right: 12,
      background: { r: 0, g: 0, b: 0, alpha: 0 },
    })
    .png({ compressionLevel: 9, effort: 10 });
}

function ensureDir(dir) {
  fs.mkdirSync(dir, { recursive: true });
}

async function main() {
  const arg = (process.argv[2] || 'all').toLowerCase();
  const sources = arg === 'all' ? ALL_SOURCES : ALL_SOURCES.filter((s) => s.fruit === arg);

  if (!sources.length) {
    console.error('Use: strawberry, pineapple, or all');
    process.exit(1);
  }

  for (const { fruit, folder, source } of sources) {
    const input = path.join(POWDER_PUBLIC, source);
    if (!fs.existsSync(input)) {
      console.error('Missing:', input);
      process.exitCode = 1;
      continue;
    }

    const cutoutName = `${fruit}-powder.png`;
    const cardName = `${fruit}-powder-card.png`;
    const tone = CARD_TONES[fruit] || '#EDE4D4';

    const cutoutBuffer = await (await removeStudioBackground(input)).toBuffer();
    const cardBuffer = await buildCardImage(cutoutBuffer, tone);

    const cutoutOut = path.join(POWDER_PUBLIC, cutoutName);
    const cardOut = path.join(POWDER_PUBLIC, cardName);
    const websiteOut = path.join(
      CLIENT_ROOT,
      'website data',
      'product view',
      folder,
      'png format',
      cutoutName
    );
    const publicViewOut = path.join(
      CLIENT_ROOT,
      'public',
      'products',
      'product view',
      folder,
      'png format',
      cutoutName
    );
    const websiteCardOut = path.join(
      CLIENT_ROOT,
      'website data',
      'product view',
      folder,
      'png format',
      cardName
    );
    const publicViewCardOut = path.join(
      CLIENT_ROOT,
      'public',
      'products',
      'product view',
      folder,
      'png format',
      cardName
    );

    fs.writeFileSync(cutoutOut, cutoutBuffer);
    fs.writeFileSync(cardOut, cardBuffer);
    ensureDir(path.dirname(websiteOut));
    ensureDir(path.dirname(publicViewOut));
    fs.writeFileSync(websiteOut, cutoutBuffer);
    fs.writeFileSync(publicViewOut, cutoutBuffer);
    fs.writeFileSync(websiteCardOut, cardBuffer);
    fs.writeFileSync(publicViewCardOut, cardBuffer);
    console.log('✓', cutoutName, '+', cardName, '←', source);
  }
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
