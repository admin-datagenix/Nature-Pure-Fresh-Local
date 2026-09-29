import { Link } from 'react-router-dom';
import { BRAND_LOGO, BRAND_LOGO_PIXELS, BRAND_NAME, COMPANY_NAME, BRAND_SHORT_TAGLINE } from '../../data/brand';
import { cn } from '../../lib/cn';

export default function BrandLogo({
  className,
  imageClassName,
  showText = true,
  logoOnly = false,
  showTagline = false,
  tagline,
  stacked = false,
  light = false,
  to = '/',
  src,
  bareLogo = false,
  imageWidth = BRAND_LOGO_PIXELS.width,
  imageHeight = BRAND_LOGO_PIXELS.height,
}) {
  const hideText = logoOnly || !showText;
  const logoSrc = src ?? BRAND_LOGO;

  const imgEl = (
    <img
      src={logoSrc}
      alt={`${BRAND_NAME} logo`}
      width={imageWidth}
      height={imageHeight}
      className={cn(
        'bg-transparent',
        hideText
          ? imageClassName ||
              'h-12 w-auto max-w-[220px] object-contain object-left sm:h-14 md:h-16 md:max-w-[270px]'
          : 'h-10 w-10 object-contain',
        light && hideText && !showTagline && 'brightness-0 invert'
      )}
      decoding="async"
    />
  );

  const content =
    bareLogo && hideText ? (
      imgEl
    ) : (
      <>
        <div className={cn(hideText && showTagline && 'flex flex-col items-start gap-0.5')}>
          {!bareLogo && imgEl}
          {hideText && showTagline && (
            <span className={cn('text-[0.65rem] font-medium tracking-wide sm:text-xs', light ? 'text-white/70' : 'text-muted')}>
              {tagline || BRAND_SHORT_TAGLINE}
            </span>
          )}
        </div>
        {!hideText && (
          <span className={cn(stacked ? 'text-left leading-tight' : '')}>
            <span
              className={cn(
                'block font-heading text-base font-bold sm:text-lg',
                light ? 'text-white' : 'text-primary'
              )}
            >
              {BRAND_NAME}
            </span>
            {stacked && (
              <span
                className={cn(
                  'block text-[0.62rem] font-semibold uppercase tracking-[0.12em]',
                  light ? 'text-white/65' : 'text-muted'
                )}
              >
                {COMPANY_NAME}
              </span>
            )}
          </span>
        )}
      </>
    );

  const classes = cn(
    'flex shrink-0 items-center leading-none',
    hideText ? 'gap-0' : cn('gap-2.5', stacked && 'gap-3'),
    className
  );

  if (to) {
    return (
      <Link to={to} className={classes} aria-label={`${BRAND_NAME} home`}>
        {content}
      </Link>
    );
  }

  return <div className={classes}>{content}</div>;
}
