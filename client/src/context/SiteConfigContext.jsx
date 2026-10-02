import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { api } from '../api/client';
import { buildSiteConfig } from '../api/mock/cms/siteConfig';

const SiteConfigContext = createContext(null);

const FALLBACK_CONFIG = buildSiteConfig();

export function SiteConfigProvider({ children }) {
  const [config, setConfig] = useState(FALLBACK_CONFIG);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    api
      .getSiteConfig()
      .then((res) => {
        if (!cancelled && res?.data) setConfig(res.data);
      })
      .catch(() => {
        /* keep fallback */
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(
    () => ({
      config,
      loading,
      brand: config.brand,
      contact: config.contact,
      assets: config.assets,
      catalogPdfs: config.catalogPdfs,
      map: config.map,
      navigation: config.navigation,
    }),
    [config, loading]
  );

  return <SiteConfigContext.Provider value={value}>{children}</SiteConfigContext.Provider>;
}

export function useSiteConfig() {
  const ctx = useContext(SiteConfigContext);
  if (!ctx) {
    return {
      config: FALLBACK_CONFIG,
      loading: false,
      brand: FALLBACK_CONFIG.brand,
      contact: FALLBACK_CONFIG.contact,
      assets: FALLBACK_CONFIG.assets,
      catalogPdfs: FALLBACK_CONFIG.catalogPdfs,
      map: FALLBACK_CONFIG.map,
      navigation: FALLBACK_CONFIG.navigation,
    };
  }
  return ctx;
}
