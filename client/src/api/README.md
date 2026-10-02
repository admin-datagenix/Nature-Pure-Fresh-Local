# API layer (mock today, backend-ready)

## Switch to real APIs

1. Set in `client/.env`:
   ```env
   VITE_USE_MOCK_API=false
   VITE_API_BASE_URL=https://your-api.example.com
   ```
2. Implement routes listed in `endpoints.js` with the same JSON shapes as `mock/cms/*` builders.
3. Replace `mockApi` methods in `client.js` with HTTP calls (or add `services/catalogService.js` mirroring `contentService.js`).

## CMS (admin-managed content)

| Method | HTTP | Mock builder |
|--------|------|----------------|
| `api.getSiteConfig()` | `GET /api/v1/cms/site-config` | `mock/cms/siteConfig.js` |
| `api.getHomePage()` | `GET /api/v1/cms/pages/home` | `mock/cms/homePage.js` |
| `api.getAboutPage()` | `GET /api/v1/cms/pages/about` | `mock/cms/aboutPage.js` |
| `api.getShopPage()` | `GET /api/v1/cms/pages/shop` | `mock/cms/shopPage.js` |
| `api.getPolicyPage(slug)` | `GET /api/v1/cms/policies/:slug` | `mock/cms/policies.js` |

UI hooks: `useHomePage`, `useAboutPage`, `useShopPageConfig`, `usePolicyPage`, `useSiteConfig`.

## Catalog & commerce (still mockApi)

| Area | Today | Target endpoint (see `endpoints.js`) |
|------|--------|--------------------------------------|
| Categories | `mockData` + `getCategories` | `GET /api/v1/catalog/categories` |
| Products | `mockData` + `getProducts` | `GET /api/v1/catalog/products` |
| Cart / orders / auth | `localStorage` in `mockApi.js` | `/api/v1/cart`, `/api/v1/orders`, `/api/v1/auth/*` |

Admin panel should CRUD CMS documents and catalog; the storefront only consumes these APIs.
