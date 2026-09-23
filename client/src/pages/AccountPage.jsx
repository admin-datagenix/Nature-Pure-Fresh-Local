import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatIndianPhone } from '../components/auth/AuthForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import { formatPrice } from '../utils/helpers';
import { BRAND_EMAIL, BRAND_PHONE } from '../data/brand';
import { getCartItemImage } from '../data/productImages';
import { cn } from '../lib/cn';

const NEWSLETTER_KEY = 'fresh_nature_newsletter';

const TABS = [
  { id: 'profile', label: 'Profile' },
  { id: 'orders', label: 'My Orders' },
  { id: 'addresses', label: 'Addresses' },
  { id: 'help', label: 'Help & support' },
];

function getInitials(name) {
  return (name || 'U')
    .split(/\s+/)
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join('');
}

function formatOrderDate(iso) {
  if (!iso) return '—';
  return new Date(iso).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric',
  });
}

function formatPaymentMethod(method) {
  if (!method) return '—';
  if (method.toLowerCase() === 'cod') return 'Cash on delivery';
  if (method === 'upi') return 'UPI';
  if (method === 'card') return 'Card';
  return String(method).replace(/_/g, ' ');
}

function collectSavedAddresses(user, orders) {
  const seen = new Set();
  const list = [];

  const add = (label, lines, isDefault = false) => {
    const key = lines.join('|').toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    list.push({ id: key, label, lines, isDefault });
  };

  if (user?.address) {
    add('Profile address', [user.address], true);
  }

  for (const order of orders) {
    const s = order.shipping_address;
    if (!s) continue;
    const lines = [
      s.name,
      s.address,
      [s.city, s.state, s.pincode].filter(Boolean).join(', '),
      s.phone ? `Phone: ${s.phone}` : null,
    ].filter(Boolean);
    add(`Order ${order.id}`, lines);
  }

  return list;
}

function isNewsletterSubscribed(email) {
  if (!email) return false;
  try {
    const raw = localStorage.getItem(NEWSLETTER_KEY);
    const list = raw ? JSON.parse(raw) : [];
    return Array.isArray(list) && list.some((e) => String(e).toLowerCase() === email.toLowerCase());
  } catch {
    return false;
  }
}

