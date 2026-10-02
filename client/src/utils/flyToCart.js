const FLY_SIZE_PX = 76;
const FLY_DURATION_MS = 900;

export const CART_FLY_TARGET_ID = 'site-cart-fly-target';
export const WISHLIST_FLY_TARGET_ID = 'site-wishlist-fly-target';

export const CART_FLY_COMPLETE_EVENT = 'cart-icon-bounce';
export const WISHLIST_FLY_COMPLETE_EVENT = 'wishlist-icon-bounce';

function prefersReducedMotion() {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
}

function easeInOutCubic(t) {
  return t < 0.5 ? 4 * t * t * t : 1 - (-2 * t + 2) ** 3 / 2;
}

function quadBezier(t, p0, p1, p2) {
  const u = 1 - t;
  return u * u * p0 + 2 * u * t * p1 + t * t * p2;
}

function rectCenter(rect) {
  return {
    x: rect.left + rect.width / 2,
    y: rect.top + rect.height / 2,
  };
}

function normalizeFromRect(fromRect) {
  if (!fromRect) return null;
  if (typeof fromRect.left === 'number') {
    return {
      left: fromRect.left,
      top: fromRect.top,
      width: fromRect.width,
      height: fromRect.height,
    };
  }
  return null;
}

export function getFlySourceRect(sourceElement) {
  if (!sourceElement || typeof document === 'undefined') return null;

  if (sourceElement instanceof HTMLImageElement) {
    const rect = sourceElement.getBoundingClientRect();
    if (rect.width > 2 && rect.height > 2) return normalizeFromRect(rect);
  }

  const nestedImg = sourceElement.querySelector?.('img');
  if (nestedImg) {
    const rect = nestedImg.getBoundingClientRect();
    if (rect.width > 2 && rect.height > 2) return normalizeFromRect(rect);
  }

  const rect = sourceElement.getBoundingClientRect();
  return rect.width > 2 && rect.height > 2 ? normalizeFromRect(rect) : null;
}

function getTargetRect(targetId, iconSelector) {
  const target = document.getElementById(targetId);
  if (!target) return null;
  const icon = iconSelector ? target.querySelector(iconSelector) : null;
  const rect = (icon ?? target).getBoundingClientRect();
  return rect.width > 0 ? normalizeFromRect(rect) : null;
}

export function getCartFlyTargetRect() {
  return getTargetRect(CART_FLY_TARGET_ID, '[data-cart-fly-icon]');
}

export function getWishlistFlyTargetRect() {
  return getTargetRect(WISHLIST_FLY_TARGET_ID, '[data-wishlist-fly-icon]');
}

export function buildFlyPayload({ imageSrc, sourceElement, event }) {
  if (!imageSrc) return null;

  const fromRect = getFlySourceRect(sourceElement);
  if (fromRect) {
    return { imageSrc, fromRect };
  }

  if (event?.clientX != null) {
    const size = 48;
    return {
      imageSrc,
      fromRect: {
        left: event.clientX - size / 2,
        top: event.clientY - size / 2,
        width: size,
        height: size,
      },
    };
  }

  return null;
}

function runProductFlyAnimation({ imageSrc, fromRect, getTargetRectFn, completeEvent }) {
  const from = normalizeFromRect(fromRect);
  if (prefersReducedMotion() || !imageSrc || !from) {
    return false;
  }

  const toRect = getTargetRectFn();
  if (!toRect) {
    return false;
  }

  const fromCenter = rectCenter(from);
  const toCenter = rectCenter(toRect);
  const fromX = fromCenter.x;
  const fromY = fromCenter.y;
  const toX = toCenter.x;
  const toY = toCenter.y;

  const shell = document.createElement('div');
  shell.className = 'cart-fly-item';
  shell.setAttribute('aria-hidden', 'true');

  const img = document.createElement('img');
  img.src = imageSrc;
  img.alt = '';
  shell.appendChild(img);

  const layer = document.getElementById('cart-fly-layer') ?? document.body;
  layer.appendChild(shell);

  shell.style.width = `${FLY_SIZE_PX}px`;
  shell.style.height = `${FLY_SIZE_PX}px`;
  shell.style.transform = `translate3d(${fromX - FLY_SIZE_PX / 2}px, ${fromY - FLY_SIZE_PX / 2}px, 0) scale(1)`;
  shell.style.opacity = '1';

  const half = FLY_SIZE_PX / 2;
  const dx = toX - fromX;
  const dy = toY - fromY;
  const arcLift = Math.min(260, Math.max(100, Math.abs(dx) * 0.5 + Math.abs(dy) * 0.3 + 80));
  const ctrlX = fromX + dx * 0.42;
  const ctrlY = Math.min(fromY, toY) - arcLift;

  const start = performance.now();

  requestAnimationFrame(function tick(now) {
    const t = Math.min(1, (now - start) / FLY_DURATION_MS);
    const eased = easeInOutCubic(t);

    const x = quadBezier(eased, fromX, ctrlX, toX);
    const y = quadBezier(eased, fromY, ctrlY, toY);
    const scale = 1 - eased * 0.7;

    shell.style.transform = `translate3d(${x - half}px, ${y - half}px, 0) scale(${scale})`;
    shell.style.opacity = t < 0.9 ? '1' : String(1 - (t - 0.9) / 0.1);

    if (t < 1) {
      requestAnimationFrame(tick);
    } else {
      shell.remove();
      window.dispatchEvent(new CustomEvent(completeEvent));
    }
  });

  return true;
}

export function startCartFly(fly) {
  if (!fly?.imageSrc || !fly?.fromRect) return false;
  return runProductFlyAnimation({
    imageSrc: fly.imageSrc,
    fromRect: fly.fromRect,
    getTargetRectFn: getCartFlyTargetRect,
    completeEvent: CART_FLY_COMPLETE_EVENT,
  });
}

export function startWishlistFly(fly) {
  if (!fly?.imageSrc || !fly?.fromRect) return false;
  return runProductFlyAnimation({
    imageSrc: fly.imageSrc,
    fromRect: fly.fromRect,
    getTargetRectFn: getWishlistFlyTargetRect,
    completeEvent: WISHLIST_FLY_COMPLETE_EVENT,
  });
}

/** @deprecated use addItem(..., { fly }) */
export async function addToCartWithFly({ addItem, productId, quantity, options, imageSrc, sourceElement, event }) {
  const fly = buildFlyPayload({ imageSrc, sourceElement, event });
  const { fly: _f, ...rest } = options || {};
  return addItem(productId, quantity, { ...rest, fly });
}

export function initCartFlyListener() {
  return () => {};
}
