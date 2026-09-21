/**
 * Certifications — content & logos from https://naturepurefresh.com/ (Our Certifications)
 */

import madeInIndia from '../assets/certifications/made-in-india.png';
import pureNatural100 from '../assets/certifications/pure-natural-100.png';
import certFssai from '../assets/certifications/cert-fssai.jpg';
import certHalal from '../assets/certifications/halal.jpg';
import certExport from '../assets/certifications/cert-export.jpg';
import certQuality1 from '../assets/certifications/cert-quality-1.jpeg';
import certQuality2 from '../assets/certifications/cert-quality-2.jpeg';
import certQuality3 from '../assets/certifications/cert-quality-3.jpeg';

export const CERTIFICATIONS_INTRO =
  'We maintain strict quality control from farm to pack, with certifications and standards that support safe, export-ready agro products for customers in India and abroad.';

/** Logo strip — same assets as naturepurefresh.com certification row */
export const CERTIFICATION_LOGOS = [
  { id: 'made-in-india', alt: 'Made in India', src: madeInIndia },
  { id: 'pure-natural', alt: '100% Pure Natural Organic', src: pureNatural100 },
  { id: 'quality-1', alt: 'Quality certification', src: certQuality1 },
  { id: 'quality-2', alt: 'Quality certification', src: certQuality2 },
  { id: 'quality-3', alt: 'Quality certification', src: certQuality3 },
  { id: 'fssai', alt: 'FSSAI certification', src: certFssai },
  { id: 'halal', alt: 'Halal certification', src: certHalal },
  { id: 'export', alt: 'Export / global certification', src: certExport },
];

export const BRAND_CERTIFICATIONS = [
  {
    id: 'fssai',
    title: 'FSSAI Certified',
    description: 'Food safety compliance for manufacturing and sale of fruit snacks and powders in India.',
    image: certFssai,
  },
  {
    id: 'halal',
    title: 'Halal Certified',
    description: 'Halal-certified processing for customers who require certified halal products.',
    image: certHalal,
  },
  {
    id: 'made-in-india',
    title: 'Made in India',
    description: 'Proudly manufactured in Miraj, Maharashtra — supporting Indian agriculture and local farmers.',
    image: madeInIndia,
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
    id: 'quality',
    title: 'Strict Quality Control',
    description: 'Monitored selection, processing, and batch checks before products reach our customers.',
    image: certQuality1,
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
