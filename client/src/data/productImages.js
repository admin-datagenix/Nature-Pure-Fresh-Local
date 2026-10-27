/** Product images — website data assets in public/ (see scripts/sync-website-images.mjs) */

import { getFruitKey, FRUIT_COMPONENTS } from '../components/ui/FruitArt';
import {
  websiteProductImage,
  BANNER_CHUNKS,
  chunkMainImage,
  powderMainImage,
  SNACK_FRUIT_BY_ID,
  fruitKeyFromProduct,
  fruitKeyFromPowderSlug,
} from './websiteImages.js';

export function isPowderCardArtUrl(src) {
  if (!src) return false;
  return decodeURIComponent(String(src)).includes('-powder-card.png');
}

export function isPowderProduct(product) {
  const id = String(product?.product_id || product?.id || '');
  return (
    id.startsWith('powder') ||
    product?.category_slug === 'baking-essentials' ||
    String(product?.slug || '').includes('powder')
  );
}

export { getFruitKey, FRUIT_COMPONENTS };

function isRasterProductPath(src) {
  return /\.(png|jpe?g|webp|avif)(\?|$)/i.test(src || '');
}

function isWebsiteAsset(src) {
  if (!src) return false;
  const normalized = decodeURI(src);
  return (
    normalized.startsWith('/products/product view/') ||
    normalized.startsWith('/products/powder/') ||
    src.startsWith('/products/chunks/') ||
    src.startsWith('/products/banners/') ||
    src.startsWith('/hero/') ||
    src.startsWith('/brand/') ||
    src.startsWith('/about/') ||
    src.startsWith('/process/')
  );
}

export function getProductImage(product) {
  const fromItem = product?.image;
  if (fromItem && isWebsiteAsset(fromItem)) return fromItem;
  if (fromItem && isRasterProductPath(fromItem)) return fromItem;

  const website = websiteProductImage(product);
  if (website) return website;

  const id = String(product?.product_id || product?.id || '');
  const fruit =
    fruitKeyFromProduct(product) ||
    SNACK_FRUIT_BY_ID[id] ||
    fruitKeyFromPowderSlug(product?.slug);
  if (isPowderProduct(product) && fruit) {
    const powder = powderMainImage(fruit);
    if (powder) return powder;
  }
  const chunk = fruit ? chunkMainImage(fruit) : null;
  if (chunk) return chunk;

  return BANNER_CHUNKS;
}

export function getCartItemImage(item) {
  return getProductImage(item);
}

/** True when we should render an image URL (not inline FruitArt fallback). */
export function isProductImageUrl(src) {
  if (!src) return false;
  if (isWebsiteAsset(src)) return true;
  if (isRasterProductPath(src)) return true;
  if (src.startsWith('/uploads/')) return true;
  if (/^https?:\/\//i.test(src)) return true;
  return false;
}
