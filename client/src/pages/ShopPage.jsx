import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import { api } from '../api/client';
import ProductCard, { ProductCardSkeleton } from '../components/shop/ProductCard';
import ShopFilters from '../components/shop/ShopFilters';
import { InsetCategoryBanner } from '../components/shop/CategoryBannerHero';
import NeoSelect from '../components/ui/NeoSelect';
import { buildShopPage } from '../api/mock/cms/shopPage';
import { STORE_SETTINGS } from '../config/storeSettings';
import { filterFallbackProducts } from '../data/fallbackProducts';
import useCategoryTree from '../hooks/useCategoryTree';
import { useShopPageConfig } from '../hooks/useCmsPages';
import { PRODUCT_GRID_SHOP_CLASS } from '../utils/productLayout';
import { applyOutOfStockListingFilter } from '../utils/stockDisplay';
import { USE_LIVE_CATALOG, USE_LIVE_CATEGORIES } from '../api/config';
import { findCategoryRecord } from '../utils/categoryRoute';

const FALLBACK_SHOP = buildShopPage();

export default function ShopPage() {
  const { data: shopConfig } = useShopPageConfig();
  const shop = shopConfig || FALLBACK_SHOP;
  const SORT_OPTIONS = shop.sortOptions || FALLBACK_SHOP.sortOptions;
  const paginationMode = shop.pagination?.mode || STORE_SETTINGS.shopProductPagination;
  const pageSize = shop.pagination?.pageSize || STORE_SETTINGS.shopPageSize;
  const shopBanners = shop.banners || FALLBACK_SHOP.banners;

  const { category } = useParams();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const { categories } = useCategoryTree();
  const loadMoreRef = useRef(null);
  const [searchFieldKey, setSearchFieldKey] = useState(0);

  const [products, setProducts] = useState([]);
  const [pagination, setPagination] = useState(null);
  const [loading, setLoading] = useState(true);
  const [loadingMore, setLoadingMore] = useState(false);
  const [selectedProductId, setSelectedProductId] = useState(null);
  const [categoryDetail, setCategoryDetail] = useState(null);
  const page = parseInt(searchParams.get('page') || '1', 10);
  const sort = searchParams.get('sort') || 'bestseller';
  const search = searchParams.get('q') || '';
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
          if (!list.length && !USE_LIVE_CATALOG) {
            list = filterFallbackProducts({ category, limit: pageSize });
          }
          list = applyOutOfStockListingFilter(list, stock);
          setProducts((prev) => (isAppend ? [...prev, ...list] : list));
          setPagination(res.pagination);
        })
        .catch(() => {
          if (USE_LIVE_CATALOG) {
            setProducts((prev) => (isAppend ? prev : []));
            setPagination(null);
            return;
          }
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
    setCategoryDetail(null);
    if (!category || !USE_LIVE_CATEGORIES) return undefined;

    const fromTree = findCategoryRecord(categories, category);
    if (fromTree?.description?.trim() && fromTree?.banner_image) return undefined;

    let active = true;
    api
      .getCategory(category)
      .then((res) => {
        if (active && res?.data) setCategoryDetail(res.data);
      })
      .catch(() => {});

    return () => {
      active = false;
    };
  }, [category, categories]);

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

  const clearAllShopFilters = useCallback(() => {
    setSelectedProductId(null);
    setSearchFieldKey((k) => k + 1);
    navigate({ pathname: '/shop', search: '' }, { replace: true });
  }, [navigate]);

  const updateFilterParam = (key, value) => {
    if (key === 'reset') {
      clearAllShopFilters();
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

  const listClass = PRODUCT_GRID_SHOP_CLASS;
  const categoryRecord = useMemo(() => {
    if (!category) return null;
    return findCategoryRecord(categories, category) || categoryDetail;
  }, [category, categories, categoryDetail]);
  const categoryTitle = categoryRecord?.name || (category ? 'Shop' : 'All Products');
  const categoryDescription = categoryRecord?.description?.trim() || '';
  const useAdminCategoryContent = USE_LIVE_CATEGORIES;
  const categoryBannerSrc = useAdminCategoryContent
    ? category
      ? categoryRecord?.banner_image || null
      : null
    : category
      ? shopBanners.byCategory?.[category] ?? null
      : shopBanners.all;
  const categoryBannerFallback =
    category && !useAdminCategoryContent ? shopBanners.fallbacks?.[category] : undefined;

  const liveCategoryTextHeader =
    useAdminCategoryContent && category ? (
      <div
        className={
          categoryBannerSrc
            ? 'mb-8 border-b border-sage/40 py-8 md:py-10'
            : 'mb-10 border-b border-sage/40 bg-cream-dark/60 py-10 md:py-12'
        }
      >
        <div className="site-container max-w-3xl">
          <h1 className="font-heading text-3xl font-semibold text-primary md:text-4xl">{categoryTitle}</h1>
          {categoryDescription ? (
            <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{categoryDescription}</p>
          ) : null}
        </div>
      </div>
    ) : null;

  return (
    <div className="pb-16">
      {useAdminCategoryContent && category ? (
        <>
          {categoryBannerSrc ? (
            <InsetCategoryBanner src={categoryBannerSrc} title={categoryTitle} />
          ) : null}
          {liveCategoryTextHeader}
        </>
      ) : categoryBannerSrc ? (
        <InsetCategoryBanner
          src={categoryBannerSrc}
          title={categoryTitle}
          imageFallback={categoryBannerFallback}
        />
      ) : category ? (
        <div className="mb-10 border-b border-sage/40 bg-cream-dark/60 py-10 md:py-12">
          <div className="site-container max-w-3xl">
            <h1 className="font-heading text-3xl font-semibold text-primary md:text-4xl">{categoryTitle}</h1>
            {categoryDescription ? (
              <p className="mt-4 text-base leading-relaxed text-muted md:text-lg">{categoryDescription}</p>
            ) : null}
          </div>
        </div>
      ) : (
        <InsetCategoryBanner src={shopBanners.all} title={categoryTitle} />
      )}

      <div className="site-container">
        <ShopFilters
          variant="mobile"
          categories={categories}
          routeCategory={category}
          searchParams={searchParams}
          onUpdateParams={updateFilterParam}
          className="mb-6 md:hidden"
        />

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
                  key={`shop-search-${searchFieldKey}`}
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
                      layout="grid"
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
