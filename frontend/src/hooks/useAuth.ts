import { useState, useEffect, useCallback } from 'react';
import type { AuthUser } from '../types/index.js';

const STORAGE_KEY = 'indokerja_user';

const DEFAULT_DEMO_USER: AuthUser = {
  id: 'usr-demo-pelamar',
  email: 'pelamar@indokerja.id',
  fullName: 'Ahmad Farhan Pratama',
  role: 'JOB_SEEKER',
  phone: '085712345678',
  avatarUrl:
    'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?auto=format&fit=crop&q=80&w=200',
};

/**
 * Custom hook untuk mengelola status autentikasi pengguna dan sinkronisasi localStorage
 */
export const useAuth = () => {
  const [currentUser, setCurrentUser] = useState<AuthUser | null>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DEFAULT_DEMO_USER;
    } catch {
      return DEFAULT_DEMO_USER;
    }
  });

  // Sinkronisasi ke localStorage saat data currentUser berubah
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(currentUser));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [currentUser]);

  const login = useCallback((user: AuthUser) => {
    setCurrentUser(user);
  }, []);

  const logout = useCallback(() => {
    setCurrentUser(null);
  }, []);

  return {
    currentUser,
    login,
    logout,
  };
};
