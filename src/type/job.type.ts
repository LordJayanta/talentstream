// ==========================================
// Shared & Utility Types
// ==========================================

export type EmploymentType =
  | "Full-Time"
  | "Part-Time"
  | "Contract"
  | "Freelance"
  | "Internship";

export type WorkplaceType = "On-site" | "Hybrid" | "Remote";

export interface CurrencyAmount {
  min: number;
  max: number;
  currency: string; // e.g., "USD"
  period: "year" | "month" | "hour";
}

export interface Company {
  id: string;
  name: string;
  logoUrl?: string;
  location: string;
}

export interface HiringManager {
  id: string;
  name: string;
  title: string;
  avatarUrl?: string;
  email?: string;
}

// ==========================================
// Sub-components Schema
// ==========================================

export interface JobRequirements {
  mustHaves: string[];
  niceToHaves: string[];
}

export interface CompanyBenefit {
  id: string;
  title: string;
  description: string;
  iconName?: string; // e.g., "users", "graduation-cap", "heart"
}

export interface AIMatchSkill {
  id: string;
  skillName: string;
  score: number | null; // e.g., 98 for 98% or null if "Not Found"
  isMatched: boolean;
}

export interface AIMatchBreakdown {
  overallScore: number; // e.g., 98
  matchLabel: string; // e.g., "Exceptional Fit"
  summary: string; // e.g., "Based on your parsed resume profile."
  skills: AIMatchSkill[];
}

// ==========================================
// Core Job Post Models
// ==========================================

/**
 * Full Job Details Model (Used for the Job Details View)
 */
export interface JobDetails {
  id: string;
  title: string;
  company: Company;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  salary: CurrencyAmount;
  postedAt: string | Date; // ISO string or Date object
  isSaved?: boolean;
  hasApplied?: boolean;

  aboutRole: string; // Markdown or formatted text block
  responsibilities: string[];
  requirements: JobRequirements;
  cultureAndBenefits: CompanyBenefit[];

  hiringManager: HiringManager;
  aiMatchBreakdown?: AIMatchBreakdown; // Optional for candidate view, absent for recruiter view
}

/**
 * Payload required when creating a new job post
 */
export type CreateJobInput = Omit<
  JobDetails,
  "id" | "postedAt" | "isSaved" | "hasApplied" | "aiMatchBreakdown" | "company"
> & {
  companyId: string;
};

/**
 * Lightweight Job Summary Model (Used for Feed / Home Page / Search Cards)
 */
export interface JobListItem {
  id: string;
  title: string;
  companyName: string;
  companyLogoUrl?: string;
  location: string;
  employmentType: EmploymentType;
  workplaceType: WorkplaceType;
  salary: CurrencyAmount;
  postedAt: string | Date;
  isSaved?: boolean;
  aiMatchScore?: number; // Simplified score for quick cards
}
