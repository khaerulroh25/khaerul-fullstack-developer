import React, { useCallback } from "react";
import type {
  Job,
  Application,
  ApplicationStatus,
  AuthUser,
} from "../types/index.js";

// Halaman-Halaman Aplikasi
import { LandingPage } from "../pages/landing/LandingPage.js";
import { LoginPage } from "../pages/auth/LoginPage.js";
import { RegisterPage } from "../pages/auth/RegisterPage.js";
import { ApplicationTrackerPage } from "../pages/tracker/ApplicationTrackerPage.js";
import { JobDetailPage } from "../pages/jobs/JobDetailPage.js";
import { ApplyJobPage } from "../pages/jobs/ApplyJobPage.js";
import { PostJobPage } from "../pages/recruiter/PostJobPage.js";
import { RecruiterApplicantsPage } from "../pages/recruiter/RecruiterApplicantsPage.js";

// Custom Hooks & Utils
import { useJobs } from "../hooks/useJobs.js";
import { useApplications } from "../hooks/useApplications.js";
import { useJobFilters } from "../hooks/useJobFilters.js";
import { parseApiError } from "../services/api.js";

export type PageRoute =
  | "LANDING"
  | "LOGIN"
  | "REGISTER"
  | "TRACKER"
  | "JOB_DETAIL"
  | "APPLY_JOB"
  | "POST_JOB"
  | "RECRUITER_APPLICANTS";

interface AppRouterProps {
  currentPage: PageRoute;
  currentUser: AuthUser | null;
  onNavigate: (page: PageRoute) => void;
  onLoginSuccess: (user: AuthUser) => void;
  onRegisterSuccess: (user: AuthUser) => void;
  onAddToast: (type: "success" | "error" | "info" | "warning", title: string, message: string) => void;
  onApplicationsCountChange?: (count: number) => void;
  redirectAfterLogin: PageRoute | null;
  setRedirectAfterLogin: (page: PageRoute | null) => void;
}

/**
 * Komponen Router & Page Switcher Utama (AppRouter)
 * Bertanggung jawab penuh terhadap manajemen rute halaman, filter katalog,
 * serta alur transaksi bisnis (Apply Job, Post Job, dan Update Status ATS).
 */
