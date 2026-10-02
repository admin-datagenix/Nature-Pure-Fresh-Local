import Reveal from '../ui/Reveal';
import AboutBenefitsStrip from './AboutBenefitsStrip';
import { buildAboutPage } from '../../api/mock/cms/aboutPage';

const FALLBACK = buildAboutPage().story;

export default function AboutStory({ story }) {
  const data = story || FALLBACK;
  const paragraphs = data.paragraphs || [];

  return (
    <section className="border-t border-sage/45 py-10 md:py-12" id="about-story">
      <div className="site-container">
        <div className="grid gap-10 lg:grid-cols-2 lg:items-center lg:gap-8 xl:gap-12">
          <div className="flex min-w-0 flex-col justify-center lg:pr-3">
            <Reveal>
              <h2 className="font-heading text-2xl font-semibold text-primary md:text-3xl">{data.heading}</h2>
              <p className="mt-3 font-heading text-lg font-medium leading-snug text-secondary md:text-xl">
                {data.subheading}
              </p>
            </Reveal>

            {paragraphs[0] && (
              <Reveal delay={60}>
                <p className="mt-6 text-base leading-[1.8] text-primary/85 md:text-[1.0625rem]">{paragraphs[0]}</p>
              </Reveal>
            )}

            <Reveal delay={100}>
              <div className="mt-6 rounded-xl border border-sage/60 bg-white px-5 py-5 shadow-[0_8px_24px_rgba(41,70,51,0.06)]">
                <p className="text-xs font-semibold uppercase tracking-[0.12em] text-secondary">{data.missionLabel}</p>
                <p className="mt-2 font-heading text-lg font-semibold leading-snug text-primary md:text-[1.1675rem] md:whitespace-nowrap">
                  {data.missionLine}
                </p>
              </div>
            </Reveal>

            <div className="mt-6 space-y-5">
              {paragraphs.slice(1).map((paragraph, i) => (
                <Reveal key={paragraph.slice(0, 24)} delay={140 + i * 50}>
                  <p className="text-justify text-base leading-[1.8] text-primary/80 md:text-[1.0625rem]">{paragraph}</p>
                </Reveal>
              ))}
            </div>
          </div>

          <Reveal delay={120} className="min-w-0 lg:pl-3">
            <div className="mx-auto flex w-full max-w-[26rem] flex-col gap-3 sm:max-w-md lg:mx-0 lg:max-w-lg">
              <div className="flex justify-center">
                <img
                  src={data.storyImage}
                  alt=""
                  className="mx-auto block h-auto w-full max-w-[24rem] max-h-[28rem] object-contain object-bottom sm:max-w-[26rem] sm:max-h-[30rem] lg:max-w-[32rem] lg:max-h-[36rem] xl:max-h-[38rem]"
                  decoding="async"
                  loading="lazy"
                />
              </div>
              <AboutBenefitsStrip />
              <div className="flex w-full flex-col gap-3 sm:flex-row lg:flex-col xl:flex-row">
                {(data.catalogDownloads || []).map((dl) => (
                  <a
                    key={dl.href}
                    href={dl.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    className={
                      dl.variant === 'ghost'
                        ? 'neo-btn-ghost flex-1 px-5 py-3 text-center text-sm font-semibold'
                        : 'neo-btn flex-1 px-5 py-3 text-center text-sm font-semibold'
                    }
                  >
                    {dl.label}
                  </a>
                ))}
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
