/**
 * Storefront behaviour (mirrors admin settings in a real backend).
 * @see user stories: navigation, category browse, performance
 */

export const STORE_SETTINGS = {
  /** `pagination` | `infinite` */
  shopProductPagination: 'pagination',
  shopPageSize: 12,
  /**
   * Out-of-stock on category grid:
   * - `badge` — show card with Out of stock label, disable add
   * - `greyed` — dim card + label
   * - `hidden` — omit from listing unless user filters "Out of stock"
   */
  outOfStockDisplay: 'badge',
  /** Units left at or below this count = “low stock” (Meesho-style urgency). */
  lowStockThreshold: 5,
  /** Max product thumbnails in shop low-stock strip. */
  lowStockShopDisplayCount: 3,
  /** Product cards / PDP — discount badges and “% off” chips */
  showSaleTags: false,
  /** “Only N left” urgency chips on product imagery */
  showLowStockBadges: false,
  /** Star ratings on cards, PDP, cart, and checkout lines */
  showProductRatings: false,
  /** Account orders — PDF invoice download */
  showDownloadInvoice: false,
};

/** API response cache TTL (ms) — category / product list */
export const API_CACHE_TTL_MS = 60_000;
