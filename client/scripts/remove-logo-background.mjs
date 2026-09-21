import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import sharp from 'sharp';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(__dirname, '..');

const INPUT = path.join(root, 'public/brand/logo.png');
const OUTPUTS = [
  path.join(root, 'public/brand/logo.png'),
  path.join(root, 'src/assets/brand-logo.png'),
];

function isBackground(r, g, b, a) {
  if (a < 10) return true;

  const max = Math.max(r, g, b);
  const min = Math.min(r, g, b);
  const spread = max - min;

  if (max >= 210 && spread <= 28) return true;
  if (max >= 185 && spread <= 18 && r >= 180 && g >= 180 && b >= 180) return true;

  return false;
}

const { data, info } = await sharp(INPUT).ensureAlpha().raw().toBuffer({ resolveWithObject: true });

for (let i = 0; i < data.length; i += 4) {
  const r = data[i];
  const g = data[i + 1];
  const b = data[i + 2];
  const a = data[i + 3];

  if (isBackground(r, g, b, a)) {
    data[i + 3] = 0;
  }
}

const png = await sharp(data, {
  raw: { width: info.width, height: info.height, channels: 4 },
})
  .png()
  .toBuffer();

for (const out of OUTPUTS) {
  fs.writeFileSync(out, png);
  console.log('Saved transparent logo:', out);
}
