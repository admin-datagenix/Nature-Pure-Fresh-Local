import {
  ALL_PRODUCTS_SHOP_BANNER,
  SHOP_CATEGORY_BANNER_FALLBACKS,
  SHOP_CATEGORY_BANNERS,
} from '../../../data/brand.js';
import { STORE_SETTINGS } from '../../../config/storeSettings.js';

/** Shape returned by GET /api/v1/cms/pages/shop */
export function buildShopPage() {
  return {
    title: 'Shop',
    banners: {
      all: ALL_PRODUCTS_SHOP_BANNER,
      byCategory: SHOP_CATEGORY_BANNERS,
      fallbacks: SHOP_CATEGORY_BANNER_FALLBACKS,
    },
    sortOptions: [
      { value: 'bestseller', label: 'Best Selling' },
      { value: 'price_asc', label: 'Price: Low to High' },
      { value: 'price_desc', label: 'Price: High to Low' },
      { value: 'rating', label: 'Top Rated' },
      { value: 'newest', label: 'Newest' },
    ],
    pagination: {
      mode: STORE_SETTINGS.shopProductPagination,
      pageSize: STORE_SETTINGS.shopPageSize,
    },
  };
}
