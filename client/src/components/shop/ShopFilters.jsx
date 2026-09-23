import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';
import StarRating from '../ui/StarRating';
import PriceRangeSlider from './PriceRangeSlider';

const PRICE_MIN = 99;
const PRICE_MAX = 2200;

function CollapseSection({ title, defaultOpen = true, children, className }) {
  return (
    <details
      open={defaultOpen}
      className={cn('group border-b border-sage/45 last:border-b-0', className)}
    >
      <summary className="flex cursor-pointer list-none items-center justify-between py-3 text-sm font-semibold text-primary [&::-webkit-details-marker]:hidden">
        <span className="font-heading">{title}</span>
        <span
          className="text-xs text-muted transition group-open:rotate-180"
          aria-hidden="true"
        >
          ▼
        </span>
      </summary>
      <div className="pb-3 pt-0">{children}</div>
    </details>
  );
}

function FilterCheck({ checked, onChange, label, count, stars }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1 text-sm text-primary/85 hover:text-primary">
      <span
        className={cn(
          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[2px] border transition',
          checked ? 'border-primary bg-primary text-white' : 'border-sage bg-white'
        )}
      >
        {checked && (
          <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
            <path d="M2 6l2.5 2.5L10 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
          </svg>
        )}
      </span>
      <input type="checkbox" className="sr-only" checked={checked} onChange={onChange} />
      {stars != null ? (
        <span className="flex flex-1 flex-wrap items-center gap-2">
          <StarRating filledCount={stars} total={5} />
          <span className="text-muted">&amp; up · {label}</span>
        </span>
      ) : (
        <span className="flex flex-1 items-center justify-between gap-2">
          <span>{label}</span>
          {count != null && <span className="text-xs text-muted">{count}</span>}
        </span>
      )}
    </label>
  );
}

export default function ShopFilters({
  categories,
  routeCategory,
  searchParams,
  onUpdateParams,
  className,
}) {
  const minPrice = parseInt(searchParams.get('minPrice') || String(PRICE_MIN), 10);
  const maxPrice = parseInt(searchParams.get('maxPrice') || String(PRICE_MAX), 10);
  const minRating = parseInt(searchParams.get('rating') || '0', 10);
  const stock = searchParams.get('stock') || 'all';
  const formats = (searchParams.get('format') || '').split(',').filter(Boolean);

  const toggleFormat = (key) => {
    const next = formats.includes(key) ? formats.filter((f) => f !== key) : [...formats, key];
    onUpdateParams('format', next.length ? next.join(',') : '');
  };

  const formatActive = (key) => formats.includes(key);

  return (
    <aside
      className={cn(
        'rounded-sm border border-sage/55 bg-white px-3 py-1 shadow-[0_8px_28px_rgba(41,70,51,0.06)] md:sticky md:top-24 md:self-start',
        className
      )}
    >
      <CollapseSection title="Category" defaultOpen>
        <ul className="space-y-0.5">
          <li>
            <Link
              to="/shop"
              className={cn(
                'flex items-center gap-2.5 rounded-sm py-1 pl-0.5 text-sm transition',
                !routeCategory ? 'font-medium text-primary' : 'text-primary/80 hover:text-primary'
              )}
            >
              <span
                className={cn(
                  'flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border',
                  !routeCategory ? 'border-primary bg-primary text-white' : 'border-sage bg-white'
                )}
              >
                {!routeCategory && (
                  <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                    <path d="M2 6l2.5 2.5L10 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                  </svg>
                )}
              </span>
              All Products
            </Link>
          </li>
          {categories.map((c) => (
            <li key={c.slug}>
              <Link
                to={`/shop/${c.slug}`}
                className={cn(
                  'flex items-center gap-2.5 rounded-sm py-1 pl-0.5 text-sm transition',
                  routeCategory === c.slug ? 'font-medium text-primary' : 'text-primary/80 hover:text-primary'
                )}
              >
                <span
                  className={cn(
                    'flex h-[18px] w-[18px] items-center justify-center rounded-[2px] border',
                    routeCategory === c.slug ? 'border-primary bg-primary text-white' : 'border-sage bg-white'
                  )}
                >
                  {routeCategory === c.slug && (
                    <svg viewBox="0 0 12 12" className="h-3 w-3" aria-hidden="true">
                      <path d="M2 6l2.5 2.5L10 3" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" />
                    </svg>
                  )}
                </span>
                <span className="flex flex-1 justify-between gap-2">
                  {c.name}
                  <span className="text-xs text-muted">{c.product_count}</span>
                </span>
              </Link>
            </li>
          ))}
        </ul>
      </CollapseSection>

      <CollapseSection title="PRICE" defaultOpen>
        <PriceRangeSlider
          min={PRICE_MIN}
          max={PRICE_MAX}
          valueMin={minPrice}
          valueMax={maxPrice}
          onChangeMin={(v) => onUpdateParams('minPrice', String(v))}
          onChangeMax={(v) => onUpdateParams('maxPrice', String(v))}
        />
      </CollapseSection>

      <CollapseSection title="Customer ratings" defaultOpen={false}>
        {[5, 4, 3, 2, 1].map((stars) => (
          <FilterCheck
            key={stars}
            stars={stars}
            label={`${stars} Star`}
            checked={minRating === stars}
            onChange={() => onUpdateParams('rating', minRating === stars ? '' : String(stars))}
          />
        ))}
      </CollapseSection>

      <CollapseSection title="Product format" defaultOpen={false}>
        <FilterCheck
          label="Fruit chunks (snacks)"
          checked={formatActive('chunks')}
          onChange={() => toggleFormat('chunks')}
        />
        <FilterCheck
          label="Fruit powders"
          checked={formatActive('powder')}
          onChange={() => toggleFormat('powder')}
        />
        <FilterCheck
          label="Combos & variety packs"
          checked={formatActive('combo')}
          onChange={() => toggleFormat('combo')}
        />
      </CollapseSection>

      <CollapseSection title="Availability" defaultOpen={false}>
        <FilterCheck
          label="In stock"
          checked={stock === 'in'}
          onChange={() => onUpdateParams('stock', stock === 'in' ? '' : 'in')}
        />
        <FilterCheck
          label="Out of stock"
          checked={stock === 'out'}
          onChange={() => onUpdateParams('stock', stock === 'out' ? '' : 'out')}
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
