/**
 * Frontend API layer.
 * Currently uses mockApi (no backend required).
 * Replace with .NET API calls when your ASP.NET backend is ready.
 */
import { mockApi } from './mockApi.js';

export const api = mockApi;

export const BRAND_NAME = import.meta.env.VITE_BRAND_NAME || 'Fresh Nature';
