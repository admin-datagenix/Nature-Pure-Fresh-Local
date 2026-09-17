/** Shared product grids and Fresh Nature card palettes */

export const PRODUCT_GRID_CLASS =
  'grid grid-cols-2 gap-5 sm:gap-6 md:grid-cols-3 lg:grid-cols-4';

export const PRODUCT_GRID_FEATURED_CLASS =
  'flex gap-5 overflow-x-auto scroll-smooth pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6';

export const PRODUCT_CARD_WIDTH = 'w-[230px] shrink-0 snap-start sm:w-[250px] md:w-[270px]';

const CARD_TONES = {
  mango: '#F6E4C4',
  strawberry: '#F3D8D4',
  banana: '#F1E9D0',
  jamun: '#E6DCE6',
  grapes: '#E3E0EA',
  pineapple: '#F0E6C8',
  combo: '#DCE6DC',
  powder: '#EDE4D4',
};

export function getProductCardTone(product) {
  const name = `${product?.name || ''} ${product?.slug || ''}`.toLowerCase();
  if (name.includes('powder')) return CARD_TONES.powder;
  if (name.includes('variety') || name.includes('combo') || name.includes('pack of')) return CARD_TONES.combo;
  if (name.includes('straw') || name.includes('berry')) return CARD_TONES.strawberry;
  if (name.includes('banana')) return CARD_TONES.banana;
  if (name.includes('jamun')) return CARD_TONES.jamun;
  if (name.includes('grape')) return CARD_TONES.grapes;
  if (name.includes('pineapple')) return CARD_TONES.pineapple;
  return CARD_TONES.mango;
}
