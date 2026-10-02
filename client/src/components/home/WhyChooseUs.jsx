import { buildHomePage } from '../../api/mock/cms/homePage';
import WhyChooseBenefitIcon from '../ui/WhyChooseBenefitIcon';
import Reveal from '../ui/Reveal';

const FALLBACK = buildHomePage().whyChooseUs;

export default function WhyChooseUs({ content }) {
  const data = content || FALLBACK;
  const benefits = data.benefits || [];
  const lifestyle = data.lifestyle || [];

  return (
    <section className="border-t border-sage/40 bg-cream py-14 md:py-16">
      <div className="site-container">
        <Reveal variant="blur" className="mb-8 text-center md:mb-10">
          <p className="text-xs font-semibold uppercase tracking-[0.18em] text-secondary">{data.eyebrow}</p>
          <h2 className="mt-2 font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            {data.title}
          </h2>
          <p className="mx-auto mt-3 max-w-2xl text-base text-muted md:text-lg">{data.subtitle}</p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:gap-5 xl:grid-cols-2 xl:gap-x-10">
          {benefits.map((item, i) => (
            <Reveal key={item.id} variant="up" delay={i * 40}>
              <article
                className="neo-card flex h-full gap-3 rounded-2xl p-4 transition duration-300 hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(41,70,51,0.09)] sm:gap-4 sm:p-5"
              >
                <span
                  className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full border border-secondary/35 bg-secondary/10 text-primary"
                  aria-hidden="true"
                >
                  <WhyChooseBenefitIcon name={item.icon} />
                </span>
                <div className="min-w-0">
                  <h3 className="font-heading text-sm font-semibold uppercase tracking-wide text-primary sm:text-base">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted sm:text-[0.9375rem]">{item.desc}</p>
                </div>
              </article>
            </Reveal>
          ))}
        </div>

        <Reveal delay={120} className="mt-10 md:mt-12">
          <div className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
            {lifestyle.map((tile) => (
              <figure
                key={tile.id}
                className="group relative overflow-hidden rounded-2xl shadow-[0_10px_28px_rgba(41,70,51,0.12)] sm:rounded-3xl"
              >
                <img
                  src={tile.src}
                  alt={tile.alt}
                  loading="lazy"
                  decoding="async"
                  className="aspect-[4/5] w-full object-cover transition duration-500 group-hover:scale-[1.03] sm:aspect-[3/4]"
                />
                <figcaption
                  className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary/85 via-primary/45 to-transparent px-3 pb-3 pt-10 text-center text-xs font-bold uppercase tracking-[0.14em] text-white sm:pb-4 sm:text-sm"
                >
                  {tile.label}
                </figcaption>
              </figure>
            ))}
          </div>
        </Reveal>
      </div>
    </section>
  );
}
