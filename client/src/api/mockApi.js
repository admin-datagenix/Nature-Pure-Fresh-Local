import {
  MOCK_CATEGORIES,
  MOCK_REVIEWS,
  MOCK_PRODUCTS,
  filterProducts,
  getBestsellers,
  getProductBySlug,
} from './mockData.js';

const CART_KEY = 'fresh_nature_mock_cart';
const NEWSLETTER_KEY = 'fresh_nature_newsletter';
const USERS_KEY = 'fresh_nature_users';
const SESSION_KEY = 'fresh_nature_session';
const OTP_PENDING_KEY = 'fresh_nature_registration_otp';
const LOGIN_OTP_KEY = 'fresh_nature_login_otp';

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

const delay = (ms = 120) => new Promise((r) => setTimeout(r, ms));

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

function buildCartResponse(cartMap) {
  const items = Object.entries(cartMap).map(([productId, quantity]) => {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return null;
    return {
      product_id: productId,
      quantity,
      name: product.name,
      slug: product.slug,
      price: product.price,
      weight_grams: product.weight_grams,
      line_total: product.price * quantity,
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
    return { success: true, data: product };
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

  async addToCart(productId, quantity = 1) {
    await delay(100);
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) throw new Error('Product not found');
    const cart = loadCart();
    cart[productId] = (cart[productId] || 0) + quantity;
    saveCart(cart);
    return { success: true, data: buildCartResponse(cart) };
  },

  async updateCartItem(productId, quantity) {
    await delay(100);
    const cart = loadCart();
    if (quantity <= 0) delete cart[productId];
    else cart[productId] = quantity;
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

    const user = findUserByEmail(trimmedEmail);
    if (!user || user.password !== password) {
      throw new Error('Invalid email or password');
    }

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

    const otp = generateOtp();
    saveLoginOtp({
      mobile: normalizedPhone,
      userId: user.id,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return {
      success: true,
      message: `OTP sent to ${formatPhoneDisplay(normalizedPhone)}`,
      data: {
        mobile: normalizedPhone,
        expiresIn: 300,
        demoOtp: otp,
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
    saveLoginOtp({
      mobile: normalizedPhone,
      userId: user.id,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return {
      success: true,
      message: `New OTP sent to ${formatPhoneDisplay(normalizedPhone)}`,
      data: {
        mobile: normalizedPhone,
        expiresIn: 300,
        demoOtp: otp,
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

    const pending = loadLoginOtp();
    if (!pending || pending.mobile !== normalizedPhone) {
      throw new Error('Please request an OTP first.');
    }
    if (Date.now() > pending.expiresAt) {
      clearLoginOtp();
      throw new Error('OTP expired. Please request a new one.');
    }
    if (pending.otp !== code) {
      throw new Error('Invalid OTP. Please try again.');
    }

    const user = loadUsers().find((u) => u.id === pending.userId);
    if (!user) {
      clearLoginOtp();
      throw new Error('Account not found. Please sign up first.');
    }

    clearLoginOtp();
    const safeUser = createSession(user);
    return { success: true, data: safeUser, message: 'Signed in successfully' };
  },

  async sendRegistrationOtp({ name, email, password, mobile, address }) {
    await delay(250);
    const { trimmedName, trimmedEmail, trimmedAddress, normalizedPhone } = validateRegistrationPayload({
      name,
      email,
      password,
      mobile,
      address,
    });

    const otp = generateOtp();
    const pending = {
      mobile: normalizedPhone,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
      payload: {
        name: trimmedName,
        email: trimmedEmail,
        address: trimmedAddress,
        password,
        phone: normalizedPhone,
      },
    };

    savePendingOtp(pending);

    return {
      success: true,
      message: `OTP sent to ${formatPhoneDisplay(normalizedPhone)}`,
      data: {
        mobile: normalizedPhone,
        expiresIn: 300,
        demoOtp: otp,
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
    savePendingOtp({
      ...pending,
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    });

    return {
      success: true,
      message: `New OTP sent to ${formatPhoneDisplay(normalizedPhone)}`,
      data: {
        mobile: normalizedPhone,
        expiresIn: 300,
        demoOtp: otp,
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

    const pending = loadPendingOtp();
    if (!pending || pending.mobile !== normalizedPhone) {
      throw new Error('No pending verification found. Please start registration again.');
    }
    if (Date.now() > pending.expiresAt) {
      clearPendingOtp();
      throw new Error('OTP expired. Please request a new one.');
    }
    if (pending.otp !== code) {
      throw new Error('Invalid OTP. Please try again.');
    }

    const users = loadUsers();
    if (users.some((u) => u.email === pending.payload.email)) {
      clearPendingOtp();
      throw new Error('An account with this email already exists');
    }
    if (users.some((u) => u.phone === normalizedPhone)) {
      clearPendingOtp();
      throw new Error('An account with this mobile number already exists');
    }

    const user = {
      id: `user-${Date.now()}`,
      name: pending.payload.name,
      email: pending.payload.email,
      address: pending.payload.address,
      phone: normalizedPhone,
      phone_verified: true,
      password: pending.payload.password,
      created_at: new Date().toISOString(),
    };

    users.push(user);
    saveUsers(users);
    clearPendingOtp();

    const safeUser = createSession(user);
    return { success: true, data: safeUser, message: 'Account created successfully' };
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
};
