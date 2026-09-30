import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatIndianPhone } from '../components/auth/AuthForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NeoSelect from '../components/ui/NeoSelect';
import { formatPrice } from '../utils/helpers';
import { getCartItemImage } from '../data/productImages';
import { cn } from '../lib/cn';
import { BRAND_EMAIL, BRAND_PHONE } from '../data/brand';
import AccountTrustBar from '../components/account/AccountTrustBar';

const GENDER_STORAGE_PREFIX = 'npf_profile_gender_';

function splitFullName(full) {
  const parts = String(full || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function loadStoredGender(userId) {
  if (!userId) return '';
  try {
    return localStorage.getItem(`${GENDER_STORAGE_PREFIX}${userId}`) || '';
  } catch {
    return '';
  }
}

function storeGender(userId, value) {
  if (!userId) return;
  try {
    if (value) localStorage.setItem(`${GENDER_STORAGE_PREFIX}${userId}`, value);
    else localStorage.removeItem(`${GENDER_STORAGE_PREFIX}${userId}`);
  } catch {
    /* ignore */
  }
}

function ProfileFieldLabel({ children }) {
  return <span className="mb-1 block text-xs font-medium text-primary">{children}</span>;
}

/** Same inset fields as NeoSelect / checkout address form */
function profileInputClass(extra = '') {
  return cn('neo-input px-3 py-2 text-sm', extra);
}

const MENU = [
  { id: 'profile', label: 'Personal Information' },
  { id: 'orders', label: 'My Orders' },
  { id: 'addresses', label: 'Manage Address' },
  { id: 'password', label: 'Password Manager' },
  { id: 'help', label: 'Help' },
];


function isPlaceholderMobileEmail(email) {
  return /@mobile\.naturepure\.in$/i.test(String(email || '').trim());
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

function formatProductName(name) {
  return (name || '').replace(/^Freeze Dried /i, '');
}

function getOrderStatusMeta(status) {
  const s = String(status || 'confirmed').toLowerCase();
  if (s.includes('deliver')) {
    return {
      badge: 'Delivered',
      badgeClass: 'bg-secondary/15 text-secondary',
      message: 'Your order has been delivered.',
      primaryAction: 'Add review',
    };
  }
  if (s.includes('ship') || s.includes('transit')) {
    return {
      badge: 'In transit',
      badgeClass: 'bg-mango/30 text-primary',
      message: 'Your order is on the way.',
      primaryAction: 'Track order',
    };
  }
  return {
    badge: 'Accepted',
    badgeClass: 'bg-mango/25 text-primary',
    message: 'Your order has been accepted.',
    primaryAction: 'Track order',
  };
}

function deliveryLabel(order) {
  const meta = getOrderStatusMeta(order.status);
  if (meta.badge === 'Delivered') {
    return `Delivered ${formatOrderDate(order.estimated_delivery || order.created_at)}`;
  }
  return `Est. delivery ${formatOrderDate(order.estimated_delivery)}`;
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
    add('Home', [user.address], true);
  }

  for (const order of orders) {
    const s = order.shipping_address;
    if (!s) continue;
    const lines = [
      s.name,
      s.address,
      [s.city, s.state, s.pincode].filter(Boolean).join(', '),
      s.phone ? s.phone : null,
    ].filter(Boolean);
    add(`Order ${order.id}`, lines);
  }

  return list;
}

function AccountOrderCard({ order }) {
  const statusMeta = getOrderStatusMeta(order.status);

  return (
    <article className="overflow-hidden rounded-xl border border-sage/50 bg-white shadow-[0_4px_16px_rgba(41,70,51,0.05)]">
      <div className="account-order-card__bar grid grid-cols-2 gap-3 bg-secondary/20 px-4 py-3 text-xs sm:grid-cols-4 md:px-5 md:text-sm">
        <div>
          <p className="font-semibold uppercase tracking-wide text-primary/70">Order ID</p>
          <p className="mt-0.5 font-semibold text-primary">{order.id}</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wide text-primary/70">Total payment</p>
          <p className="mt-0.5 font-semibold text-primary">{formatPrice(order.total)}</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wide text-primary/70">Payment method</p>
          <p className="mt-0.5 font-medium text-primary">{formatPaymentMethod(order.payment_method)}</p>
        </div>
        <div>
          <p className="font-semibold uppercase tracking-wide text-primary/70">Delivery</p>
          <p className="mt-0.5 font-medium text-primary">{deliveryLabel(order)}</p>
        </div>
      </div>

      <ul className="divide-y divide-sage/35 px-4 md:px-5">
        {(order.items || []).map((item) => (
          <li key={item.id || item.product_id} className="flex items-center gap-3 py-3">
            <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-lg border border-sage/45 bg-cream p-1">
              <img src={getCartItemImage(item)} alt="" className="max-h-full max-w-full object-contain" />
            </div>
            <div className="min-w-0">
              <p className="font-heading text-sm font-semibold text-primary">{formatProductName(item.name)}</p>
              <p className="text-xs text-muted">{item.category_name || 'NaturePure Fresh'}</p>
            </div>
          </li>
        ))}
      </ul>

      <div className="border-t border-sage/40 px-4 py-3 md:px-5">
        <div className="flex flex-wrap items-center gap-2">
          <span className={cn('label-chip px-2.5 py-1 text-xs font-semibold', statusMeta.badgeClass)}>
            {statusMeta.badge}
          </span>
          <span className="text-sm text-muted">{statusMeta.message}</span>
        </div>

        <div className="mt-3 flex flex-wrap items-center gap-2">
          {statusMeta.primaryAction === 'Track order' ? (
            <Link
              to={`/track-order/${order.id}`}
              state={{ returnTo: '/account' }}
              className="neo-btn inline-flex min-h-9 items-center rounded-md px-4 py-2 text-xs font-semibold sm:text-sm"
            >
              Track order
            </Link>
          ) : (
            <button
              type="button"
              disabled
              className="neo-btn inline-flex min-h-9 cursor-not-allowed items-center rounded-md px-4 py-2 text-xs font-semibold opacity-55 sm:text-sm"
            >
              {statusMeta.primaryAction}
            </button>
          )}
          <Link
            to={`/order-confirmation/${order.id}`}
            className="inline-flex min-h-9 items-center rounded-md border border-primary bg-white px-4 py-2 text-xs font-semibold text-primary transition hover:bg-cream sm:text-sm"
          >
            View details
          </Link>
        </div>
      </div>
    </article>
  );
}

export default function AccountPage() {
  const { user, loading, authLoading, logout, isAuthenticated, refreshUser } = useAuth();
  const location = useLocation();
  const [section, setSection] = useState('orders');
  const [orderSort, setOrderSort] = useState('all');
  const [orders, setOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(true);
  const [profileForm, setProfileForm] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    gender: '',
    address: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);

  useEffect(() => {
    if (!user) return;
    const { firstName, lastName } = splitFullName(user.name);
    setProfileForm({
      firstName,
      lastName,
      email: isPlaceholderMobileEmail(user.email) ? '' : user.email || '',
      phone: user.phone || '',
      gender: loadStoredGender(user.id),
      address: user.address || '',
    });
  }, [user]);

  useEffect(() => {
    const next = location.state?.section;
    if (next && MENU.some((m) => m.id === next)) setSection(next);
  }, [location.state?.section]);

  useEffect(() => {
    if (!isAuthenticated) return;
    setOrdersLoading(true);
    api
      .getOrders()
      .then((res) => setOrders(res.data || []))
      .catch(() => setOrders([]))
      .finally(() => setOrdersLoading(false));
  }, [isAuthenticated]);

  const filteredOrders = useMemo(() => {
    if (orderSort === 'all') return orders;
    return orders.filter((o) => {
      const s = String(o.status || '').toLowerCase();
      if (orderSort === 'delivered') return s.includes('deliver');
      if (orderSort === 'confirmed') return !s.includes('deliver');
      return true;
    });
  }, [orders, orderSort]);

  const savedAddresses = useMemo(
    () => (user ? collectSavedAddresses(user, orders) : []),
    [user, orders]
  );

  if (loading) return <LoadingSpinner />;

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: { pathname: '/account' } }} />;
  }

  const showRealEmail = Boolean(user.email) && !isPlaceholderMobileEmail(user.email);
  const showMobile = Boolean(user.phone);
  const mobileOnlyAccount = showMobile && !showRealEmail;

  const handleProfileSave = async (e) => {
    e.preventDefault();
    setProfileSaving(true);
    setProfileMessage(null);
    setProfileError(null);
    const name = [profileForm.firstName, profileForm.lastName].filter(Boolean).join(' ').trim();
    try {
      await api.updateProfile({ name, address: profileForm.address });
      storeGender(user.id, profileForm.gender);
      await refreshUser();
      setProfileMessage('Profile updated successfully.');
    } catch (err) {
      setProfileError(err.message || 'Could not save');
    } finally {
      setProfileSaving(false);
    }
  };

  const handleAvatarPick = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    setAvatarPreview((prev) => {
      if (prev) URL.revokeObjectURL(prev);
      return url;
    });
  };

  const menuRowClass = (id) =>
    cn(
      'mx-2 block w-[calc(100%-1rem)] rounded-lg px-4 py-3 text-left text-sm font-medium transition',
      section === id
        ? 'bg-secondary font-semibold text-white shadow-[0_4px_12px_rgba(61,96,73,0.25)]'
        : 'text-primary/80 hover:bg-cream'
    );

  const menuLinkRowClass =
    'mx-2 block w-[calc(100%-1rem)] rounded-lg px-4 py-3 text-left text-sm font-medium text-primary/80 transition hover:bg-cream';

  return (
    <div className="min-h-[70vh] bg-cream pb-12">
      <header className="account-page-top border-b border-sage/45 bg-white py-5 text-center md:py-6">
        <div className="site-container">
          <h1 className="font-heading text-2xl font-semibold text-primary md:text-3xl">My Account</h1>
          <nav className="mt-2 text-sm text-muted" aria-label="Breadcrumb">
            <Link to="/" className="hover:text-primary">
              Home
            </Link>
            <span className="mx-2 text-sage">/</span>
            <span className="text-primary">My Account</span>
          </nav>
        </div>
      </header>

      <div className="site-container grid gap-5 py-5 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-6">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <nav
            className="space-y-0.5 overflow-hidden rounded-xl border border-sage/50 bg-white py-2 shadow-[0_4px_16px_rgba(41,70,51,0.05)]"
            aria-label="Account menu"
          >
            {MENU.map((item) => (
              <button key={item.id} type="button" onClick={() => setSection(item.id)} className={menuRowClass(item.id)}>
                {item.label}
              </button>
            ))}
            <Link to="/wishlist" className={menuLinkRowClass}>
              Wishlist
            </Link>
            <button
              type="button"
              onClick={logout}
              disabled={authLoading}
              className="mx-2 mt-1 block w-[calc(100%-1rem)] rounded-lg px-4 py-3 text-left text-sm font-semibold text-primary/80 transition hover:bg-cream disabled:opacity-50"
            >
              Logout
            </button>
          </nav>
        </aside>

        <main className="min-w-0">
          {section === 'orders' && (
            <div>
              <div className="mb-5 flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading text-lg font-semibold text-primary md:text-xl">
                  Orders ({filteredOrders.length})
                </h2>
                <div className="flex items-center gap-2 text-sm">
                  <span className="text-muted">Sort by:</span>
                  <NeoSelect
                    value={orderSort}
                    onChange={(e) => setOrderSort(e.target.value)}
                    wrapperClassName="min-w-[8.5rem]"
                    className="px-4 py-2.5 text-sm"
                    aria-label="Filter orders"
                  >
                    <option value="all">All</option>
                    <option value="confirmed">Accepted</option>
                    <option value="delivered">Delivered</option>
                  </NeoSelect>
                </div>
              </div>

              {ordersLoading ? (
                <p className="text-sm text-muted">Loading orders…</p>
              ) : filteredOrders.length === 0 ? (
                <div className="rounded-xl border border-dashed border-sage/50 bg-white py-12 text-center">
                  <p className="text-sm text-muted">No orders in this list.</p>
                  <Link to="/shop" className="neo-btn mt-4 inline-flex px-6 py-2.5 text-sm font-semibold">
                    Shop now
                  </Link>
                </div>
              ) : (
                <ul className="space-y-5">
                  {filteredOrders.map((order) => (
                    <li key={order.id}>
                      <AccountOrderCard order={order} />
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {section === 'profile' && (
            <div>
              <div className="mb-5">
                <h2 className="font-heading text-lg font-semibold text-primary md:text-xl">Personal Information</h2>
              </div>

              <article className="overflow-visible rounded-xl border border-sage/50 bg-white shadow-[0_4px_16px_rgba(41,70,51,0.05)]">
                <div className="overflow-visible px-4 py-5 md:px-5 md:py-6">
                  <div className="flex flex-col gap-6 overflow-visible md:flex-row md:items-start">
                    <div className="relative mx-auto shrink-0 md:mx-0">
                      <div className="flex h-20 w-20 items-center justify-center overflow-hidden rounded-full border-2 border-sage/30 bg-secondary/12 shadow-sm md:h-[5.25rem] md:w-[5.25rem]">
                        {avatarPreview ? (
                          <img src={avatarPreview} alt="" className="h-full w-full object-cover" />
                        ) : (
                          <span className="font-heading text-2xl font-semibold text-primary">
                            {(profileForm.firstName || user.name || 'U').charAt(0).toUpperCase()}
                          </span>
                        )}
                      </div>
                      <label className="absolute -bottom-0.5 -right-0.5 flex h-8 w-8 cursor-pointer items-center justify-center rounded-full bg-primary text-white shadow transition hover:bg-primary/90">
                        <span className="sr-only">Change profile photo</span>
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                          <path d="M12 20h9M16.5 3.5a2.12 2.12 0 013 3L7 19l-4 1 1-4L16.5 3.5z" strokeLinecap="round" strokeLinejoin="round" />
                        </svg>
                        <input type="file" accept="image/*" className="sr-only" onChange={handleAvatarPick} />
                      </label>
                    </div>

                    <form onSubmit={handleProfileSave} className="min-w-0 flex-1 space-y-3">
                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <ProfileFieldLabel>First name</ProfileFieldLabel>
                          <input
                            type="text"
                            value={profileForm.firstName}
                            onChange={(e) => setProfileForm((f) => ({ ...f, firstName: e.target.value }))}
                            className={profileInputClass()}
                            placeholder="First name"
                            autoComplete="given-name"
                          />
                        </label>
                        <label className="block">
                          <ProfileFieldLabel>Last name</ProfileFieldLabel>
                          <input
                            type="text"
                            value={profileForm.lastName}
                            onChange={(e) => setProfileForm((f) => ({ ...f, lastName: e.target.value }))}
                            className={profileInputClass()}
                            placeholder="Last name"
                            autoComplete="family-name"
                          />
                        </label>
                      </div>

                      <div className="grid gap-3 sm:grid-cols-2">
                        <label className="block">
                          <ProfileFieldLabel>Email</ProfileFieldLabel>
                          <input
                            type="email"
                            value={profileForm.email}
                            readOnly={showRealEmail}
                            onChange={(e) => setProfileForm((f) => ({ ...f, email: e.target.value }))}
                            className={profileInputClass(showRealEmail ? 'cursor-not-allowed opacity-75' : '')}
                            placeholder={mobileOnlyAccount ? 'Add email in account settings' : 'Email address'}
                            autoComplete="email"
                          />
                          {mobileOnlyAccount && (
                            <p className="mt-1 text-xs text-muted">Signed in with mobile OTP. Email is optional.</p>
                          )}
                        </label>

                        <label className="block">
                          <ProfileFieldLabel>Phone</ProfileFieldLabel>
                          <input
                            type="tel"
                            value={showMobile ? formatIndianPhone(profileForm.phone) : profileForm.phone}
                            readOnly={showMobile}
                            onChange={(e) => setProfileForm((f) => ({ ...f, phone: e.target.value }))}
                            className={profileInputClass(showMobile ? 'cursor-not-allowed opacity-75' : '')}
                            placeholder="10-digit mobile"
                            autoComplete="tel"
                          />
                          {user.phone_verified && showMobile ? (
                            <p className="mt-1 text-xs font-medium text-secondary">Verified mobile number</p>
                          ) : null}
                        </label>
                      </div>

                      <label className="relative z-20 block">
                        <ProfileFieldLabel>Gender</ProfileFieldLabel>
                        <NeoSelect
                          value={profileForm.gender}
                          onChange={(e) => setProfileForm((f) => ({ ...f, gender: e.target.value }))}
                          className={profileInputClass()}
                          placeholder="Select gender"
                          menuPlacement="auto"
                        >
                          <option value="">Select gender</option>
                          <option value="female">Female</option>
                          <option value="male">Male</option>
                          <option value="other">Other</option>
                          <option value="prefer_not">Prefer not to say</option>
                        </NeoSelect>
                      </label>

                      <label className="block">
                        <ProfileFieldLabel>Delivery address</ProfileFieldLabel>
                        <textarea
                          value={profileForm.address}
                          onChange={(e) => setProfileForm((f) => ({ ...f, address: e.target.value }))}
                          rows={2}
                          className={cn(profileInputClass(), 'neo-textarea min-h-[4.25rem] resize-y')}
                          placeholder="Flat / house, street, area, city"
                          autoComplete="street-address"
                        />
                      </label>

                      {profileError && (
                        <p className="rounded-lg bg-strawberry/10 px-3 py-2 text-sm text-strawberry">{profileError}</p>
                      )}
                      {profileMessage && (
                        <p className="rounded-lg bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary">
                          {profileMessage}
                        </p>
                      )}

                      <button
                        type="submit"
                        disabled={profileSaving}
                        className="neo-btn mt-1 px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
                      >
                        {profileSaving ? 'Updating…' : 'Update changes'}
                      </button>
                    </form>
                  </div>
                </div>
              </article>
            </div>
          )}

          {section === 'addresses' && (
            <div className="rounded-xl border border-sage/50 bg-white p-5 md:p-6">
              <h2 className="font-heading text-lg font-semibold text-primary md:text-xl">Manage Address</h2>
              {savedAddresses.length === 0 ? (
                <p className="mt-4 text-sm text-muted">
                  No saved addresses.{' '}
                  <button type="button" onClick={() => setSection('profile')} className="font-semibold text-primary underline">
                    Add in Personal Information
                  </button>
                </p>
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {savedAddresses.map((addr) => (
                    <li key={addr.id} className="rounded-lg border border-sage/45 bg-cream/35 p-4 text-sm">
                      <p className="font-semibold text-primary">
                        {addr.label}
                        {addr.isDefault && (
                          <span className="label-chip ml-2 bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-primary">
                            Default
                          </span>
                        )}
                      </p>
                      <p className="mt-1.5 text-muted">{addr.lines.join(', ')}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {section === 'password' && (
            <div className="rounded-xl border border-sage/50 bg-white p-5 md:p-6">
              <h2 className="font-heading text-lg font-semibold text-primary md:text-xl">Password Manager</h2>
              {mobileOnlyAccount ? (
                <p className="mt-3 text-sm text-muted">
                  Your account uses mobile OTP sign-in. No password is required.
                </p>
              ) : (
                <>
                  <p className="mt-3 text-sm text-muted">Reset your password using the email linked to this account.</p>
                  <Link
                    to="/forgot-password"
                    className="neo-btn mt-4 inline-flex px-6 py-2.5 text-sm font-semibold"
                  >
                    Reset password
                  </Link>
                </>
              )}
            </div>
          )}

          {section === 'help' && (
            <div className="rounded-xl border border-sage/50 bg-white p-5 md:p-6">
              <h2 className="font-heading text-lg font-semibold text-primary md:text-xl">Help</h2>
              <p className="mt-2 text-sm text-muted">Customer support for orders, delivery, and products.</p>
              <ul className="mt-4 space-y-2 text-sm">
                <li>
                  <a href={`tel:${BRAND_PHONE.replace(/\s/g, '')}`} className="font-medium text-primary hover:underline">
                    {BRAND_PHONE}
                  </a>
                </li>
                <li>
                  <a href={`mailto:${BRAND_EMAIL}`} className="font-medium text-primary hover:underline">
                    {BRAND_EMAIL}
                  </a>
                </li>
                <li className="text-muted">Mon–Sat, 9 AM – 6 PM IST</li>
              </ul>
              <Link to="/contact" className="neo-btn mt-5 inline-flex px-5 py-2.5 text-sm font-semibold">
                Contact us
              </Link>

              <details className="account-help-cancel mt-6 rounded-lg border border-sage/40 bg-cream/30 px-4 py-3 text-sm">
                <summary className="cursor-pointer list-none text-muted [&::-webkit-details-marker]:hidden">
                  <span className="text-xs font-medium text-primary/80">Order cancellation policy</span>
                </summary>
                <p className="mt-3 leading-relaxed text-muted">
                  Cancellation is handled by our team before your order is dispatched. Share your order ID by phone or
                  email — we do not offer instant self-cancel from the app.
                </p>
                <p className="mt-2 text-xs text-muted">
                  Call{' '}
                  <a href={`tel:${BRAND_PHONE.replace(/\s/g, '')}`} className="text-primary underline">
                    {BRAND_PHONE}
                  </a>{' '}
                  or{' '}
                  <Link to="/contact" className="text-primary underline">
                    write to support
                  </Link>
                  .
                </p>
              </details>
            </div>
          )}

        </main>
      </div>

      {section === 'profile' ? (
        <div className="site-container pb-6 pt-1">
          <AccountTrustBar />
        </div>
      ) : null}
    </div>
  );
}
