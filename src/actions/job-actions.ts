"use server";

import { db } from "@/db"; // wherever your drizzle client file is
import { jobsTable } from "@/db/schema/jobs";
import { revalidatePath } from "next/cache";

export async function createJobAction(formData: FormData) {
  // Extract data from the form fields
  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const salary = formData.get("salary") as string;
  const location = formData.get("location") as string;
  const experience = formData.get("experience") as string;
  const companyBenefits = formData.get("companyBenefits") as string;
  const department = formData.get("department") as string;
  const employmentType = formData.get("employmentType") as string;
  const maxSalary = formData.get("maxSalary") as string;
  const minSalary = formData.get("minSalary") as string;
  const mustHaveSkills = formData.get("mustHaveSkills") as string;
  const niceToHaveSkills = formData.get("niceToHaveSkills") as string;

  console.log("Submitted Server: ");
  console.log({
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
  });

  try {
    // Insert into database using Drizzle
    await db.insert(jobsTable).values({
      title,
      description,
      location,
      experience,
      department,
      employmentType,
      companyBenefits: companyBenefits ? JSON.parse(companyBenefits) : [],
      minSalary: minSalary ? Number.parseInt(minSalary, 10) : null,
      maxSalary: maxSalary ? Number.parseInt(maxSalary, 10) : null,
      mustHaveSkills: mustHaveSkills ? JSON.parse(mustHaveSkills) : [],
      niceToHaveSkills: niceToHaveSkills ? JSON.parse(niceToHaveSkills) : [],
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
