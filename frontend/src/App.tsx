import React, { useState, useCallback } from "react";
import type {
  Job,
  Application,
  ApplicationStatus,
  AuthUser,
} from "./types/index.js";

// Layout & Komponen Global
import { MainLayout } from "./components/layout/MainLayout.js";
import { Toast } from "./components/common/Toast.js";

// Halaman-Halaman Aplikasi
import { LandingPage } from "./pages/landing/LandingPage.js";
import { LoginPage } from "./pages/auth/LoginPage.js";
import { RegisterPage } from "./pages/auth/RegisterPage.js";
import { ApplicationTrackerPage } from "./pages/tracker/ApplicationTrackerPage.js";
import { JobDetailPage } from "./pages/jobs/JobDetailPage.js";
import { ApplyJobPage } from "./pages/jobs/ApplyJobPage.js";
import { PostJobPage } from "./pages/recruiter/PostJobPage.js";
import { RecruiterApplicantsPage } from "./pages/recruiter/RecruiterApplicantsPage.js";

// Custom Hooks
import { useAuth } from "./hooks/useAuth.js";
import { useJobs } from "./hooks/useJobs.js";
import { useApplications } from "./hooks/useApplications.js";
import { useJobFilters } from "./hooks/useJobFilters.js";
import { useToast } from "./hooks/useToast.js";
import { parseApiError } from "./services/api.js";

/**
 * Tipe Rute Halaman Aplikasi
 */
export type PageRoute =
  | "LANDING"
  | "LOGIN"
  | "REGISTER"
  | "TRACKER"
  | "JOB_DETAIL"
  | "APPLY_JOB"
  | "POST_JOB"
  | "RECRUITER_APPLICANTS";

/**
 * Komponen Utama Aplikasi (App Root)
 *
 * Bertindak sebagai orchestrator dan router tingkat atas.
 * Seluruh state bisnis, notifikasi, dan penyaringan diisolasi ke dalam Custom Hooks
 */
