/** Short public paths — synced from `website data/` via scripts/sync-website-images.mjs */

export const BRAND_LOGO = '/brand/logo-3.png';
export const BRAND_FOOTER_LOGO = '/brand/footer-logo.png';

export const HERO_HOME = '/hero/home.png';
export const HERO_CATEGORY_CHUNKS = '/hero/category-chunks.png';
export const HERO_CATEGORY_POWDER = '/hero/category-powder.png';

export const BANNER_CHUNKS = '/products/banners/chunks.png';
export const BANNER_POWDER = '/products/banners/powder.png';

export const ABOUT_CASCADE = '/about/fruit-cascade.png';

export const PROCESS_HERO = '/process/hero.png';
export const PROCESS_STEPS = [
  '/process/step-1.png',
  '/process/step-2.png',
  '/process/step-3.png',
  '/process/step-4.png',
  '/process/step-5.png',
];

export const PRODUCT_VIEW_FOLDER_BY_KEY = {
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

const CHUNK_FRUITS = Object.keys(PRODUCT_VIEW_FOLDER_BY_KEY);
const PRODUCT_VIEW_ROOT = '/products/product view';
const PNG_FORMAT_DIR = 'png format';

export function productViewPngUrl(fruitKey, index) {
  const folder = PRODUCT_VIEW_FOLDER_BY_KEY[fruitKey];
  if (!folder || !index || index < 1) return null;
  return encodeURI(`${PRODUCT_VIEW_ROOT}/${folder}/${PNG_FORMAT_DIR}/${fruitKey}-${index}.png`);
}

/** Main / card / homepage image — always packaging view (-2) when available. */
export const PRODUCT_VIEW_PRIMARY_INDEX = {
  mango: 2,
  jamun: 2,
  jackfruit: 2,
  pineapple: 2,
  strawberry: 2,
  chiku: 2,
  banana: 2,
  guava: 2,
};

export function productPrimaryImageIndex(fruit) {
  return PRODUCT_VIEW_PRIMARY_INDEX[fruit] ?? 2;
}

export function powderPrimaryImageIndex(fruit) {
  return productPrimaryImageIndex(fruit);
}

export function chunkMainImage(fruit) {
  if (!fruit || !CHUNK_FRUITS.includes(fruit)) return null;
  return productViewPngUrl(fruit, productPrimaryImageIndex(fruit));
}

export function powderMainImage(fruit) {
  if (!fruit || !CHUNK_FRUITS.includes(fruit)) return null;
  return productViewPngUrl(fruit, powderPrimaryImageIndex(fruit));
}

const VIEW_LABELS = { 1: 'Product', 2: 'Packaging', 3: 'Detail' };

/** PDP + stored gallery: main (-2) first, then -1 and -3 only. */
export function productViewGallery(fruit, primaryIdxOverride = null) {
  if (!fruit || !CHUNK_FRUITS.includes(fruit)) return [];
  const primaryIdx = primaryIdxOverride ?? productPrimaryImageIndex(fruit);
  const galleryOnly = [1, 2, 3].filter((n) => n !== primaryIdx).sort((a, b) => a - b);
  const mainSrc = productViewPngUrl(fruit, primaryIdx);
  if (!mainSrc) return [];
  return [
    { src: mainSrc, label: VIEW_LABELS[primaryIdx] || 'Product' },
    ...galleryOnly.map((n) => ({
      src: productViewPngUrl(fruit, n),
      label: VIEW_LABELS[n] || `View ${n}`,
    })),
  ].filter((v) => v.src);
}

/** Extra views for product records (excludes main — use with product.image). */
export function productViewGalleryExtras(fruit, primaryIdxOverride = null) {
  const primaryIdx = primaryIdxOverride ?? productPrimaryImageIndex(fruit);
  if (!fruit || !CHUNK_FRUITS.includes(fruit)) return [];
  return [1, 2, 3]
    .filter((n) => n !== primaryIdx)
    .sort((a, b) => a - b)
    .map((n) => ({
      src: productViewPngUrl(fruit, n),
      label: VIEW_LABELS[n] || `View ${n}`,
    }))
    .filter((v) => v.src);
}

export function chunkGallery(fruit) {
  return productViewGallery(fruit);
}

/** Mock snack id → fruit folder key (website data product view). */
export const SNACK_FRUIT_BY_ID = {
  'snack-01': 'apple',
  'snack-02': 'banana',
  'snack-03': 'chiku',
  'snack-04': 'coconut',
  'snack-05': 'grapes',
  'snack-06': 'guava',
  'snack-07': 'ice-cream',
  'snack-08': 'jackfruit',
  'snack-09': 'jamun',
  'snack-10': 'pineapple',
  'snack-11': 'strawberry',
  'snack-12': 'sugarcane',
  'snack-13': 'mango',
};

const POWDER_SLUG_FRUIT = [
  ['freeze-dried-apple-powder', 'apple'],
  ['freeze-dried-banana-powder', 'banana'],
  ['freeze-dried-chiku-powder', 'chiku'],
  ['freeze-dried-coconut-powder', 'coconut'],
  ['freeze-dried-green-grapes-powder', 'grapes'],
  ['freeze-dried-guava-powder', 'guava'],
  ['freeze-dried-jackfruit-powder', 'jackfruit'],
  ['freeze-dried-jamun-powder', 'jamun'],
  ['freeze-dried-pineapple-powder', 'pineapple'],
  ['freeze-dried-strawberry-powder', 'strawberry'],
];

export function fruitKeyFromPowderSlug(slug) {
  const s = String(slug || '').toLowerCase();
  const hit = POWDER_SLUG_FRUIT.find(([prefix]) => s === prefix);
  if (hit) return hit[1];
  for (const [, fruit] of POWDER_SLUG_FRUIT) {
    if (s.includes(fruit)) return fruit;
  }
  return null;
}

export function fruitKeyFromProduct(product) {
  const id = String(product?.product_id || product?.id || '');
  if (SNACK_FRUIT_BY_ID[id]) return SNACK_FRUIT_BY_ID[id];
  if (id.startsWith('powder-') || product?.category_slug === 'baking-essentials') {
    return fruitKeyFromPowderSlug(product?.slug);
  }
  const slug = String(product?.slug || '').toLowerCase();
  if (slug.includes('ice-cream')) return 'ice-cream';
  for (const fruit of CHUNK_FRUITS) {
    if (slug.includes(fruit.replace('-', '')) || slug.includes(fruit)) return fruit;
  }
  return null;
}

const GENERIC_CHUNK_FALLBACK = BANNER_CHUNKS;
const GENERIC_POWDER_FALLBACK = BANNER_POWDER;

export function websiteProductImage(product) {
  const fruit = fruitKeyFromProduct(product);
  const isPowder =
    String(product?.id || '').startsWith('powder') ||
    product?.category_slug === 'baking-essentials' ||
    String(product?.slug || '').includes('powder');

  if (fruit) {
    const main = isPowder ? powderMainImage(fruit) : chunkMainImage(fruit);
    if (main) return main;
  }

  if (isPowder) return GENERIC_POWDER_FALLBACK;
  return GENERIC_CHUNK_FALLBACK;
}

export function websiteProductGallery(product) {
  const fruit = fruitKeyFromProduct(product);
  const isPowder =
    String(product?.id || '').startsWith('powder') ||
    product?.category_slug === 'baking-essentials';

  if (fruit) {
    const main = isPowder ? powderMainImage(fruit) : chunkMainImage(fruit);
    if (main) {
      const primaryIdx = isPowder ? powderPrimaryImageIndex(fruit) : productPrimaryImageIndex(fruit);
      const gallery = productViewGallery(fruit, primaryIdx).filter((v) => v.src);
      if (gallery.length) return gallery;
    }
  }

  const primary = websiteProductImage(product);
  const secondary = isPowder ? BANNER_POWDER : BANNER_CHUNKS;
  return [
    { src: primary, label: 'Product' },
    ...(secondary !== primary ? [{ src: secondary, label: 'Range' }] : []),
  ];
}
