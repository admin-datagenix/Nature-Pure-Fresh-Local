import Reveal from '../ui/Reveal';
import { BRAND_LOGO, COMPANY_NAME } from '../../data/brand';
import { ABOUT_SUBHEADING, ABOUT_MISSION_LINE, ABOUT_PARAGRAPHS } from '../../data/aboutContent';

export default function AboutStory() {
  return (
    <section className="py-16 md:py-24" id="about-story">
      <div className="site-container">
        <div className="grid items-start gap-12 lg:grid-cols-[1fr_340px] lg:gap-16">
          <div>
            <Reveal>
              <p className="font-heading text-2xl font-medium leading-snug text-secondary md:text-[1.65rem] md:leading-snug">
                {ABOUT_SUBHEADING}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <p className="mt-8 text-base leading-[1.85] text-muted md:text-[1.05rem]">
                {ABOUT_PARAGRAPHS[0]}
              </p>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-8 rounded-2xl border border-sage/60 bg-fresh px-6 py-6 md:px-8 md:py-7">
                <p className="text-sm font-semibold uppercase tracking-[0.12em] text-primary/80">Our mission is simple</p>
                <p className="mt-2 font-heading text-xl font-semibold leading-snug text-primary md:text-2xl">
                  {ABOUT_MISSION_LINE}
                </p>
              </div>
            </Reveal>

            {ABOUT_PARAGRAPHS.slice(1).map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 24)} delay={140 + i * 50}>
                <p className="mt-8 text-base leading-[1.85] text-muted md:text-[1.05rem]">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="lg:sticky lg:top-28">
            <div className="overflow-hidden rounded-[1.75rem] border border-sage/50 bg-gradient-to-br from-white via-cream to-fresh p-8 shadow-[0_20px_50px_rgba(41,70,51,0.08)]">
              <img
                src={BRAND_LOGO}
                alt={`${COMPANY_NAME} logo`}
                className="mx-auto max-h-48 w-full object-contain"
              />
              <p className="mt-6 text-center text-sm font-semibold text-primary">{COMPANY_NAME}</p>
              <p className="mt-1 text-center text-xs leading-relaxed text-muted">
                Miraj, Sangli, Maharashtra — serving India &amp; export partners worldwide
              </p>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
