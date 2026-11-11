"use server";

import { db } from "@/db";
import { jobApplicationsTable, ApplicationStatus } from "@/db/schema/applications";
import { jobsTable } from "@/db/schema/jobs";
import { auth } from "@/lib/auth";
import { headers } from "next/headers";
import { revalidatePath } from "next/cache";
import { and, desc, eq, sql } from "drizzle-orm";

export async function getEmployerApplicationsAction(jobId?: string) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "employer") {
    return { success: false, applications: [] };
  }

  try {
    const conditions = [eq(jobsTable.employerId, session.user.id)];
    if (jobId) {
      conditions.push(eq(jobApplicationsTable.jobId, jobId));
    }

    const applications = await db
      .select({
        id: jobApplicationsTable.id,
        jobId: jobApplicationsTable.jobId,
        jobTitle: jobsTable.title,
        candidateId: jobApplicationsTable.candidateId,
        applicantName: jobApplicationsTable.applicantName,
        applicantEmail: jobApplicationsTable.applicantEmail,
        resumeUrl: jobApplicationsTable.resumeUrl,
        coverLetter: jobApplicationsTable.coverLetter,
        status: jobApplicationsTable.status,
        matchScore: jobApplicationsTable.matchScore,
        appliedAt: jobApplicationsTable.appliedAt,
      })
      .from(jobApplicationsTable)
      .innerJoin(jobsTable, eq(jobApplicationsTable.jobId, jobsTable.id))
      .where(and(...conditions))
      .orderBy(desc(jobApplicationsTable.appliedAt));

    return { success: true, applications };
  } catch (error) {
    console.error("Failed to get employer applications:", error);
    return { success: false, applications: [] };
  }
}

export async function updateApplicationStatusAction(
  applicationId: string,
  newStatus: ApplicationStatus
) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "employer") {
    return { success: false, message: "Unauthorized." };
  }

  try {
    await db
      .update(jobApplicationsTable)
      .set({ status: newStatus })
      .where(eq(jobApplicationsTable.id, applicationId));

    revalidatePath("/hr/candidate");
    revalidatePath("/hr/dashboard");
    return { success: true, message: `Candidate status updated to ${newStatus}` };
  } catch (error) {
    console.error("Failed to update applicant status:", error);
    return { success: false, message: "Failed to update status." };
  }
}

export async function getHRDashboardMetricsAction() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session?.user || session.user.role !== "employer") {
    return {
      success: false,
      metrics: {
        activeJobs: 0,
        totalApplicants: 0,
        underReview: 0,
        shortlisted: 0,
      },
      recentApplications: [],
    };
  }

  try {
    // 1. Total & Active Jobs count
    const [jobsCount] = await db
      .select({
        active: sql<number>`cast(count(*) filter (where ${jobsTable.status} = 'active') as integer)`,
        total: sql<number>`cast(count(*) as integer)`,
      })
      .from(jobsTable)
      .where(eq(jobsTable.employerId, session.user.id));

    // 2. Applications counts by status
    const [appCounts] = await db
      .select({
        total: sql<number>`cast(count(${jobApplicationsTable.id}) as integer)`,
        reviewing: sql<number>`cast(count(${jobApplicationsTable.id}) filter (where ${jobApplicationsTable.status} = 'reviewing' or ${jobApplicationsTable.status} = 'pending') as integer)`,
        shortlisted: sql<number>`cast(count(${jobApplicationsTable.id}) filter (where ${jobApplicationsTable.status} = 'shortlisted') as integer)`,
      })
      .from(jobApplicationsTable)
      .innerJoin(jobsTable, eq(jobApplicationsTable.jobId, jobsTable.id))
      .where(eq(jobsTable.employerId, session.user.id));

    // 3. Recent 5 applications
    const recentApplications = await db
      .select({
        id: jobApplicationsTable.id,
        jobId: jobApplicationsTable.jobId,
        jobTitle: jobsTable.title,
        applicantName: jobApplicationsTable.applicantName,
        applicantEmail: jobApplicationsTable.applicantEmail,
        status: jobApplicationsTable.status,
        matchScore: jobApplicationsTable.matchScore,
        appliedAt: jobApplicationsTable.appliedAt,
      })
      .from(jobApplicationsTable)
      .innerJoin(jobsTable, eq(jobApplicationsTable.jobId, jobsTable.id))
      .where(eq(jobsTable.employerId, session.user.id))
      .orderBy(desc(jobApplicationsTable.appliedAt))
      .limit(5);

    return {
      success: true,
      metrics: {
        activeJobs: jobsCount?.active ?? 0,
        totalApplicants: appCounts?.total ?? 0,
        underReview: appCounts?.reviewing ?? 0,
        shortlisted: appCounts?.shortlisted ?? 0,
      },
      recentApplications,
    };
  } catch (error) {
    console.error("Failed to get HR dashboard metrics:", error);
    return {
      success: false,
      metrics: {
        activeJobs: 0,
        totalApplicants: 0,
        underReview: 0,
        shortlisted: 0,
      },
      recentApplications: [],
    };
  }
}
