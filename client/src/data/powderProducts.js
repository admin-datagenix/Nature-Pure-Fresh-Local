/** Storefront fruit powders — images from public/products/powder/{fruit}-powder.png */

import {
  fruitKeyFromProduct,
  powderProductViewGallery,
  productViewPowderPackUrl,
  websiteProductImage,
} from './websiteImages.js';
import { applyProductViewCopy } from './applyProductViewCopy.js';

/** Display order on Fruit Powder shop category */
export const POWDER_STOREFRONT_SLUGS = [
  'freeze-dried-strawberry-powder',
  'freeze-dried-pineapple-powder',
];

const POWDER_STORE_PACK = {
  price: 320,
  weight_grams: 50,
  compare_at_price: 399,
};

const POWDER_PRODUCTS_RAW = [
  {
    id: 'powder-02',
    slug: 'freeze-dried-strawberry-powder',
    name: 'Freeze Dried Strawberry Powder',
    short_description: 'Vibrant strawberry powder — colour and flavour for desserts.',
    description:
      'Real strawberries freeze-dried and ground fine. Ideal for lattes, frosting and yoghurt.',
    ...POWDER_STORE_PACK,
    category_slug: 'baking-essentials',
    category_name: 'Fruit Powder',
    badge: 'BESTSELLER',
    rating: 4.7,
    review_count: 72,
    tags: ['100% Natural', 'No Added Sugar'],
    is_bestseller: true,
    stock: 110,
    is_active: true,
    image: null,
  },
  {
    id: 'powder-03',
    slug: 'freeze-dried-pineapple-powder',
    name: 'Freeze Dried Pineapple Powder',
    short_description: 'Tropical pineapple powder — tangy-sweet for drinks and baking.',
    description: 'Sun-ripened pineapple freeze-dried to a silky powder. No sugar added.',
    ...POWDER_STORE_PACK,
    category_slug: 'baking-essentials',
    category_name: 'Fruit Powder',
    badge: null,
    rating: 4.6,
    review_count: 58,
    tags: ['100% Natural', 'No Added Sugar'],
    is_bestseller: false,
    stock: 95,
    is_active: true,
    image: null,
  },
];

function enrichPowderProduct(product) {
  const shaped = { ...product, id: product.id };
  const fruit = fruitKeyFromProduct(shaped);
  const withCopy = applyProductViewCopy(product, fruit);
  const packImage = fruit ? productViewPowderPackUrl(fruit) : null;
  const gallery = fruit ? powderProductViewGallery(fruit) : [];
  const image =
    packImage || websiteProductImage({ ...shaped, description: withCopy.description });
  return {
    ...withCopy,
    image,
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
