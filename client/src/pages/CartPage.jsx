import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { computeCartPriceBreakdown } from '../utils/cartPriceBreakdown';
import { api } from '../api/client';
import Reveal from '../components/ui/Reveal';
import { notifyError, notifySuccess } from '../utils/notify';
import { useWishlist } from '../context/WishlistContext';
import CartLineRow from '../components/cart/CartLineRow';

export default function CartPage() {
  const { cart, updateItem, removeItem, clear, loading } = useCart();
  const { add: addToWishlist, isWishlisted } = useWishlist();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const productCount = cart.items.length;
  const unitCount = cart.itemCount;
  const subtotalForCheckout = cart.subtotal;
  const shipping = subtotalForCheckout >= 999 ? 0 : subtotalForCheckout > 0 ? 49 : 0;
  const discount = promo?.discount || 0;
  const total = Math.max(0, subtotalForCheckout + shipping - discount);

  useEffect(() => {
    setPromo(null);
    setPromoError('');
  }, [cart.itemCount, subtotalForCheckout]);

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    if (cart.items.length === 0) return;
    setPromoLoading(true);
    setPromoError('');
    try {
      const res = await api.validatePromoCode(promoInput, subtotalForCheckout);
      setPromo(res.data);
      notifySuccess(`Promo "${res.data.code}" applied`);
    } catch (err) {
      setPromo(null);
      setPromoError(err.message);
      notifyError(err.message || 'Invalid promo code');
    } finally {
      setPromoLoading(false);
    }
  };

  const removePromo = () => {
    setPromo(null);
    setPromoInput('');
    setPromoError('');
  };

  const handleCheckout = () => {
    if (cart.items.length === 0) return;
    navigate('/checkout', { state: { promo } });
  };

  const handleMoveToWishlist = async (item) => {
    const label = item.name.replace(/^Freeze Dried /i, '');
    if (isWishlisted(item.product_id, item.slug)) {
      notifySuccess(`${label} is already in your wishlist — removed from cart`);
    } else {
      await addToWishlist(item.product_id, label, { slug: item.slug });
    }
    await removeItem(item.product_id);
  };

  if (cart.items.length === 0) {
    return (
      <div className="site-container py-16 md:py-24">
        <Reveal className="mx-auto max-w-md text-center">
          <div className="mx-auto mb-6 flex h-24 w-24 items-center justify-center rounded-full bg-cream-dark text-4xl">
            🛒
          </div>
          <h1 className="font-heading text-3xl text-primary">Your cart is empty</h1>
          <p className="mt-3 text-muted">Discover our premium freeze-dried fruits and start snacking better.</p>
          <Link to="/shop" className="neo-btn mt-8 inline-flex px-8 py-3.5 text-sm font-semibold">
            Explore Collection
          </Link>
        </Reveal>
      </div>
    );
  }

  return (
    <div className="site-container py-10 md:py-14">
      <Reveal>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Shopping Cart</p>
            <h1 className="font-heading text-3xl font-semibold text-primary md:text-4xl">
              Your Cart ({productCount} {productCount === 1 ? 'product' : 'products'})
            </h1>
            <p className="mt-1 text-sm text-muted">
              {unitCount > productCount
                ? `${unitCount} units total · all lines included at checkout`
                : 'All items below will be included at checkout'}
            </p>
          </div>
          <button
            type="button"
            onClick={clear}
            disabled={loading}
            className="text-sm font-medium text-strawberry transition hover:underline disabled:opacity-50"
          >
            Clear all items
          </button>
        </div>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="overflow-hidden rounded-2xl border border-sage/45 bg-white shadow-[0_4px_20px_rgba(41,70,51,0.05)]">
          <div
            className="cart-line-header hidden border-b border-sage/40 bg-cream/40 px-4 py-3 text-xs font-semibold uppercase tracking-wide text-muted md:grid md:grid-cols-[minmax(0,1fr)_5.5rem_7.5rem_5.5rem] md:gap-4 md:px-5"
            aria-hidden
          >
            <span>Product</span>
            <span className="text-center">Unit price</span>
            <span className="text-center">Quantity</span>
            <span className="text-right">Total</span>
          </div>
          <ul>
            {cart.items.map((item, i) => (
              <li key={item.product_id}>
                <Reveal delay={i * 50}>
                  <CartLineRow
                    item={item}
                    loading={loading}
                    onUpdate={updateItem}
                    onRemove={removeItem}
                    onMoveToWishlist={handleMoveToWishlist}
                  />
                </Reveal>
              </li>
            ))}
          </ul>
        </div>

        <Reveal delay={120}>
          <aside className="neo-card sticky top-[120px] h-fit p-6 md:p-7">
            <h3 className="mb-1 font-heading text-xl font-semibold text-primary">Order summary</h3>
            <p className="mb-5 text-xs text-muted">
              {productCount} products
              {unitCount > productCount ? ` · ${unitCount} units` : ''} · full cart checkout
            </p>

            <div className="mb-5">
              {promo ? (
                <div className="flex items-center justify-between rounded-xl bg-success/10 px-4 py-3">
                  <div>
                    <span className="text-sm font-semibold text-success">{promo.code} applied</span>
                    <p className="text-xs text-muted">Coupon discount {formatPrice(promo.discount)}</p>
                  </div>
                  <button type="button" onClick={removePromo} className="text-xs font-medium text-strawberry hover:underline">
                    Remove
                  </button>
                </div>
              ) : (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={promoInput}
                    onChange={(e) => setPromoInput(e.target.value.toUpperCase())}
                    placeholder="Promo code (try FRESH10)"
                    className="neo-input flex-1 px-4 py-2.5 text-sm"
                  />
                  <button
                    type="button"
                    onClick={applyPromo}
                    disabled={promoLoading || !promoInput.trim()}
                    className="neo-btn px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="mt-2 text-xs text-strawberry">{promoError}</p>}
            </div>

            <CartSummaryPricing
              cart={cart}
              shipping={shipping}
              discount={discount}
              promoCode={promo?.code}
              total={total}
            />

            {shipping > 0 && subtotalForCheckout > 0 && (
              <p className="mt-4 rounded-xl bg-mango/10 px-3 py-2.5 text-xs text-muted">
                🚚 Add {formatPrice(999 - subtotalForCheckout)} more for <strong className="text-primary">free shipping</strong>
              </p>
            )}

            <button
              type="button"
              onClick={handleCheckout}
              disabled={cart.items.length === 0}
              className="neo-btn mt-6 w-full py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              Proceed to checkout ({productCount} {productCount === 1 ? 'product' : 'products'}) →
            </button>
            <Link to="/shop" className="mt-4 block text-center text-sm text-muted transition hover:text-primary">
              ← Continue Shopping
            </Link>

            <div className="mt-6 flex items-center justify-center gap-4 border-t border-sage pt-5 text-xs text-muted">
              <span>🔒 Secure checkout</span>
              <span>·</span>
              <span>💳 UPI / Cards / COD</span>
            </div>
          </aside>
        </Reveal>
      </div>
    </div>
  );
}

function CartSummaryPricing({ cart, shipping, discount, promoCode, total }) {
  const { saleDiscount } = computeCartPriceBreakdown(cart, discount);
  const subtotal = cart.subtotal;

  return (
    <div className="space-y-2.5 text-sm text-muted">
      {saleDiscount > 0 ? (
        <>
          <div className="flex justify-between">
            <span>Total MRP</span>
            <span className="line-through">{formatPrice(subtotal + saleDiscount)}</span>
          </div>
          <div className="flex justify-between text-success">
            <span>Sale discount</span>
            <span>−{formatPrice(saleDiscount)}</span>
          </div>
        </>
      ) : null}
      <div className="flex justify-between">
        <span>Product price</span>
        <span>{formatPrice(subtotal)}</span>
      </div>
      {discount > 0 ? (
        <div className="flex justify-between text-success">
          <span>Coupon discount{promoCode ? ` (${promoCode})` : ''}</span>
          <span>−{formatPrice(discount)}</span>
        </div>
      ) : null}
      <div className="flex justify-between">
        <span>Shipping</span>
        <span className={shipping === 0 && subtotal > 0 ? 'font-medium text-success' : ''}>
          {shipping === 0 ? 'Free' : formatPrice(shipping)}
        </span>
      </div>
      <div className="flex justify-between border-t border-sage pt-4 text-xl font-bold text-primary">
        <span>Total</span>
        <span>{formatPrice(total)}</span>
      </div>
    </div>
  );
}
