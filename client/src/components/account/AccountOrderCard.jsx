import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { formatPrice } from '../../utils/helpers';
import { getCartItemImage } from '../../data/productImages';
import { cn } from '../../lib/cn';
import StarRating from '../ui/StarRating';
import { shouldShowProductRatings } from '../../utils/helpers';
import CompactOrderTrackStepper from '../orders/CompactOrderTrackStepper';
import { buildOrderTrackingSteps } from '../../utils/orderTracking';
import { STORE_SETTINGS } from '../../config/storeSettings';
import { downloadOrderInvoicePdf } from '../../utils/orderInvoicePdf';
import {
  formatOrderDate,
  formatOrderPlacedLabel,
  formatItemWeight,
  formatProductName,
  getCatalogProductForLineItem,
  getOrderStatusMeta,
  isOrderDelivered,
  loadOrderRating,
  orderPaymentFooterText,
  saveOrderRating,
} from './accountOrderHelpers';

function OrderRatingPicker({ orderId }) {
  const [rating, setRating] = useState(() => loadOrderRating(orderId));

  return (
    <div className="flex items-center gap-0.5" role="group" aria-label="Rate order">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => {
            setRating(star);
            saveOrderRating(orderId, star);
          }}
          className="rounded p-0.5 text-base leading-none text-sage/65 transition hover:text-mango"
          aria-label={`${star} stars`}
        >
          <span className={star <= rating ? 'text-mango' : ''}>★</span>
        </button>
      ))}
    </div>
  );
}

function LineStatusBadge({ variant, label }) {
  return (
    <span
      className={cn(
        'account-order-line-badge inline-block rounded-full px-2.5 py-1 text-[0.6875rem] font-semibold leading-tight',
        variant === 'transit' && 'bg-mango/25 text-primary',
        variant === 'success' && 'bg-secondary/15 text-secondary',
        variant === 'ready' && 'bg-sage/90 text-primary'
      )}
    >
      {label}
    </span>
  );
}

function OrderLineRow({ item, order }) {
  const statusMeta = getOrderStatusMeta(order.status);
  const deliveryDate = formatOrderDate(order.estimated_delivery || order.created_at);
  const lineTotal = (item.price || 0) * (item.quantity || 1);

  return (
    <li className="account-order-line grid gap-4 border-b border-sage/30 py-4 last:border-b-0 md:grid-cols-[minmax(0,1fr)_5rem_7.5rem_8.5rem] md:items-center">
      <div className="flex min-w-0 gap-3 sm:gap-4">
        <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-lg border border-sage/35 bg-cream p-1.5 sm:h-[4.5rem] sm:w-[4.5rem]">
          <img src={getCartItemImage(item)} alt="" className="max-h-full max-w-full object-contain" />
        </div>
        <div className="min-w-0 flex-1">
          <p className="font-semibold leading-snug text-primary">{formatProductName(item.name)}</p>
          <p className="mt-0.5 text-sm text-muted">By: {item.category_name || 'NaturePure Fresh'}</p>
          <p className="mt-2 flex flex-wrap items-center gap-2 text-xs text-primary/80">
            <span>
              Size <span className="font-semibold text-primary">{formatItemWeight(item)}</span>
            </span>
            <span className="h-3 w-px bg-sage/60" aria-hidden />
            <span>
              Qty <span className="font-semibold text-primary">{item.quantity || 1}</span>
            </span>
          </p>
        </div>
      </div>

      <div className="hidden md:block">
        <p className="text-[0.625rem] font-medium uppercase tracking-wide text-muted">Price</p>
        <p className="mt-1 text-sm font-bold tabular-nums text-primary-light">{formatPrice(lineTotal)}</p>
      </div>

      <div className="flex flex-wrap items-end justify-between gap-3 md:block">
        <div className="md:hidden">
          <p className="text-[0.625rem] font-medium uppercase tracking-wide text-muted">Price</p>
          <p className="mt-0.5 text-sm font-bold tabular-nums text-primary-light">{formatPrice(lineTotal)}</p>
        </div>
        <div>
          <p className="text-[0.625rem] font-medium uppercase tracking-wide text-muted">Status</p>
          <div className="mt-1">
            <LineStatusBadge variant={statusMeta.lineVariant} label={statusMeta.lineLabel} />
          </div>
        </div>
      </div>

      <div>
        <p className="text-[0.625rem] font-medium uppercase tracking-wide text-muted">Expected delivery</p>
        <p className="mt-1 text-sm font-semibold text-success">{deliveryDate}</p>
      </div>
    </li>
  );
}

