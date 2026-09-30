import AboutCertifications from '../components/about/AboutCertifications';
import AboutStory from '../components/about/AboutStory';
import ProcessTimeline from '../components/home/ProcessTimeline';
import AboutPageHero from '../components/about/AboutPageHero';

export default function AboutPage() {
  return (
    <div className="bg-cream">
      <AboutPageHero />

      <AboutStory />
      <AboutCertifications />
      <ProcessTimeline />

      {/* <section className="about-page-section border-t border-sage/45 py-8 md:py-10" id="contact">
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
      </section> */}
    </div>
  );
}
