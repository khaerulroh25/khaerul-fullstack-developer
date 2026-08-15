import { useState, useEffect, useCallback } from 'react';
import type { Application, ApplicationStatus, AuthUser } from '../types/index.js';
import { applicationService, type SubmitApplicationPayload } from '../services/application.service.js';

/**
 * Custom hook untuk mengelola berkas lamaran kerja pelamar dan status seleksi ATS via backend API
 */
export const useApplications = (currentUser?: AuthUser | null) => {
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  // Memuat data lamaran live dari backend saat user terotentikasi
  const fetchApplications = useCallback(async () => {
    if (!currentUser) {
      setApplications([]);
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    try {
      const liveApps = await applicationService.getApplications();
      if (liveApps) {
        setApplications(liveApps);
      }
    } catch (err) {
      console.warn('Gagal memuat lamaran dari API backend:', err);
    } finally {
      setIsLoading(false);
    }
  }, [currentUser]);

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

  // Memeriksa apakah email pelamar sudah pernah melamar lowongan spesifik
  const hasUserApplied = useCallback(
    (jobId: string, userEmail?: string) => {
      const targetEmail = userEmail || currentUser?.email;
      if (!targetEmail) return false;
      return applications.some(
        (app) => app.jobId === jobId && app.applicantEmail?.toLowerCase() === targetEmail.toLowerCase()
      );
    },
    [applications, currentUser]
  );

  // Mengajukan lamaran baru langsung ke PostgreSQL via backend
  const submitApplication = useCallback(
    async (appData: Omit<Application, 'id' | 'createdAt' | 'logs'>): Promise<boolean> => {
      try {
        const payload: SubmitApplicationPayload = {
          jobId: appData.jobId,
          applicantName: appData.applicantName,
          applicantEmail: appData.applicantEmail,
          applicantPhone: appData.applicantPhone,
          linkedinUrl: appData.linkedinUrl,
          portfolioUrl: appData.portfolioUrl,
          resumeUrl: appData.resumeUrl,
          coverLetter: appData.coverLetter,
          expectedSalary: appData.expectedSalary,
          noticePeriod: appData.noticePeriod,
        };

        const newApp = await applicationService.submitApplication(payload);
        setApplications((prev) => [newApp, ...prev]);
        return true;
      } catch (err) {
        console.error('Gagal mengajukan lamaran ke backend:', err);
        return false;
      }
    },
    []
  );

  // Memperbarui tahapan status seleksi pelamar oleh recruiter via backend API
  const updateApplicationStatus = useCallback(
    async (applicationId: string, newStatus: ApplicationStatus, recruiterNotes?: string) => {
      try {
        const updated = await applicationService.updateStatus(applicationId, {
          status: newStatus,
          comment: recruiterNotes,
        });

        setApplications((prev) =>
          prev.map((app) => (app.id === applicationId ? updated : app))
        );
      } catch (err) {
        console.error('Gagal memperbarui status lamaran di backend:', err);
      }
    },
    []
  );

  return {
    applications,
    isLoading,
    hasUserApplied,
    submitApplication,
    updateApplicationStatus,
    refetchApplications: fetchApplications,
  };
};
