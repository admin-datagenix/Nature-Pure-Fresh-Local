import { MOCK_PRODUCTS } from '../../api/mockData.js';

export function formatOrderDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

export function formatPaymentMethod(method) {
  if (!method) return '—';
  if (method.toLowerCase() === 'cod') return 'Cash on delivery';
  if (method === 'upi') return 'UPI';
  if (method === 'card') return 'Card';
  return String(method).replace(/_/g, ' ');
}

export function formatProductName(name) {
  return (name || '').replace(/^Freeze Dried /i, '');
}

export function getCatalogProductForLineItem(item) {
  const key = item?.product_id || item?.id;
  if (!key) return null;
  return MOCK_PRODUCTS.find((p) => p.id === key) || null;
}

export function getOrderStatusMeta(status) {
  const s = String(status || 'confirmed').toLowerCase();
  if (s.includes('deliver')) {
    return {
      badge: 'Delivered',
      tone: 'success',
      message: 'Your order has been delivered.',
      canTrack: false,
      lineLabel: 'Delivered',
      lineVariant: 'success',
    };
  }
  if (s.includes('ship') || s.includes('transit')) {
    return {
      badge: 'On the way',
      tone: 'transit',
      message: 'Your package is in transit.',
      canTrack: true,
      lineLabel: 'Dispatched',
      lineVariant: 'transit',
    };
  }
  return {
    badge: 'Confirmed',
    tone: 'pending',
    message: 'We are preparing your order.',
    canTrack: true,
    lineLabel: 'Ready for delivery',
    lineVariant: 'ready',
  };
}

export function formatOrderPlacedLabel(iso) {
  if (!iso) return '—';
  const d = new Date(iso);
  const day = d.getDate();
  const suffix =
    day % 10 === 1 && day !== 11
      ? 'st'
      : day % 10 === 2 && day !== 12
        ? 'nd'
        : day % 10 === 3 && day !== 13
          ? 'rd'
          : 'th';
  const month = d.toLocaleDateString('en-IN', { month: 'long' });
  const year = d.getFullYear();
  return `${day}${suffix} ${month} ${year}`;
}

export function formatItemWeight(item) {
  const g = item?.weight_grams;
  if (!g) return 'Standard';
  return g >= 1000 ? `${g / 1000} kg` : `${g}g`;
}

export function orderPaymentFooterText(order) {
  const method = String(order.payment_method || '').toLowerCase();
  if (method === 'cod') return 'Payment due on delivery (Cash on delivery)';
  if (method === 'card') return 'Paid using debit / credit card';
  if (method === 'upi') return 'Paid using UPI';
  return `Paid via ${formatPaymentMethod(order.payment_method)}`;
}

export function orderStatusHeadline(order) {
  const meta = getOrderStatusMeta(order.status);
  const date = formatOrderDate(order.estimated_delivery || order.created_at);
  if (meta.badge === 'Delivered') {
    return `Delivered on ${date}`;
  }
  return `Arriving by ${date}`;
}

/** Top status row on order card (reference-style). */
export function orderCardStatusLine(order) {
  const meta = getOrderStatusMeta(order.status);
  const date = formatOrderDate(order.estimated_delivery || order.created_at);
  if (meta.badge === 'Delivered') return `Delivered on ${date}`;
  if (meta.tone === 'transit') return 'Dispatched';
  return 'Order confirmed';
}

/** Bold title inside the product panel. */
export function orderCardPrimaryText(order) {
  const meta = getOrderStatusMeta(order.status);
  const items = order.items || [];
  const date = formatOrderDate(order.estimated_delivery || order.created_at);
  if (meta.badge === 'Delivered') {
    const name = formatProductName(items[0]?.name) || 'Your order';
    if (items.length <= 1) return name;
    return `${name} · +${items.length - 1} more`;
  }
  return `Arriving by ${date}`;
}

export function orderCardSecondaryText(order) {
  const meta = getOrderStatusMeta(order.status);
  if (meta.badge === 'Delivered') {
    return formatPaymentMethod(order.payment_method);
  }
  return 'Standard delivery · Order #' + (order.id || '');
}

export function isOrderDelivered(order) {
  return getOrderStatusMeta(order.status).badge === 'Delivered';
}

export function isOrderOngoing(order) {
  return !isOrderDelivered(order);
}

export const ORDER_FILTER_TABS = [
  { id: 'all', label: 'All' },
  { id: 'ongoing', label: 'On the way' },
  { id: 'delivered', label: 'Delivered' },
];

export function filterOrdersByTab(orders, tab) {
  if (tab === 'all') return orders;
  return orders.filter((o) => {
    const s = String(o.status || '').toLowerCase();
    if (tab === 'delivered') return s.includes('deliver');
    if (tab === 'ongoing') return !s.includes('deliver');
    return true;
  });
}

const ORDER_RATING_PREFIX = 'npf_order_rating_';

export function loadOrderRating(orderId) {
  try {
    return Number(localStorage.getItem(`${ORDER_RATING_PREFIX}${orderId}`)) || 0;
  } catch {
    return 0;
  }
}

export function saveOrderRating(orderId, value) {
  try {
    localStorage.setItem(`${ORDER_RATING_PREFIX}${orderId}`, String(value));
  } catch {
    /* ignore */
  }
}

