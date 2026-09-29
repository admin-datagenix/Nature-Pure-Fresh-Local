import { useEffect, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { getCartItemImage } from '../data/productImages';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import OrderModalShell from '../components/orders/OrderModalShell';
import CompactOrderTrackStepper from '../components/orders/CompactOrderTrackStepper';
import { buildOrderTrackingSteps } from '../utils/orderTracking';

function formatProductName(name) {
  return (name || '').replace(/^Freeze Dried /i, '');
}

export default function TrackOrderPage() {
  const { orderId } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const returnTo = location.state?.returnTo || '/account';

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
    navigate(returnTo, { replace: true });
  };

  if (error) {
    return (
      <OrderModalShell titleId="track-order-title" onDismiss={dismiss} wide>
        <div className="p-6 text-center">
          <p className="text-sm text-strawberry">{error}</p>
          <button type="button" onClick={dismiss} className="neo-btn mt-4 w-full py-2.5 text-sm font-semibold">
            Back
          </button>
        </div>
      </OrderModalShell>
    );
  }

  if (!order) {
    return (
      <OrderModalShell titleId="track-order-title" onDismiss={dismiss} wide className="items-center justify-center p-8">
        <LoadingSpinner />
      </OrderModalShell>
    );
  }

  const steps = buildOrderTrackingSteps(order);

  return (
    <OrderModalShell titleId="track-order-title" onDismiss={dismiss} wide>
      <button
        type="button"
        onClick={dismiss}
        className="absolute right-3 top-3 z-10 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-lg leading-none text-primary shadow-sm hover:bg-cream"
        aria-label="Close dialog"
      >
        ×
      </button>

      <div className="border-b border-sage/35 px-5 pb-3 pt-4 text-center">
        <h1 id="track-order-title" className="font-heading text-lg font-semibold text-primary">
          Track your order
        </h1>
        <p className="mt-1 text-[0.65rem] text-muted">
          <Link to="/" className="hover:text-primary" onClick={(e) => e.stopPropagation()}>
            Home
          </Link>
          <span className="mx-1.5">/</span>
          <span>Track order</span>
        </p>
      </div>

      <div className="overflow-y-auto px-4 py-3 sm:px-5">
        <section className="rounded-xl border border-sage/45 bg-cream/25 p-3.5">
          <h2 className="text-sm font-semibold text-primary">Order status</h2>
          <p className="mt-0.5 text-xs text-muted">
            Order ID: <span className="font-semibold text-primary">#{order.id}</span>
          </p>
          <div className="mt-3">
            <CompactOrderTrackStepper steps={steps} />
          </div>
        </section>

        <section className="mt-3 rounded-xl border border-sage/45 bg-white p-3.5">
          <h2 className="mb-2 text-sm font-semibold text-primary">Products</h2>
          <ul className="max-h-36 divide-y divide-sage/35 overflow-y-auto">
            {(order.items || []).map((item) => (
              <li key={item.product_id} className="flex items-center gap-2.5 py-2.5 first:pt-0 last:pb-0">
                <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-sage/40 bg-cream p-0.5">
                  <img src={getCartItemImage(item)} alt="" className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="truncate text-xs font-semibold text-primary">{formatProductName(item.name)}</p>
                  <p className="text-[0.65rem] text-muted">
                    {item.weight_label || item.variant_label || 'NaturePure Fresh'} · {item.quantity} qty
                  </p>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </div>

      <div className="shrink-0 border-t border-sage/40 px-4 py-3.5 sm:px-5">
        <button type="button" onClick={dismiss} className="neo-btn w-full py-2.5 text-sm font-semibold">
          Done
        </button>
      </div>
    </OrderModalShell>
  );
}
