import { Link } from 'react-router-dom';
import BrandLogo from '../ui/BrandLogo';
import { BRAND_LOGO_FOOTER, BRAND_LOGO_FOOTER_PIXELS } from '../../data/brand';
import { useSiteConfig } from '../../context/SiteConfigContext';

const DEFAULT_FOOTER_SHOP = [
  { to: '/', label: 'Home' },
  { to: '/about', label: 'About Us' },
  { to: '/shop', label: 'Shop' },
];

export default function Footer() {
  const { brand, contact, catalogPdfs, navigation, assets } = useSiteConfig();
  const footerLogoSrc = assets?.logoFooter || BRAND_LOGO_FOOTER;
  const footerLinks = navigation?.footer || { Shop: DEFAULT_FOOTER_SHOP, Support: [] };

  const shopLinks = footerLinks.Shop?.length ? footerLinks.Shop : DEFAULT_FOOTER_SHOP;
  const supportLinks = footerLinks.Support || [];

  const navSection = (title, links) => (
    <div>
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
  );

  return (
    <footer className="mt-auto w-full max-w-full overflow-x-hidden bg-primary py-10 text-white/85 md:py-11">
      <div className="site-container">
        <div className="grid gap-8 lg:grid-cols-[1.5fr_repeat(2,1fr)]">
          <div>
            <div className="mb-4">
              <BrandLogo
                bareLogo
                logoOnly
                src={footerLogoSrc}
                imageWidth={BRAND_LOGO_FOOTER_PIXELS.width}
                imageHeight={BRAND_LOGO_FOOTER_PIXELS.height}
                className="footer-brand-slot mb-0 !items-start"
                imageClassName="footer-brand-logo bg-transparent"
              />
            </div>
            <p className="mb-4 max-w-md text-sm leading-relaxed opacity-80 sm:text-[0.9375rem] md:text-base">
              {contact?.addressFull}
            </p>

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

          <div className="col-span-full grid grid-cols-2 gap-x-8 gap-y-6 text-left lg:col-span-2 lg:gap-8">
            <div>{navSection('Shop', shopLinks)}</div>
            <div className="self-start">{navSection('Support', supportLinks)}</div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-white/15 pt-5 text-xs opacity-60">
          <p>
            © {new Date().getFullYear()} {brand?.companyName} ({brand?.name}). Made in India 🇮🇳
          </p>
          <p className="mr-2 sm:mr-6 md:mr-10">
            Designed and Developed by{' '}
            <a
              href="https://www.datagenix.in/"
              target="_blank"
              rel="noopener noreferrer"
              color="white"
              className="font-semibold text-white/90 underline-offset-2 transition hover:text-white hover:underline"
            >
              <b>DatagenixAi</b>
            </a>
          </p>
        </div>
      </div>
    </footer>
  );
}
