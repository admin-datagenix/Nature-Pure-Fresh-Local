const STORAGE_KEY = 'npf_saved_addresses';
const HIDDEN_IDS_KEY = 'npf_hidden_address_ids';

export function addressKey(addr) {
  return [addr?.name, addr?.phone, addr?.address, addr?.city, addr?.state, addr?.pincode]
    .join('|')
    .toLowerCase();
}

export function shippingFromUser(user) {
  if (!user) return null;
  const phone = String(user.phone || '').replace(/\D/g, '').slice(-10);
  if (!user.name && !user.address && !phone) return null;
  return {
    id: 'profile-home',
    label: 'Home',
    name: user.name || '',
    phone,
    email: user.email || '',
    address: user.address || '',
    city: '',
    state: '',
    pincode: '',
  };
}

export function shippingFromOrder(order) {
  const s = order?.shipping_address;
  if (!s?.address && !s?.name) return null;
  return {
    id: `order-${order.id}`,
    label: 'Saved address',
    name: s.name || '',
    phone: String(s.phone || '').replace(/\D/g, '').slice(-10),
    email: s.email || '',
    address: s.address || '',
    city: s.city || '',
    state: s.state || '',
    pincode: s.pincode || '',
  };
}

export function loadStoredAddresses() {
  try {
    const raw = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function persistAddress(shipping) {
  const entry = {
    id: `saved-${Date.now()}`,
    label: shipping.label || 'Home',
    ...shipping,
  };
  const list = loadStoredAddresses();
  const key = addressKey(entry);
  if (list.some((a) => addressKey(a) === key)) return list;
  const next = [entry, ...list].slice(0, 8);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
  return next;
}

export function removeStoredAddress(id) {
  const list = loadStoredAddresses().filter((row) => row.id !== id);
  localStorage.setItem(STORAGE_KEY, JSON.stringify(list));
  return list;
}

export function loadHiddenAddressIds() {
  try {
    const raw = JSON.parse(localStorage.getItem(HIDDEN_IDS_KEY) || '[]');
    return Array.isArray(raw) ? raw : [];
  } catch {
    return [];
  }
}

export function hideAddressId(id) {
  if (!id) return loadHiddenAddressIds();
  const set = new Set(loadHiddenAddressIds());
  set.add(id);
  const next = [...set];
  localStorage.setItem(HIDDEN_IDS_KEY, JSON.stringify(next));
  return next;
}

export function mergeSavedAddresses(user, orders = [], stored = loadStoredAddresses()) {
  const seen = new Set();
  const list = [];

  const add = (entry) => {
    if (!entry?.address && !entry?.name) return;
    const key = addressKey(entry);
    if (seen.has(key)) return;
    seen.add(key);
    list.push(entry);
  };

  const fromUser = shippingFromUser(user);
  if (fromUser) add(fromUser);
  for (const order of orders) {
    const fromOrder = shippingFromOrder(order);
    if (fromOrder) add(fromOrder);
  }
  for (const row of stored) add(row);

  return list;
}

export function formatAddressLines(addr) {
  const lines = [];
  if (addr.address) lines.push(addr.address);
  const cityLine = [addr.city, addr.state, addr.pincode].filter(Boolean).join(', ');
  if (cityLine) lines.push(cityLine);
  return lines;
}

export function matchesAddressSearch(addr, query) {
  const q = query.trim().toLowerCase();
  if (!q) return true;
  const hay = [addr.name, addr.phone, addr.address, addr.city, addr.state, addr.pincode].join(' ').toLowerCase();
  return hay.includes(q.replace(/\s+/g, ' '));
}
