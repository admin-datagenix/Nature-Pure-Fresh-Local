import { useState } from 'react';
import {
  BRAND_EMAIL,
  BRAND_MAP_EMBED_URL,
  BRAND_MAP_OPEN_URL,
  BRAND_PHONE,
  BRAND_PHONE_RAW,
  BRAND_WEBSITE,
  BRAND_WEBSITE_URL,
  CATALOG_PDF,
} from '../data/brand';
import Reveal from '../components/ui/Reveal';
import NeoSelect from '../components/ui/NeoSelect';
import { notifyError, notifySuccess } from '../utils/notify';

const SUBJECTS = [
  'General enquiry',
  'Product & orders',
  'Wholesale / bulk',
  'Returns & refunds',
  'Other',
];

export default function ContactPage() {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    subject: SUBJECTS[0],
    message: '',
  });
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((f) => ({ ...f, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSending(true);
    setError(null);
    try {
      await new Promise((r) => setTimeout(r, 700));
      setSent(true);
      setForm({ name: '', email: '', phone: '', subject: SUBJECTS[0], message: '' });
      notifySuccess('Message sent! We will get back to you soon.');
    } catch {
      const msg = 'Could not send your message. Please email us directly.';
      setError(msg);
      notifyError(msg);
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="pb-16 pt-8 md:pt-10">
      <div className="site-container">
        <Reveal variant="blur" className="text-center">
          <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Get in touch</p>
          <h1 className="mt-2 font-heading text-3xl font-semibold text-primary md:text-4xl">Contact Us</h1>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,1.05fr)] lg:gap-10">
          <Reveal variant="left">
            <form
              onSubmit={handleSubmit}
              className="rounded-[1.25rem] border border-sage/55 bg-white p-6 shadow-[0_8px_28px_rgba(41,70,51,0.06)] md:p-8"
            >
              <h2 className="font-heading text-xl font-semibold text-primary">Send a message</h2>
              <p className="mt-1 text-sm text-muted">Fields marked with * are required.</p>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-primary">Full name *</span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="neo-input mt-1.5 w-full px-4 py-2.5 text-base"
                    autoComplete="name"
                    placeholder="e.g. Rahul Patil"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-primary">Email *</span>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="neo-input mt-1.5 w-full px-4 py-2.5 text-base"
                      autoComplete="email"
                      placeholder="you@email.com"
                    />
                  </label>
                  <label className="block">
                    <span className="text-sm font-medium text-primary">Phone</span>
                    <input
                      type="tel"
                      name="phone"
                      value={form.phone}
                      onChange={handleChange}
                      className="neo-input mt-1.5 w-full px-4 py-2.5 text-base"
                      autoComplete="tel"
                      placeholder="+91 98765 43210"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-primary">Subject *</span>
                  <NeoSelect
                    name="subject"
                    required
                    value={form.subject}
                    onChange={handleChange}
                    wrapperClassName="mt-1.5"
                    className="px-4 py-2.5 text-base"
                  >
                    {SUBJECTS.map((s) => (
                      <option key={s} value={s}>
                        {s}
                      </option>
                    ))}
                  </NeoSelect>
                </label>
                <label className="block">
                  <span className="text-sm font-medium text-primary">Message *</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="neo-input neo-textarea mt-1.5 w-full px-4 py-3 text-base"
                    placeholder="Tell us how we can help…"
                  />
                </label>
              </div>

              {error && <p className="mt-4 text-sm text-strawberry">{error}</p>}
              {sent && (
                <p className="mt-4 text-sm text-success">
                  Thank you — your message has been received. We will get back to you soon.
                </p>
              )}

              <button type="submit" disabled={sending} className="neo-btn mt-6 px-6 py-3 text-base font-semibold disabled:opacity-60">
                {sending ? 'Sending…' : 'Submit enquiry'}
              </button>
            </form>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={CATALOG_PDF.snacks}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn px-5 py-2.5 text-sm font-semibold"
              >
                Snacks catalog
              </a>
              <a
                href={CATALOG_PDF.powder}
                target="_blank"
                rel="noopener noreferrer"
                className="neo-btn-ghost px-5 py-2.5 text-sm font-semibold"
              >
                Powder catalog
              </a>
            </div>
          </Reveal>

          <Reveal variant="right" delay={80} className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <ContactCard label="Email" href={`mailto:${BRAND_EMAIL}`}>
                {BRAND_EMAIL}
              </ContactCard>
              <ContactCard label="Phone / WhatsApp" href={`https://wa.me/91${BRAND_PHONE_RAW}`}>
                {BRAND_PHONE}
              </ContactCard>
              <ContactCard label="Website" href={BRAND_WEBSITE_URL} external>
                {BRAND_WEBSITE}
              </ContactCard>
              <ContactCard label="Hours">Mon–Sat, 10 AM – 6 PM IST</ContactCard>
            </div>

            <div className="overflow-hidden rounded-[1.25rem] border border-sage/55 bg-white shadow-[0_8px_28px_rgba(41,70,51,0.06)]">
              <div className="flex flex-wrap items-center justify-between gap-2 border-b border-sage/45 px-4 py-3 md:px-5">
                <h2 className="font-heading text-lg font-semibold text-primary">Our location</h2>
                <a
                  href={BRAND_MAP_OPEN_URL}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-sm font-medium text-primary underline underline-offset-2"
                >
                  Get directions
                </a>
              </div>
              <div className="relative aspect-[4/3] min-h-[220px] w-full bg-cream-dark sm:min-h-[260px]">
                <iframe
                  title="NaturePure Fresh office on Google Maps"
                  src={BRAND_MAP_EMBED_URL}
                  className="absolute inset-0 h-full w-full border-0"
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  allowFullScreen
                />
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </div>
  );
}

function ContactCard({ label, href, external, children }) {
  const inner = (
    <div className="h-full rounded-[1rem] border border-sage/50 bg-white p-4 shadow-[0_4px_16px_rgba(41,70,51,0.04)]">
      <strong className="block text-sm font-semibold text-primary">{label}</strong>
      <span className="mt-1 block text-sm leading-relaxed text-muted">{children}</span>
    </div>
  );

  if (!href) return inner;

  return (
    <a
      href={href}
      target={external || href.startsWith('http') ? '_blank' : undefined}
      rel={external || href.startsWith('http') ? 'noopener noreferrer' : undefined}
      className="block transition hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(41,70,51,0.08)]"
    >
      {inner}
    </a>
  );
}
