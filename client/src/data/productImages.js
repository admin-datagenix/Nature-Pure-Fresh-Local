/** Product image URLs — storefront uses SVG product art only */

import { getFruitKey, FRUIT_COMPONENTS } from '../components/ui/FruitArt';

export { getFruitKey, FRUIT_COMPONENTS };

const SNACK_SVG = (n) => `/products/snacks/${n}.svg`;

/** SVG paths keyed by fruit / product type (no catalog JPGs on product UI) */
export const SVG_PRODUCT_IMAGES = {
  apple: SNACK_SVG(13),
  banana: SNACK_SVG(2),
  custard: SNACK_SVG(3),
  coconut: SNACK_SVG(4),
  grapes: SNACK_SVG(5),
  guava: SNACK_SVG(6),
  combo: SNACK_SVG(7),
  mango: SNACK_SVG(8),
  jackfruit: SNACK_SVG(8),
  jamun: SNACK_SVG(9),
  pineapple: SNACK_SVG(10),
  strawberry: SNACK_SVG(11),
  sugarcane: SNACK_SVG(12),
  powder: '/products/powder.svg',
  kiwi: SNACK_SVG(5),
};

/** @deprecated use SVG_PRODUCT_IMAGES */
export const PRODUCT_IMAGES = { ...SVG_PRODUCT_IMAGES };

/** @deprecated kept for API fallback paths */
export const FRUIT_IMAGES = {
  mango: '/products/mango.svg',
  banana: '/products/banana.svg',
  jamun: '/products/jamun.svg',
  grapes: '/products/grapes.svg',
  strawberry: '/products/strawberry.svg',
  pineapple: '/products/pineapple.svg',
  combo: SNACK_SVG(7),
  powder: '/products/powder.svg',
};

function isSvgPath(src) {
  return /\.svg(\?|$)/i.test(src || '');
}

function svgForProduct(product) {
  const key = getFruitKey(product?.name || '');
  if (key === 'combo' || product?.slug?.includes('variety') || product?.slug?.includes('combo')) {
    return SVG_PRODUCT_IMAGES.combo;
  }
  if (key === 'powder' || product?.slug?.includes('powder')) {
    return SVG_PRODUCT_IMAGES.powder;
  }
  return SVG_PRODUCT_IMAGES[key] || SVG_PRODUCT_IMAGES.strawberry;
}

export function getProductImage(product) {
  const fromItem = resolveSnackSvgPath(product?.image);
  if (fromItem && isSvgPath(fromItem)) return fromItem;

  const snackSvg = snackSvgFromProductId(product?.product_id || product?.id);
  if (snackSvg) return snackSvg;

  return svgForProduct(product);
}

/** Cart / checkout line items — always prefer products/snacks SVGs for chunk products. */
export function getCartItemImage(item) {
  const resolved = resolveSnackSvgPath(item?.image);
  if (resolved && isSvgPath(resolved)) return resolved;
  const snackSvg = snackSvgFromProductId(item?.product_id || item?.id);
  if (snackSvg) return snackSvg;
  return getProductImage(item);
}

function snackSvgFromProductId(productId) {
  const id = String(productId || '');
  const match = /^snack-(\d{2})$/i.exec(id);
  if (match) return SNACK_SVG(Number(match[1]));
  if (id === 'combo-01' || id === 'combo-02') return SNACK_SVG(7);
  if (id === 'powder-01') return SVG_PRODUCT_IMAGES.powder;
  return null;
}

/** Maps legacy /catalog/snacks paths to /products/snacks SVGs only. */
function resolveSnackSvgPath(src) {
  if (!src) return null;
  if (src.startsWith('/catalog/snacks/')) {
    return src.replace('/catalog/snacks/', '/products/snacks/').replace(/\.(jpe?g|png|webp)$/i, '.svg');
  }
  if (src.startsWith('/products/snacks/')) {
    return src.replace(/\.(jpe?g|png|webp)$/i, '.svg');
  }
  if (src.startsWith('/products/') && isSvgPath(src)) {
    if (src.endsWith('/combo.svg')) return SNACK_SVG(7);
    return src;
  }
  if (isSvgPath(src)) return src;
  return null;
}

/** True when we should render an SVG/img asset (not inline FruitArt fallback). */
export function isProductImageUrl(src) {
  if (!src) return false;
  if (isSvgPath(src)) return true;
  if (src.startsWith('/products/snacks/')) return true;
  if (src.startsWith('/products/') && !/\.(jpe?g|png|webp|avif)(\?|$)/i.test(src)) return true;
  return false;
}
