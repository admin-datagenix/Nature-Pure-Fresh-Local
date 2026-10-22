/** Merge current shipping with primary saved row so checkout can continue without re-picking in the modal. */
export function mergeShippingWithPrimary(shipping, addresses) {
  const primary = addresses?.[0];
  if (!primary) return { ...shipping };
  return {
    ...primary,
    ...shipping,
    name: (shipping.name || primary.name || '').trim(),
    phone: shipping.phone || primary.phone || '',
    email: shipping.email || primary.email || '',
    address: (shipping.address || primary.address || '').trim(),
    city: (shipping.city || primary.city || '').trim(),
    state: shipping.state || primary.state || '',
    pincode: shipping.pincode || primary.pincode || '',
    label: shipping.label || primary.label || primary.label,
    id: shipping.id || primary.id,
  };
}

export function pickBestCheckoutAddress(addresses) {
  if (!addresses?.length) return null;
  const scored = addresses.map((a) => ({
    a,
    score: addressCompletenessScore(a),
  }));
  scored.sort((x, y) => y.score - x.score);
  return scored[0]?.score > 0 ? scored[0].a : addresses[0];
}

function addressCompletenessScore(a) {
  let s = 0;
  if (a?.name?.trim()) s += 2;
  if (/^[6-9]\d{9}$/.test(String(a?.phone || '').replace(/\D/g, '').slice(-10))) s += 2;
  if (/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(a?.email || '')) s += 1;
  if ((a?.address || '').trim()) s += 2;
  if (a?.city?.trim()) s += 1;
  if (a?.state) s += 1;
  if (/^\d{6}$/.test(a?.pincode || '')) s += 2;
  return s;
}
