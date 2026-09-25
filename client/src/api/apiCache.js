import { API_CACHE_TTL_MS } from '../config/storeSettings.js';

const store = new Map();

function cacheKey(prefix, payload) {
  return `${prefix}:${JSON.stringify(payload ?? {})}`;
}

export function getCached(key) {
  const entry = store.get(key);
  if (!entry) return null;
  if (Date.now() - entry.at > entry.ttl) {
    store.delete(key);
    return null;
  }
  return entry.data;
}

export function setCached(key, data, ttl = API_CACHE_TTL_MS) {
  store.set(key, { data, at: Date.now(), ttl });
}

export async function cachedFetch(key, fetcher, ttl = API_CACHE_TTL_MS) {
  const hit = getCached(key);
  if (hit) return hit;
  const data = await fetcher();
  setCached(key, data, ttl);
  return data;
}

export function categoriesCacheKey() {
  return 'categories:tree';
}

export function productsCacheKey(params) {
  return cacheKey('products', params);
}
