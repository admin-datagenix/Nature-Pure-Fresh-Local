import { useEffect, useMemo, useState } from 'react';
import NeoSelect from '../ui/NeoSelect';
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

function SearchIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
      <circle cx="11" cy="11" r="7" />
      <path d="M20 20l-3-3" strokeLinecap="round" />
    </svg>
  );
}

export default function AddressSelectionStep({
  addresses,
  shipping,
  setShipping,
  errors,
  setErrors,
  onDeliver,
  onAddressesChange,
}) {
  const [search, setSearch] = useState('');
  const [selectedId, setSelectedId] = useState(() => addresses[0]?.id || '');
  const [addingNew, setAddingNew] = useState(addresses.length === 0);
  const [draft, setDraft] = useState(shipping);

  const filtered = useMemo(
    () => addresses.filter((a) => matchesAddressSearch(a, search)),
    [addresses, search]
  );

  useEffect(() => {
    if (addingNew || !addresses.length) return;
    const exists = addresses.some((a) => a.id === selectedId);
    if (!exists) {
      setSelectedId(addresses[0].id);
      setShipping({ ...addresses[0] });
    }
  }, [addresses, addingNew, selectedId, setShipping]);

  const selectAddress = (addr) => {
    setSelectedId(addr.id);
    setAddingNew(false);
    setShipping({ ...addr });
    setErrors({});
  };

  const updateDraft = (field, value) => {
    setDraft((d) => ({ ...d, [field]: value }));
    if (errors[field]) setErrors((e) => ({ ...e, [field]: undefined }));
  };

  const validate = (data) => {
    const e = {};
    if (!data.name?.trim()) e.name = 'Name is required';
    if (!/^[6-9]\d{9}$/.test(String(data.phone || '').replace(/\D/g, '').slice(-10))) {
      e.phone = 'Valid 10-digit phone required';
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email || '')) e.email = 'Valid email required';
    if ((data.address || '').trim().length < 10) e.address = 'Full address required';
    if (!data.city?.trim()) e.city = 'City is required';
    if (!data.state) e.state = 'State is required';
    if (!/^\d{6}$/.test(data.pincode || '')) e.pincode = 'Valid 6-digit PIN required';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const saveNewAndSelect = () => {
    if (!validate(draft)) return;
    const saved = persistAddress({ ...draft, label: 'Home' });
    onAddressesChange(saved);
    const entry = saved[0];
    selectAddress(entry);
    setAddingNew(false);
  };

  const deliverSelected = () => {
    const current = addresses.find((a) => a.id === selectedId);
    const payload = addingNew ? draft : current || shipping;
    if (!validate(payload)) return;
    setShipping({ ...payload });
    onDeliver(payload);
  };

  return (
    <section className="neo-card overflow-hidden p-0">
      <div className="border-b border-sage/40 px-4 py-3 md:px-6">
        <div className="flex items-center gap-2 rounded-lg border border-sage/50 bg-cream px-3 py-2.5">
          <SearchIcon className="h-4 w-4 shrink-0 text-muted" />
          <input
            type="search"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search address by name or phone number"
            className="w-full bg-transparent text-sm text-primary outline-none placeholder:text-muted"
          />
        </div>
      </div>

      <div className="flex items-center justify-between gap-2 border-b border-sage/40 px-4 py-3 md:px-6">
        <h2 className="text-sm font-bold text-primary md:text-base">Select delivery address</h2>
        <button
          type="button"
          onClick={() => {
            setAddingNew(true);
            setDraft(shipping);
          }}
          className="shrink-0 text-xs font-bold uppercase tracking-wide text-secondary hover:underline md:text-sm"
        >
          + Add new address
        </button>
      </div>

      <div className="space-y-0 px-4 py-4 md:px-6">
        {addingNew ? (
          <div className="mb-4 rounded-xl border border-sage/50 bg-cream/40 p-4">
            <p className="mb-3 text-sm font-semibold text-primary">New delivery address</p>
            <AddressForm draft={draft} errors={errors} updateDraft={updateDraft} />
            <div className="mt-4 flex flex-col gap-2 sm:flex-row sm:flex-wrap">
              <button
                type="button"
                onClick={() => {
                  if (!validate(draft)) return;
                  const saved = persistAddress({ ...draft, label: 'Home' });
                  onAddressesChange(saved);
                  const entry = saved.find((a) => addressKey(a) === addressKey(draft)) || saved[0];
                  setShipping({ ...draft, id: entry?.id });
                  onDeliver({ ...draft, id: entry?.id });
                }}
                className="neo-btn w-full py-3 text-sm font-semibold sm:w-auto sm:px-4 sm:py-2 sm:text-xs"
              >
                Deliver to this address
              </button>
              <button type="button" onClick={saveNewAndSelect} className="neo-btn-ghost px-4 py-2 text-xs font-semibold">
                Save address
              </button>
              {addresses.length > 0 ? (
                <button
                  type="button"
                  onClick={() => setAddingNew(false)}
                  className="neo-btn-ghost px-4 py-2 text-xs font-semibold"
                >
                  Cancel
                </button>
              ) : null}
            </div>
          </div>
        ) : null}

        {filtered.map((addr) => {
          const selected = !addingNew && selectedId === addr.id;
          const lines = formatAddressLines(addr);
          return (
            <div
              key={addr.id}
              className={cn(
                'mb-3 rounded-xl border p-4 transition last:mb-0',
                selected
                  ? 'border-secondary bg-secondary/8 shadow-[0_0_0_1px_rgba(61,96,73,0.12)]'
                  : 'border-sage/45 bg-white hover:border-sage'
              )}
            >
              <label className="flex cursor-pointer items-start gap-3">
                <input
                  type="radio"
                  name="delivery-address"
                  checked={selected}
                  onChange={() => selectAddress(addr)}
                  className="mt-1 h-4 w-4 accent-secondary"
                />
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <p className="font-bold text-primary">{addr.name || 'Customer'}</p>
                    {selected ? (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.preventDefault();
                          setAddingNew(true);
                          setDraft({ ...addr });
                        }}
                        className="text-xs font-bold uppercase text-secondary hover:underline"
                      >
                        Edit
                      </button>
                    ) : null}
                  </div>
                  {lines.map((line) => (
                    <p key={line} className="mt-1 text-sm leading-snug text-muted">
                      {line}
                    </p>
                  ))}
                  {addr.phone ? (
                    <p className="mt-2 text-sm font-medium text-primary">
                      {String(addr.phone).replace(/\D/g, '').slice(-10)}
                    </p>
                  ) : null}
                </div>
              </label>

              {selected ? (
                <button
                  type="button"
                  onClick={deliverSelected}
                  className="neo-btn mt-4 w-full py-3 text-sm font-semibold"
                >
                  Deliver to this address
                </button>
              ) : null}
            </div>
          );
        })}

        {!addingNew && filtered.length === 0 ? (
          <p className="py-6 text-center text-sm text-muted">No address found. Add a new address to continue.</p>
        ) : null}
      </div>
    </section>
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
      <Field label="Phone" error={errors.phone}>
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
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </NeoSelect>
      </Field>
      <Field label="PIN code" error={errors.pincode}>
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
