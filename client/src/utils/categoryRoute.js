/** Storefront nav slugs ↔ API category slugs (mock + live catalog). */
const API_TO_STOREFRONT_CATEGORY = {
  'fruit-snakes': 'fruit-snacks',
  'fruit-powders': 'baking-essentials',
};

const STOREFRONT_TO_API_CATEGORY = Object.fromEntries(
  Object.entries(API_TO_STOREFRONT_CATEGORY).map(([api, store]) => [store, api])
);

function categorySlugToApi(storefrontSlug) {
  if (!storefrontSlug) return null;
  return STOREFRONT_TO_API_CATEGORY[storefrontSlug] || storefrontSlug;
}

function categorySlugFromApi(apiSlug) {
  if (!apiSlug) return null;
  return API_TO_STOREFRONT_CATEGORY[apiSlug] || apiSlug;
}

/** Match route param to a category from catalog (storefront or API slug). */
export function findCategoryRecord(categories, routeSlug) {
  if (!routeSlug || !Array.isArray(categories) || categories.length === 0) return null;

  const route = String(routeSlug).toLowerCase();
  const mappedStorefront = categorySlugFromApi(routeSlug)?.toLowerCase();

  return (
    categories.find((c) => {
      const slug = c.slug?.toLowerCase();
      const apiSlug = c.api_slug?.toLowerCase();
      if (slug === route || apiSlug === route) return true;
      if (mappedStorefront && slug === mappedStorefront) return true;
      const toApi = categorySlugToApi(c.slug)?.toLowerCase();
      return toApi === route;
    }) || null
  );
}
