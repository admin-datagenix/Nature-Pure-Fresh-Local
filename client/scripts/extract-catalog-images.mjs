import { PDFParse } from 'pdf-parse';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const publicDir = path.join(__dirname, '..', 'public', 'catalog');

const SOURCES = [
  {
    pdf: path.join(publicDir, 'naturepure-snacks.pdf'),
    outDir: path.join(publicDir, 'snacks'),
    pages: [2, 3, 4, 5, 6, 7, 8, 9],
  },
  {
    pdf: path.join(publicDir, 'naturepure-powder.pdf'),
    outDir: path.join(publicDir, 'powder'),
    pages: [2, 3, 4, 5, 6, 7, 8, 9],
  },
];

async function extractPages({ pdf, outDir, pages }) {
  if (!fs.existsSync(pdf)) {
    console.warn('Missing PDF:', pdf);
    return;
  }

  fs.mkdirSync(outDir, { recursive: true });
  const parser = new PDFParse({ data: fs.readFileSync(pdf) });
  const result = await parser.getImage({
    first: Math.min(...pages),
    last: Math.max(...pages),
  });

  for (const page of result.pages) {
    if (!pages.includes(page.pageNumber)) continue;
    const img = page.images?.[0];
    if (!img?.data) continue;

    const filename = `page-${String(page.pageNumber).padStart(2, '0')}.jpg`;
    fs.writeFileSync(path.join(outDir, filename), img.data);
    console.log('Saved', filename, `${img.width}x${img.height}`);
  }
}

for (const source of SOURCES) {
  await extractPages(source);
}
