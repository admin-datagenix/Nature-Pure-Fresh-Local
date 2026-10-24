import { useState } from 'react';
import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import PriceRangeSlider from './PriceRangeSlider';

const PRICE_MIN = 99;
const PRICE_MAX = 2200;

const MOBILE_TABS = [
  { id: 'category', label: 'Category' },
  { id: 'price', label: 'Price' },
  { id: 'filter', label: 'Filter' },
];

function CollapseSection({ title, defaultOpen = true, children, className }) {
  return (
    <details
      open={defaultOpen}
      className={cn('group border-b border-sage/45 last:border-b-0', className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
        <span className="font-heading">{title}</span>
        <span className="text-xs text-muted transition group-open:rotate-180" aria-hidden="true">▼</span>
      </summary>
      <div className="pb-3 pt-0">{children}</div>
    </details>
  );
}

function FilterRadioIndicator({ checked }) {
  return (
    <span
      className={cn(
        'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-full border transition',
        checked ? 'border-primary' : 'border-sage bg-white'
      )}
      aria-hidden="true"
    >
      {checked ? <span className="h-2 w-2 rounded-full bg-primary" /> : null}
    </span>
  );
}

function FilterRadioOption({ checked, onSelect, label, count }) {
  return (
    <button
      type="button"
      role="radio"
      aria-checked={checked}
      onClick={onSelect}
      className={cn(
        'flex w-full cursor-pointer items-center gap-2.5 rounded-sm py-2 pl-0.5 text-left text-sm transition',
        checked ? 'font-medium text-primary' : 'text-primary/80 hover:text-primary'
      )}
    >
      <FilterRadioIndicator checked={checked} />
      <span className="flex flex-1 items-center justify-between gap-2">
        <span>{label}</span>
        {count != null && <span className="text-xs text-muted">{count}</span>}
      </span>
    </button>
  );
}

function useFilterState(searchParams) {
  const minPrice = parseInt(searchParams.get('minPrice') || String(PRICE_MIN), 10);
  const maxPrice = parseInt(searchParams.get('maxPrice') || String(PRICE_MAX), 10);
  const formatSlug = (searchParams.get('format') || '').trim();

  const priceCustomized = minPrice > PRICE_MIN || maxPrice < PRICE_MAX;
  const moreFiltersActive = Boolean(formatSlug);

  return { minPrice, maxPrice, formatSlug, priceCustomized, moreFiltersActive };
}

function CategoryFilterList({ categories, routeCategory }) {
  return (
    <ul className="space-y-0.5" role="radiogroup" aria-label="Product category">
      <li>
        <Link
          to="/shop"
          role="radio"
          aria-checked={!routeCategory}
          className={cn(
            'flex items-center gap-2.5 rounded-sm py-2 pl-0.5 text-sm transition',
            !routeCategory ? 'font-medium text-primary' : 'text-primary/80 hover:text-primary'
          )}
        >
          <FilterRadioIndicator checked={!routeCategory} />
          All Products
        </Link>
      </li>
      {categories.map((c) => {
        const selected = routeCategory === c.slug;
        return (
          <li key={c.slug}>
            <Link
              to={`/shop/${c.slug}`}
              role="radio"
              aria-checked={selected}
              className={cn(
                'flex items-center gap-2.5 rounded-sm py-2 pl-0.5 text-sm transition',
                selected ? 'font-medium text-primary' : 'text-primary/80 hover:text-primary'
              )}
            >
              <FilterRadioIndicator checked={selected} />
              <span className="flex flex-1 justify-between gap-2">
                {c.name}
                <span className="text-xs text-muted">{c.product_count}</span>
              </span>
            </Link>
          </li>
        );
      })}
    </ul>
  );
}

function ProductFormatFilterList({ productFormats, formatSlug, onUpdateParams }) {
  if (!productFormats?.length) {
    return <p className="text-sm text-muted">No product formats available.</p>;
  }

  return (
    <ul className="space-y-0.5" role="radiogroup" aria-label="Product format">
      <li>
        <FilterRadioOption
          label="All formats"
          checked={!formatSlug}
          onSelect={() => onUpdateParams('format', '')}
        />
      </li>
      {productFormats.map((c) => {
        const selected = formatSlug === c.slug;
        return (
          <li key={c.slug}>
            <FilterRadioOption
              label={c.name}
              count={c.product_count}
              checked={selected}
              onSelect={() => onUpdateParams('format', c.slug)}
            />
          </li>
        );
      })}
    </ul>
  );
}

function PriceFilterPanel({ minPrice, maxPrice, onUpdateParams }) {
  return (
    <PriceRangeSlider
      min={PRICE_MIN}
      max={PRICE_MAX}
      valueMin={minPrice}
      valueMax={maxPrice}
      onChangeMin={(v) => onUpdateParams('minPrice', String(v))}
      onChangeMax={(v) => onUpdateParams('maxPrice', String(v))}
    />
  );
}

function MoreFiltersPanel({ formatSlug, productFormats, onUpdateParams }) {
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted">Product format</p>
        <ProductFormatFilterList
          productFormats={productFormats}
          formatSlug={formatSlug}
          onUpdateParams={onUpdateParams}
        />
      </div>

      <button
        type="button"
        onClick={() => onUpdateParams('reset', '1')}
        className="label-chip mt-1 w-full border border-sage/60 py-2.5 text-sm font-medium text-primary transition hover:bg-cream-dark"
      >
        Clear filters
      </button>
    </div>
  );
}

function ShopMobileFilterTabs({
  categories,
  productFormats,
  routeCategory,
  searchParams,
  onUpdateParams,
  className,
}) {
  const [openTab, setOpenTab] = useState(null);
  const state = useFilterState(searchParams);

  const onTabClick = (id) => {
    setOpenTab((current) => (current === id ? null : id));
  };

  return (
    <div className={cn('shop-mobile-filters overflow-hidden rounded-[1.25rem] border border-sage/55 bg-white', className)}>
      <div className="shop-mobile-filters__tabs flex border-b border-sage/40" role="tablist" aria-label="Shop filters">
        {MOBILE_TABS.map((tab) => {
          const selected = openTab === tab.id;
          return (
            <button
              key={tab.id}
              type="button"
              role="tab"
              aria-selected={selected}
              aria-expanded={selected}
              onClick={() => onTabClick(tab.id)}
              className={cn(
                'shop-mobile-filters__tab relative flex flex-1 items-center justify-center gap-1.5 border-r border-sage/35 px-2 py-3.5 text-sm font-semibold transition last:border-r-0',
                selected ? 'bg-cream/80 text-primary' : 'text-primary/75 hover:bg-cream/40'
              )}
            >
              <span>{tab.label}</span>
              <span
                className={cn(
                  'text-[0.625rem] text-muted transition',
                  selected && 'rotate-180 text-primary'
                )}
                aria-hidden
              >
                ▼
              </span>
              {selected && (
                <span className="absolute inset-x-4 bottom-0 h-0.5 rounded-full bg-primary" aria-hidden />
              )}
            </button>
          );
        })}
      </div>

      {openTab && (
        <div
          className="shop-mobile-filters__panel max-h-[min(70vh,22rem)] overflow-y-auto border-t border-sage/30 px-4 py-3"
          role="tabpanel"
        >
          {openTab === 'category' && (
            <CategoryFilterList categories={categories} routeCategory={routeCategory} />
          )}
          {openTab === 'price' && (
            <PriceFilterPanel
              minPrice={state.minPrice}
              maxPrice={state.maxPrice}
              onUpdateParams={onUpdateParams}
            />
          )}
          {openTab === 'filter' && (
            <MoreFiltersPanel
              formatSlug={state.formatSlug}
              productFormats={productFormats}
              onUpdateParams={onUpdateParams}
            />
          )}
        </div>
      )}
    </div>
  );
}

export default function ShopFilters({
  categories,
  routeCategory,
  searchParams,
  onUpdateParams,
  className,
  variant = 'sidebar',
}) {
  const state = useFilterState(searchParams);
  const productFormats = categories;

  if (variant === 'mobile') {
    return (
      <ShopMobileFilterTabs
        categories={categories}
        productFormats={productFormats}
        routeCategory={routeCategory}
        searchParams={searchParams}
        onUpdateParams={onUpdateParams}
        className={className}
      />
    );
  }

  return (
    <aside
      className={cn(
        'rounded-sm border border-sage/55 bg-white px-3 py-1 shadow-[0_8px_28px_rgba(41,70,51,0.06)] md:sticky md:top-24 md:self-start',
        className
      )}
    >
      <CollapseSection title="Category" defaultOpen>
        <CategoryFilterList categories={categories} routeCategory={routeCategory} />
      </CollapseSection>

      <CollapseSection title="PRICE" defaultOpen>
        <PriceFilterPanel
          minPrice={state.minPrice}
          maxPrice={state.maxPrice}
          onUpdateParams={onUpdateParams}
        />
      </CollapseSection>

      <CollapseSection title="Product format" defaultOpen={false}>
        <ProductFormatFilterList
          productFormats={productFormats}
          formatSlug={state.formatSlug}
          onUpdateParams={onUpdateParams}
        />
      </CollapseSection>

      <button
        type="button"
        onClick={() => onUpdateParams('reset', '1')}
        className="label-chip mt-2 mb-2 w-full border border-sage/60 py-2 text-sm font-medium text-primary transition hover:bg-cream-dark"
      >
        Clear filters
      </button>
    </aside>
  );
}

export { PRICE_MIN, PRICE_MAX };
