import StarRating from '../../ui/StarRating';
import { cn } from '../../../lib/cn';
import {
  formatPrice,
  getBadgeClass,
  getDiscountPercent,
  PRODUCT_BADGE_CHIP,
  shouldShowProductRatings,
  shouldShowSaleTags,
} from '../../../utils/helpers';

export default function ProductInfoSection({
  product,
  selectedOption,
  className,
  showBadgeOnImage = false,
}) {
  const price = selectedOption?.price ?? product.price;
  const compare = selectedOption?.compare_at_price ?? product.compare_at_price;
  const showSale = shouldShowSaleTags();
  const showRatings = shouldShowProductRatings();
  const discountPct = showSale ? getDiscountPercent({ price, compare_at_price: compare }) : 0;
  const tags = (product.tags || []).slice(0, 4);

  return (
    <section className={cn('product-detail-info', className)}>
      {product.badge && !showBadgeOnImage && (
        <span className={cn('mb-1.5', PRODUCT_BADGE_CHIP, getBadgeClass(product.badge))}>
          {product.badge}
        </span>
      )}

      <h1 className="font-heading text-lg font-semibold leading-snug text-primary sm:text-xl lg:text-2xl">
        {product.name}
      </h1>

      {showRatings && product.rating > 0 && (
        <div className="product-detail-rating mt-2 flex flex-wrap items-center gap-1.5 text-sm text-muted">
          <StarRating rating={product.rating} total={5} size="sm" />
          <span className="font-semibold text-primary">{product.rating}</span>
          <span className="text-muted">({product.review_count})</span>
        </div>
      )}

      <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-1">
        <span className="product-detail-price text-2xl font-bold text-primary">{formatPrice(price)}</span>
        {showSale && compare && Number(compare) > Number(price) ? (
          <span className="text-base font-medium text-muted line-through decoration-sage/80">
            {formatPrice(compare)}
          </span>
        ) : null}
        {selectedOption ? (
          <span className="text-sm font-medium text-muted">{selectedOption.grams}g</span>
        ) : null}
        {discountPct > 0 ? (
          <span className="rounded bg-success/15 px-1.5 py-0.5 text-xs font-bold text-success">
            {discountPct}% OFF
          </span>
        ) : null}
      </div>

      {product.short_description ? (
        <p className="mt-2 text-sm leading-snug text-muted">{product.short_description}</p>
      ) : null}

      {tags.length > 0 ? (
        <div className="mt-3 inline-flex max-w-full flex-wrap gap-1.5 rounded-lg bg-secondary/8 px-2 py-1.5">
          {tags.map((tag) => (
            <span
              key={tag}
              className="inline-flex shrink-0 rounded-md border border-sage/35 bg-white/80 px-2 py-0.5 text-[0.6875rem] font-semibold leading-snug text-primary"
            >
              {tag}
            </span>
          ))}
        </div>
      ) : null}
    </section>
  );
}
