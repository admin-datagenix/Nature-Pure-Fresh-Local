/** NaturePure Fresh LLP — official brand & contact details */

import {
  MARKETING_CHUNKS_SHOP_BANNER,
  MARKETING_POWDER_SHOP_BANNER,
} from './marketingImages.js';

export const COMPANY_NAME = 'NaturePure Fresh LLP';
export const BRAND_NAME = 'NaturePure Fresh';
export const BRAND_TAGLINE = 'Nourishing Life, Naturally!';
export const BRAND_SHORT_TAGLINE = 'Real Fruit. Real Crunch. Nothing Added.';

export const BRAND_EMAIL = 'info@naturepurefresh.com';
export const BRAND_PHONE = '+91 77679 70227';
export const BRAND_PHONE_RAW = '7767970227';
export const BRAND_WEBSITE = 'www.naturepurefresh.com';
export const BRAND_WEBSITE_URL = 'https://www.naturepurefresh.com';

export const BRAND_ADDRESS = {
  line1: '116/3, 117 F-1, Shivaji Road Square Inn Apt',
  line2: 'Near Hira Hotel, Miraj',
  city: 'Sangli',
  state: 'Maharashtra',
  pincode: '416410',
};

export const BRAND_ADDRESS_FULL =
  '116/3, 117 F-1, Shivaji Road Square Inn Apt, Near Hira Hotel, Miraj, Sangli, Maharashtra, India — 416410';

/**
 * Map pin — Shivaji Road, near Hira Hotel, Miraj (416410).
 * Coordinates center the embed on Hira Hotel chowk; open/search links use the full street address.
 */
export const BRAND_MAP_QUERY = BRAND_ADDRESS_FULL;
export const BRAND_MAP_CENTER = { lat: 16.822196, lng: 74.643568 };
export const BRAND_MAP_EMBED_URL =
  `https://maps.google.com/maps?q=${encodeURIComponent(BRAND_MAP_QUERY)}` +
  `&ll=${BRAND_MAP_CENTER.lat},${BRAND_MAP_CENTER.lng}&z=17&hl=en&ie=UTF8&output=embed`;
export const BRAND_MAP_OPEN_URL =
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(BRAND_MAP_QUERY)}`;

/** Primary brand mark — public/brand/logo-3.png (do not overwrite via image sync) */
export const BRAND_LOGO_PUBLIC = '/brand/logo-3.png';
/** Intrinsic pixel size of logo-3.png (wide lockup) */
export const BRAND_LOGO_PIXELS = { width: 4000, height: 1028 };
/** Default logo (navbar, footer, auth, inline lockups) */
export const BRAND_LOGO = BRAND_LOGO_PUBLIC;
export const BRAND_LOGO_NAVBAR = BRAND_LOGO_PUBLIC;
/** Footer lockup — synced from website data/logo/footer-logo.png → public/logo/footer-logo.png */
export const BRAND_LOGO_FOOTER = '/logo/footer-logo.png';
export const BRAND_LOGO_FOOTER_PIXELS = { width: 5704, height: 2044 };

/** About page lockup */
export const ABOUT_PAGE_LOGO = BRAND_LOGO_PUBLIC;

export const ABOUT_STORY_IMAGE = '/about/about-img.png';

/** About page header — same ratio as shop banners (1920×700) */
export const ABOUT_PAGE_BANNER = '/about/about-us-img.png';

export const ABOUT_QUALITY_IMAGE = '/about/quality.svg';

/** Shop category heading banners (1920×700 art) */
export const ALL_PRODUCTS_SHOP_BANNER = '/hero/all-products.svg';

/** Shop page inset headers (wide art) */
export const CHUNKS_SHOP_BANNER = '/products/snacks/chunks-banner.svg';
export const CHUNKS_SHOP_BANNER_FALLBACK = '/products/snacks/chunks-banner-1.svg';

/** Marketing posters from public/design/ (SVG kept as fallback on banner error). */
export const POWDER_SHOP_BANNER = MARKETING_POWDER_SHOP_BANNER;
export const CHUNKS_SHOP_BANNER_MARKETING = MARKETING_CHUNKS_SHOP_BANNER;
export const POWDER_SHOP_BANNER_FALLBACK = '/products/powder/powder-banner.svg';

export const SHOP_CATEGORY_BANNERS = {
  'fruit-snacks': MARKETING_CHUNKS_SHOP_BANNER,
  'baking-essentials': MARKETING_POWDER_SHOP_BANNER,
};

export const SHOP_CATEGORY_BANNER_FALLBACKS = {
  'fruit-snacks': CHUNKS_SHOP_BANNER_FALLBACK,
  'baking-essentials': POWDER_SHOP_BANNER_FALLBACK,
};

/** Homepage “Shop by category” cards — prefer transparent PNG on card gradient */
export const CHUNKS_CATEGORY_BANNER = '/products/banners/chunks.png';
export const CHUNKS_CATEGORY_BANNER_TRANSPARENT = '/products/banners/chunks-transparent.png';
export const CHUNKS_CATEGORY_BANNER_FALLBACK = '/products/banners/chunks-1.png';
export const POWDER_CATEGORY_BANNER = '/products/banners/powder.png';
export const POWDER_CATEGORY_BANNER_TRANSPARENT = '/products/banners/powder-transparent.png';
export const POWDER_CATEGORY_BANNER_FALLBACK = '/products/banners/powder-2.png';

/** Homepage hero carousel — files in public/hero */
/** Time each banner is shown before sliding to the next */
export const HERO_BANNER_SLIDE_INTERVAL_MS = 3000;
/** Slide transition duration (ms) — keep below interval */
export const HERO_BANNER_TRANSITION_MS = 800;

const HERO_BANNER_ALTS = [
  `${BRAND_NAME} freeze-dried fruit powders and snacks`,
  `${BRAND_NAME} premium freeze-dried fruit range`,
  `${BRAND_NAME} natural fruit products — orchard to pack`,
  `${BRAND_NAME} freeze-dried fruit chunks and variety packs`,
  `${BRAND_NAME} wholesome fruit snacks made in India`,
];

/** Sequence: public/hero/Banner-img-1.svg … Banner-img-5.svg (unchanged) */
export const HERO_BANNER_SLIDES = [1, 2, 3, 4, 5].map((n, i) => ({
  src: `/hero/Banner-img-${n}.svg`,
  alt: HERO_BANNER_ALTS[i] || `${BRAND_NAME} homepage banner`,
  objectPosition: 'center bottom',
}));

export const HERO_BANNER_IMAGE = HERO_BANNER_SLIDES[0].src;
export const HERO_BANNER_FALLBACKS = ['/hero/Banner-img-1.svg'];

export const CATALOG_PDF = {
  snacks: '/catalog/naturepure-snacks.pdf',
  powder: '/catalog/naturepure-powder.pdf',
};

export { HERO_SHOWCASE as HERO_CATALOG_PRODUCTS } from './catalogImages.js';
