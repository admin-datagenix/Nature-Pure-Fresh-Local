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
};

/** API response cache TTL (ms) — category / product list */
export const API_CACHE_TTL_MS = 60_000;
