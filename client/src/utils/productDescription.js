/** Product description section — intro line + up to 5 bullet points */

const DEFAULT_SNACK_POINTS = [
  '100% real fruit — no artificial colours, flavours or preservatives',
  'Freeze-dried to lock in natural taste, crunch and nutrients',
  'No added sugar — sweetness comes only from the fruit',
  'Light, mess-free snack for travel, office and kids’ tiffin',
  'Reseal pack and store in a cool, dry place after opening',
];

const DEFAULT_POWDER_POINTS = [
  'Single-ingredient or pure fruit blends — nothing unnecessary added',
  'Fine milled freeze-dried powder for smoothies, baking and drinks',
  'No preservatives or artificial additives',
  'Easy to measure — stir into milk, yoghurt, oats or recipes',
  'Keep sealed in a cool, dry place away from moisture',
];

const DEFAULT_COMBO_POINTS = [
  'Assorted flavours in one pack — try before you stock up',
  'Same freeze-dried quality as our individual fruit snacks',
  'No added sugar or preservatives across the selection',
  'Ideal for gifting, parties and family tasting',
  'Store packs sealed in a cool, dry place',
];

export function getProductDescriptionIntro(product) {
  const text = (product?.description || product?.short_description || '').trim();
  if (!text) return '';
  const firstSentence = text.match(/^[^.!?]+[.!?]/);
  if (firstSentence) return firstSentence[0].trim();
  const firstLine = text.split(/\n/)[0]?.trim();
  return firstLine || text;
}

/** Split admin multi-line description into bullet lines (e.g. emoji feature rows). */
export function getAdminDescriptionLines(text, limit = 12) {
  if (!text) return [];
  const lines = String(text)
    .replace(/\r\n/g, '\n')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
  if (lines.length <= 1) return [];
  return lines.slice(0, limit);
}

export function getProductDescriptionBullets(product, limit = 5) {
  const custom = product?.description_points || product?.highlights;
  if (Array.isArray(custom) && custom.length > 0) {
    return custom.filter(Boolean).slice(0, limit);
  }

  if (product?.description_from_admin) {
    const fromLines = getAdminDescriptionLines(product.description, limit);
    if (fromLines.length > 0) return fromLines;
    return [];
  }

  const slug = product?.category_slug || '';
  const id = String(product?.id || '');
  if (slug === 'combos' || id.startsWith('combo')) {
    return DEFAULT_COMBO_POINTS.slice(0, limit);
  }
  if (slug === 'baking-essentials' || id.startsWith('powder')) {
    return DEFAULT_POWDER_POINTS.slice(0, limit);
  }
  return DEFAULT_SNACK_POINTS.slice(0, limit);
}
