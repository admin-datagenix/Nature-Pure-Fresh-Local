import {
  BRAND_NAME,
  COMPANY_NAME,
  BRAND_TAGLINE,
  CHUNKS_CATEGORY_BANNER,
  CHUNKS_CATEGORY_BANNER_FALLBACK,
  HERO_BANNER_SLIDE_INTERVAL_MS,
  HERO_BANNER_SLIDES,
  HERO_BANNER_TRANSITION_MS,
  POWDER_CATEGORY_BANNER,
  POWDER_CATEGORY_BANNER_FALLBACK,
} from '../../../data/brand.js';
import {
  WHY_CHOOSE_BENEFITS,
  WHY_CHOOSE_LIFESTYLE,
  WHY_CHOOSE_SUBTITLE,
} from '../../../data/whyChooseBenefits.js';

const taglineParts = BRAND_TAGLINE.split(',');
const taglinePrimary = taglineParts[0]?.trim() || BRAND_TAGLINE;
const taglineAccent = taglineParts[1]?.trim() || 'Naturally!';

/** Shape returned by GET /api/v1/cms/pages/home */
export function buildHomePage() {
  return {
    hero: {
      eyebrow: 'Premium Freeze-Dried',
      companyName: COMPANY_NAME,
      titlePrimary: taglinePrimary,
      titleAccent: taglineAccent,
      description: `Premium freeze-dried fruit snacks & powders from ${BRAND_NAME}. 100% real fruit, zero added sugar, no preservatives — crafted in Miraj, Maharashtra.`,
      primaryCta: { to: '/shop', label: 'Shop Collection' },
      secondaryCta: { to: '/contact', label: 'Contact Us' },
      banner: {
        slides: HERO_BANNER_SLIDES,
        slideIntervalMs: HERO_BANNER_SLIDE_INTERVAL_MS,
        transitionMs: HERO_BANNER_TRANSITION_MS,
      },
    },
    categorySection: {
      title: 'Shop By Category',
      viewAllLink: { to: '/shop', label: 'View all' },
      cards: [
        {
          slug: 'fruit-snacks',
          label: 'Chunks/Slices',
          eyebrow: 'Freeze-dried snacks',
          subline: 'Crunchy fruit slices & cubes · real fruit · no added sugar',
          image: CHUNKS_CATEGORY_BANNER,
          imageFallback: CHUNKS_CATEGORY_BANNER_FALLBACK,
          imageWidth: 'w-[50%] sm:w-[48%] md:w-[46%]',
          imagePanelClass: 'bg-white',
          imageClass:
            'category-card-banner category-card-banner--chunks absolute inset-0 h-full w-full bg-white object-contain object-right-bottom p-2 transition duration-500 group-hover:scale-[1.03]',
        },
        {
          slug: 'baking-essentials',
          label: 'Powder',
          eyebrow: 'Fruit powders',
          subline: '100% fruit for smoothies, baking & everyday nutrition · 16 flavours',
          image: POWDER_CATEGORY_BANNER,
          imageFallback: POWDER_CATEGORY_BANNER_FALLBACK,
          imageWidth: 'w-[50%] sm:w-[48%] md:w-[46%]',
          imagePanelClass: 'bg-white',
          imageClass:
            'category-card-banner category-card-banner--powder absolute inset-0 h-full w-full bg-white object-contain object-[68%_72%] p-2 transition duration-500 group-hover:scale-[1.02]',
        },
      ],
    },
    productSections: [
      {
        id: 'bestsellers',
        title: 'Best Seller',
        subtitle:
          'Our most-loved freeze-dried fruit chunks — name, price and details for every flavour',
        limit: 8,
        shopLink: '/shop/fruit-snacks',
        shopLinkLabel: 'View all',
        source: 'bestsellers',
      },
    ],
    whyChooseUs: {
      eyebrow: 'Benefits you can trust',
      title: `Why Choose ${BRAND_NAME}`,
      subtitle: WHY_CHOOSE_SUBTITLE,
      benefits: WHY_CHOOSE_BENEFITS,
      lifestyle: WHY_CHOOSE_LIFESTYLE,
    },
  };
}
