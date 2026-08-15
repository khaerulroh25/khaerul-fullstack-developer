import { useState, useCallback, useMemo } from 'react';
import type { Job, JobFilterState } from '../types/index.js';

const DEFAULT_FILTERS: JobFilterState = {
  search: '',
  category: '',
  jobType: '',
  experienceLevel: '',
  location: '',
  isRemoteOnly: false,
};

export interface DynamicCategory {
  name: string;
  count: number;
}

/**
 * Custom hook untuk mengelola state filter dan komputasi memoized lowongan kerja aktif
 */
export const useJobFilters = (jobs: Job[]) => {
  const [filters, setFilters] = useState<JobFilterState>(DEFAULT_FILTERS);

  // Memperbarui filter sebagian
  const handleFilterChange = useCallback((newFilters: Partial<JobFilterState>) => {
    setFilters((prev) => ({ ...prev, ...newFilters }));
  }, []);

  // Mengembalikan filter ke kondisi awal
  const handleResetFilters = useCallback(() => {
    setFilters(DEFAULT_FILTERS);
  }, []);

  // Pencarian cepat dari formulir Hero Section
  const handleHeroSearch = useCallback((keyword: string, location: string, category: string) => {
    setFilters((prev) => ({
      ...prev,
      search: keyword,
      location: location,
      category: category,
    }));

    const target = document.getElementById('jobs-catalog');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Toggle filter kategori dari CategorySection
  const handleSelectCategory = useCallback((catName: string) => {
    setFilters((prev) => ({
      ...prev,
      category: prev.category === catName ? '' : catName,
    }));
    const target = document.getElementById('jobs-catalog');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Filter berdasarkan nama perusahaan dari CompanySpotlight
  const handleSelectCompany = useCallback((companyName: string) => {
    setFilters((prev) => ({
      ...prev,
      search: companyName,
    }));
    const target = document.getElementById('jobs-catalog');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  }, []);

  // Ekstraksi kategori 100% dinamis dan jumlah lowongan aktif secara real-time dari database
  const availableCategories: DynamicCategory[] = useMemo(() => {
    const countsMap = new Map<string, number>();
    jobs.forEach((job) => {
      if (job.category && (job.status === 'ACTIVE' || !job.status)) {
        const trimmed = job.category.trim();
        countsMap.set(trimmed, (countsMap.get(trimmed) || 0) + 1);
      }
    });
    return Array.from(countsMap.entries()).map(([name, count]) => ({
      name,
      count,
    }));
  }, [jobs]);

  // Evaluasi subset lowongan kerja terfilter berbasis useMemo
  const filteredJobs = useMemo(() => {
    return jobs.filter((job) => {
      if (job.status && job.status !== 'ACTIVE') return false;

      if (filters.search) {
        const q = filters.search.toLowerCase();
        const matchTitle = job.title.toLowerCase().includes(q);
        const matchCompany = job.company?.name?.toLowerCase().includes(q);
        const matchDesc = job.description.toLowerCase().includes(q);
        if (!matchTitle && !matchCompany && !matchDesc) return false;
      }

      if (filters.category && job.category !== filters.category) {
        return false;
      }

      if (filters.jobType && job.jobType !== filters.jobType) {
        return false;
      }

      if (filters.experienceLevel && job.experienceLevel !== filters.experienceLevel) {
        return false;
      }

      if (filters.location && !job.location.toLowerCase().includes(filters.location.toLowerCase())) {
        return false;
      }

      if (filters.isRemoteOnly && job.jobType !== 'REMOTE') {
        return false;
      }

      return true;
    });
  }, [jobs, filters]);

  return {
    filters,
    filteredJobs,
    availableCategories,
    handleFilterChange,
    handleResetFilters,
    handleHeroSearch,
    handleSelectCategory,
    handleSelectCompany,
  };
};
