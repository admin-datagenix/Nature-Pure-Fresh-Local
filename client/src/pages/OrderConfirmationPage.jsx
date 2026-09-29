import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { formatPrice } from '../utils/helpers';
import { getCartItemImage } from '../data/productImages';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import OrderModalShell from '../components/orders/OrderModalShell';

function formatPaymentMethod(method) {
  if (!method) return '—';
  if (method.toLowerCase() === 'cod') return 'Cash on delivery';
  return method.replace(/_/g, ' ').toUpperCase();
}

function formatProductName(name) {
  return (name || '').replace(/^Freeze Dried /i, '');
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const fromCheckout = Boolean(location.state?.fromCheckout);

  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getOrder(orderId)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message));
  }, [orderId]);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  const dismiss = () => {
    navigate(fromCheckout ? '/account' : '/shop', { replace: true });
  };

  if (error) {
    return (
      <OrderModalShell titleId="order-success-title" onDismiss={dismiss}>
        <div className="p-6 text-center">
          <p className="text-sm text-strawberry">{error}</p>
          <button type="button" onClick={dismiss} className="neo-btn mt-4 w-full py-2.5 text-sm font-semibold">
            Continue
          </button>
        </div>
      </OrderModalShell>
    );
  }

  if (!order) {
    return (
      <OrderModalShell titleId="order-success-title" onDismiss={dismiss} className="items-center justify-center p-8">
        <LoadingSpinner />
      </OrderModalShell>
    );
  }

  const deliveryShort = new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
  });

  return (
    <OrderModalShell titleId="order-success-title" onDismiss={dismiss}>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-primary shadow-sm hover:bg-cream"
        aria-label="Close dialog"
      >
        ×
      </button>

      <div className="border-b border-sage/35 bg-secondary/12 px-5 pb-4 pt-5 text-center">
        <div className="mx-auto mb-2 flex h-11 w-11 items-center justify-center rounded-full bg-secondary/35">
          <svg className="h-5 w-5 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 id="order-success-title" className="font-heading text-base font-semibold text-primary">
          Order placed successfully
        </h1>
        <p className="mt-0.5 text-[0.7rem] text-muted">Thank you — NaturePure Fresh</p>
      </div>

      <div className="overflow-y-auto px-5 py-3.5 text-sm">
        <dl className="space-y-2.5">
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Order ID</dt>
            <dd className="text-right font-semibold text-primary">{order.id}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Delivery by</dt>
            <dd className="font-medium text-primary">{deliveryShort}</dd>
          </div>
          <div className="flex justify-between gap-2">
            <dt className="text-muted">Payment</dt>
            <dd className="font-medium text-primary">{formatPaymentMethod(order.payment_method)}</dd>
          </div>
          <div className="flex justify-between gap-2 border-t border-sage/35 pt-2.5">
            <dt className="font-medium text-primary">Amount paid</dt>
            <dd className="font-heading font-bold text-primary">{formatPrice(order.total)}</dd>
          </div>
        </dl>

        <details className="mt-3 rounded-lg border border-sage/40 bg-cream/40 px-3 py-2">
          <summary className="cursor-pointer text-xs font-semibold text-primary/85">
            View items ({order.items.length})
          </summary>
          <ul className="mt-2 max-h-32 space-y-2 overflow-y-auto pr-1">
            {order.items.map((item) => (
              <li key={item.product_id} className="flex items-center gap-2 text-xs">
                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-sage/40 bg-white p-0.5">
                  <img src={getCartItemImage(item)} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <span className="min-w-0 flex-1 text-primary">{formatProductName(item.name)}</span>
                <span className="text-muted">×{item.quantity}</span>
              </li>
            ))}
          </ul>
        </details>
      </div>

      <div className="mt-auto flex shrink-0 flex-col gap-2 border-t border-sage/40 bg-white px-5 py-4">
        <Link
          to={`/track-order/${order.id}`}
          replace
          state={{ returnTo: fromCheckout ? '/account' : '/shop' }}
          className="neo-btn w-full py-2.5 text-center text-sm font-semibold"
        >
          Track order
        </Link>
        <button
          type="button"
          onClick={dismiss}
          className="neo-btn-ghost w-full py-2.5 text-sm font-semibold"
        >
          Continue shopping
        </button>
      </div>
    </OrderModalShell>
  );
}
