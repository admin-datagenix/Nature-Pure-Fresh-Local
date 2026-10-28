import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';

export default function NotFoundPage() {
  return (
    <div className="site-container flex min-h-[50vh] flex-col items-center justify-center py-16 text-center">
      <Reveal>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-secondary">404</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary md:text-4xl">Page not found</h1>
        <p className="mt-3 max-w-md text-sm text-muted md:text-base">
          This link may be outdated, or the address was typed incorrectly.
        </p>
        <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
          <Link
            to="/"
            className="rounded-full bg-primary px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-primary/90"
          >
            Back to home
          </Link>
          <Link
            to="/shop"
            className="rounded-full border border-sage/60 bg-white px-5 py-2.5 text-sm font-semibold text-primary transition hover:border-secondary/50"
          >
            Shop products
          </Link>
        </div>
      </Reveal>
    </div>
  );
}
