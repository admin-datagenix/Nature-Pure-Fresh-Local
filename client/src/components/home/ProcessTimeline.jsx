import { PROCESS_STEPS } from '../../utils/helpers';
import Reveal from '../ui/Reveal';

export default function ProcessTimeline() {
  return (
    <section className="border-t border-sage/45 py-8 md:py-10" id="process">
      <div className="site-container">
        <Reveal className="mb-8 text-center">
          <h2 className="font-heading text-2xl font-semibold tracking-tight text-primary md:text-3xl">
            Curious What You&apos;re Actually Eating?
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted md:text-base">
            Just real fruit. Nothing else. Here&apos;s exactly how it goes from orchard to your hands.
          </p>
        </Reveal>

        <ol className="process-timeline mx-auto flex max-w-5xl flex-col gap-8 sm:gap-10 lg:flex-row lg:items-start lg:gap-0">
          {PROCESS_STEPS.map((step, i) => (
            <li key={step.step} className="process-timeline__step relative flex flex-1 flex-col items-center px-2 text-center">
              {i < PROCESS_STEPS.length - 1 && (
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
          <p className="font-heading text-base italic text-secondary md:text-lg">
            That&apos;s it. Real fruit. Freeze dried. Nothing added.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
