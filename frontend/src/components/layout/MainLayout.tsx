import React from 'react';
import type { AuthUser, ToastNotification } from '../../types/index.js';
import { Navbar } from '../common/Navbar.js';
import { Footer } from '../common/Footer.js';
import { Toast } from '../common/Toast.js';

interface MainLayoutProps {
  children: React.ReactNode;
  currentUser: AuthUser | null;
  applicationsCount: number;
  toasts: ToastNotification[];
  onDismissToast: (id: string) => void;
  onNavigateToTracker: () => void;
  onNavigateToPostJob: () => void;
  onNavigateToApplicants: () => void;
  onNavigateToLogin: () => void;
  onNavigateToRegister: () => void;
  onLogout: () => void;
  onScrollToJobs: () => void;
}

/**
 * Layout Induk (Main Layout Wrapper)
 *
 * Mengenkapsulasi Navbar, Wadah Notifikasi Toast, Konten Halaman, dan Footer
 * sehingga tidak terjadi duplikasi kode layout di setiap renderer halaman.
 */
export const MainLayout: React.FC<MainLayoutProps> = ({
  children,
  currentUser,
  applicationsCount,
  toasts,
  onDismissToast,
  onNavigateToTracker,
  onNavigateToPostJob,
  onNavigateToApplicants,
  onNavigateToLogin,
  onNavigateToRegister,
  onLogout,
  onScrollToJobs,
}) => {
  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      {/* Wadah Notifikasi Toast Global */}
      <Toast toasts={toasts} onDismiss={onDismissToast} />

      {/* Header Navigasi Global */}
      <Navbar
        currentUser={currentUser}
        applicationsCount={applicationsCount}
        onNavigateToTracker={onNavigateToTracker}
        onNavigateToPostJob={onNavigateToPostJob}
        onNavigateToApplicants={onNavigateToApplicants}
        onNavigateToLogin={onNavigateToLogin}
        onNavigateToRegister={onNavigateToRegister}
        onLogout={onLogout}
        onScrollToJobs={onScrollToJobs}
      />

      {/* Konten Halaman Utama */}
      <div className="flex-1 flex flex-col">{children}</div>

      {/* Footer Global */}
      <Footer />
    </div>
  );
};
