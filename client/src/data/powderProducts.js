/** Storefront fruit powders — chiku, banana, guava (same pack format as chunks) */

import {
  fruitKeyFromProduct,
  productPrimaryImageIndex,
  productViewGalleryExtras,
  websiteProductImage,
} from './websiteImages.js';

export const POWDER_STOREFRONT_SLUGS = [
  'freeze-dried-chiku-powder',
  'freeze-dried-banana-powder',
  'freeze-dried-guava-powder',
];

const POWDER_STORE_PACK = {
  price: 220,
  weight_grams: 20,
  compare_at_price: 299,
};

const POWDER_PRODUCTS_RAW = [
  {
    id: 'powder-chiku',
    slug: 'freeze-dried-chiku-powder',
    name: 'Freeze Dried Chiku Powder',
    short_description: 'Caramel-sweet chiku powder for smoothies, desserts and baby food.',
    description: 'Single-ingredient chiku powder milled fine. Stir into milk or batter for natural sweetness.',
    ...POWDER_STORE_PACK,
    category_slug: 'baking-essentials',
    category_name: 'Fruit Powder',
    badge: null,
    rating: 4.6,
    review_count: 38,
    tags: ['100% Natural', 'No Added Sugar'],
    is_bestseller: true,
    stock: 200,
    is_active: true,
    image: null,
  },
  {
    id: 'powder-banana',
    slug: 'freeze-dried-banana-powder',
    name: 'Freeze Dried Banana Powder',
    short_description: 'Creamy banana powder for shakes, baby food and baking.',
    description: 'Real banana freeze-dried and milled fine. Rich aroma with no additives.',
    ...POWDER_STORE_PACK,
    category_slug: 'baking-essentials',
    category_name: 'Fruit Powder',
    badge: 'BESTSELLER',
    rating: 4.8,
    review_count: 196,
    tags: ['100% Natural'],
    is_bestseller: true,
    stock: 240,
    is_active: true,
    image: null,
  },
  {
    id: 'powder-guava',
    slug: 'freeze-dried-guava-powder',
    name: 'Freeze Dried Guava Powder',
    short_description: 'Fine guava powder for smoothies, desserts and everyday nutrition.',
    description: 'Real guava freeze-dried and milled. Natural tang with no additives.',
    ...POWDER_STORE_PACK,
    category_slug: 'baking-essentials',
    category_name: 'Fruit Powder',
    badge: 'NEW',
    rating: 4.7,
    review_count: 42,
    tags: ['100% Natural', 'No Added Sugar'],
    is_bestseller: true,
    stock: 320,
    is_active: true,
    image: null,
  },
];

function enrichPowderProduct(product) {
  const shaped = { ...product, id: product.id };
  const fruit = fruitKeyFromProduct(shaped);
  const gallery = fruit
    ? productViewGalleryExtras(fruit, productPrimaryImageIndex(fruit))
    : [];
  return {
    ...product,
    image: websiteProductImage(shaped),
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
