import { ABOUT_PAGE_LOGO, BRAND_NAME, COMPANY_NAME } from '../../data/brand';
import { cn } from '../../lib/cn';

export default function AboutPageLogo({ className, size = 'hero', panel = false }) {
  return (
    <img
      src={ABOUT_PAGE_LOGO}
      alt={`${BRAND_NAME} — ${COMPANY_NAME}`}
      className={cn(
        'mx-auto block h-auto w-auto object-contain',
        !panel && 'mix-blend-multiply',
        size === 'hero' ? 'max-h-24 sm:max-h-32' : 'max-h-16',
        className
      )}
      decoding="async"
      fetchPriority={size === 'hero' ? 'high' : 'auto'}
    />
  );
}
