import { getProductImage, isPowderProduct } from './productImages';
import { websiteProductGallery } from './websiteImages.js';

function normalizeEntry(entry, fallbackLabel) {
  if (typeof entry === 'string') {
    const isPdf = entry.toLowerCase().endsWith('.pdf');
    return {
      src: entry,
      label: fallbackLabel,
      mediaType: isPdf ? 'pdf' : 'image',
    };
  }
  const src = entry?.src || entry?.url;
  const isPdf = entry?.mediaType === 'pdf' || String(src || '').toLowerCase().endsWith('.pdf');
  return {
    src,
    label: entry?.label || fallbackLabel,
    mediaType: isPdf ? 'pdf' : entry?.mediaType || 'image',
  };
}

/** PDP gallery — main (-2) first, then -1 / -3 from gallery_images. */
export function getProductGalleryViews(product) {
  const mainSrc = getProductImage(product);
  if (isPowderProduct(product) && mainSrc) {
    return [{ src: mainSrc, label: 'Packaging', mediaType: 'image' }];
  }

  const mainView = mainSrc
    ? { src: mainSrc, label: 'Packaging' }
    : null;

  const custom = product?.gallery_images;
  if (Array.isArray(custom) && custom.length > 0) {
    const seen = new Set();
    const views = [];
    if (mainView?.src) {
      seen.add(mainView.src);
      views.push(mainView);
    }
    for (const entry of custom) {
      const normalized = normalizeEntry(entry, '');
      if (!normalized.src || seen.has(normalized.src)) continue;
      seen.add(normalized.src);
      views.push({
        ...normalized,
        label: normalized.label || `View ${views.length + 1}`,
      });
    }
    if (views.length > 0) return views;
  }

  const gallery = websiteProductGallery(product);
  if (gallery.length > 0) return gallery;

  const primary = getProductImage(product);
  return [{ src: primary, label: 'Product' }];
}
