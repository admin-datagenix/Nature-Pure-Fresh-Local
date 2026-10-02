import { useCallback, useEffect, useState } from 'react';
import { buildHomePage } from '../../api/mock/cms/homePage';
import { useSiteConfig } from '../../context/SiteConfigContext';
import { cn } from '../../lib/cn';

const FALLBACK_BANNER = buildHomePage().hero.banner;

export default function HeroBanner({ banner }) {
  const { brand } = useSiteConfig();
  const config = banner || FALLBACK_BANNER;
  const slides = config.slides || [];
  const count = slides.length;
  const [index, setIndex] = useState(0);
  const [motionReduced, setMotionReduced] = useState(false);

  const goTo = useCallback(
    (next) => {
      if (!count) return;
      setIndex((next + count) % count);
    },
    [count]
  );

  useEffect(() => {
    const mq = window.matchMedia('(prefers-reduced-motion: reduce)');
    const sync = () => setMotionReduced(mq.matches);
    sync();
    mq.addEventListener('change', sync);
    return () => mq.removeEventListener('change', sync);
  }, []);

  useEffect(() => {
    if (motionReduced || count <= 1) return undefined;
    const id = setInterval(() => goTo(index + 1), config.slideIntervalMs || 3000);
    return () => clearInterval(id);
  }, [motionReduced, count, index, goTo, config.slideIntervalMs]);

  if (!count) return null;

  const brandName = brand?.name || 'NaturePure Fresh';

  return (
    <div className="hero-banner relative mx-auto w-full max-w-[min(100%,42rem)]">
      <div className="relative aspect-[4/3] w-full overflow-hidden rounded-2xl bg-white/60 sm:aspect-[16/11] lg:aspect-[5/4]">
        {slides.map((slide, i) => (
          <img
            key={slide.src}
            src={slide.src}
            alt={slide.alt || brandName}
            className={cn(
              'absolute inset-0 h-full w-full object-contain p-2 transition-opacity duration-700',
              i === index ? 'opacity-100' : 'pointer-events-none opacity-0',
              slide.blend === 'multiply' && 'mix-blend-multiply'
            )}
            style={{
              transitionDuration: motionReduced ? '0ms' : `${config.transitionMs || 800}ms`,
            }}
            loading={i === 0 ? 'eager' : 'lazy'}
            decoding="async"
          />
        ))}
      </div>
      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2">
          {slides.map((_, i) => (
            <button
              key={i}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                'h-2 w-2 rounded-full transition',
                i === index ? 'bg-primary' : 'bg-sage'
              )}
              aria-label={`Show banner ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
