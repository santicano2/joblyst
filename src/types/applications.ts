/**
 * Tipos relacionados con postulaciones laborales
 */

export type JobType = "full-time" | "part-time" | "contract" | "freelance";
export type ApplicationStatus = "applied" | "interview" | "rejected" | "offer";
export type JobSource =
  | "LinkedIn"
  | "Indeed"
  | "Glassdoor"
  | "Email"
  | "Referral"
  | "Otro";
export type SalaryCurrency = "USD" | "ARS" | "EUR";

export interface Application {
  $id: string;
  userId: string;
  jobTitle: string;
  company: string;
  location: string;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: SalaryCurrency;
  status: ApplicationStatus;
  dateApplied: string;
  responseReceived: boolean;
  interviewDate?: string;
  source: JobSource;
  notes?: string;
  tags: string[];
  link?: string;
  $createdAt: string;
  $updatedAt: string;
}

export interface CreateApplicationInput {
  jobTitle: string;
  company: string;
  location: string;
  jobType: JobType;
  salaryMin?: number;
  salaryMax?: number;
  salaryCurrency?: SalaryCurrency;
  status: ApplicationStatus;
  dateApplied: string;
  responseReceived?: boolean;
  interviewDate?: string;
  source: JobSource;
  notes?: string;
  tags?: string[];
  link?: string;
}

export interface UpdateApplicationInput
  extends Partial<CreateApplicationInput> {
  $id: string;
}
