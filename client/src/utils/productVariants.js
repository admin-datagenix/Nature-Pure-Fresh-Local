/** Pack-size options and price scaling for product detail */

export function getProductWeightOptions(product) {
  if (!product) return [];

  const baseGrams = product.weight_grams || 50;
  const basePrice = product.price ?? 0;
  const baseCompare = product.compare_at_price ?? null;

  let sizes;
  if (product.category_slug === 'combos') {
    sizes = [180, 240];
  } else if (
    product.category_slug === 'baking-essentials' ||
    String(product.id || '').startsWith('powder')
  ) {
    sizes = [50, 100, 200];
  } else {
    sizes = [30, 50, 100];
  }

  const gramsList = [...new Set([baseGrams, ...sizes])].sort((a, b) => a - b);

  return gramsList.map((grams) => ({
    grams,
    price: scalePrice(basePrice, baseGrams, grams),
    compare_at_price: baseCompare ? scalePrice(baseCompare, baseGrams, grams) : null,
  }));
}

export function scalePrice(basePrice, baseGrams, targetGrams) {
  if (!baseGrams || !targetGrams) return basePrice;
  return Math.round((basePrice / baseGrams) * targetGrams);
}

export function findWeightOption(product, grams) {
  const options = getProductWeightOptions(product);
  if (!options.length) return null;
  if (grams == null) return options[0];
  return options.find((o) => o.grams === grams) || options[0];
}
