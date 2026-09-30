import { Link } from 'react-router-dom';
import { BRAND_EMAIL, BRAND_NAME } from '../../data/brand';

const POLICY_ITEMS = [
  {
    title: 'Final sale',
    desc: 'Freeze-dried products are hygiene-sensitive — orders are final once placed. Review cart and delivery details before checkout.',
  },
  {
    title: '12-hour cancellation',
    desc: 'Contact support within 12 hours of ordering to cancel or change an order before it ships.',
  },
  {
    title: 'No returns',
    desc: 'We do not accept returns or exchanges after purchase, including promotional and discounted items.',
  },
  {
    title: 'Damaged or wrong item',
    desc: 'Notify us within 24 hours of delivery with your order number, details, and photos for eligible resolution.',
  },
];

export default function ProductReturnPolicy() {
  return (
    <section className="mt-10 border border-sage/50 bg-white p-5 md:p-6">
      <h2 className="font-heading text-lg font-semibold text-primary">Return &amp; refund policy</h2>
      <p className="mt-1 text-sm text-muted">
        {BRAND_NAME} — premium freeze-dried fruit. Full terms on our policy pages.
      </p>
      <ul className="mt-5 grid gap-4 sm:grid-cols-2">
        {POLICY_ITEMS.map((item) => (
          <li key={item.title} className="border border-sage/40 bg-cream/50 p-4">
            <h3 className="text-sm font-semibold text-primary">{item.title}</h3>
            <p className="mt-1.5 text-xs leading-relaxed text-muted">{item.desc}</p>
          </li>
        ))}
      </ul>
      <p className="mt-4 text-xs text-muted">
        <Link to="/return-policy" className="font-medium text-primary underline">
          Return policy
        </Link>
        {' · '}
        <Link to="/refund-policy" className="font-medium text-primary underline">
          Refund policy
        </Link>
        {' · '}
        <a href={`mailto:${BRAND_EMAIL}`} className="font-medium text-primary underline">
          {BRAND_EMAIL}
        </a>
      </p>
    </section>
  );
}