export const AppRouter: React.FC<AppRouterProps> = React.memo(({
  currentPage,
  currentUser,
  onNavigate,
  onLoginSuccess,
  onRegisterSuccess,
  onAddToast,
  redirectAfterLogin: _redirectAfterLogin,
  setRedirectAfterLogin,
}) => {
  // Domain Hooks
  const { jobs, isLoading: isJobsLoading, selectedJob, setSelectedJob, createJob } = useJobs();
  const {
    applications,
    isLoading: isApplicationsLoading,
    hasUserApplied,
    submitApplication,
    updateApplicationStatus,
  } = useApplications(currentUser);

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

  // Helper Scroll ke Katalog Lowongan
  const scrollToJobs = useCallback(() => {
    if (currentPage !== "LANDING") {
      onNavigate("LANDING");
      setTimeout(() => {
        const target = document.getElementById("jobs-catalog");
        if (target) target.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } else {
      const target = document.getElementById("jobs-catalog");
      if (target) target.scrollIntoView({ behavior: "smooth" });
    }
  }, [currentPage, onNavigate]);

  // Handler Detail Lowongan
  const handleViewJobDetail = useCallback(
    (job: Job) => {
      setSelectedJob(job);
      onNavigate("JOB_DETAIL");
    },
    [setSelectedJob, onNavigate],
  );

  // Handler Navigasi Apply Job (Guard Auth & Role)
  const handleNavigateToApply = useCallback(
    (job: Job) => {
      setSelectedJob(job);

      if (!currentUser) {
        setRedirectAfterLogin("APPLY_JOB");
        onAddToast(
          "info",
          "Silakan Masuk Terlebih Dahulu",
          "Anda perlu login sebagai Pencari Kerja untuk mengajukan lamaran.",
        );
        onNavigate("LOGIN");
        return;
      }

      if (currentUser.role === "RECRUITER") {
        onAddToast(
          "error",
          "Akses Dibatasi",
          "Akun Perekrut (HR) tidak dapat mengajukan lamaran pekerjaan.",
        );
        return;
      }

      onNavigate("APPLY_JOB");
    },
    [currentUser, setSelectedJob, onNavigate, onAddToast, setRedirectAfterLogin],
  );

  // Handler Post Job oleh Recruiter
  const handleCreateJob = useCallback(
    async (jobData: Omit<Job, "id" | "createdAt">): Promise<boolean> => {
      try {
        const newJob = await createJob(jobData);
        onNavigate("JOB_DETAIL");
        onAddToast(
          "success",
          "Lowongan Berhasil Diterbitkan",
          `Posisi ${newJob.title} di ${newJob.company?.name || 'Perusahaan'} telah aktif.`,
        );
        return true;
      } catch (err: any) {
        const apiErr = parseApiError(err);
        onAddToast(
          "error",
          "Gagal Menerbitkan Lowongan",
          apiErr.message || "Terjadi kesalahan saat mempublikasikan lowongan ke backend.",
        );
        return false;
      }
    },
    [createJob, onNavigate, onAddToast],
  );

  // Handler Submit Lamaran Kerja
  const handleSubmitApplication = useCallback(
    async (appData: Omit<Application, "id" | "createdAt" | "logs">): Promise<boolean> => {
      try {
        const success = await submitApplication(appData);
        if (!success) {
          onAddToast(
            "error",
            "Pengajuan Ditolak",
            "Anda sudah pernah mengajukan lamaran untuk posisi ini sebelumnya.",
          );
          return false;
        }

        onAddToast(
          "success",
          "Lamaran Berhasil Terkirim",
          `Lamaran untuk ${appData.job.title} di ${appData.job.company.name} berhasil dikirim.`,
        );
        onNavigate("TRACKER");
        return true;
      } catch (err: any) {
        const apiErr = parseApiError(err);
        onAddToast(
          "error",
          "Gagal Mengirimkan Lamaran",
          apiErr.message || "Terjadi kesalahan saat mengirimkan lamaran.",
        );
        return false;
      }
    },
    [submitApplication, onAddToast, onNavigate],
  );

  // Handler Update Status Seleksi Pelamar ATS
  const handleUpdateApplicationStatus = useCallback(
    async (
      applicationId: string,
      newStatus: ApplicationStatus,
      recruiterNotes?: string,
    ): Promise<boolean> => {
      try {
        await updateApplicationStatus(applicationId, newStatus, recruiterNotes);
        onAddToast(
          "success",
          "Status Pelamar Diperbarui",
          `Tahapan seleksi kandidat berhasil diubah ke ${newStatus}.`,
        );
        return true;
      } catch (err: any) {
        const apiErr = parseApiError(err);
        onAddToast(
          "error",
          "Gagal Memperbarui Status",
          apiErr.message || "Terjadi kesalahan saat memperbarui status lamaran.",
        );
        return false;
      }
    },
    [updateApplicationStatus, onAddToast],
  );

  // Page Switcher Renderer
  switch (currentPage) {
    case "LOGIN":
      return (
        <LoginPage
          onLoginSuccess={onLoginSuccess}
          onNavigateToRegister={() => onNavigate("REGISTER")}
          onNavigateToHome={() => onNavigate("LANDING")}
        />
      );

    case "REGISTER":
      return (
        <RegisterPage
          onRegisterSuccess={onRegisterSuccess}
          onNavigateToLogin={() => onNavigate("LOGIN")}
          onNavigateToHome={() => onNavigate("LANDING")}
        />
      );

    case "TRACKER":
      return (
        <ApplicationTrackerPage
          applications={applications}
          isLoading={isApplicationsLoading}
          onNavigateToHome={() => onNavigate("LANDING")}
          onNavigateToJobs={scrollToJobs}
          onViewJobDetail={handleViewJobDetail}
        />
      );

    case "JOB_DETAIL":
      return (
        <JobDetailPage
          job={selectedJob}
          hasApplied={
            selectedJob
              ? hasUserApplied(
                  selectedJob.id,
                  currentUser ? currentUser.email : "pelamar@yukkerja.id",
                )
              : false
          }
          onNavigateBack={() => onNavigate("LANDING")}
          onNavigateToApply={handleNavigateToApply}
        />
      );

    case "APPLY_JOB":
      return (
        <ApplyJobPage
          job={selectedJob}
          currentUser={currentUser}
          onNavigateBack={() => {
            if (selectedJob) onNavigate("JOB_DETAIL");
            else onNavigate("LANDING");
          }}
          onSubmitApplication={handleSubmitApplication}
        />
      );

    case "POST_JOB":
      return (
        <PostJobPage
          currentUser={currentUser}
          onNavigateBack={() => onNavigate("LANDING")}
          onSubmitJob={handleCreateJob}
        />
      );

    case "RECRUITER_APPLICANTS":
      return (
        <RecruiterApplicantsPage
          jobs={jobs}
          applications={applications}
          onNavigateBack={() => onNavigate("LANDING")}
          onNavigateToPostJob={() => onNavigate("POST_JOB")}
          onUpdateApplicationStatus={handleUpdateApplicationStatus}
        />
      );

    case "LANDING":
    default:
      return (
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
              currentUser ? currentUser.email : "pelamar@yukkerja.id",
            )
          }
          onScrollToJobs={scrollToJobs}
        />
      );
  }
});

AppRouter.displayName = "AppRouter";
