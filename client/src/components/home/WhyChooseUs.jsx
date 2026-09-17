import { WHY_CHOOSE, BRAND_NAME } from '../../utils/helpers';
import { Mango, Banana, Jamun, Grapes } from '../ui/FruitArt';
import Reveal from '../ui/Reveal';

export default function WhyChooseUs() {
  return (
    <section className="py-14 md:py-16">
      <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 md:grid-cols-2 md:gap-16 md:px-6">
        <Reveal className="relative mx-auto w-full max-w-[24rem] md:mx-0 md:max-w-[26rem]">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-gradient-to-br from-white via-cream to-cream-dark shadow-[0_6px_24px_rgba(45,62,46,0.08)]">
            <div className="pointer-events-none absolute -left-6 top-6 h-20 w-20 rounded-full bg-secondary/10 blur-2xl" />
            <div className="pointer-events-none absolute -right-4 bottom-4 h-16 w-16 rounded-full bg-mango/10 blur-2xl" />

            <Mango className="absolute left-[6%] top-[12%] h-[40%] w-[40%] -rotate-12 drop-shadow-lg" />
            <Banana className="absolute right-[4%] top-[18%] h-[34%] w-[34%] rotate-12 drop-shadow-lg" />
            <Jamun className="absolute bottom-[14%] left-[10%] h-[30%] w-[30%] drop-shadow-lg" />
            <Grapes className="absolute bottom-[10%] right-[6%] h-[36%] w-[36%] drop-shadow-lg" />
          </div>
        </Reveal>

        <div>
          <Reveal>
            <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-4xl">
              Why Choose {BRAND_NAME}?
            </h2>
            <p className="mt-3 mb-8 text-[#6b6b6b]">
              Real fruit snacks that taste like candy — without the junk.
            </p>
          </Reveal>

          <ul className="flex flex-col gap-5">
            {WHY_CHOOSE.map((item, i) => (
              <Reveal key={item.title} delay={i * 70}>
                <li className="flex gap-3.5 transition hover:translate-x-1">
                  <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-secondary/20 text-sm font-bold text-secondary">
                    {item.icon}
                  </span>
                  <div>
                    <strong className="block text-primary">{item.title}</strong>
                    <p className="text-sm text-[#6b6b6b]">{item.desc}</p>
                  </div>
                </li>
              </Reveal>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
}