function OrderProductDetailCard({ item }) {
  const catalog = getCatalogProductForLineItem(item);
  const slug = item.slug || catalog?.slug;
  const qty = item.quantity || 1;
  const unitPrice = item.price || 0;
  const description =
    catalog?.short_description ||
    catalog?.description ||
    '100% natural freeze-dried fruit — no added sugar or preservatives.';
  const tags = catalog?.tags?.slice(0, 4) || [];

  return (
    <article className="flex flex-col gap-4 rounded-xl border border-sage/40 bg-white p-4 sm:flex-row sm:items-start">
      <div className="flex h-24 w-24 shrink-0 items-center justify-center rounded-lg border border-sage/35 bg-cream p-2 sm:h-28 sm:w-28">
        <img src={getCartItemImage(item)} alt="" className="max-h-full max-w-full object-contain" />
      </div>
      <div className="min-w-0 flex-1">
        <h5 className="font-heading text-base font-semibold text-primary">{formatProductName(item.name)}</h5>
        <p className="mt-1 text-sm leading-relaxed text-primary/80">{description}</p>
        {tags.length > 0 && (
          <ul className="mt-2 flex flex-wrap gap-1.5">
            {tags.map((tag) => (
              <li
                key={tag}
                className="rounded-full bg-sage/70 px-2 py-0.5 text-[0.6875rem] font-semibold text-primary"
              >
                {tag}
              </li>
            ))}
          </ul>
        )}
        <dl className="mt-3 grid grid-cols-2 gap-x-4 gap-y-1 text-xs sm:grid-cols-4">
          <div>
            <dt className="text-muted">Category</dt>
            <dd className="font-semibold text-primary">{item.category_name || catalog?.category_name || '—'}</dd>
          </div>
          <div>
            <dt className="text-muted">Size</dt>
            <dd className="font-semibold text-primary">{formatItemWeight(item)}</dd>
          </div>
          <div>
            <dt className="text-muted">Quantity</dt>
            <dd className="font-semibold text-primary">{qty}</dd>
          </div>
          <div>
            <dt className="text-muted">Line total</dt>
            <dd className="font-semibold text-primary-light">{formatPrice(unitPrice * qty)}</dd>
          </div>
        </dl>
        {slug ? (
          <Link
            to={`/product/${slug}`}
            className="mt-3 inline-flex text-sm font-semibold text-secondary hover:text-primary hover:underline"
          >
            View full product page →
          </Link>
        ) : null}
      </div>
    </article>
  );
}

