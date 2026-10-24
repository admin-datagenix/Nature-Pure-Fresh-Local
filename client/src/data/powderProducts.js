/** Storefront fruit powders — chiku, banana, guava (same pack format as chunks) */

import {
  fruitKeyFromProduct,
  productPrimaryImageIndex,
  productViewGalleryExtras,
  websiteProductImage,
} from './websiteImages.js';
import { applyProductViewCopy } from './applyProductViewCopy.js';

/** No live powder SKUs yet — chiku/banana/guava storefront uses chunk packs (fruit snack). */
export const POWDER_STOREFRONT_SLUGS = [];

const POWDER_STORE_PACK = {
  price: 220,
  weight_grams: 20,
  compare_at_price: 299,
};

const POWDER_PRODUCTS_RAW = [];

function enrichPowderProduct(product) {
  const shaped = { ...product, id: product.id };
  const fruit = fruitKeyFromProduct(shaped);
  const withCopy = applyProductViewCopy(product, fruit);
  const gallery = fruit
    ? productViewGalleryExtras(fruit, productPrimaryImageIndex(fruit))
    : [];
  return {
    ...withCopy,
    image: websiteProductImage({ ...shaped, description: withCopy.description }),
    gallery_images: gallery.length ? gallery : undefined,
    weight_options: [
      {
        grams: POWDER_STORE_PACK.weight_grams,
        price: POWDER_STORE_PACK.price,
        compare_at_price: POWDER_STORE_PACK.compare_at_price,
      },
    ],
  };
}

export const POWDER_PRODUCTS = POWDER_PRODUCTS_RAW.map(enrichPowderProduct);
