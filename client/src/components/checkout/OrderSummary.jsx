import { formatPrice } from '../../utils/helpers';
import { getCartItemImage } from '../../data/productImages';

export default function OrderSummary({ cart, shipping, discount = 0, promoCode, compact = false }) {
  const total = Math.max(0, cart.subtotal + shipping - discount);

  return (
    <aside className="neo-card sticky top-[120px] h-fit overflow-hidden p-0">
      <div className="border-b border-sage/40 px-5 py-4">
        <h3 className="font-heading text-base font-bold text-primary">
          Price details ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
        </h3>
      </div>

      <div className="px-5 py-4">
        {!compact && (
          <ul className="mb-4 max-h-40 space-y-2.5 overflow-y-auto border-b border-sage/40 pb-4">
            {cart.items.map((item) => (
              <li key={item.product_id} className="flex items-center gap-2.5">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-md border border-sage/40 bg-white p-0.5">
                  <img src={getCartItemImage(item)} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-medium text-primary">
                    {item.name.replace(/^Freeze Dried /i, '')}
                  </p>
                  <p className="text-[0.65rem] text-muted">Qty {item.quantity}</p>
                </div>
              </li>
            ))}
          </ul>
        )}

        <div className="space-y-2.5 text-sm">
          <div className="flex justify-between text-muted">
            <span>Product price</span>
            <span className="text-primary">+ {formatPrice(cart.subtotal)}</span>
          </div>
          <div className="flex justify-between text-muted">
            <span>Delivery fee</span>
            <span className={shipping === 0 ? 'font-medium text-success' : 'text-primary'}>
              {shipping === 0 ? 'FREE' : `+ ${formatPrice(shipping)}`}
            </span>
          </div>
          {discount > 0 ? (
            <div className="flex justify-between font-medium text-success">
              <span>Total discounts {promoCode ? `(${promoCode})` : ''}</span>
              <span>− {formatPrice(discount)}</span>
            </div>
          ) : null}
          <div className="flex justify-between border-t border-sage/50 pt-3 text-base font-bold text-primary">
            <span>Order total</span>
            <span>{formatPrice(total)}</span>
          </div>
        </div>

        {discount > 0 ? (
          <div className="mt-4 flex items-start gap-2 rounded-lg border border-success/25 bg-success/10 px-3 py-2.5 text-xs text-primary">
            <span className="text-success" aria-hidden>
              ✓
            </span>
            <span>
              Yay! Your total discount is <strong>{formatPrice(discount)}</strong>
            </span>
          </div>
        ) : null}

        {shipping > 0 && cart.subtotal < 999 ? (
          <p className="mt-3 text-xs text-muted">
            Add {formatPrice(999 - cart.subtotal)} more for free delivery
          </p>
        ) : null}
      </div>
    </aside>
  );
}
