import { jsPDF } from 'jspdf';
import { BRAND_ADDRESS_FULL, BRAND_EMAIL, BRAND_NAME, BRAND_PHONE } from '../data/brand.js';
import {
  formatOrderDate,
  formatItemWeight,
  formatPaymentMethod,
  formatProductName,
  orderCardStatusLine,
} from '../components/account/accountOrderHelpers.js';

const PRIMARY_RGB = [41, 70, 51];
const MUTED_RGB = [124, 138, 128];

function addWrappedText(doc, text, x, y, maxWidth, lineHeight = 5) {
  const lines = doc.splitTextToSize(String(text || ''), maxWidth);
  doc.text(lines, x, y);
  return y + lines.length * lineHeight;
}

export function downloadOrderInvoicePdf(order, formatPrice) {
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });
  const margin = 14;
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const contentWidth = pageWidth - margin * 2;
  const ship = order.shipping_address || {};
  const items = order.items || [];

  let y = 0;

  const ensureSpace = (needed) => {
    if (y + needed > pageHeight - margin) {
      doc.addPage();
      y = margin;
    }
  };

  doc.setFillColor(...PRIMARY_RGB);
  doc.rect(0, 0, pageWidth, 32, 'F');
  doc.setTextColor(255, 255, 255);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(18);
  doc.text(BRAND_NAME, margin, 14);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  doc.text('Order invoice', margin, 22);

  y = 42;
  doc.setTextColor(...PRIMARY_RGB);
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Order ID: ${order.id}`, margin, y);
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(10);
  y += 7;
  doc.text(`Order date: ${formatOrderDate(order.created_at)}`, margin, y);
  y += 5;
  doc.text(`Status: ${orderCardStatusLine(order)}`, margin, y);
  y += 5;
  doc.text(`Payment: ${formatPaymentMethod(order.payment_method)}`, margin, y);
  y += 10;

  doc.setFont('helvetica', 'bold');
  doc.text('Bill to', margin, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  y = addWrappedText(
    doc,
    [
      ship.name,
      ship.address,
      [ship.city, ship.state, ship.pincode].filter(Boolean).join(', '),
      ship.phone ? `Phone: ${ship.phone}` : null,
      ship.email,
    ]
      .filter(Boolean)
      .join('\n'),
    margin,
    y,
    contentWidth
  );
  y += 6;

  doc.setDrawColor(221, 231, 220);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  doc.setFont('helvetica', 'bold');
  doc.setFontSize(10);
  doc.text('Item', margin, y);
  doc.text('Qty', margin + 95, y);
  doc.text('Amount', pageWidth - margin - 28, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  doc.setFontSize(9);

  for (const item of items) {
    ensureSpace(18);
    const name = `${formatProductName(item.name)} (${formatItemWeight(item)})`;
    const qty = item.quantity || 1;
    const lineTotal = formatPrice((item.price || 0) * qty);
    y = addWrappedText(doc, name, margin, y, 88, 4.5);
    doc.text(String(qty), margin + 95, y - 4.5);
    doc.text(lineTotal, pageWidth - margin - 28, y - 4.5);
    y += 4;
  }

  y += 4;
  ensureSpace(30);
  doc.line(margin, y, pageWidth - margin, y);
  y += 8;

  const subtotal = order.subtotal ?? items.reduce((s, i) => s + (i.price || 0) * (i.quantity || 1), 0);
  const shipping = order.shipping ?? 0;
  const discount = order.discount ?? 0;

  doc.text(`Subtotal: ${formatPrice(subtotal)}`, margin, y);
  y += 5;
  doc.text(`Shipping: ${formatPrice(shipping)}`, margin, y);
  y += 5;
  if (discount > 0) {
    doc.text(`Discount: −${formatPrice(discount)}`, margin, y);
    y += 5;
  }
  doc.setFont('helvetica', 'bold');
  doc.setFontSize(11);
  doc.text(`Total paid: ${formatPrice(order.total)}`, margin, y);
  y += 12;

  doc.setFont('helvetica', 'normal');
  doc.setFontSize(8);
  doc.setTextColor(...MUTED_RGB);
  y = addWrappedText(
    doc,
    `${BRAND_NAME} · ${BRAND_ADDRESS_FULL} · ${BRAND_EMAIL} · ${BRAND_PHONE}`,
    margin,
    y,
    contentWidth,
    4
  );

  doc.save(`invoice-${order.id}.pdf`);
}
