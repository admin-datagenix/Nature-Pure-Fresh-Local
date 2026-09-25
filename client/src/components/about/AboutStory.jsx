import Reveal from '../ui/Reveal';
import AboutPageLogo from './AboutPageLogo';
import { COMPANY_NAME } from '../../data/brand';
import { ABOUT_SUBHEADING, ABOUT_MISSION_LINE, ABOUT_PARAGRAPHS } from '../../data/aboutContent';

export default function AboutStory() {
  return (
    <section className="about-page-section border-t border-sage/45 py-8 md:py-10" id="about-story">
      <div className="site-container">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(220px,15rem)] lg:gap-10">
          <div className="min-w-0">
            <Reveal>
              <p className="font-heading text-xl font-medium leading-snug text-secondary md:text-2xl">
                {ABOUT_SUBHEADING}
              </p>
            </Reveal>

            <Reveal delay={60}>
              <p className="mt-5 text-base leading-[1.75] text-muted">{ABOUT_PARAGRAPHS[0]}</p>
            </Reveal>

            <Reveal delay={100}>
              <div className="mt-5 rounded-xl border border-sage/60 bg-fresh px-5 py-5">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-primary/80">Our mission is simple</p>
                <p className="mt-2 font-heading text-lg font-semibold leading-snug text-primary md:text-xl">
                  {ABOUT_MISSION_LINE}
                </p>
              </div>
            </Reveal>

            {ABOUT_PARAGRAPHS.slice(1).map((paragraph, i) => (
              <Reveal key={paragraph.slice(0, 24)} delay={140 + i * 50}>
                <p className="mt-5 text-base leading-[1.75] text-muted">{paragraph}</p>
              </Reveal>
            ))}
          </div>

          <Reveal delay={120} className="mx-auto w-full max-w-[15rem] lg:mx-0 lg:sticky lg:top-24">
            <aside className="about-story-aside flex flex-col items-center text-center">
              <div className="about-story-aside__logo-wrap flex w-full items-center justify-center">
                <AboutPageLogo size="sidebar" />
              </div>
              <p className="mt-4 text-sm font-semibold leading-snug text-primary">{COMPANY_NAME}</p>
              <p className="mt-2 text-xs leading-relaxed text-muted">
                Miraj, Sangli, Maharashtra — serving India &amp; export partners worldwide
              </p>
            </aside>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
