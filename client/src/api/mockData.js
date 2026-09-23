/** Static mock catalog — frontend-only, no backend required */

import { CHUNK_PRODUCTS } from '../data/chunkProducts.js';
import { POWDER_PRODUCTS } from '../data/powderProducts.js';

export const MOCK_CATEGORIES = [
  { id: '1', slug: 'fruit-snacks', name: 'Fruit Snacks', description: '100% real fruit, freeze-dried to perfection', color: '#2D3E2E', product_count: 12 },
  { id: '2', slug: 'tropical-mix', name: 'Tropical Mix', description: 'Exotic flavours from sun-kissed orchards', color: '#F5A623', product_count: 2 },
  { id: '3', slug: 'berry-boost', name: 'Berry Boost', description: 'Energy & antioxidants from nature\'s berries', color: '#E85D5D', product_count: 2 },
  { id: '4', slug: 'combos', name: 'Combos & Bundles', description: 'Curated variety packs at great value', color: '#8B4B8C', product_count: 2 },
  { id: '5', slug: 'baking-essentials', name: 'Fruit Powders', description: 'Fruit powders for smoothies & baking', color: '#C4A882', product_count: 16 },
  { id: '6', slug: 'kids-snacks', name: 'Kids\' Snacks', description: 'Lunchbox-ready, parent-approved crunch', color: '#6B8F71', product_count: 1 },
];

export const MOCK_REVIEWS = [
  { id: '1', product_id: 'snack-09', product_slug: 'freeze-dried-jamun-chunks', user_name: 'Kanti Patel', rating: 5, comment: 'I never knew that eating this healthy snack can make my sugar control so soon.', is_verified: true, product_name: 'Freeze Dried Jamun Chunks' },
  { id: '2', product_id: 'snack-08', product_slug: 'freeze-dried-jackfruit-chunks', user_name: 'Somalini Sahu', rating: 5, comment: 'Perfect match for my busy lifestyle. Travel-friendly packaging.', is_verified: true, product_name: 'Freeze Dried Jackfruit Chunks' },
  { id: '3', product_id: 'snack-10', product_slug: 'freeze-dried-pineapple-chunks', user_name: 'Balkrishna Patro', rating: 5, comment: 'Takes me back to summer days with every bite!', is_verified: true, product_name: 'Freeze Dried Pineapple Chunks' },
  { id: '4', product_id: 'snack-02', product_slug: 'freeze-dried-banana-chunks', user_name: 'C. Verified', rating: 5, comment: 'My kids love it and I love that they\'re eating something healthy.', is_verified: true, product_name: 'Freeze Dried Banana Chunks' },
  { id: '5', product_id: 'combo-01', product_slug: 'variety-pack-6-flavours', user_name: 'Kanhu', rating: 5, comment: 'Perfect energy boost before workouts.', is_verified: true, product_name: 'Variety Pack — 6 Flavours' },
  { id: '6', product_id: 'snack-11', product_slug: 'freeze-dried-strawberry-chunks', user_name: 'Anjali Chandnani', rating: 5, comment: 'Awesome strawberry chunks — can\'t stop eating them!', is_verified: true, product_name: 'Freeze Dried Strawberry Chunks' },
];

const COMBO_AND_POWDER_PRODUCTS = [
  {
    id: 'combo-01',
    slug: 'variety-pack-6-flavours',
    name: 'Variety Pack — 6 Flavours',
    short_description: 'Try all 6 before choosing your favourite — best value combo.',
    description: 'Six single-ingredient fruit snacks in one box. Mango, strawberry, banana, jamun, pineapple and more. Perfect gift or trial pack.',
    price: 599,
    compare_at_price: 900,
    weight_grams: 180,
    category_slug: 'combos',
    category_name: 'Combos & Bundles',
    badge: 'SALE',
    rating: 4.9,
    review_count: 312,
    tags: ['100% Natural', 'Best Value'],
    is_bestseller: true,
    stock: 300,
    is_active: true,
    image: '/products/snacks/7.svg',
  },
  {
    id: 'combo-02',
    slug: 'fruit-combo-8-pack',
    name: 'Fruit Combo Pack of 8',
    short_description: 'Eight flavours, one perfect gift box.',
    description: 'Our largest variety pack — eight freeze-dried fruit flavours for the whole family. Great for gifting.',
    price: 899,
    compare_at_price: 1100,
    weight_grams: 240,
    category_slug: 'combos',
    category_name: 'Combos & Bundles',
    badge: 'SALE',
    rating: 4.8,
    review_count: 156,
    tags: ['100% Natural'],
    is_bestseller: true,
    stock: 250,
    is_active: true,
    image: '/products/snacks/7.svg',
  },
];

