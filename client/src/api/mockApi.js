import {
  MOCK_CATEGORIES,
  MOCK_REVIEWS,
  MOCK_PRODUCTS,
  PROMO_CODES,
  filterProducts,
  getBestsellers,
  getProductBySlug,
} from './mockData.js';
import { getProductWeightOptions, scalePrice } from '../utils/productVariants.js';

const CART_KEY = 'fresh_nature_mock_cart';
const ORDERS_KEY = 'fresh_nature_orders';
const NEWSLETTER_KEY = 'fresh_nature_newsletter';
const USERS_KEY = 'fresh_nature_users';
const SESSION_KEY = 'fresh_nature_session';
const OTP_PENDING_KEY = 'fresh_nature_registration_otp';
const LOGIN_OTP_KEY = 'fresh_nature_login_otp';
const RESET_OTP_KEY = 'fresh_nature_reset_otp';
const AUTH_ATTEMPTS_KEY = 'fresh_nature_auth_attempts';

const OTP_EXPIRY_MS = 5 * 60 * 1000;
const MAX_FAILED_ATTEMPTS = 5;
const LOCKOUT_MS = 15 * 60 * 1000;

const DEMO_USER = {
  id: 'demo-1',
  name: 'Demo User',
  email: 'demo@freshnature.in',
  phone: '9876543210',
  address: '12 Orchard Lane, Pune, Maharashtra 411001',
  password: 'demo123',
  phone_verified: true,
  created_at: '2025-01-01T00:00:00.000Z',
};

function ensureDemoUser() {
  try {
    const users = JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
    const idx = users.findIndex((u) => u.email === DEMO_USER.email);
    if (idx === -1) {
      users.push(DEMO_USER);
    } else {
      users[idx] = { ...users[idx], ...DEMO_USER, password: users[idx].password || DEMO_USER.password };
    }
    localStorage.setItem(USERS_KEY, JSON.stringify(users));
  } catch {
    localStorage.setItem(USERS_KEY, JSON.stringify([DEMO_USER]));
  }
}

function loadUsers() {
  ensureDemoUser();
  try {
    return JSON.parse(localStorage.getItem(USERS_KEY) || '[]');
  } catch {
    return [DEMO_USER];
  }
}

function saveUsers(users) {
  localStorage.setItem(USERS_KEY, JSON.stringify(users));
}

