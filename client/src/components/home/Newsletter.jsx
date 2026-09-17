import { useState } from 'react';
import { api } from '../../api/client';

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
    } catch {
      setStatus('error');
    }
  };

  return (
    <section className="bg-primary py-14">
      <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-6 px-4 md:flex-row md:px-6">
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
            className="flex-1 rounded-full border-0 px-5 py-3.5 text-sm outline-none focus:ring-2 focus:ring-mango"
          />
          <button
            type="submit"
            disabled={status === 'loading'}
            className="rounded-full bg-mango px-7 py-3.5 text-sm font-medium text-white transition hover:bg-[#E09520] disabled:opacity-60"
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
