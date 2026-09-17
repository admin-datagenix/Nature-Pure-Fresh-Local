import { useEffect, useState } from 'react';
import { Link, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard, { ProductCardSkeleton } from '../components/shop/ProductCard';
import { PRODUCT_GRID_CLASS } from '../utils/productLayout';
import { filterFallbackProducts } from '../data/fallbackProducts';
import { cn } from '../lib/cn';

const SORT_OPTIONS = [
  { value: 'bestseller', label: 'Best Selling' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

export default function ShopPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'bestseller';
  const search = searchParams.get('q') || '';

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api.getProducts({ page, limit: 12, category, sort, search: search || undefined })
      .then((res) => {
        const list = res.data || res.products || [];
        setProducts(list.length ? list : filterFallbackProducts({ category, limit: 12 }));
        setPagination(res.pagination);
      })
      .catch(() => {
        setProducts(filterFallbackProducts({ category, limit: 12 }));
        setPagination(null);
      })
      .finally(() => setLoading(false));
  }, [category, page, sort, search]);

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const linkClass = (active) => cn(
    'flex w-full items-center justify-between rounded-lg px-3.5 py-2.5 text-sm transition',
    active ? 'bg-primary/10 font-medium text-primary' : 'text-[#3a3a3a] hover:bg-primary/5 hover:text-primary'
  );

  return (
    <div className="pb-16">
      <div className="mb-10 bg-primary py-12 text-center text-white">
        <div className="mx-auto max-w-6xl px-4">
          <h1 className="font-heading text-3xl font-semibold">
            {category ? categories.find((c) => c.slug === category)?.name || 'Shop' : 'All Products'}
          </h1>
          <p className="mt-2 opacity-80">Premium freeze-dried fruits — 100% natural, no added sugar</p>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-10 px-4 md:grid-cols-[220px_1fr] md:px-6">
        <aside className="hidden md:block">
          <h3 className="mb-4 font-heading text-base text-primary">Categories</h3>
          <ul className="flex flex-col gap-1">
            <li><Link to="/shop" className={linkClass(!category)}>All Products</Link></li>
            {categories.map((c) => (
              <li key={c.slug}>
                <Link to={`/shop/${c.slug}`} className={linkClass(category === c.slug)}>
                  {c.name}
                  <span className="text-xs text-[#9a9a9a]">{c.product_count}</span>
                </Link>
              </li>
            ))}
          </ul>
        </aside>

        <div>
          <div className="mb-6 flex gap-3">
            <input
              type="search"
              placeholder="Search products..."
              defaultValue={search}
              onChange={(e) => {
                clearTimeout(window._searchTimer);
                window._searchTimer = setTimeout(() => updateParam('q', e.target.value), 400);
              }}
              className="flex-1 rounded-full border border-[#e8e4df] bg-white px-5 py-3 text-sm outline-none focus:border-primary"
            />
            <select
              value={sort}
              onChange={(e) => updateParam('sort', e.target.value)}
              className="rounded-lg border border-[#e8e4df] bg-white px-4 py-3 text-sm"
            >
              {SORT_OPTIONS.map((o) => (
                <option key={o.value} value={o.value}>{o.label}</option>
              ))}
            </select>
          </div>

          {loading ? (
            <div className={PRODUCT_GRID_CLASS}>
              {[...Array(8)].map((_, i) => <ProductCardSkeleton key={i} />)}
            </div>
          ) : products.length === 0 ? (
            <p className="py-16 text-center text-[#6b6b6b]">No products found.</p>
          ) : (
            <>
              <div className={PRODUCT_GRID_CLASS}>
                {products.map((p) => <ProductCard key={p.id} product={p} />)}
              </div>

              {pagination && pagination.totalPages > 1 && (
                <div className="mt-10 flex items-center justify-center gap-4 text-sm text-[#6b6b6b]">
                  <button
                    disabled={page <= 1}
                    onClick={() => updateParam('page', String(page - 1))}
                    className="rounded-full border-2 border-primary px-5 py-2 text-sm text-primary disabled:opacity-40"
                  >
                    Previous
                  </button>
                  <span>Page {page} of {pagination.totalPages}</span>
                  <button
                    disabled={!pagination.hasMore}
                    onClick={() => updateParam('page', String(page + 1))}
                    className="rounded-full border-2 border-primary px-5 py-2 text-sm text-primary disabled:opacity-40"
                  >
                    Next
                  </button>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
