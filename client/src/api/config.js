/**
 * API mode — swap mock vs real backend without changing UI code.
 *
 * VITE_USE_MOCK_API=false  → HTTP requests to VITE_API_BASE_URL
 * VITE_API_BASE_URL        → e.g. https://api.naturepurefresh.com
 */
const env = import.meta.env;

export const API_BASE_URL = (env.VITE_API_BASE_URL || '').replace(/\/$/, '');

export const USE_MOCK_API =
  env.VITE_USE_MOCK_API === undefined || env.VITE_USE_MOCK_API === ''
    ? true
    : String(env.VITE_USE_MOCK_API).toLowerCase() === 'true';

/** Static / mock storefront — keep catalog and categories on mock data unless overridden. */
export const USE_LIVE_CATALOG =
  env.VITE_USE_LIVE_CATALOG === undefined || env.VITE_USE_LIVE_CATALOG === ''
    ? false
    : String(env.VITE_USE_LIVE_CATALOG).toLowerCase() === 'true';

export const USE_LIVE_CATEGORIES =
  env.VITE_USE_LIVE_CATEGORIES === undefined || env.VITE_USE_LIVE_CATEGORIES === ''
    ? false
    : String(env.VITE_USE_LIVE_CATEGORIES).toLowerCase() === 'true';

export const API_TIMEOUT_MS = Number(env.VITE_API_TIMEOUT_MS) || 30000;
