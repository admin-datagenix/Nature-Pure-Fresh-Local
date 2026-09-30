import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard, { ProductCardSkeleton } from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import { InsetCategoryBanner } from '../components/shop/CategoryBannerHero';
import ShopLowStockStrip from '../components/shop/ShopLowStockStrip';
import ShopViewToggle from '../components/shop/ShopViewToggle';
import NeoSelect from '../components/ui/NeoSelect';
import { ALL_PRODUCTS_SHOP_BANNER, SHOP_CATEGORY_BANNERS } from '../data/brand';
import { STORE_SETTINGS } from '../config/storeSettings';
import { filterFallbackProducts } from '../data/fallbackProducts';
import useCategoryTree from '../hooks/useCategoryTree';
import {
  PRODUCT_GRID_SHOP_CLASS,
  PRODUCT_LIST_SHOP_CLASS,
} from '../utils/productLayout';
import { applyOutOfStockListingFilter, pickLowStockProducts } from '../utils/stockDisplay';

const SORT_OPTIONS = [
  { value: 'bestseller', label: 'Best Selling' },
  { value: 'price_asc', label: 'Price: Low to High' },
  { value: 'price_desc', label: 'Price: High to Low' },
  { value: 'rating', label: 'Top Rated' },
  { value: 'newest', label: 'Newest' },
];

const paginationMode = STORE_SETTINGS.shopProductPagination;
const pageSize = STORE_SETTINGS.shopPageSize;

export default function ShopPage() {
  const { category } = useParams();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategoryTree();
  const loadMoreRef = useRef(null);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [lowStockCatalog, setLowStockCatalog] = useState([]);

  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'bestseller';
  const search = searchParams.get('q') || '';
  const view = searchParams.get('view') === 'list' ? 'list' : 'grid';
  const minPrice = searchParams.get('minPrice') || '';
  const maxPrice = searchParams.get('maxPrice') || '';
  const rating = searchParams.get('rating') || '';
  const stock = searchParams.get('stock') || '';
  const format = searchParams.get('format') || '';

  const fetchParams = {
    page,
    limit: pageSize,
    category,
    sort,
    search: search || undefined,
    minPrice: minPrice || undefined,
    maxPrice: maxPrice || undefined,
    rating: rating || undefined,
    stock: stock || undefined,
    format: format || undefined,
  };

  const loadProducts = useCallback(
    (append = false) => {
      const isAppend = append && paginationMode === 'infinite' && page > 1;
      if (isAppend) setLoadingMore(true);
      else setLoading(true);

      api
        .getProducts(fetchParams)
        .then((res) => {
          let list = res.data || res.products || [];
          if (!list.length) {
            list = filterFallbackProducts({ category, limit: pageSize });
          }
          list = applyOutOfStockListingFilter(list, stock);
          setProducts((prev) => (isAppend ? [...prev, ...list] : list));
          setPagination(res.pagination);
        })
        .catch(() => {
          const fallback = applyOutOfStockListingFilter(
            filterFallbackProducts({ category, limit: pageSize }),
            stock
          );
          setProducts((prev) => (isAppend ? [...prev, ...fallback] : fallback));
          setPagination(null);
        })
        .finally(() => {
          setLoading(false);
          setLoadingMore(false);
        });
    },
    [category, page, sort, search, minPrice, maxPrice, rating, stock, format]
  );

  useEffect(() => {
    loadProducts(page > 1 && paginationMode === 'infinite');
  }, [loadProducts, page]);

  useEffect(() => {
    api
      .getProducts({
        limit: 80,
        category,
        search: search || undefined,
        minPrice: minPrice || undefined,
        maxPrice: maxPrice || undefined,
        rating: rating || undefined,
        stock: stock || undefined,
        format: format || undefined,
      })
      .then((res) => {
        let list = res.data || res.products || [];
        if (!list.length) {
          list = filterFallbackProducts({ category, limit: 80 });
        }
        list = applyOutOfStockListingFilter(list, stock);
        setLowStockCatalog(pickLowStockProducts(list));
      })
      .catch(() => {
        const fallback = applyOutOfStockListingFilter(
          filterFallbackProducts({ category, limit: 80 }),
          stock
        );
        setLowStockCatalog(pickLowStockProducts(fallback));
      });
  }, [category, search, minPrice, maxPrice, rating, stock, format]);

  const lowStockStripItems = useMemo(() => {
    if (lowStockCatalog.length) return lowStockCatalog;
    return pickLowStockProducts(products);
  }, [lowStockCatalog, products]);

  useEffect(() => {
    if (paginationMode !== 'infinite' || !pagination?.hasMore || loading || loadingMore) {
      return undefined;
    }
    const node = loadMoreRef.current;
    if (!node) return undefined;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !loadingMore) {
          updateParam('page', String(page + 1));
        }
      },
      { rootMargin: '200px' }
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [pagination, loading, loadingMore, page]);

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

  const listClass = view === 'list' ? PRODUCT_LIST_SHOP_CLASS : PRODUCT_GRID_SHOP_CLASS;
  const categoryRecord = category ? categories.find((c) => c.slug === category) : null;
  const categoryTitle = categoryRecord?.name || (category ? 'Shop' : 'All Products');
  const categoryBannerSrc = category
    ? SHOP_CATEGORY_BANNERS[category] ?? null
    : ALL_PRODUCTS_SHOP_BANNER;

  return (
    <div className="pb-16">
      {categoryBannerSrc ? (
        <InsetCategoryBanner src={categoryBannerSrc} title={categoryTitle} />
      ) : (
        <div className="mb-10 bg-primary py-12 text-center text-white">
          <div className="site-container">
            <h1 className="font-heading text-3xl font-semibold">{categoryTitle}</h1>
            <p className="mt-2 opacity-80">Premium freeze-dried fruits — 100% natural, no added sugar</p>
          </div>
        </div>
      )}

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
            <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-center">
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
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <ShopViewToggle view={view} onChange={(v) => updateParam('view', v === 'grid' ? '' : v)} />
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
            </div>

            {!loading && lowStockStripItems.length > 0 && (
              <ShopLowStockStrip products={lowStockStripItems} />
            )}

            {loading ? (
              <div className={listClass}>
                {[...Array(9)].map((_, i) => (
                  <ProductCardSkeleton key={i} className="h-full" />
                ))}
              </div>
            ) : products.length === 0 ? (
              <p className="py-16 text-center text-muted">No products match your filters.</p>
            ) : (
              <>
                <div className={listClass}>
                  {products.map((p) => (
                    <ProductCard
                      key={`${p.id}-${p.slug}`}
                      product={p}
                      layout={view}
                      className="h-full"
                      selected={selectedProductId === p.id}
                      onSelect={toggleSelectProduct}
                    />
                  ))}
                </div>

                {paginationMode === 'pagination' && pagination && pagination.totalPages > 1 && (
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

                {paginationMode === 'infinite' && pagination?.hasMore && (
                  <div ref={loadMoreRef} className="mt-8 flex justify-center py-4 text-sm text-muted">
                    {loadingMore ? 'Loading more products…' : 'Scroll for more'}
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
