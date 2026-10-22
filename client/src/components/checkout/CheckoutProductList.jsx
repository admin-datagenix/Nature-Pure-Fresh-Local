import { Link } from 'react-router-dom';
import StarRating from '../ui/StarRating';
import {
  formatPrice,
  getDiscountPercent,
  shouldShowProductRatings,
  shouldShowSaleTags,
} from '../../utils/helpers';
import { getCartItemImage } from '../../data/productImages';
import { cn } from '../../lib/cn';

function CheckoutQtyPill({ item, loading, onUpdate }) {
  return (
    <div className="cart-line-qty-pill inline-flex items-center">
      <button
        type="button"
        onClick={() => onUpdate(item.product_id, item.quantity - 1)}
        disabled={loading}
        className="flex h-8 w-8 items-center justify-center text-base text-primary transition hover:bg-cream/80 disabled:opacity-50 sm:h-9 sm:w-9 sm:text-lg"
        aria-label="Decrease quantity"
      >
        −
      </button>
      <span className="flex min-w-[1.75rem] items-center justify-center text-sm font-bold tabular-nums text-primary sm:min-w-[2rem]">
        {item.quantity}
      </span>
      <button
        type="button"
        onClick={() => onUpdate(item.product_id, item.quantity + 1)}
        disabled={loading}
        className="flex h-8 w-8 items-center justify-center text-base text-primary transition hover:bg-cream/80 disabled:opacity-50 sm:h-9 sm:w-9 sm:text-lg"
        aria-label="Increase quantity"
      >
        +
      </button>
    </div>
  );
}

export default function CheckoutProductList({ cart, className, onUpdate, loading = false }) {
  const showSale = shouldShowSaleTags();
  const showRatings = shouldShowProductRatings();

  return (
    <section
      className={cn('checkout-product-list neo-card overflow-hidden p-0 lg:flex lg:flex-col', className)}
    >
      <div className="border-b border-sage/30 px-4 py-2.5 sm:px-5 sm:py-3">
        <h2 className="text-sm font-semibold text-primary sm:text-base">
          Order items ({cart.items.length})
        </h2>
      </div>
      <ul className="divide-y divide-sage/30 lg:flex-1">
        {cart.items.map((item) => {
          const shortName = item.name.replace(/^Freeze Dried /i, '');
          const lineTotal = item.line_total ?? item.price * item.quantity;
          const compare = Number(item.compare_at_price);
          const hasSale = showSale && compare > item.price;
          const offPct = hasSale ? getDiscountPercent({ price: item.price, compare_at_price: compare }) : 0;
          const variant = [item.weight_grams ? `${item.weight_grams}g` : null, item.category_name]
            .filter(Boolean)
            .join(' · ');

          return (
            <li
              key={item.product_id}
              className="grid grid-cols-[auto_minmax(0,1fr)_auto] grid-rows-[auto_auto] items-start gap-x-3 gap-y-2.5 px-4 py-3 sm:grid-cols-[auto_minmax(0,1fr)_auto_auto] sm:grid-rows-1 sm:items-center sm:gap-x-4 sm:px-5 sm:py-4"
            >
              <Link
                to={`/product/${item.slug}`}
                className="row-span-2 flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-md border border-sage/30 bg-cream/40 p-1 sm:row-span-1 sm:h-[4.5rem] sm:w-[4.5rem]"
              >
                <img src={getCartItemImage(item)} alt="" className="max-h-full max-w-full object-contain" />
              </Link>
              <div className="min-w-0 col-start-2 row-start-1">
                <Link
                  to={`/product/${item.slug}`}
                  className="line-clamp-2 text-sm font-semibold leading-snug text-primary hover:text-secondary"
                >
                  {shortName}
                </Link>
                {variant ? <p className="mt-0.5 text-[0.65rem] text-muted sm:text-xs">{variant}</p> : null}
                {showRatings && item.rating > 0 ? (
                  <div className="mt-1 flex items-center gap-1 text-[0.65rem] text-muted sm:text-xs">
                    <StarRating rating={item.rating} size="sm" />
                    <span>{item.rating}</span>
                    {item.review_count > 0 ? <span>({item.review_count})</span> : null}
                  </div>
                ) : null}
                <div className="mt-1 flex flex-wrap items-baseline gap-x-2 gap-y-0 text-xs sm:text-sm">
                  <span className="font-bold tabular-nums text-primary">{formatPrice(item.price)}</span>
                  {hasSale ? (
                    <>
                      <span className="text-[0.65rem] text-muted line-through sm:text-xs">{formatPrice(compare)}</span>
                      {offPct > 0 ? (
                        <span className="text-[0.65rem] font-semibold text-success sm:text-xs">{offPct}% off</span>
                      ) : null}
                    </>
                  ) : null}
                </div>
              </div>

              {onUpdate ? (
                <div
                  className="col-span-2 col-start-2 row-start-2 flex flex-col items-center justify-center sm:col-span-1 sm:col-start-3 sm:row-start-1 sm:px-4 md:px-10"
                >
                  <span className="mb-1 text-[0.6rem] font-semibold uppercase tracking-wide text-muted sm:text-[0.65rem]">
                    Qty
                  </span>
                  <CheckoutQtyPill item={item} loading={loading} onUpdate={onUpdate} />
                </div>
              ) : null}

              <p
                className={cn(
                  'col-start-3 row-start-1 self-center text-right text-sm font-bold tabular-nums text-secondary sm:col-start-4 sm:text-base',
                )}
              >
                {formatPrice(lineTotal)}
              </p>
            </li>
          );
        })}
      </ul>
      <p className="mt-auto border-t border-sage/30 px-4 py-2.5 text-xs text-muted sm:px-5 sm:py-3">
        <Link to="/cart" className="font-medium text-secondary hover:underline">Edit cart</Link>
      </p>
    </section>
  );
}
