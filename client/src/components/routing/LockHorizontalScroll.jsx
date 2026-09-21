import { useEffect } from 'react';

/** Prevents the document from scrolling horizontally (trackpad / overflow bleed). */
export default function LockHorizontalScroll() {
  useEffect(() => {
    const clampX = () => {
      if (window.scrollX !== 0) {
        window.scrollTo(0, window.scrollY);
      }
    };

    clampX();
    window.addEventListener('scroll', clampX, { passive: true });

    const onWheel = (e) => {
      if (Math.abs(e.deltaX) <= Math.abs(e.deltaY)) return;
      const root = document.documentElement;
      if (root.scrollWidth <= root.clientWidth + 2) {
        e.preventDefault();
      }
    };
    window.addEventListener('wheel', onWheel, { passive: false });

    return () => {
      window.removeEventListener('scroll', clampX);
      window.removeEventListener('wheel', onWheel);
    };
  }, []);

  return null;
}
