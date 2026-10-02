import { useMemo } from 'react';
import { api } from '../api/client';
import { useCmsQuery } from './useCmsQuery';

export function useHomePage() {
  return useCmsQuery(() => api.getHomePage(), []);
}

export function useAboutPage() {
  return useCmsQuery(() => api.getAboutPage(), []);
}

export function useShopPageConfig() {
  return useCmsQuery(() => api.getShopPage(), []);
}

export function usePolicyPage(slug) {
  const stableSlug = useMemo(() => slug, [slug]);
  return useCmsQuery(() => api.getPolicyPage(stableSlug), [stableSlug]);
}
