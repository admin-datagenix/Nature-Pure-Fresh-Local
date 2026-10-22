import {
  CHUNKS_CATEGORY_BANNER,
  CHUNKS_CATEGORY_BANNER_FALLBACK,
  POWDER_CATEGORY_BANNER,
  POWDER_CATEGORY_BANNER_FALLBACK,
} from '../data/brand.js';

const HOME_CATEGORY_MEDIA = {
  'fruit-snacks': {
    image: CHUNKS_CATEGORY_BANNER,
    imageFallback: CHUNKS_CATEGORY_BANNER_FALLBACK,
  },
  'baking-essentials': {
    image: POWDER_CATEGORY_BANNER,
    imageFallback: POWDER_CATEGORY_BANNER_FALLBACK,
  },
};

/** Home “Shop by category” cards — category image (`imagePath`), not shop banner. */
export function buildCategoryHomeCards(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return [];

  return categories.map((cat) => {
    const preset = HOME_CATEGORY_MEDIA[cat.slug];
    const image = cat.image || preset?.image || null;
    const imageFallback = preset?.imageFallback || null;
    return {
      slug: cat.slug,
      label: cat.name,
      subline: cat.description?.trim() || '',
      image,
      imageFallback,
      hasImage: Boolean(image),
    };
  });
}
