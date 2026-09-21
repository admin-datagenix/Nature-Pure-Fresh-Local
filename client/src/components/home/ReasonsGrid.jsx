import { REASONS_TO_LOVE, BRAND_NAME } from '../../utils/helpers';
import Reveal from '../ui/Reveal';

export default function ReasonsGrid() {
  return (
    <section className="py-14 md:py-20">
      <div className="site-container">
        <Reveal className="mb-12 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Reasons to Love {BRAND_NAME}
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-muted">
            Everything you want in a snack — nothing you don&apos;t
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {REASONS_TO_LOVE.map((item, i) => (
            <Reveal key={item.title} delay={i * 60}>
              <article className="neo-card group h-full p-6 transition duration-300 hover:-translate-y-1">
                <span className="mb-4 flex h-12 w-12 items-center justify-center rounded-2xl bg-cream-dark text-2xl transition group-hover:scale-110">
                  {item.icon}
                </span>
                <h3 className="font-heading text-base font-semibold text-primary">{item.title}</h3>
                <p className="mt-1.5 text-sm leading-relaxed text-muted">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
