"use server";

import { db } from "@/db";
import { user } from "@/db/schema/auth";
import { jobsTable } from "@/db/schema/jobs";
import { jobApplicationsTable } from "@/db/schema/applications";
import { savedJobsTable } from "@/db/schema/saved-jobs";
import { candidateProfilesTable } from "@/db/schema/candidates";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, desc, eq, ilike, gte, lte, or, sql } from "drizzle-orm";
import { calculateMatchScore } from "@/lib/match-score";

function parseArrayOfStrings(input?: string | null): string[] {
  if (!input) return [];
  try {
    const parsed = JSON.parse(input);
    if (Array.isArray(parsed)) {
      return parsed
        .filter((item) => typeof item === "string" || item?.checked !== false)
        .map((item) => (typeof item === "string" ? item : item?.label || item?.id || String(item)))
        .filter(Boolean);
    }
    if (typeof parsed === "string") return [parsed];
  } catch {
    return input.split(",").map((s) => s.trim()).filter(Boolean);
  }
  return [];
}

export interface JobFilterOptions {
  search?: string;
  location?: string;
  employmentType?: string;
  isRemote?: boolean;
  minSalary?: number;
  maxSalary?: number;
  sortBy?: "newest" | "match";
}

export async function createJobAction(formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, message: "Unauthorized. Please login to post a job." };
    }

    const title = (formData.get("title") as string)?.trim();
    const rawDesc = (formData.get("description") as string)?.trim();
    const description = rawDesc || "No detailed description provided.";
    const location = (formData.get("location") as string)?.trim() || "Remote";
    const experience = (formData.get("experience") as string) || "Not specified";
    const department = (formData.get("department") as string) || "General";
    const employmentType = (formData.get("employmentType") as string) || "FULL_TIME";
    const maxSalary = formData.get("maxSalary") as string;
    const minSalary = formData.get("minSalary") as string;
    const companyBenefits = formData.get("companyBenefits") as string;
    const mustHaveSkills = formData.get("mustHaveSkills") as string;
    const niceToHaveSkills = formData.get("niceToHaveSkills") as string;
    const companyName = (formData.get("companyName") as string)?.trim() || session?.user?.name || "TalentStream";

    if (!title) {
      return { success: false, message: "Job title is required." };
    }

    let employerId: string | null = null;
    if (session?.user?.id) {
      try {
        const [u] = await db
          .select({ id: user.id })
          .from(user)
          .where(eq(user.id, session.user.id))
          .limit(1);
        if (u) {
          employerId = u.id;
        }
      } catch (err) {
        console.warn("Could not verify employer foreign key:", err);
      }
    }

    const minNum = minSalary ? Number.parseInt(minSalary, 10) : null;
    const maxNum = maxSalary ? Number.parseInt(maxSalary, 10) : null;

    const [newJob] = await db.insert(jobsTable).values({
      employerId: employerId ?? undefined,
      companyName,
      title,
      description,
      location,
      experience,
      department,
      employmentType,
      companyBenefits: parseArrayOfStrings(companyBenefits),
      minSalary: minNum && !isNaN(minNum) ? minNum : null,
      maxSalary: maxNum && !isNaN(maxNum) ? maxNum : null,
      mustHaveSkills: parseArrayOfStrings(mustHaveSkills),
      niceToHaveSkills: parseArrayOfStrings(niceToHaveSkills),
      status: "active",
    }).returning();

    revalidatePath("/hr/job");
    revalidatePath("/");
    return { success: true, message: "Job created successfully!", jobId: newJob?.id };
  } catch (error) {
    console.error("Failed to create job:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Database error. Failed to create job.",
    };
  }
}

