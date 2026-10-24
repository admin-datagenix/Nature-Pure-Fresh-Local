import { useCallback, useState } from 'react';
import { cn } from '../../lib/cn';

const DEFAULT_SCALE = 1.85;

/**
 * Mouse-follow zoom: scale up toward cursor on hover, smooth reset on leave.
 */
export default function ProductHoverZoom({
  src,
  alt,
  className,
  imgClassName,
  scale = DEFAULT_SCALE,
  compact = false,
}) {
  const [zoom, setZoom] = useState({ active: false, x: 50, y: 50 });

  const onMove = useCallback(
    (e) => {
      const rect = e.currentTarget.getBoundingClientRect();
      if (!rect.width || !rect.height) return;
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      setZoom({ active: true, x, y });
    },
    []
  );

  const onLeave = useCallback(() => {
    setZoom({ active: false, x: 50, y: 50 });
  }, []);

  return (
    <div
      className={cn('relative h-full w-full overflow-hidden', className)}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
    >
      <div
        className={cn(
          'flex h-full w-full items-center justify-center',
          compact ? 'p-1 sm:p-1.5' : 'p-3 sm:p-5 md:p-6'
        )}
      >
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          draggable={false}
          className={cn(
            'max-h-full max-w-full select-none object-contain will-change-transform',
            !zoom.active && (compact ? 'scale-[1.3]' : 'scale-[1.22]'),
            imgClassName
          )}
          style={{
            transform: zoom.active ? `scale(${scale})` : undefined,
            transformOrigin: `${zoom.x}% ${zoom.y}%`,
            transition: zoom.active
              ? 'transform 0.12s ease-out'
              : 'transform 0.45s cubic-bezier(0.22, 1, 0.36, 1)',
          }}
        />
      </div>
    </div>
  );
}
