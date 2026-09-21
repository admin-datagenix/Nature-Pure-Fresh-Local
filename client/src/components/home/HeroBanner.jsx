import { useState } from 'react';
import { HERO_BANNER_IMAGE, HERO_BANNER_FALLBACKS, BRAND_NAME } from '../../data/brand';

export default function HeroBanner() {
  const [srcIndex, setSrcIndex] = useState(0);
  const sources = [HERO_BANNER_IMAGE, ...HERO_BANNER_FALLBACKS];
  const src = sources[Math.min(srcIndex, sources.length - 1)];

  const handleError = () => {
    setSrcIndex((i) => (i < sources.length - 1 ? i + 1 : i));
  };

  return (
    <div className="relative mx-auto w-full max-w-full bg-transparent sm:max-w-[900px] lg:max-w-none">
      <img
        key={src}
        src={src}
        alt={`${BRAND_NAME} freeze-dried fruit powders — strawberry, pineapple, jamun and guava`}
        className="hero-banner-img h-auto w-full min-w-0 max-w-full min-h-[300px] bg-transparent object-contain object-center sm:min-h-[360px] md:min-h-[420px] lg:min-h-[480px] xl:min-h-[540px] drop-shadow-[0_28px_56px_rgba(41,70,51,0.12)]"
        fetchPriority="high"
        decoding="async"
        onError={handleError}
      />
    </div>
  );
}
