import { useEffect, useMemo, useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { api } from '../api/client';
import { formatIndianPhone } from '../components/auth/AuthForm';
import LoadingSpinner from '../components/ui/LoadingSpinner';
import NeoSelect from '../components/ui/NeoSelect';
import { cn } from '../lib/cn';
import AccountTrustBar from '../components/account/AccountTrustBar';
import AccountOrdersPanel from '../components/account/AccountOrdersPanel';
import OrderModalShell from '../components/orders/OrderModalShell';
import {
  formatAddressLines,
  hideAddressId,
  loadHiddenAddressIds,
  loadStoredAddresses,
  persistAddress,
  removeStoredAddress,
} from '../utils/savedAddresses';

function DeleteAddressIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" aria-hidden>
      <path d="M4 7h16M9 7V5a1 1 0 011-1h4a1 1 0 011 1v2M10 11v6M14 11v6M6 7l1 12a1 1 0 001 1h8a1 1 0 001-1l1-12" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}

function closeAddAddressModal(setShowAddAddress, setAddressActionError) {
  setShowAddAddress(false);
  setAddressActionError(null);
}

function splitFullName(full) {
  const parts = String(full || '')
    .trim()
    .split(/\s+/)
    .filter(Boolean);
  if (parts.length === 0) return { firstName: '', lastName: '' };
  if (parts.length === 1) return { firstName: parts[0], lastName: '' };
  return { firstName: parts[0], lastName: parts.slice(1).join(' ') };
}

function ProfileFieldLabel({ children }) {
  return <span className="account-field-label mb-1 block">{children}</span>;
}

/** Same inset fields as NeoSelect / checkout address form */
function profileInputClass(extra = '') {
  return cn('account-field-input neo-input px-3 py-2 text-sm', extra);
}

const MENU = [
  { id: 'profile', label: 'Personal Information' },
  { id: 'orders', label: 'My Orders' },
  { id: 'addresses', label: 'Manage Address' },
  { id: 'password', label: 'Password Manager' },
];


function isPlaceholderMobileEmail(email) {
  return /@mobile\.naturepure\.in$/i.test(String(email || '').trim());
}

function collectSavedAddresses(user, orders, stored = []) {
  const seen = new Set();
  const list = [];

  const push = (entry) => {
    const key = entry.lines.join('|').toLowerCase();
    if (!key || seen.has(key)) return;
    seen.add(key);
    list.push(entry);
  };

  if (user?.address) {
    push({
      id: 'primary',
      label: 'Primary address',
      lines: [user.address],
      isDefault: true,
      source: 'primary',
      storageId: 'primary',
    });
  }

  for (const row of stored) {
    const lines = [...formatAddressLines(row)];
    if (row.name) lines.unshift(row.name);
    if (row.phone) lines.push(row.phone);
    push({
      id: row.id,
      label: row.label || 'Saved address',
      lines,
      isDefault: false,
      source: 'stored',
      storageId: row.id,
    });
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
    push({
      id: `order-${order.id}`,
      label: `Order ${order.id}`,
      lines,
      isDefault: false,
      source: 'order',
      storageId: null,
    });
  }

  return list;
}