export const MOCK_PRODUCTS = [...CHUNK_PRODUCTS, ...COMBO_AND_POWDER_PRODUCTS, ...POWDER_PRODUCTS];

export const PROMO_CODES = {
  FRESH10: { discount: 10, type: 'percent', minOrder: 299 },
  NATURE50: { discount: 50, type: 'flat', minOrder: 499 },
  WELCOME15: { discount: 15, type: 'percent', minOrder: 399 },
};

const CATEGORY_GROUPS = {
  'fruit-snacks': ['fruit-snacks'],
  'berry-boost': ['fruit-snacks'],
  'tropical-mix': ['fruit-snacks'],
  'kids-snacks': ['fruit-snacks'],
  'baking-essentials': ['baking-essentials'],
  combos: ['combos'],
};

const FORMAT_SLUGS = {
  chunks: ['fruit-snacks', 'berry-boost', 'tropical-mix', 'kids-snacks'],
  powder: ['baking-essentials'],
  combo: ['combos'],
};

export function filterProducts({
  category,
  search,
  sort,
  page = 1,
  limit = 12,
  minPrice,
  maxPrice,
  minRating,
  stock,
  format,
} = {}) {
  let list = MOCK_PRODUCTS.filter((p) => p.is_active);

  if (category) {
    const slugs = CATEGORY_GROUPS[category] || [category];
    list = list.filter((p) => slugs.includes(p.category_slug));
  }

  if (format) {
    const keys = String(format)
      .split(',')
      .map((s) => s.trim())
      .filter(Boolean);
    if (keys.length) {
      const allowed = new Set(keys.flatMap((k) => FORMAT_SLUGS[k] || []));
      list = list.filter((p) => allowed.has(p.category_slug));
    }
  }

  if (minPrice != null && minPrice !== '') {
    const min = Number(minPrice);
    if (!Number.isNaN(min)) list = list.filter((p) => p.price >= min);
  }
  if (maxPrice != null && maxPrice !== '') {
    const max = Number(maxPrice);
    if (!Number.isNaN(max)) list = list.filter((p) => p.price <= max);
  }

  if (minRating != null && minRating !== '' && Number(minRating) > 0) {
    const r = Number(minRating);
    list = list.filter((p) => (p.rating || 0) >= r);
  }

  if (stock === 'in') list = list.filter((p) => (p.stock ?? 0) > 0);
  if (stock === 'out') list = list.filter((p) => (p.stock ?? 0) <= 0);

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(
      (p) => p.name.toLowerCase().includes(q) || p.short_description.toLowerCase().includes(q)
    );
  }

  switch (sort) {
    case 'price_asc': list = [...list].sort((a, b) => a.price - b.price); break;
    case 'price_desc': list = [...list].sort((a, b) => b.price - a.price); break;
    case 'rating': list = [...list].sort((a, b) => b.rating - a.rating); break;
    case 'newest': break;
    default: list = [...list].sort((a, b) => (b.is_bestseller - a.is_bestseller) || b.review_count - a.review_count);
  }

  const total = list.length;
  const offset = (page - 1) * limit;
  return {
    products: list.slice(offset, offset + limit),
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit) || 1,
      hasMore: page * limit < total,
    },
  };
}

export function getBestsellers(limit = 8) {
  const chunks = MOCK_PRODUCTS.filter((p) => p.category_slug === 'fruit-snacks' && p.is_bestseller);
  if (chunks.length >= limit) return chunks.slice(0, limit);
  const rest = MOCK_PRODUCTS.filter((p) => p.is_bestseller && p.category_slug !== 'fruit-snacks');
  return [...chunks, ...rest].slice(0, limit);
}

export function getProductBySlug(slug) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  const reviews = MOCK_REVIEWS.filter((r) => r.product_slug === slug);
  return { ...product, reviews };
}

/** @deprecated use filterProducts — kept for existing imports */
export const FALLBACK_PRODUCTS = MOCK_PRODUCTS;
export function filterFallbackProducts(opts) {
  return filterProducts({ ...opts, page: 1 }).products;
}
