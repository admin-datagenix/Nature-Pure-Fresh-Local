/** Product image helpers — clay-style fruits from FruitArt (hero-matched), photos when API provides them */

import { getFruitKey, FRUIT_COMPONENTS } from '../components/ui/FruitArt';

export { getFruitKey, FRUIT_COMPONENTS };

/** @deprecated kept for API fallback paths */
export const FRUIT_IMAGES = {
  mango: '/products/mango.svg',
  banana: '/products/banana.svg',
  jamun: '/products/jamun.svg',
  grapes: '/products/grapes.svg',
  strawberry: '/products/strawberry.svg',
  pineapple: '/products/pineapple.svg',
  combo: '/products/combo.svg',
  powder: '/products/powder.svg',
};

export function getProductImage(product) {
  if (product?.image) return product.image;
  const key = getFruitKey(product?.name);
  return FRUIT_IMAGES[key] || FRUIT_IMAGES.mango;
}
