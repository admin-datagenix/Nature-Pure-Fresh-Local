import { API_ENDPOINTS } from '../endpoints.js';
import { USE_MOCK_API } from '../config.js';
import { http } from '../http.js';
import { delay } from '../mock/delay.js';
import { buildSiteConfig } from '../mock/cms/siteConfig.js';
import { buildHomePage } from '../mock/cms/homePage.js';
import { buildAboutPage } from '../mock/cms/aboutPage.js';
import { buildShopPage } from '../mock/cms/shopPage.js';
import { buildPolicyPage } from '../mock/cms/policies.js';

async function loadCms(mockBuilder, endpoint, ...args) {
  if (USE_MOCK_API) {
    await delay(60);
    const data = mockBuilder(...args);
    if (data === null) throw new Error('Content not found');
    return { success: true, data };
  }
  const res = await http.get(endpoint);
  if (res && typeof res === 'object' && 'data' in res) return res;
  return { success: true, data: res };
}

export const contentService = {
  async getSiteConfig() {
    return loadCms(buildSiteConfig, API_ENDPOINTS.siteConfig);
  },

  async getHomePage() {
    return loadCms(buildHomePage, API_ENDPOINTS.homePage);
  },

  async getAboutPage() {
    return loadCms(buildAboutPage, API_ENDPOINTS.aboutPage);
  },

  async getShopPage() {
    return loadCms(buildShopPage, API_ENDPOINTS.shopPage);
  },

  async getPolicyPage(slug) {
    return loadCms(() => buildPolicyPage(slug), API_ENDPOINTS.policy(slug));
  },
};
