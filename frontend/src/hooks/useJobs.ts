import { useState, useEffect, useCallback } from 'react';
import type { Job, JobFilterState } from '../types/index.js';
import { jobService } from '../services/job.service.js';

const STORAGE_KEY = 'indokerja_jobs';

/**
 * Custom hook untuk mengelola katalog lowongan kerja dari Backend API PostgreSQL
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  /**
   * Mengambil data lowongan live dari Backend Express API
   */
  const fetchJobs = useCallback(async (filters?: Partial<JobFilterState>) => {
    setIsLoading(true);
    setError(null);
    try {
      const result = await jobService.getJobs(filters, 1, 100);
      if (result.jobs) {
        setJobs(result.jobs);
        localStorage.setItem(STORAGE_KEY, JSON.stringify(result.jobs));
      }
    } catch (err) {
      console.warn('Gagal memuat lowongan dari API backend:', err);
      setError('Gagal memuat data dari server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Memuat data lowongan saat pertama kali aplikasi di-mount
  useEffect(() => {
    fetchJobs();
  }, [fetchJobs]);

  /**
   * Handler pembuatan lowongan baru oleh Recruiter terintegrasi API
   */
  const createJob = useCallback(async (jobData: Omit<Job, 'id' | 'createdAt'>): Promise<Job> => {
    const newJob = await jobService.createJob(jobData);
    setJobs((prev) => [newJob, ...prev]);
    setSelectedJob(newJob);
    return newJob;
  }, []);

  return {
    jobs,
    isLoading,
    error,
    selectedJob,
    setSelectedJob,
    createJob,
    refetchJobs: fetchJobs,
  };
};
