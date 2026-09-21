import { Link } from 'react-router-dom';
import { cn } from '../../lib/cn';

const PRICE_MIN = 99;
const PRICE_MAX = 2200;

function FilterSection({ title, children, className }) {
  return (
    <section className={cn('border-b border-sage/50 py-5 last:border-b-0', className)}>
      <h3 className="mb-3 font-heading text-sm font-semibold text-primary">{title}</h3>
      {children}
    </section>
  );
}

function FilterCheck({ checked, onChange, label, count, stars }) {
  return (
    <label className="flex cursor-pointer items-center gap-2.5 py-1.5 text-sm text-primary/85 hover:text-primary">
      <span
        className={cn(
          'flex h-[18px] w-[18px] shrink-0 items-center justify-center rounded-[4px] border transition',
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
        <span className="flex flex-1 items-center gap-1.5">
          <span className="text-mango tracking-tight" aria-hidden="true">
            {'★'.repeat(stars)}
            <span className="text-sage">{'★'.repeat(5 - stars)}</span>
          </span>
          <span className="text-muted">{label}</span>
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
        'rounded-[1.25rem] border border-sage/55 bg-white px-4 py-2 shadow-[0_8px_28px_rgba(41,70,51,0.06)] md:sticky md:top-24 md:max-h-[calc(100vh-7rem)] md:overflow-y-auto',
        className
      )}
    >
      <FilterSection title="Category">
        <ul className="space-y-0.5">
          <li>
            <Link
              to="/shop"
              className={cn(
                'flex items-center gap-2.5 rounded-lg py-1.5 pl-0.5 text-sm transition',
                !routeCategory ? 'font-medium text-primary' : 'text-primary/80 hover:text-primary'
              )}
            >
              <span
                className={cn(
                  'flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border',
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
                  'flex items-center gap-2.5 rounded-lg py-1.5 pl-0.5 text-sm transition',
                  routeCategory === c.slug ? 'font-medium text-primary' : 'text-primary/80 hover:text-primary'
                )}
              >
                <span
                  className={cn(
                    'flex h-[18px] w-[18px] items-center justify-center rounded-[4px] border',
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
      </FilterSection>

      <FilterSection title="Price">
        <p className="mb-3 text-sm font-medium text-primary">
          ₹{minPrice} – ₹{maxPrice}
        </p>
        <div className="space-y-3 px-0.5">
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={minPrice}
            onChange={(e) => onUpdateParams('minPrice', e.target.value)}
            className="shop-range w-full"
            aria-label="Minimum price"
          />
          <input
            type="range"
            min={PRICE_MIN}
            max={PRICE_MAX}
            step={10}
            value={maxPrice}
            onChange={(e) => onUpdateParams('maxPrice', e.target.value)}
            className="shop-range w-full"
            aria-label="Maximum price"
          />
        </div>
      </FilterSection>

      <FilterSection title="Review">
        {[5, 4, 3, 2, 1].map((stars) => (
          <FilterCheck
            key={stars}
            stars={stars}
            label={`${stars} Star`}
            checked={minRating === stars}
            onChange={() => onUpdateParams('rating', minRating === stars ? '' : String(stars))}
          />
        ))}
      </FilterSection>

      <FilterSection title="Product format">
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
      </FilterSection>

      <FilterSection title="Availability">
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
      </FilterSection>

      <button
        type="button"
        onClick={() => {
          onUpdateParams('reset', '1');
        }}
        className="mt-2 w-full rounded-full border border-sage/60 py-2.5 text-sm font-medium text-primary transition hover:bg-cream-dark"
      >
        Clear filters
      </button>
    </aside>
  );
}

export { PRICE_MIN, PRICE_MAX };
