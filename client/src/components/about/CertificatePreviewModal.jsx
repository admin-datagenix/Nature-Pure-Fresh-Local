import { useEffect, useRef } from 'react';
import OrderModalShell from '../orders/OrderModalShell';
import { cn } from '../../lib/cn';

function blockEvent(e) {
  e.preventDefault();
  e.stopPropagation();
}

const BLOCKED_KEYS = new Set(['s', 'p', 'u', 'c', 'a', 'x']);

function useCertificateProtection(active, containerRef) {
  useEffect(() => {
    if (!active) return undefined;

    const root = containerRef.current;
    if (!root) return undefined;

    const onContextMenu = (e) => {
      if (root.contains(e.target)) blockEvent(e);
    };

    const onKeyDown = (e) => {
      if (e.key === 'PrintScreen') {
        e.preventDefault();
        return;
      }
      if (!e.ctrlKey && !e.metaKey) return;
      const key = e.key.toLowerCase();
      if (BLOCKED_KEYS.has(key)) {
        e.preventDefault();
      }
    };

    const onCopy = (e) => {
      if (root.contains(e.target)) blockEvent(e);
    };

    const onDragStart = (e) => {
      if (root.contains(e.target)) blockEvent(e);
    };

    root.addEventListener('contextmenu', blockEvent);
    document.addEventListener('contextmenu', onContextMenu);
    document.addEventListener('keydown', onKeyDown);
    document.addEventListener('copy', onCopy);
    document.addEventListener('dragstart', onDragStart);

    const prevOverflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';

    return () => {
      root.removeEventListener('contextmenu', blockEvent);
      document.removeEventListener('contextmenu', onContextMenu);
      document.removeEventListener('keydown', onKeyDown);
      document.removeEventListener('copy', onCopy);
      document.removeEventListener('dragstart', onDragStart);
      document.body.style.overflow = prevOverflow;
    };
  }, [active, containerRef]);
}

export default function CertificatePreviewModal({ open, onClose, logo, certificate }) {
  const shellRef = useRef(null);
  useCertificateProtection(open, shellRef);

  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [open, onClose]);

  if (!open || !logo) return null;

  const preview = certificate;
  const headerSrc = preview?.headerImage;

  return (
    <OrderModalShell
      titleId="cert-preview-title"
      onDismiss={onClose}
      wide
      className="max-w-[min(100%,36rem)] sm:max-w-xl md:max-w-2xl"
    >
      <div
        ref={shellRef}
        className="cert-protected-preview flex max-h-[92vh] flex-col"
        onContextMenu={blockEvent}
        onCopy={blockEvent}
        onCut={blockEvent}
        style={{ WebkitUserSelect: 'none', userSelect: 'none' }}
      >
        <header className="flex items-center justify-between gap-3 border-b border-sage/40 px-4 py-3 sm:px-5">
          <h2 id="cert-preview-title" className="min-w-0 font-heading text-base font-semibold text-primary sm:text-lg">
            {preview?.title ?? logo.alt}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="shrink-0 rounded-lg border border-sage/50 px-2.5 py-1 text-xs font-semibold text-primary transition hover:bg-cream-dark"
          >
            Close
          </button>
        </header>

        <div className="overflow-y-auto p-4 sm:p-5">
          {headerSrc ? (
            <div
              className={cn(
                'relative overflow-hidden rounded-lg border border-sage/45 bg-white shadow-[0_8px_28px_rgba(41,70,51,0.08)]'
              )}
            >
              <div
                className="pointer-events-none absolute inset-0 z-10"
                aria-hidden="true"
                onContextMenu={blockEvent}
              />
              <img
                src={headerSrc}
                alt={preview?.title ?? logo.alt}
                draggable={false}
                className="block w-full select-none"
                onContextMenu={blockEvent}
                onDragStart={blockEvent}
              />
              <div
                className="pointer-events-none absolute inset-x-0 bottom-0 z-20 h-16 bg-gradient-to-t from-white/90 to-transparent"
                aria-hidden="true"
              />
            </div>
          ) : (
            <p className="py-8 text-center text-sm text-muted">Certificate preview is not available.</p>
          )}
        </div>
      </div>
    </OrderModalShell>
  );
}
