import { useEffect, useRef } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from 'miaoda-auth-react';

/**
 * Custom hook to handle redirect after successful registration
 * Redirects new users to /properties page after they register
 */
export const useAuthRedirect = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const previousUserRef = useRef(user);

  useEffect(() => {
    const previousUser = previousUserRef.current;
    
    // Check if user just logged in/registered (went from null to having a user)
    if (!previousUser && user) {
      // Check if we're on the login page
      if (location.pathname === '/login' || location.pathname === '/') {
        // Small delay to ensure auth state is fully settled
        setTimeout(() => {
          navigate('/properties', { replace: true });
        }, 100);
      }
    }

    // Update the ref for next render
    previousUserRef.current = user;
  }, [user, navigate, location.pathname]);
};
