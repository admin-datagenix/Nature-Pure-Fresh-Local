import { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { buildSubsetCart } from '../utils/cartSelection';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatPrice } from '../utils/helpers';
import { getCartItemImage } from '../data/productImages';
import StepIndicator from '../components/checkout/StepIndicator';
import CheckoutAddressPanel, { validateShippingAddress } from '../components/checkout/CheckoutAddressPanel';
import CheckoutProductList from '../components/checkout/CheckoutProductList';
import CheckoutPriceDetailsCard from '../components/checkout/CheckoutPriceDetailsCard';
import { loadStoredAddresses, mergeSavedAddresses } from '../utils/savedAddresses';
import { mergeShippingWithPrimary, pickBestCheckoutAddress } from '../utils/checkoutAddress';
import { notifyError, notifySuccess } from '../utils/notify';
import Reveal from '../components/ui/Reveal';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
  { id: 'netbanking', label: 'Net Banking', desc: 'All major banks', icon: '🏦' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
];

function emptyShipping() {
  return { name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '', label: 'Home' };
}

function loadCheckoutAddresses(user) {
  return mergeSavedAddresses(user, [], loadStoredAddresses());
}

export default function CheckoutPage() {
  const { cart, refreshCart, updateItem, loading: cartLoading } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const promo = location.state?.promo || null;
  const checkoutProductIds = location.state?.checkoutProductIds || null;

  const checkoutCart = useMemo(() => {
    if (checkoutProductIds?.length) {
      return buildSubsetCart(cart, checkoutProductIds);
    }
    return cart;
  }, [cart, checkoutProductIds]);

  /** 1 delivery, 2 payment, 3 confirm — cart is step 1 on stepper */
  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState(emptyShipping());
  const [payment, setPayment] = useState({ method: 'upi' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stepKey, setStepKey] = useState(0);
  const [savedAddresses, setSavedAddresses] = useState([]);
  const [addressPickerOpen, setAddressPickerOpen] = useState(false);
  const [addressAttempted, setAddressAttempted] = useState(false);

  const shippingCost =
    checkoutCart.subtotal >= 999 ? 0 : checkoutCart.subtotal > 0 ? 49 : 0;
  const discount = promo?.discount || 0;
  const orderTotal = Math.max(0, checkoutCart.subtotal + shippingCost - discount);
  const stepperStep = step + 1;

  useEffect(() => {
    const merged = loadCheckoutAddresses(user);
    setSavedAddresses(merged);
    const best = pickBestCheckoutAddress(merged);
    if (best) {
      setShipping(mergeShippingWithPrimary(best, merged));
    } else if (user) {
      setShipping(
        mergeShippingWithPrimary(
          {
            name: user.name || '',
            email: user.email || '',
            phone: user.phone || '',
            address: user.address || '',
          },
          []
        )
      );
    }
    setErrors({});
    setAddressAttempted(false);
  }, [user]);

  useEffect(() => {
    if (step === 1) {
      setAddressAttempted(false);
      setAddressPickerOpen(false);
    }
  }, [step]);

  useEffect(() => {
    if (checkoutCart.items.length === 0) {
      navigate('/cart');
    }
  }, [checkoutCart.items.length, navigate]);

  const goToStep = (next) => {
    setStepKey((k) => k + 1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (step === 1) {
      const resolved = mergeShippingWithPrimary(shipping, savedAddresses);
      setShipping(resolved);
      if (!validateShippingAddress(resolved, setErrors)) {
        setAddressAttempted(true);
        notifyError('Update delivery address using Change if needed');
        return;
      }
      setErrors({});
      setAddressAttempted(false);
      goToStep(2);
      return;
    }
    if (step === 2) {
      goToStep(3);
    }
  };

  const handleBack = () => {
    if (step === 1) navigate('/cart', { state: { promo } });
    else goToStep(step - 1);
  };

  const refreshSavedAddresses = (storedOverride) => {
    const stored = storedOverride ?? loadStoredAddresses();
    const merged = mergeSavedAddresses(user, [], stored);
    setSavedAddresses(merged);
    return merged;
  };

  const handleAddressesChange = (listFromPersist) => {
    if (Array.isArray(listFromPersist)) {
      refreshSavedAddresses(listFromPersist);
      notifySuccess('Address saved');
      return;
    }
    refreshSavedAddresses();
  };

  const handlePlaceOrder = async () => {
    const resolved = mergeShippingWithPrimary(shipping, savedAddresses);
    setShipping(resolved);
    if (!validateShippingAddress(resolved, setErrors)) {
      setAddressAttempted(true);
      goToStep(1);
      notifyError('Update delivery address using Change');
      return;
    }
    setSubmitting(true);
    try {
      if (payment.method !== 'cod') {
        notifySuccess('Payment gateway (Razorpay) — demo: order will be created');
      }
      const res = await api.createOrder({
        shipping: resolved,
        payment,
        promoCode: promo?.code,
        discount,
        productIds: checkoutProductIds?.length ? checkoutProductIds : undefined,
      });
      await refreshCart();
      navigate(`/order-confirmation/${res.data.id}`, {
        replace: true,
        state: { fromCheckout: true },
      });
    } catch (err) {
      const message = err.message || 'Could not place order';
      setErrors({ submit: message });
      notifyError(message);
    } finally {
      setSubmitting(false);
    }
  };

  if (checkoutCart.items.length === 0) return null;

  const payLabel = payment.method === 'cod' ? 'Place order' : `Pay ${formatPrice(orderTotal)}`;

  return (
    <div className="site-container py-6 md:py-8">
      <div className="checkout-shell mx-auto w-full max-w-4xl lg:max-w-5xl">
        <Reveal>
          <div className="mb-1 text-center">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.15em] text-secondary sm:text-xs">
              Secure Checkout
            </p>
            <h1 className="font-heading text-2xl font-semibold text-primary md:text-3xl">Checkout</h1>
          </div>
        </Reveal>

        <div className="mt-4 md:mt-5">
          <StepIndicator currentStep={stepperStep} />
        </div>

        <div key={stepKey} className="checkout-step-enter checkout-delivery-layout w-full">
          {step <= 2 && (
            <CheckoutAddressPanel
              addresses={savedAddresses}
              shipping={shipping}
              setShipping={setShipping}
              errors={errors}
              setErrors={setErrors}
              onAddressesChange={handleAddressesChange}
              pickerOpen={addressPickerOpen}
              onPickerClose={() => setAddressPickerOpen(false)}
              showAddressAlert={addressAttempted}
            />
          )}

          <div className="mt-3 grid w-full gap-3 sm:mt-4 sm:gap-5 md:grid-cols-[1fr_288px] lg:grid-cols-[1fr_320px] lg:items-stretch">
            <div className="min-w-0 lg:flex lg:flex-col">
              {step === 1 && (
                <CheckoutProductList
                  cart={checkoutCart}
                  className="lg:flex-1"
                  onUpdate={updateItem}
                  loading={cartLoading}
                />
              )}

              {step === 2 && (
                <section className="neo-card p-6 md:p-8">
                  <h2 className="mb-6 font-heading text-xl font-semibold text-primary">Payment method</h2>
                  <div className="space-y-3">
                    {PAYMENT_METHODS.map((method) => (
                      <label
                        key={method.id}
                        className={`flex cursor-pointer items-center gap-4 rounded-[1.5rem] p-4 transition ${
                          payment.method === method.id
                            ? 'bg-sage/70 shadow-[0_8px_20px_rgba(41,70,51,0.06)]'
                            : 'bg-cream-dark/70 hover:bg-sage/50'
                        }`}
                      >
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={payment.method === method.id}
                          onChange={() => setPayment({ method: method.id })}
                          className="sr-only"
                        />
                        <span className="text-2xl">{method.icon}</span>
                        <div className="flex-1">
                          <p className="font-semibold text-primary">{method.label}</p>
                          <p className="text-sm text-muted">{method.desc}</p>
                        </div>
                        <span
                          className={`flex h-5 w-5 items-center justify-center rounded-full border-2 ${
                            payment.method === method.id
                              ? 'border-secondary bg-secondary'
                              : 'border-sage bg-white'
                          }`}
                        >
                          {payment.method === method.id && (
                            <span className="h-2 w-2 rounded-full bg-white" />
                          )}
                        </span>
                      </label>
                    ))}
                  </div>
                  <div className="mt-6 border-t border-sage/40 pt-5">
                    <div className="flex justify-between text-lg font-bold text-primary">
                      <span>Total</span>
                      <span>{formatPrice(orderTotal)}</span>
                    </div>
                  </div>
                </section>
              )}

              {step === 3 && (
                <section className="neo-card p-6 md:p-8">
                  <h2 className="mb-6 font-heading text-xl font-semibold text-primary">Confirm your order</h2>
                  <ConfirmBlock title="Deliver to">
                    <p className="text-sm font-semibold text-primary">{shipping.name}</p>
                    <p className="text-sm text-muted">{shipping.address}</p>
                    <p className="text-sm text-muted">
                      {[shipping.city, shipping.state, shipping.pincode].filter(Boolean).join(', ')}
                    </p>
                    <p className="text-sm text-muted">{shipping.phone}</p>
                  </ConfirmBlock>
                  <ConfirmBlock title="Payment" className="mt-4">
                    <p className="text-sm text-muted">
                      {PAYMENT_METHODS.find((m) => m.id === payment.method)?.label}
                    </p>
                  </ConfirmBlock>
                  <ConfirmBlock title={`Items (${checkoutCart.items.length})`} className="mt-4">
                    <ul className="space-y-3">
                      {checkoutCart.items.map((item) => (
                        <li key={item.product_id} className="flex gap-3 text-sm">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-md border border-sage/40 bg-white p-0.5">
                            <img
                              src={getCartItemImage(item)}
                              alt=""
                              className="max-h-full max-w-full object-contain"
                            />
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="font-medium text-primary">
                              {item.name.replace(/^Freeze Dried /i, '')}
                            </p>
                            <p className="text-muted">Qty {item.quantity}</p>
                          </div>
                          <span className="font-semibold tabular-nums text-primary">
                            {formatPrice(item.line_total ?? item.price * item.quantity)}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </ConfirmBlock>
                  {errors.submit && (
                    <p className="mt-4 rounded-lg bg-strawberry/10 px-4 py-3 text-sm text-strawberry">
                      {errors.submit}
                    </p>
                  )}
                </section>
              )}
            </div>

            {step <= 3 && (
              <aside className="min-w-0 lg:justify-self-stretch">
                <CheckoutPriceDetailsCard
                  cart={checkoutCart}
                  shippingCost={shippingCost}
                  couponDiscount={discount}
                  promoCode={promo?.code}
                />
              </aside>
            )}
          </div>

          <div className="mt-4 flex flex-wrap gap-2 sm:mt-5 sm:gap-3">
            <button type="button" onClick={handleBack} className="neo-btn-ghost px-6 py-3 text-sm font-semibold">
              ← {step === 1 ? 'Back to cart' : 'Previous'}
            </button>
            {step < 3 ? (
              <button
                type="button"
                onClick={handleNext}
                className="neo-btn flex-1 px-8 py-3 text-sm font-semibold sm:flex-none"
              >
                {step === 2 ? 'Continue to confirm →' : 'Continue →'}
              </button>
            ) : (
              <button
                type="button"
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="neo-btn flex-1 px-8 py-3 text-sm font-semibold disabled:opacity-60 sm:flex-none"
              >
                {submitting ? 'Processing…' : payLabel}
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function ConfirmBlock({ title, children, className = '' }) {
  return (
    <div
      className={`rounded-[1.25rem] bg-cream-dark p-4 shadow-[inset_2px_2px_6px_rgba(61,96,73,0.05)] ${className}`}
    >
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">{title}</h3>
      {children}
    </div>
  );
}
