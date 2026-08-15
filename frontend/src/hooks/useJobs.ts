import { useState, useEffect, useCallback } from 'react';
import type { Job } from '../types/index.js';
import { DUMMY_JOBS } from '../data/dummyData.js';

const STORAGE_KEY = 'indokerja_jobs';

/**
 * Custom hook untuk mengelola koleksi lowongan kerja dan status job yang dipilih
 */
export const useJobs = () => {
  const [jobs, setJobs] = useState<Job[]>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved ? JSON.parse(saved) : DUMMY_JOBS;
    } catch {
      return DUMMY_JOBS;
    }
  });

  const [selectedJob, setSelectedJob] = useState<Job | null>(null);

  // Sinkronisasi daftar lowongan ke localStorage
  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(jobs));
    } catch (e) {
      console.error('Gagal menyimpan lowongan ke localStorage:', e);
    }
  }, [jobs]);

  // Handler pembuatan lowongan baru oleh recruiter
  const createJob = useCallback((jobData: Omit<Job, 'id' | 'createdAt'>): Job => {
    const newJob: Job = {
      ...jobData,
      id: `job-${Date.now()}`,
      createdAt: new Date().toISOString(),
    };

    setJobs((prev) => [newJob, ...prev]);
    setSelectedJob(newJob);
    return newJob;
  }, []);

  return {
    jobs,
    selectedJob,
    setSelectedJob,
    createJob,
  };
};
