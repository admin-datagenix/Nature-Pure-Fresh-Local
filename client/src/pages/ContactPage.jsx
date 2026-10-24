import { useState } from 'react';
import { CATALOG_PDF } from '../data/brand';
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

        <div className="mx-auto mt-10 max-w-2xl">
          <Reveal variant="up">
            <form
              onSubmit={handleSubmit}
              className="rounded-[1.25rem] border border-sage/55 bg-white p-6 shadow-[0_8px_28px_rgba(41,70,51,0.06)] md:p-8"
            >
              <h2 className="font-heading text-xl font-semibold text-primary">Send a message</h2>

              <div className="mt-6 space-y-4">
                <label className="block">
                  <span className="text-sm font-medium text-primary">Full name</span>
                  <input
                    type="text"
                    name="name"
                    required
                    value={form.name}
                    onChange={handleChange}
                    className="neo-input mt-1.5 w-full px-4 py-2.5 text-base"
                    autoComplete="name"
                    placeholder="Enter your name"
                  />
                </label>
                <div className="grid gap-4 sm:grid-cols-2">
                  <label className="block">
                    <span className="text-sm font-medium text-primary">Email</span>
                    <input
                      type="email"
                      name="email"
                      required
                      value={form.email}
                      onChange={handleChange}
                      className="neo-input mt-1.5 w-full px-4 py-2.5 text-base"
                      autoComplete="email"
                      placeholder="Enter your email"
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
                      placeholder="Enter your phone number"
                    />
                  </label>
                </div>
                <label className="block">
                  <span className="text-sm font-medium text-primary">Subject </span>
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
                  <span className="text-sm font-medium text-primary">Message</span>
                  <textarea
                    name="message"
                    required
                    rows={5}
                    value={form.message}
                    onChange={handleChange}
                    className="neo-input neo-textarea mt-1.5 w-full px-4 py-3 text-base"
                    placeholder="Enter your message"
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

            <div className="mt-6 flex flex-wrap justify-center gap-3">
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
        </div>
      </div>
    </div>
  );
}
