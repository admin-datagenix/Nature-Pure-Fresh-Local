/** Shared product grids and Fresh Nature card palettes */

export const PRODUCT_GRID_CLASS =
  'grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 lg:grid-cols-4 [&>*]:min-w-0 [&>*]:h-full';

/** Shop listing: 1 col mobile, 2 tablet, 3 desktop with filter sidebar */
export const PRODUCT_GRID_SHOP_CLASS =
  'grid grid-cols-1 items-stretch gap-4 sm:grid-cols-2 sm:gap-5 md:grid-cols-3 md:gap-6 [&>*]:min-w-0 [&>*]:h-full';

export const PRODUCT_LIST_SHOP_CLASS = 'flex flex-col gap-4 sm:gap-5 [&>*]:min-w-0';

export const PRODUCT_GRID_FEATURED_CLASS =
  'flex gap-5 overflow-x-auto scroll-smooth pb-1 snap-x snap-mandatory [scrollbar-width:none] [&::-webkit-scrollbar]:hidden sm:gap-6';

export const PRODUCT_CARD_WIDTH = 'w-[230px] shrink-0 snap-start sm:w-[250px] md:w-[270px]';

const CARD_TONES = {
  mango: '#F6E4C4',
  apple: '#F4EAD8',
  strawberry: '#F3D8D4',
  banana: '#F1E9D0',
  sugarcane: '#F1E9D0',
  jamun: '#E6DCE6',
  grapes: '#E3E0EA',
  pineapple: '#F0E6C8',
  combo: '#DCE6DC',
  powder: '#EDE4D4',
  kiwi: '#E4EEDC',
  guava: '#F4DDD4',
  custard: '#F3EBD4',
  chiku: '#F3EBD4',
  coconut: '#F2EDE4',
  jackfruit: '#F5E8C8',
};

export function getProductCardTone(product) {
  const name = `${product?.name || ''} ${product?.slug || ''}`.toLowerCase();
  if (name.includes('variety') || name.includes('combo') || name.includes('pack of')) return CARD_TONES.combo;
  if (name.includes('ice cream') || name.includes('ice-cream')) return CARD_TONES.combo;
  if (name.includes('straw') || name.includes('berry')) return CARD_TONES.strawberry;
  if (name.includes('sugar')) return CARD_TONES.sugarcane;
  if (name.includes('apple')) return CARD_TONES.apple;
  if (name.includes('banana')) return CARD_TONES.banana;
  if (name.includes('jamun')) return CARD_TONES.jamun;
  if (name.includes('grape')) return CARD_TONES.grapes;
  if (name.includes('pineapple')) return CARD_TONES.pineapple;
  if (name.includes('jackfruit')) return CARD_TONES.jackfruit;
  if (name.includes('coconut')) return CARD_TONES.coconut;
  if (name.includes('chiku') || name.includes('sapodilla')) return CARD_TONES.chiku;
  if (name.includes('kiwi')) return CARD_TONES.kiwi;
  if (name.includes('guava')) return CARD_TONES.guava;
  if (name.includes('custard')) return CARD_TONES.custard;
  if (name.includes('mango')) return CARD_TONES.mango;
  if (name.includes('powder')) return CARD_TONES.powder;
  return CARD_TONES.mango;
}
