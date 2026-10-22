import { useEffect, useMemo, useState } from 'react';
import NeoSelect from '../ui/NeoSelect';
import OrderModalShell from '../orders/OrderModalShell';
import { cn } from '../../lib/cn';
import {
  addressKey,
  formatAddressLines,
  matchesAddressSearch,
  persistAddress,
} from '../../utils/savedAddresses';

const INDIAN_STATES = [
  'Andhra Pradesh', 'Gujarat', 'Karnataka', 'Kerala', 'Maharashtra',
  'Rajasthan', 'Tamil Nadu', 'Telangana', 'Uttar Pradesh', 'West Bengal',
];

export function validateShippingAddress(data, setErrors) {
  const e = {};
  const name = data.name?.trim();
  const phone = String(data.phone || '').replace(/\D/g, '').slice(-10);
  const street = (data.address || '').trim();
  const city = data.city?.trim();
  const state = data.state;
  const pincode = data.pincode || '';

  if (!name) e.name = 'Name is required';
  if (!/^[6-9]\d{9}$/.test(phone)) e.phone = 'Valid 10-digit phone required';
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) e.email = 'Valid email required';

  const locationLine = [street, city, state, pincode].filter(Boolean).join(', ');
  if (locationLine.length < 8 && street.length < 3) {
    e.address = 'Delivery location required';
  }
  if (!/^\d{6}$/.test(pincode)) e.pincode = 'Valid 6-digit PIN required';
  if (!state && !city) e.city = 'City or area required';

  setErrors(e);
  return Object.keys(e).length === 0;
}

