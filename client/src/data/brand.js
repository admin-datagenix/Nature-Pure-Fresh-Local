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

/**
 * Homepage hero banner (public/hero).
 * For true transparency, prefer PNG with alpha, e.g. banner-products.png or Banner-img-2.png.
 */
export const HERO_BANNER_IMAGE = '/hero/Banner-img-1.svg';
export const HERO_BANNER_FALLBACKS = ['/hero/Banner-img-2.svg', '/hero/banner-products.png', '/hero/banner-products.jpg'];

export const CATALOG_PDF = {
  snacks: '/catalog/naturepure-snacks.pdf',
  powder: '/catalog/naturepure-powder.pdf',
};

export { HERO_SHOWCASE as HERO_CATALOG_PRODUCTS } from './catalogImages.js';
