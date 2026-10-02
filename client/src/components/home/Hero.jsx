import { Link } from 'react-router-dom';
import { buildHomePage } from '../../api/mock/cms/homePage';
import HeroBanner from './HeroBanner';
import HeroTrustBrief from './HeroTrustBrief';

const FALLBACK_HERO = buildHomePage().hero;

export default function Hero({ content }) {
  const hero = content || FALLBACK_HERO;

  return (
    <section className="relative w-full overflow-x-hidden bg-cream pb-8 pt-8 md:pb-10 md:pt-10">
      <div className="site-container">
        <div className="relative overflow-hidden rounded-[2rem] bg-gradient-to-br from-[#eef6f0] via-white to-[#e8f0f8] shadow-[0_20px_50px_rgba(41,70,51,0.08)]">
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -left-16 top-0 h-48 w-48 rounded-full bg-secondary/10 blur-3xl" />
            <div className="absolute right-0 top-8 h-56 w-56 rounded-full bg-sky-100/70 blur-3xl" />
          </div>

          <div className="relative grid items-center gap-8 p-6 pb-8 md:p-10 md:pb-9 lg:grid-cols-[1fr_1.45fr] lg:gap-10 lg:p-12 lg:pb-10 xl:grid-cols-[0.88fr_1.5fr]">
            <div className="text-center lg:text-left">
              <span className="inline-flex animate-fade-up rounded-full border border-secondary/30 bg-white/80 px-4 py-1.5 text-xs font-semibold uppercase tracking-[0.14em] text-secondary">
                {hero.eyebrow}
              </span>

              <p
                className="animate-fade-up mt-4 text-[0.65rem] font-bold uppercase tracking-[0.2em] text-muted sm:text-xs"
                style={{ animationDelay: '0.05s' }}
              >
                {hero.companyName}
              </p>

              <h1
                className="animate-fade-up font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-primary md:text-5xl lg:text-[3rem]"
                style={{ animationDelay: '0.15s' }}
              >
                {hero.titlePrimary}
                <span className="block text-secondary">{hero.titleAccent}</span>
              </h1>

              <p
                className="mx-auto mt-4 max-w-lg animate-fade-up text-base leading-relaxed text-muted md:text-lg lg:mx-0"
                style={{ animationDelay: '0.25s' }}
              >
                {hero.description}
              </p>

              <div
                className="mt-6 flex animate-fade-up flex-wrap justify-center gap-3 lg:justify-start"
                style={{ animationDelay: '0.35s' }}
              >
                <Link
                  to={hero.primaryCta?.to || '/shop'}
                  className="neo-btn group inline-flex items-center gap-2.5 rounded-full px-7 py-3.5 text-base font-semibold"
                >
                  {hero.primaryCta?.label || 'Shop Collection'}
                  <span className="flex h-6 w-6 items-center justify-center rounded-full bg-white/20 transition group-hover:translate-x-0.5">
                    →
                  </span>
                </Link>
                <Link
                  to={hero.secondaryCta?.to || '/contact'}
                  className="neo-btn-ghost inline-flex items-center rounded-full px-7 py-3.5 text-base font-semibold"
                >
                  {hero.secondaryCta?.label || 'Contact Us'}
                </Link>
              </div>

              <HeroTrustBrief
                className="animate-fade-up mx-auto lg:mx-0"
                style={{ animationDelay: '0.45s' }}
              />
            </div>

            <div
              className="animate-fade-up flex min-h-[360px] min-w-0 items-center justify-center sm:min-h-[480px] lg:min-h-[560px] xl:min-h-[600px]"
              style={{ animationDelay: '0.2s' }}
            >
              <div className="hero-banner-column w-full max-w-full">
                <HeroBanner banner={hero.banner} />
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
