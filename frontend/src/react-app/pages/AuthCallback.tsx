// Auth Callback Page
// Handles OAuth redirect from Google
// October 2025

import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export default function AuthCallbackPage() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading');
  const { refreshUser } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    // After Google redirects back, the backend sets the session cookie
    // We just need to refresh the user state and redirect
    const handleCallback = async () => {
      try {
        // Wait a moment for session to be established
        await new Promise(resolve => setTimeout(resolve, 1000));

        // Refresh user from backend
        await refreshUser();

        setStatus('success');

        // Redirect to home
        setTimeout(() => {
          navigate('/', { replace: true });
        }, 1000);
      } catch (error) {
        console.error('Auth callback error:', error);
        setStatus('error');

        // Redirect to landing on error
        setTimeout(() => {
          navigate('/landing', { replace: true });
        }, 3000);
      }
    };

    handleCallback();
  }, [refreshUser, navigate]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 via-orange-50 to-amber-100">
      <div className="text-center p-8">
        {status === 'loading' && (
          <>
            <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Completing sign in...
            </h2>
            <p className="text-gray-600">Please wait a moment</p>
          </>
        )}

        {status === 'success' && (
          <>
            <div className="text-6xl mb-4">✅</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Sign in successful!
            </h2>
            <p className="text-gray-600">Redirecting...</p>
          </>
        )}

        {status === 'error' && (
          <>
            <div className="text-6xl mb-4">❌</div>
            <h2 className="text-2xl font-semibold text-gray-800 mb-2">
              Sign in failed
            </h2>
            <p className="text-gray-600">Redirecting back...</p>
          </>
        )}
      </div>
    </div>
  );
}
