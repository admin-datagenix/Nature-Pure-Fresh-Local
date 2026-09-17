export const BRAND_NAME = 'Fresh Nature';
export const BRAND_TAGLINE = 'Real Fruit. Real Crunch. Nothing Added.';
export const BRAND_EMAIL = 'hello@freshnature.in';
export const BRAND_PHONE = '+91 98765 43210';

export function formatPrice(amount) {
  return `₹${Number(amount).toLocaleString('en-IN')}`;
}

export function getDiscountPercent(product) {
  const price = Number(product?.price);
  const compare = Number(product?.compare_at_price);
  if (!price || !compare || compare <= price) return 0;
  return Math.round(((compare - price) / compare) * 100);
}

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
    bg: '#D4E2D4',
  },
  {
    slug: 'tropical-mix',
    title: 'Tropical Energy',
    description: 'Mango, pineapple & sun-kissed orchard flavours',
    emoji: '🥭',
    bg: '#E8DFD0',
  },
  {
    slug: 'berry-boost',
    title: 'Berry Boost',
    description: 'Antioxidant-rich berries for a healthy pick-me-up',
    emoji: '🫐',
    bg: '#E8D5D0',
  },
  {
    slug: 'combos',
    title: 'Variety Packs',
    description: 'Curated combos to try every flavour at great value',
    emoji: '🎁',
    bg: '#E0E8E0',
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
  { icon: 'flask', title: '100% Natural', desc: 'Single ingredient, whole fruit slices — nothing added.' },
  { icon: 'drop', title: 'Premium Ingredients', desc: 'Handpicked fruit at peak ripeness from Indian orchards.' },
  { icon: 'leaf', title: 'Sustainable Sourcing', desc: 'Ethically sourced for a better you and planet.' },
  { icon: 'expert', title: 'Expert Crafted', desc: 'Quality checked by food experts before every pack.' },
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
