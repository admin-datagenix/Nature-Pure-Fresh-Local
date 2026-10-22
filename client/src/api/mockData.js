/** Static mock catalog — chunk + powder storefront products */

import { CHUNK_PRODUCTS, CHUNK_STOREFRONT_SLUGS } from '../data/chunkProducts.js';
import { POWDER_PRODUCTS, POWDER_STOREFRONT_SLUGS } from '../data/powderProducts.js';
import { STOREFRONT_CATEGORIES } from '../data/storefrontCategories.js';

export const MOCK_CATEGORIES = STOREFRONT_CATEGORIES;

export const MOCK_PRODUCTS = [...CHUNK_PRODUCTS, ...POWDER_PRODUCTS];

export const MOCK_REVIEWS = [
  { id: '1', product_id: 'snack-09', product_slug: 'freeze-dried-jamun-chunks', user_name: 'Kanti Patel', rating: 5, comment: 'I never knew that eating this healthy snack can make my sugar control so soon.', is_verified: true, product_name: 'Freeze Dried Jamun Cubes' },
  { id: '2', product_id: 'snack-08', product_slug: 'freeze-dried-jackfruit-chunks', user_name: 'Somalini Sahu', rating: 5, comment: 'Perfect match for my busy lifestyle. Travel-friendly packaging.', is_verified: true, product_name: 'Freeze Dried Jackfruit Slices' },
  { id: '3', product_id: 'snack-10', product_slug: 'freeze-dried-pineapple-chunks', user_name: 'Balkrishna Patro', rating: 5, comment: 'Takes me back to summer days with every bite!', is_verified: true, product_name: 'Freeze Dried Pineapple Slices' },
  { id: '4', product_id: 'snack-13', product_slug: 'freeze-dried-mango-chunks', user_name: 'Priya M.', rating: 5, comment: 'The mango cubes are incredible — real fruit taste.', is_verified: true, product_name: 'Freeze Dried Mango Cubes' },
  { id: '6', product_id: 'snack-11', product_slug: 'freeze-dried-strawberry-chunks', user_name: 'Anjali Chandnani', rating: 5, comment: 'Awesome strawberries — can\'t stop eating them!', is_verified: true, product_name: 'Freeze Dried Strawberry Whole' },
];

export const PROMO_CODES = {
  FRESH10: { discount: 10, type: 'percent', minOrder: 299 },
  NATURE50: { discount: 50, type: 'flat', minOrder: 499 },
  WELCOME15: { discount: 15, type: 'percent', minOrder: 399 },
};

const CATEGORY_GROUPS = {
  'fruit-snacks': ['fruit-snacks'],
  'baking-essentials': ['baking-essentials'],
  all: ['fruit-snacks', 'baking-essentials'],
  chunks: ['fruit-snacks'],
  powder: ['baking-essentials'],
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
    const key = String(format).trim();
    if (key) {
      const slugs = CATEGORY_GROUPS[key] || [key];
      const allowed = new Set(slugs);
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

  const chunkOrder = new Map(CHUNK_STOREFRONT_SLUGS.map((slug, i) => [slug, i]));
  const powderOrder = new Map(POWDER_STOREFRONT_SLUGS.map((slug, i) => [slug, i]));
  const sortIndex = (p) => {
    if (chunkOrder.has(p.slug)) return chunkOrder.get(p.slug);
    if (powderOrder.has(p.slug)) return 100 + powderOrder.get(p.slug);
    return 999;
  };
  list = [...list].sort((a, b) => {
    const ao = sortIndex(a);
    const bo = sortIndex(b);
    if (ao !== bo) return ao - bo;
    switch (sort) {
      case 'price_asc':
        return a.price - b.price;
      case 'price_desc':
        return b.price - a.price;
      case 'rating':
        return b.rating - a.rating;
      default:
        return (b.is_bestseller - a.is_bestseller) || b.review_count - a.review_count;
    }
  });

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
  const bySlug = new Map(MOCK_PRODUCTS.map((p) => [p.slug, p]));
  return CHUNK_STOREFRONT_SLUGS.map((slug) => bySlug.get(slug)).filter(Boolean).slice(0, limit);
}

export function getProductBySlug(slug) {
  const product = MOCK_PRODUCTS.find((p) => p.slug === slug);
  if (!product) return null;
  const reviews = MOCK_REVIEWS.filter((r) => r.product_slug === slug);
  return { ...product, reviews };
}

export const FALLBACK_PRODUCTS = MOCK_PRODUCTS;
export function filterFallbackProducts(opts) {
  return filterProducts({ ...opts, page: 1 }).products;
}
