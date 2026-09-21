/** Clay-style SVG fruit illustrations — same style as hero section */

import { useId } from 'react';

export function Mango({ className, style }) {
  const gradId = `mangoGrad-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} style={style} viewBox="0 0 72 64" fill="none" aria-hidden="true">
      <ellipse cx="36" cy="36" rx="28" ry="22" fill={`url(#${gradId})`} />
      <ellipse cx="28" cy="30" rx="8" ry="6" fill="rgba(255,255,255,0.3)" />
      <path d="M52 18c4 2 8 0 10-4" stroke="#5A9E4A" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="58" cy="12" rx="6" ry="3" fill="#6BB85A" transform="rotate(30 58 12)" />
      <defs>
        <radialGradient id={gradId} cx="0.3" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#FFD93D" />
          <stop offset="60%" stopColor="#F5A623" />
          <stop offset="100%" stopColor="#E67E22" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Banana({ className, style }) {
  const gradId = `banGrad-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} style={style} viewBox="0 0 72 56" fill="none" aria-hidden="true">
      <path d="M12 40C20 20 40 8 58 16C62 18 64 24 60 30C52 44 28 52 12 40Z" fill={`url(#${gradId})`} />
      <path d="M56 18c2 4 2 8 0 12" stroke="#5A9E4A" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="30" cy="28" rx="10" ry="5" fill="rgba(255,255,255,0.2)" transform="rotate(-20 30 28)" />
      <defs>
        <linearGradient id={gradId} x1="12" y1="40" x2="60" y2="16">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="100%" stopColor="#F5C842" />
        </linearGradient>
      </defs>
    </svg>
  );
}

export function Jamun({ className, style }) {
  const gradId = `jamunGrad-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} style={style} viewBox="0 0 64 64" fill="none" aria-hidden="true">
      <circle cx="32" cy="34" r="20" fill={`url(#${gradId})`} />
      <ellipse cx="24" cy="26" rx="6" ry="4" fill="rgba(255,255,255,0.2)" />
      <circle cx="32" cy="22" r="4" fill="#1a0a2e" opacity="0.5" />
      <path d="M32 14c0-4 2-6 0-8" stroke="#6BB85A" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="32" cy="10" rx="3" ry="2" fill="#5A9E4A" />
      <defs>
        <radialGradient id={gradId} cx="0.35" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#7B4397" />
          <stop offset="50%" stopColor="#4A1942" />
          <stop offset="100%" stopColor="#2D1B4E" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Grapes({ className, style }) {
  const uid = useId().replace(/:/g, '');
  const g1 = `grapeGrad-${uid}`;
  const g2 = `grapeGrad2-${uid}`;
  const g3 = `grapeGrad3-${uid}`;
  const g4 = `grapeGrad4-${uid}`;
  return (
    <svg className={className} style={style} viewBox="0 0 72 80" fill="none" aria-hidden="true">
      <circle cx="36" cy="58" r="10" fill={`url(#${g1})`} />
      <circle cx="24" cy="48" r="9" fill={`url(#${g2})`} />
      <circle cx="48" cy="48" r="9" fill={`url(#${g2})`} />
      <circle cx="30" cy="36" r="8" fill={`url(#${g3})`} />
      <circle cx="42" cy="36" r="8" fill={`url(#${g3})`} />
      <circle cx="36" cy="26" r="7" fill={`url(#${g4})`} />
      <path d="M36 18V8" stroke="#6B8F71" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="36" cy="6" rx="8" ry="4" fill="#5A9E4A" />
      <ellipse cx="22" cy="42" rx="3" ry="2" fill="rgba(255,255,255,0.2)" />
      <defs>
        <radialGradient id={g1} cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#9B59B6" />
          <stop offset="100%" stopColor="#6C3483" />
        </radialGradient>
        <radialGradient id={g2} cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#A569BD" />
          <stop offset="100%" stopColor="#7D3C98" />
        </radialGradient>
        <radialGradient id={g3} cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#BB8FCE" />
          <stop offset="100%" stopColor="#8E44AD" />
        </radialGradient>
        <radialGradient id={g4} cx="0.3" cy="0.3" r="0.7">
          <stop offset="0%" stopColor="#D2B4DE" />
          <stop offset="100%" stopColor="#9B59B6" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Strawberry({ className, style }) {
  const gradId = `strawGrad-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} style={style} viewBox="0 0 72 80" fill="none" aria-hidden="true">
      <path
        d="M36 18 C22 18 14 32 16 48 C18 62 28 70 36 72 C44 70 54 62 56 48 C58 32 50 18 36 18Z"
        fill={`url(#${gradId})`}
      />
      <ellipse cx="28" cy="38" rx="4" ry="3" fill="rgba(255,255,255,0.25)" />
      <circle cx="30" cy="50" r="1.2" fill="#C0392B" opacity="0.5" />
      <circle cx="40" cy="44" r="1.2" fill="#C0392B" opacity="0.5" />
      <circle cx="36" cy="58" r="1.2" fill="#C0392B" opacity="0.5" />
      <circle cx="44" cy="54" r="1.2" fill="#C0392B" opacity="0.5" />
      <path d="M28 20 C32 12 40 12 44 20" stroke="#5A9E4A" strokeWidth="2" strokeLinecap="round" />
      <ellipse cx="30" cy="14" rx="4" ry="2.5" fill="#6BB85A" transform="rotate(-20 30 14)" />
      <ellipse cx="42" cy="14" rx="4" ry="2.5" fill="#6BB85A" transform="rotate(20 42 14)" />
      <defs>
        <radialGradient id={gradId} cx="0.4" cy="0.35" r="0.65">
          <stop offset="0%" stopColor="#FF6B6B" />
          <stop offset="55%" stopColor="#E74C3C" />
          <stop offset="100%" stopColor="#C0392B" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function Pineapple({ className, style }) {
  const bodyId = `pineBody-${useId().replace(/:/g, '')}`;
  return (
    <svg className={className} style={style} viewBox="0 0 72 88" fill="none" aria-hidden="true">
      <ellipse cx="36" cy="58" rx="22" ry="26" fill={`url(#${bodyId})`} />
      <path d="M22 48 L26 68 M30 44 L32 70 M36 42 L36 72 M42 44 L40 70 M46 48 L50 68" stroke="#D4AC0D" strokeWidth="1.5" strokeLinecap="round" opacity="0.45" />
      <ellipse cx="28" cy="50" rx="5" ry="4" fill="rgba(255,255,255,0.2)" />
      <path d="M24 28 L36 14 L48 28" stroke="#5A9E4A" strokeWidth="2" strokeLinejoin="round" />
      <path d="M28 24 L36 10 L44 24" stroke="#6BB85A" strokeWidth="2" strokeLinejoin="round" />
      <path d="M32 20 L36 8 L40 20" stroke="#7DCE82" strokeWidth="2" strokeLinejoin="round" />
      <defs>
        <radialGradient id={bodyId} cx="0.4" cy="0.35" r="0.7">
          <stop offset="0%" stopColor="#FFE066" />
          <stop offset="50%" stopColor="#F5C842" />
          <stop offset="100%" stopColor="#E8A317" />
        </radialGradient>
      </defs>
    </svg>
  );
}

/** Multi-fruit cluster for combo / variety packs */
export function FruitCombo({ className, style }) {
  return (
    <div className={className} style={style} aria-hidden="true">
      <Mango className="absolute left-[6%] top-[12%] h-[42%] w-[42%] -rotate-12 drop-shadow-lg" />
      <Banana className="absolute right-[4%] top-[18%] h-[36%] w-[36%] rotate-12 drop-shadow-lg" />
      <Jamun className="absolute bottom-[18%] left-[12%] h-[32%] w-[32%] drop-shadow-lg" />
      <Grapes className="absolute bottom-[12%] right-[8%] h-[38%] w-[38%] drop-shadow-lg" />
    </div>
  );
}

/** Mango + powder mound for baking products */
export function MangoPowder({ className, style }) {
  const moundId = `powderMound-${useId().replace(/:/g, '')}`;
  return (
    <div className={className} style={style} aria-hidden="true">
      <Mango className="absolute left-1/2 top-[8%] h-[52%] w-[52%] -translate-x-1/2 drop-shadow-xl" />
      <svg className="absolute bottom-[12%] left-1/2 h-[28%] w-[55%] -translate-x-1/2 drop-shadow-md" viewBox="0 0 120 40" fill="none">
        <ellipse cx="60" cy="32" rx="52" ry="10" fill={`url(#${moundId})`} />
        <ellipse cx="45" cy="22" rx="18" ry="8" fill="#FFD93D" opacity="0.85" />
        <ellipse cx="72" cy="18" rx="14" ry="6" fill="#F5A623" opacity="0.8" />
        <defs>
          <linearGradient id={moundId} x1="8" y1="32" x2="112" y2="32">
            <stop offset="0%" stopColor="#FFE566" />
            <stop offset="100%" stopColor="#F5A623" />
          </linearGradient>
        </defs>
      </svg>
    </div>
  );
}

export const FRUIT_COMPONENTS = {
  mango: Mango,
  banana: Banana,
  jamun: Jamun,
  grapes: Grapes,
  strawberry: Strawberry,
  pineapple: Pineapple,
  combo: FruitCombo,
  powder: MangoPowder,
};

export function getFruitKey(name = '') {
  const lower = name.toLowerCase();
  if (lower.includes('powder')) return 'powder';
  if (lower.includes('variety') || lower.includes('combo') || lower.includes('pack of')) return 'combo';
  if (lower.includes('mango')) return 'mango';
  if (lower.includes('banana')) return 'banana';
  if (lower.includes('jamun')) return 'jamun';
  if (lower.includes('grape')) return 'grapes';
  if (lower.includes('berry') || lower.includes('straw')) return 'strawberry';
  if (lower.includes('pineapple')) return 'pineapple';
  if (lower.includes('kiwi')) return 'pineapple';
  if (lower.includes('guava')) return 'strawberry';
  if (lower.includes('custard')) return 'banana';
  return 'mango';
}

export function getProductFruit(product) {
  if (product?.slug?.includes('variety') || product?.slug?.includes('combo')) return FRUIT_COMPONENTS.combo;
  return FRUIT_COMPONENTS[getFruitKey(product?.name)] || FRUIT_COMPONENTS.mango;
}
