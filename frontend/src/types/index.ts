export type UserRole = 'JOB_SEEKER' | 'RECRUITER' | 'ADMIN';

export type JobType = 'FULL_TIME' | 'PART_TIME' | 'CONTRACT' | 'INTERNSHIP' | 'REMOTE' | 'HYBRID';

export type ExperienceLevel = 'ENTRY_LEVEL' | 'JUNIOR' | 'MID_LEVEL' | 'SENIOR' | 'LEAD';

export type JobStatus = 'ACTIVE' | 'CLOSED' | 'DRAFT';

export type ApplicationStatus = 'Applied' | 'Reviewing' | 'Shortlisted' | 'Rejected' | 'Accepted';

export interface AuthUser {
  id: string;
  email: string;
  fullName: string;
  role: UserRole;
  phone?: string;
  avatarUrl?: string;
  title?: string;
  bio?: string;
  location?: string;
  expectedSalary?: number;
  resumeUrl?: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  githubUrl?: string;
  skills?: string[];
  openToWork?: boolean;
}

export interface Company {
  id: string;
  name: string;
  industry: string;
  location: string;
  logoUrl: string;
  website: string;
  description: string;
  rating?: number;
  openJobsCount?: number;
}

export interface Job {
  id: string;
  companyId: string;
  company: Company;
  title: string;
  category: string;
  jobType: JobType;
  experienceLevel: ExperienceLevel;
  location: string;
  salaryMin?: number;
  salaryMax?: number;
  isSalaryDisclosed: boolean;
  description: string;
  requirements: string[];
  benefits: string[];
  status: JobStatus;
  deadline?: string;
  createdAt: string;
  isFeatured?: boolean;
}

export interface ApplicationLog {
  id: string;
  applicationId: string;
  previousStatus: ApplicationStatus;
  newStatus: ApplicationStatus;
  changedBy: string;
  comment?: string;
  timestamp: string;
}

export interface Application {
  id: string;
  jobId: string;
  job: Job;
  userId?: string;
  applicantName: string;
  applicantEmail: string;
  applicantPhone: string;
  linkedinUrl?: string;
  portfolioUrl?: string;
  resumeUrl: string;
  coverLetter?: string;
  expectedSalary?: number;
  noticePeriod?: string;
  status: ApplicationStatus;
  recruiterNotes?: string;
  createdAt: string;
  logs: ApplicationLog[];
}

export interface JobFilterState {
  search: string;
  category: string;
  jobType: string;
  experienceLevel: string;
  location: string;
  minSalary?: number;
  isRemoteOnly?: boolean;
}

export interface ToastNotification {
  id: string;
  type: 'success' | 'error' | 'info' | 'warning';
  title: string;
  message: string;
}
