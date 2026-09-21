import { PROCESS_STEPS } from '../../utils/helpers';
import Reveal from '../ui/Reveal';

export default function ProcessTimeline() {
  return (
    <section className="py-20" id="process">
      <div className="site-container">
        <Reveal className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Curious What You&apos;re Actually Eating?
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted">
            Just real fruit. Nothing else. Here&apos;s exactly how it goes from orchard to your hands.
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-8 sm:grid-cols-3 lg:grid-cols-5">
          {PROCESS_STEPS.map((step, i) => (
            <Reveal key={step.step} delay={i * 80} className="text-center">
              <div className="mx-auto mb-4 flex h-12 w-12 items-center justify-center rounded-full bg-primary font-heading text-sm font-bold text-white transition hover:scale-110">
                {step.step}
              </div>
              <h3 className="font-heading text-base text-primary">{step.title}</h3>
              <p className="mt-1.5 text-xs leading-relaxed text-muted">{step.desc}</p>
            </Reveal>
          ))}
        </div>

        <Reveal className="mt-10 text-center" delay={400}>
          <p className="font-heading text-lg italic text-secondary">
            That&apos;s it. Real fruit. Freeze dried. Nothing added.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
