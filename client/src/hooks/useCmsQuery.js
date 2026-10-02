import { useEffect, useState } from 'react';

/**
 * Load CMS / catalog content from api.* helpers.
 * @param {() => Promise<{ data: unknown }>} fetcher
 * @param {unknown[]} deps
 */
export function useCmsQuery(fetcher, deps = []) {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    setError(null);

    fetcher()
      .then((res) => {
        if (cancelled) return;
        setData(res?.data ?? res);
      })
      .catch((err) => {
        if (!cancelled) setError(err);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });

    return () => {
      cancelled = true;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps -- fetcher identity is stable per hook wrapper
  }, deps);

  return { data, loading, error };
}
