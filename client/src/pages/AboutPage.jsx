import AboutCertifications from '../components/about/AboutCertifications';
import AboutStory from '../components/about/AboutStory';
import ProcessTimeline from '../components/home/ProcessTimeline';
import Reveal from '../components/ui/Reveal';
import AboutPageHero from '../components/about/AboutPageHero';
import {
  BRAND_NAME,
  BRAND_EMAIL,
  BRAND_PHONE,
  BRAND_PHONE_RAW,
  BRAND_WEBSITE,
  BRAND_WEBSITE_URL,
  BRAND_ADDRESS_FULL,
  COMPANY_NAME,
  CATALOG_PDF,
} from '../data/brand';

export default function AboutPage() {
  return (
    <div className="about-page bg-cream">
      <AboutPageHero />

      <AboutStory />
      <AboutCertifications />
      <ProcessTimeline />

      <section className="about-page-section border-t border-sage/45 py-8 md:py-10" id="faq">
        <div className="site-container max-w-3xl">
          <Reveal>
            <h2 className="font-heading text-2xl text-primary md:text-3xl">Frequently Asked Questions</h2>
          </Reveal>
          <div className="mt-5">
            {[
              {
                q: 'What is freeze-drying?',
                a: 'Freeze-drying removes water from fruit at low temperatures, preserving nutrients, colour, and flavour without additives.',
              },
              {
                q: 'Do you add sugar?',
                a: 'Never. Our fruit snacks contain only the natural sugars present in the fruit itself — 0g added sugar.',
              },
              {
                q: 'How long is the shelf life?',
                a: 'Unopened packs last 12–18 months. No refrigeration needed — perfect for travel.',
              },
              {
                q: 'Are products FSSAI certified?',
                a: `Yes, all ${BRAND_NAME} products are FSSAI certified and made in India by ${COMPANY_NAME}.`,
              },
            ].map((item, i) => (
              <Reveal key={item.q} delay={i * 60}>
                <details className="border-b border-sage py-3.5">
                  <summary className="cursor-pointer list-none font-semibold text-primary [&::-webkit-details-marker]:hidden">
                    {item.q}
                  </summary>
                  <p className="mt-2 text-sm leading-relaxed text-muted">{item.a}</p>
                </details>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      <section className="about-page-section border-t border-sage/45 py-8 md:py-10" id="contact">
        <div className="site-container">
          <Reveal>
            <h2 className="font-heading text-2xl text-primary md:text-3xl">Contact Us</h2>
            <p className="mt-2 text-sm text-muted">We&apos;d love to hear from you — orders, wholesale, or general enquiries.</p>
          </Reveal>
          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {[
              { label: 'Email', value: BRAND_EMAIL, href: `mailto:${BRAND_EMAIL}` },
              { label: 'Phone / WhatsApp', value: BRAND_PHONE, href: `https://wa.me/91${BRAND_PHONE_RAW}` },
              { label: 'Website', value: BRAND_WEBSITE, href: BRAND_WEBSITE_URL },
              { label: 'Address', value: BRAND_ADDRESS_FULL },
              { label: 'Company', value: COMPANY_NAME },
              { label: 'Hours', value: 'Mon–Sat, 10 AM – 6 PM IST' },
            ].map((c, i) => (
              <Reveal key={c.label} delay={i * 80}>
                <div className="neo-card h-full p-5">
                  <strong className="block text-primary">{c.label}</strong>
                  {c.href ? (
                    <a
                      href={c.href}
                      target={c.href.startsWith('http') ? '_blank' : undefined}
                      rel={c.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                      className="mt-1 block text-sm text-muted transition hover:text-primary"
                    >
                      {c.value}
                    </a>
                  ) : (
                    <p className="mt-1 text-sm leading-relaxed text-muted">{c.value}</p>
                  )}
                </div>
              </Reveal>
            ))}
          </div>

          <Reveal delay={200} className="mt-5 flex flex-wrap gap-3">
            <a
              href={CATALOG_PDF.snacks}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn px-6 py-2.5 text-sm font-semibold"
            >
              Download Snacks Catalog
            </a>
            <a
              href={CATALOG_PDF.powder}
              target="_blank"
              rel="noopener noreferrer"
              className="neo-btn-ghost px-6 py-2.5 text-sm font-semibold"
            >
              Download Powder Catalog
            </a>
          </Reveal>
        </div>
      </section>
    </div>
  );
}
