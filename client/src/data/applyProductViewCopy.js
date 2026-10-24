import { productViewCopyForFruit } from './productViewCopy.js';
import { SNACK_FRUIT_BY_ID, fruitKeyFromProduct } from './websiteImages.js';

/** Apply product-view folder copy (synced into productViewCopy.js) onto a catalog record. */
export function applyProductViewCopy(product, fruitKeyOverride = null) {
  const fruit =
    fruitKeyOverride ?? SNACK_FRUIT_BY_ID[product?.id] ?? fruitKeyFromProduct(product);
  const viewCopy = fruit ? productViewCopyForFruit(fruit) : null;
  if (!viewCopy?.fullText) return product;

  return {
    ...product,
    short_description: viewCopy.intro || product.short_description,
    description: viewCopy.fullText,
    description_from_admin: true,
  };
}
