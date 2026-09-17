import { Link } from 'react-router-dom';
import { BRAND_NAME } from '../../api/client';

const FOOTER_LINKS = {
  Shop: [
    { to: '/shop', label: 'All Products' },
    { to: '/shop/fruit-snacks', label: 'Fruit Snacks' },
    { to: '/shop/combos', label: 'Combos' },
    { to: '/shop/baking-essentials', label: 'Fruit Powders' },
  ],
  Learn: [
    { to: '/about', label: 'About Us' },
    { to: '/about#process', label: 'Our Process' },
    { to: '/about#recipes', label: 'Recipes' },
  ],
  Support: [
    { to: '/about#contact', label: 'Contact' },
    { to: '/about#faq', label: 'FAQ' },
    { to: '/about#shipping', label: 'Shipping Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto bg-primary px-4 py-16 text-white/85 md:px-6">
      <div className="mx-auto max-w-6xl">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="mb-3 flex items-center gap-2 font-heading text-xl font-semibold text-white">
              <span className="text-2xl">🍃</span>
              {BRAND_NAME}
            </div>
            <p className="mb-5 text-sm opacity-70">Real Fruit. Real Crunch. Nothing Added.</p>
            <div className="flex gap-3">
              {['📷', '💬'].map((icon, i) => (
                <a
                  key={i}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-full bg-white/10 transition hover:bg-white/20"
                  aria-label={i === 0 ? 'Instagram' : 'WhatsApp'}
                >
                  {icon}
                </a>
              ))}
            </div>
          </div>

          {Object.entries(FOOTER_LINKS).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-4 font-heading text-base text-white">{title}</h4>
              <ul className="flex flex-col gap-2.5">
                {links.map((link) => (
                  <li key={link.to}>
                    <Link to={link.to} className="text-sm opacity-70 transition hover:opacity-100">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-12 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-6 text-xs opacity-60">
          <p>© {new Date().getFullYear()} {BRAND_NAME}. Made in India 🇮🇳</p>
          <div className="flex gap-4">
            <span>FSSAI Certified</span>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
