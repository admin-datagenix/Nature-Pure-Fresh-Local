import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const INPUT = path.join(root, 'public/hero/banner-products.jpg');
const OUTPUT = path.join(root, 'public/hero/banner-products.png');

function isBackground(r, g, b, a) {
  if (a < 10) return true;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;

  if (max >= 232 && spread <= 28) return true;
  if (max >= 205 && spread <= 22 && r >= 200 && g >= 200 && b >= 200) return true;

  return false;
}

function idx(x, y, width) {
  return (y * width + x) * 4;
}

if (!fs.existsSync(INPUT)) {
  console.error('Banner source not found:', INPUT);
  process.exit(1);
}

const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });
const { width, height } = info;
const visited = new Uint8Array(width * height);
const queue = [];

function pushIfBackground(x, y) {
  if (x < 0 || y < 0 || x >= width || y >= height) return;
  const p = y * width + x;
  if (visited[p]) return;

  const i = idx(x, y, width);
  if (!isBackground(data[i], data[i + 1], data[i + 2], data[i + 3])) return;

  visited[p] = 1;
  queue.push(p);
}

for (let x = 0; x < width; x += 1) {
  pushIfBackground(x, 0);
  pushIfBackground(x, height - 1);
}
for (let y = 0; y < height; y += 1) {
  pushIfBackground(0, y);
  pushIfBackground(width - 1, y);
}

while (queue.length) {
  const p = queue.pop();
  const x = p % width;
  const y = Math.floor(p / width);
  const i = p * 4;
  data[i + 3] = 0;

  pushIfBackground(x - 1, y);
  pushIfBackground(x + 1, y);
  pushIfBackground(x, y - 1);
  pushIfBackground(x, y + 1);
}

const png = await sharp(data, {
  raw: { width, height, channels: 4 },
})
  .png()
  .toBuffer();

fs.writeFileSync(OUTPUT, png);
console.log('Saved transparent banner:', OUTPUT);
