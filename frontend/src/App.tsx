import React, { useState, useCallback } from "react";
import type { AuthUser } from "./types/index.js";
import { MainLayout } from "./components/layout/MainLayout.js";
import { Toast } from "./components/common/Toast.js";
import { AppRouter, type PageRoute } from "./routes/AppRouter.js";
import { useAuth } from "./hooks/useAuth.js";
import { useApplications } from "./hooks/useApplications.js";
import { useToast } from "./hooks/useToast.js";

/**
 * Komponen Utama Aplikasi (App Root)
 *
 * Bertindak sebagai Root Container yang ramping dan bersih.
 * Mengintegrasikan Layout Global, Sistem Notifikasi Toast, dan Router Modular.
 */
export const App: React.FC = () => {
  // State Navigasi Rute
  const [currentPage, setCurrentPage] = useState<PageRoute>("LANDING");
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<PageRoute | null>(null);

  // Global Auth & Notification Hooks
  const { currentUser, login, logout } = useAuth();
  const { applications } = useApplications(currentUser);
  const { toasts, addToast, dismissToast } = useToast();

  // Helper Navigasi Rute
  const navigateTo = useCallback((page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

  // Handlers Autentikasi Global
  const handleLoginSuccess = useCallback(
    (user: AuthUser) => {
      login(user);
      const targetPage =
        redirectAfterLogin && user.role === "JOB_SEEKER"
          ? redirectAfterLogin
          : "LANDING";
      setRedirectAfterLogin(null);
      navigateTo(targetPage);
      addToast(
        "success",
        "Login Berhasil",
        `Selamat datang kembali, ${user.fullName}.`,
      );
    },
    [login, redirectAfterLogin, navigateTo, addToast],
  );

  const handleRegisterSuccess = useCallback(
    (user: AuthUser) => {
      login(user);
      const targetPage =
        redirectAfterLogin && user.role === "JOB_SEEKER"
          ? redirectAfterLogin
          : "LANDING";
      setRedirectAfterLogin(null);
      navigateTo(targetPage);
      addToast(
        "success",
        "Pendaftaran Berhasil",
        `Akun Anda (${user.fullName}) berhasil dibuat.`,
      );
    },
    [login, redirectAfterLogin, navigateTo, addToast],
  );

  const handleLogout = useCallback(() => {
    logout();
    setRedirectAfterLogin(null);
    navigateTo("LANDING");
    addToast("info", "Anda Telah Keluar", "Sesi login telah berakhir.");
  }, [logout, navigateTo, addToast]);

  // Helper Scroll ke Katalog Lowongan
  const scrollToJobs = useCallback(() => {
    if (currentPage !== "LANDING") {
      setCurrentPage("LANDING");
      setTimeout(() => {
        const target = document.getElementById("jobs-catalog");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const target = document.getElementById("jobs-catalog");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage]);

  const isAuthPage = currentPage === "LOGIN" || currentPage === "REGISTER";

  return (
    <>
      <Toast toasts={toasts} onDismiss={dismissToast} />

      {isAuthPage ? (
        <AppRouter
          currentPage={currentPage}
          currentUser={currentUser}
          onNavigate={navigateTo}
          onLoginSuccess={handleLoginSuccess}
          onRegisterSuccess={handleRegisterSuccess}
          onAddToast={addToast}
          redirectAfterLogin={redirectAfterLogin}
          setRedirectAfterLogin={setRedirectAfterLogin}
        />
      ) : (
        <MainLayout
          currentUser={currentUser}
          applicationsCount={applications.length}
          toasts={toasts}
          onDismissToast={dismissToast}
          onNavigateToTracker={() => navigateTo("TRACKER")}
          onNavigateToPostJob={() => navigateTo("POST_JOB")}
          onNavigateToApplicants={() => navigateTo("RECRUITER_APPLICANTS")}
          onNavigateToLogin={() => navigateTo("LOGIN")}
          onNavigateToRegister={() => navigateTo("REGISTER")}
          onLogout={handleLogout}
          onScrollToJobs={scrollToJobs}
        >
          <AppRouter
            currentPage={currentPage}
            currentUser={currentUser}
            onNavigate={navigateTo}
            onLoginSuccess={handleLoginSuccess}
            onRegisterSuccess={handleRegisterSuccess}
            onAddToast={addToast}
            redirectAfterLogin={redirectAfterLogin}
            setRedirectAfterLogin={setRedirectAfterLogin}
          />
        </MainLayout>
      )}
    </>
  );
};

export default App;
