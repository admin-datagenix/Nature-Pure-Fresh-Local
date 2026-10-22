import { Link } from 'react-router-dom';
import WishlistButton from '../../wishlist/WishlistButton';
import { cn } from '../../../lib/cn';
const iconBtn =
  'inline-flex size-9 shrink-0 items-center justify-center rounded-md text-primary transition hover:bg-cream-dark active:scale-95';

export default function ProductDetailMobileHeader({
  product,
  galleryImageRef,
  imageSrc,
  className,
}) {
  const title = (product?.name || 'Product').replace(/^Freeze Dried /i, '');

  return (
    <header
      className={cn(
        'sticky top-0 z-40 flex items-center gap-2 border-b border-sage/40 bg-white/95 px-3 py-2 shadow-[0_2px_12px_rgba(41,70,51,0.06)] backdrop-blur-sm',
        className
      )}
    >
      <Link to="/shop" className={iconBtn} aria-label="Back to shop">
        <BackIcon className="h-5 w-5" />
      </Link>

      <p className="min-w-0 flex-1 truncate text-center text-sm font-semibold leading-snug text-primary">
        {title}
      </p>

      <div className="flex w-9 shrink-0 justify-end">
        <WishlistButton
          productId={product.id}
          productSlug={product.slug}
          productName={product.name}
          variant="toolbar"
          imageSrc={imageSrc}
          flySourceRef={galleryImageRef}
          className="!size-9 !border-0 !bg-transparent !shadow-none hover:!bg-cream-dark"
        />
      </div>
    </header>
  );
}

function BackIcon({ className }) {
  return (
    <svg className={className} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden>
      <path d="M15 18l-6-6 6-6" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}
