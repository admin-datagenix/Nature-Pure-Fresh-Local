import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, getDiscountPercent, getBadgeClass } from '../../utils/helpers';
import { getProductCardTone, PRODUCT_CARD_WIDTH } from '../../utils/productLayout';
import { getProductImage } from '../../data/productImages';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/cn';
import StarRating from '../ui/StarRating';

function CartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3h2l1.2 6.4a2 2 0 002 1.6h7.6a2 2 0 001.95-1.55L18 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="16" r="1.2" fill="currentColor" />
      <circle cx="15" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

function CheckIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M5 10.5l3.2 3.2L15 6.8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

export default function ProductCard({ product, className, compact = false, selected = false, onSelect }) {
  const { addItem, loading } = useCart();
  const [added, setAdded] = useState(false);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    await addItem(product.id);
    setAdded(true);
    setTimeout(() => setAdded(false), 1800);
  };

  const shortName = product.name.replace(/^Freeze Dried /i, '');
  const discount = getDiscountPercent(product);
  const imageSrc = getProductImage(product);

  return (
    <article
      className={cn(
        'group flex h-full min-w-0 flex-col overflow-hidden rounded-[24px]',
        'border border-sage/55 bg-white',
        'shadow-[0_6px_20px_rgba(41,70,51,0.05)]',
        'transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_10px_28px_rgba(41,70,51,0.08)]',
        selected && 'border-primary/35 ring-1 ring-primary/15',
        compact && PRODUCT_CARD_WIDTH,
        className
      )}
      onClick={() => onSelect?.(product.id)}
    >
      <Link to={`/product/${product.slug}`} className="block p-2.5 pb-0" onClick={(e) => e.stopPropagation()}>
        <div
          className={cn(
            'relative aspect-square overflow-hidden rounded-[20px] border border-sage/40 transition duration-300',
            selected
              ? 'border-primary/50'
              : 'group-hover:border-secondary/70'
          )}
          style={{ backgroundColor: getProductCardTone(product) }}
        >
          <div className="pointer-events-none absolute inset-[18%] rounded-full bg-white/30 blur-2xl" />

          {product.badge && (
            <span
              className={cn(
                'absolute left-2.5 top-2.5 z-10 text-[0.58rem] font-bold uppercase tracking-wide shadow-sm',
                getBadgeClass(product.badge)
              )}
            >
              {product.badge}
            </span>
          )}
          {discount > 0 && (
            <span className="label-chip absolute right-2.5 top-2.5 z-10 bg-white/95 px-2 py-1 text-[0.58rem] font-bold text-strawberry shadow-sm">
              −{discount}%
            </span>
          )}

          <div className="relative flex h-full w-full items-center justify-center p-3 sm:p-4">
            <img
              src={imageSrc}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className={cn(
                'max-h-full max-w-full object-contain transition duration-500 ease-out',
                selected ? 'scale-[1.06]' : 'group-hover:scale-[1.06]'
              )}
            />
          </div>
        </div>
      </Link>

      <div className="flex flex-1 flex-col rounded-[20px] bg-white p-3 sm:p-3.5 m-2.5 mt-2">
        <Link to={`/product/${product.slug}`} className="block min-w-0 flex-1" onClick={(e) => e.stopPropagation()}>
          <h3 className="line-clamp-2 font-heading text-[0.95rem] font-semibold leading-snug text-primary transition group-hover:text-secondary sm:text-base">
            {shortName}
          </h3>

          {product.short_description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
              {product.short_description}
            </p>
          )}

          <div className="mt-2 flex items-center gap-2">
            {product.rating > 0 && (
              <p className="flex flex-wrap items-center gap-1.5 text-[0.7rem] text-muted">
                <StarRating rating={product.rating} size="sm" />
                <span className="font-medium text-primary/80">{product.rating}</span>
                {product.review_count > 0 && <span>({product.review_count})</span>}
              </p>
            )}
            {product.weight_grams && (
              <span className="label-chip ml-auto border border-sage/45 bg-white px-2 py-0.5 text-[0.65rem] font-medium text-muted">
                {product.weight_grams}g
              </span>
            )}
          </div>
        </Link>

        <div className="mt-3 flex items-center justify-between gap-2">
          <div className="flex items-baseline gap-1.5">
            <span className="font-heading text-lg font-bold text-primary">{formatPrice(product.price)}</span>
            {discount > 0 && (
              <span className="text-xs text-muted line-through">{formatPrice(product.compare_at_price)}</span>
            )}
          </div>
          <button
            type="button"
            onClick={handleAdd}
            disabled={loading}
            aria-label={`Add ${shortName} to cart`}
            style={!added ? { backgroundColor: getProductCardTone(product) } : undefined}
            className={cn(
              'flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition duration-200',
              added
                ? 'bg-success text-white shadow-[0_6px_14px_rgba(74,124,89,0.22)]'
                : 'border border-sage/55 text-primary shadow-[0_2px_8px_rgba(41,70,51,0.06)] hover:border-primary hover:bg-primary hover:text-white'
            )}
          >
            {added ? <CheckIcon className="h-5 w-5" /> : <CartIcon className="h-5 w-5" />}
          </button>
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ className, compact = false }) {
  return (
    <div
      className={cn(
        'animate-pulse overflow-hidden rounded-[24px] border border-sage/55 bg-white shadow-[0_6px_20px_rgba(41,70,51,0.04)]',
        compact && PRODUCT_CARD_WIDTH,
        className
      )}
    >
      <div className="m-2.5 mb-0 aspect-square rounded-[20px] border border-sage/40 bg-cream-dark" />
      <div className="m-2.5 mt-2 space-y-2 rounded-[20px] bg-white p-3">
        <div className="h-4 w-4/5 rounded-full bg-sage/40" />
        <div className="h-3 w-1/2 rounded-full bg-sage/35" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-5 w-14 rounded-full bg-sage/40" />
          <div className="h-10 w-10 rounded-full bg-sage/35" />
        </div>
      </div>
    </div>
  );
}
