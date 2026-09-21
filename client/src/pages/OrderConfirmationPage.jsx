import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { api } from '../api/client';
import { formatPrice } from '../utils/helpers';
import { getCartItemImage } from '../data/productImages';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import Reveal from '../components/ui/Reveal';

function formatPaymentMethod(method) {
  if (!method) return '—';
  if (method.toLowerCase() === 'cod') return 'COD';
  return method.replace(/_/g, ' ').toUpperCase();
}

function formatProductName(name) {
  return (name || '').replace(/^Freeze Dried /i, '');
}

export default function OrderConfirmationPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    api.getOrder(orderId)
      .then((res) => setOrder(res.data))
      .catch((err) => setError(err.message));
  }, [orderId]);

  if (error) {
    return (
      <div className="mx-auto max-w-lg px-4 py-20 text-center">
        <p className="text-strawberry">{error}</p>
        <Link to="/shop" className="mt-6 inline-block text-primary underline">Continue Shopping</Link>
      </div>
    );
  }

  if (!order) return <LoadingSpinner />;

  const deliveryDate = new Date(order.estimated_delivery).toLocaleDateString('en-IN', {
    weekday: 'long',
    day: 'numeric',
    month: 'long',
  });

  return (
    <div className="site-container max-w-2xl py-10 md:py-16">
      <Reveal className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-secondary/20">
          <svg className="h-8 w-8 text-primary" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M20 6L9 17l-5-5" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
        </div>
        <h1 className="font-heading text-3xl font-semibold text-primary">Order Confirmed!</h1>
        <p className="mt-2 text-sm text-muted">Thank you — your NaturePure Fresh order is placed.</p>
      </Reveal>

      <Reveal delay={80}>
        <article className="overflow-hidden rounded-[1.75rem] border border-sage/50 bg-white p-6 shadow-[0_12px_40px_rgba(41,70,51,0.06)] md:p-8">
          {/* Header */}
          <div className="flex items-start justify-between gap-4 border-b border-sage/60 pb-6">
            <div>
              <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">Order ID</p>
              <p className="mt-1 font-heading text-xl font-bold tracking-tight text-primary md:text-[1.35rem]">
                {order.id}
              </p>
            </div>
            <span className="shrink-0 rounded-full bg-secondary/25 px-4 py-1.5 text-sm font-semibold capitalize text-primary">
              {order.status}
            </span>
          </div>

          {/* Summary grid */}
          <div className="mt-6 grid gap-3 sm:grid-cols-2 sm:gap-4">
            <InfoTile label="Estimated Delivery" value={deliveryDate} />
            <InfoTile label="Total Paid" value={formatPrice(order.total)} />
            <InfoTile label="Payment" value={formatPaymentMethod(order.payment_method)} />
            <InfoTile label="Items" value={`${order.items.length} products`} />
          </div>

          {/* Shipping */}
          <div className="mt-4 rounded-[1.25rem] bg-[#F9F8F5] px-5 py-4">
            <p className="text-[0.65rem] font-semibold uppercase tracking-[0.14em] text-muted">Delivering to</p>
            <p className="mt-2 font-semibold text-primary">{order.shipping_address.name}</p>
            <p className="mt-1 text-sm leading-relaxed text-muted">
              {order.shipping_address.address}, {order.shipping_address.city} — {order.shipping_address.pincode}
            </p>
          </div>

          {/* Line items */}
          <ul className="mt-6 divide-y divide-sage/50 border-t border-sage/60 pt-2">
            {order.items.map((item) => (
              <li key={item.product_id} className="flex items-center gap-4 py-4 first:pt-5">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-xl bg-white p-1">
                  <img src={getCartItemImage(item)} alt={item.name} className="max-h-full max-w-full object-contain" />
                </div>
                <div className="min-w-0 flex-1">
                  <p className="font-medium text-primary">{formatProductName(item.name)}</p>
                  <p className="mt-0.5 text-sm text-muted">Qty: {item.quantity}</p>
                </div>
                <span className="shrink-0 text-base font-semibold text-primary">
                  {formatPrice(item.line_total)}
                </span>
              </li>
            ))}
          </ul>
        </article>
      </Reveal>

      <Reveal delay={160} className="mt-8 flex flex-wrap justify-center gap-3">
        <Link to="/shop" className="neo-btn px-8 py-3.5 text-sm font-semibold">
          Continue Shopping
        </Link>
        <Link to="/" className="neo-btn-ghost px-8 py-3.5 text-sm font-semibold">
          Back to Home
        </Link>
      </Reveal>
    </div>
  );
}

function InfoTile({ label, value }) {
  return (
    <div className="rounded-[1.25rem] bg-[#F0F4F2] px-5 py-4">
      <p className="text-sm text-muted">{label}</p>
      <p className="mt-1 text-base font-semibold leading-snug text-primary">{value}</p>
    </div>
  );
}
