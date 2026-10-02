import { MOCK_PRODUCTS } from '../api/mockData.js';

/** Sample orders for My Orders UI preview (merged in mockApi.getOrders). */
export const DEMO_ORDERS_ENABLED = true;

const DEMO_PREFIX = 'DEMO-FN-';

export function isDemoOrderId(orderId) {
  return String(orderId || '').startsWith(DEMO_PREFIX);
}

function productById(id) {
  return MOCK_PRODUCTS.find((p) => p.id === id);
}

function lineItem(productId, quantity = 1) {
  const product = productById(productId);
  if (!product) return null;
  const price = product.price;
  const image =
    product.image?.replace?.('/catalog/snacks/', '/products/snacks/') ?? product.image;
  return {
    id: productId,
    product_id: productId,
    quantity,
    name: product.name,
    slug: product.slug,
    price,
    image,
    category_name: product.category_name,
    weight_grams: product.weight_grams || 50,
    line_total: price * quantity,
  };
}

function demoAddress(user) {
  return {
    name: user?.name || 'Demo User',
    email: user?.email || 'demo@freshnature.in',
    phone: user?.phone || '9876543210',
    address: user?.address || '12 Orchard Lane, Koregaon Park',
    city: 'Pune',
    state: 'Maharashtra',
    pincode: '411001',
  };
}

function daysAgo(n) {
  return new Date(Date.now() - n * 24 * 60 * 60 * 1000).toISOString();
}

function daysFromNow(n) {
  return new Date(Date.now() + n * 24 * 60 * 60 * 1000).toISOString();
}

function buildDemoOrder({ id, userId, user, status, createdAt, estimatedDelivery, items, payment }) {
  const lines = items.map(([pid, qty]) => lineItem(pid, qty)).filter(Boolean);
  const subtotal = lines.reduce((sum, i) => sum + i.line_total, 0);
  const shipping = subtotal >= 999 ? 0 : 49;
  const total = subtotal + shipping;

  return {
    id,
    user_id: userId,
    items: lines,
    subtotal,
    shipping,
    discount: 0,
    promoCode: null,
    total,
    shipping_address: demoAddress(user),
    payment_method: payment,
    payment_status: payment === 'cod' ? 'pending' : 'paid',
    status,
    created_at: createdAt,
    estimated_delivery: estimatedDelivery,
  };
}

/**
 * Fixed demo orders: in-transit, confirmed, and delivered examples.
 */
export function getDemoAccountOrders(userId, user) {
  if (!DEMO_ORDERS_ENABLED || !userId) return [];

  return [
    buildDemoOrder({
      id: `${DEMO_PREFIX}WAY-001`,
      userId,
      user,
      status: 'in_transit',
      createdAt: daysAgo(2),
      estimatedDelivery: daysFromNow(1),
      payment: 'upi',
      items: [['snack-10', 1], ['snack-11', 2], ['snack-02', 1]],
    }),
    buildDemoOrder({
      id: `${DEMO_PREFIX}WAY-002`,
      userId,
      user,
      status: 'confirmed',
      createdAt: daysAgo(1),
      estimatedDelivery: daysFromNow(3),
      payment: 'cod',
      items: [['combo-01', 1], ['snack-08', 1]],
    }),
    buildDemoOrder({
      id: `${DEMO_PREFIX}DEL-001`,
      userId,
      user,
      status: 'delivered',
      createdAt: daysAgo(12),
      estimatedDelivery: daysAgo(8),
      payment: 'card',
      items: [['snack-09', 2]],
    }),
    buildDemoOrder({
      id: `${DEMO_PREFIX}DEL-002`,
      userId,
      user,
      status: 'delivered',
      createdAt: daysAgo(28),
      estimatedDelivery: daysAgo(24),
      payment: 'upi',
      items: [['powder-01', 1], ['powder-03', 1]],
    }),
  ];
}

export function getDemoOrderById(orderId, userId, user) {
  if (!isDemoOrderId(orderId)) return null;
  return getDemoAccountOrders(userId, user).find((o) => o.id === orderId) || null;
}
