import { useState } from 'react';
import { api } from '../../api/client';
import { notifyError, notifySuccess } from '../../utils/notify';

export default function Newsletter() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');
    try {
      await api.subscribeNewsletter(email);
      setStatus('success');
      setEmail('');
      notifySuccess('Subscribed! Check your inbox for offers.');
    } catch {
      setStatus('error');
      notifyError('Could not subscribe. Please try again.');
    }
  };

  return (
    <section className="bg-primary py-14">
      <div className="site-container flex flex-col items-center justify-between gap-6 md:flex-row">
        <div className="text-center md:text-left">
          <h2 className="font-heading text-2xl text-white">Get 10% Off Your First Order</h2>
          <p className="mt-1 text-sm text-white/70">Join our snack community for exclusive offers and healthy recipes.</p>
        </div>

        <form onSubmit={handleSubmit} className="flex w-full max-w-md flex-col gap-2 sm:flex-row">
          <input
            type="email"
            placeholder="Enter your email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            aria-label="Email address"
            className="neo-input flex-1 px-5 py-3.5 text-sm"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-full bg-cream px-7 py-3.5 text-sm font-semibold text-primary shadow-[0_8px_20px_rgba(41,70,51,0.12)] transition hover:bg-white disabled:opacity-60"
          >
            {status === 'loading' ? 'Subscribing...' : 'Subscribe'}
          </button>
        </form>
      </div>

      {status === 'success' && <p className="mt-3 text-center text-sm text-green-300">Subscribed! Check your inbox.</p>}
      {status === 'error' && <p className="mt-3 text-center text-sm text-red-300">Something went wrong. Try again.</p>}
    </section>
  );
}
