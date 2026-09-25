import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useCart } from '../context/CartContext';
import { buildSubsetCart } from '../utils/cartSelection';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatPrice } from '../utils/helpers';
import { getCartItemImage } from '../data/productImages';
import StepIndicator from '../components/checkout/StepIndicator';
import OrderSummary from '../components/checkout/OrderSummary';
import { notifyError } from '../utils/notify';
import Reveal from '../components/ui/Reveal';
import { cn } from '../lib/cn';
import NeoSelect from '../components/ui/NeoSelect';

const PAYMENT_METHODS = [
  { id: 'upi', label: 'UPI', desc: 'Google Pay, PhonePe, Paytm', icon: '📱' },
  { id: 'card', label: 'Credit / Debit Card', desc: 'Visa, Mastercard, RuPay', icon: '💳' },
  { id: 'cod', label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
];

const INDIAN_STATES = [
  'Andhra Pradesh', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

function emptyShipping() {
  return { name: '', phone: '', email: '', address: '', city: '', state: '', pincode: '' };
}

export default function CheckoutPage() {
  const { cart, refreshCart } = useCart();
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

  const [step, setStep] = useState(1);
  const [shipping, setShipping] = useState(emptyShipping());
  const [payment, setPayment] = useState({ method: 'upi' });
  const [errors, setErrors] = useState({});
  const [submitting, setSubmitting] = useState(false);
  const [stepKey, setStepKey] = useState(0);

  const shippingCost = checkoutCart.subtotal >= 999 ? 0 : 49;
  const discount = promo?.discount || 0;

  useEffect(() => {
    if (user) {
      setShipping((s) => ({
        ...s,
        name: user.name || '',
        email: user.email || '',
        phone: user.phone || '',
        address: user.address || '',
      }));
    }
  }, [user]);

  useEffect(() => {
    if (checkoutCart.items.length === 0 && step < 4) {
      navigate('/cart');
    }
  }, [checkoutCart.items.length, navigate, step]);

  const validateShipping = () => {
    const e = {};
    if (!shipping.name.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(shipping.phone.replace(/\D/g, '').slice(-10))) e.phone = 'Valid 10-digit phone required';
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(shipping.email)) e.email = 'Valid email required';
    if (shipping.address.trim().length < 10) e.address = 'Full address required';
    if (!shipping.city.trim()) e.city = 'City is required';
    if (!shipping.state) e.state = 'State is required';
    if (!/^\d{6}$/.test(shipping.pincode)) e.pincode = 'Valid 6-digit PIN required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const goToStep = (next) => {
    setStepKey((k) => k + 1);
    setStep(next);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleNext = () => {
    if (step === 1) goToStep(2);
    else if (step === 2 && validateShipping()) goToStep(3);
    else if (step === 3) goToStep(4);
  };

  const handleBack = () => {
    if (step === 1) navigate('/cart');
    else goToStep(step - 1);
  };

  const handlePlaceOrder = async () => {
    setSubmitting(true);
    try {
      const res = await api.createOrder({
        shipping,
        payment,
        promoCode: promo?.code,
        discount,
        productIds: checkoutProductIds?.length ? checkoutProductIds : undefined,
      });
      await refreshCart();
      navigate(`/order-confirmation/${res.data.id}`, { replace: true });
    } catch (err) {
      const message = err.message || 'Could not place order';
      setErrors({ submit: message });
      notifyError(message);
    } finally {
      setSubmitting(false);
    }
  };

  const updateField = (field, value) => {
    setShipping((s) => ({ ...s, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  if (checkoutCart.items.length === 0 && step < 4) return null;

  return (
    <div className="site-container py-10 md:py-14">
      <Reveal>
        <div className="mb-2 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.15em] text-secondary">Secure Checkout</p>
          <h1 className="font-heading text-3xl font-semibold text-primary">Complete Your Order</h1>
        </div>
      </Reveal>

      <div className="mt-8">
        <StepIndicator currentStep={step} />
      </div>

      <div className="grid gap-10 lg:grid-cols-[1fr_360px]">
        <div key={stepKey} className="checkout-step-enter">
          {/* Step 1: Cart Review */}
          {step === 1 && (
            <section className="neo-card p-6 md:p-8">
              <h2 className="mb-6 font-heading text-xl font-semibold text-primary">Review Your Items</h2>
              <ul className="divide-y divide-sage">
                {checkoutCart.items.map((item) => (
                  <li key={item.product_id} className="flex items-center gap-4 py-4 first:pt-0 last:pb-0">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1.5">
                      <img src={getCartItemImage(item)} alt={item.name} className="max-h-full max-w-full object-contain" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-primary">{item.name.replace(/^Freeze Dried /i, '')}</p>
                      <p className="text-sm text-muted">Qty: {item.quantity} · {formatPrice(item.price)} each</p>
                    </div>
                    <span className="font-semibold text-primary">{formatPrice(item.line_total)}</span>
                  </li>
                ))}
              </ul>
              <p className="mt-6 text-sm text-muted">
                Need to make changes?{' '}
                <Link to="/cart" className="font-medium text-secondary hover:underline">Edit cart</Link>
              </p>
            </section>
          )}

          {/* Step 2: Shipping */}
          {step === 2 && (
            <section className="neo-card p-6 md:p-8">
              <h2 className="mb-6 font-heading text-xl font-semibold text-primary">Delivery Details</h2>
              <div className="grid gap-4 sm:grid-cols-2">
                <Field label="Full Name" error={errors.name}>
                  <input
                    value={shipping.name}
                    onChange={(e) => updateField('name', e.target.value)}
                    className={inputCls(errors.name)}
                    placeholder="Your full name"
                  />
                </Field>
                <Field label="Phone" error={errors.phone}>
                  <input
                    value={shipping.phone}
                    onChange={(e) => updateField('phone', e.target.value)}
                    className={inputCls(errors.phone)}
                    placeholder="+91 98765 43210"
                  />
                </Field>
                <Field label="Email" error={errors.email} className="sm:col-span-2">
                  <input
                    type="email"
                    value={shipping.email}
                    onChange={(e) => updateField('email', e.target.value)}
                    className={inputCls(errors.email)}
                    placeholder="you@email.com"
                  />
                </Field>
                <Field label="Address" error={errors.address} className="sm:col-span-2">
                  <textarea
                    value={shipping.address}
                    onChange={(e) => updateField('address', e.target.value)}
                    rows={2}
                    className={inputCls(errors.address, true)}
                    placeholder="Flat / house, street, area"
                  />
                </Field>
                <Field label="City" error={errors.city}>
                  <input
                    value={shipping.city}
                    onChange={(e) => updateField('city', e.target.value)}
                    className={inputCls(errors.city)}
                    placeholder="e.g. Miraj"
                  />
                </Field>
                <Field label="State" error={errors.state}>
                  <NeoSelect
                    value={shipping.state}
                    onChange={(e) => updateField('state', e.target.value)}
                    className={inputCls(errors.state)}
                    placeholder="Select state"
                  >
                    <option value="">Select state</option>
                    {INDIAN_STATES.map((s) => (
                      <option key={s} value={s}>{s}</option>
                    ))}
                  </NeoSelect>
                </Field>
                <Field label="PIN Code" error={errors.pincode}>
                  <input
                    value={shipping.pincode}
                    onChange={(e) => updateField('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
                    className={inputCls(errors.pincode)}
                    placeholder="6-digit PIN"
                  />
                </Field>
              </div>
            </section>
          )}

          {/* Step 3: Payment */}
          {step === 3 && (
            <section className="neo-card p-6 md:p-8">
              <h2 className="mb-6 font-heading text-xl font-semibold text-primary">Payment Method</h2>
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
                        payment.method === method.id ? 'border-secondary bg-secondary' : 'border-sage bg-white'
                      }`}
                    >
                      {payment.method === method.id && (
                        <span className="h-2 w-2 rounded-full bg-white" />
                      )}
                    </span>
                  </label>
                ))}
              </div>
              <p className="mt-6 flex items-center gap-2 text-xs text-muted">
                🔒 Your payment information is encrypted and secure
              </p>
            </section>
          )}

          {/* Step 4: Confirm */}
          {step === 4 && (
            <section className="neo-card p-6 md:p-8">
              <h2 className="mb-6 font-heading text-xl font-semibold text-primary">Confirm Your Order</h2>

              <div className="space-y-6">
                <ConfirmBlock title="Delivery Address">
                  <p className="font-medium text-primary">{shipping.name}</p>
                  <p className="text-sm text-muted">{shipping.address}</p>
                  <p className="text-sm text-muted">{shipping.city}, {shipping.state} — {shipping.pincode}</p>
                  <p className="text-sm text-muted">{shipping.phone} · {shipping.email}</p>
                </ConfirmBlock>

                <ConfirmBlock title="Payment">
                  <p className="text-sm text-muted">
                    {PAYMENT_METHODS.find((m) => m.id === payment.method)?.label}
                  </p>
                </ConfirmBlock>

                <ConfirmBlock title={`Items (${checkoutCart.itemCount})`}>
                  <ul className="space-y-2">
                    {checkoutCart.items.map((item) => (
                      <li key={item.product_id} className="flex justify-between text-sm">
                        <span className="text-muted">{item.name.replace(/^Freeze Dried /i, '')} × {item.quantity}</span>
                        <span className="font-medium text-primary">{formatPrice(item.line_total)}</span>
                      </li>
                    ))}
                  </ul>
                </ConfirmBlock>
              </div>

              {errors.submit && (
                <p className="mt-4 rounded-lg bg-strawberry/10 px-4 py-3 text-sm text-strawberry">{errors.submit}</p>
              )}
            </section>
          )}

          <div className="mt-6 flex flex-wrap gap-3">
            <button
              onClick={handleBack}
              className="neo-btn-ghost px-6 py-3 text-sm font-semibold"
            >
              ← {step === 1 ? 'Back to Cart' : 'Previous'}
            </button>
            {step < 4 ? (
              <button
                onClick={handleNext}
                className="neo-btn flex-1 px-8 py-3 text-sm font-semibold sm:flex-none"
              >
                Continue →
              </button>
            ) : (
              <button
                onClick={handlePlaceOrder}
                disabled={submitting}
                className="neo-btn flex-1 px-8 py-3 text-sm font-semibold disabled:opacity-60 sm:flex-none"
              >
                {submitting ? 'Placing Order…' : 'Place Order ✓'}
              </button>
            )}
          </div>
        </div>

        <OrderSummary
          cart={checkoutCart}
          shipping={shippingCost}
          discount={discount}
          promoCode={promo?.code}
          compact={step > 1}
        />
      </div>
    </div>
  );
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1.5 block text-sm font-medium text-primary">{label}</label>
      {children}
      {error && <p className="mt-1 text-xs text-strawberry">{error}</p>}
    </div>
  );
}

function inputCls(error, textarea = false) {
  return cn(
    'neo-input px-4 py-2.5 text-sm',
    textarea && 'neo-textarea',
    error && 'neo-input-error'
  );
}
function ConfirmBlock({ title, children }) {
  return (
    <div className="rounded-[1.25rem] bg-cream-dark p-4 shadow-[inset_2px_2px_6px_rgba(61,96,73,0.05)]">
      <h3 className="mb-2 text-xs font-semibold uppercase tracking-wider text-secondary">{title}</h3>
      {children}
    </div>
  );
}

