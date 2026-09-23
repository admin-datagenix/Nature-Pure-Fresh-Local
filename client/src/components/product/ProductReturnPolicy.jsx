const POLICY_ITEMS = [
  {
    title: '7-day return',
    desc: 'Damaged, wrong, or quality issues — contact us within 7 days of delivery with photos.',
  },
  {
    title: 'Easy pickup',
    desc: 'We arrange reverse pickup where available; refund after inspection (3–5 business days).',
  },
  {
    title: 'Non-returnable',
    desc: 'Opened consumables without defect, or items marked final sale, are not eligible.',
  },
  {
    title: 'Replacement',
    desc: 'Prefer a swap? We can ship a replacement for eligible snack & powder packs.',
  },
];

export default function ProductReturnPolicy() {
  return (
    <section className="mt-10 border border-sage/50 bg-white p-5 md:p-6">
      <h2 className="font-heading text-lg font-semibold text-primary">Return &amp; refund policy</h2>
      <p className="mt-1 text-sm text-muted">
        NaturePure Fresh — fair returns like major marketplaces. Keep your invoice and batch details handy.
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
        Questions? Email{' '}
        <a href="mailto:naturepure.in@gmail.com" className="font-medium text-primary underline">
          naturepure.in@gmail.com
        </a>{' '}
        or call support from your account page.
      </p>
    </section>
  );
}
