import { desc, eq } from "drizzle-orm";
import { db } from "@/db";
import { jobsTable, SelectJob } from "../schema";

export type JobListDataItem = Pick<SelectJob, "id" | "title" | "status" | "createdAt">

// Get all jobs for a specific recruiter
export async function getJobsByRecruiterId(recruiterId: string) {
  try {
    const data = await db
      .select()
      .from(jobsTable)
      .where(eq(jobsTable.recruiterId, recruiterId))
      .orderBy(desc(jobsTable.createdAt));

    const finalData:JobListDataItem[] = data.map((job) => ({
      id: job.id,
      title: job.title,
      status: job.status,
      createdAt: job.createdAt
    }))

    return finalData;
  } catch (error) {
    console.error("Error fetching recruiter jobs:", error);
    return [];
  }
}