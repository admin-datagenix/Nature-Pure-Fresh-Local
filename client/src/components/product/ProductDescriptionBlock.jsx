import { cn } from '../../lib/cn';
import {
  getAdminDescriptionLines,
  getProductDescriptionBullets,
  getProductDescriptionIntro,
} from '../../utils/productDescription';

export default function ProductDescriptionBlock({ product, className = '', compact = false, fullText = false }) {
  const adminBody = (product?.description || '').trim();
  const shortDesc = (product?.short_description || '').trim();
  const fromAdmin = Boolean(product?.description_from_admin && adminBody);
  const adminLines = fromAdmin ? getAdminDescriptionLines(adminBody) : [];

  const intro = fullText
    ? fromAdmin && adminLines.length > 0
      ? ''
      : fromAdmin
        ? adminBody
        : (adminBody || shortDesc)
    : getProductDescriptionIntro(product);

  const bullets = fullText
    ? getProductDescriptionBullets(product, 12)
    : getProductDescriptionBullets(product, 5);

  if (!intro && bullets.length === 0) return null;

  return (
    <div className={className}>
      <h2
        id="product-description-heading"
        className={cn(
          'font-heading font-semibold text-primary',
          compact ? 'text-sm' : 'text-lg lg:text-xl'
        )}
      >
        Product description
      </h2>
      {intro ? (
        <p
          className={cn(
            'max-w-3xl whitespace-pre-line leading-relaxed text-primary/90',
            compact ? 'mt-1.5 text-xs leading-snug' : 'mt-2 text-sm sm:text-base'
          )}
        >
          {intro}
        </p>
      ) : null}
      {bullets.length > 0 ? (
        <ul
          className={cn(
            'max-w-3xl list-disc pl-5 leading-relaxed text-muted marker:text-secondary',
            compact
              ? 'mb-0 mt-2 space-y-1 text-xs leading-snug'
              : 'mt-3 space-y-1.5 text-sm sm:text-[0.9375rem]',
            intro ? '' : 'mt-2'
          )}
        >
          {bullets.map((point) => (
            <li key={point}>{point}</li>
          ))}
        </ul>
      ) : null}
    </div>
  );
}
