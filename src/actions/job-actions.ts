"use server";

import { db } from "@/db";
import { jobsTable } from "@/db/schema/jobs";
import { jobApplicationsTable } from "@/db/schema/applications";
import { savedJobsTable } from "@/db/schema/saved-jobs";
import { candidateProfilesTable } from "@/db/schema/candidates";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, desc, eq, ilike, gte, lte, or, sql } from "drizzle-orm";
import { calculateMatchScore } from "@/lib/match-score";

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
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized. Please login to post a job." };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const experience = formData.get("experience") as string;
  const companyBenefits = formData.get("companyBenefits") as string;
  const department = formData.get("department") as string;
  const employmentType = formData.get("employmentType") as string;
  const maxSalary = formData.get("maxSalary") as string;
  const minSalary = formData.get("minSalary") as string;
  const mustHaveSkills = formData.get("mustHaveSkills") as string;
  const niceToHaveSkills = formData.get("niceToHaveSkills") as string;
  const companyName = (formData.get("companyName") as string)?.trim() || session.user.name || "TalentStream";

  if (!title || !description) {
    return { success: false, message: "Title and description are required." };
  }

  try {
    const [newJob] = await db.insert(jobsTable).values({
      employerId: session.user.id,
      companyName,
      title,
      description,
      location: location || "Remote",
      experience,
      department,
      employmentType,
      companyBenefits: companyBenefits ? JSON.parse(companyBenefits) : [],
      minSalary: minSalary ? Number.parseInt(minSalary, 10) : null,
      maxSalary: maxSalary ? Number.parseInt(maxSalary, 10) : null,
      mustHaveSkills: mustHaveSkills ? JSON.parse(mustHaveSkills) : [],
      niceToHaveSkills: niceToHaveSkills ? JSON.parse(niceToHaveSkills) : [],
      status: "active",
    }).returning();

    revalidatePath("/hr/job");
    revalidatePath("/");
    return { success: true, message: "Job created successfully!", jobId: newJob?.id };
  } catch (error) {
    console.error("Failed to create job:", error);
    return { success: false, message: "Database error. Failed to create job." };
  }
}

export async function updateJobAction(id: string, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user) {
    return { success: false, message: "Unauthorized." };
  }

  const title = (formData.get("title") as string)?.trim();
  const description = (formData.get("description") as string)?.trim();
  const location = (formData.get("location") as string)?.trim();
  const experience = formData.get("experience") as string;
  const companyBenefits = formData.get("companyBenefits") as string;
  const department = formData.get("department") as string;
  const employmentType = formData.get("employmentType") as string;
  const maxSalary = formData.get("maxSalary") as string;
  const minSalary = formData.get("minSalary") as string;
  const mustHaveSkills = formData.get("mustHaveSkills") as string;
  const niceToHaveSkills = formData.get("niceToHaveSkills") as string;
  const status = (formData.get("status") as string) || "active";

  try {
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
        companyBenefits: companyBenefits ? JSON.parse(companyBenefits) : [],
        minSalary: minSalary ? Number.parseInt(minSalary, 10) : null,
        maxSalary: maxSalary ? Number.parseInt(maxSalary, 10) : null,
        mustHaveSkills: mustHaveSkills ? JSON.parse(mustHaveSkills) : [],
        niceToHaveSkills: niceToHaveSkills ? JSON.parse(niceToHaveSkills) : [],
      })
      .where(eq(jobsTable.id, id));

    revalidatePath("/hr/job");
    revalidatePath(`/job/${id}`);
    revalidatePath("/");
    return { success: true, message: "Job updated successfully!" };
  } catch (error) {
    console.error("Failed to update job:", error);
    return { success: false, message: "Failed to update job." };
  }
}

export async function getJobsAction(filters: JobFilterOptions = {}) {
  try {
    const session = await auth.api.getSession({
      headers: await headers(),
    });

    let candidateSkills: string[] = [];
    if (session?.user?.id) {
      const [profile] = await db
        .select()
        .from(candidateProfilesTable)
        .where(eq(candidateProfilesTable.userId, session.user.id))
        .limit(1);
      if (profile?.skills) {
        candidateSkills = profile.skills;
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
    const jobsWithScores = jobs.map((job) => {
      const match = calculateMatchScore(
        candidateSkills,
        job.mustHaveSkills ?? [],
        job.niceToHaveSkills ?? []
      );
      return {
        ...job,
        matchScore: match.score,
        matchLabel: match.label,
      };
    });

    if (filters.sortBy === "match") {
      jobsWithScores.sort((a, b) => b.matchScore - a.matchScore);
    }

    return { success: true, jobs: jobsWithScores };
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
