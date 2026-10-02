/**
 * Frontend API layer.
 * Commerce + auth: mockApi (swap implementations per method when backend is live).
 * CMS pages: contentService (mock JSON today, HTTP when VITE_USE_MOCK_API=false).
 */
import { mockApi } from './mockApi.js';
import { cachedFetch, categoriesCacheKey, productsCacheKey } from './apiCache.js';
import { contentService } from './services/contentService.js';
import { BRAND_NAME as DEFAULT_BRAND_NAME } from '../data/brand.js';

export const api = {
  ...mockApi,
  ...contentService,
  getCategories() {
    return cachedFetch(categoriesCacheKey(), () => mockApi.getCategories());
  },
  getProducts(params = {}) {
    return cachedFetch(productsCacheKey(params), () => mockApi.getProducts(params));
  },
};

export const BRAND_NAME = import.meta.env.VITE_BRAND_NAME || DEFAULT_BRAND_NAME;
