import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { notifyInfo } from '../utils/notify';

/**
 * @param {'cart' | 'wishlist'} intent
 * @returns {boolean} true when the user is signed in and the action may proceed
 */
export function useAuthGate() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const requireAuth = useCallback(
    (intent = 'cart') => {
      if (isAuthenticated) return true;

      notifyInfo(
        intent === 'wishlist'
          ? 'Sign up or log in to save items to your wishlist.'
          : 'Sign up or log in to add items to your cart.'
      );

      navigate('/register', {
        state: {
          from: {
            pathname: `${location.pathname}${location.search}`,
          },
        },
      });
      return false;
    },
    [isAuthenticated, navigate, location.pathname, location.search]
  );

  return { isAuthenticated, requireAuth };
}