export const App: React.FC = () => {
  // State Navigasi Halaman
  const [currentPage, setCurrentPage] = useState<PageRoute>("LANDING");
  const [redirectAfterLogin, setRedirectAfterLogin] = useState<PageRoute | null>(null);

  // Custom Hooks untuk Domain Logika Bisnis
  const { currentUser, login, logout } = useAuth();
  const { jobs, isLoading: isJobsLoading, selectedJob, setSelectedJob, createJob } = useJobs();
  const {
    applications,
    isLoading: isApplicationsLoading,
    hasUserApplied,
    submitApplication,
    updateApplicationStatus,
  } = useApplications(currentUser);
  const { toasts, addToast, dismissToast } = useToast();
  const {
    filters,
    filteredJobs,
    availableCategories,
    handleFilterChange,
    handleResetFilters,
    handleHeroSearch,
    handleSelectCategory,
    handleSelectCompany,
  } = useJobFilters(jobs);

  // Helper Navigasi & Auto-Scroll
  const navigateTo = useCallback((page: PageRoute) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);

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

  // Handlers Autentikasi
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

  // Handlers Lamaran & Rekrutmen
  const handleViewJobDetail = useCallback(
    (job: Job) => {
      setSelectedJob(job);
      navigateTo("JOB_DETAIL");
    },
    [setSelectedJob, navigateTo],
  );

  const handleNavigateToApply = useCallback(
    (job: Job) => {
      setSelectedJob(job);

      if (!currentUser) {
        setRedirectAfterLogin("APPLY_JOB");
        addToast(
          "info",
          "Silakan Masuk Terlebih Dahulu",
          "Anda perlu login sebagai Pencari Kerja untuk mengajukan lamaran.",
        );
        navigateTo("LOGIN");
        return;
      }

      if (currentUser.role === "RECRUITER") {
        addToast(
          "error",
          "Akses Dibatasi",
          "Akun Perekrut (HR) tidak dapat mengajukan lamaran pekerjaan.",
        );
        return;
      }

      navigateTo("APPLY_JOB");
    },
    [currentUser, setSelectedJob, navigateTo, addToast],
  );

  const handleCreateJob = useCallback(
    async (jobData: Omit<Job, "id" | "createdAt">): Promise<boolean> => {
      try {
        const newJob = await createJob(jobData);
        navigateTo("JOB_DETAIL");
        addToast(
          "success",
          "Lowongan Berhasil Diterbitkan",
          `Posisi ${newJob.title} di ${newJob.company?.name || 'Perusahaan'} telah aktif.`,
        );
        return true;
      } catch (err: any) {
        const apiErr = parseApiError(err);
        addToast(
          "error",
          "Gagal Menerbitkan Lowongan",
          apiErr.message || "Terjadi kesalahan saat mempublikasikan lowongan ke backend.",
        );
        return false;
      }
    },
    [createJob, navigateTo, addToast],
  );

  const handleSubmitApplication = useCallback(
    (appData: Omit<Application, "id" | "createdAt" | "logs">): boolean => {
      const success = submitApplication(appData);
      if (!success) {
        addToast(
          "error",
          "Pengajuan Ditolak",
          "Anda sudah pernah mengajukan lamaran untuk posisi ini sebelumnya.",
        );
        return false;
      }

      addToast(
        "success",
        "Lamaran Berhasil Terkirim",
        `Lamaran untuk ${appData.job.title} di ${appData.job.company.name} berhasil dikirim.`,
      );
      navigateTo("TRACKER");
      return true;
    },
    [submitApplication, addToast, navigateTo],
  );

  const handleUpdateApplicationStatus = useCallback(
    (
      applicationId: string,
      newStatus: ApplicationStatus,
      recruiterNotes?: string,
    ) => {
      updateApplicationStatus(applicationId, newStatus, recruiterNotes);
      addToast(
        "success",
        "Status Pelamar Diperbarui",
        `Tahapan seleksi kandidat berhasil diubah ke ${newStatus}.`,
      );
    },
    [updateApplicationStatus, addToast],
  );

  // Rendering Khusus Halaman Auth Tanpa Layout Penuh
  if (currentPage === "LOGIN") {
    return (
      <>
        <Toast toasts={toasts} onDismiss={dismissToast} />
        <LoginPage
          onLoginSuccess={handleLoginSuccess}
          onNavigateToRegister={() => navigateTo("REGISTER")}
          onNavigateToHome={() => navigateTo("LANDING")}
        />
      </>
    );
  }

  if (currentPage === "REGISTER") {
    return (
      <>
        <Toast toasts={toasts} onDismiss={dismissToast} />
        <RegisterPage
          onRegisterSuccess={handleRegisterSuccess}
          onNavigateToLogin={() => navigateTo("LOGIN")}
          onNavigateToHome={() => navigateTo("LANDING")}
        />
      </>
    );
  }

  // Rendering Halaman Utama Berbalut MainLayout Terpadu
  return (
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
      {currentPage === "TRACKER" && (
        <ApplicationTrackerPage
          applications={applications}
          isLoading={isApplicationsLoading}
          onNavigateToHome={() => navigateTo("LANDING")}
          onNavigateToJobs={scrollToJobs}
          onViewJobDetail={handleViewJobDetail}
        />
      )}

      {currentPage === "JOB_DETAIL" && (
        <JobDetailPage
          job={selectedJob}
          hasApplied={
            selectedJob
              ? hasUserApplied(
                  selectedJob.id,
                  currentUser ? currentUser.email : "pelamar@indokerja.id",
                )
              : false
          }
          onNavigateBack={() => navigateTo("LANDING")}
          onNavigateToApply={handleNavigateToApply}
        />
      )}

      {currentPage === 'APPLY_JOB' && (
        <ApplyJobPage
          job={selectedJob}
          currentUser={currentUser}
          onNavigateBack={() => {
            if (selectedJob) navigateTo('JOB_DETAIL');
            else navigateTo('LANDING');
          }}
          onSubmitApplication={handleSubmitApplication}
        />
      )}

      {currentPage === "POST_JOB" && (
        <PostJobPage
          currentUser={currentUser}
          onNavigateBack={() => navigateTo("LANDING")}
          onSubmitJob={handleCreateJob}
        />
      )}

      {currentPage === "RECRUITER_APPLICANTS" && (
        <RecruiterApplicantsPage
          jobs={jobs}
          applications={applications}
          onNavigateBack={() => navigateTo("LANDING")}
          onNavigateToPostJob={() => navigateTo("POST_JOB")}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
        />
      )}

      {currentPage === "LANDING" && (
        <LandingPage
          filteredJobs={filteredJobs}
          isLoading={isJobsLoading}
          availableCategories={availableCategories}
          filters={filters}
          onFilterChange={handleFilterChange}
          onResetFilters={handleResetFilters}
          onHeroSearch={handleHeroSearch}
          onSelectCategory={handleSelectCategory}
          onSelectCompany={handleSelectCompany}
          onViewJobDetail={handleViewJobDetail}
          onApplyJob={handleNavigateToApply}
          hasUserApplied={(jobId) =>
            hasUserApplied(
              jobId,
              currentUser ? currentUser.email : "pelamar@indokerja.id",
            )
          }
          onScrollToJobs={scrollToJobs}
        />
      )}
    </MainLayout>
  );
};

export default App;
