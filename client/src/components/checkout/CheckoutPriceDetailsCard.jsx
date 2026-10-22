import { useState } from 'react';
import { formatPrice } from '../../utils/helpers';
import { computeCartPriceBreakdown } from '../../utils/cartPriceBreakdown';

function Chevron({ open }) {
  return (
    <svg
      className={`h-3.5 w-3.5 shrink-0 transition ${open ? 'rotate-180' : ''}`}
      viewBox="0 0 20 20"
      fill="currentColor"
      aria-hidden
    >
      <path
        fillRule="evenodd"
        d="M5.23 7.21a.75.75 0 011.06.02L10 10.94l3.71-3.71a.75.75 0 111.06 1.06l-4.24 4.25a.75.75 0 01-1.06 0L5.21 8.29a.75.75 0 01.02-1.08z"
        clipRule="evenodd"
      />
    </svg>
  );
}

export default function CheckoutPriceDetailsCard({
  cart,
  shippingCost,
  couponDiscount = 0,
  promoCode,
}) {
  const [feesOpen, setFeesOpen] = useState(false);
  const [discountsOpen, setDiscountsOpen] = useState(true);

  const { mrpTotal, saleDiscount, couponDiscount: coupon, totalDiscount } = computeCartPriceBreakdown(
    cart,
    couponDiscount
  );
  const orderTotal = Math.max(0, cart.subtotal + shippingCost - coupon);

  return (
    <section className="checkout-price-card neo-card sticky top-[108px] h-fit overflow-hidden p-0">
      <h2 className="border-b border-sage/30 px-4 py-2.5 text-sm font-semibold text-primary sm:px-5 sm:py-3 sm:text-base">
        Price details
      </h2>

      <div className="space-y-2.5 px-4 py-3 text-xs sm:space-y-3 sm:px-5 sm:py-4 sm:text-sm">
        <div className="flex justify-between gap-3 text-primary">
          <span className="text-muted">MRP (incl. taxes)</span>
          <span className="font-medium tabular-nums">{formatPrice(mrpTotal)}</span>
        </div>

        <button
          type="button"
          onClick={() => setFeesOpen((v) => !v)}
          className="flex w-full items-center justify-between gap-2 text-left text-muted"
        >
          <span className="inline-flex items-center gap-0.5">
            Fees
            <Chevron open={feesOpen} />
          </span>
          <span className="font-medium tabular-nums text-primary">
            {shippingCost === 0 ? formatPrice(0) : formatPrice(shippingCost)}
          </span>
        </button>
        {feesOpen ? (
          <div className="rounded-md bg-cream/60 px-2.5 py-1.5 text-[0.65rem] text-muted sm:text-xs">
            <div className="flex justify-between">
              <span>Delivery fee</span>
              <span className={shippingCost === 0 ? 'font-medium text-success' : ''}>
                {shippingCost === 0 ? 'FREE' : formatPrice(shippingCost)}
              </span>
            </div>
          </div>
        ) : null}

        {totalDiscount > 0 ? (
          <>
            <div className="border-t border-dashed border-sage/45" />
            <button
              type="button"
              onClick={() => setDiscountsOpen((v) => !v)}
              className="flex w-full items-center justify-between gap-2 text-left"
            >
              <span className="inline-flex items-center gap-0.5 text-muted">
                Discounts
                <Chevron open={discountsOpen} />
              </span>
              <span className="font-semibold tabular-nums text-success">− {formatPrice(totalDiscount)}</span>
            </button>
            {discountsOpen ? (
              <div className="space-y-1 rounded-md bg-success/5 px-2.5 py-1.5 text-[0.65rem] sm:text-xs">
                {saleDiscount > 0 ? (
                  <div className="flex justify-between text-muted">
                    <span>Sale discount</span>
                    <span className="text-success">− {formatPrice(saleDiscount)}</span>
                  </div>
                ) : null}
                {coupon > 0 ? (
                  <div className="flex justify-between text-muted">
                    <span>Coupon{promoCode ? ` (${promoCode})` : ''}</span>
                    <span className="text-success">− {formatPrice(coupon)}</span>
                  </div>
                ) : null}
              </div>
            ) : null}
          </>
        ) : null}

        <div className="border-t border-sage/40 pt-2" />

        <div className="flex items-baseline justify-between gap-3">
          <span className="text-sm font-semibold text-primary sm:text-base">Total amount</span>
          <span className="text-base font-bold tabular-nums text-primary sm:text-lg">{formatPrice(orderTotal)}</span>
        </div>

        {totalDiscount > 0 ? (
          <div className="flex items-center gap-2 rounded-md bg-success/10 px-2.5 py-2 text-[0.65rem] font-semibold text-success sm:px-3 sm:py-2.5 sm:text-xs">
            <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-success/20 text-[0.6rem]" aria-hidden>
              %
            </span>
            <span>You&apos;ll save {formatPrice(totalDiscount)} on this order!</span>
          </div>
        ) : null}
      </div>
    </section>
  );
}