export async function updateJobAction(id: string, formData: FormData) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    if (!session?.user) {
      return { success: false, message: "Unauthorized. Please login to post a job." };
    }

    const title = (formData.get("title") as string)?.trim();
    const rawDesc = (formData.get("description") as string)?.trim();
    const description = rawDesc || "No detailed description provided.";
    const location = (formData.get("location") as string)?.trim() || "Remote";
    const experience = (formData.get("experience") as string) || "Not specified";
    const companyName = (formData.get("companyName") as string)?.trim();
    const companyBenefits = formData.get("companyBenefits") as string;
    const department = (formData.get("department") as string) || "General";
    const employmentType = (formData.get("employmentType") as string) || "FULL_TIME";
    const maxSalary = formData.get("maxSalary") as string;
    const minSalary = formData.get("minSalary") as string;
    const mustHaveSkills = formData.get("mustHaveSkills") as string;
    const niceToHaveSkills = formData.get("niceToHaveSkills") as string;
    const status = (formData.get("status") as string) || "active";

    if (!title) {
      return { success: false, message: "Job title is required." };
    }

    const minNum = minSalary ? Number.parseInt(minSalary, 10) : null;
    const maxNum = maxSalary ? Number.parseInt(maxSalary, 10) : null;

    await db
      .update(jobsTable)
      .set({
        title,
        description,
        location,
        experience,
        department,
        employmentType,
        status,
        ...(companyName && { companyName }),
        ...(companyBenefits !== null && {
          companyBenefits: parseArrayOfStrings(companyBenefits),
        }),
        minSalary: minNum && !isNaN(minNum) ? minNum : null,
        maxSalary: maxNum && !isNaN(maxNum) ? maxNum : null,
        mustHaveSkills: parseArrayOfStrings(mustHaveSkills),
        niceToHaveSkills: parseArrayOfStrings(niceToHaveSkills),
      })
      .where(eq(jobsTable.id, id));

    revalidatePath("/hr/job");
    revalidatePath(`/job/${id}`);
    revalidatePath("/");
    return { success: true, message: "Job updated successfully!" };
  } catch (error) {
    console.error("Failed to update job:", error);
    return {
      success: false,
      message: error instanceof Error ? error.message : "Failed to update job.",
    };
  }
}

export async function getJobsAction(filters: JobFilterOptions = {}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    let candidateSkills: string[] = [];
    if (session?.user?.id) {
      try {
        const [profile] = await db
          .select()
          .from(candidateProfilesTable)
          .where(eq(candidateProfilesTable.userId, session.user.id))
          .limit(1);
        if (profile?.skills) {
          candidateSkills = profile.skills;
        }
      } catch (err) {
        console.warn("Could not load candidate profile skills:", err);
      }
    }

    const conditions = [eq(jobsTable.status, "active")];

    if (filters.search) {
      const term = `%${filters.search}%`;
      conditions.push(
        or(
          ilike(jobsTable.title, term),
          ilike(jobsTable.department, term),
          ilike(jobsTable.description, term)
        )!
      );
    }

    if (filters.location) {
      conditions.push(ilike(jobsTable.location, `%${filters.location}%`));
    }

    if (filters.isRemote) {
      conditions.push(ilike(jobsTable.location, "%remote%"));
    }

    if (filters.employmentType) {
      conditions.push(eq(jobsTable.employmentType, filters.employmentType));
    }

    if (filters.minSalary) {
      conditions.push(gte(jobsTable.maxSalary, filters.minSalary));
    }

    if (filters.maxSalary) {
      conditions.push(lte(jobsTable.minSalary, filters.maxSalary));
    }

    const jobs = await db
      .select()
      .from(jobsTable)
      .where(and(...conditions))
      .orderBy(desc(jobsTable.createdAt));

    // Calculate match scores
    const isCandidate = session?.user?.role === "candidate";
    const jobsWithScores = jobs.map((job) => {
      const match = isCandidate
        ? calculateMatchScore(
            candidateSkills,
            job.mustHaveSkills ?? [],
            job.niceToHaveSkills ?? []
          )
        : null;
      return {
        ...job,
        matchScore: match?.score,
        matchLabel: match?.label,
      };
    });

    if (filters.sortBy === "match") {
      jobsWithScores.sort((a, b) => (b.matchScore ?? 0) - (a.matchScore ?? 0));
    }

    let appliedJobIds = new Set<string>();
    let savedJobIds = new Set<string>();
    if (session?.user?.id) {
      const [applications, savedJobs] = await Promise.all([
        db
          .select({ jobId: jobApplicationsTable.jobId })
          .from(jobApplicationsTable)
          .where(eq(jobApplicationsTable.candidateId, session.user.id)),
        db
          .select({ jobId: savedJobsTable.jobId })
          .from(savedJobsTable)
          .where(eq(savedJobsTable.userId, session.user.id)),
      ]);
      appliedJobIds = new Set(applications.map((a) => a.jobId));
      savedJobIds = new Set(savedJobs.map((s) => s.jobId));
    }

    return {
      success: true,
      jobs: jobsWithScores.map((job) => ({
        ...job,
        hasApplied: appliedJobIds.has(job.id),
        isSaved: savedJobIds.has(job.id),
      })),
    };
  } catch (error) {
    console.error("Failed to get jobs:", error);
    return { success: false, jobs: [] };
  }
}

