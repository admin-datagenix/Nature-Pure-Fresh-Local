import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import {
  formatPrice,
  getDiscountPercent,
  getBadgeClass,
  PRODUCT_BADGE_CHIP,
  shouldShowProductRatings,
  shouldShowSaleTags,
} from '../../utils/helpers';
import { getCartItemImage } from '../../data/productImages';
import { getCartDeliveryByLabel } from '../../utils/deliveryEstimate';
import { cn } from '../../lib/cn';

function formatReviewCount(n) {
  const num = Number(n) || 0;
  if (num >= 1000) return `${(num / 1000).toFixed(num >= 10000 ? 0 : 1)}K`;
  return String(num);
}

export default function CartLineRow({
  item,
  loading,
  onUpdate,
  onRemove,
  onMoveToWishlist,
}) {
  const shortName = item.name.replace(/^Freeze Dried /i, '');
  const lineTotal = item.line_total ?? item.price * item.quantity;
  const showSale = shouldShowSaleTags();
  const showRatings = shouldShowProductRatings();
  const compare = Number(item.compare_at_price);
  const hasSale = showSale && compare > item.price;
  const offPct = hasSale ? getDiscountPercent({ price: item.price, compare_at_price: compare }) : 0;
  const variant = [item.weight_grams ? `${item.weight_grams}g pack` : null, item.category_name]
    .filter(Boolean)
    .join(' · ');
  const deliveryLabel = getCartDeliveryByLabel();

  const qtyPill = (
    <div className="cart-line-qty-pill inline-flex items-center">
      <button
        type="button"
        onClick={() => onUpdate(item.product_id, item.quantity - 1)}
        disabled={loading}
        className="flex h-9 w-9 items-center justify-center text-lg text-primary transition hover:bg-cream/80 disabled:opacity-50"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="flex min-w-[2rem] items-center justify-center text-sm font-bold tabular-nums text-primary">
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => onUpdate(item.product_id, item.quantity + 1)}
        disabled={loading}
        className="flex h-9 w-9 items-center justify-center text-lg text-primary transition hover:bg-cream/80 disabled:opacity-50"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );

  const priceBlock = (
    <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
      <span className="font-bold tabular-nums text-primary">{formatPrice(item.price)}</span>
      {hasSale ? (
        <>
          <span className="text-xs text-muted line-through">{formatPrice(compare)}</span>
          {offPct > 0 ? (
            <span className="text-xs font-semibold text-success">{offPct}% off</span>
          ) : null}
        </>
      ) : null}
    </div>
  );

  return (
    <article className="cart-line-card">
      {(item.is_bestseller || item.badge) && (
        <div className="cart-line-card__badges">
          {item.is_bestseller ? <span className="cart-line-card__bestseller-tag">Bestseller</span> : null}
          {item.badge && item.badge !== 'BESTSELLER' ? (
            <span className={cn(PRODUCT_BADGE_CHIP, getBadgeClass(item.badge), '!text-[0.65rem]')}>
              {item.badge}
            </span>
          ) : null}
        </div>
      )}

      <div className="cart-line-row cart-line-card__body md:grid md:grid-cols-[minmax(0,1fr)_5.5rem_7.5rem_5.5rem] md:items-center md:gap-4">
        <div className="flex min-w-0 gap-3 md:gap-4">
          <Link
            to={`/product/${item.slug}`}
            className="cart-line-card__image-wrap group shrink-0"
          >
            <img src={getCartItemImage(item)} alt="" className="max-h-full max-w-full object-contain" />
            <span className="cart-line-card__zoom" aria-hidden>
              <svg className="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <circle cx="11" cy="11" r="7" />
                <path d="M21 21l-4.35-4.35" />
              </svg>
              View
            </span>
          </Link>

          <div className="min-w-0 flex-1">
            <Link
              to={`/product/${item.slug}`}
              className="line-clamp-2 font-heading text-sm font-semibold leading-snug text-primary hover:text-secondary sm:text-base"
            >
              {shortName}
            </Link>
            {variant ? <p className="mt-0.5 text-xs text-muted sm:text-sm">{variant}</p> : null}

            {showRatings && item.rating > 0 ? (
              <div className="mt-2 flex flex-wrap items-center gap-2">
                <span className="inline-flex items-center gap-1 rounded bg-success/15 px-1.5 py-0.5 text-xs font-semibold text-primary">
                  <StarRating rating={item.rating} size="sm" />
                  <span>{item.rating}</span>
                </span>
                {item.review_count > 0 ? (
                  <span className="text-xs text-muted">({formatReviewCount(item.review_count)})</span>
                ) : null}
              </div>
            ) : null}

            <div className="mt-2 md:hidden">{priceBlock}</div>
            <p className="mt-2 text-xs font-medium text-primary/85 sm:text-sm">{deliveryLabel}</p>
          </div>
        </div>

        <div className="hidden text-center md:block">{priceBlock}</div>

        <div className="mt-3 flex items-center justify-between gap-3 md:mt-0 md:contents">
          <div className="md:flex md:justify-center">{qtyPill}</div>
          <p className="text-base font-bold tabular-nums text-secondary md:text-right">{formatPrice(lineTotal)}</p>
        </div>
      </div>

      <div className="cart-line-card__actions">
        <button
          type="button"
          onClick={() => onMoveToWishlist(item)}
          disabled={loading}
          className="cart-line-card__action"
        >
          <HeartIcon />
          <span className="sm:hidden">Wishlist</span>
          <span className="hidden sm:inline">Move to wishlist</span>
        </button>
        <button
          type="button"
          onClick={() => onRemove(item.product_id)}
          disabled={loading}
          className="cart-line-card__action"
        >
          <TrashIcon />
          Remove
        </button>
        <button
          type="button"
          disabled
          aria-disabled="true"
          className="cart-line-card__action cursor-not-allowed opacity-55"
          title="Coming soon"
        >
          <ClockIcon />
          <span className="sm:hidden">Soon</span>
          <span className="hidden sm:inline">Coming soon</span>
        </button>
      </div>
    </article>
  );
}

function HeartIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path
        d="M20.84 4.61a5.5 5.5 0 00-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 00-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 000-7.78z"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  );
}

function TrashIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 opacity-70" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M3 6h18M8 6V4h8v2M19 6l-1 14H6L5 6" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg className="h-4 w-4 shrink-0 opacity-80" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <circle cx="12" cy="12" r="9" />
      <path d="M12 7v5l3 2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
