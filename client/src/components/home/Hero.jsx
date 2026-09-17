import { Link } from 'react-router-dom';
import { Mango, Banana, Jamun, Grapes } from '../ui/FruitArt';
import AnimatedFruit from '../ui/AnimatedFruit';
import { BRAND_NAME } from '../../api/client';
import { HERO_STATS } from '../../utils/helpers';
import { cn } from '../../lib/cn';

const ORBIT_FRUITS = [
  { Fruit: Mango, orbit: 'animate-orbit', size: 'h-16 w-16 md:h-20 md:w-20' },
  { Fruit: Grapes, orbit: 'animate-orbit-reverse', size: 'h-14 w-14 md:h-[4.5rem] md:w-[4.5rem]', style: { animationDelay: '-7s' } },
  { Fruit: Jamun, orbit: 'animate-orbit', size: 'h-14 w-14', style: { animationDelay: '-14s' } },
  { Fruit: Banana, orbit: 'animate-orbit-reverse', size: 'h-16 w-16', style: { animationDelay: '-10s' } },
];

const CORNER_FRUITS = [
  { Fruit: Mango, className: 'left-[2%] top-[8%] w-14 animate-drift', delay: '0s' },
  { Fruit: Grapes, className: 'right-[0%] top-[14%] w-12 animate-float', delay: '0.5s' },
  { Fruit: Jamun, className: 'bottom-[20%] left-[0%] w-12 animate-float-slow', delay: '1s' },
  { Fruit: Banana, className: 'bottom-[10%] right-[2%] w-14 animate-drift', delay: '0.3s' },
];

export default function Hero() {
  return (
    <section className="relative bg-cream pb-20 pt-8 md:pb-28 md:pt-12">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="absolute -left-20 top-20 h-64 w-64 animate-pulse-soft rounded-full bg-secondary/10 blur-3xl" />
        <div className="absolute -right-16 bottom-10 h-72 w-72 animate-pulse-soft rounded-full bg-mango/10 blur-3xl" style={{ animationDelay: '1s' }} />
      </div>

      <div className="relative mx-auto max-w-6xl px-4 md:px-6">
        <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-14">
          <div className="text-center lg:text-left">
            <p
              className="mb-4 animate-fade-up text-xs font-semibold tracking-[0.2em] text-secondary"
              style={{ animationDelay: '0.1s' }}
            >
              100% REAL FRUIT · NO ADDITIVES · MADE IN INDIA
            </p>

            <h1
              className="animate-fade-up font-heading text-4xl font-semibold leading-[1.08] tracking-tight text-primary md:text-5xl lg:text-[3.5rem]"
              style={{ animationDelay: '0.2s' }}
            >
              Snack Better with
              <span className="block text-secondary">Real Fruit.</span>
            </h1>

            <p
              className="mx-auto mt-5 max-w-lg animate-fade-up text-base leading-relaxed text-[#6b6b6b] md:text-lg lg:mx-0"
              style={{ animationDelay: '0.35s' }}
            >
              Freeze-dried to perfection. No sugar, no oil, no preservatives —
              mango, jamun, banana & grapes in every crunchy bite.
            </p>

            <div
              className="mt-8 flex animate-fade-up flex-wrap justify-center gap-4 lg:justify-start"
              style={{ animationDelay: '0.45s' }}
            >
              {HERO_STATS.map((s) => (
                <div
                  key={s.label}
                  className="rounded-2xl border border-[#e8e4df] bg-white/80 px-5 py-3 text-center shadow-sm backdrop-blur-sm"
                >
                  <span className="block font-heading text-2xl font-bold text-primary">{s.value}</span>
                  <span className="text-[0.65rem] font-semibold uppercase tracking-wider text-[#6b6b6b]">{s.label}</span>
                </div>
              ))}
            </div>

            <div
              className="mt-8 flex animate-fade-up flex-wrap justify-center gap-3 lg:justify-start"
              style={{ animationDelay: '0.55s' }}
            >
              <Link
                to="/shop"
                className="inline-flex items-center gap-2 rounded-lg bg-primary px-8 py-3.5 text-sm font-semibold text-white shadow-md transition hover:bg-primary-light"
              >
                Shop Collection
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center rounded-lg border-2 border-primary/25 bg-white px-8 py-3.5 text-sm font-semibold text-primary transition hover:border-primary"
              >
                Learn More
              </Link>
            </div>

            <p className="mt-6 animate-fade-up text-sm text-[#9a9a9a]" style={{ animationDelay: '0.65s' }}>
              ★ Loved by <strong className="text-primary">50,000+</strong> happy customers
            </p>
          </div>

          <div className="relative mx-auto flex aspect-square w-full max-w-[440px] items-center justify-center">
            <div className="absolute inset-[5%] rounded-full border border-dashed border-secondary/20 animate-pulse-soft" />
            <div className="absolute inset-[15%] rounded-full bg-gradient-to-br from-white/90 to-cream/80 shadow-[inset_0_0_40px_rgba(107,143,113,0.08)]" />

            <div className="absolute inset-0 flex items-center justify-center">
              {ORBIT_FRUITS.map(({ Fruit, orbit, size, style }) => (
                <div key={Fruit.name} className={cn('absolute origin-center', orbit)} style={style}>
                  <Fruit className={cn(size, 'drop-shadow-lg')} />
                </div>
              ))}
            </div>

            <div className="relative z-10 flex flex-col items-center text-center">
              <span className="mb-2 text-3xl">🍃</span>
              <p className="font-heading text-xl font-bold text-primary md:text-2xl">{BRAND_NAME}</p>
              <p className="mt-1 max-w-[140px] text-[0.65rem] font-semibold uppercase tracking-widest text-secondary">
                Freeze · Dried · Natural
              </p>
            </div>

            {CORNER_FRUITS.map(({ Fruit, className, delay }) => (
              <AnimatedFruit
                key={`corner-${Fruit.name}`}
                Fruit={Fruit}
                className={cn('absolute opacity-80', className)}
                delay={delay}
                duration="5s"
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
