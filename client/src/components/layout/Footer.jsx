import { Link } from 'react-router-dom';
import {
  BRAND_NAME,
  BRAND_EMAIL,
  BRAND_PHONE,
  BRAND_PHONE_RAW,
  BRAND_ADDRESS_FULL,
  COMPANY_NAME,
  CATALOG_PDF,
  BRAND_LOGO_NAVBAR,
} from '../../data/brand';
import BrandLogo from '../ui/BrandLogo';
import useCategoryTree from '../../hooks/useCategoryTree';

const FOOTER_STATIC = {
  Learn: [
    { to: '/about', label: 'About Us' },
    { to: '/about#process', label: 'Our Process' },
    { to: '/about#recipes', label: 'Recipes' },
  ],
  Support: [
    { to: '/contact', label: 'Contact' },
    { to: '/return-policy', label: 'Return Policy' },
    { to: '/refund-policy', label: 'Refund Policy' },
    { to: '/about#shipping', label: 'Shipping Policy' },
  ],
};

export default function Footer() {
  const { categories } = useCategoryTree();

  const footerSections = {
    Shop: [{ to: '/shop', label: 'All Products' }, ...categories.map((c) => ({ to: `/shop/${c.slug}`, label: c.name }))],
    ...FOOTER_STATIC,
  };

  return (
    <footer className="mt-auto w-full max-w-full overflow-x-hidden bg-primary py-10 text-white/85 md:py-11">
      <div className="site-container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="mb-3 inline-flex rounded-xl bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <BrandLogo
                logoOnly
                src={BRAND_LOGO_NAVBAR}
                className="mb-0"
                imageClassName="h-10 w-auto max-w-[min(100%,15rem)] object-contain object-left sm:h-11 sm:max-w-[17rem]"
              />
            </div>
            <p className="mb-4 max-w-xs text-xs leading-relaxed opacity-65">{BRAND_ADDRESS_FULL}</p>

            <div className="mb-4 space-y-1 text-sm">
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

            <div className="mt-4 flex flex-wrap gap-2">
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

          {Object.entries(footerSections).map(([title, links]) => (
            <div key={title}>
              <h4 className="mb-3 font-heading text-base text-white">{title}</h4>
              <ul className="flex flex-col gap-2">
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

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5 text-xs opacity-60">
          <p>
            © {new Date().getFullYear()} {COMPANY_NAME} ({BRAND_NAME}). Made in India 🇮🇳
          </p>
          <div className="flex flex-wrap gap-x-4 gap-y-1">
            <Link to="/return-policy" className="transition hover:opacity-100">
              Return Policy
            </Link>
            <Link to="/refund-policy" className="transition hover:opacity-100">
              Refund Policy
            </Link>
            <span>FSSAI Certified</span>
            <span>Secure Payments</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
