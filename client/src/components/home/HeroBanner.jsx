import { useCallback, useEffect, useState } from 'react';
import {
  BRAND_NAME,
  HERO_BANNER_SLIDES,
  HERO_BANNER_SLIDE_INTERVAL_MS,
  HERO_BANNER_TRANSITION_MS,
} from '../../data/brand';
import { cn } from '../../lib/cn';

export default function HeroBanner() {
  const slides = HERO_BANNER_SLIDES;
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
    const id = window.setInterval(() => {
      setIndex((i) => (i + 1) % count);
    }, HERO_BANNER_SLIDE_INTERVAL_MS);
    return () => window.clearInterval(id);
  }, [motionReduced, count]);

  if (!count) return null;

  const transitionMs = motionReduced ? 0 : HERO_BANNER_TRANSITION_MS;

  return (
    <div className="hero-banner-slider relative mx-auto w-full max-w-full lg:max-w-none">
      <div
        className="hero-banner-viewport w-full"
        aria-live="polite"
        aria-roledescription="carousel"
        aria-label={`${BRAND_NAME} hero banners`}
      >
        {slides.map((slide, slideIndex) => {
          const isActive = slideIndex === index;
          return (
            <div
              key={slide.src}
              className={cn(
                'hero-banner-slide absolute inset-0 flex items-center justify-center',
                !motionReduced && 'hero-banner-slide--motion'
              )}
              style={{
                opacity: isActive ? 1 : 0,
                transform: isActive ? 'scale(1) translate3d(0, 0, 0)' : 'scale(0.985) translate3d(0, 0, 0)',
                zIndex: isActive ? 2 : 1,
                transitionDuration: `${transitionMs}ms`,
              }}
              aria-hidden={!isActive}
            >
              <img
                src={slide.src}
                alt={slide.alt}
                className={cn(
                  'hero-banner-img hero-banner-slide__img',
                  slide.blend === 'lighten' && 'hero-banner-img--lighten'
                )}
                fetchPriority={slideIndex === 0 ? 'high' : 'auto'}
                loading={slideIndex === 0 ? 'eager' : 'lazy'}
                decoding="async"
                draggable={false}
              />
            </div>
          );
        })}
      </div>

      {count > 1 && (
        <div className="mt-3 flex items-center justify-center gap-2">
          {slides.map((slide, i) => (
            <button
              key={slide.src}
              type="button"
              onClick={() => goTo(i)}
              className={cn(
                'h-2 rounded-full transition-all duration-300',
                i === index ? 'w-6 bg-primary' : 'w-2 bg-sage/80 hover:bg-secondary/60'
              )}
              aria-label={`Show banner ${i + 1} of ${count}`}
              aria-current={i === index ? 'true' : undefined}
            />
          ))}
        </div>
      )}
    </div>
  );
}
