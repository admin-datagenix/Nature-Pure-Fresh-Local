import {
  BRAND_ADDRESS,
  BRAND_ADDRESS_FULL,
  BRAND_EMAIL,
  BRAND_LOGO_FOOTER,
  BRAND_LOGO_NAVBAR,
  BRAND_MAP_EMBED_URL,
  BRAND_MAP_OPEN_URL,
  BRAND_NAME,
  BRAND_PHONE,
  BRAND_PHONE_RAW,
  BRAND_SHORT_TAGLINE,
  BRAND_TAGLINE,
  BRAND_WEBSITE,
  BRAND_WEBSITE_URL,
  CATALOG_PDF,
  COMPANY_NAME,
} from '../../../data/brand.js';

/** Shape returned by GET /api/v1/cms/site-config */
export function buildSiteConfig() {
  return {
    brand: {
      name: BRAND_NAME,
      companyName: COMPANY_NAME,
      tagline: BRAND_TAGLINE,
      shortTagline: BRAND_SHORT_TAGLINE,
    },
    contact: {
      email: BRAND_EMAIL,
      phone: BRAND_PHONE,
      phoneRaw: BRAND_PHONE_RAW,
      website: BRAND_WEBSITE,
      websiteUrl: BRAND_WEBSITE_URL,
      address: BRAND_ADDRESS,
      addressFull: BRAND_ADDRESS_FULL,
      hours: 'Mon–Sat, 10 AM – 6 PM IST',
    },
    assets: {
      logoNavbar: BRAND_LOGO_NAVBAR,
      logoFooter: BRAND_LOGO_FOOTER,
    },
    catalogPdfs: CATALOG_PDF,
    map: {
      embedUrl: BRAND_MAP_EMBED_URL,
      openUrl: BRAND_MAP_OPEN_URL,
    },
    navigation: {
      headerAfterShop: [
        { to: '/about', label: 'About Us' },
        { to: '/process', label: 'Process' },
        { to: '/contact', label: 'Contact Us' },
      ],
      footer: {
        Shop: [
          { to: '/', label: 'Home' },
          { to: '/about', label: 'About Us' },
          { to: '/process', label: 'Our Process' },
          { to: '/shop', label: 'Shop' },
        ],
        Support: [
          { to: '/contact', label: 'Contact' },
          { to: '/', label: 'Return Policy' },
          { to: '/', label: 'Refund Policy' },
          { to: '/', label: 'Shipping Policy' },
        ],
      },
    },
  };
}
