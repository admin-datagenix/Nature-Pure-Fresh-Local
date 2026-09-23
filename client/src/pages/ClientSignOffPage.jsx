import { Link } from 'react-router-dom';
import Reveal from '../components/ui/Reveal';

const JOURNEY_SCREENS = [
  { label: 'Home', to: '/', mobile: true, desktop: true },
  { label: 'Listing (shop)', to: '/shop', mobile: true, desktop: true },
  { label: 'Product detail', to: '/shop/fruit-snacks', mobile: true, desktop: true },
  { label: 'Cart', to: '/cart', mobile: true, desktop: true },
  { label: 'Checkout', to: '/checkout', mobile: true, desktop: true },
  { label: 'Account', to: '/account', mobile: true, desktop: true },
];

export default function ClientSignOffPage() {
  return (
    <div className="site-container py-10 md:py-14">
      <Reveal variant="blur">
        <p className="text-sm font-semibold uppercase tracking-wider text-secondary">Stakeholder review</p>
        <h1 className="mt-2 font-heading text-3xl font-semibold text-primary md:text-4xl">Client sign-off</h1>
        <p className="mt-3 max-w-3xl text-base text-muted">
          Customer journey screens (wireframe / visual review) and auth acceptance criteria. Full checklist:{' '}
          <code className="rounded bg-cream-dark px-1.5 py-0.5 text-sm">client/docs/CLIENT_SIGNOFF.md</code>
        </p>
      </Reveal>

      <Reveal variant="up" delay={80} className="mt-10">
        <h2 className="font-heading text-xl font-semibold text-primary">Storefront journey</h2>
        <p className="mt-1 text-sm text-muted">Mobile breakpoint &lt;768px · Desktop ≥1024px (Tailwind `md` / `lg`)</p>
        <div className="mt-4 overflow-x-auto rounded-lg border border-sage/50 bg-white">
          <table className="w-full min-w-[640px] text-left text-sm">
            <thead className="border-b border-sage/45 bg-cream/80 text-primary">
              <tr>
                <th className="px-4 py-3 font-semibold">Screen</th>
                <th className="px-4 py-3 font-semibold">Preview</th>
                <th className="px-4 py-3 font-semibold">Mobile</th>
                <th className="px-4 py-3 font-semibold">Desktop</th>
              </tr>
            </thead>
            <tbody>
              {JOURNEY_SCREENS.map((row) => (
                <tr key={row.to} className="border-b border-sage/30 last:border-0">
                  <td className="px-4 py-3 font-medium text-primary">{row.label}</td>
                  <td className="px-4 py-3">
                    <Link to={row.to} className="text-secondary underline underline-offset-2 hover:text-primary">
                      Open
                    </Link>
                  </td>
                  <td className="px-4 py-3 text-muted">{row.mobile ? '✓' : '—'}</td>
                  <td className="px-4 py-3 text-muted">{row.desktop ? '✓' : '—'}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Reveal>

      <div className="mt-10 grid gap-6 md:grid-cols-2">
        <Reveal variant="left" delay={120}>
          <section className="rounded-lg border border-sage/50 bg-white p-5">
            <h2 className="font-heading text-lg font-semibold text-primary">Registration (mobile + OTP)</h2>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted">
              <li>Verified mobile on success</li>
              <li>Duplicate number blocked</li>
              <li>Account + session token on verify</li>
              <li>OTP expires in 5 minutes</li>
            </ul>
            <Link to="/register" className="mt-4 inline-block text-sm font-semibold text-primary underline">
              Test registration →
            </Link>
          </section>
        </Reveal>

        <Reveal variant="right" delay={120}>
          <section className="rounded-lg border border-sage/50 bg-white p-5">
            <h2 className="font-heading text-lg font-semibold text-primary">Login &amp; recovery</h2>
            <ul className="mt-3 list-inside list-disc space-y-1.5 text-sm text-muted">
              <li>Email + password or mobile OTP</li>
              <li>Reset OTP / links expire (5 min)</li>
              <li>Failed login rate-limited (5 tries / 15 min)</li>
            </ul>
            <div className="mt-4 flex flex-wrap gap-4 text-sm font-semibold">
              <Link to="/login" className="text-primary underline">
                Login
              </Link>
              <Link to="/forgot-password" className="text-primary underline">
                Recover access
              </Link>
            </div>
          </section>
        </Reveal>
      </div>
    </div>
  );
}