export default function AccountOrderCard({ order, highlightActive = false }) {
  const [detailsOpen, setDetailsOpen] = useState(false);
  const statusMeta = getOrderStatusMeta(order.status);
  const items = order.items || [];
  const ship = order.shipping_address || {};
  const trackingSteps = useMemo(() => buildOrderTrackingSteps(order), [order]);
  const delivered = isOrderDelivered(order);
  const placedLabel = formatOrderPlacedLabel(order.created_at);

  const showInvoice = STORE_SETTINGS.showDownloadInvoice !== false;

  return (
    <article
      className={cn(
        'account-order-card relative overflow-hidden rounded-xl border border-sage/40 bg-white',
        highlightActive && 'account-order-card--active'
      )}
    >
      <header className="flex flex-col gap-4 border-b border-sage/30 px-4 py-4 sm:flex-row sm:items-start sm:justify-between sm:px-5 sm:py-5">
        <div className="min-w-0 text-sm">
          <p className="text-muted">
            Order Id: <span className="font-semibold text-primary-light">#{order.id}</span>
          </p>
          <p className="mt-1 text-muted">
            Order placed: <span className="font-medium text-primary/85">{placedLabel}</span>
          </p>
        </div>

        <div className="account-order-card__header-actions flex flex-wrap gap-2 sm:justify-end">
          {statusMeta.canTrack ? (
            <Link
              to={`/track-order/${order.id}`}
              state={{ returnTo: '/account' }}
              className="account-order-card__pill account-order-card__pill--primary"
            >
              Track
            </Link>
          ) : (
            <Link to="/shop" className="account-order-card__pill account-order-card__pill--primary">
              Shop again
            </Link>
          )}
          {showInvoice ? (
            <button
              type="button"
              onClick={() => downloadOrderInvoicePdf(order, formatPrice)}
              className="account-order-card__pill account-order-card__pill--soft"
            >
              Download invoice
            </button>
          ) : null}
          <button
            type="button"
            onClick={() => setDetailsOpen((v) => !v)}
            className={cn(
              'account-order-card__pill account-order-card__pill--outline',
              detailsOpen && 'is-active'
            )}
            aria-expanded={detailsOpen}
          >
            Details
          </button>
        </div>
      </header>

      <ul className="px-4 sm:px-5">
        {items.map((item) => (
          <OrderLineRow key={item.id || item.product_id} item={item} order={order} />
        ))}
      </ul>

      <footer className="flex flex-col gap-3 border-t border-sage/30 px-4 py-4 text-sm sm:flex-row sm:items-center sm:justify-between sm:px-5 sm:py-4">
        {!delivered ? (
          <button
            type="button"
            disabled
            className="inline-flex items-center gap-1.5 self-start font-medium text-muted opacity-60"
            title="Cancellation is not available for this demo order"
          >
            <span className="text-base leading-none" aria-hidden>×</span>
            Cancel order
          </button>
        ) : (
          <Link to="/shop" className="inline-flex items-center gap-1.5 self-start font-semibold text-primary hover:underline">
            Order again
          </Link>
        )}
        <p className="text-center text-muted sm:flex-1 sm:px-4">{orderPaymentFooterText(order)}</p>
        <p className="self-end text-right sm:self-center">
          <span className="text-muted">Total price: </span>
          <span className="text-base font-bold tabular-nums text-primary-light">{formatPrice(order.total)}</span>
        </p>
      </footer>

      {detailsOpen && (
        <div className="account-order-card__details border-t border-sage/30 bg-cream/50 px-4 py-4 sm:px-5 sm:py-5">
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <h4 className="font-heading text-base font-semibold text-primary">Product details</h4>
            {showInvoice ? (
              <button
                type="button"
                onClick={() => downloadOrderInvoicePdf(order, formatPrice)}
                className="neo-btn px-5 py-2 text-sm font-semibold"
              >
                Download invoice (PDF)
              </button>
            ) : null}
          </div>

          <div className="mt-4 space-y-3">
            {items.map((item) => (
              <OrderProductDetailCard key={item.id || item.product_id} item={item} />
            ))}
          </div>

          <div className="mt-5">
            <h4 className="text-xs font-bold uppercase tracking-wide text-muted">Delivery progress</h4>
            <div className="mt-3 rounded-xl border border-sage/35 bg-white p-3 sm:p-4">
              <CompactOrderTrackStepper steps={trackingSteps} />
            </div>
          </div>

          <div className="mt-4 grid gap-4 text-sm sm:grid-cols-2">
            <div className="rounded-xl border border-sage/35 bg-white p-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted">Shipping address</h4>
              <p className="mt-2 leading-relaxed text-primary/85">
                {[ship.name, ship.address, [ship.city, ship.state, ship.pincode].filter(Boolean).join(', ')]
                  .filter(Boolean)
                  .join(', ')}
              </p>
            </div>
            <div className="rounded-xl border border-sage/35 bg-white p-3.5">
              <h4 className="text-xs font-bold uppercase tracking-wide text-muted">Order summary</h4>
              <p className="mt-2 text-primary/85">
                Subtotal {formatPrice(order.subtotal ?? order.total)} · Shipping{' '}
                {formatPrice(order.shipping ?? 0)}
              </p>
              <p className="mt-1 text-xs text-muted">Placed {formatOrderDate(order.created_at)}</p>
            </div>
          </div>

          {delivered && (
            <div className="mt-4 flex flex-wrap items-center justify-between gap-2 border-t border-sage/25 pt-3">
              <span className="text-xs font-medium text-muted">Rate this order</span>
              <OrderRatingPicker orderId={order.id} />
            </div>
          )}
          {shouldShowProductRatings() && items.some((item) => item.rating > 0) && (
            <div className="mt-2 flex items-center gap-2">
              <span className="text-xs text-muted">Product rating</span>
              <StarRating rating={items.find((i) => i.rating > 0)?.rating || 0} size="sm" />
            </div>
          )}
        </div>
      )}
    </article>
  );
}
