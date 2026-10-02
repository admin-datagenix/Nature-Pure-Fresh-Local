import { API_BASE_URL, API_TIMEOUT_MS } from './config.js';

export class ApiError extends Error {
  constructor(message, { status, body } = {}) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.body = body;
  }
}

function buildUrl(path, query) {
  const base = API_BASE_URL || '';
  const url = path.startsWith('http') ? path : `${base}${path.startsWith('/') ? path : `/${path}`}`;
  if (!query || Object.keys(query).length === 0) return url;
  const params = new URLSearchParams();
  Object.entries(query).forEach(([key, value]) => {
    if (value !== undefined && value !== null && value !== '') {
      params.set(key, String(value));
    }
  });
  const qs = params.toString();
  return qs ? `${url}?${qs}` : url;
}

export async function httpRequest(path, { method = 'GET', body, query, headers = {} } = {}) {
  if (!API_BASE_URL) {
    throw new ApiError('VITE_API_BASE_URL is not configured');
  }

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), API_TIMEOUT_MS);

  try {
    const res = await fetch(buildUrl(path, query), {
      method,
      headers: {
        Accept: 'application/json',
        ...(body !== undefined ? { 'Content-Type': 'application/json' } : {}),
        ...headers,
      },
      body: body !== undefined ? JSON.stringify(body) : undefined,
      signal: controller.signal,
      credentials: 'include',
    });

    const text = await res.text();
    let data = null;
    if (text) {
      try {
        data = JSON.parse(text);
      } catch {
        data = text;
      }
    }

    if (!res.ok) {
      const message =
        (data && typeof data === 'object' && (data.message || data.error)) ||
        `Request failed (${res.status})`;
      throw new ApiError(message, { status: res.status, body: data });
    }

    return data;
  } finally {
    clearTimeout(timeout);
  }
}

export const http = {
  get: (path, query) => httpRequest(path, { method: 'GET', query }),
  post: (path, body) => httpRequest(path, { method: 'POST', body }),
  put: (path, body) => httpRequest(path, { method: 'PUT', body }),
  patch: (path, body) => httpRequest(path, { method: 'PATCH', body }),
  delete: (path) => httpRequest(path, { method: 'DELETE' }),
};
