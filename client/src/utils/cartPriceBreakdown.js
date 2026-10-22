import { STORE_SETTINGS } from '../config/storeSettings.js';

export function computeCartPriceBreakdown(cart, couponDiscount = 0) {
  const items = cart?.items ?? [];
  let saleDiscount = 0;
  const countSaleDiscount = STORE_SETTINGS.showSaleTags !== false;

  for (const item of items) {
    const compare = Number(item.compare_at_price);
    const price = Number(item.price);
    const qty = Number(item.quantity) || 1;
    if (countSaleDiscount && compare > price) {
      saleDiscount += (compare - price) * qty;
    }
  }

  const subtotal =
    cart?.subtotal ??
    items.reduce((sum, i) => sum + (i.line_total ?? i.price * i.quantity), 0);

  const coupon = Math.max(0, Number(couponDiscount) || 0);
  const mrpTotal = subtotal + saleDiscount;
  const totalDiscount = saleDiscount + coupon;

  return {
    mrpTotal,
    subtotal,
    saleDiscount,
    couponDiscount: coupon,
    totalDiscount,
  };
}
