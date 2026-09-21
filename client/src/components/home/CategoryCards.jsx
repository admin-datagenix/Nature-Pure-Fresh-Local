import { Link } from 'react-router-dom';
import { SNACK_IMAGES, POWDER_IMAGES } from '../../data/catalogImages';
import Reveal from '../ui/Reveal';

const SHOP_CATEGORIES = [
  {
    slug: 'fruit-snacks',
    label: 'Chunks',
    description: 'Crunchy freeze-dried fruit slices & cubes',
    image: SNACK_IMAGES.strawberry,
    bg: '#DDE7DC',
  },
  {
    slug: 'baking-essentials',
    label: 'Powder',
    description: '100% fruit powders for smoothies & baking',
    image: POWDER_IMAGES.strawberry,
    bg: '#F0E8DC',
  },
];

export default function CategoryCards() {
  return (
    <section className="pb-12 md:pb-14">
      <div className="site-container">
        <Reveal variant="blur" className="mb-8 flex items-end justify-between gap-4">
          <h2 className="font-heading text-3xl font-semibold tracking-tight text-primary md:text-[2rem]">
            Shop By Category
          </h2>
          <Link
            to="/shop"
            className="shrink-0 text-sm font-medium text-muted transition hover:text-primary"
          >
            View all <span aria-hidden="true">→</span>
          </Link>
        </Reveal>

        <div className="grid gap-4 sm:grid-cols-2 sm:gap-5">
          {SHOP_CATEGORIES.map((cat, i) => (
            <Reveal key={cat.slug} variant={i === 0 ? 'left' : 'right'} delay={i * 100}>
              <Link
                to={`/shop/${cat.slug}`}
                className="group relative flex min-h-[220px] overflow-hidden rounded-[1.5rem] transition hover:-translate-y-0.5 hover:shadow-[0_12px_32px_rgba(41,70,51,0.1)] sm:min-h-[260px]"
                style={{ backgroundColor: cat.bg }}
              >
                <div className="relative z-10 flex flex-1 flex-col p-6 md:p-7">
                  <h3 className="font-heading text-2xl font-semibold text-primary md:text-[1.65rem]">
                    {cat.label}
                  </h3>
                  <p className="mt-2 max-w-[12rem] text-sm leading-relaxed text-muted">
                    {cat.description}
                  </p>
                  <span className="mt-auto flex h-10 w-10 items-center justify-center rounded-full bg-white text-sm text-primary shadow-sm transition group-hover:scale-110">
                    →
                  </span>
                </div>

                <div className="absolute bottom-0 right-0 top-0 w-[48%] overflow-hidden sm:w-[44%]">
                  <img
                    src={cat.image}
                    alt={cat.label}
                    className="h-full w-full object-cover object-center transition duration-500 group-hover:scale-105"
                  />
                  <div
                    className="pointer-events-none absolute inset-0"
                    style={{ background: `linear-gradient(to right, ${cat.bg} 5%, ${cat.bg}99 30%, transparent 70%)` }}
                  />
                </div>
              </Link>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}
