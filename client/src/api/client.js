/**
 * Frontend API layer.
 * Currently uses mockApi (no backend required).
 * Replace with .NET API calls when your ASP.NET backend is ready.
 */
import { mockApi } from './mockApi.js';
import { cachedFetch, categoriesCacheKey, productsCacheKey } from './apiCache.js';
import { BRAND_NAME as DEFAULT_BRAND_NAME } from '../data/brand.js';

export const api = {
  ...mockApi,
  getCategories() {
    return cachedFetch(categoriesCacheKey(), () => mockApi.getCategories());
  },
  getProducts(params = {}) {
    return cachedFetch(productsCacheKey(params), () => mockApi.getProducts(params));
  },
};

export const BRAND_NAME = import.meta.env.VITE_BRAND_NAME || DEFAULT_BRAND_NAME;
