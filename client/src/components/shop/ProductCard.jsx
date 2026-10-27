import { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  formatPrice,
  getDiscountPercent,
  getBadgeClass,
  PRODUCT_BADGE_CHIP,
  shouldShowProductRatings,
  shouldShowSaleTags,
} from '../../utils/helpers';
import { getProductCardTone, PRODUCT_CARD_WIDTH } from '../../utils/productLayout';
import { getProductImage } from '../../data/productImages';
import { useCart } from '../../context/CartContext';
import { useAuthGate } from '../../hooks/useAuthGate';
import { cn } from '../../lib/cn';
import StarRating from '../ui/StarRating';
import { CartIcon, CheckIcon } from '../ui/CommerceIcons';
import WishlistButton from '../wishlist/WishlistButton';
import {
  isOutOfStock,
  lowStockLabel,
  outOfStockCardClass,
  shouldShowLowStockBadge,
  shouldShowOutOfStockBadge,
} from '../../utils/stockDisplay';
import { buildFlyPayload } from '../../utils/flyToCart';
export default function ProductCard({
  product,
  className,
  compact = false,
  selected = false,
  onSelect,
  layout = 'grid',
}) {
  const { requireAuth } = useAuthGate();
  const { cart, addItem, updateItem, loading } = useCart();
  const cartLine = cart.items.find((i) => i.product_id === product.id);
  const cartQty = cartLine?.quantity ?? 0;
  const [added, setAdded] = useState(false);
  const imageRef = useRef(null);
  const imageWrapRef = useRef(null);
  const outOfStock = isOutOfStock(product);

  const handleAdd = async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock) return;
    if (!requireAuth('cart')) return;
    const fly = buildFlyPayload({
      imageSrc: getProductImage(product),
      sourceElement: imageRef.current ?? imageWrapRef.current ?? e.currentTarget,
      event: e,
    });
    try {
      await addItem(product.id, 1, fly ? { fly, slug: product.slug } : { slug: product.slug });
      setAdded(true);
      setTimeout(() => setAdded(false), 1200);
    } catch {
      /* CartContext shows error toast */
    }
  };

  const handleQtyChange = (e, nextQty) => {
    e.preventDefault();
    e.stopPropagation();
    if (outOfStock || loading) return;
    if (!requireAuth('cart')) return;
    if (nextQty <= 0) updateItem(product.id, 0);
    else if (cartQty > 0) updateItem(product.id, nextQty);
    else addItem(product.id, nextQty, { slug: product.slug });
  };

  const shortName = product.name.replace(/^Freeze Dried /i, '');
  const showSale = shouldShowSaleTags();
  const showRatings = shouldShowProductRatings();
  const discount = showSale ? getDiscountPercent(product) : 0;
  const imageSrc = getProductImage(product);
  const powderCardArt = decodeURIComponent(imageSrc || '').includes('-powder-card.png');
  const isList = layout === 'list';

  return (
    <article
      className={cn(
        'product-card-interactive group flex h-full min-w-0 overflow-hidden rounded-2xl border border-sage/55 bg-white',
        isList ? 'flex-row items-stretch' : 'flex-col',
        'shadow-[0_6px_20px_rgba(41,70,51,0.05)]',
        selected && 'border-primary/35 ring-1 ring-primary/15',
        outOfStockCardClass(product),
        compact && PRODUCT_CARD_WIDTH,
        className
      )}
      onClick={() => onSelect?.(product.id)}
    >
      <div
        className={cn(
          'relative shrink-0',
          isList ? 'w-[34%] max-w-[148px] p-2.5 sm:max-w-[168px]' : 'p-2.5 pb-0 sm:p-3 sm:pb-0'
        )}
      >
        <Link
          to={`/product/${product.slug}`}
          className="block"
          onClick={(e) => e.stopPropagation()}
        >
          <div
            ref={imageWrapRef}
            className={cn(
              'product-card__media relative overflow-hidden rounded-xl border border-sage/40',
              isList ? 'aspect-square h-full min-h-[112px]' : 'aspect-square w-full',
              selected ? 'border-primary/50' : 'group-hover:border-secondary/70'
            )}
            style={{ backgroundColor: getProductCardTone(product) }}
          >
            <div className="pointer-events-none absolute inset-[26%] rounded-full bg-white/15 blur-lg opacity-70" />

            {product.badge && (
              <span
                className={cn(
                  'absolute left-2 top-2 z-10 shadow-sm',
                  PRODUCT_BADGE_CHIP,
                  getBadgeClass(product.badge)
                )}
              >
                {product.badge}
              </span>
            )}
            {discount > 0 && (
              <span className="label-chip absolute right-2 top-2 z-10 bg-white/95 px-2 py-0.5 text-[0.58rem] font-bold text-strawberry shadow-sm">
                −{discount}%
              </span>
            )}
            {shouldShowLowStockBadge(product) && (
              <span className="label-chip absolute bottom-2 left-2 z-10 bg-strawberry px-2 py-0.5 text-[0.58rem] font-bold uppercase tracking-wide text-white shadow-sm">
                {lowStockLabel(product)}
              </span>
            )}
            <div className="absolute inset-0 flex items-center justify-center overflow-hidden">
              <img
                ref={imageRef}
                src={imageSrc}
                alt={product.name}
                loading="lazy"
                decoding="async"
                className={cn(
                  'product-card__image object-contain',
                  powderCardArt && 'product-card__image--powder-card-art',
                  isList && 'product-card__image--list',
                  selected && 'product-card__image--selected',
                  outOfStock && 'opacity-85 saturate-[0.65]'
                )}
              />
            </div>

            {outOfStock && shouldShowOutOfStockBadge(product) && (
              <div
                className="pointer-events-none absolute inset-0 z-[18] flex items-center justify-center rounded-xl bg-cream/55"
                aria-hidden
              >
                <span className="rounded-sm border border-white/90 bg-primary px-3 py-1.5 text-center text-[0.65rem] font-bold uppercase leading-snug tracking-wider text-white shadow-[0_4px_14px_rgba(41,70,51,0.28)] sm:text-[0.7rem]">
                  Out of stock
                </span>
              </div>
            )}
          </div>
        </Link>

        <div
          className={cn(
            'absolute z-20',
            isList ? 'bottom-5 right-5' : 'bottom-5 right-5'
          )}
        >
          <WishlistButton
            productId={product.id}
            productSlug={product.slug}
            productName={product.name}
            imageSrc={imageSrc}
            flySourceRef={imageRef}
          />
        </div>
      </div>

      <div
        className={cn(
          'flex min-w-0 flex-1 flex-col',
          isList ? 'justify-center py-3 pr-3 pl-0' : 'px-3 pb-3 pt-2'
        )}
      >
        <Link
          to={`/product/${product.slug}`}
          className="block min-w-0 flex-1"
          onClick={(e) => e.stopPropagation()}
        >
          <h3 className="line-clamp-2 font-heading text-[0.95rem] font-semibold leading-snug text-primary transition group-hover:text-secondary sm:text-base">
            {shortName}
          </h3>

          {isList && product.short_description && (
            <p className="mt-1.5 line-clamp-2 text-xs leading-relaxed text-muted">
              {product.short_description}
            </p>
          )}

          <div className="mt-2 flex flex-wrap items-center gap-x-2 gap-y-1">
            {showRatings && product.rating > 0 && (
              <p className="flex items-center gap-1 text-[0.7rem] text-muted">
                <StarRating rating={product.rating} size="sm" />
                <span className="font-medium text-primary/80">{product.rating}</span>
                {product.review_count > 0 && <span>({product.review_count})</span>}
              </p>
            )}
            {product.weight_grams && (
              <span className="label-chip border border-sage/45 bg-cream-dark/80 px-2 py-0.5 text-[0.65rem] font-medium text-muted">
                {product.weight_grams}g
              </span>
            )}
          </div>
        </Link>

        <div className="mt-2.5 flex items-center gap-2">
          <div className="min-w-0 flex-1">
            <div className="flex flex-wrap items-baseline gap-1.5">
              <span className="font-heading text-lg font-bold text-primary">{formatPrice(product.price)}</span>
              {discount > 0 && (
                <span className="text-xs text-muted line-through">{formatPrice(product.compare_at_price)}</span>
              )}
            </div>
          </div>
          {cartQty > 0 ? (
              <div
                className="neo-qty !h-9 shrink-0 !rounded-full sm:!h-10"
                onClick={(e) => e.stopPropagation()}
              >
                <button
                  type="button"
                  onClick={(e) => handleQtyChange(e, cartQty - 1)}
                  disabled={loading}
                  className="flex h-9 w-8 items-center justify-center text-primary sm:h-10 sm:w-9"
                  aria-label="Decrease quantity"
                >
                  −
                </button>
                <span className="flex w-7 items-center justify-center text-sm font-bold text-primary sm:w-8">
                  {cartQty}
                </span>
                <button
                  type="button"
                  onClick={(e) => handleQtyChange(e, cartQty + 1)}
                  disabled={loading}
                  className="flex h-9 w-8 items-center justify-center text-primary sm:h-10 sm:w-9"
                  aria-label="Increase quantity"
                >
                  +
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={handleAdd}
                disabled={loading || outOfStock}
                aria-label={`Add ${shortName} to cart`}
                style={!added ? { backgroundColor: getProductCardTone(product) } : undefined}
                className={cn(
                  'flex h-9 w-9 shrink-0 items-center justify-center rounded-full transition duration-200 sm:h-10 sm:w-10',
                  added
                    ? 'bg-success text-white shadow-[0_6px_14px_rgba(74,124,89,0.22)]'
                    : 'border border-sage/55 text-primary shadow-[0_2px_8px_rgba(41,70,51,0.06)] hover:border-primary hover:bg-primary hover:text-white',
                  outOfStock && 'cursor-not-allowed opacity-40 hover:border-sage/55 hover:bg-transparent hover:text-primary'
                )}
              >
                {added ? <CheckIcon className="h-4 w-4 sm:h-5 sm:w-5" /> : <CartIcon className="h-4 w-4 sm:h-5 sm:w-5" />}
              </button>
            )}
        </div>
      </div>
    </article>
  );
}

export function ProductCardSkeleton({ className, compact = false }) {
  return (
    <div
      className={cn(
        'animate-pulse overflow-hidden rounded-2xl border border-sage/55 bg-white shadow-[0_6px_20px_rgba(41,70,51,0.04)]',
        compact && PRODUCT_CARD_WIDTH,
        className
      )}
    >
      <div className="p-3 pb-0">
        <div className="aspect-square rounded-xl border border-sage/40 bg-cream-dark" />
      </div>
      <div className="space-y-2 px-3 pb-3 pt-2">
        <div className="h-4 w-4/5 rounded-full bg-sage/40" />
        <div className="h-3 w-1/2 rounded-full bg-sage/35" />
        <div className="flex items-center justify-between pt-1">
          <div className="h-5 w-14 rounded-full bg-sage/40" />
          <div className="h-9 w-9 rounded-full bg-sage/35" />
        </div>
      </div>
    </div>
  );
}
