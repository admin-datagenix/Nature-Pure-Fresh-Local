/** Hero / marketing product shots — website data (public/products/chunks/) */

import { BANNER_CHUNKS, BANNER_POWDER, chunkMainImage } from './websiteImages.js';

export const SNACK_IMAGES = {
  apple: BANNER_CHUNKS,
  banana: chunkMainImage('banana'),
  chiku: chunkMainImage('chiku'),
  coconut: BANNER_CHUNKS,
  grapes: BANNER_CHUNKS,
  guava: chunkMainImage('guava'),
  combo: BANNER_CHUNKS,
  jackfruit: chunkMainImage('jackfruit'),
  jamun: chunkMainImage('jamun'),
  mango: chunkMainImage('mango'),
  pineapple: chunkMainImage('pineapple'),
  strawberry: chunkMainImage('strawberry'),
  sugarcane: BANNER_CHUNKS,
};

export const POWDER_IMAGES = {
  abc: BANNER_POWDER,
  apple: BANNER_POWDER,
  banana: chunkMainImage('banana'),
  beetroot: BANNER_POWDER,
  chiku: chunkMainImage('chiku'),
  coconut: BANNER_POWDER,
  dragonfruit: BANNER_POWDER,
  drumstick: BANNER_POWDER,
  grapes: BANNER_POWDER,
  guava: chunkMainImage('guava'),
  jackfruit: chunkMainImage('jackfruit'),
  jamun: chunkMainImage('jamun'),
  pineapple: chunkMainImage('pineapple'),
  pomegranate: BANNER_POWDER,
  strawberry: chunkMainImage('strawberry'),
  sugarcane: BANNER_POWDER,
};

export const PRODUCT_IMAGES = {
  mango: SNACK_IMAGES.mango,
  strawberry: SNACK_IMAGES.strawberry,
  banana: SNACK_IMAGES.banana,
  jamun: SNACK_IMAGES.jamun,
  pineapple: SNACK_IMAGES.pineapple,
  combo: SNACK_IMAGES.combo,
  powder: POWDER_IMAGES.abc,
  kiwi: SNACK_IMAGES.grapes,
  guava: SNACK_IMAGES.guava,
  custard: SNACK_IMAGES.chiku,
  grapes: SNACK_IMAGES.grapes,
  apple: SNACK_IMAGES.apple,
  coconut: SNACK_IMAGES.coconut,
  jackfruit: SNACK_IMAGES.jackfruit,
  sugarcane: SNACK_IMAGES.sugarcane,
};

export const HERO_SHOWCASE = [
  { src: SNACK_IMAGES.strawberry, label: 'Strawberry Chunks', category: 'Fruit Slices' },
  { src: SNACK_IMAGES.jamun, label: 'Jamun Chunks', category: 'Fruit Slices' },
  { src: SNACK_IMAGES.banana, label: 'Banana Chunks', category: 'Fruit Slices' },
  { src: SNACK_IMAGES.pineapple, label: 'Pineapple Chunks', category: 'Fruit Slices' },
  { src: POWDER_IMAGES.strawberry, label: 'Strawberry Powder', category: 'Fruit Powder' },
  { src: POWDER_IMAGES.jamun, label: 'Jamun Powder', category: 'Fruit Powder' },
];
