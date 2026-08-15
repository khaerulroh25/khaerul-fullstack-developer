import { useState, useEffect, useCallback } from 'react';
import type { Application, ApplicationStatus } from '../types/index.js';
import { DUMMY_APPLICATIONS } from '../data/dummyData.js';

const STORAGE_KEY = 'indokerja_applications';

/**
 * Custom hook untuk mengelola berkas lamaran kerja pelamar dan status seleksi ATS
 */
export const useApplications = () => {
  const [applications, setApplications] = useState<Application[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DUMMY_APPLICATIONS;
    } catch {
      return DUMMY_APPLICATIONS;
    }
  });

  // Sinkronisasi daftar lamaran ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(applications));
    } catch (e) {
      console.error('Gagal menyimpan berkas lamaran ke localStorage:', e);
    }
  }, [applications]);

  // Memeriksa apakah email pelamar sudah pernah melamar lowongan spesifik
  const hasUserApplied = useCallback(
    (jobId: string, userEmail: string = 'pelamar@indokerja.id') => {
      return applications.some(
        (app) => app.jobId === jobId && app.applicantEmail.toLowerCase() === userEmail.toLowerCase()
      );
    },
    [applications]
  );

  // Mengajukan lamaran baru dengan validasi duplikasi
  const submitApplication = useCallback(
    (appData: Omit<Application, 'id' | 'createdAt' | 'logs'>): boolean => {
      const isDuplicate = applications.some(
        (app) =>
          app.jobId === appData.jobId &&
          app.applicantEmail.toLowerCase() === appData.applicantEmail.toLowerCase()
      );

      if (isDuplicate) {
        return false;
      }

      const newApplication: Application = {
        ...appData,
        id: `app-${Date.now()}`,
        status: 'Applied',
        createdAt: new Date().toISOString(),
        logs: [
          {
            id: `log-${Date.now()}`,
            applicationId: `app-${Date.now()}`,
            previousStatus: 'Applied',
            newStatus: 'Applied',
            changedBy: 'SYSTEM',
            comment: 'Berkas lamaran diterima oleh sistem IndoKerja.id',
            timestamp: new Date().toISOString(),
          },
        ],
      };

      setApplications((prev) => [newApplication, ...prev]);
      return true;
    },
    [applications]
  );

  // Memperbarui tahapan status seleksi pelamar oleh recruiter
  const updateApplicationStatus = useCallback(
    (applicationId: string, newStatus: ApplicationStatus, recruiterNotes?: string) => {
      setApplications((prev) =>
        prev.map((app) => {
          if (app.id === applicationId) {
            const newLog = {
              id: `log-${Date.now()}`,
              applicationId: app.id,
              previousStatus: app.status,
              newStatus,
              changedBy: 'RECRUITER' as const,
              comment: recruiterNotes || `Status diubah ke ${newStatus}`,
              timestamp: new Date().toISOString(),
            };

            return {
              ...app,
              status: newStatus,
              recruiterNotes: recruiterNotes || app.recruiterNotes,
              logs: [newLog, ...app.logs],
            };
          }
          return app;
        })
      );
    },
    []
  );

  return {
    applications,
    hasUserApplied,
    submitApplication,
    updateApplicationStatus,
  };
};
