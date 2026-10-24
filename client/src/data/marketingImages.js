/**
 * Marketing creatives under public/design/ — posters, shop headers, promos.
 * Filenames kept as uploaded; use marketingAssetUrl() for correct encoding.
 */

import { fruitKeyFromProduct } from './websiteImages.js';

const DESIGN_ROOT = '/design';

export function marketingAssetUrl(filename) {
  return encodeURI(`${DESIGN_ROOT}/${filename}`);
}

export const MARKETING_POWDER_SHOP_BANNER = marketingAssetUrl('pomelli_bdna_image_0926 (7).png');
export const MARKETING_CHUNKS_SHOP_BANNER = marketingAssetUrl('pomelli_bdna_image_0926 (11).png');
/** Per-fruit PDP “Highlights” slide (powder vs chunks poster). */
const PRODUCT_MARKETING_FILES = {
  banana: { powder: 'pomelli_bdna_image_0926.png' },
  guava: { powder: 'pomelli_bdna_image_0926 (1).png' },
  apple: { powder: 'pomelli_bdna_image_0926 (2).png' },
  strawberry: { powder: 'pomelli_bdna_image_0926 (3).png', chunks: 'pomelli_bdna_image_0926 (3).png' },
  jackfruit: { powder: 'pomelli_bdna_image_0926 (4).png', chunks: 'pomelli_bdna_image_0926 (4).png' },
  chiku: { powder: 'pomelli_bdna_image_0926 (5).png' },
  mango: { chunks: 'pomelli_bdna_image_0926 (11).png' },
  pineapple: { chunks: 'pomelli_bdna_image_0926 (9).png' },
  jamun: { chunks: 'pomelli_bdna_image_0926 (20).png' },
  coconut: { chunks: 'pomelli_bdna_image_0926 (8).png' },
};

/** All design filenames referenced in code — for prune / inventory. */
export function allReferencedMarketingPaths() {
  const files = new Set([
    'pomelli_bdna_image_0926.png',
    'pomelli_bdna_image_0926 (1).png',
    'pomelli_bdna_image_0926 (2).png',
    'pomelli_bdna_image_0926 (3).png',
    'pomelli_bdna_image_0926 (4).png',
    'pomelli_bdna_image_0926 (5).png',
    'pomelli_bdna_image_0926 (7).png',
    'pomelli_bdna_image_0926 (8).png',
    'pomelli_bdna_image_0926 (9).png',
    'pomelli_bdna_image_0926 (11).png',
    'pomelli_bdna_image_0926 (20).png',
  ]);
  return [...files].map((f) => marketingAssetUrl(f));
}

function isPowderProduct(product) {
  return (
    String(product?.id || '').startsWith('powder') ||
    product?.category_slug === 'baking-essentials' ||
    String(product?.slug || '').includes('powder')
  );
}

/** Optional extra PDP gallery slide — marketing poster for this SKU. */
export function productMarketingGalleryEntry(product) {
  const fruit = fruitKeyFromProduct(product);
  if (!fruit) return null;

  const files = PRODUCT_MARKETING_FILES[fruit];
  if (!files) return null;

  const powder = isPowderProduct(product);
  const filename = powder ? files.powder || files.chunks : files.chunks || files.powder;
  if (!filename) return null;

  return {
    src: marketingAssetUrl(filename),
    label: 'Highlights',
    mediaType: 'marketing',
  };
}
