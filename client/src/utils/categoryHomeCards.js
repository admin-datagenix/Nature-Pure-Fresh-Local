import {
  CHUNKS_CATEGORY_BANNER,
  CHUNKS_CATEGORY_BANNER_FALLBACK,
  CHUNKS_CATEGORY_BANNER_TRANSPARENT,
  POWDER_CATEGORY_BANNER,
  POWDER_CATEGORY_BANNER_FALLBACK,
  POWDER_CATEGORY_BANNER_TRANSPARENT,
} from '../data/brand.js';

/** One-line promos — unique copy per card */
const HOME_CATEGORY_SUBLINE = {
  'fruit-snacks': 'Crunchy slices · 100% fruit, zero sugar',
  'baking-essentials': 'Silky powder · smoothies, shakes & baking',
};

const HOME_CATEGORY_EYEBROW = {
  'fruit-snacks': 'Freeze-dried snacks',
  'baking-essentials': 'Fruit powders',
};

const HOME_CATEGORY_MEDIA = {
  'fruit-snacks': {
    image: CHUNKS_CATEGORY_BANNER_TRANSPARENT,
    imageOpaque: CHUNKS_CATEGORY_BANNER,
    imageFallback: CHUNKS_CATEGORY_BANNER_FALLBACK,
    imagePanelClass: 'bg-transparent',
    imageClass:
      'category-card-banner category-card-banner--chunks category-promo-card__img h-full w-full object-contain object-right-bottom p-0 sm:p-1',
    bannerVariant: 'chunks',
  },
  'baking-essentials': {
    image: POWDER_CATEGORY_BANNER_TRANSPARENT,
    imageOpaque: POWDER_CATEGORY_BANNER,
    imageFallback: POWDER_CATEGORY_BANNER_FALLBACK,
    imagePanelClass: 'bg-transparent',
    imageClass:
      'category-card-banner category-card-banner--powder category-promo-card__img h-full w-full object-contain object-[68%_72%] p-0 sm:p-1',
    bannerVariant: 'powder',
  },
};

/** Home “Shop by category” cards — category image (`imagePath`), not shop banner. */
export function buildCategoryHomeCards(categories) {
  if (!Array.isArray(categories) || categories.length === 0) return [];

  return categories.map((cat) => {
    const preset = HOME_CATEGORY_MEDIA[cat.slug];
    const image = preset?.image || cat.image || null;
    const imageOpaque = preset?.imageOpaque || null;
    const imageFallback = preset?.imageFallback || null;
    return {
      slug: cat.slug,
      label: cat.name,
      eyebrow: HOME_CATEGORY_EYEBROW[cat.slug] || '',
      subline:
        HOME_CATEGORY_SUBLINE[cat.slug] || cat.description?.trim() || '',
      image,
      imageOpaque,
      imageFallback,
      imagePanelClass: preset?.imagePanelClass || 'bg-cream/40',
      imageClass: preset?.imageClass || 'category-promo-card__img h-full w-full object-contain object-center p-2',
      bannerVariant: preset?.bannerVariant || cat.slug,
      hasImage: Boolean(image),
    };
  });
}
