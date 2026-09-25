export {
  BRAND_NAME,
  BRAND_TAGLINE,
  BRAND_SHORT_TAGLINE,
  BRAND_EMAIL,
  BRAND_PHONE,
  COMPANY_NAME,
  BRAND_WEBSITE,
  BRAND_ADDRESS_FULL,
} from '../data/brand';

export function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function getDiscountPercent(product) {
  const price = Number(product?.price);
  const compare = Number(product?.compare_at_price);
  if (!price || !compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}

/** Compact promo badge — always `w-fit` so flex parents do not stretch it full width */
export const PRODUCT_BADGE_CHIP =
  'label-chip inline-flex w-fit max-w-full shrink-0 items-center px-2 py-0.5 text-[0.62rem] font-bold uppercase leading-none tracking-wide';

export function getBadgeClass(badge) {
  if (!badge) return '';
  const map = {
    SALE: 'bg-strawberry text-white',
    BESTSELLER: 'bg-primary text-white',
    NEW: 'bg-secondary text-white',
    'FAN FAV': 'bg-mango text-white',
    'GREAT VALUE': 'bg-secondary text-white',
    'RARE FIND': 'bg-mango text-white',
  };
  return map[badge] || 'bg-primary text-white';
}

export function renderStars(rating) {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5;
  return '★'.repeat(full) + (half ? '½' : '') + '☆'.repeat(5 - full - (half ? 1 : 0));
}

export const TRUST_BADGES = [
  'Vegan', 'Gluten Free', 'Non-Fried', 'Real Fruit',
  'No Added Sugar', 'Zero Preservatives', 'Made in India', 'High Fibre',
];

export const TRUST_BADGE_FEATURES = [
  { icon: 'vegan', accent: '#4a7c59', title: 'Vegan', desc: 'Pure plant-based freeze-dried fruit snacks' },
  { icon: 'glutenFree', accent: '#c4a882', title: 'Gluten Free', desc: 'Naturally gluten-free for everyday snacking' },
  { icon: 'nonFried', accent: '#3D6049', title: 'Non-Fried', desc: 'Freeze-dried only — never fried in oil' },
  { icon: 'realFruit', accent: '#e85d5d', title: 'Real Fruit', desc: 'Single ingredient whole fruit slices' },
  { icon: 'noSugar', accent: '#8b4b8c', title: 'No Added Sugar', desc: 'Sweetness comes from real fruit alone' },
  { icon: 'zeroPreservatives', accent: '#f5a623', title: 'Zero Preservatives', desc: 'No artificial preservatives or sulphites' },
  { icon: 'madeInIndia', accent: '#294633', title: 'Made in India', desc: 'Crafted in Miraj, Maharashtra' },
  { icon: 'highFibre', accent: '#5a8f6a', title: 'High Fibre', desc: 'Natural fibre preserved in every bite' },
];

export const MARQUEE_OFFERS = [
  'Special Offers',
  'Free Shipping on ₹999+',
  'Zero Preservatives',
  '100% Real Fruit',
  'Made in Miraj, Maharashtra',
];

export const HERO_STATS = [
  { value: '6+', label: 'Fruit Flavours' },
  { value: '0g', label: 'Added Sugar' },
  { value: '100%', label: 'Real Fruit' },
];

export const REASONS_TO_LOVE = [
  { icon: '🍎', title: 'Single Ingredient', desc: 'Whole fruit slices, nothing else' },
  { icon: '🔪', title: 'Whole Fruit Slices', desc: 'Not powder, not puree — real pieces' },
  { icon: '🌾', title: 'High Fibre', desc: 'Natural fibre preserved in every bite' },
  { icon: '✨', title: 'Crunchy & Tasty', desc: 'Light, crispy, intensely fruity' },
  { icon: '🚫', title: 'No Sulphites', desc: 'Zero artificial preservatives' },
  { icon: '🛢️', title: 'No Oil', desc: 'Non-fried, freeze-dried only' },
  { icon: '📦', title: 'Long Shelf Life', desc: 'No fridge needed, travel-ready' },
  { icon: '🇮🇳', title: 'Made in India', desc: 'Sourced from local orchards' },
];

export const SHOP_GOALS = [
  {
    slug: 'fruit-snacks',
    title: 'Daily Snacking',
    description: 'Light, crunchy fruit for everyday guilt-free munching',
    emoji: '🍓',
    bg: '#DDE7DC',
  },
  {
    slug: 'tropical-mix',
    title: 'Tropical Energy',
    description: 'Mango, pineapple & sun-kissed orchard flavours',
    emoji: '🥭',
    bg: '#F0E8DC',
  },
  {
    slug: 'berry-boost',
    title: 'Berry Boost',
    description: 'Antioxidant-rich berries for a healthy pick-me-up',
    emoji: '🫐',
    bg: '#EDE6E2',
  },
  {
    slug: 'combos',
    title: 'Variety Packs',
    description: 'Curated combos to try every flavour at great value',
    emoji: '🎁',
    bg: '#EEF2EA',
  },
];

export const POPULAR_CATEGORIES = [
  { slug: 'fruit-snacks', label: 'Fruit Snacks', emoji: '🍓' },
  { slug: 'combos', label: 'Combos', emoji: '🎁' },
  { slug: 'baking-essentials', label: 'Fruit Powders', emoji: '🫙' },
  { slug: 'berry-boost', label: 'Berries', emoji: '🫐' },
  { slug: 'tropical-mix', label: 'Tropical', emoji: '🥭' },
  { slug: 'kids-snacks', label: 'Kids Snacks', emoji: '🍌' },
];

export const PROCESS_STEPS = [
  { step: '01', title: 'Handpicked', desc: 'Real fruit. Nothing fake.' },
  { step: '02', title: 'Cleaned & Sliced', desc: 'Washed, peeled, cut fresh.' },
  { step: '03', title: 'Freeze-Dried', desc: 'Water removed. Flavour locked.' },
  { step: '04', title: 'Quality Checked', desc: 'Only the best makes it in.' },
  { step: '05', title: 'Packed Fresh', desc: 'Sealed and straight to you.' },
];

export const TRUST_FEATURES = [
  {
    icon: 'natural',
    title: '100% Natural',
    desc: 'Single ingredient, whole fruit slices — nothing added.',
    bg: '#EEF2EA',
    ring: '#3D604933',
  },
  {
    icon: 'premium',
    title: 'Premium Ingredients',
    desc: 'Handpicked fruit at peak ripeness from Indian orchards.',
    bg: '#EEF2EA',
    ring: '#3D604933',
  },
  {
    icon: 'sustainable',
    title: 'Sustainable Sourcing',
    desc: 'Ethically sourced for a better you and planet.',
    bg: '#EEF2EA',
    ring: '#3D604933',
  },
  {
    icon: 'expert',
    title: 'Expert Crafted',
    desc: 'Quality checked by food experts before every pack.',
    bg: '#EEF2EA',
    ring: '#3D604933',
  },
];

export const FEATURES = [
  { icon: '🌿', title: '100% Natural', desc: 'Single ingredient, whole fruit slices' },
  { icon: '🔬', title: 'Freeze-Dry Tech', desc: 'Nutrients locked at peak freshness' },
  { icon: '🌍', title: 'Sustainably Sourced', desc: 'From local Indian orchards' },
  { icon: '👨‍🍳', title: 'Expert Crafted', desc: 'Quality checked by food experts' },
];

export const WHY_CHOOSE = [
  { icon: '✓', title: 'Snack Better', desc: 'Replace junk with real fruit crunch — zero guilt' },
  { icon: '✓', title: 'Nutrient Locked', desc: 'Advanced freeze-dry preserves vitamins & flavour' },
  { icon: '✓', title: 'Travel Friendly', desc: 'Lightweight packs for gym, office & trips' },
  { icon: '✓', title: 'Kid Approved', desc: 'Loved by kids and adults alike' },
];

export const RECIPES = [
  { title: 'Smoothie Bowls', desc: 'Mango + banana combo for morning energy', emoji: '🥣' },
  { title: 'Baking & Desserts', desc: 'Fruit powders in cakes and halwa', emoji: '🎂' },
  { title: 'On-the-Go Snacking', desc: 'Gym, travel, lunchbox — crunch anywhere', emoji: '✈️' },
];

export const CATEGORY_TABS = [
  { slug: 'fruit-snacks', label: 'Fruit Snacks' },
  { slug: 'baking-essentials', label: 'Fruit Powders' },
  { slug: 'combos', label: 'Combos' },
  { slug: 'berry-boost', label: 'Berries' },
  { slug: 'tropical-mix', label: 'Tropical' },
];

export const FLAVOUR_SLUGS = [
  'freeze-dried-mango-cubes',
  'freeze-dried-banana-slices',
  'freeze-dried-strawberry-slices',
  'freeze-dried-jamun-cubes',
];