export default function CheckoutAddressPanel({
  addresses,
  shipping,
  setShipping,
  errors,
  setErrors,
  onAddressesChange,
  pickerOpen = false,
  onPickerClose,
  showAddressAlert = false,
}) {
  const [localPickerOpen, setLocalPickerOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(() => addresses[0]?.id || '');
  const [addingNew, setAddingNew] = useState(false);
  const [draft, setDraft] = useState(shipping);

  const modalOpen = pickerOpen || localPickerOpen;

  const filtered = useMemo(
    () => addresses.filter((a) => matchesAddressSearch(a, search)),
    [addresses, search]
  );

  const selected = addresses.find((a) => a.id === selectedId) || addresses[0];

  useEffect(() => {
    if (addresses.length === 0) {
      setAddingNew(true);
      return;
    }
    if (addingNew) return;
    const exists = addresses.some((a) => a.id === selectedId);
    const match = addresses.find((a) => addressKey(a) === addressKey(shipping));
    if (match) {
      setSelectedId(match.id);
    } else if (!exists) {
      setSelectedId(addresses[0].id);
      setShipping({ ...addresses[0] });
    }
  }, [addresses, addingNew, selectedId, setShipping, shipping]);

  const closePicker = () => {
    setLocalPickerOpen(false);
    setAddingNew(false);
    onPickerClose?.();
  };

  const openPicker = () => {
    setDraft(shipping);
    setLocalPickerOpen(true);
  };

  const selectAddress = (addr) => {
    setSelectedId(addr.id);
    setAddingNew(false);
    setShipping({ ...addr });
    setErrors({});
    closePicker();
  };

  const updateDraft = (field, value) => {
    setDraft((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const saveNewAndSelect = () => {
    if (!validateShippingAddress(draft, setErrors)) return;
    const list = persistAddress({ ...draft, label: draft.label || 'Home' });
    onAddressesChange(list);
    const entry = list.find((a) => addressKey(a) === addressKey(draft)) || list[0];
    if (entry) selectAddress(entry);
    else closePicker();
  };

  const display = selected || (shipping?.name || shipping?.address ? shipping : null);
  const isPrimary = selected?.id === addresses[0]?.id;
  const addressLine = display
    ? [display.address, display.city, display.state].filter(Boolean).join(', ')
    : '';

  return (
    <>
      <section className="checkout-address-bar overflow-hidden rounded-md border border-sage/40 bg-white p-0 shadow-[0_2px_12px_rgba(41,70,51,0.05)]">
        <div className="flex items-center justify-between gap-3 px-4 py-3 sm:px-5 sm:py-3.5">
          <div className="min-w-0 flex-1">
            {display ? (
              <>
                <p className="truncate text-sm text-primary">
                  <span className="font-bold">Deliver to:</span>{' '}
                  <span className="font-semibold">{display.name}</span>
                  {display.pincode ? `, ${display.pincode}` : ''}
                  {isPrimary ? (
                    <span className="ml-1.5 inline-flex rounded-sm bg-secondary/12 px-1.5 py-px text-[0.6rem] font-bold tracking-wide text-secondary">
                      PRIMARY
                    </span>
                  ) : (
                    <span className="ml-1.5 inline-flex rounded-sm bg-cream-dark px-1.5 py-px text-[0.6rem] font-bold tracking-wide text-muted">
                      {(display.label || 'HOME').toUpperCase()}
                    </span>
                  )}
                </p>
                <p className="mt-0.5 line-clamp-1 text-xs text-muted">{addressLine}</p>
              </>
            ) : (
              <p className="text-xs text-muted sm:text-sm">Add a delivery address to continue</p>
            )}
          </div>
          <button
            type="button"
            onClick={openPicker}
            className={cn(
              'shrink-0 text-xs font-semibold transition sm:px-3.5 sm:py-1.5 sm:text-sm',
              display
                ? 'checkout-change-btn rounded-sm border border-sage/45 bg-white px-3 py-1 text-secondary hover:border-secondary/40'
                : 'neo-btn neo-btn--flat px-3 py-2 sm:px-4'
            )}
          >
            {display ? 'Change' : (
              <>
                <span className="sm:hidden">Add New</span>
                <span className="hidden sm:inline">Add address</span>
              </>
            )}
          </button>
        </div>
        {showAddressAlert && Object.keys(errors).length > 0 ? (
          <p className="border-t border-sage/30 px-3 py-1.5 text-[0.65rem] text-strawberry sm:px-4">
            Please complete your address via Change.
          </p>
        ) : null}
      </section>

      {modalOpen ? (
        <OrderModalShell
          titleId="checkout-address-picker-title"
          onDismiss={closePicker}
          wide
          className="max-w-lg sm:max-w-xl"
        >
          <div className="flex items-center justify-between border-b border-sage/35 px-5 py-4">
            <h2 id="checkout-address-picker-title" className="font-heading text-lg font-semibold text-primary">
              Delivery address
            </h2>
            <button
              type="button"
              onClick={closePicker}
              className="text-2xl leading-none text-muted hover:text-primary"
              aria-label="Close"
            >
              ×
            </button>
          </div>

          <div className="max-h-[min(70vh,32rem)] overflow-y-auto px-5 py-4">
            <input
              type="search"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or phone"
              className="neo-input mb-4 w-full px-3 py-2 text-sm"
            />

            <div className="mb-3 flex items-center justify-between gap-2">
              <p className="text-sm font-semibold text-primary">Saved addresses</p>
              <button
                type="button"
                onClick={() => {
                  setAddingNew(true);
                  setDraft(shipping);
                }}
                className="neo-btn neo-btn--flat shrink-0 px-3 py-1.5 text-xs font-semibold sm:hidden"
              >
                Add New
              </button>
              <button
                type="button"
                onClick={() => {
                  setAddingNew(true);
                  setDraft(shipping);
                }}
                className="hidden text-xs font-bold text-secondary hover:underline sm:inline"
              >
                + Add new address
              </button>
            </div>

            {addingNew ? (
              <div className="mb-4 rounded-xl border border-sage/50 bg-cream/40 p-4">
                <p className="mb-3 text-sm font-semibold text-primary">New address</p>
                <AddressForm draft={draft} errors={errors} updateDraft={updateDraft} />
                <div className="mt-4 flex flex-wrap gap-2">
                  <button type="button" onClick={saveNewAndSelect} className="neo-btn px-5 py-2 text-sm font-semibold">
                    Save address
                  </button>
                  {addresses.length > 0 ? (
                    <button
                      type="button"
                      onClick={() => setAddingNew(false)}
                      className="neo-btn-ghost px-4 py-2 text-sm font-semibold"
                    >
                      Cancel
                    </button>
                  ) : null}
                </div>
              </div>
            ) : null}

            {filtered.map((addr, index) => {
              const isSelected = !addingNew && selectedId === addr.id;
              const lines = formatAddressLines(addr);
              const primary = index === 0;
              return (
                <label
                  key={addr.id}
                  className={cn(
                    'mb-2 flex cursor-pointer items-start gap-3 rounded-xl border p-3.5 transition last:mb-0',
                    isSelected ? 'border-secondary bg-secondary/8' : 'border-sage/45 bg-white hover:border-sage'
                  )}
                >
                  <input
                    type="radio"
                    name="checkout-address"
                    checked={isSelected}
                    onChange={() => selectAddress(addr)}
                    className="mt-1 h-4 w-4 accent-secondary"
                  />
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2">
                      <p className="font-semibold text-primary">{addr.label || 'Home'}</p>
                      {primary ? (
                        <span className="text-[0.625rem] font-bold uppercase text-secondary">Primary</span>
                      ) : null}
                    </div>
                    <p className="mt-0.5 text-sm font-medium text-primary">{addr.name}</p>
                    {lines.map((line) => (
                      <p key={line} className="mt-0.5 text-xs leading-snug text-muted">{line}</p>
                    ))}
                  </div>
                </label>
              );
            })}

            {!addingNew && filtered.length === 0 ? (
              <p className="py-4 text-center text-sm text-muted">No address found. Add a new address.</p>
            ) : null}
          </div>
        </OrderModalShell>
      ) : null}
    </>
  );
}

function AddressForm({ draft, errors, updateDraft }) {
  return (
    <div className="grid gap-3 sm:grid-cols-2">
      <Field label="Full name" error={errors.name}>
        <input
          value={draft.name}
          onChange={(e) => updateDraft('name', e.target.value)}
          className={inputCls(errors.name)}
          placeholder="Your full name"
        />
      </Field>
      <Field label="Mobile number" error={errors.phone}>
        <input
          value={draft.phone}
          onChange={(e) => updateDraft('phone', e.target.value)}
          className={inputCls(errors.phone)}
          placeholder="10-digit mobile"
        />
      </Field>
      <Field label="Email" error={errors.email} className="sm:col-span-2">
        <input
          type="email"
          value={draft.email}
          onChange={(e) => updateDraft('email', e.target.value)}
          className={inputCls(errors.email)}
          placeholder="you@email.com"
        />
      </Field>
      <Field label="Address" error={errors.address} className="sm:col-span-2">
        <textarea
          value={draft.address}
          onChange={(e) => updateDraft('address', e.target.value)}
          rows={2}
          className={cn(inputCls(errors.address), 'neo-textarea')}
          placeholder="Flat / house, street, area"
        />
      </Field>
      <Field label="City" error={errors.city}>
        <input
          value={draft.city}
          onChange={(e) => updateDraft('city', e.target.value)}
          className={inputCls(errors.city)}
          placeholder="City"
        />
      </Field>
      <Field label="State" error={errors.state}>
        <NeoSelect
          value={draft.state}
          onChange={(e) => updateDraft('state', e.target.value)}
          className={inputCls(errors.state)}
          placeholder="Select state"
        >
          <option value="">Select state</option>
          {INDIAN_STATES.map((s) => (
            <option key={s} value={s}>{s}</option>
          ))}
        </NeoSelect>
      </Field>
      <Field label="Pincode" error={errors.pincode}>
        <input
          value={draft.pincode}
          onChange={(e) => updateDraft('pincode', e.target.value.replace(/\D/g, '').slice(0, 6))}
          className={inputCls(errors.pincode)}
          placeholder="6-digit PIN"
        />
      </Field>
    </div>
  );
}

function Field({ label, error, children, className = '' }) {
  return (
    <div className={className}>
      <label className="mb-1 block text-xs font-medium text-primary">{label}</label>
      {children}
      {error ? <p className="mt-1 text-xs text-strawberry">{error}</p> : null}
    </div>
  );
}

function inputCls(error) {
  return cn('neo-input px-3 py-2 text-sm', error && 'neo-input-error');
}
