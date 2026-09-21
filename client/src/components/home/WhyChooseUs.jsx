import { TRUST_BADGE_FEATURES, BRAND_NAME } from '../../utils/helpers';
import Reveal from '../ui/Reveal';

export default function WhyChooseUs() {
  return (
    <section className="py-14 md:py-16">
      <div className="site-container">
        <Reveal variant="blur" className="mb-8 text-center md:mb-10">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Why Choose {BRAND_NAME}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-sm text-muted">
            Clean labels, honest ingredients, and benefits you can see at a glance
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {TRUST_BADGE_FEATURES.map((item, i) => (
            <Reveal key={item.title} variant="scale" delay={i * 75}>
              <article className="neo-card flex h-full min-h-[148px] flex-col rounded-[1.5rem] p-6 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(41,70,51,0.1)]">
                <span className="mb-4 flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-primary/10 bg-white text-xl shadow-[0_4px_12px_rgba(41,70,51,0.06)]">
                  {item.emoji}
                </span>
                <h3 className="font-heading text-lg font-semibold leading-snug text-primary">
                  {item.title}
                </h3>
                <p className="mt-2 text-sm leading-relaxed text-muted">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
