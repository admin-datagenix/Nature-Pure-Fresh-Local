// Read product view folder copy files → src/data/productViewCopy.js
// Run: npm run sync:descriptions
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const CLIENT_ROOT = path.resolve(__dirname, '..');
const SOURCE_ROOT = path.join(CLIENT_ROOT, 'website data', 'product view');
const OUT_FILE = path.join(CLIENT_ROOT, 'src', 'data', 'productViewCopy.js');

const DESC_FILE = 'descriptions & bullet points  .txt';

const FOLDER_TO_FRUIT = {
  apple: 'apple',
  banana: 'banana',
  chiku: 'chiku',
  coconut: 'coconut',
  guava: 'guava',
  'ice cream': 'ice-cream',
  jackfruit: 'jackfruit',
  jamun: 'jamun',
  Mango: 'mango',
  pineapple: 'pineapple',
  strawberry: 'strawberry',
};

function parseDescriptionFile(text) {
  const lines = text.replace(/\r\n/g, '\n').split('\n');
  let intro = '';
  const bullets = [];
  let pastDescriptionHeader = false;

  for (const raw of lines) {
    const line = raw.trim();
    if (!line) continue;
    if (/^description\s*:/i.test(line)) {
      pastDescriptionHeader = true;
      const after = line.replace(/^description\s*:\s*/i, '').trim();
      if (after) intro = after;
      continue;
    }
    if (!pastDescriptionHeader && !intro) {
      intro = line;
      pastDescriptionHeader = true;
      continue;
    }
    if (/^[\p{Emoji}\u2600-\u27BF]/u.test(line) || line.startsWith('-')) {
      bullets.push(line.replace(/^-\s*/, ''));
    } else if (!intro) {
      intro = line;
    } else {
      bullets.push(line);
    }
  }

  const fullText = [intro, ...bullets].filter(Boolean).join('\n');
  return { intro, bullets, fullText };
}

function buildCopyMap() {
  const map = {};
  if (!fs.existsSync(SOURCE_ROOT)) {
    console.warn('Missing product view root:', SOURCE_ROOT);
    return map;
  }

  for (const [folder, fruitKey] of Object.entries(FOLDER_TO_FRUIT)) {
    const filePath = path.join(SOURCE_ROOT, folder, DESC_FILE);
    if (!fs.existsSync(filePath)) {
      console.warn('skip (no copy file):', folder);
      continue;
    }
    const parsed = parseDescriptionFile(fs.readFileSync(filePath, 'utf8'));
    if (!parsed.fullText) continue;
    map[fruitKey] = parsed;
    console.log('→', fruitKey);
  }
  return map;
}

const copyByFruit = buildCopyMap();

const out = `/** Auto-generated — run \`npm run sync:descriptions\` after editing website data copy */
export const PRODUCT_VIEW_COPY_BY_FRUIT = ${JSON.stringify(copyByFruit, null, 2)};

export function productViewCopyForFruit(fruitKey) {
  return PRODUCT_VIEW_COPY_BY_FRUIT[fruitKey] || null;
}
`;

fs.writeFileSync(OUT_FILE, out, 'utf8');
console.log('\nWrote', path.relative(CLIENT_ROOT, OUT_FILE));
