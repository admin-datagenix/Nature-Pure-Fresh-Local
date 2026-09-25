import { ABOUT_PAGE_LOGO, BRAND_NAME, COMPANY_NAME } from '../../data/brand';
import { cn } from '../../lib/cn';

export default function AboutPageLogo({ className, size = 'hero', panel = false }) {
  return (
    <img
      src={ABOUT_PAGE_LOGO}
      alt={`${BRAND_NAME} — ${COMPANY_NAME}`}
      className={cn(
        'about-page-logo',
        !panel && 'about-page-logo--on-light',
        size === 'hero' ? 'about-page-logo--hero' : 'about-page-logo--sidebar',
        className
      )}
      decoding="async"
      fetchPriority={size === 'hero' ? 'high' : 'auto'}
    />
  );
}
