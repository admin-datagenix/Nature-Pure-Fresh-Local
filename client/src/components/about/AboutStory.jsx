import Reveal from '../ui/Reveal';
import { buildAboutPage } from '../../api/mock/cms/aboutPage';

const FALLBACK = buildAboutPage().story;

export default function AboutStory({ story }) {
  const data = story || FALLBACK;

  return (
    <section className="about-why-section relative overflow-hidden border-t border-sage/40 pb-14 pt-8 md:pb-20 md:pt-10" id="about-story">
      <div className="about-why-section__glow pointer-events-none absolute inset-0" aria-hidden="true" />
      <div className="site-container relative z-[1]">
        <Reveal variant="blur" className="mx-auto max-w-6xl text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {data.aboutUsHeading || 'About Us'}
          </h2>
          <p className="mx-auto mt-4 max-w-2xl text-base font-medium leading-relaxed text-primary/85 sm:max-w-none md:whitespace-nowrap md:text-[1.0625rem] lg:text-lg">
            {data.closing}
          </p>
        </Reveal>

        <div className="mt-10 grid gap-8 lg:grid-cols-12 lg:items-stretch lg:gap-10 xl:gap-12 md:mt-12">
          <div className="flex flex-col gap-6 lg:col-span-7 lg:h-full lg:justify-center">
            {(data.intro || []).map((paragraph, i) => (
              <Reveal key={i} variant="up" delay={i * 60}>
                <p className="text-base leading-[1.85] text-primary/85 md:text-[1.0625rem]">{paragraph}</p>
              </Reveal>
            ))}

            <Reveal variant="left" delay={120}>
              <blockquote className="about-why-quote rounded-2xl border border-sage/50 bg-cream-dark/80 px-5 py-6 md:px-7 md:py-7">
                <p className="text-sm leading-relaxed text-primary/80 md:text-base">{data.foundersLeadIn}</p>
                <p className="mt-4 font-heading text-lg font-semibold leading-snug text-primary md:text-xl">
                  “{data.founderQuestion}”
                </p>
                <footer className="mt-4 text-xs font-semibold uppercase tracking-[0.12em] text-secondary">
                  Rahul Ganeshwade & Mahesh Dhayare
                </footer>
              </blockquote>
            </Reveal>

            <div className="space-y-5">
              {(data.body || []).map((paragraph, i) => (
                <Reveal key={paragraph.slice(0, 28)} variant="up" delay={160 + i * 45}>
                  <p className="text-base leading-[1.85] text-primary/80 md:text-[1.0625rem]">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <div className="flex min-h-[18rem] flex-col justify-center lg:col-span-5 lg:h-full lg:min-h-0">
            <Reveal
              variant="right"
              delay={80}
              className="about-story-visual flex h-full min-h-[18rem] flex-1 flex-col lg:min-h-0"
            >
              <div className="about-story-visual__frame flex flex-1 items-center justify-center lg:py-2">
                <img
                  src={data.storyImage}
                  alt=""
                  className="about-story-visual__img about-story-visual__img--theme mx-auto block h-auto w-full max-h-[34rem] object-contain object-center lg:max-h-full lg:min-h-[20rem]"
                  decoding="async"
                  loading="lazy"
                />
              </div>
            </Reveal>

            {(data.catalogDownloads || []).length > 0 ? (
              <Reveal variant="up" delay={140} className="mt-4 flex w-full flex-col gap-3">
                {(data.catalogDownloads || []).map((dl) => (
                  <a
                    key={dl.href}
                    href={dl.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      dl.variant === 'ghost'
                        ? 'neo-btn-ghost w-full px-5 py-3 text-center text-sm font-semibold'
                        : 'neo-btn w-full px-5 py-3 text-center text-sm font-semibold'
                    }
                  >
                    {dl.label}
                  </a>
                ))}
              </Reveal>
            ) : null}
          </div>
        </div>
      </div>
    </section>
  );
}
