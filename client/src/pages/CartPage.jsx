import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { formatPrice } from '../utils/helpers';
import { getCartItemImage } from '../data/productImages';
import { api } from '../api/client';
import Reveal from '../components/ui/Reveal';
import { cn } from '../lib/cn';
import { notifyError, notifySuccess } from '../utils/notify';

export default function CartPage() {
  const {
    cart,
    selectedCart,
    selectedIds,
    isSelected,
    toggleSelect,
    selectAll,
    selectNone,
    updateItem,
    clear,
    loading,
  } = useCart();
  const navigate = useNavigate();
  const [promoInput, setPromoInput] = useState('');
  const [promo, setPromo] = useState(null);
  const [promoError, setPromoError] = useState('');
  const [promoLoading, setPromoLoading] = useState(false);

  const subtotalForCheckout = selectedCart.subtotal;
  const shipping = subtotalForCheckout >= 999 ? 0 : subtotalForCheckout > 0 ? 49 : 0;
  const discount = promo?.discount || 0;
  const total = Math.max(0, subtotalForCheckout + shipping - discount);
  const allSelected = cart.items.length > 0 && selectedIds.length === cart.items.length;
  const noneSelected = selectedIds.length === 0;

  useEffect(() => {
    setPromo(null);
    setPromoError('');
  }, [selectedIds.join('|'), subtotalForCheckout]);

  const applyPromo = async () => {
    if (!promoInput.trim()) return;
    if (noneSelected) {
      setPromoError('Select at least one item to apply a promo');
      return;
    }
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
    if (noneSelected) return;
    navigate('/checkout', {
      state: {
        promo,
        checkoutProductIds: [...selectedIds],
      },
    });
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
          <Link
            to="/shop"
            className="neo-btn mt-8 inline-flex px-8 py-3.5 text-sm font-semibold"
          >
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
              Your Cart ({cart.itemCount} {cart.itemCount === 1 ? 'item' : 'items'})
            </h1>
          </div>
          <button
            onClick={clear}
            disabled={loading}
            className="text-sm font-medium text-strawberry transition hover:underline disabled:opacity-50"
          >
            Clear all items
          </button>
        </div>

        <div className="mb-4 flex flex-wrap items-center justify-between gap-3 rounded-[20px] border border-sage/50 bg-cream-dark/50 px-4 py-3">
          <span className="text-xs text-muted">
            {selectedCart.itemCount} of {cart.itemCount} units selected for checkout
          </span>
          <div className="flex gap-3 text-sm font-medium">
            <button
              type="button"
              onClick={selectAll}
              disabled={allSelected}
              className="text-primary transition hover:text-secondary disabled:opacity-40"
            >
              Select all
            </button>
            <button
              type="button"
              onClick={selectNone}
              disabled={noneSelected}
              className="text-muted transition hover:text-primary disabled:opacity-40"
            >
              Clear selection
            </button>
          </div>
        </div>
      </Reveal>

      <div className="grid gap-10 lg:grid-cols-[1fr_380px]">
        <div className="space-y-4">
          {cart.items.map((item, i) => {
            const checked = isSelected(item.product_id);
            return (
              <Reveal key={item.product_id} delay={i * 60}>
                <article
                  role="button"
                  tabIndex={0}
                  aria-pressed={checked}
                  aria-label={`${checked ? 'Deselect' : 'Select'} ${item.name} for checkout`}
                  onClick={() => toggleSelect(item.product_id)}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault();
                      toggleSelect(item.product_id);
                    }
                  }}
                  className={cn(
                    'neo-card group flex cursor-pointer gap-4 p-4 transition md:gap-6 md:p-5',
                    checked
                      ? 'border border-primary/35 ring-2 ring-primary/15'
                      : 'border border-transparent opacity-75 hover:opacity-100'
                  )}
                >
                  <Link
                    to={`/product/${item.slug}`}
                    onClick={(e) => e.stopPropagation()}
                    className="relative flex h-24 w-24 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-2 md:h-28 md:w-28"
                  >
                    <img
                      src={getCartItemImage(item)}
                      alt={item.name}
                      className="max-h-full max-w-full object-contain transition duration-500 group-hover:scale-105"
                    />
                  </Link>

                  <div className="flex min-w-0 flex-1 flex-col justify-between">
                    <div>
                      <Link
                        to={`/product/${item.slug}`}
                        onClick={(e) => e.stopPropagation()}
                        className="font-heading text-base font-semibold text-primary transition hover:text-secondary md:text-lg"
                      >
                        {item.name.replace(/^Freeze Dried /i, '')}
                      </Link>
                      <p className="mt-0.5 text-xs text-muted">
                        {[item.category_name, item.weight_grams ? `${item.weight_grams}g` : null]
                          .filter(Boolean)
                          .join(' · ')}
                      </p>
                    </div>

                    <div className="mt-3 flex flex-wrap items-center justify-between gap-3">
                      <div className="neo-qty" onClick={(e) => e.stopPropagation()}>
                        <button
                          type="button"
                          onClick={() => updateItem(item.product_id, item.quantity - 1)}
                          disabled={loading}
                          className="flex h-9 w-9 items-center justify-center text-primary transition hover:bg-white disabled:opacity-50"
                          aria-label="Decrease quantity"
                        >
                          −
                        </button>
                        <span className="flex w-10 items-center justify-center text-sm font-bold text-primary">
                          {item.quantity}
                        </span>
                        <button
                          type="button"
                          onClick={() => updateItem(item.product_id, item.quantity + 1)}
                          disabled={loading}
                          className="flex h-9 w-9 items-center justify-center text-primary transition hover:bg-white disabled:opacity-50"
                          aria-label="Increase quantity"
                        >
                          +
                        </button>
                      </div>
                      <span className="font-heading text-lg font-bold text-primary">
                        {formatPrice(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </div>

        <Reveal delay={120}>
          <aside className="neo-card sticky top-[120px] h-fit p-6 md:p-7">
            <h3 className="mb-1 font-heading text-xl font-semibold text-primary">Checkout summary</h3>
            <p className="mb-5 text-xs text-muted">Totals for selected items only</p>

            <div className="mb-5">
              {promo ? (
                <div className="flex items-center justify-between rounded-xl bg-success/10 px-4 py-3">
                  <div>
                    <span className="text-sm font-semibold text-success">{promo.code} applied</span>
                    <p className="text-xs text-muted">You save {formatPrice(promo.discount)}</p>
                  </div>
                  <button onClick={removePromo} className="text-xs font-medium text-strawberry hover:underline">
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
                    disabled={noneSelected}
                  />
                  <button
                    onClick={applyPromo}
                    disabled={promoLoading || !promoInput.trim() || noneSelected}
                    className="neo-btn px-4 py-2.5 text-sm font-semibold disabled:opacity-50"
                  >
                    Apply
                  </button>
                </div>
              )}
              {promoError && <p className="mt-2 text-xs text-strawberry">{promoError}</p>}
            </div>

            <div className="space-y-2.5 text-sm text-muted">
              <div className="flex justify-between">
                <span>Subtotal ({selectedCart.itemCount} selected)</span>
                <span>{formatPrice(subtotalForCheckout)}</span>
              </div>
              {cart.itemCount > selectedCart.itemCount && (
                <div className="flex justify-between text-xs">
                  <span>Remaining in cart</span>
                  <span>{cart.itemCount - selectedCart.itemCount} units not selected</span>
                </div>
              )}
              <div className="flex justify-between">
                <span>Shipping</span>
                <span className={shipping === 0 && subtotalForCheckout > 0 ? 'font-medium text-success' : ''}>
                  {noneSelected ? '—' : shipping === 0 ? 'Free' : formatPrice(shipping)}
                </span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-success">
                  <span>Discount</span>
                  <span>−{formatPrice(discount)}</span>
                </div>
              )}
              <div className="flex justify-between border-t border-sage pt-4 text-xl font-bold text-primary">
                <span>Total</span>
                <span>{formatPrice(total)}</span>
              </div>
            </div>

            {shipping > 0 && subtotalForCheckout > 0 && (
              <p className="mt-4 rounded-xl bg-mango/10 px-3 py-2.5 text-xs text-muted">
                🚚 Add {formatPrice(999 - subtotalForCheckout)} more on selected items for{' '}
                <strong className="text-primary">free shipping</strong>
              </p>
            )}

            <button
              onClick={handleCheckout}
              disabled={noneSelected}
              className="neo-btn mt-6 w-full py-3.5 text-sm font-semibold disabled:cursor-not-allowed disabled:opacity-50"
            >
              {noneSelected
                ? 'Select items to checkout'
                : selectedIds.length === cart.items.length
                  ? 'Checkout all items →'
                  : `Checkout ${selectedIds.length} selected →`}
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

