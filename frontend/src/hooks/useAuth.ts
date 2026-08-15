import { useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '../types/index.js';
import { authService } from '../services/auth.service.js';

/**
 * Custom hook untuk mengelola status autentikasi pengguna dan sinkronisasi sesi backend
 */
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    return authService.getStoredUser();
  });
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Verifikasi sesi dan segarkan data profil saat aplikasi pertama kali dimuat
  useEffect(() => {
    const verifySession = async () => {
      const token = authService.getToken();
      if (!token) {
        setIsLoading(false);
        return;
      }

      try {
        const user = await authService.getMe();
        setCurrentUser(user);
      } catch (error) {
        console.warn('Sesi tidak valid atau telah berakhir:', error);
        authService.logout();
        setCurrentUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    verifySession();
  }, []);

  const login = useCallback((user: AuthUser) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    authService.logout();
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    isLoading,
    login,
    logout,
  };
};
