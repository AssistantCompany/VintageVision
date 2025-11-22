// Self-Hosted Authentication Context
// Replaces @/contexts/AuthContext
// October 2025

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

interface User {
  id: string;
  email: string;
  displayName: string | null;
  avatarUrl: string | null;
  emailVerified: boolean;
  createdAt: string;
  // Legacy compatibility
  google_user_data?: {
    name?: string;
    given_name?: string;
    picture?: string;
    email?: string;
  };
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: () => void;
  logout: () => Promise<void>;
  refreshUser: () => Promise<void>;
  redirectToLogin: () => void; // Legacy compatibility
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is authenticated on mount
  useEffect(() => {
    checkAuth();
  }, []);

  async function checkAuth() {
    try {
      console.log('[AUTH] Checking authentication status...');
      const response = await fetch('/api/auth/me', {
        credentials: 'include',
      });

      console.log('[AUTH] Response status:', response.status);

      if (response.ok) {
        const data = await response.json();
        console.log('[AUTH] Response data:', data);
        if (data.success && data.data) {
          console.log('[AUTH] User authenticated:', data.data.email);
          setUser(data.data);
        } else {
          console.log('[AUTH] User not authenticated (no data)');
          setUser(null);
        }
      } else {
        console.log('[AUTH] User not authenticated (response not ok)');
        setUser(null);
      }
    } catch (error) {
      console.error('[AUTH] Auth check failed:', error);
      setUser(null);
    } finally {
      setIsLoading(false);
      console.log('[AUTH] Auth check complete, isLoading:', false);
    }
  }

  function login() {
    // Redirect to Google OAuth
    window.location.href = '/api/auth/google';
  }

  async function logout() {
    try {
      await fetch('/api/auth/logout', {
        method: 'POST',
        credentials: 'include',
      });
      setUser(null);
      window.location.href = '/';
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  async function refreshUser() {
    await checkAuth();
  }

  const value = {
    user,
    isLoading,
    isAuthenticated: !!user,
    login,
    logout,
    refreshUser,
    redirectToLogin: login, // Legacy compatibility - same as login
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
