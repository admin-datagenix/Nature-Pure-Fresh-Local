/** Freeze drying process page — short copy & clear imagery */

import { BRAND_NAME } from './brand';

export const PROCESS_BANNER = '/process/process-hero-lyophilizer.png';

export const PROCESS_HERO = {
  title: 'Freeze Drying Process',
  subtitle: "Preserving Nature's Goodness",
  description:
    `At ${BRAND_NAME}, we use advanced freeze drying (lyophilization) technology to preserve the natural taste, colour, aroma and nutritional value of fruits. This gentle drying process removes moisture at low temperatures, keeping the fruit’s natural qualities intact for a longer shelf life.`,
  image: PROCESS_BANNER,
  imageCaption: 'Industrial Freeze Dryer (Lyophilizer)',
};

export const PROCESS_PILLARS = [
  { id: 'natural', label: '100% Natural Fruits', icon: 'leaf' },
  { id: 'preservative', label: 'No Added Preservatives', icon: 'heart' },
  { id: 'artificial', label: 'No Artificial Colours or Flavours', icon: 'beaker' },
  { id: 'nutrients', label: 'Retains Nutrients, Taste & Aroma', icon: 'shield' },
];

export const PROCESS_STEPS = [
  {
    step: 1,
    title: 'Fresh Selection',
    description:
      'Only the best quality fruits are selected, washed and prepared for processing.',
    image: '/process/step-1-fresh.jpg',
  },
  {
    step: 2,
    title: 'Pre-Freezing',
    description:
      'The fruit is quickly frozen at very low temperatures (around -40°C to -50°C).',
    image: '/process/step-2-freeze.jpg',
  },
  {
    step: 3,
    title: 'Primary Drying (Sublimation)',
    description:
      'Under vacuum, ice turns directly from solid to vapour, removing most of the moisture.',
    image: '/process/step-3-primary.jpg',
  },
  {
    step: 4,
    title: 'Secondary Drying',
    description:
      'Remaining moisture is removed at a slightly higher temperature to reach the target level.',
    image: '/process/step-4-secondary.jpg',
  },
  {
    step: 5,
    title: 'Final Product',
    description:
      'Crisp, lightweight and nutrient-rich freeze-dried fruit, ready for packaging.',
    image: '/process/step-5-final.jpg',
  },
];

export const PROCESS_SPECS = [
  {
    id: 'temp',
    title: 'Freeze Drying Temperature',
    lines: ['-40°C to -50°C (Freezing)', 'Vacuum Drying (Sublimation)'],
    icon: 'snow',
  },
  {
    id: 'capacity',
    title: 'Machine Capacity',
    lines: ['5 MT – 20 MT per batch', '(Based on product & model)'],
    icon: 'gear',
  },
  {
    id: 'raw',
    title: 'Raw Material',
    lines: ['100% Natural Fruits', '(No Additives)'],
    icon: 'leaf',
  },
  {
    id: 'quality',
    title: 'Quality Standards',
    lines: ['FSSAI | APEDA | HACCP', 'GMP (in process)'],
    icon: 'shield',
  },
];

export const PROCESS_FOOTER_TAGLINE =
  'NATURE PURE – FROZEN IN TIME, FRESH FOR TOMORROW';
