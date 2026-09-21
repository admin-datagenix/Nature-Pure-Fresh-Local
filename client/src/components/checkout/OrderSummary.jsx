import { formatPrice } from '../../utils/helpers';
import { getCartItemImage } from '../../data/productImages';

export default function OrderSummary({ cart, shipping, discount = 0, promoCode, compact = false }) {
  const total = Math.max(0, cart.subtotal + shipping - discount);

  return (
    <aside className="neo-card sticky top-[120px] h-fit p-6 md:p-7">
      <h3 className="mb-5 font-heading text-lg font-semibold text-primary">Order Summary</h3>

      {!compact && (
        <ul className="mb-5 max-h-48 space-y-3 overflow-y-auto border-b border-sage pb-5">
          {cart.items.map((item) => (
            <li key={item.product_id} className="flex items-center gap-3">
              <div className="flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-lg bg-white p-1">
                <img
                  src={getCartItemImage(item)}
                  alt={item.name}
                  className="max-h-full max-w-full object-contain"
                />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-primary">
                  {item.name.replace(/^Freeze Dried /i, '')}
                </p>
                <p className="text-xs text-muted">Qty: {item.quantity}</p>
              </div>
              <span className="text-sm font-semibold text-primary">{formatPrice(item.line_total)}</span>
            </li>
          ))}
        </ul>
      )}

      <div className="space-y-2.5 text-sm text-muted">
        <div className="flex justify-between">
          <span>Subtotal ({cart.itemCount} items)</span>
          <span>{formatPrice(cart.subtotal)}</span>
        </div>
        <div className="flex justify-between">
          <span>Shipping</span>
          <span className={shipping === 0 ? 'font-medium text-success' : ''}>
            {shipping === 0 ? 'Free' : formatPrice(shipping)}
          </span>
        </div>
        {discount > 0 && (
          <div className="flex justify-between text-success">
            <span>Discount {promoCode && `(${promoCode})`}</span>
            <span>−{formatPrice(discount)}</span>
          </div>
        )}
        <div className="flex justify-between border-t border-sage pt-4 text-lg font-bold text-primary">
          <span>Total</span>
          <span>{formatPrice(total)}</span>
        </div>
      </div>

      {shipping > 0 && cart.subtotal < 999 && (
        <p className="mt-4 rounded-lg bg-secondary/10 px-3 py-2 text-xs text-secondary">
          Add {formatPrice(999 - cart.subtotal)} more for free shipping
        </p>
      )}
    </aside>
  );
}
