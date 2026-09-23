import { Link } from 'react-router-dom';
import {
  BRAND_NAME,
  BRAND_EMAIL,
  BRAND_PHONE,
  BRAND_PHONE_RAW,
  BRAND_ADDRESS_FULL,
  COMPANY_NAME,
  CATALOG_PDF,
} from '../../data/brand';
import BrandLogo from '../ui/BrandLogo';

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
    { to: '/contact', label: 'Contact' },
    { to: '/about#faq', label: 'FAQ' },
    { to: '/about#shipping', label: 'Shipping Policy' },
  ],
};

export default function Footer() {
  return (
    <footer className="mt-auto w-full max-w-full overflow-x-hidden bg-primary py-16 text-white/85">
      <div className="site-container">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="mb-4 inline-flex rounded-xl bg-white p-3 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <BrandLogo
                logoOnly
                className="mb-0"
                imageClassName="h-12 max-w-[200px] object-contain sm:h-14 sm:max-w-[220px]"
              />
            </div>
            <p className="mb-5 max-w-xs text-xs leading-relaxed opacity-65">{BRAND_ADDRESS_FULL}</p>

            <div className="mb-5 space-y-1 text-sm">
              <a href={`mailto:${BRAND_EMAIL}`} className="block opacity-80 transition hover:opacity-100">
                {BRAND_EMAIL}
              </a>
              <a
                href={`tel:+91${BRAND_PHONE_RAW}`}
                className="block opacity-80 transition hover:opacity-100"
              >
                {BRAND_PHONE}
              </a>
            </div>

            <div className="mt-5 flex flex-wrap gap-2">
              <a
                href={CATALOG_PDF.snacks}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-3 py-1 text-xs opacity-80 transition hover:bg-white/10 hover:opacity-100"
              >
                Snacks Catalog
              </a>
              <a
                href={CATALOG_PDF.powder}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-3 py-1 text-xs opacity-80 transition hover:bg-white/10 hover:opacity-100"
              >
                Powder Catalog
              </a>
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
          <p>
            © {new Date().getFullYear()} {COMPANY_NAME} ({BRAND_NAME}). Made in India 🇮🇳
          </p>
          <div className="flex gap-4">
            <span>FSSAI Certified</span>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