function loadSession() {
  try {
    const raw = localStorage.getItem(SESSION_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveSession(session) {
  if (session) localStorage.setItem(SESSION_KEY, JSON.stringify(session));
  else localStorage.removeItem(SESSION_KEY);
}

function sanitizeUser(user) {
  if (!user) return null;
  const { password, ...safe } = user;
  return safe;
}

function findUserByEmail(email) {
  return loadUsers().find((u) => u.email.toLowerCase() === email.toLowerCase());
}

function findUserByPhone(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return null;
  return loadUsers().find((u) => u.phone === normalized);
}

function normalizePhone(mobile) {
  const digits = String(mobile || '').replace(/\D/g, '');
  if (digits.length === 12 && digits.startsWith('91')) return digits.slice(2);
  if (digits.length === 10) return digits;
  return null;
}

function isValidIndianMobile(phone) {
  return /^[6-9]\d{9}$/.test(phone);
}

function formatPhoneDisplay(phone) {
  const normalized = normalizePhone(phone);
  if (!normalized) return phone;
  return `+91 ${normalized.slice(0, 5)} ${normalized.slice(5)}`;
}

function generateOtp() {
  return String(Math.floor(100000 + Math.random() * 900000));
}

function loadPendingOtp() {
  try {
    const raw = localStorage.getItem(OTP_PENDING_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function savePendingOtp(data) {
  localStorage.setItem(OTP_PENDING_KEY, JSON.stringify(data));
}

function clearPendingOtp() {
  localStorage.removeItem(OTP_PENDING_KEY);
}

function loadLoginOtp() {
  try {
    const raw = localStorage.getItem(LOGIN_OTP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveLoginOtp(data) {
  localStorage.setItem(LOGIN_OTP_KEY, JSON.stringify(data));
}

function clearLoginOtp() {
  localStorage.removeItem(LOGIN_OTP_KEY);
}

function loadResetOtp() {
  try {
    const raw = localStorage.getItem(RESET_OTP_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveResetOtp(data) {
  localStorage.setItem(RESET_OTP_KEY, JSON.stringify(data));
}

function clearResetOtp() {
  localStorage.removeItem(RESET_OTP_KEY);
}

function loadAttempts() {
  try {
    return JSON.parse(localStorage.getItem(AUTH_ATTEMPTS_KEY) || '{}');
  } catch {
    return {};
  }
}

function saveAttempts(data) {
  localStorage.setItem(AUTH_ATTEMPTS_KEY, JSON.stringify(data));
}

function getAttemptKey(scope, identifier) {
  return `${scope}:${String(identifier || '').toLowerCase()}`;
}

function assertNotRateLimited(scope, identifier) {
  const key = getAttemptKey(scope, identifier);
  const attempts = loadAttempts();
  const entry = attempts[key];
  if (entry?.lockedUntil && Date.now() < entry.lockedUntil) {
    const mins = Math.ceil((entry.lockedUntil - Date.now()) / 60000);
    throw new Error(`Too many failed attempts. Please try again in ${mins} minute(s).`);
  }
}

function recordFailedAttempt(scope, identifier) {
  const key = getAttemptKey(scope, identifier);
  const attempts = loadAttempts();
  const entry = attempts[key] || { count: 0 };
  entry.count += 1;
  if (entry.count >= MAX_FAILED_ATTEMPTS) {
    entry.lockedUntil = Date.now() + LOCKOUT_MS;
    entry.count = 0;
  }
  attempts[key] = entry;
  saveAttempts(attempts);
}

function clearFailedAttempts(scope, identifier) {
  const key = getAttemptKey(scope, identifier);
  const attempts = loadAttempts();
  delete attempts[key];
  saveAttempts(attempts);
}

function otpExpiryPayload(expiresAt) {
  return {
    expiresAt,
    expiresIn: Math.max(0, Math.ceil((expiresAt - Date.now()) / 1000)),
  };
}

function verifyOtpCode(pending, code, scope, identifier) {
  if (!pending) {
    throw new Error('Please request an OTP first.');
  }
  if (Date.now() > pending.expiresAt) {
    throw new Error('OTP expired. Please request a new one.');
  }
  if (pending.otp !== code) {
    recordFailedAttempt(scope, identifier);
    assertNotRateLimited(scope, identifier);
    throw new Error('Invalid OTP. Please try again.');
  }
}

function validateQuickRegistration({ name, mobile }) {
  const trimmedName = (name || '').trim();
  const normalizedPhone = normalizePhone(mobile);

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error('Please enter your full name');
  }
  if (!normalizedPhone || !isValidIndianMobile(normalizedPhone)) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }

  const users = loadUsers();
  if (users.some((u) => u.phone === normalizedPhone)) {
    throw new Error('An account with this mobile number already exists');
  }

  return { trimmedName, normalizedPhone };
}

function isQuickRegistrationPayload({ email, password, address }) {
  return !String(email || '').trim() && !password && !String(address || '').trim();
}

function validateRegistrationPayload({ name, email, password, mobile, address }) {
  const trimmedName = (name || '').trim();
  const trimmedAddress = (address || '').trim();
  const normalizedPhone = normalizePhone(mobile);
  const trimmedEmail = (email || '').trim().toLowerCase();

  if (!trimmedName || trimmedName.length < 2) {
    throw new Error('Please enter your full name');
  }
  if (!trimmedEmail || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(trimmedEmail)) {
    throw new Error('Please enter a valid email address');
  }
  if (!trimmedAddress || trimmedAddress.length < 8) {
    throw new Error('Please enter your full address');
  }
  if (!normalizedPhone || !isValidIndianMobile(normalizedPhone)) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }
  if (!password || password.length < 6) {
    throw new Error('Password must be at least 6 characters');
  }

  const users = loadUsers();
  if (users.some((u) => u.email === trimmedEmail)) {
    throw new Error('An account with this email already exists');
  }
  if (users.some((u) => u.phone === normalizedPhone)) {
    throw new Error('An account with this mobile number already exists');
  }

  return { trimmedName, trimmedEmail, trimmedAddress, normalizedPhone };
}

function validateLoginPhone(mobile) {
  const normalizedPhone = normalizePhone(mobile);
  if (!normalizedPhone || !isValidIndianMobile(normalizedPhone)) {
    throw new Error('Please enter a valid 10-digit mobile number');
  }
  return normalizedPhone;
}

function createSession(user) {
  const session = {
    userId: user.id,
    token: `mock-${user.id}-${Date.now()}`,
    created_at: new Date().toISOString(),
  };
  saveSession(session);
  return sanitizeUser(user);
}

const delay = (ms = 50) => new Promise((r) => setTimeout(r, ms));

function loadCart() {
  try {
    const raw = localStorage.getItem(CART_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function normalizeCartLine(productId, raw, product) {
  if (typeof raw === 'number') {
    return { quantity: raw, weight_grams: product?.weight_grams ?? 50 };
  }
  if (raw && typeof raw === 'object') {
    return {
      quantity: Math.max(0, Number(raw.quantity) || 0),
      weight_grams: Number(raw.weight_grams) || product?.weight_grams || 50,
    };
  }
  return { quantity: 1, weight_grams: product?.weight_grams ?? 50 };
}

function buildCartResponse(cartMap) {
  const items = Object.entries(cartMap).map(([productId, raw]) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return null;
    const { quantity, weight_grams } = normalizeCartLine(productId, raw, product);
    if (quantity <= 0) return null;
    const baseGrams = product.weight_grams || weight_grams;
    const unitPrice = scalePrice(product.price, baseGrams, weight_grams);
    return {
      id: productId,
      product_id: productId,
      quantity,
      name: product.name,
      slug: product.slug,
      price: unitPrice,
      image: product.image?.replace?.('/catalog/snacks/', '/products/snacks/') ?? product.image,
      category_name: product.category_name,
      weight_grams,
      line_total: unitPrice * quantity,
    };
  }).filter(Boolean);

  const subtotal = items.reduce((sum, i) => sum + i.line_total, 0);
  const itemCount = items.reduce((sum, i) => sum + i.quantity, 0);

  return { items, subtotal, itemCount };
}

export const mockApi = {
  async getStats() {
    await delay();
    return {
      success: true,
      data: {
        happyCustomers: '50K+',
        productCount: MOCK_PRODUCTS.length,
        satisfactionRate: '98%',
        addedSugar: '0g',
        avgRating: 4.8,
        totalReviews: MOCK_REVIEWS.length * 200,
      },
    };
  },

  async getCategories() {
    await delay();
    return { success: true, data: MOCK_CATEGORIES };
  },

  async getProducts(params = {}) {
    await delay();
    const page = Math.max(1, parseInt(params.page || '1', 10));
    const limit = Math.min(50, parseInt(params.limit || '12', 10));
    const { products, pagination } = filterProducts({
      category: params.category,
      search: params.search,
      sort: params.sort || 'bestseller',
      page,
      limit,
      minPrice: params.minPrice,
      maxPrice: params.maxPrice,
      minRating: params.rating,
      stock: params.stock,
      format: params.format,
    });
    return { success: true, products, pagination };
  },

  async getBestsellers(limit = 8) {
    await delay();
    return { success: true, data: getBestsellers(limit) };
  },

  async getProduct(slug) {
    await delay();
    const product = getProductBySlug(slug);
    if (!product) throw new Error('Product not found');
    return {
      success: true,
      data: {
        ...product,
        weight_options: getProductWeightOptions(product),
      },
    };
  },

  async getReviews(limit = 6) {
    await delay();
    return { success: true, data: MOCK_REVIEWS.slice(0, limit) };
  },

  async subscribeNewsletter(email) {
    await delay(200);
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      throw new Error('Please enter a valid email');
    }
    const subs = JSON.parse(localStorage.getItem(NEWSLETTER_KEY) || '[]');
    if (!subs.includes(email)) subs.push(email);
    localStorage.setItem(NEWSLETTER_KEY, JSON.stringify(subs));
    return { success: true, message: 'Subscribed successfully!' };
  },

  async getCart() {
    await delay(80);
    const cart = loadCart();
    return { success: true, data: buildCartResponse(cart) };
  },

  async addToCart(productId, quantity = 1, options = {}) {
    await delay(100);
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found');
    const weight_grams = Number(options.weightGrams) || product.weight_grams || 50;
    const cart = loadCart();
    const existing = normalizeCartLine(productId, cart[productId], product);
    if (cart[productId] && existing.weight_grams !== weight_grams) {
      cart[productId] = { quantity, weight_grams };
    } else {
      cart[productId] = { quantity: existing.quantity + quantity, weight_grams };
    }
    saveCart(cart);
    return { success: true, data: buildCartResponse(cart) };
  },

  async updateCartItem(productId, quantity) {
    await delay(100);
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    const cart = loadCart();
    if (quantity <= 0) delete cart[productId];
    else {
      const line = normalizeCartLine(productId, cart[productId], product);
      cart[productId] = { ...line, quantity };
    }
    saveCart(cart);
    return { success: true, data: buildCartResponse(cart) };
  },

  async clearCart() {
    await delay(80);
    saveCart({});
    return { success: true, data: buildCartResponse({}) };
  },

  async register({ name, email, password, mobile, otp }) {
    if (!otp) {
      return this.sendRegistrationOtp({ name, email, password, mobile, address });
    }
    return this.verifyRegistrationOtp({ mobile, otp });
  },

  async login({ email, password }) {
    await delay(200);
    const trimmedEmail = (email || '').trim().toLowerCase();

    if (!trimmedEmail || !password) {
      throw new Error('Please enter email and password');
    }

    assertNotRateLimited('login', trimmedEmail);

    const user = findUserByEmail(trimmedEmail);
    if (!user || user.password !== password) {
      recordFailedAttempt('login', trimmedEmail);
      assertNotRateLimited('login', trimmedEmail);
      throw new Error('Invalid email or password');
    }

    clearFailedAttempts('login', trimmedEmail);
    const safeUser = createSession(user);
    return { success: true, data: safeUser, message: 'Welcome back!' };
  },

  async sendLoginOtp({ mobile }) {
    await delay(250);
    const normalizedPhone = validateLoginPhone(mobile);
    const user = findUserByPhone(normalizedPhone);

    if (!user) {
      throw new Error('No account found with this mobile number. Please sign up first.');
    }

    assertNotRateLimited('login-otp', normalizedPhone);

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    saveLoginOtp({
      mobile: normalizedPhone,
      userId: user.id,
      otp,
      expiresAt,
    });

    return {
      success: true,
      message: `OTP sent to ${formatPhoneDisplay(normalizedPhone)}`,
      data: {
        mobile: normalizedPhone,
        demoOtp: otp,
        ...otpExpiryPayload(expiresAt),
      },
    };
  },

  async resendLoginOtp({ mobile }) {
    await delay(200);
    const normalizedPhone = validateLoginPhone(mobile);
    const pending = loadLoginOtp();

    if (!pending || pending.mobile !== normalizedPhone) {
      throw new Error('Please request an OTP first.');
    }
    if (Date.now() > pending.expiresAt) {
      clearLoginOtp();
      throw new Error('OTP expired. Please request a new one.');
    }

    const user = findUserByPhone(normalizedPhone);
    if (!user) {
      clearLoginOtp();
      throw new Error('No account found with this mobile number.');
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    saveLoginOtp({
      mobile: normalizedPhone,
      userId: user.id,
      otp,
      expiresAt,
    });

    return {
      success: true,
      message: `New OTP sent to ${formatPhoneDisplay(normalizedPhone)}`,
      data: {
        mobile: normalizedPhone,
        demoOtp: otp,
        ...otpExpiryPayload(expiresAt),
      },
    };
  },

  async verifyLoginOtp({ mobile, otp }) {
    await delay(250);
    const normalizedPhone = validateLoginPhone(mobile);
    const code = String(otp || '').trim();

    if (!/^\d{6}$/.test(code)) {
      throw new Error('Please enter the 6-digit OTP');
    }

    assertNotRateLimited('login-otp', normalizedPhone);

    const pending = loadLoginOtp();
    if (!pending || pending.mobile !== normalizedPhone) {
      throw new Error('Please request an OTP first.');
    }
    if (Date.now() > pending.expiresAt) {
      clearLoginOtp();
      throw new Error('OTP expired. Please request a new one.');
    }

    verifyOtpCode(pending, code, 'login-otp', normalizedPhone);

    const user = loadUsers().find((u) => u.id === pending.userId);
    if (!user) {
      clearLoginOtp();
      throw new Error('Account not found. Please sign up first.');
    }

    clearLoginOtp();
    clearFailedAttempts('login-otp', normalizedPhone);
    const safeUser = createSession(user);
    return { success: true, data: safeUser, message: 'Signed in successfully' };
  },

  async sendRegistrationOtp({ name, email, password, mobile, address }) {
    await delay(250);

    let pendingPayload;
    let normalizedPhone;

    if (isQuickRegistrationPayload({ email, password, address })) {
      const quick = validateQuickRegistration({ name, mobile });
      normalizedPhone = quick.normalizedPhone;
      pendingPayload = {
        name: quick.trimmedName,
        phone: normalizedPhone,
        quick: true,
      };
    } else {
      const full = validateRegistrationPayload({ name, email, password, mobile, address });
      normalizedPhone = full.normalizedPhone;
      pendingPayload = {
        name: full.trimmedName,
        email: full.trimmedEmail,
        address: full.trimmedAddress,
        password,
        phone: normalizedPhone,
        quick: false,
      };
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    const pending = {
      mobile: normalizedPhone,
      otp,
      expiresAt,
      payload: pendingPayload,
    };

    savePendingOtp(pending);

    return {
      success: true,
      message: `OTP sent to ${formatPhoneDisplay(normalizedPhone)}`,
      data: {
        mobile: normalizedPhone,
        demoOtp: otp,
        ...otpExpiryPayload(expiresAt),
      },
    };
  },

  async resendRegistrationOtp({ mobile }) {
    await delay(200);
    const normalizedPhone = normalizePhone(mobile);
    const pending = loadPendingOtp();

    if (!pending || pending.mobile !== normalizedPhone) {
      throw new Error('No pending verification found. Please start registration again.');
    }
    if (Date.now() > pending.expiresAt) {
      clearPendingOtp();
      throw new Error('OTP expired. Please start registration again.');
    }

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    savePendingOtp({
      ...pending,
      otp,
      expiresAt,
    });

    return {
      success: true,
      message: `New OTP sent to ${formatPhoneDisplay(normalizedPhone)}`,
      data: {
        mobile: normalizedPhone,
        demoOtp: otp,
        ...otpExpiryPayload(expiresAt),
      },
    };
  },

  async verifyRegistrationOtp({ mobile, otp }) {
    await delay(250);
    const normalizedPhone = normalizePhone(mobile);
    const code = String(otp || '').trim();

    if (!normalizedPhone || !/^\d{6}$/.test(code)) {
      throw new Error('Please enter the 6-digit OTP');
    }

    assertNotRateLimited('register-otp', normalizedPhone);

    const pending = loadPendingOtp();
    if (!pending || pending.mobile !== normalizedPhone) {
      throw new Error('No pending verification found. Please start registration again.');
    }
    if (Date.now() > pending.expiresAt) {
      clearPendingOtp();
      throw new Error('OTP expired. Please request a new one.');
    }

    verifyOtpCode(pending, code, 'register-otp', normalizedPhone);

    const users = loadUsers();
    if (users.some((u) => u.phone === normalizedPhone)) {
      clearPendingOtp();
      throw new Error('An account with this mobile number already exists');
    }

    const quick = pending.payload.quick;
    const email = quick
      ? `${normalizedPhone}@mobile.naturepure.in`
      : pending.payload.email;

    if (users.some((u) => u.email === email)) {
      clearPendingOtp();
      throw new Error('An account with this email already exists');
    }

    const user = {
      id: `user-${Date.now()}`,
      name: pending.payload.name,
      email,
      address: quick ? '' : pending.payload.address,
      phone: normalizedPhone,
      phone_verified: true,
      password: quick ? `otp-${normalizedPhone}-${Date.now()}` : pending.payload.password,
      created_at: new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);
    clearPendingOtp();
    clearFailedAttempts('register-otp', normalizedPhone);

    const safeUser = createSession(user);
    return {
      success: true,
      data: safeUser,
      message: 'Account created successfully',
      token: loadSession()?.token,
    };
  },

  async sendPasswordReset({ email, mobile }) {
    await delay(250);
    const trimmedEmail = (email || '').trim().toLowerCase();
    const normalizedPhone = mobile ? normalizePhone(mobile) : null;

    let user = null;
    if (trimmedEmail) {
      user = findUserByEmail(trimmedEmail);
      if (!user) throw new Error('No account found with this email address.');
    } else if (normalizedPhone) {
      if (!isValidIndianMobile(normalizedPhone)) {
        throw new Error('Please enter a valid 10-digit mobile number');
      }
      user = findUserByPhone(normalizedPhone);
      if (!user) throw new Error('No account found with this mobile number.');
    } else {
      throw new Error('Please enter your email or mobile number');
    }

    const identifier = trimmedEmail || normalizedPhone;
    assertNotRateLimited('reset', identifier);

    const otp = generateOtp();
    const expiresAt = Date.now() + OTP_EXPIRY_MS;
    saveResetOtp({
      userId: user.id,
      email: user.email,
      mobile: user.phone,
      otp,
      expiresAt,
    });

    return {
      success: true,
      message: trimmedEmail
        ? `Reset OTP sent to ${user.email}`
        : `Reset OTP sent to ${formatPhoneDisplay(user.phone)}`,
      data: {
        email: user.email,
        mobile: user.phone,
        demoOtp: otp,
        ...otpExpiryPayload(expiresAt),
      },
    };
  },

  async resetPassword({ email, mobile, otp, password }) {
    await delay(250);
    const trimmedEmail = (email || '').trim().toLowerCase();
    const normalizedPhone = mobile ? normalizePhone(mobile) : null;
    const code = String(otp || '').trim();

    if (!/^\d{6}$/.test(code)) {
      throw new Error('Please enter the 6-digit OTP');
    }
    if (!password || password.length < 6) {
      throw new Error('Password must be at least 6 characters');
    }

    const pending = loadResetOtp();
    if (!pending) {
      throw new Error('Please request a password reset first.');
    }
    if (Date.now() > pending.expiresAt) {
      clearResetOtp();
      throw new Error('OTP expired. Please request a new one.');
    }

    const identifier = trimmedEmail || normalizedPhone || pending.email;
    assertNotRateLimited('reset', identifier);
    verifyOtpCode(pending, code, 'reset', identifier);

    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === pending.userId);
    if (idx === -1) {
      clearResetOtp();
      throw new Error('Account not found.');
    }

    users[idx] = { ...users[idx], password };
    saveUsers(users);
    clearResetOtp();
    clearFailedAttempts('reset', identifier);

    return { success: true, message: 'Password updated. You can sign in now.' };
  },

  async logout() {
    await delay(80);
    saveSession(null);
    return { success: true, message: 'Logged out successfully' };
  },

  async getCurrentUser() {
    await delay(60);
    const session = loadSession();
    if (!session?.userId) return { success: true, data: null };

    const user = loadUsers().find((u) => u.id === session.userId);
    if (!user) {
      saveSession(null);
      return { success: true, data: null };
    }

    return { success: true, data: sanitizeUser(user) };
  },

  async validatePromoCode(code, subtotal) {
    await delay(150);
    const promo = PROMO_CODES[String(code || '').toUpperCase()];
    if (!promo) throw new Error('Invalid promo code');
    if (subtotal < promo.minOrder) {
      throw new Error(`Minimum order of ₹${promo.minOrder} required for this code`);
    }
    const discount =
      promo.type === 'percent'
        ? Math.round(subtotal * (promo.discount / 100))
        : promo.discount;
    return {
      success: true,
      data: { code: code.toUpperCase(), discount, type: promo.type },
    };
  },

  async createOrder({ shipping, payment, promoCode, discount = 0, productIds }) {
    await delay(400);
    const cart = loadCart();
    let cartMap = cart;
    if (Array.isArray(productIds) && productIds.length > 0) {
      const allowed = new Set(productIds);
      cartMap = Object.fromEntries(Object.entries(cart).filter(([id]) => allowed.has(id)));
    }
    const cartData = buildCartResponse(cartMap);
    if (cartData.items.length === 0) throw new Error('No items selected for checkout');

    const shippingCost = cartData.subtotal >= 999 ? 0 : 49;
    const total = Math.max(0, cartData.subtotal + shippingCost - discount);

    const session = loadSession();

    const order = {
      id: `FN-${Date.now().toString(36).toUpperCase()}`,
      user_id: session?.userId || null,
      items: cartData.items,
      subtotal: cartData.subtotal,
      shipping: shippingCost,
      discount,
      promoCode: promoCode || null,
      total,
      shipping_address: shipping,
      payment_method: payment.method,
      payment_status: payment.method === 'cod' ? 'pending' : 'paid',
      status: 'confirmed',
      created_at: new Date().toISOString(),
      estimated_delivery: new Date(Date.now() + 4 * 24 * 60 * 60 * 1000).toISOString(),
    };

    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    orders.unshift(order);
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));

    const remaining = { ...cart };
    for (const item of cartData.items) {
      delete remaining[item.product_id];
    }
    saveCart(remaining);

    return { success: true, data: order };
  },

  async getOrder(orderId) {
    await delay(100);
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    const order = orders.find((o) => o.id === orderId);
    if (!order) throw new Error('Order not found');
    return { success: true, data: order };
  },

  async getOrders() {
    await delay(100);
    const session = loadSession();
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY) || '[]');
    if (!session?.userId) return { success: true, data: [] };
    const user = loadUsers().find((u) => u.id === session.userId);
    const email = user?.email?.toLowerCase();
    const mine = orders.filter((o) => {
      if (o.user_id === session.userId) return true;
      if (!o.user_id && email && o.shipping_address?.email?.toLowerCase() === email) return true;
      return false;
    });
    return { success: true, data: mine };
  },

  async updateProfile({ name, address }) {
    await delay(120);
    const session = loadSession();
    if (!session?.userId) throw new Error('Please sign in to update your profile');

    const trimmedName = (name || '').trim();
    const trimmedAddress = (address || '').trim();
    if (trimmedName.length < 2) throw new Error('Please enter your full name');
    if (trimmedAddress.length < 5) throw new Error('Please enter a complete delivery address');

    const users = loadUsers();
    const idx = users.findIndex((u) => u.id === session.userId);
    if (idx === -1) throw new Error('Account not found');

    users[idx] = {
      ...users[idx],
      name: trimmedName,
      address: trimmedAddress,
    };
    saveUsers(users);

    return { success: true, data: sanitizeUser(users[idx]), message: 'Profile updated' };
  },
};
