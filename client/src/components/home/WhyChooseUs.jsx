import { TRUST_BADGE_FEATURES, BRAND_NAME } from '../../utils/helpers';
import BenefitFeatureIcon from '../ui/BenefitFeatureIcon';
import Reveal from '../ui/Reveal';

export default function WhyChooseUs() {
  return (
    <section className="py-14 md:py-16">
      <div className="site-container">
        <Reveal variant="blur" className="mb-8 text-center md:mb-10">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
            Why Choose {BRAND_NAME}?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-base text-muted md:text-lg">
            Clean labels, honest ingredients, and benefits you can see at a glance
          </p>
        </Reveal>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4 lg:gap-5">
          {TRUST_BADGE_FEATURES.map((item, i) => (
            <Reveal key={item.title} variant="scale" delay={i * 75}>
              <article className="neo-card flex h-full min-h-[132px] flex-col rounded-[1.5rem] p-5 transition duration-300 hover:-translate-y-1 hover:shadow-[0_14px_36px_rgba(41,70,51,0.1)] md:p-6">
                <div className="flex items-center gap-3">
                  <span
                    className="flex h-10 w-10 shrink-0 items-center justify-center rounded-sm border border-sage/50 bg-white shadow-[0_4px_12px_rgba(41,70,51,0.06)]"
                    style={{ color: item.accent }}
                  >
                    <BenefitFeatureIcon name={item.icon} />
                  </span>
                  <h3 className="font-heading text-lg font-semibold leading-snug text-primary md:text-xl">
                    {item.title}
                  </h3>
                </div>
                <p className="mt-3 text-base leading-relaxed text-muted">{item.desc}</p>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
