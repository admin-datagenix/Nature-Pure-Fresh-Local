/** Static mock catalog — frontend-only, no backend required */

export const MOCK_CATEGORIES = [
  { id: '1', slug: 'fruit-snacks', name: 'Fruit Snacks', description: '100% real fruit, freeze-dried to perfection', color: '#2D3E2E', product_count: 5 },
  { id: '2', slug: 'tropical-mix', name: 'Tropical Mix', description: 'Exotic flavours from sun-kissed orchards', color: '#F5A623', product_count: 2 },
  { id: '3', slug: 'berry-boost', name: 'Berry Boost', description: 'Energy & antioxidants from nature\'s berries', color: '#E85D5D', product_count: 2 },
  { id: '4', slug: 'combos', name: 'Combos & Bundles', description: 'Curated variety packs at great value', color: '#8B4B8C', product_count: 2 },
  { id: '5', slug: 'baking-essentials', name: 'Baking Essentials', description: 'Fruit powders for smoothies & baking', color: '#C4A882', product_count: 1 },
  { id: '6', slug: 'kids-snacks', name: 'Kids\' Snacks', description: 'Lunchbox-ready, parent-approved crunch', color: '#6B8F71', product_count: 1 },
];

export const MOCK_REVIEWS = [
  { id: '1', product_id: '4', product_slug: 'freeze-dried-jamun-cubes', user_name: 'Kanti Patel', rating: 5, comment: 'I never knew that eating this healthy snack can make my sugar control so soon.', is_verified: true, product_name: 'Freeze Dried Jamun Cubes' },
  { id: '2', product_id: '1', product_slug: 'freeze-dried-mango-cubes', user_name: 'Somalini Sahu', rating: 5, comment: 'Perfect match for my busy lifestyle. Travel-friendly packaging.', is_verified: true, product_name: 'Freeze Dried Mango Cubes' },
  { id: '3', product_id: '1', product_slug: 'freeze-dried-mango-cubes', user_name: 'Balkrishna Patro', rating: 5, comment: 'Takes me back to summer days with every bite!', is_verified: true, product_name: 'Freeze Dried Mango Cubes' },
  { id: '4', product_id: '3', product_slug: 'freeze-dried-banana-slices', user_name: 'C. Verified', rating: 5, comment: 'My kids love it and I love that they\'re eating something healthy.', is_verified: true, product_name: 'Freeze Dried Banana Slices' },
  { id: '5', product_id: '5', product_slug: 'variety-pack-6-flavours', user_name: 'Kanhu', rating: 5, comment: 'Perfect energy boost before workouts.', is_verified: true, product_name: 'Variety Pack — 6 Flavours' },
  { id: '6', product_id: '2', product_slug: 'freeze-dried-strawberry-slices', user_name: 'Anjali Chandnani', rating: 5, comment: 'Awesome strawberry slices — can\'t stop eating them!', is_verified: true, product_name: 'Freeze Dried Strawberry Slices' },
];

