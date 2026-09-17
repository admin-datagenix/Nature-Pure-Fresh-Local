import { useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice, getDiscountPercent } from '../../utils/helpers';
import { getProductCardTone, PRODUCT_CARD_WIDTH } from '../../utils/productLayout';
import { useCart } from '../../context/CartContext';
import { cn } from '../../lib/cn';
import ProductVisual from '../ui/ProductVisual';

function CartIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 20 20" fill="none" aria-hidden="true">
      <path d="M3 3h2l1.2 6.4a2 2 0 002 1.6h7.6a2 2 0 001.95-1.55L18 6H6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
      <circle cx="9" cy="16" r="1.2" fill="currentColor" />
      <circle cx="15" cy="16" r="1.2" fill="currentColor" />
    </svg>
  );
}

export default function ProductCard({ product, className, compact = false }) {
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
  const badge = discount > 0 ? `${discount}% off` : product.badge;
  const meta = [product.category_name, product.weight_grams ? `${product.weight_grams}g` : null]
    .filter(Boolean)
    .join(', ')
    .toLowerCase();

  return (
    <article
      className={cn(
        'group flex h-full flex-col overflow-hidden rounded-[1.75rem] border border-[#e8e4df] bg-cream',
        'shadow-[0_8px_24px_rgba(45,62,46,0.06)]',
        'transition duration-300 hover:-translate-y-0.5 hover:border-secondary/40 hover:shadow-[0_14px_32px_rgba(45,62,46,0.12)]',
        compact && PRODUCT_CARD_WIDTH,
        className
      )}
    >
      <Link to={`/product/${product.slug}`} className="flex min-h-0 flex-1 flex-col">
        <div
          className={cn(
            'relative mx-3 mt-3 overflow-hidden rounded-[1.35rem]',
            compact ? 'h-[180px] sm:h-[200px] md:h-[220px]' : 'aspect-[4/3]'
          )}
          style={{ backgroundColor: getProductCardTone(product) }}
        >
          {badge && (
            <span className="absolute left-2.5 top-2.5 z-10 rounded-full bg-cream px-2 py-0.5 text-[0.6rem] font-semibold text-primary shadow-sm">
              {badge}
            </span>
          )}
          <ProductVisual product={product} plain hideBadge />
        </div>

        <div className="px-4 pt-3">
          <h3 className="line-clamp-2 font-heading text-base font-semibold leading-snug text-primary sm:text-[1.05rem]">
            {shortName}
          </h3>
          <p className="mt-1 line-clamp-1 text-xs text-[#6b6b6b]">{meta}</p>
        </div>
      </Link>

      <div className="mt-auto flex items-center justify-between px-4 pb-4 pt-3">
        <span className="text-lg font-bold text-primary">{formatPrice(product.price)}</span>
        <button
          type="button"
          onClick={handleAdd}
          disabled={loading}
          aria-label={`Add ${shortName} to cart`}
          className={cn(
            'flex h-10 w-10 items-center justify-center rounded-full border border-primary text-primary transition',
            added
              ? 'border-success bg-success text-white'
              : 'bg-cream hover:bg-primary hover:text-white'
          )}
        >
          {added ? <span className="text-sm font-bold">✓</span> : <CartIcon className="h-5 w-5" />}
        </button>
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ className, compact = false }) {
  return (
    <div
      className={cn(
        'animate-pulse overflow-hidden rounded-[1.75rem] border border-[#e8e4df] bg-cream shadow-sm',
        compact && PRODUCT_CARD_WIDTH,
        className
      )}
    >
      <div className="mx-3 mt-3 h-[180px] rounded-[1.35rem] bg-cream-dark sm:h-[200px] md:h-[220px]" />
      <div className="space-y-2 px-4 py-4">
        <div className="h-4 w-4/5 rounded bg-cream-dark" />
        <div className="h-3 w-1/2 rounded bg-cream-dark" />
        <div className="flex items-center justify-between pt-2">
          <div className="h-4 w-12 rounded bg-cream-dark" />
          <div className="h-9 w-9 rounded-full bg-cream-dark" />
        </div>
      </div>
    </div>
  );
}
