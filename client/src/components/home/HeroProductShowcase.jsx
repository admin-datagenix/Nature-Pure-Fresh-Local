import { Banana, Grapes, Jamun, Mango, Strawberry, Pineapple } from '../ui/FruitArt';
import { SNACK_IMAGES } from '../../data/catalogImages';
import { cn } from '../../lib/cn';

const HERO_POUCHES = [
  {
    src: SNACK_IMAGES.strawberry,
    alt: 'Strawberry Freeze Dried Snack',
    className: 'left-[2%] bottom-[22%] z-20 w-[29%] -rotate-[8deg]',
    objectPosition: '50% 52%',
  },
  {
    src: SNACK_IMAGES.banana,
    alt: 'Banana Freeze Dried Snack',
    className: 'left-[34%] bottom-[26%] z-40 w-[32%] rotate-0',
    objectPosition: '50% 58%',
    featured: true,
  },
  {
    src: SNACK_IMAGES.grapes,
    alt: 'Green Grapes Freeze Dried Snack',
    className: 'right-[2%] bottom-[22%] z-20 w-[29%] rotate-[8deg]',
    objectPosition: '50% 55%',
  },
];

function HeroPouch({ src, alt, className, objectPosition, featured }) {
  return (
    <div className={cn('absolute transition-transform duration-500 hover:z-50 hover:scale-[1.03]', className)}>
      <div
        className={cn(
          'overflow-hidden rounded-[1.15rem] bg-white ring-2 ring-white/90',
          featured
            ? 'shadow-[0_28px_50px_rgba(41,70,51,0.22)]'
            : 'shadow-[0_18px_36px_rgba(41,70,51,0.16)]'
        )}
      >
        <div className={cn('w-full overflow-hidden', featured ? 'aspect-[3/4.1]' : 'aspect-[3/4.3]')}>
          <img
            src={src}
            alt={alt}
            className="h-full w-full object-cover"
            style={{ objectPosition, transform: 'scale(1.32)' }}
          />
        </div>
      </div>
    </div>
  );
}

export default function HeroProductShowcase({ activeSlide = 0 }) {
  const featuredIndex = activeSlide % HERO_POUCHES.length;

  return (
    <div className="relative mx-auto aspect-[4/3.5] w-full max-w-[560px] sm:aspect-[4/3.3] lg:max-w-none">
      <div className="absolute inset-[6%] rounded-[2.5rem] bg-gradient-to-br from-white/50 via-cream/30 to-sky-100/40" />

      {/* Quality stamp */}
      <div className="absolute left-[4%] top-[10%] z-40 flex h-[4.5rem] w-[4.5rem] rotate-[-14deg] flex-col items-center justify-center rounded-full border-2 border-dashed border-secondary/50 bg-white/95 text-center shadow-[0_8px_24px_rgba(41,70,51,0.12)] sm:h-20 sm:w-20">
        <span className="text-[0.5rem] font-bold uppercase leading-tight tracking-[0.12em] text-secondary sm:text-[0.55rem]">
          100%
          <br />
          Natural
        </span>
      </div>

      {/* Handwritten callout */}
      <div className="absolute right-[2%] top-[2%] z-30 max-w-[140px] rotate-[-6deg] text-right sm:right-[5%] sm:top-[4%]">
        <p className="font-heading text-sm italic leading-snug text-primary/75 sm:text-base">
          Real Fruits,
          <br />
          Real Taste
        </p>
        <svg className="ml-auto mt-1 h-8 w-12 text-primary/40" viewBox="0 0 48 32" fill="none" aria-hidden="true">
          <path d="M4 28c12-10 22-18 40-24" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
          <path d="M36 2l6 6-10 2" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </div>

      {/* Floating leaves */}
      <span className="absolute left-[5%] top-[16%] text-xl opacity-45 animate-float sm:text-2xl">🍃</span>
      <span className="absolute right-[20%] top-[10%] text-lg opacity-35 animate-float-slow sm:text-xl" style={{ animationDelay: '1s' }}>🍃</span>
      <span className="absolute bottom-[42%] left-[1%] text-base opacity-30 animate-drift" style={{ animationDelay: '0.5s' }}>🍃</span>

      {/* Fresh fruit accents */}
      <Strawberry className="absolute bottom-[34%] left-[-2%] w-11 animate-float sm:w-14" style={{ animationDelay: '0.2s' }} />
      <Jamun className="absolute bottom-[38%] left-[8%] w-10 animate-drift sm:w-12" style={{ animationDelay: '0.5s' }} />
      <Mango className="absolute top-[28%] left-[2%] w-10 opacity-90 animate-float-slow sm:w-12" style={{ animationDelay: '0.8s' }} />
      <Banana className="absolute bottom-[30%] right-[-1%] w-14 animate-drift sm:w-[4.5rem]" style={{ animationDelay: '0.6s' }} />
      <Banana className="absolute top-[22%] right-[4%] w-10 -rotate-12 animate-float sm:w-12" style={{ animationDelay: '1.1s' }} />
      <Grapes className="absolute bottom-[16%] right-[10%] z-50 w-12 animate-float-slow sm:w-14" style={{ animationDelay: '1.3s' }} />
      <Pineapple className="absolute bottom-[8%] right-[0%] w-10 opacity-85 animate-drift hidden sm:block" style={{ animationDelay: '0.9s' }} />

      {/* Stone platform */}
      <div className="absolute bottom-[11%] left-1/2 z-10 h-[12%] w-[82%] -translate-x-1/2">
        <div className="h-full w-full rounded-[50%] bg-gradient-to-b from-[#e8e4df] via-[#cfc9c0] to-[#b8b0a4] shadow-[0_14px_28px_rgba(41,70,51,0.12)]" />
        <div className="absolute inset-x-[10%] top-[20%] h-[28%] rounded-[50%] bg-white/25" />
      </div>

      {/* Bowl with fruit chunks */}
      <div className="absolute bottom-[14%] left-[41%] z-50 w-[17%]">
        <div className="relative aspect-square">
          <div className="absolute inset-0 rounded-full bg-white shadow-[0_8px_20px_rgba(41,70,51,0.12)] ring-2 ring-cream" />
          <div className="absolute inset-[18%] rounded-full bg-cream-dark/80" />
          <div className="absolute inset-[22%] flex flex-wrap items-center justify-center gap-0.5 p-1">
            {[...Array(10)].map((_, i) => (
              <span
                key={i}
                className={cn(
                  'block rounded-full',
                  i % 3 === 0 ? 'bg-mango/80' : i % 3 === 1 ? 'bg-strawberry/70' : 'bg-secondary/60'
                )}
                style={{
                  width: `${4 + (i % 3) * 2}px`,
                  height: `${4 + (i % 3) * 2}px`,
                }}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Product pouches */}
      {HERO_POUCHES.map((pouch, i) => (
        <HeroPouch key={pouch.alt} {...pouch} featured={i === featuredIndex} />
      ))}

      {/* Scattered dried fruit chips */}
      <span className="absolute bottom-[11%] left-[34%] z-30 h-2 w-2 rounded-full bg-mango/70" />
      <span className="absolute bottom-[9%] left-[47%] z-30 h-1.5 w-1.5 rounded-full bg-strawberry/60" />
      <span className="absolute bottom-[10%] right-[36%] z-30 h-2 w-2 rounded-full bg-secondary/50" />
      <span className="absolute bottom-[8%] left-[52%] z-30 h-1.5 w-1.5 rounded-full bg-mango/60" />
      <span className="absolute bottom-[12%] right-[42%] z-30 h-2 w-2 rounded-full bg-strawberry/50" />
    </div>
  );
}
