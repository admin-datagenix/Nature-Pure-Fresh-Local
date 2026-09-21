/** Official product photography from catalog folders */

export const CATALOG_SNACKS = '/catalog/NaturePrue-Fresh-LLP-Snacks';
/** Numbered snack SVGs — served from public/products/snacks (same as dist/products/snacks) */
export const CATALOG_SNACK_SVGS = '/products/snacks';
export const CATALOG_POWDER = '/catalog/Naturepure-fresh-Powder';

/** Numbered SVG product art — 1 Apple … 12 Sugarcane */
export const SNACK_SVG_IMAGES = Object.fromEntries(
  Array.from({ length: 12 }, (_, i) => [`snack-${i + 1}`, `${CATALOG_SNACK_SVGS}/${i + 1}.svg`])
);

export const SNACK_IMAGES = {
  apple: `${CATALOG_SNACKS}/Apple.jpg`,
  banana: `${CATALOG_SNACKS}/Banana.jpg`,
  chiku: `${CATALOG_SNACKS}/Chiku.jpg`,
  coconut: `${CATALOG_SNACKS}/Coconut.jpg`,
  grapes: `${CATALOG_SNACKS}/Green-Grapes.jpg`,
  guava: `${CATALOG_SNACKS}/Guava.jpg`,
  combo: `${CATALOG_SNACKS}/Ice-cream-crunch.jpg`,
  jackfruit: `${CATALOG_SNACKS}/Jackfruit.jpg`,
  jamun: `${CATALOG_SNACKS}/Jamun.jpg`,
  pineapple: `${CATALOG_SNACKS}/Pineapple.jpg`,
  strawberry: `${CATALOG_SNACKS}/Strawberry.jpg`,
  sugarcane: `${CATALOG_SNACKS}/Sugarcane.jpg`,
};

export const POWDER_IMAGES = {
  abc: `${CATALOG_POWDER}/ABC-Powder.jpg`,
  apple: `${CATALOG_POWDER}/Apple-Powder.jpg`,
  banana: `${CATALOG_POWDER}/Banana-Powder.jpg`,
  beetroot: `${CATALOG_POWDER}/BeetRoot-Powder.jpg`,
  chiku: `${CATALOG_POWDER}/Chiku-Powder.jpg`,
  coconut: `${CATALOG_POWDER}/Coconut-Powder.jpg`,
  dragonfruit: `${CATALOG_POWDER}/DragonFruit-Powder.jpg`,
  drumstick: `${CATALOG_POWDER}/DrumStick-Powder.jpg`,
  grapes: `${CATALOG_POWDER}/Green-Grapes-Pwder.jpg`,
  guava: `${CATALOG_POWDER}/Guava-Powder.jpg`,
  jackfruit: `${CATALOG_POWDER}/Jackfruit-Powder.jpg`,
  jamun: `${CATALOG_POWDER}/Jamun-Powder.jpg`,
  pineapple: `${CATALOG_POWDER}/Pineapple-Powder.jpg`,
  pomegranate: `${CATALOG_POWDER}/Pmegranate-Powder.jpg`,
  strawberry: `${CATALOG_POWDER}/Strawberry-Powder.jpg`,
  sugarcane: `${CATALOG_POWDER}/Sugarcane-Powder.jpg`,
};

/** Map product fruit keys to catalog photography */
export const PRODUCT_IMAGES = {
  mango: SNACK_IMAGES.jackfruit,
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
  { src: SNACK_IMAGES.strawberry, label: 'Strawberry Snack', category: 'Fruit Snacks' },
  { src: SNACK_IMAGES.jamun, label: 'Jamun Cubes', category: 'Berry Boost' },
  { src: SNACK_IMAGES.banana, label: 'Banana Slices', category: 'Kids Snacks' },
  { src: SNACK_IMAGES.pineapple, label: 'Pineapple Slices', category: 'Tropical' },
  { src: POWDER_IMAGES.strawberry, label: 'Strawberry Powder', category: 'Fruit Powders' },
  { src: POWDER_IMAGES.jamun, label: 'Jamun Powder', category: 'Fruit Powders' },
];
