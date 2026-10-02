import { buildAboutPage } from '../../api/mock/cms/aboutPage';
import Reveal from '../ui/Reveal';

const FALLBACK = buildAboutPage().process;

export default function ProcessTimeline({ content }) {
  const data = content || FALLBACK;
  const steps = data.steps || [];

  return (
    <section className="border-t border-sage/45 py-8 md:py-10" id="process">
      <div className="site-container">
        <Reveal className="mb-8 text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            {data.title}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted md:text-base">{data.subtitle}</p>
        </Reveal>

        <ol className="process-timeline mx-auto flex max-w-5xl flex-col gap-8 sm:gap-10 lg:flex-row lg:items-start lg:gap-0">
          {steps.map((step, i) => (
            <li key={step.step} className="process-timeline__step relative flex flex-1 flex-col items-center px-2 text-center">
              {i < steps.length - 1 && (
                <span
                  className="process-timeline__connector pointer-events-none absolute hidden lg:block"
                  aria-hidden="true"
                />
              )}
              <Reveal delay={i * 80} className="relative z-[1] flex w-full flex-col items-center">
                <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white ring-4 ring-cream">
                  {step.step}
                </div>
                <h3 className="font-heading text-base text-primary">{step.title}</h3>
                <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.desc}</p>
              </Reveal>
            </li>
          ))}
        </ol>

        <Reveal className="mt-8 text-center" delay={400}>
          <p className="font-heading text-base italic text-secondary md:text-lg">{data.closingLine}</p>
        </Reveal>
      </div>
    </section>
  );
}
