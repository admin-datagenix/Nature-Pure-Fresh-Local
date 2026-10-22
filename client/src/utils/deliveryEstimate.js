/** Typical delivery window for cart / checkout display */
export function getCartDeliveryByLabel(fromDate = new Date(), leadDays = 5) {
  const d = new Date(fromDate);
  d.setDate(d.getDate() + leadDays);
  const day = d.toLocaleDateString('en-IN', { day: 'numeric' });
  const month = d.toLocaleDateString('en-IN', { month: 'short' });
  const weekday = d.toLocaleDateString('en-IN', { weekday: 'short' });
  return `Delivery by ${month} ${day}, ${weekday}`;
}
