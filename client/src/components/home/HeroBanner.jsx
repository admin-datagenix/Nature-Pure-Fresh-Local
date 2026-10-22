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
  const transitionMs = motionReduced ? 0 : config.transitionMs || 800;

  return (
    <div className="hero-banner hero-banner-slider relative mx-auto w-full max-w-none">
      <div className="hero-banner-viewport">
        {slides.map((slide, i) => {
          const active = i === index;
          return (
            <figure
              key={slide.src}
              className={cn(
                'hero-banner-slide hero-banner-slide--motion',
                active ? 'z-10 opacity-100' : 'z-0 opacity-0'
              )}
              style={{ transitionDuration: `${transitionMs}ms` }}
              aria-hidden={!active}
            >
              <img
                src={slide.src}
                alt={active ? slide.alt || brandName : ''}
                className={cn(
                  'hero-banner-slide__img',
                  slide.blend === 'multiply' && 'hero-banner-img',
                  slide.blend === 'lighten' && 'hero-banner-img--lighten'
                )}
                style={
                  slide.objectPosition
                    ? { objectPosition: slide.objectPosition }
                    : undefined
                }
                loading={i === 0 ? 'eager' : 'lazy'}
                decoding="async"
                fetchPriority={i === 0 ? 'high' : 'auto'}
              />
            </figure>
          );
        })}
      </div>
      {count > 1 && (
        <div className="mt-3 flex justify-center gap-2 lg:mt-4">
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
