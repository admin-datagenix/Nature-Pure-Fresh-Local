import { cn } from '../../lib/cn';

export default function ProcessMediaFrame({
  src,
  alt = '',
  frameClassName,
  imgClassName,
  priority = false,
  fit = 'contain',
}) {
  return (
    <div
      className={cn(
        'process-media-frame overflow-hidden bg-white',
        frameClassName
      )}
    >
      <img
        src={src}
        alt={alt}
        loading={priority ? 'eager' : 'lazy'}
        decoding="async"
        fetchPriority={priority ? 'high' : 'auto'}
        className={cn(
          'block h-full w-full',
          fit === 'cover' ? 'object-cover object-center' : 'object-contain object-center',
          imgClassName
        )}
      />
    </div>
  );
}
