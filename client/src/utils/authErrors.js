export const AUTH_REQUIRED_CODE = 'AUTH_REQUIRED';

export function createAuthRequiredError() {
  const err = new Error('Sign in required to add items to your cart');
  err.code = AUTH_REQUIRED_CODE;
  return err;
}

export function isAuthRequiredError(err) {
  return err?.code === AUTH_REQUIRED_CODE;
}
