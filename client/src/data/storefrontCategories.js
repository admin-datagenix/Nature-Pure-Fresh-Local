import { CHUNKS_CATEGORY_BANNER, POWDER_CATEGORY_BANNER } from './brand.js';
import { CHUNK_PRODUCTS } from './chunkProducts.js';
import { POWDER_PRODUCTS } from './powderProducts.js';

export const STOREFRONT_CATEGORIES = [
  {
    id: '1',
    slug: 'fruit-snacks',
    name: 'Fruit Slices',
    description: 'Real fruit slices · no added sugar',
    color: '#2D3E2E',
    product_count: CHUNK_PRODUCTS.length,
    image: CHUNKS_CATEGORY_BANNER,
  },
  {
    id: '2',
    slug: 'baking-essentials',
    name: 'Fruit Powder',
    description: '100% fruit powders for smoothies, baking and everyday nutrition',
    color: '#C4A882',
    product_count: POWDER_PRODUCTS.length,
    image: POWDER_CATEGORY_BANNER,
  },
];
