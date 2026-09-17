import { Link } from 'react-router-dom';
import { SHOP_GOALS } from '../../utils/helpers';
import Reveal from '../ui/Reveal';

export default function CategoryCards() {
  return (
    <section className="pt-6 pb-12 md:pt-8 md:pb-14">
      <div className="mx-auto max-w-6xl px-4 md:px-6">
        <Reveal className="mb-10 text-center">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-[2rem]">
            Shop by Snacking Goal
          </h2>
          <p className="mx-auto mt-2 max-w-lg text-sm text-[#6b6b6b]">
            Find the perfect freeze-dried fruit for every moment
          </p>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {SHOP_GOALS.map((cat, i) => (
            <Reveal key={cat.slug} delay={i * 70}>
              <Link
                to={`/shop/${cat.slug}`}
                className="group relative flex min-h-[200px] flex-col overflow-hidden rounded-xl p-5 transition hover:-translate-y-0.5 hover:shadow-md"
                style={{ backgroundColor: cat.bg }}
              >
                <h3 className="font-heading text-lg font-semibold text-primary">{cat.title}</h3>
                <p className="mt-1.5 max-w-[75%] text-xs leading-relaxed text-[#6b6b6b]">
                  {cat.description}
                </p>

                <span className="absolute bottom-5 left-5 flex h-9 w-9 items-center justify-center rounded-full bg-white text-sm text-primary shadow-sm transition group-hover:scale-110">
                  →
                </span>

                <span className="absolute -bottom-1 right-1 text-6xl opacity-90 transition group-hover:scale-105">
                  {cat.emoji}
                </span>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
