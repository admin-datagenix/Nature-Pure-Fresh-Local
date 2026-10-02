import { Link } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo';
import useCategoryTree from '../../hooks/useCategoryTree';
import { useSiteConfig } from '../../context/SiteConfigContext';

export default function Footer() {
  const { categories } = useCategoryTree();
  const { brand, contact, assets, catalogPdfs, navigation } = useSiteConfig();
  const footerLinks = navigation?.footer || { Learn: [], Support: [] };

  const footerSections = {
    Shop: [{ to: '/shop', label: 'All Products' }, ...categories.map((c) => ({ to: `/shop/${c.slug}`, label: c.name }))],
    ...footerLinks,
  };

  return (
    <footer className="mt-auto w-full max-w-full overflow-x-hidden bg-primary py-10 text-white/85 md:py-11">
      <div className="site-container">
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-[1.5fr_repeat(3,1fr)]">
          <div>
            <div className="mb-3 inline-flex rounded-xl bg-white p-2.5 shadow-[0_4px_16px_rgba(0,0,0,0.12)]">
              <BrandLogo
                logoOnly
                src={assets?.logoNavbar}
                className="mb-0"
                imageClassName="h-10 w-auto max-w-[min(100%,15rem)] object-contain object-left sm:h-11 sm:max-w-[17rem]"
              />
            </div>
            <p className="mb-4 max-w-xs text-xs leading-relaxed opacity-65">{contact?.addressFull}</p>

            <div className="mb-4 space-y-1 text-sm">
              <a href={`mailto:${contact?.email}`} className="block opacity-80 transition hover:opacity-100">
                {contact?.email}
              </a>
              <a
                href={`tel:+91${contact?.phoneRaw}`}
                className="block opacity-80 transition hover:opacity-100"
              >
                {contact?.phone}
              </a>
            </div>

            <div className="mt-4 flex flex-wrap gap-2">
              <a
                href={catalogPdfs?.snacks}
                target="_blank"
                rel="noopener noreferrer"
                className="rounded-full border border-white/20 px-3 py-1 text-xs opacity-80 transition hover:bg-white/10 hover:opacity-100"
              >
                Snacks Catalog
              </a>
              <a
                href={catalogPdfs?.powder}
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
            © {new Date().getFullYear()} {brand?.companyName} ({brand?.name}). Made in India 🇮🇳
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
