/**
 * Backend route map — implement these on your admin/API server.
 * Response bodies should match shapes in api/mock/cms (see api/README.md).
 */
export const API_ENDPOINTS = {
  siteConfig: '/api/v1/cms/site-config',
  homePage: '/api/v1/cms/pages/home',
  aboutPage: '/api/v1/cms/pages/about',
  shopPage: '/api/v1/cms/pages/shop',
  policy: (slug) => `/api/v1/cms/policies/${slug}`,

  categories: '/api/v1/catalog/categories',
  products: '/api/v1/catalog/products',
  productBySlug: (slug) => `/api/v1/catalog/products/${slug}`,
  reviews: '/api/v1/catalog/reviews',

  cart: '/api/v1/cart',
  orders: '/api/v1/orders',
  orderById: (id) => `/api/v1/orders/${id}`,
  auth: {
    login: '/api/v1/auth/login',
    register: '/api/v1/auth/register',
    me: '/api/v1/auth/me',
    profile: '/api/v1/auth/profile',
  },
};
