import { useEffect, useState } from 'react';
import { api } from '../api/client';
import { cachedFetch, categoriesCacheKey } from '../api/apiCache';

const CATEGORY_EMOJI = {
  'fruit-snacks': '🍓',
  'tropical-mix': '🥭',
  'berry-boost': '🫐',
  combos: '🎁',
  'baking-essentials': '🫙',
  'kids-snacks': '🍌',
};

export function categoryEmoji(slug) {
  return CATEGORY_EMOJI[slug] || '🌿';
}

export default function useCategoryTree() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;
    cachedFetch(categoriesCacheKey(), () => api.getCategories())
      .then((res) => {
        if (active) setCategories(res.data || []);
      })
      .catch(() => {
        if (active) setCategories([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, []);

  return { categories, loading };
}