export const MOCK_PRODUCTS = [
  {
    id: '1',
    slug: 'freeze-dried-mango-cubes',
    name: 'Freeze Dried Mango Cubes',
    short_description: 'Alphonso mangoes at peak ripeness — sweet, sunny crunch in every bite.',
    description: 'Handpicked Alphonso mangoes, freeze-dried at peak ripeness. Single ingredient — 100% mango. No added sugar, no preservatives, no oil.',
    price: 150,
    compare_at_price: 180,
    weight_grams: 30,
    category_slug: 'fruit-snacks',
    category_name: 'Fruit Snacks',
    badge: 'BESTSELLER',
    rating: 4.8,
    review_count: 204,
    tags: ['100% Natural', 'No Added Sugar'],
    is_bestseller: true,
    stock: 500,
    is_active: true,
  },
  {
    id: '2',
    slug: 'freeze-dried-strawberry-slices',
    name: 'Freeze Dried Strawberry Slices',
    short_description: 'Sweet, tangy slices — no sugar added, all natural flavour.',
    description: 'Real strawberry slices freeze-dried to preserve colour, flavour and nutrients. Perfect for snacking, baking and smoothie bowls.',
    price: 199,
    compare_at_price: 229,
    weight_grams: 30,
    category_slug: 'fruit-snacks',
    category_name: 'Fruit Snacks',
    badge: 'FAN FAV',
    rating: 4.7,
    review_count: 178,
    tags: ['100% Natural', 'No Added Sugar'],
    is_bestseller: true,
    stock: 400,
    is_active: true,
  },
  {
    id: '3',
    slug: 'freeze-dried-banana-slices',
    name: 'Freeze Dried Banana Slices',
    short_description: 'Naturally sweet, light and crispy — kid-approved crunch.',
    description: 'Whole banana slices, freeze-dried for a light crispy texture. Great for lunchboxes, travel and guilt-free snacking.',
    price: 149,
    compare_at_price: 179,
    weight_grams: 30,
    category_slug: 'kids-snacks',
    category_name: 'Kids\' Snacks',
    badge: 'GREAT VALUE',
    rating: 4.7,
    review_count: 196,
    tags: ['100% Natural'],
    is_bestseller: true,
    stock: 600,
    is_active: true,
  },
  {
    id: '4',
    slug: 'freeze-dried-jamun-cubes',
    name: 'Freeze Dried Jamun Cubes',
    short_description: 'Deep, earthy Indian superfruit — rare and nutrient-rich.',
    description: 'Authentic jamun cubes with a deep earthy flavour. Freeze-dried to lock in natural goodness. Zero additives.',
    price: 120,
    compare_at_price: null,
    weight_grams: 30,
    category_slug: 'berry-boost',
    category_name: 'Berry Boost',
    badge: 'RARE FIND',
    rating: 4.8,
    review_count: 89,
    tags: ['100% Natural'],
    is_bestseller: false,
    stock: 200,
    is_active: true,
  },
  {
    id: '5',
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
  },
  {
    id: '6',
    slug: 'freeze-dried-pineapple-slices',
    name: 'Freeze Dried Pineapple Slices',
    short_description: 'Tropical crunch in every bite — sweet and tangy.',
    description: 'Sun-ripened pineapple slices with an intense tropical flavour. Non-fried, freeze-dried only.',
    price: 199,
    compare_at_price: 229,
    weight_grams: 30,
    category_slug: 'tropical-mix',
    category_name: 'Tropical Mix',
    badge: null,
    rating: 4.6,
    review_count: 142,
    tags: ['100% Natural', 'No Added Sugar'],
    is_bestseller: false,
    stock: 350,
    is_active: true,
  },
  {
    id: '7',
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
  },
  {
    id: '8',
    slug: 'freeze-dried-mango-powder',
    name: 'Freeze Dried Mango Powder',
    short_description: '100% natural mango powder for smoothies & baking.',
    description: 'Finely milled freeze-dried Alphonso mango. Add to smoothies, lassi, cakes and desserts.',
    price: 300,
    compare_at_price: null,
    weight_grams: 50,
    category_slug: 'baking-essentials',
    category_name: 'Baking Essentials',
    badge: null,
    rating: 4.5,
    review_count: 67,
    tags: ['100% Natural'],
    is_bestseller: false,
    stock: 180,
    is_active: true,
  },
];

const CATEGORY_GROUPS = {
  'fruit-snacks': ['fruit-snacks', 'tropical-mix', 'berry-boost', 'kids-snacks'],
  'berry-boost': ['berry-boost', 'fruit-snacks'],
  'tropical-mix': ['tropical-mix', 'fruit-snacks'],
  'kids-snacks': ['kids-snacks', 'fruit-snacks'],
  'baking-essentials': ['baking-essentials'],
  combos: ['combos'],
};

export function filterProducts({ category, search, sort, page = 1, limit = 12 } = {}) {
  let list = MOCK_PRODUCTS.filter((p) => p.is_active);

  if (category) {
    const slugs = CATEGORY_GROUPS[category] || [category];
    list = list.filter((p) => slugs.includes(p.category_slug));
  }

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
  return MOCK_PRODUCTS.filter((p) => p.is_bestseller).slice(0, limit);
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
