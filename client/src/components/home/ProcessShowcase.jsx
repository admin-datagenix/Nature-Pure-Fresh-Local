import { PROCESS_STEPS } from '../../utils/helpers';
import Reveal from '../ui/Reveal';

export default function ProcessShowcase() {
  return (
    <section className="relative overflow-hidden bg-gradient-to-b from-cream to-white py-16 md:py-24">
      <div className="pointer-events-none absolute -left-32 top-20 h-64 w-64 rounded-full bg-secondary/8 blur-3xl" />
      <div className="pointer-events-none absolute -right-24 bottom-10 h-72 w-72 rounded-full bg-mango/8 blur-3xl" />

      <div className="site-container relative">
        <Reveal className="mb-14 text-center">
          <p className="mb-3 text-xs font-semibold uppercase tracking-[0.2em] text-secondary">
            From Orchard to You
          </p>
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Curious what you&apos;re actually eating?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-muted">
            Just real fruit. Nothing else. Here&apos;s exactly how it goes from orchard to your hands.
          </p>
        </Reveal>

        <div className="relative">
          <div className="absolute left-0 right-0 top-[2.75rem] hidden h-0.5 bg-cream-dark md:block" aria-hidden="true" />

          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-5 md:gap-4">
            {PROCESS_STEPS.map((step, i) => (
              <Reveal key={step.step} delay={i * 80} className="group relative text-center">
                <div className="relative mx-auto mb-5 flex h-[4.5rem] w-[4.5rem] items-center justify-center">
                  <div className="absolute inset-0 rounded-full bg-white shadow-[0_4px_20px_rgba(45,62,46,0.1)] transition duration-300 group-hover:scale-110 group-hover:shadow-[0_8px_28px_rgba(45,62,46,0.15)]" />
                  <span className="relative font-heading text-xl font-bold text-primary">{step.step}</span>
                </div>
                <h3 className="font-heading text-base font-semibold text-primary">{step.title}</h3>
                <p className="mt-1.5 text-sm text-muted">{step.desc}</p>
              </Reveal>
            ))}
          </div>
        </div>

        <Reveal delay={400} className="mt-14 text-center">
          <p className="inline-flex items-center gap-2 rounded-full bg-white px-6 py-3 text-sm font-medium text-primary shadow-[0_8px_20px_rgba(41,70,51,0.06)]">
            <span className="text-secondary">✓</span>
            That&apos;s it. Real fruit. Freeze dried. Nothing added.
          </p>
        </Reveal>
      </div>
    </section>
  );
}
