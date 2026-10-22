import { getProductImage } from './productImages';
import { websiteProductGallery } from './websiteImages.js';

function normalizeEntry(entry, fallbackLabel) {
  if (typeof entry === 'string') {
    return { src: entry, label: fallbackLabel };
  }
  return {
    src: entry?.src || entry?.url,
    label: entry?.label || fallbackLabel,
  };
}

/** PDP gallery — main (-2) first, then -1 / -3 from gallery_images. */
export function getProductGalleryViews(product) {
  const mainSrc = getProductImage(product);
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
