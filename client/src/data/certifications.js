/**
 * Certifications — content & logos from https://naturepurefresh.com/ (Our Certifications)
 */

import apedaLogo from '../assets/certifications/apeda.png';
import makeInIndiaLion from '../assets/certifications/make-in-india-lion.png';
import pureNatural100 from '../assets/certifications/pure-natural-100.png';
import certMsme from '../assets/certifications/msme.png';
import startupIndiaLogo from '../assets/certifications/startup-india.png';
import certExport from '../assets/certifications/cert-export.jpg';
import certFssaiLogo from '../assets/certifications/cert-quality-1.jpeg';
import certQuality2 from '../assets/certifications/cert-quality-2.jpeg';

export const CERTIFICATIONS_INTRO =
  'We maintain strict quality control from farm to pack, with certifications and standards that support safe, export-ready agro products for customers in India and abroad.';

/** Logo strip — same assets as naturepurefresh.com certification row */
export const CERTIFICATION_LOGOS = [
  { id: 'apeda', alt: 'APEDA — Agricultural and Processed Food Products Export Development Authority', src: apedaLogo },
  { id: 'make-in-india', alt: 'Make in India', src: makeInIndiaLion },
  { id: 'pure-natural', alt: '100% Pure Natural Organic', src: pureNatural100 },
  { id: 'startup-india', alt: 'Startup India — DPIIT', src: startupIndiaLogo },
  { id: 'quality-2', alt: 'Import Export Code (IEC)', src: certQuality2 },
  { id: 'fssai', alt: 'FSSAI licence', src: certFssaiLogo },
  { id: 'msme', alt: 'Ministry of Micro, Small and Medium Enterprises (MSME), Government of India', src: certMsme },
  { id: 'export', alt: 'Export / global certification', src: certExport },
];

export const BRAND_CERTIFICATIONS = [
  {
    id: 'fssai',
    title: 'FSSAI Certified',
    description: 'Food safety compliance for manufacturing and sale of fruit snacks and powders in India.',
    image: certFssaiLogo,
  },
  {
    id: 'msme',
    title: 'MSME / Udyam Registered',
    description:
      'Registered with the Ministry of MSME under Udyam for micro, small and medium enterprise recognition in India.',
    image: certMsme,
  },
  {
    id: 'apeda',
    title: 'APEDA Registered',
    description:
      'Registered with APEDA for export promotion of agricultural and processed food products from India.',
    image: apedaLogo,
  },
  {
    id: 'make-in-india',
    title: 'Make in India',
    description: 'Proudly manufactured in India under the national Make in India initiative.',
    image: makeInIndiaLion,
  },
  {
    id: 'natural',
    title: '100% Natural Processing',
    description: 'Chemical-free processing that helps retain natural nutrients, colour, and flavour.',
    image: pureNatural100,
  },
  {
    id: 'export',
    title: 'Export-Grade Standards',
    description: 'Packaging and handling suited to domestic shelves and international supply requirements.',
    image: certExport,
  },
  {
    id: 'startup-india',
    title: 'Startup India',
    description: 'Recognized under the Startup India initiative for innovation and domestic manufacturing.',
    image: startupIndiaLogo,
  },
];

export const CERTIFICATION_STANDARDS = [
  '100% Natural & chemical-free processing',
  'Strict quality control standards',
  'Export-grade packaging',
  'Global certifications',
  'Reliable supply chain',
  'Competitive pricing for bulk & retail',
];
