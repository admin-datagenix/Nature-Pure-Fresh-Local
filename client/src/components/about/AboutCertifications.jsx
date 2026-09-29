import Reveal from '../ui/Reveal';
import {
  CERTIFICATIONS_INTRO,
  CERTIFICATION_LOGOS,
  CERTIFICATION_STANDARDS,
} from '../../data/certifications';
import { BRAND_NAME } from '../../data/brand';

function LogoTile({ logo }) {
  return (
    <div className="flex min-h-[148px] items-center justify-center rounded-2xl border border-sage/55 bg-white p-5 shadow-[0_8px_24px_rgba(41,70,51,0.06)] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(41,70,51,0.09)] sm:min-h-[168px] md:p-6">
      <img
        src={logo.src}
        alt={logo.alt}
        loading="lazy"
        decoding="async"
        className="max-h-[100px] w-auto max-w-full object-contain sm:max-h-[120px]"
      />
    </div>
  );
}

export default function AboutCertifications() {
  return (
    <section className="border-t border-sage/45 bg-cream-dark/50 py-8 md:py-10" id="certifications">
      <div className="site-container">
        <Reveal className="mx-auto max-w-3xl text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">From farm to global quality</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold text-primary md:text-4xl">Our Certifications</h2>
          <p className="mt-4 text-sm leading-relaxed text-muted md:text-base">{CERTIFICATIONS_INTRO}</p>
        </Reveal>

        <Reveal delay={60} className="mt-6">
          <div className="rounded-xl border border-sage/50 bg-white/90 p-5 shadow-[0_12px_36px_rgba(41,70,51,0.06)] md:p-7">
            <p className="mb-5 text-center text-sm font-medium text-muted">
              Official marks &amp; quality badges — as shown on{' '}
              <a
                href="https://naturepurefresh.com/"
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary underline-offset-2 hover:underline"
              >
                naturepurefresh.com
              </a>
            </p>
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4 sm:gap-5 md:gap-6">
              {CERTIFICATION_LOGOS.map((logo) => (
                <LogoTile key={logo.id} logo={logo} />
              ))}
            </div>
          </div>
        </Reveal>

        <Reveal delay={100} className="mt-8">
          <div className="rounded-xl border border-sage/50 bg-primary px-5 py-8 text-white md:px-8">
            <h3 className="text-center font-heading text-xl font-semibold md:text-2xl">
              Quality standards at {BRAND_NAME}
            </h3>
            <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {CERTIFICATION_STANDARDS.map((line) => (
                <li
                  key={line}
                  className="flex items-center gap-3 rounded-xl bg-white/10 px-4 py-3 text-sm leading-snug text-white/95"
                >
                  <span
                    className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary text-xs font-bold"
                    aria-hidden="true"
                  >
                    ✓
                  </span>
                  <span>{line}</span>
                </li>
              ))}
            </ul>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