export default function AccountPage() {
  const { user, loading, authLoading, logout, isAuthenticated, refreshUser } = useAuth();
  const [tab, setTab] = useState('profile');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({ name: '', address: '' });
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    if (!user) return;
    setProfileForm({ name: user.name || '', address: user.address || '' });
  }, [user]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setOrdersLoading(true);
    api
      .getOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  const stats = useMemo(() => {
    const totalSpent = orders.reduce((sum, o) => sum + Number(o.total || 0), 0);
    return { orderCount: orders.length, totalSpent };
  }, [orders]);

  const savedAddresses = useMemo(
    () => (user ? collectSavedAddresses(user, orders) : []),
    [user, orders]
  );

  const memberSince = user?.created_at
    ? new Date(user.created_at).toLocaleDateString('en-IN', { month: 'short', year: 'numeric' })
    : '—';

  const newsletterOn = user ? isNewsletterSubscribed(user.email) : false;

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: '/account' } }} />;
  }

  const firstName = user.name.split(' ')[0];

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    setProfileError(null);
    try {
      await api.updateProfile(profileForm);
      await refreshUser();
      setProfileMessage('Profile saved.');
    } catch (err) {
      setProfileError(err.message || 'Could not update profile');
    } finally {
      setProfileSaving(false);
    }
  };

  return (
    <div className="site-container py-8 md:py-10">
      <header className="flex flex-wrap items-center justify-between gap-4 border-b border-sage/40 pb-5">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            My Account
          </h1>
          <p className="mt-1 text-sm text-muted">Hi {firstName} — manage profile, orders, and addresses</p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/shop"
            className="label-chip inline-flex border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            Continue shopping
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={authLoading}
            className="label-chip px-4 py-2 text-sm font-medium text-strawberry transition hover:bg-strawberry/10 disabled:opacity-50"
          >
            {authLoading ? '…' : 'Logout'}
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-6 lg:grid-cols-[240px_minmax(0,1fr)]">
        <aside className="h-fit rounded-sm border border-sage/55 bg-white shadow-[0_4px_16px_rgba(41,70,51,0.05)]">
          <div className="border-b border-sage/45 px-4 py-4">
            <div className="flex items-center gap-3">
              <div
                className="flex h-11 w-11 shrink-0 items-center justify-center rounded-sm border border-sage/50 bg-cream font-heading text-sm font-bold text-primary"
                aria-hidden="true"
              >
                {getInitials(user.name)}
              </div>
              <div className="min-w-0">
                <p className="truncate text-sm font-semibold text-primary">{user.name}</p>
                <p className="truncate text-xs text-muted">{user.email}</p>
              </div>
            </div>
            <dl className="mt-3 grid grid-cols-2 gap-2 text-xs">
              <div>
                <dt className="text-muted">Orders</dt>
                <dd className="font-semibold text-primary">{stats.orderCount}</dd>
              </div>
              <div>
                <dt className="text-muted">Spent</dt>
                <dd className="font-semibold text-primary">{formatPrice(stats.totalSpent)}</dd>
              </div>
            </dl>
          </div>
          <nav className="flex flex-row flex-wrap lg:flex-col lg:p-1">
            {TABS.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => setTab(item.id)}
                className={cn(
                  'flex-1 border-b-2 px-4 py-3 text-left text-sm font-medium transition lg:flex-none lg:border-b-0 lg:border-l-[3px]',
                  tab === item.id
                    ? 'border-primary bg-cream/80 text-primary lg:bg-cream/50'
                    : 'border-transparent text-primary/75 hover:bg-cream/40 hover:text-primary'
                )}
              >
                {item.label}
              </button>
            ))}
          </nav>
        </aside>

        <main className="min-w-0 rounded-sm border border-sage/55 bg-white p-5 shadow-[0_4px_16px_rgba(41,70,51,0.05)] md:p-6">
          {tab === 'profile' && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-primary">Personal information</h2>
              <p className="mt-1 text-sm text-muted">
                Member since {memberSince} · Newsletter {newsletterOn ? 'subscribed' : 'off'}
              </p>
              {user.phone && (
                <p className="mt-2 text-sm text-muted">
                  {formatIndianPhone(user.phone)}
                  {user.phone_verified && (
                    <span className="label-chip ml-2 bg-secondary/15 px-1.5 py-0.5 text-[0.65rem] font-semibold text-secondary">
                      Verified
                    </span>
                  )}
                </p>
              )}
              <form onSubmit={handleProfileSave} className="mt-6 max-w-lg space-y-4">
                <label className="block">
                  <span className="text-xs font-medium text-muted">Full name</span>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                    className="neo-input mt-1 px-3 py-2 text-sm"
                    placeholder="Your full name"
                  />
                </label>
                <label className="block">
                  <span className="text-xs font-medium text-muted">Default delivery address</span>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) => setProfileForm((f) => ({ ...f, address: e.target.value }))}
                    rows={3}
                    className="neo-input neo-textarea mt-1 px-3 py-2 text-sm"
                    placeholder="116/3, Shivaji Road, Miraj, 416410"
                  />
                </label>
                <p className="text-xs text-muted">
                  Password:{' '}
                  <Link to="/forgot-password" className="font-medium text-primary underline">
                    Reset via email
                  </Link>
                </p>
                {profileError && <p className="text-xs text-strawberry">{profileError}</p>}
                {profileMessage && <p className="text-xs text-secondary">{profileMessage}</p>}
                <button type="submit" disabled={profileSaving} className="neo-btn px-5 py-2 text-sm disabled:opacity-60">
                  {profileSaving ? 'Saving…' : 'Save changes'}
                </button>
              </form>
            </div>
          )}

          {tab === 'orders' && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-primary">Order history</h2>
              <p className="mt-1 text-sm text-muted">Track deliveries and open order details</p>
              {ordersLoading ? (
                <p className="mt-6 text-sm text-muted">Loading orders…</p>
              ) : orders.length === 0 ? (
                <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border border-dashed border-sage/55 bg-cream/50 px-4 py-6">
                  <p className="text-sm text-muted">You have not placed any orders yet.</p>
                  <Link
                    to="/shop"
                    className="label-chip shrink-0 border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                  >
                    Start shopping
                  </Link>
                </div>
              ) : (
                <ul className="mt-6 divide-y divide-sage/40">
                  {orders.map((order) => (
                    <li key={order.id} className="flex flex-col gap-3 py-4 first:pt-0 sm:flex-row sm:items-start sm:justify-between">
                      <div className="min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <p className="font-heading text-sm font-semibold text-primary">{order.id}</p>
                          <span className="label-chip bg-secondary/15 px-2 py-0.5 text-[0.65rem] font-semibold capitalize text-secondary">
                            {order.status || 'confirmed'}
                          </span>
                        </div>
                        <p className="mt-1 text-xs text-muted">
                          {formatOrderDate(order.created_at)} · {formatPaymentMethod(order.payment_method)} ·{' '}
                          <span className="font-medium text-primary">{formatPrice(order.total)}</span>
                        </p>
                        {order.items?.length > 0 && (
                          <div className="mt-3 flex flex-wrap gap-2">
                            {order.items.slice(0, 4).map((item) => (
                              <img
                                key={item.id || item.product_id}
                                src={getCartItemImage(item)}
                                alt=""
                                className="h-12 w-12 border border-sage/45 bg-white object-contain p-0.5"
                              />
                            ))}
                          </div>
                        )}
                      </div>
                      <Link
                        to={`/order-confirmation/${order.id}`}
                        className="label-chip shrink-0 self-start border border-sage/60 px-3 py-1.5 text-xs font-semibold text-primary hover:bg-cream"
                      >
                        View details
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'addresses' && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-primary">Saved addresses</h2>
              <p className="mt-1 text-sm text-muted">From your profile and past orders</p>
              {savedAddresses.length === 0 ? (
                <p className="mt-6 text-sm text-muted">
                  No saved addresses yet. Add one under{' '}
                  <button type="button" onClick={() => setTab('profile')} className="font-medium text-primary underline">
                    Profile
                  </button>
                  .
                </p>
              ) : (
                <ul className="mt-6 grid gap-4 sm:grid-cols-2">
                  {savedAddresses.map((addr) => (
                    <li key={addr.id} className="border border-sage/45 bg-cream/40 p-4">
                      <div className="flex items-center gap-2">
                        <p className="text-sm font-semibold text-primary">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="label-chip bg-primary/10 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <p className="mt-2 text-xs leading-relaxed text-muted">{addr.lines.join(' · ')}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {tab === 'help' && (
            <div>
              <h2 className="font-heading text-lg font-semibold text-primary">Help &amp; support</h2>
              <p className="mt-1 text-sm text-muted">We are here for orders, returns, and product questions</p>
              <div className="mt-6 grid gap-4 sm:grid-cols-2">
                <div className="border border-sage/45 bg-cream/40 p-4">
                  <p className="text-sm font-semibold text-primary">Customer care</p>
                  <ul className="mt-2 space-y-1 text-xs text-muted">
                    <li>{BRAND_PHONE}</li>
                    <li>{BRAND_EMAIL}</li>
                    <li>Mon–Sat, 9 AM – 6 PM IST</li>
                  </ul>
                </div>
                <div className="border border-sage/45 bg-cream/40 p-4">
                  <p className="text-sm font-semibold text-primary">Quick links</p>
                  <ul className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs">
                    <li>
                      <Link to="/shop" className="font-medium text-primary hover:underline">
                        Shop
                      </Link>
                    </li>
                    <li>
                      <Link to="/cart" className="font-medium text-primary hover:underline">
                        Cart
                      </Link>
                    </li>
                    <li>
                      <Link to="/contact" className="font-medium text-primary hover:underline">
                        Contact us
                      </Link>
                    </li>
                  </ul>
                </div>
              </div>
              <p className="mt-6 text-xs leading-relaxed text-muted">
                Delivery address on file: {user.address || 'None — update in Profile for faster checkout.'}
              </p>
            </div>
          )}
        </main>
      </div>
    </div>
  );
}
