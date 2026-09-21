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

const H_SCROLL =
  'flex gap-4 overflow-x-auto pb-2 scroll-smooth snap-x snap-mandatory [scrollbar-width:thin] [&::-webkit-scrollbar]:h-1.5 [&::-webkit-scrollbar-thumb]:rounded-full [&::-webkit-scrollbar-thumb]:bg-sage/80';

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

function Panel({ title, description, children, className, action }) {
  return (
    <section
      className={cn(
        'min-w-0 overflow-hidden rounded-[24px] border border-sage/55 bg-cream shadow-[0_6px_20px_rgba(41,70,51,0.05)]',
        className
      )}
    >
      <div className="flex flex-wrap items-end justify-between gap-2 border-b border-sage/45 px-4 py-3.5 sm:px-5">
        <div>
          <h2 className="font-heading text-base font-semibold text-primary sm:text-lg">{title}</h2>
          {description ? <p className="mt-0.5 text-xs text-muted sm:text-sm">{description}</p> : null}
        </div>
        {action}
      </div>
      <div className="px-4 py-4 sm:px-5 sm:py-5">{children}</div>
    </section>
  );
}

export default function AccountPage() {
  const { user, loading, authLoading, logout, isAuthenticated, refreshUser } = useAuth();
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
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="font-heading text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            My Account
          </h1>
          <p className="mt-1 text-sm text-muted">
            Hi {firstName} — orders, addresses, and profile in one dashboard
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <Link
            to="/shop"
            className="inline-flex rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary transition hover:bg-primary hover:text-white"
          >
            Shop
          </Link>
          <button
            type="button"
            onClick={logout}
            disabled={authLoading}
            className="rounded-full px-4 py-2 text-sm font-medium text-strawberry transition hover:bg-strawberry/10 disabled:opacity-50"
          >
            {authLoading ? '…' : 'Sign out'}
          </button>
        </div>
      </header>

      <div className="mt-6 grid gap-5 lg:grid-cols-[280px_minmax(0,1fr)] lg:gap-6 xl:grid-cols-[300px_minmax(0,1fr)]">
        {/* Left: profile + stats (compact, no long scroll) */}
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-[24px] border border-sage/55 bg-cream shadow-[0_6px_20px_rgba(41,70,51,0.05)]">
            <div className="bg-cream-dark/75 px-4 py-5">
              <div className="flex items-center gap-3">
                <div
                  className="flex h-12 w-12 shrink-0 items-center justify-center rounded-[16px] border border-sage/50 bg-white font-heading text-base font-bold text-primary"
                  aria-hidden="true"
                >
                  {getInitials(user.name)}
                </div>
                <div className="min-w-0">
                  <p className="truncate font-heading text-lg font-semibold text-primary">{user.name}</p>
                  <p className="truncate text-xs text-muted">{user.email}</p>
                </div>
              </div>
              {user.phone && (
                <p className="mt-3 text-xs text-muted">
                  {formatIndianPhone(user.phone)}
                  {user.phone_verified && (
                    <span className="ml-2 font-semibold text-secondary">Verified</span>
                  )}
                </p>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2 p-3">
              <MiniStat label="Orders" value={String(stats.orderCount)} />
              <MiniStat label="Spent" value={formatPrice(stats.totalSpent)} />
              <MiniStat label="Since" value={memberSince} />
              <MiniStat label="News" value={newsletterOn ? 'On' : 'Off'} />
            </div>
          </div>
        </aside>

        {/* Right: horizontal panels */}
        <div className="flex min-w-0 flex-col gap-5">
          <Panel
            title="Order history"
            description="Swipe sideways to browse orders"
            action={
              orders.length > 1 ? (
                <span className="text-xs text-muted">Scroll →</span>
              ) : null
            }
          >
            {ordersLoading ? (
              <p className="text-sm text-muted">Loading…</p>
            ) : orders.length === 0 ? (
              <div className="flex flex-wrap items-center justify-between gap-4 rounded-[20px] border border-dashed border-sage/55 bg-cream-dark/40 px-4 py-5">
                <p className="text-sm text-muted">No orders yet.</p>
                <Link
                  to="/shop"
                  className="shrink-0 rounded-full border border-primary px-4 py-2 text-sm font-medium text-primary hover:bg-primary hover:text-white"
                >
                  Browse products
                </Link>
              </div>
            ) : (
              <ul className={H_SCROLL}>
                {orders.map((order) => (
                  <li
                    key={order.id}
                    className="w-[min(100%,280px)] shrink-0 snap-start rounded-[20px] border border-sage/45 bg-cream-dark/40 p-4 sm:w-[300px]"
                  >
                    <div className="flex items-start justify-between gap-2">
                      <p className="font-heading text-sm font-semibold text-primary">{order.id}</p>
                      <span className="rounded-full bg-secondary/15 px-2 py-0.5 text-[0.6rem] font-semibold capitalize text-secondary">
                        {order.status || 'confirmed'}
                      </span>
                    </div>
                    <p className="mt-1 text-xs text-muted">
                      {formatOrderDate(order.created_at)} · {formatPrice(order.total)}
                    </p>
                    {order.items?.length > 0 && (
                      <div className="mt-3 flex gap-1.5">
                        {order.items.slice(0, 3).map((item) => (
                          <img
                            key={item.id || item.product_id}
                            src={getCartItemImage(item)}
                            alt=""
                            className="h-10 w-10 rounded-lg border border-sage/45 bg-white object-contain p-0.5"
                          />
                        ))}
                      </div>
                    )}
                    <p className="mt-2 text-[0.65rem] text-muted">{formatPaymentMethod(order.payment_method)}</p>
                    <Link
                      to={`/order-confirmation/${order.id}`}
                      className="mt-2 inline-block text-xs font-medium text-primary underline underline-offset-2"
                    >
                      Details
                    </Link>
                  </li>
                ))}
              </ul>
            )}
          </Panel>

          <div className="grid min-w-0 gap-5 md:grid-cols-2">
            <Panel title="Saved addresses" description="Horizontal list">
              {savedAddresses.length === 0 ? (
                <p className="text-sm text-muted">Set your default address in Profile →</p>
              ) : (
                <ul className={H_SCROLL}>
                  {savedAddresses.map((addr) => (
                    <li
                      key={addr.id}
                      className="w-[min(100%,260px)] shrink-0 snap-start rounded-[20px] border border-sage/45 bg-cream-dark/40 px-3.5 py-3 text-sm sm:w-[280px]"
                    >
                      <div className="flex items-center gap-2">
                        <p className="font-medium text-primary">{addr.label}</p>
                        {addr.isDefault && (
                          <span className="rounded-full bg-primary/10 px-1.5 py-0.5 text-[0.55rem] font-bold uppercase text-primary">
                            Default
                          </span>
                        )}
                      </div>
                      <div className="mt-1.5 line-clamp-4 text-xs leading-relaxed text-muted">
                        {addr.lines.join(' · ')}
                      </div>
                    </li>
                  ))}
                </ul>
              )}
            </Panel>

            <Panel title="Profile" description="Name & delivery address">
              <form onSubmit={handleProfileSave} className="space-y-3">
                <label className="block">
                  <span className="text-xs text-muted">Full name</span>
                  <input
                    type="text"
                    value={profileForm.name}
                    onChange={(e) => setProfileForm((f) => ({ ...f, name: e.target.value }))}
                    className="neo-input mt-1 px-3 py-2 text-sm"
                  />
                </label>
                <label className="block">
                  <span className="text-xs text-muted">Address</span>
                  <textarea
                    value={profileForm.address}
                    onChange={(e) => setProfileForm((f) => ({ ...f, address: e.target.value }))}
                    rows={2}
                    className="neo-input neo-textarea mt-1 px-3 py-2 text-sm"
                  />
                </label>
                <p className="text-[0.65rem] text-muted">
                  Password:{' '}
                  <Link to="/forgot-password" className="text-primary underline">
                    Reset
                  </Link>
                </p>
                {profileError && <p className="text-xs text-strawberry">{profileError}</p>}
                {profileMessage && <p className="text-xs text-secondary">{profileMessage}</p>}
                <button type="submit" disabled={profileSaving} className="neo-btn px-4 py-2 text-sm disabled:opacity-60">
                  {profileSaving ? 'Saving…' : 'Save'}
                </button>
              </form>
            </Panel>
          </div>

          <Panel title="Support & links" description="Reach us anytime">
            <div className={cn(H_SCROLL, 'items-stretch')}>
              <HelpBlock
                className="w-[240px] shrink-0 snap-start sm:w-[260px]"
                title="Customer support"
                lines={[BRAND_PHONE, BRAND_EMAIL, 'Mon–Sat 9–6 IST']}
              />
              <HelpBlock
                className="w-[240px] shrink-0 snap-start sm:w-[260px]"
                title="Quick links"
                links={[
                  { to: '/shop', label: 'Shop' },
                  { to: '/cart', label: 'Cart' },
                  { to: '/about', label: 'About' },
                ]}
              />
              <div className="flex w-[240px] shrink-0 snap-start flex-col justify-center rounded-[20px] border border-sage/45 bg-cream-dark/40 px-4 py-4 sm:w-[260px]">
                <p className="text-sm font-semibold text-primary">Delivery address on file</p>
                <p className="mt-2 line-clamp-3 text-xs leading-relaxed text-muted">
                  {user.address || 'Add an address in Profile to speed up checkout.'}
                </p>
              </div>
            </div>
          </Panel>
        </div>
      </div>
    </div>
  );
}

function MiniStat({ label, value }) {
  return (
    <div className="rounded-[14px] border border-sage/40 bg-cream px-2.5 py-2">
      <p className="text-[0.6rem] font-semibold uppercase tracking-wide text-muted">{label}</p>
      <p className="mt-0.5 truncate font-heading text-xs font-semibold text-primary">{value}</p>
    </div>
  );
}

function HelpBlock({ title, lines, links, className }) {
  return (
    <div className={cn('rounded-[20px] border border-sage/45 bg-cream-dark/40 px-4 py-3.5', className)}>
      <p className="text-sm font-semibold text-primary">{title}</p>
      {lines?.length > 0 && (
        <ul className="mt-2 space-y-1 text-xs text-muted">
          {lines.map((line) => (
            <li key={line}>{line}</li>
          ))}
        </ul>
      )}
      {links?.length > 0 && (
        <ul className="mt-2 flex flex-wrap gap-x-3 gap-y-1 text-xs">
          {links.map((link) => (
            <li key={link.to}>
              <Link to={link.to} className="font-medium text-primary hover:underline">
                {link.label}
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