export default function AccountPage() {
  const { user, loading, isAuthenticated, refreshUser } = useAuth();
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
    address: '',
  });
  const [avatarPreview, setAvatarPreview] = useState(null);
  const [profileSaving, setProfileSaving] = useState(false);
  const [profileMessage, setProfileMessage] = useState(null);
  const [profileError, setProfileError] = useState(null);
  const [passwordForm, setPasswordForm] = useState({ newPassword: '', confirmPassword: '' });
  const [passwordSaving, setPasswordSaving] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState(null);
  const [passwordError, setPasswordError] = useState(null);
  const [storedAddresses, setStoredAddresses] = useState(() => loadStoredAddresses());
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [newAddressForm, setNewAddressForm] = useState({
    label: 'Home',
    address: '',
    city: '',
    state: '',
    pincode: '',
  });
  const [addressActionError, setAddressActionError] = useState(null);
  const [addressDeletingId, setAddressDeletingId] = useState(null);
  const [hiddenAddressIds, setHiddenAddressIds] = useState(() => loadHiddenAddressIds());

  useEffect(() => {
    if (!user) return;
    const { firstName, lastName } = splitFullName(user.name);
    setProfileForm({
      firstName,
      lastName,
      email: isPlaceholderMobileEmail(user.email) ? '' : user.email || '',
      phone: user.phone || '',
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


  const savedAddresses = useMemo(() => {
    if (!user) return [];
    const hidden = new Set(hiddenAddressIds);
    return collectSavedAddresses(user, orders, storedAddresses).filter((addr) => !hidden.has(addr.id));
  }, [user, orders, storedAddresses, hiddenAddressIds]);

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

  const handleAddAddress = (e) => {
    e.preventDefault();
    setAddressActionError(null);
    const trimmed = newAddressForm.address.trim();
    if (trimmed.length < 5) {
      setAddressActionError('Please enter a complete street address.');
      return;
    }
    const next = persistAddress({
      label: newAddressForm.label.trim() || 'Home',
      name: user.name || '',
      phone: user.phone || '',
      email: user.email || '',
      address: trimmed,
      city: newAddressForm.city.trim(),
      state: newAddressForm.state.trim(),
      pincode: newAddressForm.pincode.trim(),
    });
    setStoredAddresses(next);
    setNewAddressForm({ label: 'Home', address: '', city: '', state: '', pincode: '' });
    setShowAddAddress(false);
  };

  const handleDeleteAddress = async (addr) => {
    setAddressActionError(null);
    setAddressDeletingId(addr.id);
    try {
      if (addr.source === 'primary') {
        const name = [profileForm.firstName, profileForm.lastName].filter(Boolean).join(' ').trim() || user.name;
        await api.updateProfile({ name, address: '' });
        await refreshUser();
        setProfileForm((f) => ({ ...f, address: '' }));
      } else if (addr.source === 'stored' && addr.storageId) {
        setStoredAddresses(removeStoredAddress(addr.storageId));
      } else if (addr.source === 'order') {
        setHiddenAddressIds(hideAddressId(addr.id));
      }
    } catch (err) {
      setAddressActionError(err.message || 'Could not delete address');
    } finally {
      setAddressDeletingId(null);
    }
  };

  const handlePasswordSave = async (e) => {
    e.preventDefault();
    setPasswordSaving(true);
    setPasswordMessage(null);
    setPasswordError(null);

    const { newPassword, confirmPassword } = passwordForm;
    if (newPassword.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      setPasswordSaving(false);
      return;
    }
    if (newPassword !== confirmPassword) {
      setPasswordError('Passwords do not match.');
      setPasswordSaving(false);
      return;
    }

    try {
      await api.changePassword({ password: newPassword });
      setPasswordForm({ newPassword: '', confirmPassword: '' });
      setPasswordMessage('Password updated successfully.');
    } catch (err) {
      setPasswordError(err.message || 'Could not update password');
    } finally {
      setPasswordSaving(false);
    }
  };

  const menuRowClass = (id) =>
    cn(
      'block w-full rounded-lg px-2.5 py-2.5 text-left text-xs font-medium transition sm:px-3 sm:py-2.5 sm:text-sm lg:mx-2 lg:w-[calc(100%-1rem)] lg:px-4 lg:py-3',
      section === id
        ? 'bg-secondary font-semibold text-white shadow-[0_4px_12px_rgba(61,96,73,0.25)]'
        : 'text-primary/80 hover:bg-cream'
    );

  const menuLinkRowClass =
    'block w-full rounded-lg px-2.5 py-2.5 text-left text-xs font-medium text-primary/80 transition hover:bg-cream sm:px-3 sm:py-2.5 sm:text-sm lg:mx-2 lg:w-[calc(100%-1rem)] lg:px-4 lg:py-3';

  return (
    <div className="account-page min-h-[70vh] bg-cream pb-12">
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

      <div className="site-container grid grid-cols-[minmax(0,7.75rem)_minmax(0,1fr)] gap-3 py-5 sm:grid-cols-[minmax(0,10.5rem)_1fr] sm:gap-4 lg:grid-cols-[minmax(0,240px)_1fr] lg:gap-6">
        <aside className="min-w-0 lg:sticky lg:top-24 lg:self-start">
          <nav
            className="space-y-0.5 overflow-hidden rounded-xl border border-sage/50 bg-white py-1.5 shadow-[0_4px_16px_rgba(41,70,51,0.05)] sm:py-2"
            aria-label="Account menu"
          >
            {MENU.map((item) => (
              <button key={item.id} type="button" onClick={() => setSection(item.id)} className={menuRowClass(item.id)}>
                <span className="block leading-snug">{item.label}</span>
              </button>
            ))}
            <Link to="/wishlist" className={menuLinkRowClass}>
              Wishlist
            </Link>
          </nav>
        </aside>

        <main className="min-w-0">
          {section === 'orders' && (
            <AccountOrdersPanel
              orders={orders}
              loading={ordersLoading}
              activeTab={orderSort}
              onTabChange={setOrderSort}
            />
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
            <div className="rounded-xl border border-sage/50 bg-white p-4 sm:p-5 md:p-6">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <h2 className="font-heading text-base font-semibold text-primary sm:text-lg md:text-xl">
                  Manage Address
                </h2>
                <button
                  type="button"
                  onClick={() => {
                    setAddressActionError(null);
                    setShowAddAddress(true);
                  }}
                  className="neo-btn inline-flex min-h-9 px-4 py-2 text-xs font-semibold sm:text-sm"
                >
                  Add address
                </button>
              </div>

              {showAddAddress && (
                <OrderModalShell
                  titleId="add-address-title"
                  onDismiss={() => closeAddAddressModal(setShowAddAddress, setAddressActionError)}
                  wide
                  className="max-w-md sm:max-w-lg"
                >
                  <div className="flex items-center justify-between gap-3 border-b border-sage/40 px-4 py-3 sm:px-5">
                    <h2 id="add-address-title" className="font-heading text-lg font-semibold text-primary">
                      Add address
                    </h2>
                    <button
                      type="button"
                      onClick={() => closeAddAddressModal(setShowAddAddress, setAddressActionError)}
                      className="rounded-full p-2 text-primary/70 transition hover:bg-cream hover:text-primary"
                      aria-label="Close"
                    >
                      <span className="text-xl leading-none">&times;</span>
                    </button>
                  </div>
                  <form
                    onSubmit={handleAddAddress}
                    className="max-h-[min(70vh,28rem)] space-y-3 overflow-y-auto px-4 py-4 sm:px-5 sm:py-5"
                  >
                    <label className="block">
                      <ProfileFieldLabel>Label</ProfileFieldLabel>
                      <input
                        type="text"
                        value={newAddressForm.label}
                        onChange={(e) => setNewAddressForm((f) => ({ ...f, label: e.target.value }))}
                        className={profileInputClass()}
                        placeholder="Home, Office…"
                      />
                    </label>
                    <label className="block">
                      <ProfileFieldLabel>Street address</ProfileFieldLabel>
                      <textarea
                        value={newAddressForm.address}
                        onChange={(e) => setNewAddressForm((f) => ({ ...f, address: e.target.value }))}
                        rows={3}
                        className={cn(profileInputClass(), 'neo-textarea min-h-[4.5rem] resize-y')}
                        placeholder="Flat / house, street, area"
                        required
                      />
                    </label>
                    <div className="grid gap-3 sm:grid-cols-3">
                      <label className="block sm:col-span-1">
                        <ProfileFieldLabel>City</ProfileFieldLabel>
                        <input
                          type="text"
                          value={newAddressForm.city}
                          onChange={(e) => setNewAddressForm((f) => ({ ...f, city: e.target.value }))}
                          className={profileInputClass()}
                          placeholder="City"
                        />
                      </label>
                      <label className="block sm:col-span-1">
                        <ProfileFieldLabel>State</ProfileFieldLabel>
                        <input
                          type="text"
                          value={newAddressForm.state}
                          onChange={(e) => setNewAddressForm((f) => ({ ...f, state: e.target.value }))}
                          className={profileInputClass()}
                          placeholder="State"
                        />
                      </label>
                      <label className="block sm:col-span-1">
                        <ProfileFieldLabel>PIN</ProfileFieldLabel>
                        <input
                          type="text"
                          value={newAddressForm.pincode}
                          onChange={(e) => setNewAddressForm((f) => ({ ...f, pincode: e.target.value }))}
                          className={profileInputClass()}
                          placeholder="PIN code"
                          inputMode="numeric"
                        />
                      </label>
                    </div>
                    {addressActionError && (
                      <p className="rounded-lg bg-strawberry/10 px-3 py-2 text-sm text-strawberry">{addressActionError}</p>
                    )}
                    <div className="flex flex-wrap gap-2 pt-1">
                      <button type="submit" className="neo-btn flex-1 px-5 py-2.5 text-sm font-semibold sm:flex-none">
                        Save address
                      </button>
                      <button
                        type="button"
                        onClick={() => closeAddAddressModal(setShowAddAddress, setAddressActionError)}
                        className="inline-flex min-h-10 flex-1 items-center justify-center rounded-md border border-sage/60 bg-white px-5 py-2.5 text-sm font-semibold text-primary sm:flex-none"
                      >
                        Cancel
                      </button>
                    </div>
                  </form>
                </OrderModalShell>
              )}

              {addressActionError && !showAddAddress && (
                <p className="mt-3 rounded-lg bg-strawberry/10 px-3 py-2 text-sm text-strawberry">{addressActionError}</p>
              )}

              {savedAddresses.length === 0 ? (
                <p className="mt-4 text-sm text-muted">No saved addresses yet. Tap Add address to create one.</p>
              ) : (
                <ul className="mt-4 grid gap-3 sm:grid-cols-2">
                  {savedAddresses.map((addr) => (
                    <li key={addr.id} className="rounded-lg border border-sage/45 bg-cream/35 p-4 text-sm">
                      <div className="flex items-start justify-between gap-2">
                        <p className="min-w-0 font-semibold text-primary">
                          {addr.label}
                          {addr.isDefault && (
                            <span className="label-chip ml-2 bg-primary/10 px-1.5 py-0.5 text-[0.6rem] font-bold uppercase text-primary">
                              Primary address
                            </span>
                          )}
                        </p>
                        <button
                          type="button"
                          onClick={() => handleDeleteAddress(addr)}
                          disabled={addressDeletingId === addr.id}
                          className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-strawberry/35 bg-white text-strawberry transition hover:bg-strawberry/10 disabled:opacity-45"
                          aria-label={`Delete ${addr.label}`}
                          title="Delete address"
                        >
                          <DeleteAddressIcon className="h-4 w-4" />
                        </button>
                      </div>
                      <p className="account-address-body mt-1.5 leading-relaxed">{addr.lines.join(', ')}</p>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          )}

          {section === 'password' && (
            <div className="rounded-xl border border-sage/50 bg-white p-4 sm:p-5 md:p-6">
              <h2 className="font-heading text-base font-semibold text-primary sm:text-lg md:text-xl">
                Password Manager
              </h2>
              {mobileOnlyAccount ? (
                <p className="mt-3 text-sm text-muted">
                  Your account uses mobile OTP sign-in. Set a password below to also sign in with email later.
                </p>
              ) : (
                <p className="mt-2 text-sm text-muted">Create a new password for your account.</p>
              )}

              <form onSubmit={handlePasswordSave} className="mt-4 max-w-md space-y-3">
                <label className="block">
                  <ProfileFieldLabel>New password</ProfileFieldLabel>
                  <input
                    type="password"
                    value={passwordForm.newPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, newPassword: e.target.value }))}
                    className={profileInputClass()}
                    placeholder="Enter new password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </label>
                <label className="block">
                  <ProfileFieldLabel>Confirm password</ProfileFieldLabel>
                  <input
                    type="password"
                    value={passwordForm.confirmPassword}
                    onChange={(e) => setPasswordForm((f) => ({ ...f, confirmPassword: e.target.value }))}
                    className={profileInputClass()}
                    placeholder="Confirm new password"
                    autoComplete="new-password"
                    minLength={6}
                    required
                  />
                </label>

                {passwordError && (
                  <p className="rounded-lg bg-strawberry/10 px-3 py-2 text-sm text-strawberry">{passwordError}</p>
                )}
                {passwordMessage && (
                  <p className="rounded-lg bg-secondary/10 px-3 py-2 text-sm font-medium text-secondary">
                    {passwordMessage}
                  </p>
                )}

                <button
                  type="submit"
                  disabled={passwordSaving}
                  className="neo-btn px-6 py-2.5 text-sm font-semibold disabled:opacity-60"
                >
                  {passwordSaving ? 'Saving…' : 'Create new password'}
                </button>
              </form>
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
