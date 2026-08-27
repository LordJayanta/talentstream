"use server";

import { db } from "@/db"; // wherever your drizzle client file is
import { jobsTable } from "@/db/schema/jobs";
import { auth } from "@/lib/auth";
import { JobForm, jobFormSchema } from "@/lib/validations/job";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";

export async function createJobAction(value:JobForm) {
  const data = jobFormSchema.parse(value);
  const session = await auth.api.getSession({ headers: await headers() });

  if (!session) {
    return { success: false, message: "You must be logged in to create a job." };
  }

  const {
    title,
    minSalary,
    maxSalary,
    department,
    employmentType,
    experience,
    location,
    description,
    mustHaveSkills,
    niceToHaveSkills,
    companyBenefits,
  } = data;


  try {
    // Insert into database using Drizzle
    await db.insert(jobsTable).values({
      title,
      recruiterId: session?.user.id as string,
      description,
      location,
      experience,
      department,
      employmentType,
      companyBenefits: companyBenefits.map((benefit) => benefit.label),
      minSalary: minSalary ? Number.parseInt(minSalary, 10) : null,
      maxSalary: maxSalary ? Number.parseInt(maxSalary, 10) : null,
      mustHaveSkills,
      niceToHaveSkills,
      status: "active",
    });

    // Refresh the jobs page so the new job appears instantly
    revalidatePath("/hr/job");
    return { success: true, message: "Job created successfully!" };
  } catch (error) {
    console.error("Failed to create job:", error);
    return { success: false, message: "Database error. Failed to create job." };
  }
}
