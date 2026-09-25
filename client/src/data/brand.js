/** NaturePure Fresh LLP — official brand & contact details */

import brandLogoPng from '../assets/brand-logo.png';

export const COMPANY_NAME = 'NaturePure Fresh LLP';
export const BRAND_NAME = 'NaturePure Fresh';
export const BRAND_TAGLINE = 'Nourishing Life, Naturally!';
export const BRAND_SHORT_TAGLINE = 'Real Fruit. Real Crunch. Nothing Added.';

export const BRAND_EMAIL = 'naturepure.in@gmail.com';
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
  '116/3, 117 F-1, Shivaji Road Square Inn Apt, Near Hira Hotel, Miraj, Sangli, Maharashtra — 416410';

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

/** Bundled PNG logo — used in navbar, footer, auth, and pages */
export const BRAND_LOGO = brandLogoPng;
/** Public path for favicon / static HTML */
export const BRAND_LOGO_PUBLIC = '/brand/logo.png';

/** About page — same official lockup as public/brand/logo.png */
export const ABOUT_PAGE_LOGO = BRAND_LOGO_PUBLIC;

/** Homepage hero carousel — files in public/hero */
/** Time each banner is shown before sliding to the next */
export const HERO_BANNER_SLIDE_INTERVAL_MS = 3000;
/** Slide transition duration (ms) — keep below interval */
export const HERO_BANNER_TRANSITION_MS = 800;

export const HERO_BANNER_SLIDES = [
  {
    src: '/hero/Banner-img-1.svg',
    alt: `${BRAND_NAME} freeze-dried fruit powders and snacks`,
    blend: 'multiply',
  },
  {
    src: '/hero/Banner-img-2.svg',
    alt: `${BRAND_NAME} premium freeze-dried fruit range`,
    blend: 'multiply',
  },
  {
    src: '/hero/Banner-img-3.svg',
    alt: `${BRAND_NAME} natural fruit products — orchard to pack`,
    blend: 'multiply',
  },
  {
    src: '/hero/Banner-img-4.svg',
    alt: `${BRAND_NAME} natural fruit products — orchard to pack`,
    blend: 'multiply',
  },
];

/** @deprecated use HERO_BANNER_SLIDES */
export const HERO_BANNER_IMAGE = HERO_BANNER_SLIDES[0].src;
export const HERO_BANNER_FALLBACKS = ['/hero/Banner-img-1.svg'];

/** Homepage Shop By Category — card art (public/hero) */

export const CHUNKS_CATEGORY_BANNER = '/hero/chunks-category-banner.svg';
export const CHUNKS_CATEGORY_BANNER_FALLBACK = '/hero/chunks-category-banner.png';
export const POWDER_CATEGORY_BANNER = '/hero/powder-category-banner.jpg';
/** Keep JPG-only — SVG fallback showed transparent areas in category cards */
export const POWDER_CATEGORY_BANNER_FALLBACK = '/hero/powder-category-banner.jpg';

export const CATALOG_PDF = {
  snacks: '/catalog/naturepure-snacks.pdf',
  powder: '/catalog/naturepure-powder.pdf',
};

export { HERO_SHOWCASE as HERO_CATALOG_PRODUCTS } from './catalogImages.js';
