import { useEffect, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard, { ProductCardSkeleton } from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import NeoSelect from '../components/ui/NeoSelect';
import { PRODUCT_GRID_SHOP_CLASS } from '../utils/productLayout';
import { filterFallbackProducts } from '../data/fallbackProducts';

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
  const [selectedProductId, setSelectedProductId] = useState(null);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'bestseller';
  const search = searchParams.get('q') || '';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const stock = searchParams.get('stock') || '';
  const format = searchParams.get('format') || '';

  useEffect(() => {
    api.getCategories().then((res) => setCategories(res.data)).catch(() => {});
  }, []);

  useEffect(() => {
    setLoading(true);
    api
      .getProducts({
        page,
        limit: 12,
        category,
        sort,
        search: search || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        rating: rating || undefined,
        stock: stock || undefined,
        format: format || undefined,
      })
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
  }, [category, page, sort, search, minPrice, maxPrice, rating, stock, format]);

  const updateFilterParam = (key, value) => {
    if (key === 'reset') {
      setSearchParams({});
      setSelectedProductId(null);
      return;
    }
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    params.delete('page');
    setSearchParams(params);
  };

  const updateParam = (key, value) => {
    const params = new URLSearchParams(searchParams);
    if (value) params.set(key, value);
    else params.delete(key);
    if (key !== 'page') params.delete('page');
    setSearchParams(params);
  };

  const toggleSelectProduct = (id) => {
    setSelectedProductId((current) => (current === id ? null : id));
  };

  return (
    <div className="pb-16">
      <div className="mb-10 bg-primary py-12 text-center text-white">
        <div className="site-container">
          <h1 className="font-heading text-3xl font-semibold">
            {category ? categories.find((c) => c.slug === category)?.name || 'Shop' : 'All Products'}
          </h1>
          <p className="mt-2 opacity-80">Premium freeze-dried fruits — 100% natural, no added sugar</p>
        </div>
      </div>

      <div className="site-container">
        <details className="mb-6 rounded-[1.25rem] border border-sage/55 bg-white md:hidden">
          <summary className="cursor-pointer list-none px-4 py-3.5 font-heading text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
            Filters & categories
          </summary>
          <div className="border-t border-sage/40 px-2 pb-2">
            <ShopFilters
              categories={categories}
              routeCategory={category}
              searchParams={searchParams}
              onUpdateParams={updateFilterParam}
              className="border-0 shadow-none"
            />
          </div>
        </details>

        <div className="grid gap-8 lg:grid-cols-[280px_1fr] lg:gap-10">
          <ShopFilters
            categories={categories}
            routeCategory={category}
            searchParams={searchParams}
            onUpdateParams={updateFilterParam}
            className="hidden lg:block"
          />

          <div className="min-w-0">
            <div className="mb-6 flex flex-col gap-3 sm:flex-row">
              <div className="min-w-0 flex-1">
                <input
                  type="search"
                  placeholder="Search products..."
                  defaultValue={search}
                  onChange={(e) => {
                    clearTimeout(window._searchTimer);
                    window._searchTimer = setTimeout(() => updateParam('q', e.target.value), 400);
                  }}
                  className="neo-input px-5 py-3 text-sm"
                />
              </div>
              <NeoSelect
                value={sort}
                onChange={(e) => updateParam('sort', e.target.value)}
                wrapperClassName="w-full shrink-0 sm:w-auto sm:min-w-[12.5rem]"
                className="px-5 py-3"
                aria-label="Sort products"
              >
                {SORT_OPTIONS.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </NeoSelect>
            </div>

            {loading ? (
              <div className={PRODUCT_GRID_SHOP_CLASS}>
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} className="h-full" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="py-16 text-center text-muted">No products match your filters.</p>
            ) : (
              <>
                <div className={PRODUCT_GRID_SHOP_CLASS}>
                  {products.map((p) => (
                    <ProductCard
                      key={p.id}
                      product={p}
                      className="h-full"
                      selected={selectedProductId === p.id}
                      onSelect={toggleSelectProduct}
                    />
                  ))}
                </div>

                {pagination && pagination.totalPages > 1 && (
                  <div className="mt-10 flex items-center justify-center gap-4 text-sm text-muted">
                    <button
                      type="button"
                      disabled={page <= 1}
                      onClick={() => updateParam('page', String(page - 1))}
                      className="neo-btn-ghost px-5 py-2 text-sm disabled:opacity-40"
                    >
                      Previous
                    </button>
                    <span>
                      Page {page} of {pagination.totalPages}
                    </span>
                    <button
                      type="button"
                      disabled={!pagination.hasMore}
                      onClick={() => updateParam('page', String(page + 1))}
                      className="neo-btn-ghost px-5 py-2 text-sm disabled:opacity-40"
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
    </div>
  );
}