export async function getJobByIdAction(id: string) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    const [job] = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.id, id))
      .limit(1);

    if (!job) {
      return { success: false, job: null, message: "Job not found" };
    }

    let hasApplied = false;
    let isSaved = false;
    let candidateSkills: string[] = [];

    if (session?.user?.id) {
      const [application] = await db
        .select()
        .from(jobApplicationsTable)
        .where(
          and(
            eq(jobApplicationsTable.jobId, id),
            eq(jobApplicationsTable.candidateId, session.user.id)
          )
        )
        .limit(1);
      hasApplied = !!application;

      const [saved] = await db
        .select()
        .from(savedJobsTable)
        .where(
          and(
            eq(savedJobsTable.jobId, id),
            eq(savedJobsTable.userId, session.user.id)
          )
        )
        .limit(1);
      isSaved = !!saved;

      const [profile] = await db
        .select()
        .from(candidateProfilesTable)
        .where(eq(candidateProfilesTable.userId, session.user.id))
        .limit(1);
      if (profile?.skills) {
        candidateSkills = profile.skills;
      }
    }

    const matchAnalysis = calculateMatchScore(
      candidateSkills,
      job.mustHaveSkills ?? [],
      job.niceToHaveSkills ?? []
    );

    return {
      success: true,
      job,
      hasApplied,
      isSaved,
      matchAnalysis,
      isOwner: session?.user?.id === job.employerId,
      viewerRole: (session?.user as { role?: string } | undefined)?.role ?? null,
    };
  } catch (error) {
    console.error("Failed to fetch job:", error);
    return { success: false, job: null, message: "Failed to fetch job" };
  }
}

export async function updateJobStatusAction(
  jobId: string,
  newStatus: "active" | "draft" | "closed" | "stopped"
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await db
      .update(jobsTable)
      .set({ status: newStatus })
      .where(eq(jobsTable.id, jobId));

    revalidatePath("/hr/job");
    revalidatePath(`/job/${jobId}`);
    return { success: true, message: `Job marked as ${newStatus}` };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, message: "Failed to update job status" };
  }
}

export async function deleteJobAction(jobId: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await db.delete(jobsTable).where(eq(jobsTable.id, jobId));
    revalidatePath("/hr/job");
    revalidatePath("/");
    return { success: true, message: "Job deleted successfully" };
  } catch (error) {
    console.error("Failed to delete job:", error);
    return { success: false, message: "Failed to delete job" };
  }
}

export async function getEmployerJobsAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "employer") {
    return { success: false, jobs: [] };
  }

  try {
    // Select employer's jobs with count of applications
    const jobs = await db
      .select({
        id: jobsTable.id,
        title: jobsTable.title,
        status: jobsTable.status,
        department: jobsTable.department,
        location: jobsTable.location,
        createdAt: jobsTable.createdAt,
        applicantsCount: sql<number>`cast(count(${jobApplicationsTable.id}) as integer)`,
      })
      .from(jobsTable)
      .leftJoin(
        jobApplicationsTable,
        eq(jobsTable.id, jobApplicationsTable.jobId)
      )
      .where(eq(jobsTable.employerId, session.user.id))
      .groupBy(jobsTable.id)
      .orderBy(desc(jobsTable.createdAt));

    return { success: true, jobs };
  } catch (error) {
    console.error("Failed to get employer jobs:", error);
    return { success: false, jobs: [] };
  }
}
